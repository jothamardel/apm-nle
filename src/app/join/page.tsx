"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Eye, EyeOff, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { LocationSelector, type SelectedLocation } from "@/components/LocationSelector";
import { ACTION_TEAMS } from "@/data/reference-content";
import { useFormValidationSync } from "@/hooks/useFormValidationSync";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { ActionTeamId, PvcStatus } from "@/types/database";

const PVC_OPTIONS: { value: PvcStatus; title: string; subtitle: string }[] = [
  {
    value: "has_pvc",
    title: "I have my PVC",
    subtitle: "Ready to vote and mobilize in my Polling Unit",
  },
  {
    value: "planning_pvc",
    title: "Planning to get / transfer PVC",
    subtitle: "Need voter registration updates & ward support",
  },
  {
    value: "no_pvc_supporter",
    title: "No PVC — Still Part of the Cause",
    subtitle: "Refuse to sit on the sidelines; ready for digital or outreach action",
  },
  {
    value: "diaspora",
    title: "Diaspora Supporter",
    subtitle: "Nigerian abroad supporting advocacy, outreach & mobilization",
  },
];

function JoinFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerMember, isLiveSupabase } = useApp();
  const formRef = useRef<HTMLFormElement>(null);
  useFormValidationSync(formRef);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pvcStatus, setPvcStatus] = useState<PvcStatus>("has_pvc");
  const [actionTeams, setActionTeams] = useState<ActionTeamId[]>(["protect_ballots"]);
  const [socialX, setSocialX] = useState("");
  const [socialIg, setSocialIg] = useState("");
  const [socialFb, setSocialFb] = useState("");
  const [socialTiktok, setSocialTiktok] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [whyJoined, setWhyJoined] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [location, setLocation] = useState<SelectedLocation>({
    stateId: null,
    stateName: "",
    lgaId: null,
    lgaName: "",
    wardId: null,
    wardName: "",
    pollingUnitId: null,
    pollingUnitName: "",
    pollingUnitCode: "",
    customWard: "",
    customPollingUnit: "",
    diasporaCountry: "",
    unknownWardOrPu: false,
  });

  // Pre-fill from URL params (?team=social_media&pvc=no_pvc_supporter&ref=NLE-XXXX)
  useEffect(() => {
    const team = searchParams.get("team") as ActionTeamId | null;
    const pvc = searchParams.get("pvc") as PvcStatus | null;
    const ref = searchParams.get("ref");
    if (team && team in ACTION_TEAMS) {
      setActionTeams([team]);
    }
    if (pvc && PVC_OPTIONS.some((o) => o.value === pvc)) {
      setPvcStatus(pvc);
      if (pvc === "no_pvc_supporter") {
        setLocation((prev) => ({ ...prev, unknownWardOrPu: true }));
      }
    }
    if (ref) setReferralCode(ref);
  }, [searchParams]);

  const toggleTeam = (teamId: ActionTeamId) => {
    setActionTeams((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
    );
  };

  const handleGoogleSignUp = async () => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setErrorMsg(
        "Google Sign-In activates automatically once Supabase Auth keys are configured in .env.local. Use the quick form below to test right now!"
      );
      return;
    }
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/portal` },
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      if (isLiveSupabase) {
        const supabase = createSupabaseBrowserClient();
        if (supabase) {
          const { error: authErr } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                phone,
                pvc_status: pvcStatus,
                action_teams: actionTeams,
              },
            },
          });
          if (authErr) throw authErr;
        }
      }

      registerMember({
        full_name: fullName,
        email,
        phone,
        whatsapp: whatsapp || phone,
        pvc_status: pvcStatus,
        state_id: location.stateId,
        state_name: location.stateName,
        lga_id: location.lgaId,
        lga_name: location.lgaName,
        ward_id: location.wardId,
        ward_name: location.wardName,
        polling_unit_id: location.pollingUnitId,
        polling_unit_name: location.pollingUnitName,
        polling_unit_code: location.pollingUnitCode,
        diaspora_country: location.diasporaCountry || undefined,
        action_teams: actionTeams,
        social_handles: {
          x: socialX || undefined,
          instagram: socialIg || undefined,
          facebook: socialFb || undefined,
          tiktok: socialTiktok || undefined,
        },
        why_i_joined: whyJoined || undefined,
        referred_by_code: referralCode || undefined,
      });

      router.push("/portal?welcome=1");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Could not complete registration.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF9F5] pb-20">
      <section className="bg-[#0B3D2E] text-white py-12 px-4 sm:px-6 border-b-4 border-[#E6B42C]">
        <div className="max-w-4xl mx-auto space-y-2.5">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#F5D678]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Online Membership &amp; Volunteer Form
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold">
            Join the NLE Grassroots Network
          </h1>
          <p className="text-[#D4E5DD] max-w-2xl">
            Register once to receive your Digital Membership ID Card, appear in our real-time
            State-to-Polling-Unit strength counter, and enroll in your chosen Action Team(s).
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white border border-[#E2DFD5] p-6 sm:p-9 shadow-sm space-y-8"
        >
          {/* Optional Federated Login per autofill-sign-up-form */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E2DFD5]">
            <div>
              <h2 className="font-display text-xl font-bold text-[#0B3D2E]">
                Step 1 — Your Account Credentials
              </h2>
              <p className="text-xs text-[#4B5D56]">
                Already a member?{" "}
                <Link href="/signin" className="font-bold text-[#146C43] hover:underline">
                  Sign in to your portal
                </Link>
              </p>
            </div>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D4D9D6] bg-[#FAF9F5] hover:bg-[#F1EFE7] px-4 py-2.5 text-sm font-semibold text-[#16221E]"
            >
              Continue with Google
            </button>
          </div>

          {/* Single Full Name + Email + Phone + Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="full-name" className="block text-sm font-semibold text-[#16221E] mb-1">
                Full Name <span className="text-[#B91C1C]">*</span>
              </label>
              <span id="name-hint" className="block text-xs text-[#4B5D56] mb-1.5">
                Enter your full name as it should appear on your Membership ID Card
              </span>
              <input
                id="full-name"
                name="full-name"
                type="text"
                required
                autoComplete="name"
                enterKeyHint="next"
                aria-describedby="name-hint"
                data-error="name-error"
                placeholder="e.g., Amina Yusuf Pam"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="field-input"
              />
              <div id="name-error" className="field-error-msg">
                Error: Please enter your full name.
              </div>
            </div>

            <div>
              <label htmlFor="join-email" className="block text-sm font-semibold text-[#16221E] mb-1">
                Email Address <span className="text-[#B91C1C]">*</span>
              </label>
              <span id="join-email-hint" className="block text-xs text-[#4B5D56] mb-1.5">
                Format: you@example.com (used to sign in to your Member Portal)
              </span>
              <input
                id="join-email"
                name="email"
                type="email"
                required
                autoComplete="username"
                spellCheck={false}
                enterKeyHint="next"
                aria-describedby="join-email-hint"
                data-error="join-email-error"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-input"
              />
              <div id="join-email-error" className="field-error-msg">
                Error: Enter an email address in the format you@example.com.
              </div>
            </div>

            <div>
              <label htmlFor="join-phone" className="block text-sm font-semibold text-[#16221E] mb-1">
                Phone Number <span className="text-[#B91C1C]">*</span>
              </label>
              <span id="join-phone-hint" className="block text-xs text-[#4B5D56] mb-1.5">
                Nigerian or Diaspora number (e.g., +234 803 123 4567)
              </span>
              <input
                id="join-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                enterKeyHint="next"
                aria-describedby="join-phone-hint"
                data-error="join-phone-error"
                placeholder="+234 803 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="field-input"
              />
              <div id="join-phone-error" className="field-error-msg">
                Error: Please enter a valid phone number.
              </div>
            </div>

            <div>
              <label htmlFor="join-whatsapp" className="block text-sm font-semibold text-[#16221E] mb-1">
                WhatsApp Number (if different)
              </label>
              <span className="block text-xs text-[#4B5D56] mb-1.5">
                Leave blank if same as phone number above
              </span>
              <input
                id="join-whatsapp"
                name="whatsapp"
                type="tel"
                autoComplete="tel"
                enterKeyHint="next"
                placeholder="Optional WhatsApp number"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="field-input"
              />
            </div>
          </div>

          {/* Password with rules ABOVE input & Show Password toggle per modern-web-guidance */}
          <div className="max-w-md">
            <label htmlFor="new-password" className="block text-sm font-semibold text-[#16221E] mb-1">
              Create Password <span className="text-[#B91C1C]">*</span>
            </label>
            <p id="password-rules" className="text-xs text-[#4B5D56] mb-1.5">
              At least 8 characters with at least one letter and one number. You may paste a
              strong generated password.
            </p>
            <div className="relative">
              <input
                id="new-password"
                name="new-password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                pattern="(?=.*[A-Za-z])(?=.*\d).{8,}"
                autoComplete="new-password"
                enterKeyHint="next"
                aria-describedby="password-rules"
                data-error="new-password-error"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5D56] hover:text-[#0B3D2E] p-1"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div id="new-password-error" className="field-error-msg">
              Error: Password must be at least 8 characters and include a letter and a number.
            </div>
          </div>

          {/* Step 2: PVC Status & Location */}
          <div className="space-y-4 pt-4 border-t border-[#E2DFD5]">
            <div>
              <h2 className="font-display text-xl font-bold text-[#0B3D2E]">
                Step 2 — Voter Status &amp; Grassroots Location
              </h2>
              <p className="text-xs text-[#4B5D56]">
                No PVC? You are still 100% welcome — pick your status below so we connect you
                to the right frontline.
              </p>
            </div>

            <fieldset className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <legend className="sr-only">PVC and Voter Status</legend>
              {PVC_OPTIONS.map((opt) => {
                const selected = pvcStatus === opt.value;
                return (
                  <label
                    key={opt.value}
                    className={`rounded-xl p-4 border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      selected
                        ? "border-[#0B3D2E] bg-[#0B3D2E]/5"
                        : "border-[#E2DFD5] hover:border-[#0B3D2E]/35"
                    }`}
                  >
                    <input
                      type="radio"
                      name="pvcStatus"
                      value={opt.value}
                      checked={selected}
                      onChange={() => {
                        setPvcStatus(opt.value);
                        if (opt.value === "no_pvc_supporter") {
                          setLocation((prev) => ({ ...prev, unknownWardOrPu: true }));
                        }
                      }}
                      className="mt-1 h-4 w-4 accent-[#0B3D2E]"
                    />
                    <div>
                      <span className="block text-sm font-bold text-[#0B3D2E]">
                        {opt.title}
                      </span>
                      <span className="block text-xs text-[#4B5D56] mt-0.5">
                        {opt.subtitle}
                      </span>
                    </div>
                  </label>
                );
              })}
            </fieldset>

            <LocationSelector
              pvcStatus={pvcStatus}
              value={location}
              onChange={setLocation}
            />
          </div>

          {/* Step 3: Action Teams (Protect The Ballots, Social Media Team, etc.) */}
          <div className="space-y-4 pt-4 border-t border-[#E2DFD5]">
            <div>
              <h2 className="font-display text-xl font-bold text-[#0B3D2E]">
                Step 3 — Choose Your Action Team(s)
              </h2>
              <p className="text-xs text-[#4B5D56]">
                Select one or more teams to volunteer with (you can update anytime in your Member Portal).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {(Object.keys(ACTION_TEAMS) as ActionTeamId[]).map((id) => {
                const team = ACTION_TEAMS[id];
                const checked = actionTeams.includes(id);
                return (
                  <label
                    key={id}
                    className={`rounded-xl p-4 border-2 cursor-pointer transition-all flex items-start gap-3 ${
                      checked
                        ? "border-[#0B3D2E] bg-[#FDF8E6]"
                        : "border-[#E2DFD5] hover:border-[#0B3D2E]/35"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTeam(id)}
                      className="mt-1 h-4 w-4 accent-[#0B3D2E]"
                    />
                    <div>
                      <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#9A7009]">
                        {team.badge}
                      </span>
                      <span className="block text-sm font-bold text-[#0B3D2E]">
                        {team.title}
                      </span>
                      <span className="block text-xs text-[#4B5D56] mt-0.5">
                        {team.tagline}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>

            {actionTeams.includes("social_media") && (
              <div className="rounded-xl bg-[#FAF9F5] border border-[#E2DFD5] p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-[#0B3D2E]">
                  Social Media Team Handles (Optional — helps us tag &amp; amplify your posts)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="X (Twitter) @handle"
                    value={socialX}
                    onChange={(e) => setSocialX(e.target.value)}
                    className="field-input"
                  />
                  <input
                    type="text"
                    placeholder="Instagram @handle"
                    value={socialIg}
                    onChange={(e) => setSocialIg(e.target.value)}
                    className="field-input"
                  />
                  <input
                    type="text"
                    placeholder="Facebook Profile / Page"
                    value={socialFb}
                    onChange={(e) => setSocialFb(e.target.value)}
                    className="field-input"
                  />
                  <input
                    type="text"
                    placeholder="TikTok @handle"
                    value={socialTiktok}
                    onChange={(e) => setSocialTiktok(e.target.value)}
                    className="field-input"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ref-code" className="block text-sm font-semibold text-[#16221E] mb-1">
                  Referral / Mobilizer Code (Optional)
                </label>
                <input
                  id="ref-code"
                  name="referralCode"
                  type="text"
                  placeholder="e.g., NLE-NIKU2027"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="field-input font-mono-num uppercase"
                />
              </div>
              <div>
                <label htmlFor="why-joined" className="block text-sm font-semibold text-[#16221E] mb-1">
                  Why are you joining the Reset? (Optional)
                </label>
                <input
                  id="why-joined"
                  name="whyJoined"
                  type="text"
                  enterKeyHint="done"
                  placeholder="Share a short note with your chapter..."
                  value={whyJoined}
                  onChange={(e) => setWhyJoined(e.target.value)}
                  className="field-input"
                />
              </div>
            </div>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm font-semibold text-red-800"
            >
              {errorMsg}
            </div>
          )}

          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B3D2E] hover:bg-[#146C43] px-6 py-4 text-base font-bold text-white shadow-md transition-colors disabled:opacity-60"
            >
              <UserPlus className="h-5 w-5 text-[#E6B42C]" aria-hidden="true" />
              {submitting ? "Creating Your Membership..." : "Create Account & Get Digital ID Card"}
            </button>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#4B5D56]">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-[#146C43]" aria-hidden="true" />
                Your personal contact info is never shown publicly
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-[#146C43]" aria-hidden="true" />
                Instant NLE Member ID &amp; Ward Analytics Credit
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-sm text-[#4B5D56]">Loading membership form...</div>}>
      <JoinFormContent />
    </Suspense>
  );
}

