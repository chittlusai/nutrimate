"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Lock, Eye, EyeOff,
  ArrowRight, Loader2, ShieldCheck, RefreshCw,
} from "lucide-react";
import { authApi } from "@/lib/api";

/* ─── Field Component (matches app design tokens) ─────────────────────────── */
function Field({
  label, id, type = "text", value, onChange, error, icon, autoComplete, placeholder,
}: {
  label: string; id: string; type?: string; value: string;
  onChange: (v: string) => void; error?: string; icon: React.ReactNode;
  autoComplete?: string; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground-muted">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted/60 pointer-events-none">
          {icon}
        </span>
        <input
          id={id}
          name={id}
          type={isPassword ? (show ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          suppressHydrationWarning
          className={[
            "w-full pl-10 py-3 rounded-xl text-sm text-foreground",
            "bg-secondary/50 border-2 outline-none",
            "placeholder:text-foreground-muted/40",
            "transition-all duration-200",
            isPassword ? "pr-11" : "pr-4",
            error
              ? "border-destructive/60 focus:border-destructive focus:ring-2 focus:ring-destructive/20"
              : "border-border hover:border-white/20 focus:border-primary/60 focus:ring-2 focus:ring-primary/20",
          ].join(" ")}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-muted/50 hover:text-foreground-muted transition-colors"
            tabIndex={-1}
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-destructive inline-block" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── Submit Button ────────────────────────────────────────────────────────── */
function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={[
        "w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl",
        "font-medium text-sm text-white relative overflow-hidden",
        "btn-gradient transition-all duration-300",
        "shadow-glow-sm hover:shadow-glow",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
      ].join(" ")}
    >
      {loading
        ? <><Loader2 className="w-4 h-4 animate-spin" />{children}</>
        : children}
    </button>
  );
}

/* ─── Register Page ────────────────────────────────────────────────────────── */
export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "verify">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* Validation */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* Step 1 — Register */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await authApi.register({ name: name.trim(), email: email.toLowerCase().trim(), password });
      setStep("verify");
    } catch (err: unknown) {
      const ax = err as {
        code?: string;
        response?: { data?: { error?: string } };
        message?: string;
      };
      // Surface network errors clearly
      if (ax.code === "ERR_NETWORK" || ax.code === "ECONNREFUSED") {
        setErrors({ general: "Cannot reach the server. Make sure the backend is running on port 5000." });
      } else {
        setErrors({ general: ax.response?.data?.error ?? ax.message ?? "Registration failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  /* OTP handling */
  const handleOtpChange = (i: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const updated = [...otp];
    updated[i] = value.slice(-1);
    setOtp(updated);
    if (value && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  /* Step 2 — Verify OTP */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) { setErrors({ otp: "Enter all 6 digits" }); return; }
    setLoading(true);
    setErrors({});
    try {
      const res = await authApi.verifyEmail({ email: email.toLowerCase().trim(), otp: code });
      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string } } };
      setErrors({ otp: ax.response?.data?.error ?? "Invalid or expired code. Try again." });
    } finally {
      setLoading(false);
    }
  };

  /* Resend OTP */
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    try {
      await authApi.resendOtp({ email: email.toLowerCase().trim() });
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
      let t = 60;
      setResendCooldown(t);
      const iv = setInterval(() => { t -= 1; setResendCooldown(t); if (t <= 0) clearInterval(iv); }, 1000);
    } catch { setErrors({ general: "Failed to resend code." }); }
    finally { setLoading(false); }
  };

  /* ── OTP Step ─────────────────────────────────────────────── */
  if (step === "verify") {
    return (
      <div className="w-full max-w-sm mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="gradient-border rounded-2xl p-8 shadow-glass-lg"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <h1 className="text-xl font-semibold text-foreground mb-1">Verify your email</h1>
            <p className="text-sm text-foreground-muted">
              We sent a 6-digit code to{" "}
              <span className="text-foreground font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            {/* OTP Boxes */}
            <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  suppressHydrationWarning
                  style={{ width: 46, height: 54 }}
                  className={[
                    "text-center text-xl font-bold rounded-xl transition-all duration-200 outline-none",
                    "bg-secondary/60 text-foreground",
                    "border-2 focus:ring-2 focus:ring-primary/30",
                    digit ? "border-primary/70" : "border-border",
                    errors.otp ? "border-destructive/60" : "",
                  ].join(" ")}
                />
              ))}
            </div>

            {errors.otp && (
              <p className="text-center text-sm text-destructive">{errors.otp}</p>
            )}

            <SubmitButton loading={loading}>
              <ShieldCheck className="w-4 h-4" /> Confirm &amp; Continue
            </SubmitButton>

            <div className="text-center">
              <span className="text-sm text-foreground-muted">Didn&apos;t receive it? </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={loading || resendCooldown > 0}
                className="text-sm text-primary hover:text-primary/80 font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
              </button>
            </div>

            <p className="text-center text-sm text-foreground-muted">
              Wrong email?{" "}
              <button
                type="button"
                onClick={() => { setStep("form"); setOtp(["", "", "", "", "", ""]); setErrors({}); }}
                className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
              >
                Go back
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    );
  }

  /* ── Registration Form ───────────────────────────────────── */
  return (
    <div className="w-full max-w-sm mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="gradient-border rounded-2xl p-8 shadow-glass-lg"
      >
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-foreground mb-1">Create Account</h1>
          <p className="text-sm text-foreground-muted">Start your AI-powered nutrition journey</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4" noValidate>
          <Field label="Full Name" id="name" value={name} onChange={setName}
            error={errors.name} icon={<User className="w-4 h-4" />}
            autoComplete="name" placeholder="John Doe" />
          <Field label="Email Address" id="email" type="email" value={email} onChange={setEmail}
            error={errors.email} icon={<Mail className="w-4 h-4" />}
            autoComplete="email" placeholder="john@example.com" />
          <Field label="Password" id="password" type="password" value={password} onChange={setPassword}
            error={errors.password} icon={<Lock className="w-4 h-4" />}
            autoComplete="new-password" placeholder="Minimum 6 characters" />

          <AnimatePresence>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive text-center"
              >
                {errors.general}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-1">
            <SubmitButton loading={loading}>
              {!loading && <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
              {loading && "Creating account…"}
            </SubmitButton>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-foreground-muted">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Sign in
          </Link>
        </p>

        <p className="mt-3 text-center text-xs text-foreground-muted/50">
          By registering, you agree to our{" "}
          <Link href="#" className="underline underline-offset-2 hover:text-foreground-muted transition-colors">Terms</Link>
          {" & "}
          <Link href="#" className="underline underline-offset-2 hover:text-foreground-muted transition-colors">Privacy Policy</Link>
        </p>
      </motion.div>
    </div>
  );
}
