"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { formatDate, formatINR } from "@/lib/membership-utils";
import type { Membership, MembershipPlan } from "@/lib/types/database";

type AdminMember = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  created_at: string;
  activeMembership: Membership | null;
  daysRemaining: number | null;
};

export default function AdminMembersPage() {
  return (
    <Suspense fallback={<div className="premium-card h-64 animate-pulse rounded-3xl" />}>
      <AdminMembersContent />
    </Suspense>
  );
}

function AdminMembersContent() {
  const searchParams = useSearchParams();
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(searchParams.get("filter") ?? "all");
  const [showForm, setShowForm] = useState(false);
  const [formEmail, setFormEmail] = useState("");
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPlanId, setFormPlanId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    const params = new URLSearchParams({ filter, search });
    const res = await fetch(`/api/admin/members?${params}`);
    const data = await res.json();
    if (res.ok) setMembers(data.members ?? []);
  }, [filter, search]);

  useEffect(() => {
    const initialFilter = searchParams.get("filter");
    if (initialFilter) setFilter(initialFilter);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      loadMembers(),
      fetch("/api/admin/plans").then((r) => r.json()),
    ]).then(([, plansData]) => {
      setPlans(plansData.plans ?? []);
      setLoading(false);
    });
  }, [loadMembers]);

  const handleOfflineOnboard = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const res = await fetch("/api/admin/members/offline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formEmail,
        name: formName,
        phone: formPhone,
        planId: formPlanId,
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setMessage(data.error ?? "Failed to onboard member");
      return;
    }

    setMessage(`Member onboarded. Membership active until ${formatDate(data.endDate)}.`);
    setShowForm(false);
    setFormEmail("");
    setFormName("");
    setFormPhone("");
    loadMembers();
  };

  const sendReminder = async (member: AdminMember) => {
    if (!member.activeMembership) return;

    const res = await fetch("/api/admin/members/remind", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: member.id,
        endDate: member.activeMembership.end_date,
        planName: member.activeMembership.plan?.name,
      }),
    });

    if (res.ok) setMessage(`Reminder sent to ${member.email}`);
    else {
      const data = await res.json();
      setMessage(data.error ?? "Failed to send reminder");
    }
  };

  if (loading) {
    return <div className="premium-card h-64 animate-pulse rounded-3xl" />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Members</p>
          <h1 className="mt-2 text-3xl font-bold">Member Management</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
        >
          {showForm ? "Cancel" : "+ Offline Onboard"}
        </button>
      </div>

      {message && (
        <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-sm text-cyan-100">
          {message}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleOfflineOnboard} className="premium-card space-y-4 rounded-3xl p-6">
          <h2 className="text-lg font-semibold">Offline Member Onboarding</h2>
          <p className="text-sm text-slate-400">
            For cash/UPI payments. If email is new, an invite is sent to set their password.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <input
              required
              type="email"
              placeholder="Email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400/50"
            />
            <input
              type="text"
              placeholder="Full name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400/50"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400/50"
            />
            <select
              required
              value={formPlanId}
              onChange={(e) => setFormPlanId(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400/50"
            >
              <option value="">Select plan</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {formatINR(Number(p.price))}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Activate Membership"}
          </button>
        </form>
      )}

      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[240px] flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 outline-none focus:border-cyan-400/50"
        />
        {["all", "active", "expiring", "expired", "none"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-sm capitalize ${
              filter === f ? "bg-cyan-400/15 text-cyan-300" : "bg-white/5 text-slate-400"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-300">
            <tr>
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  No members found.
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr key={member.id} className="border-t border-white/10">
                  <td className="px-4 py-3">
                    <p className="font-medium">{member.name ?? "—"}</p>
                    <p className="text-slate-400">{member.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    {member.activeMembership?.plan?.name ?? "No active plan"}
                  </td>
                  <td className="px-4 py-3">
                    {member.activeMembership
                      ? formatDate(member.activeMembership.end_date)
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {member.activeMembership
                      ? member.daysRemaining !== null && member.daysRemaining <= 7
                        ? "Expiring soon"
                        : "Active"
                      : "Inactive"}
                  </td>
                  <td className="px-4 py-3">
                    {member.activeMembership && (
                      <button
                        onClick={() => sendReminder(member)}
                        className="text-cyan-300 hover:underline"
                      >
                        Send reminder
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
