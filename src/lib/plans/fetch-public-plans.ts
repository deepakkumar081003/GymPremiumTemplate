import { createClient } from "@/lib/supabase/server";
import { gymConfig } from "@/config/gym-config";
import type { MembershipPlan } from "@/lib/types/database";

export async function getPublicPlans(): Promise<MembershipPlan[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("membership_plans")
    .select("*")
    .eq("is_active", true)
    .order("price", { ascending: true });

  if (!error && data && data.length > 0) {
    return data as MembershipPlan[];
  }

  return gymConfig.plans.map((plan, index) => ({
    id: `config-${index}`,
    gym_id: "00000000-0000-0000-0000-000000000001",
    name: plan.name,
    duration_days: parseDurationDays(plan.duration),
    price: parsePrice(plan.price),
    description: plan.description,
    features: plan.features,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

function parseDurationDays(duration: string): number {
  const match = duration.match(/(\d+)/);
  return match ? Number(match[1]) : 30;
}

function parsePrice(price: string): number {
  return Number(price.replace(/[^\d]/g, "")) || 0;
}
