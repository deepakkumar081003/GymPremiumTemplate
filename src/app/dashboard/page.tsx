"use client";

import { useAuth } from "@/lib/auth-context";
import { ProtectedRoute } from "@/components/protected-route";
import { MemberDashboardSummary } from "@/components/member/member-dashboard-summary";
import { AdminDashboardSummary } from "@/components/admin/admin-dashboard-summary";
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
            <AdminDashboardSummary />
          ) : (
            <MemberDashboardSummary />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
