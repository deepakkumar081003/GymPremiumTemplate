"use client";

import { FormEvent, useEffect, useState } from "react";
import { formatDateTime } from "@/lib/membership-utils";

export default function AdminAnnouncementsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState<"all" | "expiring">("all");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [history, setHistory] = useState<
    Array<{
      id: string;
      title: string;
      message: string;
      type: string;
      created_at: string;
      user?: { email: string };
    }>
  >([]);

  const loadHistory = () => {
    fetch("/api/admin/announcements")
      .then((r) => r.json())
      .then((data) => setHistory(data.announcements ?? []));
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    const res = await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, message, target }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setFeedback(data.error ?? "Failed to send announcement");
      return;
    }

    setFeedback(`Announcement sent to ${data.sent} member(s).`);
    setTitle("");
    setMessage("");
    loadHistory();
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Communications</p>
        <h1 className="mt-2 text-3xl font-bold">Announcements</h1>
        <p className="mt-2 text-slate-400">
          Send in-app notifications to all members or those expiring soon.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="premium-card max-w-2xl space-y-4 rounded-3xl p-6">
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400/50"
        />
        <textarea
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
          rows={4}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none focus:border-cyan-400/50"
        />
        <div className="flex flex-wrap gap-3">
          {(["all", "expiring"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTarget(t)}
              className={`rounded-full px-4 py-2 text-sm ${
                target === t ? "bg-cyan-400/15 text-cyan-300" : "bg-white/5 text-slate-400"
              }`}
            >
              {t === "all" ? "All members" : "Expiring in 7 days"}
            </button>
          ))}
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Send Announcement"}
        </button>
        {feedback && <p className="text-sm text-cyan-200">{feedback}</p>}
      </form>

      <section>
        <h2 className="text-xl font-semibold">Recent Notifications Sent</h2>
        <div className="mt-4 space-y-3">
          {history.slice(0, 10).map((item) => (
            <article key={item.id} className="premium-card rounded-2xl p-4">
              <p className="font-medium">{item.title}</p>
              <p className="mt-1 text-sm text-slate-400">{item.message}</p>
              <p className="mt-2 text-xs text-slate-500">
                {item.user?.email ?? "broadcast"} · {formatDateTime(item.created_at)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
