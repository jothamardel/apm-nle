import { NextRequest, NextResponse } from "next/server";
import {
  NIGERIA_STATES,
  getAllLgasForState,
  getPollingUnitsForWard,
  getWardsForLga,
} from "@/data/nigeria-states-lgas";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "states";
  const stateId = Number(searchParams.get("stateId") ?? 0);
  const lgaId = Number(searchParams.get("lgaId") ?? 0);
  const wardId = Number(searchParams.get("wardId") ?? 0);
  const query = (searchParams.get("q") ?? "").trim().toLowerCase();

  const supabase = await createSupabaseServerClient();

  // Live Supabase Postgres INEC hierarchy when configured
  if (supabase) {
    try {
      if (type === "states") {
        const { data, error } = await supabase
          .from("states")
          .select("id, code, name, geopolitical_zone")
          .order("name");
        if (!error && data?.length) return NextResponse.json({ items: data, source: "supabase" });
      } else if (type === "lgas" && stateId) {
        const { data, error } = await supabase
          .from("lgas")
          .select("id, state_id, code, name")
          .eq("state_id", stateId)
          .order("name");
        if (!error && data?.length) return NextResponse.json({ items: data, source: "supabase" });
      } else if (type === "wards" && lgaId) {
        const { data, error } = await supabase
          .from("wards")
          .select("id, state_id, lga_id, code, name")
          .eq("lga_id", lgaId)
          .order("name");
        if (!error && data?.length) return NextResponse.json({ items: data, source: "supabase" });
      } else if (type === "pus" && wardId) {
        let req = supabase
          .from("polling_units")
          .select("id, state_id, lga_id, ward_id, pu_code, name")
          .eq("ward_id", wardId)
          .order("pu_code")
          .limit(150);
        if (query) {
          req = req.ilike("name", `%${query}%`);
        }
        const { data, error } = await req;
        if (!error && data?.length) return NextResponse.json({ items: data, source: "supabase" });
      }
    } catch {
      // Gracefully fall back to bundled 37-state / 774-LGA dataset if tables aren't seeded yet
    }
  }

  // Fallback / Demo INEC hierarchy
  if (type === "states") {
    const items = NIGERIA_STATES.map((s) => ({
      id: s.id,
      code: s.code,
      name: s.name,
      geopolitical_zone: s.zone,
    }));
    return NextResponse.json({ items, source: "bundled" });
  }

  if (type === "lgas" && stateId) {
    return NextResponse.json({
      items: getAllLgasForState(stateId),
      source: "bundled",
    });
  }

  if (type === "wards" && stateId && lgaId) {
    return NextResponse.json({
      items: getWardsForLga(stateId, lgaId),
      source: "bundled",
    });
  }

  if (type === "pus" && stateId && lgaId && wardId) {
    let items = getPollingUnitsForWard(stateId, lgaId, wardId);
    if (query) {
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.pu_code.toLowerCase().includes(query)
      );
    }
    return NextResponse.json({ items, source: "bundled" });
  }

  return NextResponse.json({ items: [], source: "bundled" });
}

