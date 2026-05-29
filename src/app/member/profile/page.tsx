"use client";

import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import type { UserProfile } from "@/lib/types/database";

export default function MemberProfilePage() {
  const { user } = useAuth();
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

    setSaving(true);
    setMessage(null);
    const supabase = createClient();

    const { error } = await supabase
      .from("users")
      .update({ name: name.trim() || null, phone: phone.trim() || null })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully." });
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
        <p className="mt-2 text-slate-400">Update your personal details.</p>
      </div>

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
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-cyan-400/50"
            placeholder="+91 99999 99999"
          />
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
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
