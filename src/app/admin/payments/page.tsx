"use client";

import { useEffect, useState } from "react";
import { formatDateTime, formatINR } from "@/lib/membership-utils";

type PaymentRow = {
  id: string;
  amount: number;
  status: string;
  payment_type: string;
  paid_at: string | null;
  created_at: string;
  user?: { name: string | null; email: string };
  plan?: { name: string };
};

type InvoiceRow = {
  id: string;
  invoice_number: string;
  plan_name: string;
  amount: number;
  issued_at: string;
  user?: { name: string | null; email: string };
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"payments" | "invoices">("payments");

  useEffect(() => {
    fetch("/api/admin/payments")
      .then((r) => r.json())
      .then((data) => {
        setPayments(data.payments ?? []);
        setInvoices(data.invoices ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="premium-card h-64 animate-pulse rounded-3xl" />;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Finance</p>
        <h1 className="mt-2 text-3xl font-bold">Payments & Invoices</h1>
      </div>

      <div className="flex gap-2">
        {(["payments", "invoices"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm capitalize ${
              tab === t ? "bg-cyan-400/15 text-cyan-300" : "bg-white/5 text-slate-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "payments" ? (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-t border-white/10">
                  <td className="px-4 py-3">
                    <p>{p.user?.name ?? "—"}</p>
                    <p className="text-slate-400">{p.user?.email}</p>
                  </td>
                  <td className="px-4 py-3">{p.plan?.name ?? "—"}</td>
                  <td className="px-4 py-3 capitalize">{p.payment_type}</td>
                  <td className="px-4 py-3">{formatINR(Number(p.amount))}</td>
                  <td className="px-4 py-3 capitalize">{p.status}</td>
                  <td className="px-4 py-3">{formatDateTime(p.paid_at ?? p.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv) => (
            <article key={inv.id} className="premium-card rounded-2xl p-5">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <p className="text-sm text-cyan-300">{inv.invoice_number}</p>
                  <p className="font-medium">{inv.plan_name}</p>
                  <p className="text-sm text-slate-400">
                    {inv.user?.name ?? inv.user?.email} · {formatDateTime(inv.issued_at)}
                  </p>
                </div>
                <p className="text-xl font-bold">{formatINR(Number(inv.amount))}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
