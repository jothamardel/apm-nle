"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Globe,
  MapPin,
  Megaphone,
  Search,
  ShieldCheck,
  Users,
  ArrowLeft,
} from "lucide-react";
import { useApp } from "@/components/AppProvider";
import {
  computeDemoLgaBreakdown,
  computeDemoPuBreakdown,
  computeDemoWardBreakdown,
} from "@/lib/demo-store";
import { formatNumber } from "@/lib/format";
import type { GeopoliticalZone } from "@/types/database";

const ZONES: ("All Zones" | GeopoliticalZone)[] = [
  "All Zones",
  "North Central",
  "North East",
  "North West",
  "South East",
  "South South",
  "South West",
];

export default function AnalyticsPage() {
  const { analyticsSummary, stateBreakdown, state } = useApp();

  const [selectedState, setSelectedState] = useState<{ id: number; name: string } | null>(null);
  const [selectedLga, setSelectedLga] = useState<{ id: number; name: string } | null>(null);
  const [selectedWard, setSelectedWard] = useState<{ id: number; name: string } | null>(null);
  const [zoneFilter, setZoneFilter] = useState<"All Zones" | GeopoliticalZone>("All Zones");
  const [searchQuery, setSearchQuery] = useState("");

  const lgaRows = useMemo(() => {
    if (!selectedState) return [];
    return computeDemoLgaBreakdown(selectedState.id, state.members);
  }, [selectedState, state.members]);

  const wardRows = useMemo(() => {
    if (!selectedState || !selectedLga) return [];
    return computeDemoWardBreakdown(selectedState.id, selectedLga.id, state.members);
  }, [selectedState, selectedLga, state.members]);

  const puRows = useMemo(() => {
    if (!selectedState || !selectedLga || !selectedWard) return [];
    return computeDemoPuBreakdown(
      selectedState.id,
      selectedLga.id,
      selectedWard.id,
      state.members
    );
  }, [selectedState, selectedLga, selectedWard, state.members]);

  const zoneTotals = useMemo(() => {
    const map = new Map<GeopoliticalZone, number>();
    for (const s of stateBreakdown) {
      map.set(s.geopolitical_zone, (map.get(s.geopolitical_zone) ?? 0) + s.total_members);
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [stateBreakdown]);

  const maxZoneTotal = zoneTotals[0]?.[1] || 1;
  const q = searchQuery.trim().toLowerCase();

  const filteredStates = useMemo(
    () =>
      stateBreakdown.filter((s) => {
        if (zoneFilter !== "All Zones" && s.geopolitical_zone !== zoneFilter) return false;
        if (q && !s.state_name.toLowerCase().includes(q) && !s.state_code.toLowerCase().includes(q)) {
          return false;
        }
        return true;
      }),
    [stateBreakdown, zoneFilter, q]
  );

  const filteredLgas = useMemo(
    () => lgaRows.filter((l) => !q || l.lga_name.toLowerCase().includes(q)),
    [lgaRows, q]
  );

  const filteredWards = useMemo(
    () => wardRows.filter((w) => !q || w.ward_name.toLowerCase().includes(q)),
    [wardRows, q]
  );

  const filteredPus = useMemo(
    () =>
      puRows.filter(
        (p) =>
          !q ||
          p.pu_name.toLowerCase().includes(q) ||
          p.pu_code.toLowerCase().includes(q)
      ),
    [puRows, q]
  );

  const activeLevel = selectedWard
    ? "polling_unit"
    : selectedLga
    ? "ward"
    : selectedState
    ? "lga"
    : "state";

  const resetToNational = () => {
    setSelectedState(null);
    setSelectedLga(null);
    setSelectedWard(null);
    setSearchQuery("");
  };

  const pvcPct = Math.round(
    (analyticsSummary.pvc_holders / Math.max(1, analyticsSummary.total_members)) * 100
  );
  const nonPvcPct = Math.round(
    ((analyticsSummary.non_pvc_supporters + analyticsSummary.planning_pvc) /
      Math.max(1, analyticsSummary.total_members)) *
      100
  );
  const diasporaPct = Math.max(1, 100 - pvcPct - nonPvcPct);

  return (
    <div className="bg-[#FAF9F5] pb-20">
      {/* Header */}
      <section className="bg-[#0B3D2E] text-white py-14 px-4 sm:px-6 border-b-4 border-[#E6B42C]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#F5D678]">
              Public Real-Time Grassroots Intelligence • Zero Personal Data Exposed
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight">
              Live Member Analytics Explorer
            </h1>
            <p className="text-[#D4E5DD]">
              Click any State to drill down through all{" "}
              <strong className="text-white">774 Local Government Areas</strong>,{" "}
              <strong className="text-white">Wards</strong>, and{" "}
              <strong className="text-white">INEC Polling Units</strong>.
            </p>
          </div>
          <Link
            href="/join"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E6B42C] hover:bg-[#d5a31d] px-5 py-3 text-sm font-bold text-[#07291F] transition-colors shrink-0"
          >
            Add Your Polling Unit
          </Link>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="rounded-2xl bg-white border border-[#E2DFD5] p-5 shadow-sm col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-[#4B5D56] text-xs font-semibold">
              <span>Total Members</span>
              <Users className="h-4 w-4 text-[#0B3D2E]" aria-hidden="true" />
            </div>
            <p className="font-mono-num text-3xl font-extrabold text-[#0B3D2E] mt-2">
              {formatNumber(analyticsSummary.total_members)}
            </p>
            <p className="text-xs text-[#146C43] font-semibold mt-1">
              36 States + FCT + Diaspora
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-[#E2DFD5] p-5 shadow-sm">
            <div className="flex items-center justify-between text-[#4B5D56] text-xs font-semibold">
              <span>Protect The Ballots</span>
              <ShieldCheck className="h-4 w-4 text-[#146C43]" aria-hidden="true" />
            </div>
            <p className="font-mono-num text-2xl sm:text-3xl font-extrabold text-[#0B3D2E] mt-2">
              {formatNumber(analyticsSummary.protect_ballots_count)}
            </p>
            <p className="text-xs text-[#4B5D56] mt-1">Polling Unit Volunteers</p>
          </div>

          <div className="rounded-2xl bg-white border border-[#E2DFD5] p-5 shadow-sm">
            <div className="flex items-center justify-between text-[#4B5D56] text-xs font-semibold">
              <span>Social Media Team</span>
              <Megaphone className="h-4 w-4 text-[#9A7009]" aria-hidden="true" />
            </div>
            <p className="font-mono-num text-2xl sm:text-3xl font-extrabold text-[#0B3D2E] mt-2">
              {formatNumber(analyticsSummary.social_media_count)}
            </p>
            <p className="text-xs text-[#4B5D56] mt-1">Digital Vanguard</p>
          </div>

          <div className="rounded-2xl bg-white border border-[#E2DFD5] p-5 shadow-sm">
            <div className="flex items-center justify-between text-[#4B5D56] text-xs font-semibold">
              <span>Active Wards / PUs</span>
              <MapPin className="h-4 w-4 text-[#0B3D2E]" aria-hidden="true" />
            </div>
            <p className="font-mono-num text-2xl sm:text-3xl font-extrabold text-[#0B3D2E] mt-2">
              {formatNumber(analyticsSummary.polling_units_covered)}
            </p>
            <p className="text-xs text-[#4B5D56] mt-1">
              Across {formatNumber(analyticsSummary.wards_covered)} Wards
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-[#E2DFD5] p-5 shadow-sm">
            <div className="flex items-center justify-between text-[#4B5D56] text-xs font-semibold">
              <span>Diaspora Allies</span>
              <Globe className="h-4 w-4 text-[#9A7009]" aria-hidden="true" />
            </div>
            <p className="font-mono-num text-2xl sm:text-3xl font-extrabold text-[#0B3D2E] mt-2">
              {formatNumber(analyticsSummary.diaspora_supporters)}
            </p>
            <p className="text-xs text-[#4B5D56] mt-1">Global Nigerian Supporters</p>
          </div>
        </div>

        {/* Zone Distribution & PVC Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl bg-white border border-[#E2DFD5] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-[#0B3D2E]">
                Geopolitical Zone Strength
              </h2>
              <span className="text-xs text-[#4B5D56]">Click a zone to filter states</span>
            </div>
            <div className="space-y-3">
              {zoneTotals.map(([zone, count]) => {
                const width = Math.max(10, Math.round((count / maxZoneTotal) * 100));
                const isSelected = zoneFilter === zone && !selectedState;
                return (
                  <button
                    key={zone}
                    type="button"
                    onClick={() => {
                      resetToNational();
                      setZoneFilter(isSelected ? "All Zones" : zone);
                    }}
                    className={`w-full text-left space-y-1 p-2 rounded-lg transition-colors ${
                      isSelected ? "bg-[#0B3D2E]/8" : "hover:bg-[#FAF9F5]"
                    }`}
                  >
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-[#16221E]">{zone}</span>
                      <span className="font-mono-num font-bold text-[#0B3D2E]">
                        {formatNumber(count)}
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#ECEAE0] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0B3D2E] to-[#146C43]"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-white border border-[#E2DFD5] p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <h2 className="font-display text-xl font-bold text-[#0B3D2E]">
                Inclusive Coalition Breakdown
              </h2>
              <p className="text-sm text-[#4B5D56]">
                Every supporter counts — both PVC voters and non-PVC/diaspora citizens actively
                driving digital advocacy, welfare, and mobilization.
              </p>
            </div>

            <div className="space-y-4">
              <div className="h-5 w-full rounded-full overflow-hidden flex bg-[#ECEAE0]">
                <div
                  className="bg-[#0B3D2E] h-full"
                  style={{ width: `${pvcPct}%` }}
                  title={`PVC Holders: ${pvcPct}%`}
                />
                <div
                  className="bg-[#E6B42C] h-full"
                  style={{ width: `${nonPvcPct}%` }}
                  title={`Non-PVC & Planning: ${nonPvcPct}%`}
                />
                <div
                  className="bg-[#146C43] h-full"
                  style={{ width: `${diasporaPct}%` }}
                  title={`Diaspora: ${diasporaPct}%`}
                />
              </div>

              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-[#0B3D2E]" aria-hidden="true" />
                    PVC Verified Voters
                  </span>
                  <span className="font-mono-num font-bold text-[#0B3D2E]">
                    {formatNumber(analyticsSummary.pvc_holders)} ({pvcPct}%)
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-[#E6B42C]" aria-hidden="true" />
                    Non-PVC / Planning Supporters
                  </span>
                  <span className="font-mono-num font-bold text-[#9A7009]">
                    {formatNumber(
                      analyticsSummary.non_pvc_supporters + analyticsSummary.planning_pvc
                    )}{" "}
                    ({nonPvcPct}%)
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-[#146C43]" aria-hidden="true" />
                    Diaspora Allies
                  </span>
                  <span className="font-mono-num font-bold text-[#146C43]">
                    {formatNumber(analyticsSummary.diaspora_supporters)} ({diasporaPct}%)
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-[#FDF8E6] border border-[#E6B42C]/50 p-3.5 text-xs text-[#344740]">
              <strong>Privacy Guarantee:</strong> This public dashboard displays aggregate counts
              only. Member names, phone numbers, and emails remain strictly protected inside our
              role-scoped Coordinator Console.
            </div>
          </div>
        </div>

        {/* 4-LEVEL HIERARCHICAL DRILL-DOWN EXPLORER */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-white border border-[#E2DFD5] p-5">
            {/* Breadcrumb Trail */}
            <nav aria-label="Geographic drill-down breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm">
              <button
                type="button"
                onClick={resetToNational}
                className={`font-bold px-2.5 py-1 rounded-md transition-colors ${
                  activeLevel === "state"
                    ? "bg-[#0B3D2E] text-white"
                    : "text-[#0B3D2E] hover:bg-[#F1EFE7]"
                }`}
              >
                Nigeria (37 States)
              </button>

              {selectedState && (
                <>
                  <ChevronRight className="h-4 w-4 text-[#4B5D56]" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLga(null);
                      setSelectedWard(null);
                      setSearchQuery("");
                    }}
                    className={`font-bold px-2.5 py-1 rounded-md transition-colors ${
                      activeLevel === "lga"
                        ? "bg-[#0B3D2E] text-white"
                        : "text-[#0B3D2E] hover:bg-[#F1EFE7]"
                    }`}
                  >
                    {selectedState.name}
                  </button>
                </>
              )}

              {selectedLga && (
                <>
                  <ChevronRight className="h-4 w-4 text-[#4B5D56]" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedWard(null);
                      setSearchQuery("");
                    }}
                    className={`font-bold px-2.5 py-1 rounded-md transition-colors ${
                      activeLevel === "ward"
                        ? "bg-[#0B3D2E] text-white"
                        : "text-[#0B3D2E] hover:bg-[#F1EFE7]"
                    }`}
                  >
                    {selectedLga.name} LGA
                  </button>
                </>
              )}

              {selectedWard && (
                <>
                  <ChevronRight className="h-4 w-4 text-[#4B5D56]" aria-hidden="true" />
                  <span className="font-bold px-2.5 py-1 rounded-md bg-[#0B3D2E] text-white">
                    {selectedWard.name}
                  </span>
                </>
              )}
            </nav>

            {/* Filter & Search Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {activeLevel === "state" && (
                <select
                  aria-label="Filter by geopolitical zone"
                  value={zoneFilter}
                  onChange={(e) => setZoneFilter(e.target.value as "All Zones" | GeopoliticalZone)}
                  className="rounded-lg border border-[#D4D9D6] bg-[#FAF9F5] px-3 py-2 text-sm font-medium text-[#16221E]"
                >
                  {ZONES.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              )}

              <div className="relative">
                <Search
                  className="h-4 w-4 text-[#4B5D56] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  placeholder={`Search ${
                    activeLevel === "state"
                      ? "state..."
                      : activeLevel === "lga"
                      ? "LGA..."
                      : activeLevel === "ward"
                      ? "ward..."
                      : "polling unit or code..."
                  }`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="rounded-lg border border-[#D4D9D6] bg-[#FAF9F5] pl-9 pr-3 py-2 text-sm text-[#16221E] focus:border-[#0B3D2E] focus:outline-none w-56 sm:w-64"
                />
              </div>
            </div>
          </div>

          {activeLevel !== "state" && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                if (selectedWard) setSelectedWard(null);
                else if (selectedLga) setSelectedLga(null);
                else setSelectedState(null);
              }}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B3D2E] hover:text-[#146C43]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back up one level
            </button>
          )}

          {/* Accessible Responsive Data Table (follows modern-web-guidance `responsive-table`) */}
          <div
            tabIndex={0}
            role="region"
            aria-labelledby="analytics-table-caption"
            className="table-wrapper shadow-sm"
          >
            {activeLevel === "state" && (
              <table
                className="responsive-data-table"
                style={
                  {
                    "--col-2": '"Zone"',
                    "--col-3": '"Total Members"',
                    "--col-4": '"PVC Holders"',
                    "--col-5": '"Protect Ballots"',
                    "--col-6": '"Social Media"',
                    "--col-7": '"Action"',
                  } as React.CSSProperties
                }
              >
                <caption id="analytics-table-caption" className="sr-only">
                  NLE Grassroots membership breakdown by Nigerian State
                </caption>
                <thead>
                  <tr>
                    <th scope="col">State</th>
                    <th scope="col">Geopolitical Zone</th>
                    <th scope="col">Total Members</th>
                    <th scope="col">PVC Holders</th>
                    <th scope="col">Protect Ballots</th>
                    <th scope="col">Social Media</th>
                    <th scope="col">Drill Down</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStates.map((row) => (
                    <tr key={row.state_id}>
                      <th scope="row">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedState({ id: row.state_id, name: row.state_name });
                            setSearchQuery("");
                          }}
                          className="text-left hover:underline font-bold text-[#0B3D2E]"
                        >
                          {row.state_name}
                        </button>
                      </th>
                      <td className="text-[#4B5D56]">{row.geopolitical_zone}</td>
                      <td className="font-mono-num font-bold text-[#0B3D2E]">
                        {formatNumber(row.total_members)}
                      </td>
                      <td className="font-mono-num">{formatNumber(row.pvc_holders)}</td>
                      <td className="font-mono-num text-[#146C43] font-semibold">
                        {formatNumber(row.protect_ballots)}
                      </td>
                      <td className="font-mono-num text-[#9A7009] font-semibold">
                        {formatNumber(row.social_media)}
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedState({ id: row.state_id, name: row.state_name });
                            setSearchQuery("");
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#0B3D2E]/10 hover:bg-[#0B3D2E] hover:text-white px-3 py-1.5 text-xs font-bold text-[#0B3D2E] transition-colors"
                        >
                          View {row.lgas_covered} LGAs
                          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeLevel === "lga" && selectedState && (
              <table
                className="responsive-data-table"
                style={
                  {
                    "--col-2": '"Total Members"',
                    "--col-3": '"PVC Holders"',
                    "--col-4": '"Protect Ballots"',
                    "--col-5": '"Social Media"',
                    "--col-6": '"Wards Covered"',
                    "--col-7": '"Action"',
                  } as React.CSSProperties
                }
              >
                <caption id="analytics-table-caption" className="sr-only">
                  Local Government Area breakdown for {selectedState.name}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Local Government Area ({selectedState.name})</th>
                    <th scope="col">Total Members</th>
                    <th scope="col">PVC Holders</th>
                    <th scope="col">Protect Ballots</th>
                    <th scope="col">Social Media</th>
                    <th scope="col">Wards Active</th>
                    <th scope="col">Drill Down</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLgas.map((row) => (
                    <tr key={row.lga_id}>
                      <th scope="row">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLga({ id: row.lga_id, name: row.lga_name });
                            setSearchQuery("");
                          }}
                          className="text-left hover:underline font-bold text-[#0B3D2E]"
                        >
                          {row.lga_name}
                        </button>
                      </th>
                      <td className="font-mono-num font-bold text-[#0B3D2E]">
                        {formatNumber(row.total_members)}
                      </td>
                      <td className="font-mono-num">{formatNumber(row.pvc_holders)}</td>
                      <td className="font-mono-num text-[#146C43] font-semibold">
                        {formatNumber(row.protect_ballots)}
                      </td>
                      <td className="font-mono-num text-[#9A7009] font-semibold">
                        {formatNumber(row.social_media)}
                      </td>
                      <td className="font-mono-num">{row.wards_covered}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLga({ id: row.lga_id, name: row.lga_name });
                            setSearchQuery("");
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#0B3D2E]/10 hover:bg-[#0B3D2E] hover:text-white px-3 py-1.5 text-xs font-bold text-[#0B3D2E] transition-colors"
                        >
                          View Wards
                          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeLevel === "ward" && selectedLga && (
              <table
                className="responsive-data-table"
                style={
                  {
                    "--col-2": '"Ward Code"',
                    "--col-3": '"Total Members"',
                    "--col-4": '"PVC Holders"',
                    "--col-5": '"Protect Ballots"',
                    "--col-6": '"Social Media"',
                    "--col-7": '"Action"',
                  } as React.CSSProperties
                }
              >
                <caption id="analytics-table-caption" className="sr-only">
                  Ward breakdown for {selectedLga.name} LGA
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Registration Area / Ward ({selectedLga.name})</th>
                    <th scope="col">Code</th>
                    <th scope="col">Total Members</th>
                    <th scope="col">PVC Holders</th>
                    <th scope="col">Protect Ballots</th>
                    <th scope="col">Social Media</th>
                    <th scope="col">Drill Down</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWards.map((row) => (
                    <tr key={row.ward_id}>
                      <th scope="row">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedWard({ id: row.ward_id, name: row.ward_name });
                            setSearchQuery("");
                          }}
                          className="text-left hover:underline font-bold text-[#0B3D2E]"
                        >
                          {row.ward_name}
                        </button>
                      </th>
                      <td className="font-mono-num text-xs text-[#4B5D56]">{row.ward_code}</td>
                      <td className="font-mono-num font-bold text-[#0B3D2E]">
                        {formatNumber(row.total_members)}
                      </td>
                      <td className="font-mono-num">{formatNumber(row.pvc_holders)}</td>
                      <td className="font-mono-num text-[#146C43] font-semibold">
                        {formatNumber(row.protect_ballots)}
                      </td>
                      <td className="font-mono-num text-[#9A7009] font-semibold">
                        {formatNumber(row.social_media)}
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedWard({ id: row.ward_id, name: row.ward_name });
                            setSearchQuery("");
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#0B3D2E]/10 hover:bg-[#0B3D2E] hover:text-white px-3 py-1.5 text-xs font-bold text-[#0B3D2E] transition-colors"
                        >
                          View {row.polling_units_covered} PUs
                          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeLevel === "polling_unit" && selectedWard && (
              <table
                className="responsive-data-table"
                style={
                  {
                    "--col-2": '"PU Code"',
                    "--col-3": '"Total Members"',
                    "--col-4": '"PVC Holders"',
                    "--col-5": '"Protect Ballots"',
                    "--col-6": '"Social Media"',
                    "--col-7": '"Join PU"',
                  } as React.CSSProperties
                }
              >
                <caption id="analytics-table-caption" className="sr-only">
                  Polling Unit breakdown for {selectedWard.name}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Polling Unit ({selectedWard.name})</th>
                    <th scope="col">INEC Code</th>
                    <th scope="col">Total Members</th>
                    <th scope="col">PVC Holders</th>
                    <th scope="col">Protect Ballots</th>
                    <th scope="col">Social Media</th>
                    <th scope="col">Strengthen Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPus.map((row) => (
                    <tr key={row.polling_unit_id}>
                      <th scope="row">{row.pu_name}</th>
                      <td className="font-mono-num text-xs text-[#4B5D56]">{row.pu_code}</td>
                      <td className="font-mono-num font-bold text-[#0B3D2E]">
                        {formatNumber(row.total_members)}
                      </td>
                      <td className="font-mono-num">{formatNumber(row.pvc_holders)}</td>
                      <td className="font-mono-num text-[#146C43] font-semibold">
                        {formatNumber(row.protect_ballots)}
                      </td>
                      <td className="font-mono-num text-[#9A7009] font-semibold">
                        {formatNumber(row.social_media)}
                      </td>
                      <td>
                        <Link
                          href="/join?team=protect_ballots"
                          className="inline-flex items-center gap-1 rounded-lg bg-[#E6B42C] hover:bg-[#d5a31d] px-3 py-1.5 text-xs font-bold text-[#07291F] transition-colors"
                        >
                          Defend This PU
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

