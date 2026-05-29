import { GymIcon, type GymIconName } from "@/components/marketing/gym-icon";

export type FeatureIconItem = {
  icon: GymIconName;
  title: string;
  description: string;
};

type FeatureIconGridProps = {
  items: FeatureIconItem[];
  columns?: 2 | 3 | 4;
  variant?: "default" | "compact" | "hero";
};

const columnClass: Record<2 | 3 | 4, string> = {
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-2 xl:grid-cols-4",
};

export function FeatureIconGrid({
  items,
  columns = 3,
  variant = "default",
}: FeatureIconGridProps) {
  if (variant === "hero") {
    return (
      <div className="relative">
        <div
          className="pointer-events-none absolute -inset-4 rounded-[2rem] opacity-70"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(34,211,238,0.12), transparent 50%), radial-gradient(circle at 70% 60%, rgba(99,102,241,0.1), transparent 45%)",
          }}
        />
        <div className="relative grid gap-4 sm:grid-cols-2">
          {items.map((item, index) => (
            <article
              key={item.title}
              className={`premium-card float-slow rounded-3xl p-5 ${
                index % 2 === 1 ? "sm:translate-y-3" : ""
              }`}
              style={{ animationDelay: `${index * 0.6}s` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
                <GymIcon name={item.icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`grid gap-4 ${columnClass[columns]}`}>
        {items.map((item) => (
          <article
            key={item.title}
            className="premium-card group rounded-2xl p-5 transition hover:border-cyan-400/30"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 transition group-hover:bg-cyan-400/15">
                <GymIcon name={item.icon} className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{item.description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-5 ${columnClass[columns]}`}>
      {items.map((item) => (
        <article key={item.title} className="premium-card rounded-3xl p-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
            <GymIcon name={item.icon} className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.description}</p>
        </article>
      ))}
    </div>
  );
}
