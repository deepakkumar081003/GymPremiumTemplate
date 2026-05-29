export const PURCHASE_LOGIN_MESSAGE =
  "Please log in to buy a plan and join the gym.";

export const PHONE_REQUIRED_MESSAGE =
  "Add your 10-digit mobile number before purchasing a plan.";

export function getRenewUrl(planId: string): string {
  return `/member/renew?planId=${encodeURIComponent(planId)}`;
}

export function getLoginUrlForPlan(planId: string): string {
  const params = new URLSearchParams({
    next: getRenewUrl(planId),
    message: PURCHASE_LOGIN_MESSAGE,
  });
  return `/auth/login?${params.toString()}`;
}

export function getSignupUrlForPlan(planId: string): string {
  const params = new URLSearchParams({
    next: getRenewUrl(planId),
    message: PURCHASE_LOGIN_MESSAGE,
  });
  return `/auth/signup?${params.toString()}`;
}

export function getProfileUrlForPurchase(planId: string): string {
  const params = new URLSearchParams({
    next: getRenewUrl(planId),
    message: PHONE_REQUIRED_MESSAGE,
  });
  return `/member/profile?${params.toString()}`;
}

export function buildAuthUrl(path: string, params: Record<string, string>): string {
  const search = new URLSearchParams(params);
  return `${path}?${search.toString()}`;
}
