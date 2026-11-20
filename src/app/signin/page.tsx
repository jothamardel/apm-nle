"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, ShieldCheck, UserCheck } from "lucide-react";
import { useApp } from "@/components/AppProvider";
import { useFormValidationSync } from "@/hooks/useFormValidationSync";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { UserRole } from "@/types/database";

const DEMO_PERSONAS: {
  role: UserRole;
  label: string;
  name: string;
  desc: string;
  redirect: string;
}[] = [
  {
    role: "national_admin",
    label: "National Admin",
    name: "Ms Nikurai Maton (Chairman)",
    desc: "Full access: verify transfers, exports across 37 states, campaigns, gallery & site settings.",
    redirect: "/admin",
  },
  {
    role: "state_coordinator",
    label: "State Coordinator",
    name: "Danjuma Pam Gyang (Plateau)",
    desc: "State-scoped access: view & export Plateau State members/volunteers only.",
    redirect: "/admin",
  },
  {
    role: "media_editor",
    label: "Media Editor",
    name: "Toluwanimi Adeyemi (Oyo • No PVC)",
    desc: "Publish Event Galleries, News articles & Social Media Toolkit assets.",
    redirect: "/admin",
  },
  {
    role: "member",
    label: "Grassroots Member",
    name: "Sadiq Ibrahim Daura (Katsina)",
    desc: "Member Portal: Digital ID card, Action Teams, Referral Link & Donation Receipts.",
    redirect: "/portal",
  },
];

export default function SignInPage() {
  const router = useRouter();
  const { signIn, isLiveSupabase } = useApp();
  const formRef = useRef<HTMLFormElement>(null);
  useFormValidationSync(formRef);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);
    try {
      if (isLiveSupabase) {
        const supabase = createSupabaseBrowserClient();
        if (supabase) {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          router.push("/portal");
          return;
        }
      }

      const found = signIn(email);
      if (!found) {
        setErrorMsg(
          "No account found with that email yet. Register online in 2 minutes or pick a Demo Role below!"
        );
        return;
      }
      router.push(found.role === "member" ? "/portal" : "/admin");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = (role: UserRole, redirect: string) => {
    signIn("", role);
    router.push(redirect);
  };

  return (
    <div className="bg-[#FAF9F5] py-12 px-4 sm:px-6 min-h-[75vh]">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Standard Sign In Form */}
        <div className="lg:col-span-6 rounded-2xl bg-white border border-[#E2DFD5] p-7 sm:p-8 shadow-sm space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#9A7009]">
              Member &amp; Coordinator Access
            </p>
            <h1 className="font-display text-3xl font-bold text-[#0B3D2E] mt-1">
              Sign In to Your Account
            </h1>
            <p className="text-sm text-[#4B5D56] mt-1">
              Access your Digital Membership ID Card, Action Teams, Social Media Toolkit, and
              donation receipts.
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="signin-email" className="block text-sm font-semibold text-[#16221E] mb-1">
                Email Address
              </label>
              <input
                id="signin-email"
                name="email"
                type="email"
                required
                autoComplete="username"
                spellCheck={false}
                enterKeyHint="next"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-input"
                data-error="signin-email-error"
              />
              <div id="signin-email-error" className="field-error-msg">
                Error: Enter a valid email address.
              </div>
            </div>

            <div>
              <label htmlFor="signin-password" className="block text-sm font-semibold text-[#16221E] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="signin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  enterKeyHint="done"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="field-input pr-12"
                  data-error="signin-password-error"
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
              <div id="signin-password-error" className="field-error-msg">
                Error: Please enter your password.
              </div>
            </div>

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
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B3D2E] hover:bg-[#146C43] px-5 py-3.5 text-sm font-bold text-white transition-colors"
            >
              <LogIn className="h-4 w-4 text-[#E6B42C]" aria-hidden="true" />
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-center text-[#4B5D56] pt-2 border-t border-[#E2DFD5]">
            New to NLE Grassroots?{" "}
            <Link href="/join" className="font-bold text-[#0B3D2E] hover:underline">
              Complete the online membership form →
            </Link>
          </p>
        </div>

        {/* Instant Interactive Preview Personas */}
        <div className="lg:col-span-6 rounded-2xl bg-[#07291F] text-white p-7 sm:p-8 space-y-5 shadow-lg">
          <div className="flex items-center gap-2 text-[#F5D678]">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Interactive Preview • Test Every Role
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold">
            One-Click Role Preview Sign-In
          </h2>
          <p className="text-sm text-[#C8DDD2]">
            Explore the Member Portal, State Coordinator console, Media Editor, and National
            Admin dashboard instantly while running in local preview mode.
          </p>

          <div className="space-y-3">
            {DEMO_PERSONAS.map((p) => (
              <button
                key={p.role}
                type="button"
                onClick={() => handleQuickDemo(p.role, p.redirect)}
                className="w-full text-left rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 p-4 transition-colors flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#E6B42C] px-2.5 py-0.5 text-[11px] font-extrabold text-[#07291F]">
                      {p.label}
                    </span>
                    <span className="font-semibold text-sm text-white">{p.name}</span>
                  </div>
                  <p className="text-xs text-[#C5DDD2]">{p.desc}</p>
                </div>
                <UserCheck className="h-5 w-5 text-[#E6B42C] shrink-0 mt-1" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

