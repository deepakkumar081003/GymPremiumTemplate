import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PlansGrid } from "@/components/plans/plans-grid";
import { MembershipComparison } from "@/components/plans/membership-comparison";
import { CtaSection } from "@/components/cta-section";
import { FeatureIconGrid } from "@/components/marketing/feature-icon-grid";
import { SectionHeading } from "@/components/marketing/section-heading";
import { VisualShowcaseGrid } from "@/components/marketing/visual-showcase-grid";
import { getPublicPlans } from "@/lib/plans/fetch-public-plans";
import {
  PURCHASE_LOGIN_MESSAGE,
  buildAuthUrl,
} from "@/lib/plans/purchase-flow";
import { planValueIndicators, planVisualShowcase } from "@/config/site-content";

const purchaseLoginUrl = buildAuthUrl("/auth/login", {
  next: "/member/renew",
  message: PURCHASE_LOGIN_MESSAGE,
});
const purchaseSignupUrl = buildAuthUrl("/auth/signup", {
  next: "/member/renew",
  message: "Create your account to buy a plan and join the gym.",
});

export const revalidate = 60;

export default async function PlansPage() {
  const plans = await getPublicPlans();

  return (
    <PageShell>
      <section className="premium-grid-bg mx-auto max-w-7xl px-6 py-16 md:py-24">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Memberships</p>
        <h1 className="mt-4 text-4xl font-bold md:text-5xl">Choose Your Plan</h1>
        <p className="mt-6 max-w-3xl text-slate-300">
          Flexible plans designed for beginners, consistent lifters, and performance-focused members.
        </p>
        <blockquote className="mt-6 max-w-3xl border-l-2 border-cyan-300/70 pl-4 text-sm italic text-slate-300">
          &ldquo;The right plan is the one you can sustain. Consistency beats intensity.&rdquo;
        </blockquote>

        <div className="mt-10">
          <PlansGrid plans={plans} showBuy />
        </div>
        <p className="mt-6 text-sm text-slate-400">
          Already have an account?{" "}
          <Link href={purchaseLoginUrl} className="text-cyan-300 hover:underline">
            Log in to buy
          </Link>
          . New here?{" "}
          <Link href={purchaseSignupUrl} className="text-cyan-300 hover:underline">
            Create an account
          </Link>
          .
        </p>
      </section>

      <section className="border-y border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <MembershipComparison plans={plans} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading
          eyebrow="Membership Experience"
          title="More Than A Price Tag"
          description="Every plan includes the support, structure, and environment you need to stay on track."
        />
        <div className="mt-8">
          <VisualShowcaseGrid items={planVisualShowcase} />
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <SectionHeading
            eyebrow="Included With Every Plan"
            title="Value You Can Feel From Day One"
            description="Membership perks designed to keep you progressing, supported, and never caught off guard."
          />
          <div className="mt-8">
            <FeatureIconGrid items={planValueIndicators} columns={4} variant="compact" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <CtaSection
          eyebrow="Ready To Start"
          title="Pick your plan and begin today."
          description="Choose a plan above, log in, and complete your purchase online. Manage renewals anytime from your member portal."
          primaryHref={purchaseLoginUrl}
          primaryLabel="Login To Buy"
          secondaryHref={purchaseSignupUrl}
          secondaryLabel="Create Account"
        />
      </section>
    </PageShell>
  );
}
