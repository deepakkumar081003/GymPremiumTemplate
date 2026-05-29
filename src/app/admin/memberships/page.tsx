"use client";

import { FormEvent, useEffect, useState } from "react";
import { formatINR } from "@/lib/membership-utils";
import type { MembershipPlan } from "@/lib/types/database";

export default function AdminMembershipsPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadPlans = async () => {
    const res = await fetch("/api/admin/plans");
    const data = await res.json();
    setPlans(data.plans ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleSave = async (e: FormEvent<HTMLFormElement>, planId: string) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const res = await fetch(`/api/admin/plans/${planId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        price: Number(form.get("price")),
        durationDays: Number(form.get("durationDays")),
        description: form.get("description"),
        features: String(form.get("features"))
          .split("\n")
          .map((f) => f.trim())
          .filter(Boolean),
        isActive: form.get("isActive") === "on",
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error ?? "Failed to update plan");
      return;
    }

    setMessage("Plan updated successfully.");
    setEditingId(null);
    loadPlans();
  };

  if (loading) {
    return <div className="premium-card h-64 animate-pulse rounded-3xl" />;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Plans</p>
        <h1 className="mt-2 text-3xl font-bold">Membership Plans</h1>
        <p className="mt-2 text-slate-400">Edit pricing and plan details shown to members.</p>
      </div>

      {message && (
        <div className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-sm text-cyan-100">
          {message}
        </div>
      )}

      <div className="space-y-4">
        {plans.map((plan) => (
          <article key={plan.id} className="premium-card rounded-3xl p-6">
            {editingId === plan.id ? (
              <form onSubmit={(e) => handleSave(e, plan.id)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    name="name"
                    defaultValue={plan.name}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                  />
                  <input
                    name="price"
                    type="number"
                    defaultValue={plan.price}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                  />
                  <input
                    name="durationDays"
                    type="number"
                    defaultValue={plan.duration_days}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                  />
                  <label className="flex items-center gap-2 text-sm">
                    <input name="isActive" type="checkbox" defaultChecked={plan.is_active} />
                    Active on website
                  </label>
                </div>
                <textarea
                  name="description"
                  defaultValue={plan.description ?? ""}
                  rows={2}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                />
                <textarea
                  name="features"
                  defaultValue={(plan.features ?? []).join("\n")}
                  rows={4}
                  placeholder="One feature per line"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                />
                <div className="flex gap-3">
                  <button type="submit" className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded-full border border-white/20 px-5 py-2 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">{plan.name}</h2>
                  <p className="mt-1 text-2xl font-bold text-cyan-300">
                    {formatINR(Number(plan.price))}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    {plan.duration_days} days · {plan.is_active ? "Active" : "Hidden"}
                  </p>
                  {plan.description && (
                    <p className="mt-2 text-sm text-slate-300">{plan.description}</p>
                  )}
                </div>
                <button
                  onClick={() => setEditingId(plan.id)}
                  className="rounded-full border border-white/20 px-5 py-2 text-sm hover:bg-white/5"
                >
                  Edit
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
