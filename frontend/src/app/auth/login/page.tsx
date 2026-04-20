"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { authApi } from "@/lib/api";

/* ─── Field Component ─────────────────────────────────────────────────────── */
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

/* ─── Login Page ─────────────────────────────────────────────────────────── */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      const res = await authApi.login({ email: email.toLowerCase().trim(), password });
      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (err: unknown) {
      const ax = err as {
        code?: string;
        message?: string;
        response?: { status?: number; data?: { error?: string; otpSent?: boolean; email?: string } };
      };
      if (ax.code === "ERR_NETWORK" || ax.code === "ECONNREFUSED") {
        setErrors({ general: "Cannot reach the server. Make sure the backend is running on port 5000." });
      } else if (ax.response?.status === 403 && ax.response?.data?.otpSent) {
        router.push(`/auth/register?email=${encodeURIComponent(ax.response.data.email ?? email)}&verify=1`);
        return;
      } else {
        setErrors({ general: ax.response?.data?.error ?? (ax.response?.status === 401 ? "Invalid email or password" : "Login failed. Try again.") });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="gradient-border rounded-2xl p-8 shadow-glass-lg"
      >
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-foreground mb-1">Welcome Back</h1>
          <p className="text-sm text-foreground-muted">Sign in to continue your nutrition journey</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          <Field label="Email Address" id="email" type="email" value={email} onChange={setEmail}
            error={errors.email} icon={<Mail className="w-4 h-4" />}
            autoComplete="email" placeholder="john@example.com" />
          <Field label="Password" id="password" type="password" value={password} onChange={setPassword}
            error={errors.password} icon={<Lock className="w-4 h-4" />}
            autoComplete="current-password" placeholder="Your password" />

          <div className="flex justify-end -mt-1">
            <Link href="/auth/forgot-password"
              className="text-xs text-foreground-muted/60 hover:text-primary transition-colors">
              Forgot password?
            </Link>
          </div>

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
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in…</>
                : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-foreground-muted">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
