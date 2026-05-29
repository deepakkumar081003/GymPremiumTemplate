import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { CtaSection } from "@/components/cta-section";
import { AboutHeroVisual } from "@/components/marketing/about-hero-visual";
import { gymConfig } from "@/config/gym-config";
import { aboutHeroHighlights, aboutHeroImage, brandStoryBlocks } from "@/config/site-content";

export default function AboutPage() {
  return (
    <PageShell>
      <section className="premium-grid-bg mx-auto grid w-full max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
            About Us
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            The Story of {gymConfig.gymName}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            We blend world-class training standards with a welcoming community to build lasting fitness
            transformations. Our mission is to make premium fitness accessible, structured, and consistent.
          </p>
          <blockquote className="mt-6 max-w-lg border-l-2 border-cyan-300/70 pl-4 text-sm italic text-slate-300">
            &ldquo;Discipline is built in moments. We design the environment that makes those moments
            repeatable.&rdquo;
          </blockquote>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/plans"
              className="rounded-full bg-cyan-400 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              View Plans
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold transition hover:border-white/40 hover:bg-white/5"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <AboutHeroVisual
          image={aboutHeroImage}
          imageAlt={`${gymConfig.gymName} training floor`}
          highlights={aboutHeroHighlights}
        />
      </section>

      <section className="border-y border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl font-semibold">Our Premium Promise</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: "◆",
                title: "Structured Coaching System",
                text: "Members follow clear plans with milestones, not random workouts.",
              },
              {
                icon: "◉",
                title: "High-Trust Environment",
                text: "Professional setup, clean ambience, and premium support in every interaction.",
              },
              {
                icon: "▲",
                title: "Long-Term Results Focus",
                text: "We prioritize habits and consistency to make transformation sustainable.",
              },
            ].map((item) => (
              <article key={item.title} className="premium-card rounded-3xl p-6">
                <p className="text-2xl text-cyan-300">{item.icon}</p>
                <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-semibold">What Clients Feel Here</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[
            {
              quote:
                "This does not feel like a typical gym. It feels like a place built for people who are serious about growth.",
              author: "Premium Member Experience",
            },
            {
              quote:
                "From onboarding to renewal, every touchpoint is clear and professional. That is what builds trust and retention.",
              author: "Member Feedback",
            },
          ].map((item) => (
            <article key={item.author} className="premium-card rounded-3xl p-6">
              <p className="text-sm italic leading-relaxed text-slate-200">&ldquo;{item.quote}&rdquo;</p>
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-cyan-300">{item.author}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl font-semibold">Our Journey</h2>
          <p className="mt-3 max-w-3xl text-slate-300">
            From day one to today — the milestones that shaped who we are as a gym community.
          </p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {brandStoryBlocks.map((item) => (
              <article key={item.title} className="premium-card overflow-hidden rounded-3xl">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{item.eyebrow}</p>
                  <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        eyebrow="Join The Community"
        title={`Experience ${gymConfig.gymName} firsthand.`}
        description="Whether you are starting out or leveling up, our coaches and member system help you stay accountable from day one to renewal."
        quote="Discipline is built in moments. We design the environment that makes those moments repeatable."
        primaryHref="/plans"
        primaryLabel="View Membership Plans"
        secondaryHref="/contact"
        secondaryLabel="Visit Or Enquire"
        highlights={[
          { value: "Premium", label: "Training Floor" },
          { value: "Structured", label: "Coaching System" },
          { value: "Simple", label: "Online Renewals" },
        ]}
      />
    </PageShell>
  );
}
