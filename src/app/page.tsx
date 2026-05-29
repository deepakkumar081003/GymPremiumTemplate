import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PlansGrid } from "@/components/plans/plans-grid";
import { MembershipComparison } from "@/components/plans/membership-comparison";
import { ImageSlideshow } from "@/components/image-slideshow";
import { CtaSection } from "@/components/cta-section";
import { FeatureIconGrid } from "@/components/marketing/feature-icon-grid";
import { JourneyTimeline } from "@/components/marketing/journey-timeline";
import { ProgramHighlights } from "@/components/marketing/program-highlights";
import { SectionHeading } from "@/components/marketing/section-heading";
import { gymConfig } from "@/config/gym-config";
import { getPublicPlans } from "@/lib/plans/fetch-public-plans";
import {
  facilityHighlights,
  homeProgramImage,
  homeSlideshowImages,
  memberJourneySteps,
  programHighlights,
  stats,
  whyChooseUs,
} from "@/config/site-content";

export const revalidate = 60;

export default async function Home() {
  const plans = await getPublicPlans();

  return (
    <PageShell>
      <section className="premium-grid-bg mx-auto grid w-full max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
            Premium Fitness Experience
          </p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            {gymConfig.tagline}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {gymConfig.description}
          </p>
          <blockquote className="mt-6 max-w-lg border-l-2 border-cyan-300/70 pl-4 text-sm italic text-slate-300">
            &ldquo;A premium gym is not just equipment, it is clarity, accountability, and transformation
            built into every session.&rdquo;
          </blockquote>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/plans"
              className="rounded-full bg-cyan-400 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Join Now
            </Link>
            <Link
              href="/plans"
              className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold transition hover:border-white/40 hover:bg-white/5"
            >
              View Plans
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {stats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-bold text-cyan-300">{item.value}</p>
                <p className="mt-1 text-xs text-slate-300">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <FeatureIconGrid items={facilityHighlights} variant="hero" />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <ImageSlideshow
          images={homeSlideshowImages}
          title="Inside THULI GYM"
          subtitle="Premium equipment, expert coaching, and a high-performance training environment."
          autoPlayInterval={5000}
        />
      </section>

      <section className="border-y border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <SectionHeading
            eyebrow="Why Choose Us"
            title="Built For Members Who Take Training Seriously"
            description="Expert coaching, structured programs, and a premium environment designed to help you stay consistent."
          />
          <div className="mt-8">
            <FeatureIconGrid items={whyChooseUs} columns={3} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading
          eyebrow="Programs"
          title="Premium Programs At A Glance"
          description="From strength and fat loss to personal training — every path is structured for measurable progress."
        />
        <div className="mt-8">
          <ProgramHighlights items={programHighlights} image={homeProgramImage} />
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <SectionHeading
            eyebrow="Getting Started"
            title="Your Member Journey"
            description="Three simple steps from your first enquiry to long-term consistency."
          />
          <div className="mt-8">
            <JourneyTimeline steps={memberJourneySteps} />
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Memberships</p>
              <h2 className="mt-2 text-3xl font-semibold">Plans & Pricing</h2>
            </div>
            <Link href="/plans" className="text-sm text-cyan-300 hover:underline">
              View all plans
            </Link>
          </div>
          <div className="mt-8">
            <PlansGrid plans={plans} showBuy />
          </div>
          <div className="mt-16">
            <MembershipComparison
              plans={plans}
              showSummaryCards
              showFeatureMatrix={false}
              ctaHref="/plans"
              ctaLabel="View Full Comparison"
            />
          </div>
        </div>
      </section>

      <CtaSection
        eyebrow="Ready To Transform"
        title="Your strongest season starts with one decision."
        description="Join a premium training environment built for consistency, coaching, and real progress — online signup and renewal made simple."
        quote="The strongest brands sell confidence before they sell memberships."
        primaryHref="/plans"
        primaryLabel="Explore Membership Plans"
        secondaryHref="/contact"
        secondaryLabel="Talk To Us"
        highlights={[
          { value: "5+", label: "Expert Coaches" },
          { value: "24/7", label: "Member Portal" },
          { value: "100%", label: "Online Renewals" },
        ]}
      />
    </PageShell>
  );
}
