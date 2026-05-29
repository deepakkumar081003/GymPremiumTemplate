import Link from "next/link";
import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { PlansGrid } from "@/components/plans/plans-grid";
import { gymConfig } from "@/config/gym-config";
import { getPublicPlans } from "@/lib/plans/fetch-public-plans";
import { facilityHighlights, placeholderImages, stats } from "@/config/site-content";

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
        <div className="grid gap-4 sm:grid-cols-2">
          {facilityHighlights.map((label) => (
            <div
              key={label}
              className="premium-card float-slow min-h-40 rounded-3xl p-5"
            >
              <p className="text-sm text-slate-300">Elite Training</p>
              <p className="mt-2 text-xl font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="premium-card overflow-hidden rounded-3xl">
          <Image
            src={placeholderImages.hero}
            alt="Sample premium gym visual"
            width={1600}
            height={1000}
            className="h-auto w-full object-cover"
          />
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl font-semibold">Why This Template Converts Better</h2>
          <p className="mt-3 max-w-3xl text-slate-300">
            Built for trust-first sales calls, this website combines premium design language with clear
            conversion paths and reusable content blocks.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { title: "01", text: "Premium visual hierarchy for instant credibility." },
              { title: "02", text: "Mobile-first CTA placement to capture local leads." },
              { title: "03", text: "White-label ready sections to clone for new gyms." },
            ].map((item) => (
              <article key={item.title} className="premium-card rounded-3xl p-6">
                <p className="text-sm font-semibold text-cyan-300">{item.title}</p>
                <p className="mt-3 text-sm text-slate-200">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-semibold">Premium Programs At A Glance</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <article className="premium-card overflow-hidden rounded-3xl">
            <Image
              src={placeholderImages.secondary}
              alt="Program showcase visual"
              width={1400}
              height={900}
              className="h-auto w-full object-cover"
            />
          </article>
          <div className="space-y-4">
            {[
              "Strength conditioning with measurable progress",
              "Lifestyle fat-loss programs with coaching support",
              "Premium personal training modules",
              "Community-led challenge and transformation cycles",
            ].map((item) => (
              <article key={item} className="premium-card rounded-2xl p-5">
                <p className="text-sm text-slate-200">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl font-semibold">Member Journey Snapshot</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              "Enquire or chat via WhatsApp",
              "Choose plan and begin onboarding",
              "Renew online and stay consistent",
            ].map((item) => (
              <article key={item} className="premium-card rounded-3xl p-6">
                <p className="text-sm text-slate-200">{item}</p>
              </article>
            ))}
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
            <PlansGrid plans={plans} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="glow-pulse rounded-3xl border border-cyan-300/40 bg-cyan-400/10 p-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-900">Quote</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">
            &ldquo;The strongest brands sell confidence before they sell memberships.&rdquo;
          </h2>
          <p className="mt-3 text-slate-800">
            This template is designed to create that confidence in less than 10 seconds.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/plans"
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-slate-900"
            >
              Explore Plans
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-100"
            >
              Contact Gym
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
