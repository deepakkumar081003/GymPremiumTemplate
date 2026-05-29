import Image from "next/image";
import { GymIcon } from "@/components/marketing/gym-icon";
import type { FeatureIconItem } from "@/components/marketing/feature-icon-grid";

type AboutHeroVisualProps = {
  image: string;
  imageAlt?: string;
  highlights: FeatureIconItem[];
};

export function AboutHeroVisual({
  image,
  imageAlt = "Gym interior",
  highlights,
}: AboutHeroVisualProps) {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -inset-4 rounded-[2rem] opacity-70"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, rgba(34,211,238,0.14), transparent 50%), radial-gradient(circle at 70% 70%, rgba(99,102,241,0.12), transparent 45%)",
        }}
      />

      <div className="relative premium-card float-slow overflow-hidden rounded-3xl">
        <div className="relative aspect-[4/5] sm:aspect-[5/6]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <div className="grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-slate-950/75 p-3 backdrop-blur-md sm:p-4"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
                    <GymIcon name={item.icon} className="h-4 w-4" />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
