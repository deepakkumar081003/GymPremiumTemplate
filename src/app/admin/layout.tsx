"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="owner">
      <AdminShell>{children}</AdminShell>
    </ProtectedRoute>
  );
}
