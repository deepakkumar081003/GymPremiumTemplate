"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import { formatDate, formatINR } from "@/lib/membership-utils";
import type { Invoice } from "@/lib/types/database";

export default function MemberInvoicesPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id)
        .order("issued_at", { ascending: false });

      setInvoices((data as Invoice[]) ?? []);
      setLoading(false);
    };

    load();
  }, [user]);

  if (loading) {
    return <div className="premium-card h-48 animate-pulse rounded-3xl" />;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Billing</p>
        <h1 className="mt-2 text-3xl font-bold">Invoice History</h1>
        <p className="mt-2 text-slate-400">Download and review your payment receipts.</p>
      </div>

      {invoices.length === 0 ? (
        <div className="premium-card rounded-3xl p-8 text-center">
          <p className="text-slate-300">No invoices yet.</p>
          <p className="mt-2 text-sm text-slate-400">
            Invoices are generated automatically after successful online payments.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <article key={invoice.id} className="premium-card rounded-3xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-cyan-300">{invoice.invoice_number}</p>
                  <h2 className="mt-1 text-lg font-semibold">{invoice.plan_name}</h2>
                  <p className="mt-1 text-sm text-slate-400">Issued {formatDate(invoice.issued_at)}</p>
                </div>
                <p className="text-2xl font-bold">{formatINR(Number(invoice.amount))}</p>
              </div>

              <div className="mt-6 grid gap-4 border-t border-white/10 pt-6 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-slate-400">Billed to</p>
                  <p className="mt-1">{invoice.member_name ?? "Member"}</p>
                  <p className="text-slate-400">{invoice.member_email}</p>
                </div>
                <div>
                  <p className="text-slate-400">From</p>
                  <p className="mt-1 font-medium">{invoice.gym_name}</p>
                  {invoice.gym_address && <p className="text-slate-400">{invoice.gym_address}</p>}
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="mt-6 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold transition hover:bg-white/5"
              >
                Print Receipt
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
