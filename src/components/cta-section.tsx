import Link from "next/link";

type CtaHighlight = {
  label: string;
  value: string;
};

type CtaSectionProps = {
  eyebrow?: string;
  title: string;
  description: string;
  quote?: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  highlights?: CtaHighlight[];
};

export function CtaSection({
  eyebrow = "Start Today",
  title,
  description,
  quote,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  highlights,
}: CtaSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
      <div className="premium-card relative overflow-hidden rounded-3xl border border-cyan-400/25">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(34,211,238,0.15), transparent 45%), radial-gradient(circle at 80% 0%, rgba(99,102,241,0.12), transparent 40%)",
          }}
        />
        <div className="relative z-10 px-6 py-10 md:px-12 md:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">{eyebrow}</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">{title}</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-300 md:text-lg">{description}</p>
            {quote && (
              <blockquote className="mx-auto mt-6 max-w-2xl border-l-2 border-cyan-300/60 pl-4 text-left text-sm italic text-slate-400 md:text-center md:border-l-0 md:pl-0 md:italic">
                &ldquo;{quote}&rdquo;
              </blockquote>
            )}
          </div>

          {highlights && highlights.length > 0 && (
            <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <article
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm"
                >
                  <p className="text-2xl font-bold text-cyan-300">{item.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
                </article>
              ))}
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={primaryHref}
              className="rounded-full bg-cyan-400 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              {primaryLabel}
            </Link>
            {secondaryHref && secondaryLabel && (
              <Link
                href={secondaryHref}
                className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
              >
                {secondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
