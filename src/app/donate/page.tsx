"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  Copy,
  CreditCard,
  HeartHandshake,
  Printer,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { useFormValidationSync } from "@/hooks/useFormValidationSync";
import { formatDate, formatNaira, formatNumber } from "@/lib/format";
import type { DonationRecord } from "@/types/database";

const PRESET_AMOUNTS = [2500, 5000, 10000, 25000, 50000, 100000];

function DonateContent() {
  const { state, currentUser, recordDonation } = useApp();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  useFormValidationSync(formRef);

  const activeCampaigns = state.campaigns.filter((c) => c.is_active);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(
    activeCampaigns[0]?.id ?? ""
  );
  const [amount, setAmount] = useState<number>(10000);
  const [frequency, setFrequency] = useState<"one_time" | "monthly">("one_time");
  const [paymentMethod, setPaymentMethod] = useState<"paystack" | "bank_transfer">("paystack");

  const [donorName, setDonorName] = useState(currentUser?.full_name ?? "");
  const [donorEmail, setDonorEmail] = useState(currentUser?.email ?? "");
  const [donorPhone, setDonorPhone] = useState(currentUser?.phone ?? "");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState("");
  const [transferBank, setTransferBank] = useState("");
  const [transferSender, setTransferSender] = useState("");
  const [receiptFileName, setReceiptFileName] = useState("");
  const [receiptDataUrl, setReceiptDataUrl] = useState<string | undefined>(undefined);

  const [copiedAcc, setCopiedAcc] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completedDonation, setCompletedDonation] = useState<DonationRecord | null>(null);

  useEffect(() => {
    const slug = searchParams.get("campaign");
    if (!slug) return;
    const match = activeCampaigns.find((c) => c.slug === slug);
    if (match) setSelectedCampaignId(match.id);
  }, [searchParams, activeCampaigns]);

  const selectedCampaign = activeCampaigns.find((c) => c.id === selectedCampaignId);

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(state.settings.bank_account_number).catch(() => {});
    setCopiedAcc(true);
    setTimeout(() => setCopiedAcc(false), 2000);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceiptFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setReceiptDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    if (amount < 500) {
      setErrorMsg("Minimum grassroots donation is ₦500.");
      return;
    }

    setSubmitting(true);
    try {
      if (paymentMethod === "paystack") {
        const res = await fetch("/api/paystack/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            campaignId: selectedCampaignId || null,
            donorName,
            donorEmail,
            donorPhone,
            amountNgn: amount,
            frequency,
            isAnonymous,
            message,
          }),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json.error || "Unable to start Paystack checkout.");
        }
        if (json.mode === "live" && json.authorization_url) {
          window.location.href = json.authorization_url;
          return;
        }
        // Interactive Demo Mode confirmation
        const rec = recordDonation({
          campaign_id: selectedCampaignId || null,
          donor_name: donorName,
          donor_email: donorEmail,
          donor_phone: donorPhone,
          amount_ngn: amount,
          frequency,
          payment_method: "paystack",
          is_anonymous: isAnonymous,
          message,
        });
        setCompletedDonation(rec);
      } else {
        // Manual Bank Transfer pledge & receipt verification queue
        const rec = recordDonation({
          campaign_id: selectedCampaignId || null,
          donor_name: donorName,
          donor_email: donorEmail,
          donor_phone: donorPhone,
          amount_ngn: amount,
          frequency,
          payment_method: "bank_transfer",
          is_anonymous: isAnonymous,
          message,
          transfer_bank_name: transferBank,
          transfer_sender_name: transferSender || donorName,
          receipt_url: receiptDataUrl,
        });
        setCompletedDonation(rec);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Donation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9F5] pb-20">
      <section className="bg-[#0B3D2E] text-white py-14 px-4 sm:px-6 border-b-4 border-[#E6B42C] no-print">
        <div className="max-w-7xl mx-auto space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F5D678]">
            Grassroots Fundraising &amp; Member Outreaches
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold">
            Power the Movement &amp; Lift Communities
          </h1>
          <p className="text-[#D4E5DD] max-w-3xl">
            Every Naira strengthens polling unit coverage, funds member welfare outreaches,
            and equips grassroots chapters across all 36 states and FCT.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Active Campaigns Selector */}
        <div className="lg:col-span-5 space-y-5 no-print">
          <h2 className="font-display text-2xl font-bold text-[#0B3D2E]">
            1. Choose a Fund or Outreach Drive
          </h2>
          <div className="space-y-4">
            {activeCampaigns.map((camp) => {
              const pct = Math.min(
                100,
                Math.round((camp.raised_amount_ngn / camp.target_amount_ngn) * 100)
              );
              const isSelected = camp.id === selectedCampaignId;
              return (
                <button
                  key={camp.id}
                  type="button"
                  onClick={() => setSelectedCampaignId(camp.id)}
                  className={`w-full text-left rounded-2xl p-5 border-2 transition-all space-y-3 ${
                    isSelected
                      ? "bg-white border-[#0B3D2E] shadow-md ring-2 ring-[#E6B42C]/40"
                      : "bg-white/80 border-[#E2DFD5] hover:border-[#0B3D2E]/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#9A7009]">
                      {camp.is_general_fund ? "General Movement Fund" : camp.location_label}
                    </span>
                    {isSelected && (
                      <span className="rounded-full bg-[#0B3D2E] px-2.5 py-0.5 text-[11px] font-bold text-[#F5D678]">
                        Selected
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#0B3D2E] leading-snug">
                    {camp.title}
                  </h3>
                  <p className="text-xs text-[#4B5D56] leading-relaxed">{camp.summary}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="font-mono-num text-[#0B3D2E] font-bold">
                        {formatNaira(camp.raised_amount_ngn)}
                      </span>
                      <span className="text-[#4B5D56]">
                        Target: {formatNaira(camp.target_amount_ngn)} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#ECEAE0] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#146C43]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-[#4B5D56]">
                      {formatNumber(camp.donor_count)} verified contributors
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Checkout Form OR Instant Receipt */}
        <div className="lg:col-span-7">
          {completedDonation ? (
            <div className="rounded-2xl bg-white border-2 border-[#146C43] p-7 sm:p-9 shadow-lg space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-10 w-10 text-[#146C43] shrink-0" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#146C43]">
                      {completedDonation.status === "verified"
                        ? "Official Donation Receipt"
                        : "Transfer Submitted for Verification"}
                    </p>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B3D2E]">
                      Thank You for Investing in Nigeria&apos;s Reset!
                    </h2>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-[#FAF9F5] border border-[#E2DFD5] p-5 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#4B5D56]">Receipt Reference</span>
                  <span className="font-mono-num font-bold text-[#0B3D2E]">
                    {completedDonation.reference}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B5D56]">Fund / Outreach</span>
                  <span className="font-semibold text-right">
                    {completedDonation.campaign_title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B5D56]">Amount</span>
                  <span className="font-mono-num text-lg font-extrabold text-[#146C43]">
                    {formatNaira(completedDonation.amount_ngn)} (
                    {completedDonation.frequency === "monthly" ? "Monthly" : "One-Time"})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B5D56]">Payment Method</span>
                  <span className="font-semibold capitalize">
                    {completedDonation.payment_method.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B5D56]">Status</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      completedDonation.status === "verified"
                        ? "bg-[#146C43]/15 text-[#146C43]"
                        : "bg-[#E6B42C]/25 text-[#8A6204]"
                    }`}
                  >
                    {completedDonation.status === "verified"
                      ? "Verified"
                      : "Pending Admin Verification"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B5D56]">Date</span>
                  <span>{formatDate(completedDonation.created_at)}</span>
                </div>
              </div>

              {completedDonation.status === "pending_verification" && (
                <p className="text-sm text-[#4B5D56]">
                  Our National Secretariat finance team has received your bank transfer
                  details and receipt. Once verified in the Admin Console, your contribution
                  will automatically update the outreach progress bar.
                </p>
              )}

              <div className="flex flex-wrap gap-3 no-print">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0B3D2E] hover:bg-[#146C43] px-5 py-2.5 text-sm font-bold text-white"
                >
                  <Printer className="h-4 w-4 text-[#E6B42C]" aria-hidden="true" />
                  Print / Save Receipt
                </button>
                <button
                  type="button"
                  onClick={() => setCompletedDonation(null)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#0B3D2E]/25 bg-white hover:bg-[#F1EFE7] px-5 py-2.5 text-sm font-semibold text-[#0B3D2E]"
                >
                  Make Another Contribution
                </button>
              </div>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="rounded-2xl bg-white border border-[#E2DFD5] p-6 sm:p-8 shadow-sm space-y-6"
            >
              <div>
                <h2 className="font-display text-2xl font-bold text-[#0B3D2E]">
                  2. Complete Your Grassroots Contribution
                </h2>
                {selectedCampaign && (
                  <p className="text-sm text-[#4B5D56] mt-1">
                    Supporting: <strong className="text-[#0B3D2E]">{selectedCampaign.title}</strong>
                  </p>
                )}
              </div>

              {/* Frequency */}
              <div className="grid grid-cols-2 gap-3">
                {(["one_time", "monthly"] as const).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequency(freq)}
                    className={`rounded-xl py-2.5 px-4 text-sm font-bold border-2 transition-colors ${
                      frequency === freq
                        ? "bg-[#0B3D2E] text-white border-[#0B3D2E]"
                        : "bg-[#FAF9F5] text-[#344740] border-[#E2DFD5] hover:border-[#0B3D2E]/40"
                    }`}
                  >
                    {freq === "one_time" ? "One-Time Gift" : "Monthly Supporter"}
                  </button>
                ))}
              </div>

              {/* Preset Naira Amounts */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-[#16221E]">
                  Select Amount (NGN ₦)
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {PRESET_AMOUNTS.map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setAmount(tier)}
                      className={`font-mono-num rounded-xl py-2.5 px-3 text-sm font-bold border transition-colors ${
                        amount === tier
                          ? "bg-[#E6B42C] text-[#07291F] border-[#C89314]"
                          : "bg-[#FAF9F5] text-[#0B3D2E] border-[#E2DFD5] hover:bg-[#F1EFE7]"
                      }`}
                    >
                      {formatNaira(tier)}
                    </button>
                  ))}
                </div>
                <div>
                  <label htmlFor="custom-amount" className="block text-xs font-semibold text-[#4B5D56] mb-1">
                    Or enter custom amount (Minimum ₦500)
                  </label>
                  <input
                    id="custom-amount"
                    name="amount"
                    type="number"
                    min={500}
                    step={100}
                    required
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="field-input font-mono-num font-bold"
                    data-error="amount-error"
                  />
                  <div id="amount-error" className="field-error-msg">
                    Error: Please enter an amount of at least ₦500.
                  </div>
                </div>
              </div>

              {/* Payment Method Tabs */}
              <div className="space-y-3">
                <span className="block text-sm font-bold text-[#16221E]">
                  Choose Payment Method
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paystack")}
                    className={`rounded-xl p-4 border-2 text-left flex items-start gap-3 transition-all ${
                      paymentMethod === "paystack"
                        ? "border-[#0B3D2E] bg-[#0B3D2E]/5"
                        : "border-[#E2DFD5] hover:border-[#0B3D2E]/30"
                    }`}
                  >
                    <CreditCard className="h-5 w-5 text-[#0B3D2E] shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-bold text-[#0B3D2E]">Paystack Instant</p>
                      <p className="text-xs text-[#4B5D56]">
                        Cards, Instant Transfer, USSD, Apple Pay &amp; Diaspora Cards
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bank_transfer")}
                    className={`rounded-xl p-4 border-2 text-left flex items-start gap-3 transition-all ${
                      paymentMethod === "bank_transfer"
                        ? "border-[#0B3D2E] bg-[#0B3D2E]/5"
                        : "border-[#E2DFD5] hover:border-[#0B3D2E]/30"
                    }`}
                  >
                    <Building2 className="h-5 w-5 text-[#9A7009] shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-bold text-[#0B3D2E]">Manual Bank Transfer</p>
                      <p className="text-xs text-[#4B5D56]">
                        Transfer directly &amp; upload receipt for admin verification
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Bank Account Box when Manual Transfer selected */}
              {paymentMethod === "bank_transfer" && (
                <div className="rounded-xl bg-[#FDF8E6] border border-[#E6B42C]/60 p-5 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#8A6204]">
                    Official Network Bank Account
                  </p>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-[#4B5D56]">Bank:</span>{" "}
                      <strong className="text-[#0B3D2E]">{state.settings.bank_name}</strong>
                    </p>
                    <p>
                      <span className="text-[#4B5D56]">Account Name:</span>{" "}
                      <strong className="text-[#0B3D2E]">{state.settings.bank_account_name}</strong>
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="font-mono-num text-xl font-extrabold text-[#0B3D2E]">
                        {state.settings.bank_account_number}
                      </span>
                      <button
                        type="button"
                        onClick={copyAccountNumber}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#0B3D2E] px-3 py-1 text-xs font-bold text-white"
                      >
                        <Copy className="h-3.5 w-3.5 text-[#E6B42C]" aria-hidden="true" />
                        {copiedAcc ? "Copied!" : "Copy Number"}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label htmlFor="sender-bank" className="block text-xs font-semibold text-[#16221E] mb-1">
                        Your Bank Name <span className="text-[#B91C1C]">*</span>
                      </label>
                      <input
                        id="sender-bank"
                        name="transferBank"
                        type="text"
                        required
                        placeholder="e.g., GTBank, Zenith, OPay, Access"
                        value={transferBank}
                        onChange={(e) => setTransferBank(e.target.value)}
                        className="field-input"
                        data-error="sender-bank-error"
                      />
                      <div id="sender-bank-error" className="field-error-msg">
                        Error: Enter the bank you transferred from.
                      </div>
                    </div>
                    <div>
                      <label htmlFor="sender-name" className="block text-xs font-semibold text-[#16221E] mb-1">
                        Account Name on Receipt
                      </label>
                      <input
                        id="sender-name"
                        name="transferSender"
                        type="text"
                        placeholder="Sender name shown on transfer alert"
                        value={transferSender}
                        onChange={(e) => setTransferSender(e.target.value)}
                        className="field-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="receipt-upload"
                      className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#0B3D2E]/30 bg-white p-4 text-sm font-semibold text-[#0B3D2E] cursor-pointer hover:bg-[#FAF9F5]"
                    >
                      <Upload className="h-4 w-4 text-[#9A7009]" aria-hidden="true" />
                      <span>
                        {receiptFileName
                          ? `Attached: ${receiptFileName}`
                          : "Upload Transfer Screenshot or Receipt (PNG/JPG/PDF)"}
                      </span>
                      <input
                        id="receipt-upload"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleReceiptUpload}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Donor Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="donor-name" className="block text-sm font-semibold text-[#16221E] mb-1">
                    Full Name <span className="text-[#B91C1C]">*</span>
                  </label>
                  <input
                    id="donor-name"
                    name="donorName"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your full name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="field-input"
                    data-error="donor-name-error"
                  />
                  <div id="donor-name-error" className="field-error-msg">
                    Error: Please enter your name for your receipt.
                  </div>
                </div>

                <div>
                  <label htmlFor="donor-email" className="block text-sm font-semibold text-[#16221E] mb-1">
                    Email Address (for Receipt) <span className="text-[#B91C1C]">*</span>
                  </label>
                  <input
                    id="donor-email"
                    name="donorEmail"
                    type="email"
                    required
                    autoComplete="email"
                    spellCheck={false}
                    placeholder="you@example.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="field-input"
                    data-error="donor-email-error"
                  />
                  <div id="donor-email-error" className="field-error-msg">
                    Error: Enter an email address in the format you@example.com.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="donor-phone" className="block text-sm font-semibold text-[#16221E] mb-1">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    id="donor-phone"
                    name="donorPhone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+234 803 000 0000"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="field-input"
                  />
                </div>
                <div>
                  <label htmlFor="donor-msg" className="block text-sm font-semibold text-[#16221E] mb-1">
                    Note of Support (Optional)
                  </label>
                  <input
                    id="donor-msg"
                    name="message"
                    type="text"
                    placeholder="e.g., For Jos South & Plateau youths!"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="field-input"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-sm text-[#344740] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#0B3D2E]"
                />
                <span>Keep my donation anonymous on public acknowledgements</span>
              </label>

              {errorMsg && (
                <div
                  role="alert"
                  className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-sm font-semibold text-red-800"
                >
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B3D2E] hover:bg-[#146C43] px-6 py-4 text-base font-bold text-white shadow-md transition-colors disabled:opacity-60"
              >
                <HeartHandshake className="h-5 w-5 text-[#E6B42C]" aria-hidden="true" />
                {submitting
                  ? "Processing..."
                  : paymentMethod === "paystack"
                  ? `Donate ${formatNaira(amount)} Securely via Paystack`
                  : `Submit ${formatNaira(amount)} Bank Transfer Receipt`}
              </button>

              <p className="text-xs text-center text-[#4B5D56] flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#146C43]" aria-hidden="true" />
                HMAC-verified Paystack webhooks &amp; accountable National Secretariat treasury logs.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-sm text-[#4B5D56]">Loading fundraising drives...</div>}>
      <DonateContent />
    </Suspense>
  );
}

