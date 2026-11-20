"use client";

import { useEffect, useState } from "react";
import { MapPin, Search } from "lucide-react";
import { NIGERIA_STATES } from "@/data/nigeria-states-lgas";
import type { PvcStatus } from "@/types/database";

export interface SelectedLocation {
  stateId: number | null;
  stateName: string;
  lgaId: number | null;
  lgaName: string;
  wardId: number | null;
  wardName: string;
  pollingUnitId: number | null;
  pollingUnitName: string;
  pollingUnitCode: string;
  customWard: string;
  customPollingUnit: string;
  diasporaCountry: string;
  unknownWardOrPu: boolean;
}

interface OptionItem {
  id: number;
  name: string;
  code?: string;
  pu_code?: string;
}

export function LocationSelector({
  pvcStatus,
  value,
  onChange,
}: {
  pvcStatus: PvcStatus;
  value: SelectedLocation;
  onChange: (next: SelectedLocation) => void;
}) {
  const [lgas, setLgas] = useState<OptionItem[]>([]);
  const [wards, setWards] = useState<OptionItem[]>([]);
  const [pus, setPus] = useState<OptionItem[]>([]);
  const [puFilter, setPuFilter] = useState("");
  const [loadingLgas, setLoadingLgas] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [loadingPus, setLoadingPus] = useState(false);

  const isDiaspora = pvcStatus === "diaspora";
  const skipWardPu = isDiaspora || value.unknownWardOrPu;

  // Fetch LGAs when State changes
  useEffect(() => {
    if (!value.stateId) {
      setLgas([]);
      return;
    }
    let cancelled = false;
    setLoadingLgas(true);
    fetch(`/api/locations?type=lgas&stateId=${value.stateId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setLgas(d.items ?? []);
      })
      .catch(() => {
        if (!cancelled) setLgas([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingLgas(false);
      });
    return () => {
      cancelled = true;
    };
  }, [value.stateId]);

  // Fetch Wards when LGA changes
  useEffect(() => {
    if (!value.stateId || !value.lgaId || skipWardPu) {
      setWards([]);
      return;
    }
    let cancelled = false;
    setLoadingWards(true);
    fetch(`/api/locations?type=wards&stateId=${value.stateId}&lgaId=${value.lgaId}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setWards(d.items ?? []);
      })
      .catch(() => {
        if (!cancelled) setWards([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingWards(false);
      });
    return () => {
      cancelled = true;
    };
  }, [value.stateId, value.lgaId, skipWardPu]);

  // Fetch Polling Units when Ward changes
  useEffect(() => {
    if (!value.stateId || !value.lgaId || !value.wardId || skipWardPu) {
      setPus([]);
      return;
    }
    let cancelled = false;
    setLoadingPus(true);
    const qParam = puFilter.trim() ? `&q=${encodeURIComponent(puFilter.trim())}` : "";
    fetch(
      `/api/locations?type=pus&stateId=${value.stateId}&lgaId=${value.lgaId}&wardId=${value.wardId}${qParam}`
    )
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setPus(d.items ?? []);
      })
      .catch(() => {
        if (!cancelled) setPus([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingPus(false);
      });
    return () => {
      cancelled = true;
    };
  }, [value.stateId, value.lgaId, value.wardId, puFilter, skipWardPu]);

  return (
    <div className="space-y-4 rounded-xl border border-[#E2DFD5] bg-[#FAF9F5] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-[#0B3D2E] shrink-0" aria-hidden="true" />
          <div>
            <h3 className="text-sm font-bold text-[#0B3D2E]">
              {isDiaspora
                ? "Diaspora Location & Home State of Origin"
                : "INEC Grassroots Location (State → LGA → Ward → Polling Unit)"}
            </h3>
            <p className="text-xs text-[#4B5D56]">
              Powers our live State-to-Polling-Unit grassroots map without exposing your personal info.
            </p>
          </div>
        </div>
      </div>

      {isDiaspora && (
        <div>
          <label htmlFor="diaspora-country" className="block text-sm font-semibold text-[#16221E] mb-1">
            Country of Residence <span className="text-[#B91C1C]">*</span>
          </label>
          <input
            id="diaspora-country"
            name="diasporaCountry"
            type="text"
            required
            autoComplete="country-name"
            placeholder="e.g., United Kingdom, United States, Canada, Ghana..."
            value={value.diasporaCountry}
            onChange={(e) => onChange({ ...value, diasporaCountry: e.target.value })}
            className="field-input"
            data-error="diaspora-country-error"
          />
          <div id="diaspora-country-error" className="field-error-msg">
            Error: Please enter your country of residence.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* State */}
        <div>
          <label htmlFor="loc-state" className="block text-sm font-semibold text-[#16221E] mb-1">
            {isDiaspora ? "Nigerian State of Origin / Affinity (Optional)" : "State"}
            {!isDiaspora && <span className="text-[#B91C1C]"> *</span>}
          </label>
          <select
            id="loc-state"
            name="stateId"
            required={!isDiaspora}
            value={value.stateId ?? ""}
            onChange={(e) => {
              const id = e.target.value ? Number(e.target.value) : null;
              const match = NIGERIA_STATES.find((s) => s.id === id);
              onChange({
                ...value,
                stateId: id,
                stateName: match?.name ?? "",
                lgaId: null,
                lgaName: "",
                wardId: null,
                wardName: "",
                pollingUnitId: null,
                pollingUnitName: "",
                pollingUnitCode: "",
              });
            }}
            className="field-input"
            data-error="loc-state-error"
          >
            <option value="">Select State (36 States + FCT)...</option>
            {NIGERIA_STATES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.zone})
              </option>
            ))}
          </select>
          <div id="loc-state-error" className="field-error-msg">
            Error: Please select your state.
          </div>
        </div>

        {/* LGA */}
        <div>
          <label htmlFor="loc-lga" className="block text-sm font-semibold text-[#16221E] mb-1">
            Local Government Area (LGA)
            {!isDiaspora && <span className="text-[#B91C1C]"> *</span>}
          </label>
          <select
            id="loc-lga"
            name="lgaId"
            required={!isDiaspora}
            disabled={!value.stateId || loadingLgas}
            value={value.lgaId ?? ""}
            onChange={(e) => {
              const id = e.target.value ? Number(e.target.value) : null;
              const match = lgas.find((l) => l.id === id);
              onChange({
                ...value,
                lgaId: id,
                lgaName: match?.name ?? "",
                wardId: null,
                wardName: "",
                pollingUnitId: null,
                pollingUnitName: "",
                pollingUnitCode: "",
              });
            }}
            className="field-input disabled:bg-[#F1EFE7] disabled:cursor-not-allowed"
            data-error="loc-lga-error"
          >
            <option value="">
              {loadingLgas
                ? "Loading LGAs..."
                : value.stateId
                ? `Select LGA (${lgas.length} official LGAs)...`
                : "Select State first"}
            </option>
            {lgas.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
          <div id="loc-lga-error" className="field-error-msg">
            Error: Please select your Local Government Area.
          </div>
        </div>
      </div>

      {/* Zero-Barrier Bypass Checkbox for Non-PVC or Unsure Supporters */}
      {!isDiaspora && (
        <label className="flex items-start gap-2.5 rounded-lg bg-[#0B3D2E]/5 border border-[#0B3D2E]/15 p-3 cursor-pointer">
          <input
            type="checkbox"
            checked={value.unknownWardOrPu}
            onChange={(e) =>
              onChange({
                ...value,
                unknownWardOrPu: e.target.checked,
                wardId: null,
                wardName: "",
                pollingUnitId: null,
                pollingUnitName: "",
                pollingUnitCode: "",
              })
            }
            className="mt-0.5 h-4 w-4 rounded accent-[#0B3D2E]"
          />
          <span className="text-xs sm:text-sm text-[#16221E]">
            <strong>I don&apos;t have a PVC / I don&apos;t know my exact Ward or Polling Unit yet.</strong>{" "}
            <span className="text-[#4B5D56]">
              Skip Ward &amp; Polling Unit for now — you can update them anytime in your Member Portal!
            </span>
          </span>
        </label>
      )}

      {!skipWardPu && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Ward */}
          <div>
            <label htmlFor="loc-ward" className="block text-sm font-semibold text-[#16221E] mb-1">
              Registration Area / Ward
            </label>
            <select
              id="loc-ward"
              name="wardId"
              disabled={!value.lgaId || loadingWards}
              value={value.wardId ?? ""}
              onChange={(e) => {
                const id = e.target.value ? Number(e.target.value) : null;
                const match = wards.find((w) => w.id === id);
                setPuFilter("");
                onChange({
                  ...value,
                  wardId: id,
                  wardName: match?.name ?? "",
                  pollingUnitId: null,
                  pollingUnitName: "",
                  pollingUnitCode: "",
                });
              }}
              className="field-input disabled:bg-[#F1EFE7] disabled:cursor-not-allowed"
            >
              <option value="">
                {loadingWards
                  ? "Loading Wards..."
                  : value.lgaId
                  ? "Select Ward (Optional)..."
                  : "Select LGA first"}
              </option>
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.code ? `${w.code} — ` : ""}
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* Polling Unit with Instant Search */}
          <div className="space-y-1.5">
            <label htmlFor="loc-pu" className="block text-sm font-semibold text-[#16221E]">
              Polling Unit (PU)
            </label>
            {value.wardId && (
              <div className="relative">
                <Search
                  className="h-3.5 w-3.5 text-[#4B5D56] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder="Filter polling units by school, square or code..."
                  value={puFilter}
                  onChange={(e) => setPuFilter(e.target.value)}
                  className="w-full rounded-md border border-[#D4D9D6] bg-white pl-8 pr-3 py-1.5 text-xs focus:border-[#0B3D2E] focus:outline-none"
                />
              </div>
            )}
            <select
              id="loc-pu"
              name="pollingUnitId"
              disabled={!value.wardId || loadingPus}
              value={value.pollingUnitId ?? ""}
              onChange={(e) => {
                const id = e.target.value ? Number(e.target.value) : null;
                const match = pus.find((p) => p.id === id);
                onChange({
                  ...value,
                  pollingUnitId: id,
                  pollingUnitName: match?.name ?? "",
                  pollingUnitCode: match?.pu_code ?? "",
                });
              }}
              className="field-input disabled:bg-[#F1EFE7] disabled:cursor-not-allowed"
            >
              <option value="">
                {loadingPus
                  ? "Loading Polling Units..."
                  : value.wardId
                  ? `Select Polling Unit (${pus.length} available)...`
                  : "Select Ward first"}
              </option>
              {pus.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.pu_code ? `${p.pu_code} — ` : ""}
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

