"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Users,
  Camera,
} from "lucide-react";
import { useApp } from "@/components/AppProvider";
import {
  NON_PVC_CALLOUT_POINTS,
  PRINCIPALS_BIO,
  RESET_AGENDA_PILLARS,
} from "@/data/reference-content";
import { formatDate, formatNaira, formatNumber } from "@/lib/format";

export default function HomePage() {
  const { analyticsSummary, stateBreakdown, state } = useApp();
  const topStates = stateBreakdown.slice(0, 6);
  const maxStateCount = topStates[0]?.total_members || 1;
  const featuredAlbums = state.albums.filter((a) => a.is_published).slice(0, 3);
  const activeCampaigns = state.campaigns.filter((c) => c.is_active).slice(0, 3);

  return (
    <div className="bg-[#FAF9F5]">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#07291F] via-[#0B3D2E] to-[#124F3A] text-[#FAF9F5]">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(#E6B42C 1.25px, transparent 1.25px)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full bg-white/10 border border-[#E6B42C]/40 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-[#F5D678]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Allied Peoples Movement (APM) • Makinde / Daura 2027</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-white">
              Reimagine. Reset.{" "}
              <span className="text-[#E6B42C]">Rebuild Nigeria.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#D8E7DF] max-w-2xl leading-relaxed">
              Welcome to the{" "}
              <strong className="text-white">
                NLE Makinde/Daura APM Grassroots Support Network
              </strong>{" "}
              led by National Chairman{" "}
              <strong className="text-[#F5D678]">Ms Nikurai Maton</strong>. We
              organize everyday Nigerians across all 36 states, FCT, 774 LGAs,
              and 176,846 polling units to protect every ballot, amplify the
              Reset Agenda, and lift party members through grassroots outreaches.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href="/join"
                className="inline-flex items-center gap-2 rounded-xl bg-[#E6B42C] hover:bg-[#d5a31d] px-6 py-3.5 text-base font-bold text-[#07291F] shadow-lg transition-all"
              >
                Join the Grassroots Network
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 px-6 py-3.5 text-base font-semibold text-white transition-all"
              >
                <HeartHandshake className="h-5 w-5 text-[#E6B42C]" aria-hidden="true" />
                Fund an Outreach
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 text-xs text-[#BBD6C9]">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#E6B42C]" aria-hidden="true" />
                Instant Digital Membership ID Card
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#E6B42C]" aria-hidden="true" />
                No PVC? Still 100% Welcome
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#E6B42C]" aria-hidden="true" />
                Secretariat: Mazaram Rayfield, Jos
              </span>
            </div>
          </div>

          {/* LIVE MEMBER COUNTER & ANALYTICS CARD */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-[#FAF9F5] text-[#16221E] p-6 sm:p-7 shadow-2xl border-t-4 border-[#E6B42C] space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0B3D2E]">
                  Live Grassroots Strength
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#146C43]/10 px-2.5 py-1 text-xs font-bold text-[#146C43]">
                  <span className="h-2 w-2 rounded-full bg-[#146C43] animate-pulse" aria-hidden="true" />
                  Real-Time Count
                </span>
              </div>

              <div>
                <p className="font-mono-num text-4xl sm:text-5xl font-extrabold text-[#0B3D2E] tracking-tight">
                  {formatNumber(analyticsSummary.total_members)}
                </p>
                <p className="text-sm text-[#4B5D56] mt-1">
                  Registered supporters &amp; volunteers across{" "}
                  <strong className="text-[#0B3D2E]">
                    {analyticsSummary.states_covered} States/FCT
                  </strong>{" "}
                  and{" "}
                  <strong className="text-[#0B3D2E]">
                    {formatNumber(analyticsSummary.lgas_covered)} LGAs
                  </strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#F1EFE7] p-3.5">
                  <p className="text-xs font-semibold text-[#4B5D56]">Protect The Ballots</p>
                  <p className="font-mono-num text-xl font-bold text-[#0B3D2E] mt-0.5">
                    {formatNumber(analyticsSummary.protect_ballots_count)}
                  </p>
                </div>
                <div className="rounded-xl bg-[#F1EFE7] p-3.5">
                  <p className="text-xs font-semibold text-[#4B5D56]">Social Media Team</p>
                  <p className="font-mono-num text-xl font-bold text-[#0B3D2E] mt-0.5">
                    {formatNumber(analyticsSummary.social_media_count)}
                  </p>
                </div>
                <div className="rounded-xl bg-[#F1EFE7] p-3.5">
                  <p className="text-xs font-semibold text-[#4B5D56]">Wards Reached</p>
                  <p className="font-mono-num text-xl font-bold text-[#0B3D2E] mt-0.5">
                    {formatNumber(analyticsSummary.wards_covered)}
                  </p>
                </div>
                <div className="rounded-xl bg-[#F1EFE7] p-3.5">
                  <p className="text-xs font-semibold text-[#4B5D56]">Polling Units Active</p>
                  <p className="font-mono-num text-xl font-bold text-[#0B3D2E] mt-0.5">
                    {formatNumber(analyticsSummary.polling_units_covered)}
                  </p>
                </div>
              </div>

              <Link
                href="/analytics"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B3D2E] hover:bg-[#146C43] px-4 py-3 text-sm font-bold text-white transition-colors"
              >
                <BarChart3 className="h-4 w-4 text-[#E6B42C]" aria-hidden="true" />
                Explore State → LGA → Ward → Polling Unit Breakdown
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* BOLD "NO PVC? YOU STILL MATTER" SECTION */}
      <section className="py-16 px-4 sm:px-6 border-b border-[#E2DFD5] bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl bg-gradient-to-r from-[#FDF8E6] via-[#FAF5DF] to-[#F4EFE0] border border-[#E6B42C]/50 p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-block rounded-full bg-[#0B3D2E] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#F5D678]">
                Every Nigerian Belongs Here
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B3D2E] leading-tight">
                No PVC? Saying &ldquo;I Won&apos;t Go and Vote&rdquo;? We Have a Frontline Role for You.
              </h2>
              <p className="text-[#344740] leading-relaxed">
                Staying on the sidelines is never neutral — it automatically hands the
                incumbent a win. Whether you have a PVC, live in the diaspora, or won&apos;t
                be at a polling booth on election day, you are still a Nigerian. Step into a
                cause bigger than apathy.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href="/join?pvc=no_pvc_supporter&team=social_media"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0B3D2E] hover:bg-[#146C43] px-5 py-3 text-sm font-bold text-white transition-colors"
                >
                  Join Without a PVC Today
                  <ArrowRight className="h-4 w-4 text-[#E6B42C]" aria-hidden="true" />
                </Link>
                <Link
                  href="/action"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#0B3D2E]/30 bg-white hover:bg-[#F1EFE7] px-5 py-3 text-sm font-semibold text-[#0B3D2E] transition-colors"
                >
                  See All Volunteer Roles
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {NON_PVC_CALLOUT_POINTS.map((pt, i) => (
                <div
                  key={pt.title}
                  className="rounded-xl bg-white p-5 border border-[#E2DFD5] shadow-sm"
                >
                  <span className="font-mono-num text-xs font-bold text-[#9A7009]">
                    0{i + 1}
                  </span>
                  <h3 className="font-display text-lg font-bold text-[#0B3D2E] mt-1">
                    {pt.title}
                  </h3>
                  <p className="text-sm text-[#4B5D56] mt-2 leading-relaxed">
                    {pt.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FLAGSHIP ACTION CALLS: PROTECT THE BALLOTS & SOCIAL MEDIA TEAM */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9A7009]">
              Take Action Now
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B3D2E]">
              Two Mission-Critical Calls to Action
            </h2>
            <p className="text-[#4B5D56]">
              Pick the frontline where you can create the highest impact — or serve in both.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Protect The Ballots */}
            <article className="rounded-2xl bg-[#0B3D2E] text-white p-7 sm:p-9 flex flex-col justify-between shadow-lg border border-[#146C43]">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#E6B42C]/20 border border-[#E6B42C]/50 px-3 py-1 text-xs font-bold text-[#F5D678]">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    Flagship Action Call #1
                  </span>
                  <span className="font-mono-num text-sm font-bold text-[#F5D678]">
                    {formatNumber(analyticsSummary.protect_ballots_count)} Enrolled
                  </span>
                </div>
                <h3 className="font-display text-3xl font-bold">Protect The Ballots</h3>
                <p className="text-[#D4E5DD] leading-relaxed">
                  Democracy is won or lost at the Polling Unit. Stand up as a trained
                  community observer, ward captain, or peaceful election-day coordinator so
                  every vote for the Makinde/Daura APM ticket is counted transparently.
                </p>
                <ul className="space-y-2 text-sm text-[#E4F0EA] pt-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#E6B42C] shrink-0 mt-0.5" aria-hidden="true" />
                    Assigned directly to your Ward &amp; INEC Polling Unit
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#E6B42C] shrink-0 mt-0.5" aria-hidden="true" />
                    Free civic observation training &amp; EC8A verification checklist
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#E6B42C] shrink-0 mt-0.5" aria-hidden="true" />
                    Direct link with your State &amp; LGA Situation Room
                  </li>
                </ul>
              </div>
              <div className="pt-7">
                <Link
                  href="/join?team=protect_ballots"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#E6B42C] hover:bg-[#d5a31d] px-5 py-3 text-sm font-bold text-[#07291F] transition-colors"
                >
                  Volunteer to Protect The Ballots
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>

            {/* Social Media Team */}
            <article className="rounded-2xl bg-white text-[#16221E] p-7 sm:p-9 flex flex-col justify-between shadow-lg border-2 border-[#0B3D2E]/15">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#0B3D2E]/10 px-3 py-1 text-xs font-bold text-[#0B3D2E]">
                    <Megaphone className="h-4 w-4 text-[#9A7009]" aria-hidden="true" />
                    Flagship Action Call #2
                  </span>
                  <span className="font-mono-num text-sm font-bold text-[#146C43]">
                    {formatNumber(analyticsSummary.social_media_count)} Digital Voices
                  </span>
                </div>
                <h3 className="font-display text-3xl font-bold text-[#0B3D2E]">
                  Join the Social Media Team
                </h3>
                <p className="text-[#4B5D56] leading-relaxed">
                  No PVC required — just your smartphone and passion for a better Nigeria.
                  Amplify real facts about Governor Seyi Makinde&apos;s Oyo track record,
                  Alhaji Lawal Daura&apos;s security blueprint, and local APM outreaches across
                  WhatsApp, X, TikTok, Instagram, and Facebook.
                </p>
                <ul className="space-y-2 text-sm text-[#344740] pt-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#146C43] shrink-0 mt-0.5" aria-hidden="true" />
                    Instant access to our Member Portal Social Media Toolkit &amp; graphics
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#146C43] shrink-0 mt-0.5" aria-hidden="true" />
                    Track your personal referral link on the national Mobilizer Leaderboard
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#146C43] shrink-0 mt-0.5" aria-hidden="true" />
                    Open to students, diaspora Nigerians, and non-PVC supporters everywhere
                  </li>
                </ul>
              </div>
              <div className="pt-7">
                <Link
                  href="/join?team=social_media"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0B3D2E] hover:bg-[#146C43] px-5 py-3 text-sm font-bold text-white transition-colors"
                >
                  Volunteer for the Social Media Team
                  <ArrowRight className="h-4 w-4 text-[#E6B42C]" aria-hidden="true" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* LIVE GEOGRAPHIC SNAPSHOT */}
      <section className="py-16 px-4 sm:px-6 bg-white border-y border-[#E2DFD5]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9A7009]">
              Accessible Real-Time Transparency
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B3D2E]">
              Every Member Accounted For — From State Down to Polling Unit
            </h2>
            <p className="text-[#4B5D56] leading-relaxed">
              Explore live, aggregate-only membership coverage across all 36 states, FCT,
              774 LGAs, ~8,809 Wards, and 176,846 Polling Units. See where our network is
              surging and where your community needs new captains.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-[#E2DFD5] p-4">
                <p className="text-xs font-semibold text-[#4B5D56]">PVC Holders</p>
                <p className="font-mono-num text-2xl font-bold text-[#0B3D2E]">
                  {formatNumber(analyticsSummary.pvc_holders)}
                </p>
              </div>
              <div className="rounded-xl border border-[#E2DFD5] p-4">
                <p className="text-xs font-semibold text-[#4B5D56]">Non-PVC &amp; Diaspora Allies</p>
                <p className="font-mono-num text-2xl font-bold text-[#9A7009]">
                  {formatNumber(
                    analyticsSummary.non_pvc_supporters +
                      analyticsSummary.planning_pvc +
                      analyticsSummary.diaspora_supporters
                  )}
                </p>
              </div>
            </div>
            <Link
              href="/analytics"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0B3D2E] hover:bg-[#146C43] px-5 py-3 text-sm font-bold text-white transition-colors"
            >
              Open Full Interactive Analytics
              <ArrowRight className="h-4 w-4 text-[#E6B42C]" aria-hidden="true" />
            </Link>
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-[#E2DFD5] bg-[#FAF9F5] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-[#0B3D2E]">
                Leading Mobilized States
              </h3>
              <Link
                href="/analytics"
                className="text-xs font-bold text-[#146C43] hover:underline"
              >
                View all 37 States →
              </Link>
            </div>
            <div className="space-y-3.5">
              {topStates.map((st) => {
                const pct = Math.max(12, Math.round((st.total_members / maxStateCount) * 100));
                return (
                  <div key={st.state_id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-[#16221E]">
                        {st.state_name}{" "}
                        <span className="text-xs font-normal text-[#4B5D56]">
                          ({st.geopolitical_zone} • {st.lgas_covered} LGAs)
                        </span>
                      </span>
                      <span className="font-mono-num font-bold text-[#0B3D2E]">
                        {formatNumber(st.total_members)}
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-[#E6E3D9] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#0B3D2E] to-[#146C43]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVE FUNDRAISING OUTREACHES */}
      <section className="py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-[#9A7009]">
                Transparent Grassroots Fundraising
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B3D2E]">
                Support Party Members &amp; Community Outreaches
              </h2>
              <p className="text-[#4B5D56]">
                Donate securely in Naira or international cards via Paystack, or contribute via
                verified direct bank transfer.
              </p>
            </div>
            <Link
              href="/donate"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B3D2E] hover:text-[#146C43]"
            >
              See all outreach drives <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeCampaigns.map((camp) => {
              const pct = Math.min(
                100,
                Math.round((camp.raised_amount_ngn / camp.target_amount_ngn) * 100)
              );
              return (
                <article
                  key={camp.id}
                  className="rounded-2xl bg-white border border-[#E2DFD5] overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow"
                >
                  <img
                    src={camp.cover_image_url}
                    alt={camp.title}
                    className="h-44 w-full object-cover"
                  />
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#9A7009]">
                        {camp.location_label}
                      </span>
                      <h3 className="font-display text-xl font-bold text-[#0B3D2E] leading-snug">
                        {camp.title}
                      </h3>
                      <p className="text-sm text-[#4B5D56] line-clamp-3">
                        {camp.summary}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="space-y-1.5">
                        <div className="flex items-baseline justify-between text-sm">
                          <span className="font-mono-num font-bold text-[#0B3D2E]">
                            {formatNaira(camp.raised_amount_ngn)}
                          </span>
                          <span className="text-xs text-[#4B5D56]">
                            of {formatNaira(camp.target_amount_ngn)} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-[#ECEAE0] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#146C43]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-xs text-[#4B5D56]">
                          <strong className="text-[#16221E]">{formatNumber(camp.donor_count)}</strong>{" "}
                          grassroots supporters contributed
                        </p>
                      </div>

                      <Link
                        href={`/donate?campaign=${encodeURIComponent(camp.slug)}`}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#E6B42C] hover:bg-[#d5a31d] px-4 py-2.5 text-sm font-bold text-[#07291F] transition-colors"
                      >
                        Contribute Now
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* THE RESET AGENDA 2027 (SEYi MAKINDE & APM) */}
      <section className="py-16 px-4 sm:px-6 bg-[#07291F] text-[#FAF9F5]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-[#E6B42C]">
                The Reset Agenda 2027 • {PRINCIPALS_BIO.apm.slogan}
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                Why We Stand Behind Makinde / Daura &amp; APM
              </h2>
              <p className="text-[#C5DDD2]">
                Combining Engr. Seyi Makinde&apos;s verifiable two-term governance record in
                Oyo State with Alhaji Lawal Musa Daura&apos;s decades of national security
                leadership on the progressive platform of the Allied Peoples Movement.
              </p>
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-xl border border-[#E6B42C]/50 px-5 py-2.5 text-sm font-bold text-[#F5D678] hover:bg-[#E6B42C]/10 shrink-0"
            >
              Read Full Vision &amp; Bios
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {RESET_AGENDA_PILLARS.map((pillar) => (
              <div
                key={pillar.number}
                className="rounded-2xl bg-white/[0.06] border border-white/12 p-6 space-y-3"
              >
                <span className="font-mono-num text-2xl font-extrabold text-[#E6B42C]">
                  {pillar.number}
                </span>
                <h3 className="font-display text-xl font-bold text-white leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[#C8DDD2] leading-relaxed">
                  {pillar.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENT & OUTREACH GALLERY PREVIEW */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-[#9A7009]">
                In The Field
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B3D2E]">
                Recent Outreaches &amp; Events Gallery
              </h2>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B3D2E] hover:text-[#146C43]"
            >
              <Camera className="h-4 w-4 text-[#9A7009]" aria-hidden="true" />
              Browse all event albums →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredAlbums.map((album) => (
              <Link
                key={album.id}
                href={`/gallery?album=${encodeURIComponent(album.slug)}`}
                className="group rounded-2xl bg-white border border-[#E2DFD5] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={album.cover_image_url}
                    alt={album.title}
                    className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-[#07291F]/90 px-3 py-1 text-xs font-bold text-[#F5D678]">
                    {album.category}
                  </span>
                </div>
                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-[#4B5D56]">
                      {album.state_name} • {formatDate(album.event_date)}
                    </p>
                    <h3 className="font-display text-lg font-bold text-[#0B3D2E] group-hover:text-[#146C43] leading-snug">
                      {album.title}
                    </h3>
                    <p className="text-sm text-[#4B5D56] line-clamp-2">
                      {album.summary}
                    </p>
                  </div>
                  <p className="text-xs font-bold text-[#146C43] pt-2">
                    View {album.photos.length} photos →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL MOBILIZATION CTA */}
      <section className="py-14 px-4 sm:px-6 bg-white border-t border-[#E2DFD5]">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <Users className="h-10 w-10 text-[#0B3D2E] mx-auto" aria-hidden="true" />
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B3D2E]">
            Ready to Add Your Polling Unit — or Your Voice — to the Movement?
          </h2>
          <p className="text-[#4B5D56] max-w-2xl mx-auto">
            Registration takes less than 2 minutes. Receive your official NLE digital
            membership card, choose your Action Team, and share your referral link to grow
            your ward.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/join"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0B3D2E] hover:bg-[#146C43] px-7 py-3.5 text-base font-bold text-white transition-colors"
            >
              Register Online Now
              <ArrowRight className="h-5 w-5 text-[#E6B42C]" aria-hidden="true" />
            </Link>
            <Link
              href="/signin"
              className="inline-flex items-center gap-2 rounded-xl border border-[#0B3D2E]/25 bg-[#FAF9F5] hover:bg-[#F1EFE7] px-6 py-3.5 text-base font-semibold text-[#0B3D2E] transition-colors"
            >
              Existing Member? Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

