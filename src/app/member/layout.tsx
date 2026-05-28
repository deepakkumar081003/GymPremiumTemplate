"use client";

import { ProtectedRoute } from "@/components/protected-route";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute requiredRole="member">{children}</ProtectedRoute>;
}
