import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { CtaSection } from "@/components/cta-section";
import { FeatureIconGrid } from "@/components/marketing/feature-icon-grid";
import { GalleryHeroCollage } from "@/components/marketing/gallery-hero-collage";
import { GalleryZoneGrid } from "@/components/marketing/gallery-zone-grid";
import { SectionHeading } from "@/components/marketing/section-heading";
import { VisualShowcaseGrid } from "@/components/marketing/visual-showcase-grid";
import { gymConfig } from "@/config/gym-config";
import {
  galleryHeroImages,
  galleryHighlights,
  galleryShowcase,
  galleryZones,
} from "@/config/site-content";

export default function GalleryPage() {
  return (
    <PageShell>
      <section className="premium-grid-bg mx-auto grid w-full max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
            Gym Gallery
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">Premium Training Spaces</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            A performance-ready environment designed to keep members motivated, focused, and
            consistent — every zone built for a specific kind of training.
          </p>
          <blockquote className="mt-6 max-w-lg border-l-2 border-cyan-300/70 pl-4 text-sm italic text-slate-300">
            &ldquo;Environment drives behavior. A premium space helps members stay committed
            longer.&rdquo;
          </blockquote>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-cyan-400 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Book A Tour
            </Link>
            <Link
              href="/plans"
              className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold transition hover:border-white/40 hover:bg-white/5"
            >
              View Plans
            </Link>
          </div>
        </div>

        <GalleryHeroCollage images={galleryHeroImages} />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <SectionHeading
          eyebrow="Explore The Floor"
          title="Training Zones"
          description="Six dedicated areas — each maintained, equipped, and ready for the work you came to do."
        />
        <div className="mt-8">
          <GalleryZoneGrid zones={galleryZones} />
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <SectionHeading
            eyebrow="Facility Standards"
            title="Premium Visual Highlights"
            description="Every zone is maintained to the standard our members expect — clean, focused, and ready to perform."
          />
          <div className="mt-8">
            <FeatureIconGrid items={galleryHighlights} columns={3} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading
          eyebrow="Experience It Live"
          title="More Than Photos"
          description={`See why members choose ${gymConfig.gymName} — in person or through a guided walkthrough.`}
        />
        <div className="mt-8">
          <VisualShowcaseGrid items={galleryShowcase} />
        </div>
      </section>

      <CtaSection
        eyebrow="Ready To Visit"
        title="Come see the floor for yourself."
        description="Schedule a gym tour, meet the team, and find the training zone that fits your goals."
        primaryHref="/contact"
        primaryLabel="Book A Tour"
        secondaryHref="/plans"
        secondaryLabel="View Membership Plans"
        highlights={[
          { value: "6", label: "Training Zones" },
          { value: "Premium", label: "Equipment" },
          { value: "Free", label: "Walkthroughs" },
        ]}
      />
    </PageShell>
  );
}
