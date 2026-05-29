"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { formatDateTime } from "@/lib/membership-utils";
import type { Notification } from "@/lib/types/database";

export default function MemberNotificationsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setNotifications((data as Notification[]) ?? []);
      setLoading(false);
    };

    load();
  }, [user]);

  const markAsRead = async (notification: Notification) => {
    if (notification.read_at) return;

    const supabase = createClient();
    const readAt = new Date().toISOString();

    const { error } = await supabase
      .from("notifications")
      .update({ read_at: readAt })
      .eq("id", notification.id);

    if (!error) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read_at: readAt } : n)),
      );
    }
  };

  if (loading) {
    return <div className="premium-card h-48 animate-pulse rounded-3xl" />;
  }

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Updates</p>
        <h1 className="mt-2 text-3xl font-bold">Notifications</h1>
        <p className="mt-2 text-slate-400">
          {unreadCount > 0 ? `${unreadCount} unread notification(s)` : "You're all caught up."}
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="premium-card rounded-3xl p-8 text-center">
          <p className="text-slate-300">No notifications yet.</p>
          <p className="mt-2 text-sm text-slate-400">
            Renewal reminders and gym announcements will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => markAsRead(notification)}
              className={`premium-card w-full rounded-2xl p-5 text-left transition hover:bg-white/5 ${
                !notification.read_at ? "border-cyan-400/30" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{notification.title}</p>
                  <p className="mt-2 text-sm text-slate-400">{notification.message}</p>
                  <p className="mt-3 text-xs text-slate-500">
                    {formatDateTime(notification.created_at)}
                  </p>
                </div>
                {!notification.read_at && (
                  <span className="rounded-full bg-cyan-400/20 px-2 py-1 text-xs text-cyan-300">
                    New
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
