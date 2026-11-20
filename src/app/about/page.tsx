"use client";

import Link from "next/link";
import {
  Award,
  Building2,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Shield,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { PRINCIPALS_BIO, RESET_AGENDA_PILLARS } from "@/data/reference-content";

export default function AboutPage() {
  const { state } = useApp();
  const { settings } = state;

  return (
    <div className="bg-[#FAF9F5]">
      {/* Page Header */}
      <section className="bg-[#0B3D2E] text-white py-16 px-4 sm:px-6 border-b-4 border-[#E6B42C]">
        <div className="max-w-7xl mx-auto space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5D678]">
            About The Network &amp; Platform
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold max-w-4xl leading-tight">
            {settings.org_name}
          </h1>
          <p className="text-lg text-[#D4E5DD] max-w-3xl leading-relaxed">
            <strong className="text-[#E6B42C]">{settings.motto}.</strong> A national
            grassroots organizing, ballot protection, and member welfare coalition
            mobilizing everyday Nigerians for the Allied Peoples Movement (APM) and the
            Makinde/Daura 2027 ticket.
          </p>
        </div>
      </section>

      {/* Leadership & National Secretariat */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#9A7009]">
                Our Grassroots Mission
              </span>
              <h2 className="font-display text-3xl font-bold text-[#0B3D2E]">
                Organizing From the Polling Unit Up — Leaving No Nigerian Behind
              </h2>
              <p className="text-[#344740] leading-relaxed">
                Headquartered in Mazaram Rayfield, Jos, Plateau State, and operating across
                every geopolitical zone of Nigeria, the{" "}
                <strong>NLE Makinde/Daura APM Grassroots Support Network</strong> was built
                around a simple truth: lasting political change requires disciplined
                grassroots structure, transparent member support, and inclusive civic
                participation.
              </p>
              <p className="text-[#344740] leading-relaxed">
                Through our online membership portal, real-time State-to-Polling-Unit
                analytics, fundraising outreaches, and twin Action Calls —{" "}
                <strong>Protect The Ballots</strong> and our{" "}
                <strong>Social Media Team</strong> — we ensure that every Nigerian, whether
                a PVC holder, first-time voter, or non-voting supporter on the sidelines, has
                a meaningful place in building Nigeria&apos;s reset.
              </p>
            </div>

            {/* Secretariat Card */}
            <div className="lg:col-span-5 rounded-2xl bg-white border border-[#E2DFD5] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#0B3D2E] text-[#E6B42C] flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-[#0B3D2E]">
                    National Secretariat
                  </h3>
                  <p className="text-xs font-semibold text-[#9A7009]">
                    Jos, Plateau State
                  </p>
                </div>
              </div>
              <p className="text-sm text-[#344740] flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#146C43] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{settings.secretariat_address}</span>
              </p>
              <div className="rounded-xl bg-[#FAF9F5] border border-[#E2DFD5] p-4 space-y-1.5 text-sm">
                <p>
                  <strong className="text-[#0B3D2E]">National Chairman:</strong>{" "}
                  {settings.national_chairman}
                </p>
                <p>
                  <strong className="text-[#0B3D2E]">Email:</strong> {settings.contact_email}
                </p>
                <p>
                  <strong className="text-[#0B3D2E]">Official Domain:</strong>{" "}
                  www.nlegrassroots.org
                </p>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  settings.secretariat_address
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#146C43] hover:underline"
              >
                Open Secretariat Location in Google Maps
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Leadership Directory */}
          <div className="space-y-6 pt-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#9A7009]">
                  National Executive Leadership
                </p>
                <h2 className="font-display text-3xl font-bold text-[#0B3D2E]">
                  Meet the Leadership Team
                </h2>
              </div>
              <span className="text-xs text-[#4B5D56]">
                Executive profiles &amp; portraits can be updated anytime in Admin Settings
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {settings.leadership.map((leader) => (
                <article
                  key={leader.id}
                  className={`rounded-2xl p-6 flex flex-col justify-between border ${
                    leader.is_featured
                      ? "bg-[#0B3D2E] text-white border-[#E6B42C]"
                      : "bg-white text-[#16221E] border-[#E2DFD5]"
                  }`}
                >
                  <div className="space-y-3">
                    <div
                      className={`h-14 w-14 rounded-full flex items-center justify-center font-display text-xl font-bold ${
                        leader.is_featured
                          ? "bg-[#E6B42C] text-[#07291F]"
                          : "bg-[#0B3D2E]/10 text-[#0B3D2E]"
                      }`}
                    >
                      {leader.name
                        .split(" ")
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-bold leading-snug">
                        {leader.name}
                      </h3>
                      <p
                        className={`text-xs font-bold uppercase tracking-wider mt-0.5 ${
                          leader.is_featured ? "text-[#F5D678]" : "text-[#9A7009]"
                        }`}
                      >
                        {leader.title}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          leader.is_featured ? "text-[#BBD6C9]" : "text-[#4B5D56]"
                        }`}
                      >
                        {leader.zone_or_state}
                      </p>
                    </div>
                    <p
                      className={`text-sm leading-relaxed ${
                        leader.is_featured ? "text-[#DCEAE3]" : "text-[#4B5D56]"
                      }`}
                    >
                      {leader.bio}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* THE PRINCIPALS: SEYI MAKINDE & LAWAL MUSA DAURA */}
      <section className="py-16 px-4 sm:px-6 bg-white border-y border-[#E2DFD5]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="space-y-2 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9A7009]">
              The 2027 APM Presidential Ticket
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B3D2E]">
              Competence, Engineering Discipline &amp; National Security Experience
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Seyi Makinde */}
            <article className="rounded-2xl border border-[#E2DFD5] bg-[#FAF9F5] p-7 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0B3D2E] px-3 py-1 text-xs font-bold text-[#F5D678]">
                    <Award className="h-3.5 w-3.5" aria-hidden="true" />
                    Presidential Candidate (APM)
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0B3D2E] mt-2">
                    {PRINCIPALS_BIO.makinde.name}
                  </h3>
                  <p className="text-sm font-semibold text-[#9A7009]">
                    {PRINCIPALS_BIO.makinde.headline}
                  </p>
                </div>
              </div>
              <p className="text-sm text-[#344740] leading-relaxed">
                {PRINCIPALS_BIO.makinde.summary}
              </p>
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#0B3D2E]">
                  Verifiable Governance Track Record in Oyo State
                </p>
                <ul className="space-y-2 text-sm text-[#344740]">
                  {PRINCIPALS_BIO.makinde.trackRecord.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#146C43] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-[#4B5D56] border-t border-[#E2DFD5]">
                <span>{PRINCIPALS_BIO.makinde.source}</span>
                <a
                  href="https://seyimakinde.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#0B3D2E] hover:underline inline-flex items-center gap-1"
                >
                  seyimakinde.com <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              </div>
            </article>

            {/* Lawal Musa Daura */}
            <article className="rounded-2xl border border-[#E2DFD5] bg-[#FAF9F5] p-7 space-y-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#146C43] px-3 py-1 text-xs font-bold text-white">
                  <Shield className="h-3.5 w-3.5 text-[#E6B42C]" aria-hidden="true" />
                  Vice-Presidential Candidate (APM)
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0B3D2E] mt-2">
                  {PRINCIPALS_BIO.daura.name}
                </h3>
                <p className="text-sm font-semibold text-[#9A7009]">
                  {PRINCIPALS_BIO.daura.headline}
                </p>
              </div>
              <p className="text-sm text-[#344740] leading-relaxed">
                {PRINCIPALS_BIO.daura.summary}
              </p>
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#0B3D2E]">
                  Core Security &amp; Governance Strengths
                </p>
                <ul className="space-y-2 text-sm text-[#344740]">
                  {PRINCIPALS_BIO.daura.trackRecord.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#146C43] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-2 text-xs text-[#4B5D56] border-t border-[#E2DFD5]">
                {PRINCIPALS_BIO.daura.source}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* THE RESET AGENDA 2027 & APM PARTY OVERVIEW */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="space-y-3 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#9A7009]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Policy Blueprint
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0B3D2E]">
              The Reset Agenda 2027 — Four Interconnected Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RESET_AGENDA_PILLARS.map((pillar) => (
              <div
                key={pillar.number}
                className="rounded-2xl bg-white border border-[#E2DFD5] p-7 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono-num text-sm font-extrabold rounded-lg bg-[#0B3D2E] text-[#E6B42C] px-3 py-1">
                    PILLAR {pillar.number}
                  </span>
                  <span className="text-xs text-[#4B5D56]">{pillar.source}</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-[#0B3D2E]">
                  {pillar.title}
                </h3>
                <p className="text-sm text-[#344740] leading-relaxed">
                  {pillar.summary}
                </p>
                <ul className="space-y-1.5 text-sm text-[#344740] pt-1">
                  {pillar.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#146C43] shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* About Allied Peoples Movement (APM) */}
          <div className="rounded-2xl bg-[#07291F] text-white p-7 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[#E6B42C]">
                Our Political Party • Adapted from apm.org.ng
              </p>
              <h2 className="font-display text-3xl font-bold">
                {PRINCIPALS_BIO.apm.name}
              </h2>
              <p className="text-[#D4E5DD] leading-relaxed">
                <strong>Mission:</strong> {PRINCIPALS_BIO.apm.mission}
                <br />
                <strong>Vision:</strong> {PRINCIPALS_BIO.apm.vision}
              </p>
              <div className="flex flex-wrap gap-3 text-xs">
                <span className="rounded-full bg-white/10 px-3 py-1.5 font-semibold text-[#F5D678]">
                  Slogan: {PRINCIPALS_BIO.apm.slogan}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1.5 font-semibold text-white">
                  Motto: {PRINCIPALS_BIO.apm.motto}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1.5 font-semibold text-white">
                  Colors: {PRINCIPALS_BIO.apm.colors}
                </span>
              </div>
              <p className="text-xs text-[#A9C9BC]">
                APM National Chairman: {PRINCIPALS_BIO.apm.nationalChairman} • National
                Secretary: {PRINCIPALS_BIO.apm.nationalSecretary} • HQ:{" "}
                {PRINCIPALS_BIO.apm.nationalSecretariat}
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link
                href="/join"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E6B42C] hover:bg-[#d5a31d] px-5 py-3 text-sm font-bold text-[#07291F] transition-colors"
              >
                <UserCheck className="h-4 w-4" aria-hidden="true" />
                Join NLE APM Grassroots
              </Link>
              <a
                href={PRINCIPALS_BIO.apm.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 hover:bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors"
              >
                Visit apm.org.ng <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

