"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { gymConfig } from "@/config/gym-config";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "auth_callback_error"
      ? "Authentication failed. Please try again."
      : null
  );
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const nextPath = searchParams.get("next") || "/dashboard";
  const infoMessage = searchParams.get("message");
  const signupHref = `/auth/signup?next=${encodeURIComponent(nextPath)}${
    infoMessage ? `&message=${encodeURIComponent(infoMessage)}` : ""
  }`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    const { error: signInError } = await signIn(formData.email, formData.password);

    if (signInError) {
      setError(signInError.message || "Failed to login");
    } else {
      router.push(nextPath);
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error: googleError } = await signInWithGoogle(nextPath);

    if (googleError) {
      setError(googleError.message || "Failed to login with Google");
    }
    setLoading(false);
  };

  return (
    <div className="premium-card rounded-3xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="mt-2 text-slate-300">Login to your {gymConfig.gymName} account</p>
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
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-slate-900 text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none transition"
                disabled={loading}
              />
            </div>

            <div className="flex justify-end">
              <Link href="/auth/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-900 text-slate-400">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Login with Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              Don&apos;t have an account?{" "}
              <Link href={signupHref} className="text-cyan-400 hover:text-cyan-300 font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
  );
}
