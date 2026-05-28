import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { gymConfig } from "@/config/gym-config";
import { placeholderImages } from "@/config/site-content";

export default function PlansPage() {
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

        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {gymConfig.plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-3xl border p-6 ${
                plan.highlighted
                  ? "glow-pulse border-cyan-300 bg-cyan-400/10"
                  : "premium-card border-white/10 bg-white/5"
              }`}
            >
              <p className="text-sm text-slate-300">{plan.duration}</p>
              <h2 className="mt-2 text-xl font-semibold">{plan.name}</h2>
              <p className="mt-2 text-3xl font-bold text-cyan-300">{plan.price}</p>
              <p className="mt-3 text-sm text-slate-300">{plan.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
            </article>
          ))}
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
    </PageShell>
  );
}
