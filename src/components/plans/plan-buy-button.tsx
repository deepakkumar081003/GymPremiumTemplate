"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { createClient } from "@/lib/supabase/client";
import {
  getLoginUrlForPlan,
  getProfileUrlForPurchase,
  getRenewUrl,
} from "@/lib/plans/purchase-flow";
import { isValidIndianMobile } from "@/lib/validation/phone";

type PlanBuyButtonProps = {
  planId: string;
  className?: string;
  label?: string;
};

export function PlanBuyButton({
  planId,
  className = "mt-6 inline-flex w-full justify-center rounded-full bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300",
  label = "Buy",
}: PlanBuyButtonProps) {
  const { user, loading: authLoading } = useAuth();
  const [href, setHref] = useState(getLoginUrlForPlan(planId));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setHref(getLoginUrlForPlan(planId));
      setReady(true);
      return;
    }

    let cancelled = false;

    const resolveHref = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("users")
        .select("phone")
        .eq("id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (isValidIndianMobile(data?.phone)) {
        setHref(getRenewUrl(planId));
      } else {
        setHref(getProfileUrlForPurchase(planId));
      }
      setReady(true);
    };

    resolveHref();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading, planId]);

  if (authLoading || !ready) {
    return (
      <button
        type="button"
        disabled
        className={`${className} cursor-not-allowed opacity-60`}
      >
        {label}
      </button>
    );
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
