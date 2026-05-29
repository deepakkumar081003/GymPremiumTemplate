export type MembershipPlan = {
  id: string;
  gym_id: string;
  name: string;
  duration_days: number;
  price: number;
  description: string | null;
  features: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Membership = {
  id: string;
  user_id: string | null;
  plan_id: string | null;
  start_date: string;
  end_date: string;
  status: "active" | "expired" | "cancelled" | string;
  source: "online" | "offline" | string;
  created_at: string;
  updated_at: string;
  plan?: MembershipPlan | null;
};

export type Payment = {
  id: string;
  user_id: string;
  plan_id: string | null;
  membership_id: string | null;
  amount: number;
  currency: string;
  payment_type: "purchase" | "renewal" | string;
  status: "pending" | "success" | "failed" | "refunded" | string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  paid_at: string | null;
  created_at: string;
  plan?: MembershipPlan | null;
};

export type Invoice = {
  id: string;
  invoice_number: string;
  user_id: string;
  payment_id: string | null;
  membership_id: string | null;
  plan_name: string;
  amount: number;
  currency: string;
  member_name: string | null;
  member_email: string | null;
  gym_name: string;
  gym_address: string | null;
  issued_at: string;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "announcement" | "renewal_reminder" | "payment_success" | "membership_expired" | string;
  read_at: string | null;
  created_at: string;
};

export type UserProfile = {
  id: string;
  email: string;
  role: string;
  name: string | null;
  phone: string | null;
  avatar_url: string | null;
};
