"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download, Printer, ShieldCheck, CheckCircle2 } from "lucide-react";
import type { MemberProfile } from "@/types/database";
import { ACTION_TEAMS } from "@/data/reference-content";
import { BrandCrest } from "./BrandCrest";
import { formatDate } from "@/lib/format";

const PVC_LABELS: Record<MemberProfile["pvc_status"], string> = {
  has_pvc: "PVC Verified Voter",
  planning_pvc: "Registering for PVC",
  no_pvc_supporter: "Grassroots Cause Supporter",
  diaspora: "Diaspora Supporter",
};

export function DigitalIdCard({ member }: { member: MemberProfile }) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [downloading, setDownloading] = useState(false);

  const verifyPayload = `https://www.nlegrassroots.org/verify?id=${encodeURIComponent(
    member.member_number
  )}`;

  useEffect(() => {
    QRCode.toDataURL(verifyPayload, {
      width: 200,
      margin: 1,
      color: { dark: "#0B3D2E", light: "#FFFFFF" },
    })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [verifyPayload]);

  const initials = member.full_name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  const locationSummary =
    member.pvc_status === "diaspora"
      ? `Diaspora (${member.diaspora_country || "Global"})${
          member.state_name ? ` • Origin: ${member.state_name}` : ""
        }`
      : [member.state_name, member.lga_name, member.ward_name || member.custom_ward]
          .filter(Boolean)
          .join(" • ") || "Nigeria Grassroots Chapter";

  const handleDownloadPng = async () => {
    setDownloading(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 740;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background Gradient (Deep Forest Green)
      const grad = ctx.createLinearGradient(0, 0, 1200, 740);
      grad.addColorStop(0, "#07291F");
      grad.addColorStop(0.6, "#0B3D2E");
      grad.addColorStop(1, "#145A41");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 740);

      // Gold & White APM Stripes
      ctx.fillStyle = "#E6B42C";
      ctx.fillRect(0, 0, 1200, 18);
      ctx.fillStyle = "#FAF9F5";
      ctx.fillRect(0, 18, 1200, 8);

      // Header text
      ctx.fillStyle = "#E6B42C";
      ctx.font = "bold 20px sans-serif";
      ctx.fillText("OFFICIAL DIGITAL MEMBERSHIP CARD", 54, 82);

      ctx.fillStyle = "#FAF9F5";
      ctx.font = "bold 36px Georgia, serif";
      ctx.fillText("NLE Makinde/Daura APM Grassroots Support Network", 54, 130);

      ctx.fillStyle = "#C5DDD2";
      ctx.font = "600 18px sans-serif";
      ctx.fillText("REIMAGINE. RESET. REBUILD  •  WWW.NLEGRASSROOTS.ORG", 54, 165);

      // Divider
      ctx.fillStyle = "rgba(230, 180, 44, 0.45)";
      ctx.fillRect(54, 192, 1092, 2);

      // Avatar circle
      ctx.fillStyle = "#E6B42C";
      ctx.beginPath();
      ctx.arc(138, 315, 76, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#0B3D2E";
      ctx.font = "bold 54px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(initials || "NL", 138, 334);
      ctx.textAlign = "left";

      // Member Details
      ctx.fillStyle = "#FAF9F5";
      ctx.font = "bold 46px Georgia, serif";
      ctx.fillText(member.full_name, 252, 286);

      ctx.fillStyle = "#E6B42C";
      ctx.font = "bold 24px monospace";
      ctx.fillText(member.member_number, 252, 330);

      ctx.fillStyle = "#D4E5DD";
      ctx.font = "600 21px sans-serif";
      ctx.fillText(locationSummary, 252, 376);

      if (member.polling_unit_name || member.custom_polling_unit) {
        ctx.fillStyle = "#A9C9BC";
        ctx.font = "500 18px sans-serif";
        ctx.fillText(
          `Polling Unit: ${member.polling_unit_name || member.custom_polling_unit}`,
          252,
          412
        );
      }

      // Badges
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(54, 468, 760, 118);
      ctx.strokeStyle = "rgba(230,180,44,0.4)";
      ctx.lineWidth = 2;
      ctx.strokeRect(54, 468, 760, 118);

      ctx.fillStyle = "#E6B42C";
      ctx.font = "bold 17px sans-serif";
      ctx.fillText("STATUS & ACTIVE ACTION TEAMS", 78, 504);

      const teamNames = member.action_teams.length
        ? member.action_teams.map((id) => ACTION_TEAMS[id]?.title ?? id).join("  •  ")
        : "General Grassroots Member";

      ctx.fillStyle = "#FAF9F5";
      ctx.font = "600 20px sans-serif";
      ctx.fillText(`${PVC_LABELS[member.pvc_status]}`, 78, 536);
      ctx.fillStyle = "#CBE0D5";
      ctx.font = "500 18px sans-serif";
      ctx.fillText(teamNames.slice(0, 74), 78, 566);

      // QR Code box
      if (qrDataUrl) {
        const img = new Image();
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = qrDataUrl;
        });
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(910, 250, 236, 236);
        ctx.drawImage(img, 922, 262, 212, 212);
        ctx.fillStyle = "#D4E5DD";
        ctx.font = "600 15px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("SCAN TO VERIFY", 1028, 514);
        ctx.textAlign = "left";
      }

      // Footer
      ctx.fillStyle = "#A9C9BC";
      ctx.font = "500 17px sans-serif";
      ctx.fillText(
        `National Secretariat: No. 8 Rabo House Plaza, Mazaram Rayfield, Jos  •  Joined ${formatDate(
          member.created_at
        )}`,
        54,
        666
      );
      ctx.fillStyle = "#E6B42C";
      ctx.font = "bold 17px sans-serif";
      ctx.fillText("Signed: Ms Nikurai Maton (National Chairman)", 54, 700);

      const link = document.createElement("a");
      link.download = `${member.member_number}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#07291F] via-[#0B3D2E] to-[#145A41] text-[#FAF9F5] shadow-xl border border-[#C89314]/40">
        {/* APM Gold + White Top Ribbon */}
        <div className="h-2 bg-[#E6B42C]" />
        <div className="h-1 bg-[#FAF9F5]" />

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <BrandCrest className="h-12 w-12 shrink-0" />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E6B42C]">
                  Official Membership Card
                </p>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-tight">
                  NLE Makinde/Daura APM Grassroots
                </h3>
                <p className="text-xs text-[#C2D9CE]">Reimagine. Reset. Rebuild</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#E6B42C]/15 border border-[#E6B42C]/50 px-2.5 py-1 text-xs font-semibold text-[#F5D678]">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Active
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2 border-t border-white/15">
            <div className="flex items-center gap-4">
              {member.avatar_url ? (
                <img
                  src={member.avatar_url}
                  alt={member.full_name}
                  className="h-20 w-20 rounded-full object-cover border-2 border-[#E6B42C]"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-[#E6B42C] text-[#07291F] font-display text-2xl font-bold flex items-center justify-center border-2 border-white/60 shrink-0">
                  {initials || "NL"}
                </div>
              )}
              <div className="space-y-1">
                <p className="font-display text-2xl font-bold text-white leading-tight">
                  {member.full_name}
                </p>
                <p className="font-mono-num text-sm font-bold text-[#F5D678] tracking-wider">
                  {member.member_number}
                </p>
                <p className="text-xs text-[#D4E5DD]">{locationSummary}</p>
                {(member.polling_unit_name || member.custom_polling_unit) && (
                  <p className="text-xs text-[#A9C9BC]">
                    PU: {member.polling_unit_code ? `${member.polling_unit_code} — ` : ""}
                    {member.polling_unit_name || member.custom_polling_unit}
                  </p>
                )}
              </div>
            </div>

            {qrDataUrl && (
              <div className="bg-white p-2 rounded-xl shadow-md shrink-0 self-start sm:self-center">
                <img
                  src={qrDataUrl}
                  alt={`Verification QR code for ${member.member_number}`}
                  className="h-24 w-24"
                />
                <p className="text-[10px] font-bold text-[#0B3D2E] text-center mt-1 tracking-wider">
                  VERIFY ID
                </p>
              </div>
            )}
          </div>

          <div className="rounded-xl bg-white/10 border border-white/15 p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#146C43] px-2.5 py-1 text-xs font-semibold text-white">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#E6B42C]" aria-hidden="true" />
                {PVC_LABELS[member.pvc_status]}
              </span>
              {member.action_teams.map((teamId) => (
                <span
                  key={teamId}
                  className="rounded-full bg-[#E6B42C]/20 border border-[#E6B42C]/40 px-2.5 py-1 text-xs font-semibold text-[#F5D678]"
                >
                  {ACTION_TEAMS[teamId]?.title ?? teamId}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-[#C2D9CE]">
              Joined {formatDate(member.created_at)}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#A9C9BC] pt-1">
            <span>No. 8 Rabo House Plaza, Mazaram Rayfield, Jos</span>
            <span className="text-[#F5D678] font-semibold">
              National Chairman: Ms Nikurai Maton
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 no-print">
        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={downloading}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0B3D2E] hover:bg-[#146C43] px-4 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60"
        >
          <Download className="h-4 w-4 text-[#E6B42C]" aria-hidden="true" />
          {downloading ? "Generating PNG..." : "Download ID Card (PNG)"}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg border border-[#0B3D2E]/25 bg-white hover:bg-[#F1EFE7] px-4 py-2.5 text-sm font-semibold text-[#0B3D2E] transition-colors"
        >
          <Printer className="h-4 w-4" aria-hidden="true" />
          Print / Save PDF
        </button>
      </div>
    </div>
  );
}

