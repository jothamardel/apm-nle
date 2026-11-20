/**
 * INEC Nigeria Geographic Hierarchy Seeder (37 States, 774 LGAs, ~8,809 Wards, ~176,846 Polling Units)
 *
 * Usage:
 *   1. Populate NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   2. Optionally pass INEC_DATASET_URL pointing to a full INEC CSV/JSON dataset
 *      (defaults to seeding all 37 States & 774 LGAs + fetching full INEC Wards/PUs when available)
 *   3. Run: npm run seed:inec
 */

import { createClient } from "@supabase/supabase-js";
import { NIGERIA_STATES } from "../src/data/nigeria-states-lgas";

interface RawInecRow {
  state_name: string;
  lga_name: string;
  ward_name: string;
  pu_name: string;
  pu_code?: string;
  delimited_code?: string;
}

const DEFAULT_INEC_CSV_URL =
  process.env.INEC_DATASET_URL ||
  "https://raw.githubusercontent.com/mykeels/inec-polling-units/master/polling-units.csv";

function normalizeName(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

async function seed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy .env.example to .env.local first."
    );
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  console.log("1/4 Seeding 37 Nigerian States (36 States + FCT)...");
  const stateRows = NIGERIA_STATES.map((s) => ({
    id: s.id,
    code: s.code,
    name: s.name,
    geopolitical_zone: s.zone,
  }));

  const { error: stateErr } = await supabase
    .from("states")
    .upsert(stateRows, { onConflict: "id" });
  if (stateErr) throw stateErr;

  console.log("2/4 Seeding 774 Official Local Government Areas (LGAs)...");
  const lgaRows: { state_id: number; code: string; name: string }[] = [];
  for (const state of NIGERIA_STATES) {
    state.lgas.forEach((lgaName, idx) => {
      lgaRows.push({
        state_id: state.id,
        code: `${state.code}-${String(idx + 1).padStart(2, "0")}`,
        name: lgaName,
      });
    });
  }

  for (let i = 0; i < lgaRows.length; i += 200) {
    const chunk = lgaRows.slice(i, i + 200);
    const { error } = await supabase
      .from("lgas")
      .upsert(chunk, { onConflict: "state_id,name" });
    if (error) throw error;
  }

  // Load LGA lookup map
  const { data: dbLgas, error: loadLgaErr } = await supabase
    .from("lgas")
    .select("id, state_id, name");
  if (loadLgaErr || !dbLgas) throw loadLgaErr;

  const stateNameToId = new Map<string, number>();
  for (const s of NIGERIA_STATES) {
    stateNameToId.set(normalizeName(s.name), s.id);
    if (s.name === "FCT Abuja") {
      stateNameToId.set("FCT", s.id);
      stateNameToId.set("ABUJA", s.id);
      stateNameToId.set("FEDERAL CAPITAL TERRITORY", s.id);
    }
  }

  const lgaKeyToId = new Map<string, number>();
  for (const l of dbLgas) {
    lgaKeyToId.set(`${l.state_id}::${normalizeName(l.name)}`, l.id);
  }

  console.log(`3/4 Fetching full INEC Wards & Polling Units from ${DEFAULT_INEC_CSV_URL}...`);
  let rows: RawInecRow[] = [];
  try {
    const res = await fetch(DEFAULT_INEC_CSV_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase());

    const idxState = header.findIndex((h) => h.includes("state"));
    const idxLga = header.findIndex((h) => h.includes("lga") || h.includes("local"));
    const idxWard = header.findIndex((h) => h.includes("ward") || h.includes("registration"));
    const idxPu = header.findIndex((h) => h === "name" || h.includes("polling") || h.includes("pu_name"));
    const idxCode = header.findIndex((h) => h.includes("delim") || h.includes("code"));

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCsvLine(lines[i]);
      if (cols.length < 4) continue;
      rows.push({
        state_name: cols[idxState] ?? "",
        lga_name: cols[idxLga] ?? "",
        ward_name: cols[idxWard] ?? "",
        pu_name: cols[idxPu] ?? "",
        delimited_code: idxCode >= 0 ? cols[idxCode] : undefined,
      });
    }
    console.log(`Loaded ${rows.length.toLocaleString()} raw INEC polling unit rows.`);
  } catch (err) {
    console.warn(
      "Could not fetch external INEC CSV automatically. Pass INEC_DATASET_URL or check network.",
      err
    );
    return;
  }

  // Deduplicate wards per LGA
  const wardMap = new Map<string, { state_id: number; lga_id: number; code: string; name: string }>();
  for (const r of rows) {
    const stateId = stateNameToId.get(normalizeName(r.state_name));
    if (!stateId) continue;
    const lgaId = lgaKeyToId.get(`${stateId}::${normalizeName(r.lga_name)}`);
    if (!lgaId || !r.ward_name) continue;
    const key = `${lgaId}::${normalizeName(r.ward_name)}`;
    if (!wardMap.has(key)) {
      wardMap.set(key, {
        state_id: stateId,
        lga_id: lgaId,
        code: `W-${String((wardMap.size % 99) + 1).padStart(2, "0")}`,
        name: r.ward_name.trim(),
      });
    }
  }

  const wardList = Array.from(wardMap.values());
  console.log(`Upserting ${wardList.length.toLocaleString()} INEC Wards...`);
  for (let i = 0; i < wardList.length; i += 500) {
    const { error } = await supabase
      .from("wards")
      .upsert(wardList.slice(i, i + 500), { onConflict: "lga_id,name" });
    if (error) throw error;
  }

  // Fetch inserted wards
  const wardKeyToId = new Map<string, number>();
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from("wards")
      .select("id, lga_id, name")
      .range(from, from + 999);
    if (error) throw error;
    if (!data || data.length === 0) break;
    for (const w of data) {
      wardKeyToId.set(`${w.lga_id}::${normalizeName(w.name)}`, w.id);
    }
    if (data.length < 1000) break;
    from += 1000;
  }

  console.log("4/4 Batch inserting Polling Units...");
  const puBatch: {
    state_id: number;
    lga_id: number;
    ward_id: number;
    pu_code: string;
    delimited_code: string;
    name: string;
  }[] = [];

  let puCounter = 0;
  for (const r of rows) {
    const stateId = stateNameToId.get(normalizeName(r.state_name));
    if (!stateId) continue;
    const lgaId = lgaKeyToId.get(`${stateId}::${normalizeName(r.lga_name)}`);
    if (!lgaId) continue;
    const wardId = wardKeyToId.get(`${lgaId}::${normalizeName(r.ward_name)}`);
    if (!wardId || !r.pu_name) continue;

    puCounter++;
    const delim = r.delimited_code || `${stateId}-${lgaId}-${wardId}-${puCounter}`;
    puBatch.push({
      state_id: stateId,
      lga_id: lgaId,
      ward_id: wardId,
      pu_code: `PU-${String((puCounter % 999) + 1).padStart(3, "0")}`,
      delimited_code: delim,
      name: r.pu_name.trim(),
    });

    if (puBatch.length >= 1000) {
      const { error } = await supabase
        .from("polling_units")
        .upsert(puBatch.splice(0, puBatch.length), { onConflict: "delimited_code" });
      if (error) throw error;
    }
  }

  if (puBatch.length > 0) {
    const { error } = await supabase
      .from("polling_units")
      .upsert(puBatch, { onConflict: "delimited_code" });
    if (error) throw error;
  }

  console.log(`Done! Seeded ${puCounter.toLocaleString()} Polling Units into Supabase.`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});

