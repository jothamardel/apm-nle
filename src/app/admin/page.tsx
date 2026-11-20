"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Camera,
  CheckCircle2,
  Download,
  HeartHandshake,
  Lock,
  Newspaper,
  Plus,
  Settings,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { NIGERIA_STATES, getStateById } from "@/data/nigeria-states-lgas";
import { downloadCsv, formatDate, formatNaira, formatNumber } from "@/lib/format";
import type { ActionTeamId, GalleryAlbum, UserRole } from "@/types/database";

type AdminTab = "members" | "donations" | "campaigns" | "content" | "settings";

export default function AdminPage() {
  const {
    currentUser,
    state,
    analyticsSummary,
    signIn,
    verifyDonation,
    addCampaign,
    addGalleryAlbum,
    addNewsPost,
    updateSettings,
    updateMemberRole,
    isLiveSupabase,
  } = useApp();

  const role = currentUser?.role;
  const isNational = role === "national_admin";
  const isStateCoord = role === "state_coordinator";
  const isMedia = role === "media_editor";
  const hasAdminAccess = isNational || isStateCoord || isMedia;

  const [activeTab, setActiveTab] = useState<AdminTab>(
    isMedia ? "content" : "members"
  );
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [pvcFilter, setPvcFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // New Campaign Form
  const [campTitle, setCampTitle] = useState("");
  const [campLocation, setCampLocation] = useState("");
  const [campTarget, setCampTarget] = useState("5000000");
  const [campSummary, setCampSummary] = useState("");

  // New Gallery Album Form
  const [albTitle, setAlbTitle] = useState("");
  const [albStateId, setAlbStateId] = useState("32");
  const [albLocation, setAlbLocation] = useState("");
  const [albCategory, setAlbCategory] = useState<GalleryAlbum["category"]>("Grassroots Outreach");
  const [albSummary, setAlbSummary] = useState("");

  // New News Post Form
  const [newsTitle, setNewsTitle] = useState("");
  const [newsCategory, setNewsCategory] = useState("Movement Update");
  const [newsExcerpt, setNewsExcerpt] = useState("");
  const [newsBody, setNewsBody] = useState("");

  // Settings form
  const [bankName, setBankName] = useState(state.settings.bank_name);
  const [bankAccName, setBankAccName] = useState(state.settings.bank_account_name);
  const [bankAccNum, setBankAccNum] = useState(state.settings.bank_account_number);
  const [contactEmail, setContactEmail] = useState(state.settings.contact_email);
  const [contactPhone, setContactPhone] = useState(state.settings.contact_phone);
  const [toast, setToast] = useState("");

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Enforce State Coordinator scope strictly
  const scopedMembers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return state.members.filter((m) => {
      if (isStateCoord && currentUser?.assigned_state_id) {
        if (m.state_id !== currentUser.assigned_state_id) return false;
      } else if (stateFilter !== "all" && String(m.state_id) !== stateFilter) {
        return false;
      }
      if (teamFilter !== "all" && !m.action_teams.includes(teamFilter as ActionTeamId)) {
        return false;
      }
      if (pvcFilter !== "all" && m.pvc_status !== pvcFilter) return false;
      if (
        q &&
        !m.full_name.toLowerCase().includes(q) &&
        !m.member_number.toLowerCase().includes(q) &&
        !(m.lga_name ?? "").toLowerCase().includes(q) &&
        !(m.ward_name ?? "").toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [state.members, isStateCoord, currentUser, stateFilter, teamFilter, pvcFilter, searchTerm]);

  if (!hasAdminAccess) {
    return (
      <div className="bg-[#FAF9F5] py-20 px-4 text-center space-y-6 min-h-[70vh]">
        <Lock className="h-12 w-12 text-[#0B3D2E] mx-auto" aria-hidden="true" />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0B3D2E]">
          Role-Protected Coordinator &amp; Admin Console
        </h1>
        <p className="text-[#4B5D56] max-w-xl mx-auto">
          Access is restricted by Supabase Row-Level Security to authorized{" "}
          <strong>National Admins</strong>, <strong>State Coordinators</strong>, and{" "}
          <strong>Media Editors</strong>.
        </p>

        {!isLiveSupabase ? (
          <div className="max-w-xl mx-auto rounded-2xl bg-white border border-[#E2DFD5] p-6 space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#9A7009]">
              Interactive Preview — Instant Role Switcher
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  signIn("", "national_admin");
                  setActiveTab("members");
                }}
                className="rounded-xl bg-[#0B3D2E] px-4 py-2.5 text-xs font-bold text-white"
              >
                Preview as National Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  signIn("", "state_coordinator");
                  setActiveTab("members");
                }}
                className="rounded-xl bg-[#146C43] px-4 py-2.5 text-xs font-bold text-white"
              >
                Preview as State Coordinator (Plateau)
              </button>
              <button
                type="button"
                onClick={() => {
                  signIn("", "media_editor");
                  setActiveTab("content");
                }}
                className="rounded-xl bg-[#E6B42C] px-4 py-2.5 text-xs font-bold text-[#07291F]"
              >
                Preview as Media Editor
              </button>
            </div>
          </div>
        ) : (
          <Link
            href="/signin"
            className="inline-flex rounded-xl bg-[#0B3D2E] px-6 py-3 text-sm font-bold text-white"
          >
            Sign In With Admin Account
          </Link>
        )}
      </div>
    );
  }

  const assignedState = getStateById(currentUser?.assigned_state_id);
  const pendingTransfers = state.donations.filter(
    (d) => d.status === "pending_verification"
  ).length;

  const handleExportCsv = () => {
    downloadCsv(
      `nle-apm-members-${isStateCoord ? assignedState?.code ?? "state" : "national"}.csv`,
      scopedMembers.map((m) => ({
        Member_ID: m.member_number,
        Full_Name: m.full_name,
        Email: m.email,
        Phone: m.phone,
        WhatsApp: m.whatsapp ?? "",
        PVC_Status: m.pvc_status,
        State: m.state_name ?? m.diaspora_country ?? "",
        LGA: m.lga_name ?? "",
        Ward: m.ward_name ?? m.custom_ward ?? "",
        Polling_Unit: m.polling_unit_name ?? m.custom_polling_unit ?? "",
        Action_Teams: m.action_teams.join(" | "),
        Role: m.role,
        Joined: m.created_at,
      }))
    );
    notify(`Exported ${scopedMembers.length} member records to CSV.`);
  };

  return (
    <div className="bg-[#FAF9F5] pb-20">
      {/* Admin Header */}
      <section className="bg-[#07291F] text-white py-10 px-4 sm:px-6 border-b-4 border-[#E6B42C]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#E6B42C] px-2.5 py-0.5 text-[11px] font-extrabold uppercase text-[#07291F]">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {role?.replace("_", " ")}
              </span>
              {isStateCoord && assignedState && (
                <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold text-[#F5D678]">
                  Scoped Strictly to {assignedState.name} State
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl font-bold mt-2">
              NLE Operations &amp; Admin Console
            </h1>
            <p className="text-sm text-[#C8DDD2]">
              Signed in as {currentUser?.full_name} ({currentUser?.email})
            </p>
          </div>

          {!isLiveSupabase && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#BBD6C9]">Switch Demo Role:</span>
              {(["national_admin", "state_coordinator", "media_editor"] as UserRole[]).map(
                (r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      signIn("", r);
                      if (r === "media_editor") setActiveTab("content");
                      else if (r === "state_coordinator") setActiveTab("members");
                    }}
                    className={`rounded-lg px-3 py-1.5 font-bold capitalize ${
                      role === r
                        ? "bg-[#E6B42C] text-[#07291F]"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {r.replace("_", " ")}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {toast && (
          <div
            role="status"
            className="rounded-xl bg-[#146C43] text-white px-4 py-3 text-sm font-bold flex items-center gap-2 shadow-sm"
          >
            <CheckCircle2 className="h-4 w-4 text-[#E6B42C]" aria-hidden="true" />
            {toast}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-white border border-[#E2DFD5] p-4">
            <p className="text-xs font-semibold text-[#4B5D56]">Total National Network</p>
            <p className="font-mono-num text-2xl font-extrabold text-[#0B3D2E] mt-1">
              {formatNumber(analyticsSummary.total_members)}
            </p>
          </div>
          <div className="rounded-xl bg-white border border-[#E2DFD5] p-4">
            <p className="text-xs font-semibold text-[#4B5D56]">
              {isStateCoord ? `${assignedState?.name} Profiles Loaded` : "Directory Profiles"}
            </p>
            <p className="font-mono-num text-2xl font-extrabold text-[#0B3D2E] mt-1">
              {scopedMembers.length}
            </p>
          </div>
          <div className="rounded-xl bg-white border border-[#E2DFD5] p-4">
            <p className="text-xs font-semibold text-[#4B5D56]">Pending Bank Transfers</p>
            <p className="font-mono-num text-2xl font-extrabold text-[#9A7009] mt-1">
              {pendingTransfers}
            </p>
          </div>
          <div className="rounded-xl bg-white border border-[#E2DFD5] p-4">
            <p className="text-xs font-semibold text-[#4B5D56]">Published Galleries &amp; News</p>
            <p className="font-mono-num text-2xl font-extrabold text-[#146C43] mt-1">
              {state.albums.length} / {state.news.length}
            </p>
          </div>
        </div>

        {/* Role-Filtered Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#E2DFD5] pb-3">
          {(isNational || isStateCoord) && (
            <button
              type="button"
              onClick={() => setActiveTab("members")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${
                activeTab === "members"
                  ? "bg-[#0B3D2E] text-white"
                  : "bg-white border border-[#E2DFD5] text-[#344740]"
              }`}
            >
              <Users className="h-4 w-4" aria-hidden="true" />
              Member &amp; Volunteer Roster
            </button>
          )}
          {isNational && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab("donations")}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${
                  activeTab === "donations"
                    ? "bg-[#0B3D2E] text-white"
                    : "bg-white border border-[#E2DFD5] text-[#344740]"
                }`}
              >
                <HeartHandshake className="h-4 w-4" aria-hidden="true" />
                Donations &amp; Receipts ({pendingTransfers})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("campaigns")}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${
                  activeTab === "campaigns"
                    ? "bg-[#0B3D2E] text-white"
                    : "bg-white border border-[#E2DFD5] text-[#344740]"
                }`}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Fundraising Drives
              </button>
            </>
          )}
          {(isNational || isMedia) && (
            <button
              type="button"
              onClick={() => setActiveTab("content")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${
                activeTab === "content"
                  ? "bg-[#0B3D2E] text-white"
                  : "bg-white border border-[#E2DFD5] text-[#344740]"
              }`}
            >
              <Camera className="h-4 w-4" aria-hidden="true" />
              Gallery &amp; News Publisher
            </button>
          )}
          {isNational && (
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold ${
                activeTab === "settings"
                  ? "bg-[#0B3D2E] text-white"
                  : "bg-white border border-[#E2DFD5] text-[#344740]"
              }`}
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
              Site &amp; Bank Settings
            </button>
          )}
        </div>

        {/* TAB 1: MEMBERS & COORDINATOR EXPORTS */}
        {activeTab === "members" && (isNational || isStateCoord) && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-white border border-[#E2DFD5] p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                {isNational && (
                  <select
                    aria-label="Filter members by state"
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                    className="rounded-lg border border-[#D4D9D6] bg-[#FAF9F5] px-3 py-2 text-xs font-semibold"
                  >
                    <option value="all">All 37 States</option>
                    {NIGERIA_STATES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                )}

                <select
                  aria-label="Filter by Action Team"
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                  className="rounded-lg border border-[#D4D9D6] bg-[#FAF9F5] px-3 py-2 text-xs font-semibold"
                >
                  <option value="all">All Action Teams</option>
                  <option value="protect_ballots">Protect The Ballots</option>
                  <option value="social_media">Social Media Team</option>
                  <option value="grassroots_mobilization">Grassroots Mobilization</option>
                  <option value="fundraising_outreach">Fundraising &amp; Outreach</option>
                </select>

                <select
                  aria-label="Filter by PVC status"
                  value={pvcFilter}
                  onChange={(e) => setPvcFilter(e.target.value)}
                  className="rounded-lg border border-[#D4D9D6] bg-[#FAF9F5] px-3 py-2 text-xs font-semibold"
                >
                  <option value="all">All PVC Statuses</option>
                  <option value="has_pvc">Has PVC</option>
                  <option value="planning_pvc">Planning PVC</option>
                  <option value="no_pvc_supporter">No PVC Supporter</option>
                  <option value="diaspora">Diaspora</option>
                </select>

                <input
                  type="search"
                  placeholder="Search name, ID, LGA, Ward..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-lg border border-[#D4D9D6] bg-[#FAF9F5] px-3 py-2 text-xs w-52"
                />
              </div>

              <button
                type="button"
                onClick={handleExportCsv}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B3D2E] hover:bg-[#146C43] px-4 py-2 text-xs font-bold text-white"
              >
                <Download className="h-4 w-4 text-[#E6B42C]" aria-hidden="true" />
                Export Filtered CSV ({scopedMembers.length})
              </button>
            </div>

            <div
              tabIndex={0}
              role="region"
              aria-labelledby="admin-roster-caption"
              className="table-wrapper"
            >
              <table
                className="responsive-data-table"
                style={
                  {
                    "--col-2": '"Member ID"',
                    "--col-3": '"Contact"',
                    "--col-4": '"Location (State / LGA / Ward)"',
                    "--col-5": '"PVC & Teams"',
                    "--col-6": '"Role"',
                  } as React.CSSProperties
                }
              >
                <caption id="admin-roster-caption" className="sr-only">
                  Authorized member and volunteer roster
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Member</th>
                    <th scope="col">Member ID</th>
                    <th scope="col">Contact</th>
                    <th scope="col">State / LGA / Ward / PU</th>
                    <th scope="col">PVC &amp; Action Teams</th>
                    <th scope="col">Access Role</th>
                  </tr>
                </thead>
                <tbody>
                  {scopedMembers.map((m) => (
                    <tr key={m.id}>
                      <th scope="row">{m.full_name}</th>
                      <td className="font-mono-num text-xs">{m.member_number}</td>
                      <td className="text-xs">
                        <div>{m.phone}</div>
                        <div className="text-[#4B5D56]">{m.email}</div>
                      </td>
                      <td className="text-xs whitespace-normal">
                        <strong>{m.state_name || m.diaspora_country}</strong>
                        {m.lga_name ? ` → ${m.lga_name}` : ""}
                        {m.ward_name ? ` → ${m.ward_name}` : ""}
                        {m.polling_unit_name ? ` (${m.polling_unit_code})` : ""}
                      </td>
                      <td className="text-xs whitespace-normal">
                        <span className="inline-block rounded bg-[#F1EFE7] px-1.5 py-0.5 font-semibold mr-1">
                          {m.pvc_status}
                        </span>
                        {m.action_teams.join(", ")}
                      </td>
                      <td>
                        {isNational ? (
                          <select
                            aria-label={`Role for ${m.full_name}`}
                            value={m.role}
                            onChange={(e) => {
                              const nextRole = e.target.value as UserRole;
                              updateMemberRole(
                                m.id,
                                nextRole,
                                nextRole === "state_coordinator" ? m.state_id ?? 32 : null
                              );
                              notify(`Updated ${m.full_name} to ${nextRole.replace("_", " ")}.`);
                            }}
                            className="rounded border border-[#D4D9D6] bg-white px-2 py-1 text-xs font-semibold"
                          >
                            <option value="member">Member</option>
                            <option value="state_coordinator">State Coordinator</option>
                            <option value="media_editor">Media Editor</option>
                            <option value="national_admin">National Admin</option>
                          </select>
                        ) : (
                          <span className="text-xs font-semibold capitalize">
                            {m.role.replace("_", " ")}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: DONATIONS & MANUAL TRANSFER VERIFICATION */}
        {activeTab === "donations" && isNational && (
          <div className="rounded-2xl bg-white border border-[#E2DFD5] divide-y divide-[#E2DFD5]">
            {state.donations.map((d) => (
              <div
                key={d.id}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono-num text-lg font-extrabold text-[#0B3D2E]">
                      {formatNaira(d.amount_ngn)}
                    </span>
                    <span className="rounded-full bg-[#F1EFE7] px-2.5 py-0.5 text-xs font-bold text-[#344740] capitalize">
                      {d.payment_method.replace("_", " ")}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        d.status === "verified"
                          ? "bg-[#146C43]/15 text-[#146C43]"
                          : d.status === "pending_verification"
                          ? "bg-[#E6B42C]/30 text-[#8A6204]"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {d.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#16221E]">
                    {d.donor_name} ({d.donor_email}) → {d.campaign_title}
                  </p>
                  <p className="text-xs text-[#4B5D56]">
                    Ref: <span className="font-mono-num">{d.reference}</span> •{" "}
                    {formatDate(d.created_at)}
                    {d.transfer_bank_name ? ` • Bank: ${d.transfer_bank_name}` : ""}
                    {d.transfer_sender_name ? ` • Sender: ${d.transfer_sender_name}` : ""}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {d.status !== "verified" && (
                    <button
                      type="button"
                      onClick={() => {
                        verifyDonation(d.id, "verified");
                        notify(`Verified donation ${d.reference} (${formatNaira(d.amount_ngn)}).`);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#146C43] hover:bg-[#0B3D2E] px-4 py-2 text-xs font-bold text-white"
                    >
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      Approve &amp; Credit Campaign
                    </button>
                  )}
                  {d.status === "pending_verification" && (
                    <button
                      type="button"
                      onClick={() => {
                        verifyDonation(d.id, "rejected");
                        notify(`Marked ${d.reference} as rejected.`);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 px-3.5 py-2 text-xs font-bold text-red-700"
                    >
                      <XCircle className="h-4 w-4" aria-hidden="true" />
                      Reject
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: CREATE NEW FUNDRAISING CAMPAIGN */}
        {activeTab === "campaigns" && isNational && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!campTitle.trim()) return;
                addCampaign({
                  slug: campTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                  title: campTitle.trim(),
                  location_label: campLocation.trim() || "Nationwide",
                  target_amount_ngn: Number(campTarget) || 5000000,
                  summary: campSummary.trim() || "Grassroots member support & outreach drive.",
                  description: campSummary.trim() || "Grassroots member support & outreach drive.",
                  cover_image_url: "/images/outreach-relief.svg",
                  is_general_fund: false,
                  is_active: true,
                });
                setCampTitle("");
                setCampLocation("");
                setCampSummary("");
                notify("New fundraising outreach campaign published live on /donate!");
              }}
              className="lg:col-span-5 rounded-2xl bg-white border border-[#E2DFD5] p-6 space-y-4"
            >
              <h2 className="font-display text-xl font-bold text-[#0B3D2E]">
                Launch New Outreach Campaign
              </h2>
              <div>
                <label className="block text-xs font-bold mb-1">Campaign Title</label>
                <input
                  required
                  value={campTitle}
                  onChange={(e) => setCampTitle(e.target.value)}
                  placeholder="e.g., Kano & Kaduna Women Welfare Outreach"
                  className="field-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Location / Chapter</label>
                  <input
                    value={campLocation}
                    onChange={(e) => setCampLocation(e.target.value)}
                    placeholder="e.g., North West"
                    className="field-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1">Target (₦ NGN)</label>
                  <input
                    type="number"
                    required
                    min={100000}
                    value={campTarget}
                    onChange={(e) => setCampTarget(e.target.value)}
                    className="field-input font-mono-num"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Outreach Description</label>
                <textarea
                  rows={3}
                  required
                  value={campSummary}
                  onChange={(e) => setCampSummary(e.target.value)}
                  placeholder="Describe how donations will support members and grassroots organizing..."
                  className="field-input"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-[#0B3D2E] hover:bg-[#146C43] py-3 text-sm font-bold text-white"
              >
                Publish Fundraising Drive
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {state.campaigns.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl bg-white border border-[#E2DFD5] p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-bold text-[#0B3D2E]">{c.title}</p>
                    <p className="text-xs text-[#4B5D56]">{c.location_label}</p>
                  </div>
                  <div className="text-right font-mono-num">
                    <p className="font-bold text-[#146C43]">{formatNaira(c.raised_amount_ngn)}</p>
                    <p className="text-xs text-[#4B5D56]">of {formatNaira(c.target_amount_ngn)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: GALLERY & NEWS PUBLISHER */}
        {activeTab === "content" && (isNational || isMedia) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Event Gallery Album */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const st = getStateById(Number(albStateId));
                addGalleryAlbum({
                  slug: `${albTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
                  title: albTitle.trim(),
                  summary: albSummary.trim(),
                  event_date: new Date().toISOString().slice(0, 10),
                  state_id: Number(albStateId),
                  state_name: st?.name ?? "Plateau",
                  location_name: albLocation.trim() || "Chapter Secretariat",
                  category: albCategory,
                  cover_image_url: "/images/gallery-jos-launch.svg",
                  is_published: true,
                  photos: [
                    {
                      id: `ph-${Date.now()}`,
                      url: "/images/gallery-jos-launch.svg",
                      caption: albSummary.trim(),
                      photographer: currentUser?.full_name,
                    },
                  ],
                });
                setAlbTitle("");
                setAlbLocation("");
                setAlbSummary("");
                notify("Published new Event Album to /gallery!");
              }}
              className="rounded-2xl bg-white border border-[#E2DFD5] p-6 space-y-4"
            >
              <h2 className="font-display text-xl font-bold text-[#0B3D2E] flex items-center gap-2">
                <Camera className="h-5 w-5 text-[#9A7009]" aria-hidden="true" />
                Publish Event / Outreach Album
              </h2>
              <input
                required
                placeholder="Event / Outreach Title"
                value={albTitle}
                onChange={(e) => setAlbTitle(e.target.value)}
                className="field-input"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={albStateId}
                  onChange={(e) => setAlbStateId(e.target.value)}
                  className="field-input"
                >
                  {NIGERIA_STATES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <select
                  value={albCategory}
                  onChange={(e) => setAlbCategory(e.target.value as GalleryAlbum["category"])}
                  className="field-input"
                >
                  <option value="Grassroots Outreach">Grassroots Outreach</option>
                  <option value="Community Relief">Community Relief</option>
                  <option value="Ballot Protection Training">Ballot Protection Training</option>
                  <option value="Youth & Women Summit">Youth &amp; Women Summit</option>
                  <option value="Town Hall">Town Hall</option>
                  <option value="National Convention">National Convention</option>
                </select>
              </div>
              <input
                required
                placeholder="Specific Town / Venue (e.g., Rayfield, Jos South)"
                value={albLocation}
                onChange={(e) => setAlbLocation(e.target.value)}
                className="field-input"
              />
              <textarea
                rows={3}
                required
                placeholder="Summary of the outreach and community impact..."
                value={albSummary}
                onChange={(e) => setAlbSummary(e.target.value)}
                className="field-input"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[#0B3D2E] hover:bg-[#146C43] py-3 text-sm font-bold text-white"
              >
                Publish Album to Gallery
              </button>
            </form>

            {/* Add News Post */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addNewsPost({
                  slug: `${newsTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
                  title: newsTitle.trim(),
                  category: newsCategory,
                  excerpt: newsExcerpt.trim(),
                  body: newsBody.trim(),
                  cover_image_url: "/images/gallery-bauchi-convention.svg",
                  author_name: currentUser?.full_name ?? "NLE Media Team",
                  published_at: new Date().toISOString().slice(0, 10),
                  is_published: true,
                });
                setNewsTitle("");
                setNewsExcerpt("");
                setNewsBody("");
                notify("Published new Press Release to /news!");
              }}
              className="rounded-2xl bg-white border border-[#E2DFD5] p-6 space-y-4"
            >
              <h2 className="font-display text-xl font-bold text-[#0B3D2E] flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-[#9A7009]" aria-hidden="true" />
                Publish News / Press Statement
              </h2>
              <input
                required
                placeholder="Headline"
                value={newsTitle}
                onChange={(e) => setNewsTitle(e.target.value)}
                className="field-input"
              />
              <input
                placeholder="Category (e.g., Official Statement, Policy & Vision)"
                value={newsCategory}
                onChange={(e) => setNewsCategory(e.target.value)}
                className="field-input"
              />
              <input
                required
                placeholder="Short summary / excerpt"
                value={newsExcerpt}
                onChange={(e) => setNewsExcerpt(e.target.value)}
                className="field-input"
              />
              <textarea
                rows={4}
                required
                placeholder="Full article body..."
                value={newsBody}
                onChange={(e) => setNewsBody(e.target.value)}
                className="field-input"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[#E6B42C] hover:bg-[#d5a31d] py-3 text-sm font-bold text-[#07291F]"
              >
                Publish News Update
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: SITE & BANK SETTINGS */}
        {activeTab === "settings" && isNational && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateSettings({
                bank_name: bankName,
                bank_account_name: bankAccName,
                bank_account_number: bankAccNum,
                contact_email: contactEmail,
                contact_phone: contactPhone,
              });
              notify("Updated official bank transfer details & contact settings!");
            }}
            className="max-w-2xl rounded-2xl bg-white border border-[#E2DFD5] p-6 sm:p-8 space-y-5"
          >
            <div>
              <h2 className="font-display text-2xl font-bold text-[#0B3D2E]">
                Organization Contact &amp; Official Bank Transfer Details
              </h2>
              <p className="text-xs text-[#4B5D56] mt-1">
                Changes reflect immediately on the Donations page, About page, and site Footer.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">Bank Name</label>
                <input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="field-input"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Account Number</label>
                <input
                  value={bankAccNum}
                  onChange={(e) => setBankAccNum(e.target.value)}
                  className="field-input font-mono-num"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">Account Name</label>
              <input
                value={bankAccName}
                onChange={(e) => setBankAccName(e.target.value)}
                className="field-input"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">Official Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="field-input"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Official Phone / Hotline</label>
                <input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="field-input"
                />
              </div>
            </div>
            <button
              type="submit"
              className="rounded-xl bg-[#0B3D2E] hover:bg-[#146C43] px-6 py-3 text-sm font-bold text-white"
            >
              Save Settings
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

