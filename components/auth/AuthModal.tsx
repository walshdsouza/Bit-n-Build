"use client";
import { useState, useTransition } from "react";
import { login, signup } from "@/app/auth/actions";
import { createClient } from "@/utils/supabase/client";
import { isSupabaseConfigured } from "@/utils/supabase/config";
import Link from "next/link";
import BrandLogo from "@/components/brand/BrandLogo";

interface AuthModalProps {
  mode: "signin" | "signup";
  onClose: () => void;
  onModeChange: (mode: "signin" | "signup") => void;
}

export default function AuthModal({ mode, onClose, onModeChange }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const accountsConfigured = isSupabaseConfigured();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    if (mode === "signup") formData.append("name", name);

    startTransition(async () => {
      try {
        const res = mode === "signin" ? await login(formData) : await signup(formData);
        if (res && "error" in res && typeof res.error === "string") setError(res.error);
        if (res && "success" in res && typeof res.success === "string") setSuccess(res.success);
      } catch {
        setError("The account service could not be reached. Please try again later.");
      }
    });
  };

  const handleGoogleLogin = async () => {
    if (!accountsConfigured) {
      setError("Accounts are not configured on this deployment. Continue without signing in below.");
      return;
    }
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) setError(error.message);
    } catch {
      setError("Google sign-in is unavailable. Please try again later.");
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={mode === "signin" ? "Sign in" : "Create account"} className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0A0A0F]/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal card */}
      <div className="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto bg-surface-container-low border border-outline-variant/50 rounded-xl shadow-2xl shadow-black/60">
        {/* Top gradient */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary-container via-primary to-tertiary-container" />

        {/* Blueprint grid */}
        <div className="absolute inset-0 bg-blueprint pointer-events-none" />

        <div className="relative z-10 p-6">
          {/* Logo */}
          <div className="flex items-center gap-space-sm mb-space-lg">
            <BrandLogo />
          </div>

          {/* Tab toggle */}
          <div className="flex items-center bg-surface-container-lowest rounded-lg p-1 mb-space-md">
            <button
              onClick={() => onModeChange("signin")}
              className={`flex-1 text-sm font-semibold py-1.5 rounded-md transition-all ${
                mode === "signin"
                  ? "bg-secondary-container/40 text-on-secondary-container shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => onModeChange("signup")}
              className={`flex-1 text-sm font-semibold py-1.5 rounded-md transition-all ${
                mode === "signup"
                  ? "bg-secondary-container/40 text-on-secondary-container shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Sign Up
            </button>
          </div>

          {!accountsConfigured && (
            <div role="status" className="mb-4 rounded-lg border border-primary/25 bg-primary/5 p-3 text-sm text-on-surface-variant">
              Accounts are not configured on this deployment. You can use the dashboard and demo without signing in.
              <Link href="/dashboard" onClick={onClose} className="mt-2 block font-semibold text-primary underline underline-offset-4">Continue to dashboard</Link>
              <Link href="/player/demo" onClick={onClose} className="mt-2 block font-semibold text-primary underline underline-offset-4">Try the demo</Link>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-space-sm">
            {error && (
              <div role="alert" className="p-2 mb-2 text-sm text-error bg-error/10 border border-error/20 rounded-md">
                {error}
              </div>
            )}
            {success && <p role="status" className="text-sm text-primary">{success}</p>}
            {mode === "signup" && (
              <div className="flex flex-col gap-1">
                <label htmlFor="auth-name" className="text-xs text-on-surface-variant font-medium">Full Name</label>
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Chen"
                  className="bg-surface-container-lowest text-on-surface text-sm rounded-lg px-3 py-2.5 border border-outline-variant/50 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-outline transition-all"
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label htmlFor="auth-email" className="text-xs text-on-surface-variant font-medium">Email Address</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-surface-container-lowest text-on-surface text-sm rounded-lg px-3 py-2.5 border border-outline-variant/50 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-outline transition-all"
              />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label htmlFor="auth-password" className="text-xs text-on-surface-variant font-medium">Password</label>
              </div>
              <input
                id="auth-password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-surface-container-lowest text-on-surface text-sm rounded-lg px-3 py-2.5 border border-outline-variant/50 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-outline transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isPending || !accountsConfigured}
              className="mt-space-sm flex items-center justify-center gap-2 px-space-lg py-space-sm rounded-full bg-gradient-to-r from-secondary-container to-primary-container font-label-button text-label-button text-on-primary shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isPending ? (
                <span className="w-4 h-4 rounded-full border-2 border-on-primary/30 border-t-on-primary animate-spin" />
              ) : null}
              <span>{mode === "signin" ? "Sign In to UNMUTE" : "Create Free Account"}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-2 my-space-md">
            <div className="h-px flex-1 bg-outline-variant/40" />
            <span className="text-xs text-outline">or continue with</span>
            <div className="h-px flex-1 bg-outline-variant/40" />
          </div>

          {/* Social */}
          <button 
            type="button"
            disabled={isPending || !accountsConfigured}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 bg-surface-container-high border border-outline-variant/40 text-on-surface text-sm font-medium hover:border-primary/30 hover:bg-surface-container-highest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Google</span>
          </button>

          <p className="text-center text-xs text-on-surface-variant mt-space-md">
            {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => onModeChange(mode === "signin" ? "signup" : "signin")}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {mode === "signin" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>

        {/* Close button */}
        <button
          aria-label="Close sign-in dialog"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </div>
  );
}
