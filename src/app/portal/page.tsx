"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Copy,
  CreditCard,
  ExternalLink,
  HeartHandshake,
  IdCard,
  LogOut,
  Megaphone,
  Share2,
  ShieldCheck,
  Trophy,
  Upload,
} from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { DigitalIdCard } from "@/components/DigitalIdCard";
import { ACTION_TEAMS } from "@/data/reference-content";
import { formatDate, formatNaira } from "@/lib/format";
import type { ActionTeamId, PvcStatus } from "@/types/database";

type PortalTab = "card" | "teams" | "referrals" | "toolkit" | "donations";

export default function PortalPage() {
  const router = useRouter();
  const { currentUser, state, signOut, updateCurrentUser } = useApp();
  const [activeTab, setActiveTab] = useState<PortalTab>("card");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedNotice, setSavedNotice] = useState(false);

  const userDonations = useMemo(() => {
    if (!currentUser) return [];
    return state.donations.filter(
      (d) =>
        d.user_id === currentUser.id ||
        d.donor_email.toLowerCase() === currentUser.email.toLowerCase()
    );
  }, [state.donations, currentUser]);

  const topMobilizers = useMemo(() => {
    return [...state.members]
      .sort((a, b) => (b.recruits_count ?? 0) - (a.recruits_count ?? 0))
      .slice(0, 6);
  }, [state.members]);

  if (!currentUser) {
    return (
      <div className="bg-[#FAF9F5] py-20 px-4 text-center space-y-5 min-h-[70vh]">
        <IdCard className="h-12 w-12 text-[#0B3D2E] mx-auto" aria-hidden="true" />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#0B3D2E]">
          Sign In to Access Your Member Portal
        </h1>
        <p className="text-[#4B5D56] max-w-lg mx-auto">
          View and download your NLE Digital Membership ID Card, join Action Teams, grab
          Social Media Toolkit assets, and track your grassroots referrals.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            href="/signin"
            className="rounded-xl bg-[#0B3D2E] hover:bg-[#146C43] px-6 py-3 text-sm font-bold text-white"
          >
            Sign In
          </Link>
          <Link
            href="/join"
            className="rounded-xl bg-[#E6B42C] hover:bg-[#d5a31d] px-6 py-3 text-sm font-bold text-[#07291F]"
          >
            Register Online
          </Link>
        </div>
      </div>
    );
  }

  const inviteUrl = `https://www.nlegrassroots.org/join?ref=${encodeURIComponent(
    currentUser.referral_code
  )}`;

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleTeam = (teamId: ActionTeamId) => {
    const next = currentUser.action_teams.includes(teamId)
      ? currentUser.action_teams.filter((t) => t !== teamId)
      : [...currentUser.action_teams, teamId];
    updateCurrentUser({ action_teams: next });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateCurrentUser({ avatar_url: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const isAdmin = ["national_admin", "state_coordinator", "media_editor"].includes(
    currentUser.role
  );

  return (
    <div className="bg-[#FAF9F5] pb-20">
      {/* Member Banner */}
      <section className="bg-[#0B3D2E] text-white py-10 px-4 sm:px-6 border-b-4 border-[#E6B42C] no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#F5D678]">
              Member Portal • {currentUser.member_number}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold mt-1">
              Welcome, {currentUser.full_name}
            </h1>
            <p className="text-sm text-[#D4E5DD] mt-1">
              {currentUser.state_name || currentUser.diaspora_country || "Nigeria"}
              {currentUser.lga_name ? ` • ${currentUser.lga_name} LGA` : ""}
              {currentUser.ward_name ? ` • ${currentUser.ward_name}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-xl bg-[#E6B42C] hover:bg-[#d5a31d] px-4 py-2.5 text-sm font-bold text-[#07291F]"
              >
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Open Admin Console
              </Link>
            )}
            <button
              type="button"
              onClick={() => {
                signOut();
                router.push("/");
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2.5 text-sm font-semibold text-white"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Tab Bar */}
        <div
          role="tablist"
          aria-label="Member portal sections"
          className="flex flex-wrap gap-2 border-b border-[#E2DFD5] pb-3 no-print"
        >
          {[
            { id: "card", label: "Digital ID Card", icon: IdCard },
            { id: "teams", label: "Action Teams & Status", icon: ShieldCheck },
            { id: "referrals", label: "Referral Link & Leaderboard", icon: Trophy },
            { id: "toolkit", label: "Social Media Toolkit & Groups", icon: Megaphone },
            { id: "donations", label: "Donation Receipts", icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id as PortalTab)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
                  active
                    ? "bg-[#0B3D2E] text-white"
                    : "bg-white text-[#344740] border border-[#E2DFD5] hover:bg-[#F1EFE7]"
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${active ? "text-[#E6B42C]" : "text-[#0B3D2E]"}`}
                  aria-hidden="true"
                />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: DIGITAL MEMBERSHIP ID CARD */}
        {activeTab === "card" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <DigitalIdCard member={currentUser} />
            </div>
            <div className="lg:col-span-4 rounded-2xl bg-white border border-[#E2DFD5] p-6 space-y-5 no-print">
              <h2 className="font-display text-xl font-bold text-[#0B3D2E]">
                Customize Your ID Card
              </h2>
              <p className="text-sm text-[#4B5D56]">
                Upload a clear portrait photo to personalize your downloadable PNG membership
                card.
              </p>
              <label className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#0B3D2E]/30 bg-[#FAF9F5] p-4 text-sm font-bold text-[#0B3D2E] cursor-pointer hover:bg-[#F1EFE7]">
                <Upload className="h-4 w-4 text-[#9A7009]" aria-hidden="true" />
                Upload Passport / Portrait Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="sr-only"
                />
              </label>

              <div className="rounded-xl bg-[#FDF8E6] border border-[#E6B42C]/50 p-4 text-xs text-[#344740] space-y-1">
                <p className="font-bold text-[#0B3D2E]">Your Referral Code</p>
                <p className="font-mono-num text-base font-extrabold text-[#9A7009]">
                  {currentUser.referral_code}
                </p>
                <p>
                  Recruits brought in:{" "}
                  <strong className="text-[#0B3D2E]">{currentUser.recruits_count ?? 0}</strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACTION TEAMS & PVC STATUS */}
        {activeTab === "teams" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0B3D2E]">
                  Manage Your Volunteer Action Teams
                </h2>
                <p className="text-sm text-[#4B5D56]">
                  Toggle any frontline team on or off — changes sync immediately with your ID Card
                  and chapter counts.
                </p>
              </div>
              {savedNotice && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#146C43]/15 px-3 py-1 text-xs font-bold text-[#146C43]">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  Profile updated
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.keys(ACTION_TEAMS) as ActionTeamId[]).map((id) => {
                const team = ACTION_TEAMS[id];
                const joined = currentUser.action_teams.includes(id);
                return (
                  <div
                    key={id}
                    className={`rounded-2xl p-6 border-2 flex flex-col justify-between space-y-4 ${
                      joined
                        ? "bg-white border-[#0B3D2E] shadow-sm"
                        : "bg-white/70 border-[#E2DFD5]"
                    }`}
                  >
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#9A7009]">
                        {team.badge}
                      </span>
                      <h3 className="font-display text-xl font-bold text-[#0B3D2E]">
                        {team.title}
                      </h3>
                      <p className="text-sm text-[#4B5D56]">{team.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleTeam(id)}
                      className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
                        joined
                          ? "bg-[#146C43] text-white hover:bg-[#0B3D2E]"
                          : "bg-[#0B3D2E]/10 text-[#0B3D2E] hover:bg-[#0B3D2E] hover:text-white"
                      }`}
                    >
                      {joined ? "Enrolled — Click to Leave" : "Join This Action Team"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Update PVC Status */}
            <div className="rounded-2xl bg-white border border-[#E2DFD5] p-6 space-y-3 max-w-2xl">
              <h3 className="font-display text-lg font-bold text-[#0B3D2E]">
                Update Your PVC / Supporter Status
              </h3>
              <select
                aria-label="PVC status"
                value={currentUser.pvc_status}
                onChange={(e) => {
                  updateCurrentUser({ pvc_status: e.target.value as PvcStatus });
                  setSavedNotice(true);
                  setTimeout(() => setSavedNotice(false), 2000);
                }}
                className="field-input"
              >
                <option value="has_pvc">I have my PVC (Verified Voter)</option>
                <option value="planning_pvc">Planning to Register / Transfer PVC</option>
                <option value="no_pvc_supporter">No PVC — Supporting the Cause</option>
                <option value="diaspora">Diaspora Supporter</option>
              </select>
            </div>
          </div>
        )}

        {/* TAB 3: PERSONAL REFERRAL LINK & LEADERBOARD */}
        {activeTab === "referrals" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 rounded-2xl bg-[#07291F] text-white p-7 space-y-5">
              <span className="text-xs font-bold uppercase tracking-widest text-[#F5D678]">
                Grow Your Ward &amp; Polling Unit
              </span>
              <h2 className="font-display text-3xl font-bold">
                Your Personal Mobilizer Link
              </h2>
              <p className="text-sm text-[#D4E5DD]">
                Share this link in WhatsApp groups, church/mosque community forums, or on X and
                Instagram. Every supporter who registers through your link is credited to your
                mobilizer tally!
              </p>

              <div className="rounded-xl bg-white/10 border border-white/20 p-4 space-y-3">
                <p className="font-mono-num text-sm break-all text-[#F5D678]">{inviteUrl}</p>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => copyText("ref-url", inviteUrl)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#E6B42C] px-4 py-2 text-xs font-bold text-[#07291F]"
                  >
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    {copiedId === "ref-url" ? "Link Copied!" : "Copy Invite Link"}
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Join me on the NLE Makinde/Daura APM Grassroots Support Network (Reimagine. Reset. Rebuild)! Even without a PVC you can join the Social Media Team or Outreach: ${inviteUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#146C43] hover:bg-[#1a8252] px-4 py-2 text-xs font-bold text-white"
                  >
                    <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Share on WhatsApp
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-xs text-[#BBD6C9]">Your Referral Code</p>
                  <p className="font-mono-num text-lg font-bold text-white mt-0.5">
                    {currentUser.referral_code}
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-xs text-[#BBD6C9]">Members You Mobilized</p>
                  <p className="font-mono-num text-2xl font-extrabold text-[#E6B42C] mt-0.5">
                    {currentUser.recruits_count ?? 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl bg-white border border-[#E2DFD5] p-7 space-y-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-[#9A7009]" aria-hidden="true" />
                <h2 className="font-display text-2xl font-bold text-[#0B3D2E]">
                  National Mobilizer Leaderboard
                </h2>
              </div>
              <ol className="divide-y divide-[#E2DFD5]">
                {topMobilizers.map((m, idx) => (
                  <li key={m.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-8 w-8 rounded-full font-mono-num text-xs font-extrabold flex items-center justify-center ${
                          idx === 0
                            ? "bg-[#E6B42C] text-[#07291F]"
                            : "bg-[#F1EFE7] text-[#0B3D2E]"
                        }`}
                      >
                        #{idx + 1}
                      </span>
                      <div>
                        <p className="font-bold text-sm text-[#0B3D2E]">
                          {m.full_name}
                          {m.id === currentUser.id && (
                            <span className="ml-2 text-xs text-[#146C43]">(You)</span>
                          )}
                        </p>
                        <p className="text-xs text-[#4B5D56]">
                          {m.state_name || m.diaspora_country || "Nationwide"}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono-num font-bold text-sm text-[#0B3D2E]">
                      {m.recruits_count ?? 0} recruits
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* TAB 4: SOCIAL MEDIA TOOLKIT & WHATSAPP GROUPS */}
        {activeTab === "toolkit" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-[#0B3D2E]">
                Social Media Team Toolkit &amp; Official Chapter Groups
              </h2>
              <p className="text-sm text-[#4B5D56]">
                Copy ready-to-share messages, download campaign graphics, and connect with
                official NLE WhatsApp &amp; Telegram rooms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {state.toolkit.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl bg-white border border-[#E2DFD5] p-6 flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="space-y-2">
                    <span className="inline-block rounded-full bg-[#0B3D2E]/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#0B3D2E]">
                      {item.category.replace("_", " ")}
                    </span>
                    <h3 className="font-display text-lg font-bold text-[#0B3D2E]">
                      {item.title}
                    </h3>
                    <p className="text-sm text-[#4B5D56]">{item.description}</p>
                    {item.content_text && (
                      <blockquote className="rounded-xl bg-[#FAF9F5] border border-[#E2DFD5] p-3.5 text-xs text-[#16221E] leading-relaxed">
                        {item.content_text}
                      </blockquote>
                    )}
                    {item.asset_url && (
                      <img
                        src={item.asset_url}
                        alt={item.title}
                        className="h-36 w-full object-cover rounded-xl border border-[#E2DFD5]"
                      />
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.content_text && (
                      <button
                        type="button"
                        onClick={() => copyText(item.id, item.content_text!)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B3D2E] hover:bg-[#146C43] px-4 py-2 text-xs font-bold text-white"
                      >
                        <Copy className="h-3.5 w-3.5 text-[#E6B42C]" aria-hidden="true" />
                        {copiedId === item.id ? "Copied to Clipboard!" : "Copy Text"}
                      </button>
                    )}
                    {item.external_url && (
                      <a
                        href={item.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#146C43] hover:bg-[#0B3D2E] px-4 py-2 text-xs font-bold text-white"
                      >
                        Join Official Group
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    )}
                    {item.asset_url && (
                      <a
                        href={item.asset_url}
                        download
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#E6B42C] hover:bg-[#d5a31d] px-4 py-2 text-xs font-bold text-[#07291F]"
                      >
                        Download Graphic
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DONATION HISTORY & RECEIPTS */}
        {activeTab === "donations" && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0B3D2E]">
                  Your Donation History &amp; Receipts
                </h2>
                <p className="text-sm text-[#4B5D56]">
                  All Paystack and bank transfer contributions associated with {currentUser.email}.
                </p>
              </div>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 rounded-xl bg-[#E6B42C] hover:bg-[#d5a31d] px-4 py-2.5 text-sm font-bold text-[#07291F]"
              >
                <HeartHandshake className="h-4 w-4" aria-hidden="true" />
                Support an Outreach
              </Link>
            </div>

            {userDonations.length === 0 ? (
              <div className="rounded-2xl bg-white border border-[#E2DFD5] p-10 text-center space-y-2">
                <p className="font-display text-xl font-bold text-[#0B3D2E]">
                  No donations recorded yet
                </p>
                <p className="text-sm text-[#4B5D56]">
                  Any gift you make to the General Fund or Outreach Drives will appear here with
                  downloadable receipts.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl bg-white border border-[#E2DFD5] divide-y divide-[#E2DFD5]">
                {userDonations.map((d) => (
                  <div
                    key={d.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-bold text-[#0B3D2E]">{d.campaign_title}</p>
                      <p className="text-xs text-[#4B5D56]">
                        Ref: <span className="font-mono-num">{d.reference}</span> •{" "}
                        {formatDate(d.created_at)} • {d.payment_method.replace("_", " ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono-num font-extrabold text-[#0B3D2E]">
                        {formatNaira(d.amount_ngn)}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          d.status === "verified"
                            ? "bg-[#146C43]/15 text-[#146C43]"
                            : d.status === "pending_verification"
                            ? "bg-[#E6B42C]/25 text-[#8A6204]"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {d.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

