import { GymIcon, type GymIconName } from "@/components/marketing/gym-icon";

export type JourneyStep = {
  icon: GymIconName;
  title: string;
  description: string;
};

type JourneyTimelineProps = {
  steps: JourneyStep[];
};

export function JourneyTimeline({ steps }: JourneyTimelineProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {steps.map((step, index) => (
        <article key={step.title} className="relative">
          {index < steps.length - 1 && (
            <div
              className="pointer-events-none absolute left-[calc(50%+2rem)] top-8 hidden h-px w-[calc(100%-4rem)] bg-gradient-to-r from-cyan-400/50 to-cyan-400/10 md:block"
              aria-hidden
            />
          )}
          <div className="premium-card h-full rounded-3xl p-6">
            <div className="flex items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-sm font-bold text-cyan-300">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cyan-300">
                <GymIcon name={step.icon} className="h-5 w-5" />
              </div>
            </div>
            <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
