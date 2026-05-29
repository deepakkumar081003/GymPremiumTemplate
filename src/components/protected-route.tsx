"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PURCHASE_LOGIN_MESSAGE } from "@/lib/plans/purchase-flow";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "member" | "owner" | "any";
}

export function ProtectedRoute({ children, requiredRole = "any" }: ProtectedRouteProps) {
  const { user, loading, roleLoading, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !roleLoading && !user) {
      const returnPath =
        typeof window !== "undefined"
          ? `${window.location.pathname}${window.location.search}`
          : "/dashboard";
      const params = new URLSearchParams({
        next: returnPath,
        message: PURCHASE_LOGIN_MESSAGE,
      });
      router.push(`/auth/login?${params.toString()}`);
    } else if (
      !loading &&
      !roleLoading &&
      requiredRole !== "any" &&
      userRole !== requiredRole
    ) {
      router.push("/dashboard");
    }
  }, [user, loading, roleLoading, userRole, requiredRole, router]);

  if (loading || (user && roleLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-cyan-400/30 border-t-cyan-400 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (requiredRole !== "any" && userRole !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-300">You don't have access to this page</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
