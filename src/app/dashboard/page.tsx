"use client";

import { useAuth } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import { MemberDashboardSummary } from "@/components/member/member-dashboard-summary";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardPage() {
  const { user, userRole, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await signOut();
    if (!error) {
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <ProtectedRoute requiredRole="any">
      <div className="min-h-screen bg-slate-950">
        {/* Header */}
        <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-300 capitalize">
                {userRole === "owner" ? "Gym Owner" : "Member"}
              </span>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="px-4 py-2 rounded-lg border border-white/20 text-sm font-semibold hover:bg-white/5 disabled:opacity-50 transition"
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold">Welcome, {user?.email}</h2>
            <p className="mt-2 text-slate-400">
              You are logged in as a {userRole === "owner" ? "Gym Owner" : "Member"}
            </p>
          </div>

          {/* Role-based content */}
          {userRole === "owner" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/admin/members"
                className="premium-card rounded-3xl p-6 hover:bg-white/10 transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-400/20 flex items-center justify-center mb-4 group-hover:bg-cyan-400/30 transition">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.657" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Manage Members</h3>
                <p className="mt-2 text-sm text-slate-400">View and manage gym members</p>
              </Link>

              <Link
                href="/admin/memberships"
                className="premium-card rounded-3xl p-6 hover:bg-white/10 transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-400/20 flex items-center justify-center mb-4 group-hover:bg-cyan-400/30 transition">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Memberships</h3>
                <p className="mt-2 text-sm text-slate-400">Manage membership plans and pricing</p>
              </Link>

              <Link
                href="/admin/payments"
                className="premium-card rounded-3xl p-6 hover:bg-white/10 transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-400/20 flex items-center justify-center mb-4 group-hover:bg-cyan-400/30 transition">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h10m4 0a1 1 0 11-2 0m2 0a1 1 0 11-2 0m2 0a1 1 0 11-2 0m2 0a1 1 0 11-2 0" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Payments</h3>
                <p className="mt-2 text-sm text-slate-400">Track payments and transactions</p>
              </Link>

              <Link
                href="/admin/analytics"
                className="premium-card rounded-3xl p-6 hover:bg-white/10 transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-400/20 flex items-center justify-center mb-4 group-hover:bg-cyan-400/30 transition">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">Analytics</h3>
                <p className="mt-2 text-sm text-slate-400">View gym statistics and insights</p>
              </Link>
            </div>
          ) : (
            <MemberDashboardSummary />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
