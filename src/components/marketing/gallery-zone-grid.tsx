import Image from "next/image";
import { GymIcon } from "@/components/marketing/gym-icon";
import type { GymIconName } from "@/components/marketing/gym-icon";

export type GalleryZone = {
  title: string;
  eyebrow: string;
  description: string;
  image: string;
  icon: GymIconName;
  featured?: boolean;
};

type GalleryZoneGridProps = {
  zones: GalleryZone[];
};

export function GalleryZoneGrid({ zones }: GalleryZoneGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {zones.map((zone) => (
        <article
          key={zone.title}
          className={`premium-card group relative overflow-hidden rounded-3xl ${
            zone.featured ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""
          }`}
        >
          <div
            className={`relative overflow-hidden ${
              zone.featured ? "aspect-[16/10] lg:aspect-auto lg:min-h-full lg:h-full" : "aspect-[4/3]"
            }`}
          >
            <Image
              src={zone.image}
              alt={zone.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes={
                zone.featured
                  ? "(max-width: 1024px) 100vw, 66vw"
                  : "(max-width: 1024px) 50vw, 33vw"
              }
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-slate-950/10" />

            <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 backdrop-blur-sm">
                  <GymIcon name={zone.icon} className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{zone.eyebrow}</p>
                  <h2
                    className={`mt-1 font-semibold text-white ${
                      zone.featured ? "text-xl md:text-2xl" : "text-lg"
                    }`}
                  >
                    {zone.title}
                  </h2>
                  <p
                    className={`mt-2 leading-relaxed text-slate-300 ${
                      zone.featured ? "max-w-lg text-sm" : "text-xs sm:text-sm"
                    }`}
                  >
                    {zone.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
