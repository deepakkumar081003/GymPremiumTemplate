import Image from "next/image";
import { GymIcon } from "@/components/marketing/gym-icon";
import type { ProgramHighlight } from "@/config/site-content";

type ProgramHighlightsProps = {
  items: ProgramHighlight[];
  image: string;
  imageAlt?: string;
};

export function ProgramHighlights({
  items,
  image,
  imageAlt = "Training programs showcase",
}: ProgramHighlightsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
      <article className="premium-card relative overflow-hidden rounded-3xl">
        <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-full">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-slate-950/30" />
        </div>
      </article>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.title}
            className="premium-card group rounded-2xl p-5 transition hover:border-cyan-400/25"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 transition group-hover:bg-cyan-400/15">
              <GymIcon name={item.icon} className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
