"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { MemberShell } from "@/components/member/member-shell";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="member">
      <MemberShell>{children}</MemberShell>
    </ProtectedRoute>
  );
}
