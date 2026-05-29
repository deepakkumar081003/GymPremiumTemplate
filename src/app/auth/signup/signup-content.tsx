"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { gymConfig } from "@/config/gym-config";

export default function SignUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const nextPath = searchParams.get("next") || "/dashboard";
  const infoMessage =
    searchParams.get("message") ??
    "Create your account to buy a plan and join the gym.";
  const loginHref = `/auth/login?next=${encodeURIComponent(nextPath)}&message=${encodeURIComponent(infoMessage)}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const { error: signUpError } = await signUp(formData.email, formData.password, nextPath);

    if (signUpError) {
      setError(signUpError.message || "Failed to create account");
    } else {
      router.push(`/auth/verify-email?next=${encodeURIComponent(nextPath)}`);
    }

    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);
    const { error: googleError } = await signInWithGoogle(nextPath);

    if (googleError) {
      setError(googleError.message || "Failed to sign up with Google");
    }
    setLoading(false);
  };

  return (
    <div className="premium-card rounded-3xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Join {gymConfig.gymName}</h1>
            <p className="mt-2 text-slate-300">Start your fitness journey today</p>
          </div>

          {infoMessage && (
            <div className="mb-6 p-4 rounded-xl bg-cyan-400/10 border border-cyan-400/40 text-cyan-100 text-sm">
              {infoMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-900 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none transition"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password (min 6 characters)"
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-900 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none transition"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-900 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none transition"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-950 text-slate-400">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Sign up with Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Already have an account?{" "}
              <Link href={loginHref} className="text-cyan-400 hover:text-cyan-300 font-semibold">
                Login here
              </Link>
            </p>
          </div>
        </div>
  );
}
