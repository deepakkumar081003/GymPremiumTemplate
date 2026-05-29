"use client";

import { FormEvent, Fragment, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { formatDate, formatINR } from "@/lib/membership-utils";
import {
  MEMBER_EXPIRY_FILTERS,
  MEMBER_STATUS_FILTERS,
} from "@/lib/admin/member-filters";
import { toDateInputValue } from "@/lib/admin/membership-end-date";
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
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [filter, setFilter] = useState(searchParams.get("filter") ?? "all");
  const [showForm, setShowForm] = useState(false);
  const [formEmail, setFormEmail] = useState("");
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formPlanId, setFormPlanId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [managingMemberId, setManagingMemberId] = useState<string | null>(null);
  const [expiryInput, setExpiryInput] = useState("");
  const [membershipUpdating, setMembershipUpdating] = useState(false);

  const fetchMembers = useCallback(async (currentFilter: string, currentSearch: string) => {
    setLoading(true);
    const params = new URLSearchParams({ filter: currentFilter, search: currentSearch });
    const res = await fetch(`/api/admin/members?${params}`);
    const data = await res.json();
    if (res.ok) setMembers(data.members ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const initialFilter = searchParams.get("filter");
    if (initialFilter) setFilter(initialFilter);
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/admin/plans")
      .then((r) => r.json())
      .then((data) => setPlans(data.plans ?? []));
  }, []);

  useEffect(() => {
    fetchMembers(filter, appliedSearch);
  }, [filter, appliedSearch, fetchMembers]);

  const handleSearch = () => {
    setAppliedSearch(searchInput.trim());
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

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
    fetchMembers(filter, appliedSearch);
  };

  const openManageMembership = (member: AdminMember) => {
    if (!member.activeMembership) return;
    setManagingMemberId(member.id);
    setExpiryInput(toDateInputValue(member.activeMembership.end_date));
    setMessage(null);
  };

  const closeManageMembership = () => {
    setManagingMemberId(null);
    setExpiryInput("");
  };

  const updateMembershipExpiry = async (member: AdminMember) => {
    if (!member.activeMembership || !expiryInput) return;

    setMembershipUpdating(true);
    setMessage(null);

    const res = await fetch("/api/admin/members/membership", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        membershipId: member.activeMembership.id,
        action: "update_expiry",
        endDate: expiryInput,
      }),
    });

    const data = await res.json();
    setMembershipUpdating(false);

    if (!res.ok) {
      setMessage(data.error ?? "Failed to update expiry");
      return;
    }

    setMessage(
      `Membership for ${member.email} updated. New expiry: ${formatDate(data.endDate)}.`,
    );
    closeManageMembership();
    fetchMembers(filter, appliedSearch);
  };

  const cancelMembership = async (member: AdminMember) => {
    if (!member.activeMembership) return;

    const confirmed = window.confirm(
      `End ${member.name ?? member.email}'s membership now? Use "Update expiry" instead if you only need to correct the end date (e.g. refund for an extra month).`,
    );
    if (!confirmed) return;

    setMembershipUpdating(true);
    setMessage(null);

    const res = await fetch("/api/admin/members/membership", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        membershipId: member.activeMembership.id,
        action: "cancel",
      }),
    });

    const data = await res.json();
    setMembershipUpdating(false);

    if (!res.ok) {
      setMessage(data.error ?? "Failed to cancel membership");
      return;
    }

    setMessage(`Membership cancelled for ${member.email}.`);
    closeManageMembership();
    fetchMembers(filter, appliedSearch);
  };

  const sendInAppReminder = async (member: AdminMember) => {
    if (!member.activeMembership) return;

    const res = await fetch("/api/admin/members/remind", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: member.id,
        memberName: member.name,
        endDate: member.activeMembership.end_date,
        planName: member.activeMembership.plan?.name,
      }),
    });

    if (res.ok) setMessage(`In-app reminder sent to ${member.email}`);
    else {
      const data = await res.json();
      setMessage(data.error ?? "Failed to send reminder");
    }
  };

  const hasWhatsAppPhone = (phone: string | null) =>
    Boolean(phone && phone.replace(/\D/g, "").length >= 10);

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

      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            placeholder="Search name, email, phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="min-w-[240px] flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 outline-none focus:border-cyan-400/50"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Search
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-slate-500">Status</span>
          {MEMBER_STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-4 py-2 text-sm ${
                filter === f.id ? "bg-cyan-400/15 text-cyan-300" : "bg-white/5 text-slate-400"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-slate-500">Expires in</span>
          {MEMBER_EXPIRY_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-4 py-2 text-sm ${
                filter === f.id || (f.id === "expiring_7" && filter === "expiring")
                  ? "bg-amber-400/15 text-amber-200"
                  : "bg-white/5 text-slate-400"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
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
                <Fragment key={member.id}>
                  <tr className="border-t border-white/10">
                    <td className="px-4 py-3">
                      <p className="font-medium">{member.name ?? "—"}</p>
                      <p className="text-slate-400">{member.email}</p>
                      <p className="text-slate-500">{member.phone ?? "No phone"}</p>
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
                      <div className="flex flex-col gap-1">
                        {member.activeMembership && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                managingMemberId === member.id
                                  ? closeManageMembership()
                                  : openManageMembership(member)
                              }
                              className="text-left text-cyan-300 hover:underline"
                            >
                              {managingMemberId === member.id ? "Close" : "Manage plan"}
                            </button>
                            <button
                              type="button"
                              onClick={() => sendInAppReminder(member)}
                              className="text-left text-slate-400 hover:text-cyan-300 hover:underline"
                            >
                              Remind (in-app)
                            </button>
                            {hasWhatsAppPhone(member.phone) ? (
                              <a
                                href={`/api/admin/members/remind/whatsapp?userId=${encodeURIComponent(member.id)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-left text-emerald-300/90 hover:text-emerald-200 hover:underline"
                              >
                                Remind (WhatsApp)
                              </a>
                            ) : (
                              <span
                                className="text-left text-slate-600"
                                title="Add a valid member phone number to send WhatsApp reminders"
                              >
                                Remind (WhatsApp)
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  {managingMemberId === member.id && member.activeMembership && (
                    <tr key={`${member.id}-manage`} className="border-t border-white/5 bg-white/[0.02]">
                      <td colSpan={5} className="px-4 py-4">
                        <div className="max-w-xl space-y-4 rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                          <div>
                            <p className="text-sm font-semibold text-white">Adjust membership</p>
                            <p className="mt-1 text-xs text-slate-400">
                              Change the expiry date for refunds or corrections (e.g. remove an
                              extra month). Members cannot cancel online — handle refunds in person.
                            </p>
                          </div>
                          <div className="flex flex-wrap items-end gap-3">
                            <div>
                              <label
                                htmlFor={`expiry-${member.id}`}
                                className="mb-1 block text-xs text-slate-400"
                              >
                                Expiry date
                              </label>
                              <input
                                id={`expiry-${member.id}`}
                                type="date"
                                value={expiryInput}
                                onChange={(e) => setExpiryInput(e.target.value)}
                                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-cyan-400/50"
                              />
                            </div>
                            <button
                              type="button"
                              disabled={membershipUpdating || !expiryInput}
                              onClick={() => updateMembershipExpiry(member)}
                              className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
                            >
                              {membershipUpdating ? "Saving..." : "Update expiry"}
                            </button>
                            <button
                              type="button"
                              disabled={membershipUpdating}
                              onClick={() => cancelMembership(member)}
                              className="rounded-full border border-red-400/40 px-4 py-2 text-sm font-semibold text-red-200 hover:bg-red-400/10 disabled:opacity-50"
                            >
                              End membership now
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
