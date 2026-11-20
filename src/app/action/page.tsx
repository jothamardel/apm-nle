"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  Megaphone,
  ShieldCheck,
  Users,
} from "lucide-react";
import { ACTION_TEAMS, NON_PVC_CALLOUT_POINTS } from "@/data/reference-content";
import { useApp } from "@/components/AppProvider";
import { formatNumber } from "@/lib/format";
import type { ActionTeamId } from "@/types/database";

const ICONS: Record<ActionTeamId, typeof ShieldCheck> = {
  protect_ballots: ShieldCheck,
  social_media: Megaphone,
  grassroots_mobilization: Users,
  fundraising_outreach: HeartHandshake,
};

export default function ActionPage() {
  const { analyticsSummary } = useApp();

  const teamCounts: Record<ActionTeamId, number> = {
    protect_ballots: analyticsSummary.protect_ballots_count,
    social_media: analyticsSummary.social_media_count,
    grassroots_mobilization: analyticsSummary.grassroots_mobilization_count,
    fundraising_outreach: analyticsSummary.fundraising_outreach_count,
  };

  return (
    <div className="bg-[#FAF9F5] pb-20">
      <section className="bg-[#0B3D2E] text-white py-16 px-4 sm:px-6 border-b-4 border-[#E6B42C]">
        <div className="max-w-7xl mx-auto space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5D678]">
            Action Calls • Step Off The Sidelines
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold max-w-3xl leading-tight">
            Protect The Ballots. Power The Social Media Team. Lift Your Community.
          </h1>
          <p className="text-lg text-[#D4E5DD] max-w-3xl">
            Whether you hold a PVC, don&apos;t plan to queue on election day, or live abroad —
            staying silent hands the incumbent an automatic win. Pick an Action Team and make
            your Nigerian voice count.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 space-y-16">
        {/* All 4 Action Teams */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Object.keys(ACTION_TEAMS) as ActionTeamId[]).map((id, idx) => {
            const team = ACTION_TEAMS[id];
            const Icon = ICONS[id];
            const isFlagship = idx < 2;

            return (
              <article
                key={team.id}
                className={`rounded-2xl p-7 sm:p-8 flex flex-col justify-between shadow-sm border ${
                  isFlagship
                    ? "bg-white border-[#0B3D2E]/25 ring-1 ring-[#E6B42C]/40"
                    : "bg-white border-[#E2DFD5]"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#0B3D2E]/10 px-3 py-1 text-xs font-bold text-[#0B3D2E]">
                      <Icon className="h-4 w-4 text-[#9A7009]" aria-hidden="true" />
                      {team.badge}
                    </span>
                    <span className="font-mono-num text-xs font-bold text-[#146C43]">
                      {formatNumber(teamCounts[id])} Active
                    </span>
                  </div>

                  <div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B3D2E]">
                      {team.title}
                    </h2>
                    <p className="text-sm font-semibold text-[#9A7009] mt-1">
                      {team.tagline}
                    </p>
                  </div>

                  <p className="text-sm text-[#344740] leading-relaxed">
                    {team.description}
                  </p>

                  <ul className="space-y-2 pt-2 text-sm text-[#344740]">
                    {team.commitments.map((c) => (
                      <li key={c} className="flex items-start gap-2">
                        <CheckCircle2
                          className="h-4 w-4 text-[#146C43] shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-4 border-t border-[#E2DFD5] flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-[#4B5D56]">
                    PVC Required? <strong className="text-[#146C43]">No — Open to All</strong>
                  </span>
                  <Link
                    href={`/join?team=${team.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0B3D2E] hover:bg-[#146C43] px-5 py-2.5 text-sm font-bold text-white transition-colors"
                  >
                    Volunteer Now
                    <ArrowRight className="h-4 w-4 text-[#E6B42C]" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            );
          })}
        </section>

        {/* Dedicated "No PVC? You Still Matter" Explainer */}
        <section className="rounded-2xl bg-[#07291F] text-white p-8 sm:p-12 space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="inline-block rounded-full bg-[#E6B42C] px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#07291F]">
              To Everyone Saying &ldquo;I Don&apos;t Have a PVC&rdquo;
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
              You Are Still Nigerian. Don&apos;t Let Apathy Hand Over Our Future.
            </h2>
            <p className="text-[#D4E5DD] leading-relaxed">
              Millions of smart, patriotic Nigerians missed registration, relocated across
              states, study abroad, or feel disillusioned about standing in election queues.
              We refuse to write you off. Here is exactly how you shift the election without
              ever staying on the sidelines:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {NON_PVC_CALLOUT_POINTS.map((point, index) => (
              <div
                key={point.title}
                className="rounded-xl bg-white/[0.07] border border-white/15 p-6 space-y-2"
              >
                <span className="font-mono-num text-xs font-bold text-[#E6B42C]">
                  ACTION PATH 0{index + 1}
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  {point.title}
                </h3>
                <p className="text-sm text-[#D4E5DD] leading-relaxed">{point.body}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/join?pvc=no_pvc_supporter&team=social_media"
              className="inline-flex items-center gap-2 rounded-xl bg-[#E6B42C] hover:bg-[#d5a31d] px-6 py-3.5 text-sm font-bold text-[#07291F] transition-colors"
            >
              Sign Up as a Non-PVC / Digital Volunteer
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/donate"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 hover:bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition-colors"
            >
              Sponsor a Grassroots Outreach
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

