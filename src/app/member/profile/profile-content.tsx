"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import {
  formatPhoneForStorage,
  isValidIndianMobile,
  PHONE_VALIDATION_MESSAGE,
} from "@/lib/validation/phone";
import type { UserProfile } from "@/lib/types/database";

export default function MemberProfileContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next");
  const infoMessage = searchParams.get("message");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("users")
        .select("id, email, role, name, phone, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (data) {
        const p = data as UserProfile;
        setProfile(p);
        setName(p.name ?? "");
        setPhone(p.phone ?? "");
      }
      setLoading(false);
    };

    load();
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const normalizedPhone = formatPhoneForStorage(phone);
    if (!isValidIndianMobile(normalizedPhone)) {
      setMessage({ type: "error", text: PHONE_VALIDATION_MESSAGE });
      return;
    }

    setSaving(true);
    setMessage(null);
    const supabase = createClient();

    const { error } = await supabase
      .from("users")
      .update({ name: name.trim() || null, phone: normalizedPhone })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully." });
      if (nextPath && nextPath.startsWith("/")) {
        router.push(nextPath);
      }
    }
  };

  if (loading) {
    return <div className="premium-card h-64 animate-pulse rounded-3xl" />;
  }

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Account</p>
        <h1 className="mt-2 text-3xl font-bold">Profile</h1>
        <p className="mt-2 text-slate-400">
          Update your personal details. A 10-digit mobile number is required before buying a plan.
        </p>
      </div>

      {infoMessage && (
        <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-sm text-cyan-100">
          {infoMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="premium-card space-y-6 rounded-3xl p-6 md:p-8">
        <div>
          <label className="text-sm text-slate-400">Email</label>
          <p className="mt-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-slate-300">
            {profile?.email ?? user?.email}
          </p>
        </div>

        <div>
          <label htmlFor="name" className="text-sm text-slate-400">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-cyan-400/50"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="phone" className="text-sm text-slate-400">
            Mobile Number
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-cyan-400/50"
            placeholder="9876543210"
            maxLength={15}
          />
          <p className="mt-2 text-xs text-slate-500">
            Enter 10 digits only (no country code). OTP verification is not required.
          </p>
        </div>

        {message && (
          <p
            className={`text-sm ${
              message.type === "success" ? "text-emerald-300" : "text-red-300"
            }`}
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-full bg-cyan-400 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
        >
          {saving ? "Saving..." : nextPath ? "Save & Continue" : "Save Changes"}
        </button>

        {nextPath && (
          <Link href={nextPath} className="block text-center text-sm text-slate-400 hover:text-slate-300">
            Skip for now
          </Link>
        )}
      </form>
    </div>
  );
}
