"use client";

import Link from "next/link";
import { MapPin, Mail, Phone, ExternalLink } from "lucide-react";
import { BrandCrest } from "./BrandCrest";
import { useApp } from "./AppProvider";

export function Footer() {
  const { state } = useApp();
  const { settings } = state;

  return (
    <footer className="bg-[#07291F] text-[#E6EFEA] mt-auto border-t-4 border-[#C89314] no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Identity */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <BrandCrest className="h-11 w-11 shrink-0" />
            <div>
              <p className="font-display text-lg font-bold text-white leading-snug">
                NLE Makinde/Daura
              </p>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#E6B42C]">
                APM Grassroots Support Network
              </p>
            </div>
          </div>
          <p className="text-sm text-[#BFD3C9] leading-relaxed">
            <strong className="text-white">{settings.motto}.</strong> A nationwide
            community mobilization and fundraising support network advancing the
            Makinde/Daura Allied Peoples Movement (APM) ticket across all 36 states,
            FCT, 774 LGAs, and 176,846 polling units.
          </p>
          <p className="text-xs text-[#9AB8AA]">
            National Chairman: <span className="text-white font-semibold">{settings.national_chairman}</span>
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#E6B42C] mb-4">
            Movement Hub
          </h2>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/about" className="hover:text-[#E6B42C] transition-colors">About &amp; The Reset Agenda 2027</Link></li>
            <li><Link href="/analytics" className="hover:text-[#E6B42C] transition-colors">Live Member Analytics (State → PU)</Link></li>
            <li><Link href="/action" className="hover:text-[#E6B42C] transition-colors">Protect The Ballots &amp; Social Media Team</Link></li>
            <li><Link href="/gallery" className="hover:text-[#E6B42C] transition-colors">Event &amp; Outreach Gallery</Link></li>
            <li><Link href="/donate" className="hover:text-[#E6B42C] transition-colors">Donate &amp; Fundraising Outreaches</Link></li>
            <li><Link href="/news" className="hover:text-[#E6B42C] transition-colors">News &amp; Press Updates</Link></li>
          </ul>
        </div>

        {/* Member & Party Links */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#E6B42C] mb-4">
            Get Involved
          </h2>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/join" className="hover:text-[#E6B42C] transition-colors">Online Membership &amp; Volunteer Form</Link></li>
            <li><Link href="/signin" className="hover:text-[#E6B42C] transition-colors">Member Portal &amp; Digital ID Card</Link></li>
            <li><Link href="/admin" className="hover:text-[#E6B42C] transition-colors">Coordinator &amp; Admin Console</Link></li>
            <li className="pt-2 border-t border-white/10">
              <a
                href="https://seyimakinde.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#D8E7DF] hover:text-[#E6B42C]"
              >
                Seyi Makinde Official Platform
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </li>
            <li>
              <a
                href="https://apm.org.ng/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[#D8E7DF] hover:text-[#E6B42C]"
              >
                Allied Peoples Movement (APM)
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </div>

        {/* National Secretariat */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#E6B42C] mb-4">
            National Secretariat
          </h2>
          <ul className="space-y-3 text-sm text-[#CBE0D5]">
            <li className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-[#E6B42C] shrink-0 mt-0.5" aria-hidden="true" />
              <span>{settings.secretariat_address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-[#E6B42C] shrink-0" aria-hidden="true" />
              <a href={`mailto:${settings.contact_email}`} className="hover:text-white">
                {settings.contact_email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-[#E6B42C] shrink-0" aria-hidden="true" />
              <span>{settings.contact_phone}</span>
            </li>
          </ul>
          <p className="mt-4 text-xs text-[#8EB0A0]">
            APM National HQ: Plot 232, No. 2 Leventis Building, CBD, Abuja, FCT.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 px-4 text-xs text-[#9AB8AA]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © {new Date().getFullYear()} {settings.org_name} (www.nlegrassroots.org). All rights reserved.
          </p>
          <p>APM — Nigeria First • Integrity, Sacrifice, Service</p>
        </div>
      </div>
    </footer>
  );
}

