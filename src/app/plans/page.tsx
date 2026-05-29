import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { PlansGrid } from "@/components/plans/plans-grid";
import { getPublicPlans } from "@/lib/plans/fetch-public-plans";
import { placeholderImages } from "@/config/site-content";

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
          <PlansGrid plans={plans} />
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl font-semibold">Membership Comparison</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              "Best for beginners: Monthly",
              "Most chosen: Quarterly",
              "Best long-term value: Yearly",
            ].map((row) => (
              <article key={row} className="premium-card rounded-3xl p-6">
                <p className="text-sm text-slate-200">{row}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-semibold">Plan Visuals</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <article className="premium-card overflow-hidden rounded-3xl">
            <Image
              src={placeholderImages.hero}
              alt="Plan campaign visual"
              width={1600}
              height={1000}
              className="h-auto w-full object-cover"
            />
          </article>
          <article className="premium-card overflow-hidden rounded-3xl">
            <Image
              src={placeholderImages.secondary}
              alt="Pricing visual block"
              width={1400}
              height={900}
              className="h-auto w-full object-cover"
            />
          </article>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl font-semibold">Included Value Indicators</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {["Nutrition guidance", "Progress checks", "Member priority support", "Renewal reminders"].map(
              (item) => (
                <article key={item} className="premium-card rounded-3xl p-5">
                  <p className="text-xl text-cyan-300">●</p>
                  <p className="mt-2 text-sm text-slate-200">{item}</p>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="premium-card rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-semibold">Ready to start?</h2>
          <p className="mt-2 text-slate-400">Create your account and choose a plan from the member portal.</p>
          <Link
            href="/auth/signup"
            className="mt-6 inline-flex rounded-full bg-cyan-400 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Get Started
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
