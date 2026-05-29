import Image from "next/image";

export type VisualShowcaseItem = {
  image: string;
  eyebrow: string;
  title: string;
  description: string;
};

type VisualShowcaseGridProps = {
  items: VisualShowcaseItem[];
};

export function VisualShowcaseGrid({ items }: VisualShowcaseGridProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {items.map((item, index) => (
        <article
          key={item.title}
          className={`premium-card group relative overflow-hidden rounded-3xl ${
            index === 0 ? "lg:row-span-1" : ""
          }`}
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">{item.eyebrow}</p>
              <h3 className="mt-2 text-xl font-semibold text-white md:text-2xl">{item.title}</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-300">
                {item.description}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
