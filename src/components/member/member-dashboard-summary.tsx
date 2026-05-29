"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { StatusBadge } from "@/components/member/status-badge";
import {
  formatDate,
  formatINR,
  getActiveMembership,
  getDaysRemaining,
  resolveMembershipStatus,
} from "@/lib/membership-utils";
import type { Membership } from "@/lib/types/database";

export function MemberDashboardSummary() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeMembership, setActiveMembership] = useState<Membership | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const supabase = createClient();

      const [membershipsRes, notificationsRes] = await Promise.all([
        supabase
          .from("memberships")
          .select("*, plan:membership_plans(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("notifications")
          .select("id, read_at")
          .eq("user_id", user.id)
          .is("read_at", null),
      ]);

      if (!membershipsRes.error && membershipsRes.data) {
        setActiveMembership(getActiveMembership(membershipsRes.data as Membership[]));
      }

      setUnreadNotifications(notificationsRes.data?.length ?? 0);
      setLoading(false);
    };

    load();
  }, [user]);

  if (loading) {
    return (
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="premium-card h-28 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  const status = activeMembership ? resolveMembershipStatus(activeMembership) : null;

  return (
    <>
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="premium-card rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Membership</p>
          <p className="mt-2 text-lg font-semibold">
            {activeMembership?.plan?.name ?? "No active plan"}
          </p>
          {status && (
            <div className="mt-3">
              <StatusBadge status={status} />
            </div>
          )}
        </div>

        <div className="premium-card rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Expiry</p>
          <p className="mt-2 text-lg font-semibold">
            {activeMembership ? formatDate(activeMembership.end_date) : "—"}
          </p>
          {activeMembership && (
            <p className="mt-2 text-sm text-slate-400">
              {getDaysRemaining(activeMembership.end_date) > 0
                ? `${getDaysRemaining(activeMembership.end_date)} days left`
                : "Expired"}
            </p>
          )}
        </div>

        <div className="premium-card rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wide text-slate-400">Renewal</p>
          <p className="mt-2 text-lg font-semibold">
            {activeMembership?.plan?.price != null
              ? formatINR(Number(activeMembership.plan.price))
              : "—"}
          </p>
          {unreadNotifications > 0 && (
            <p className="mt-2 text-sm text-cyan-300">
              {unreadNotifications} new notification(s)
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardLink
          href="/member/membership"
          title="My Membership"
          description="Plan details, history, and payments"
        />
        <DashboardLink
          href="/member/renew"
          title="Renew Membership"
          description="Choose or upgrade your plan"
        />
        <DashboardLink
          href="/member/invoices"
          title="Invoices"
          description="View and print receipts"
        />
        <DashboardLink
          href="/member/notifications"
          title="Notifications"
          description="Reminders and announcements"
          badge={unreadNotifications > 0 ? unreadNotifications : undefined}
        />
        <DashboardLink
          href="/member/profile"
          title="Profile"
          description="Update name and phone"
        />
      </div>
    </>
  );
}

function DashboardLink({
  href,
  title,
  description,
  badge,
}: {
  href: string;
  title: string;
  description: string;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="premium-card group rounded-3xl p-6 transition hover:bg-white/10"
    >
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-cyan-400/20 flex items-center justify-center mb-4 group-hover:bg-cyan-400/30 transition">
          <span className="text-cyan-400 text-lg">→</span>
        </div>
        {badge != null && (
          <span className="rounded-full bg-cyan-400/20 px-2 py-1 text-xs font-semibold text-cyan-300">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </Link>
  );
}
