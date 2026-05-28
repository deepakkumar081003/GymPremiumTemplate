import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { gymConfig } from "@/config/gym-config";
import { placeholderImages } from "@/config/site-content";

export default function AboutPage() {
  return (
    <PageShell>
      <section className="premium-grid-bg mx-auto max-w-7xl px-6 py-16 md:py-24">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">About Us</p>
        <h1 className="mt-4 text-4xl font-bold md:text-5xl">The Story of {gymConfig.gymName}</h1>
        <p className="mt-6 max-w-3xl text-slate-300">
          We blend world-class training standards with a welcoming community to build lasting fitness
          transformations. Our mission is to make premium fitness accessible, structured, and consistent.
        </p>
        <blockquote className="mt-6 max-w-3xl border-l-2 border-cyan-300/70 pl-4 text-sm italic text-slate-300">
          &ldquo;Discipline is built in moments. We design the environment that makes those moments repeatable.&rdquo;
        </blockquote>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="premium-card overflow-hidden rounded-3xl">
          <Image
            src={placeholderImages.hero}
            alt="Gym interior visual"
            width={1600}
            height={1000}
            className="h-auto w-full object-cover"
          />
        </div>
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
              author: "Gym Operations Standard",
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
          <h2 className="text-3xl font-semibold">Brand Story Visual Blocks</h2>
          <p className="mt-3 max-w-3xl text-slate-300">
            Use these blocks for founder story, facility upgrades, or transformation milestones in each
            client version.
          </p>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <article key={item} className="premium-card overflow-hidden rounded-3xl">
                <Image
                  src={placeholderImages.secondary}
                  alt={`Sample gym story visual ${item}`}
                  width={1400}
                  height={900}
                  className="h-auto w-full object-cover"
                />
                <div className="p-5">
                  <p className="text-sm font-semibold text-cyan-300">Story Block {item}</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Replace this with timeline details and visuals for each gym brand.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="glow-pulse rounded-3xl border border-cyan-300/40 bg-cyan-400/10 p-8">
          <h2 className="text-2xl font-semibold text-slate-950">Built For Fast White-Label Deployment</h2>
          <p className="mt-3 max-w-3xl text-slate-800">
            Swap logo, colors, images, and gym details while preserving premium UX and conversion-focused
            content structure.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {["Brand assets", "Pricing content", "Contact + location"].map((item) => (
              <article key={item} className="rounded-2xl bg-slate-950/90 p-4 text-sm text-cyan-200">
                {item}
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
