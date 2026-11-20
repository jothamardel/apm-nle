"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Menu, ShieldCheck, UserCircle2, HeartHandshake } from "lucide-react";
import { BrandCrest } from "./BrandCrest";
import { useApp } from "./AppProvider";
import { formatNumber } from "@/lib/format";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About & Vision" },
  { href: "/analytics", label: "Live Analytics" },
  { href: "/action", label: "Take Action" },
  { href: "/gallery", label: "Gallery" },
  { href: "/news", label: "News" },
];

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, analyticsSummary, isLiveSupabase } = useApp();
  const menuRef = useRef<HTMLUListElement>(null);

  // Sync native popover attribute with viewport size per modern-web-guidance `navbar` guide
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    const mq = window.matchMedia("(min-width: 1024px)");
    const syncPopoverAttr = () => {
      if (mq.matches) {
        menu.removeAttribute("popover");
      } else {
        menu.setAttribute("popover", "auto");
      }
    };
    syncPopoverAttr();
    mq.addEventListener("change", syncPopoverAttr);
    return () => mq.removeEventListener("change", syncPopoverAttr);
  }, []);

  const closeMobileMenu = () => {
    const menu = menuRef.current as (HTMLUListElement & { hidePopover?: () => void }) | null;
    if (menu && menu.hasAttribute("popover")) {
      try {
        menu.hidePopover?.();
      } catch {
        // ignore if already closed
      }
    }
  };

  const isAdmin =
    currentUser &&
    ["national_admin", "state_coordinator", "media_editor"].includes(currentUser.role);

  return (
    <header className="site-header no-print">
      {/* Top Motto & Live Counter Strip */}
      <div className="bg-[#0B3D2E] text-[#FAF9F5] text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <span className="inline-block h-2 w-2 rounded-full bg-[#E6B42C] animate-pulse" aria-hidden="true" />
            <span>NLE Makinde/Daura APM Grassroots Support Network</span>
            <span className="hidden sm:inline text-[#E6B42C]">• Reimagine. Reset. Rebuild</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/analytics"
              className="inline-flex items-center gap-1.5 font-mono-num text-[#F5D678] hover:text-white transition-colors"
            >
              <span className="font-bold">{formatNumber(analyticsSummary.total_members)}</span>
              <span className="hidden xs:inline">Mobilized Across 36 States + FCT</span>
              <span className="xs:hidden">Members</span>
            </Link>
            {!isLiveSupabase && (
              <span className="hidden md:inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-[#D7E6DE]">
                Interactive Preview
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Single-Tree Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 focus-visible:outline-2 focus-visible:outline-[#C89314] rounded-lg"
        >
          <BrandCrest className="h-10 w-10 shrink-0" />
          <div className="leading-tight">
            <span className="block font-display text-base sm:text-lg font-bold text-[#0B3D2E] tracking-tight">
              NLE Grassroots
            </span>
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#9A7009]">
              Makinde / Daura • APM
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2" aria-label="Primary">
          <ul ref={menuRef} id="site-menu" className="site-menu">
            {NAV_ITEMS.map((item) => {
              const isCurrent =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent ? "page" : undefined}
                    onClick={closeMobileMenu}
                    className="nav-link w-full lg:w-auto"
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}

            {isAdmin && (
              <li>
                <Link
                  href="/admin"
                  aria-current={pathname.startsWith("/admin") ? "page" : undefined}
                  onClick={closeMobileMenu}
                  className="nav-link w-full lg:w-auto text-[#0B3D2E]"
                >
                  <ShieldCheck className="h-4 w-4 text-[#C89314]" aria-hidden="true" />
                  Admin
                </Link>
              </li>
            )}

            <li className="pt-2 mt-1 border-t border-[#E2DFD5] lg:border-0 lg:pt-0 lg:mt-0 lg:ml-2 flex flex-col lg:flex-row gap-2">
              <Link
                href="/donate"
                onClick={closeMobileMenu}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#E6B42C] hover:bg-[#d5a31d] px-3.5 py-2 text-sm font-bold text-[#07291F] transition-colors"
              >
                <HeartHandshake className="h-4 w-4" aria-hidden="true" />
                Donate
              </Link>

              {currentUser ? (
                <Link
                  href="/portal"
                  onClick={closeMobileMenu}
                  aria-current={pathname.startsWith("/portal") ? "page" : undefined}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0B3D2E] hover:bg-[#146C43] px-3.5 py-2 text-sm font-semibold text-white transition-colors"
                >
                  <UserCircle2 className="h-4 w-4 text-[#E6B42C]" aria-hidden="true" />
                  <span>{currentUser.full_name.split(" ")[0]}</span>
                </Link>
              ) : (
                <div className="flex flex-col lg:flex-row gap-2">
                  <Link
                    href="/signin"
                    onClick={closeMobileMenu}
                    className="inline-flex items-center justify-center rounded-lg border border-[#0B3D2E]/25 bg-white hover:bg-[#F1EFE7] px-3.5 py-2 text-sm font-semibold text-[#0B3D2E] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/join"
                    onClick={closeMobileMenu}
                    className="inline-flex items-center justify-center rounded-lg bg-[#0B3D2E] hover:bg-[#146C43] px-4 py-2 text-sm font-semibold text-white transition-colors"
                  >
                    Join Movement
                  </Link>
                </div>
              )}
            </li>
          </ul>

          <button
            type="button"
            className="menu-button inline-flex items-center gap-1.5 rounded-lg border border-[#0B3D2E]/20 bg-white px-3 py-2 text-sm font-semibold text-[#0B3D2E] hover:bg-[#F1EFE7]"
            aria-controls="site-menu"
            {...({
              popovertarget: "site-menu",
              popovertargetaction: "toggle",
            } as Record<string, string>)}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span>Menu</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

