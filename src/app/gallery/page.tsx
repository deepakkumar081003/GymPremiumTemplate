import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { galleryItems, placeholderImages } from "@/config/site-content";

export default function GalleryPage() {
  return (
    <PageShell>
      <section className="premium-grid-bg mx-auto max-w-7xl px-6 py-16 md:py-24">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Gym Gallery</p>
        <h1 className="mt-4 text-4xl font-bold md:text-5xl">Premium Training Spaces</h1>
        <p className="mt-6 max-w-3xl text-slate-300">
          A performance-ready environment designed to keep members motivated, focused, and consistent.
        </p>
        <blockquote className="mt-6 max-w-3xl border-l-2 border-cyan-300/70 pl-4 text-sm italic text-slate-300">
          &ldquo;Environment drives behavior. A premium space helps members stay committed longer.&rdquo;
        </blockquote>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <article
              key={item}
              className="premium-card float-slow overflow-hidden rounded-3xl"
            >
              <Image
                src={placeholderImages.secondary}
                alt={`${item} sample visual`}
                width={1400}
                height={900}
                className="h-auto w-full object-cover"
              />
              <div className="p-5">
                <p className="text-sm text-slate-300">Facility Zone</p>
                <h2 className="mt-2 text-lg font-semibold">{item}</h2>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl font-semibold">Premium Visual Highlights</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {["Equipment Quality", "Lighting & Ambience", "Clean Training Zones"].map((item) => (
              <article key={item} className="premium-card rounded-3xl p-6">
                <p className="text-lg font-semibold">{item}</p>
                <p className="mt-3 text-sm text-slate-300">
                  Showcase this section with real photos from each client gym during white-label setup.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="premium-card overflow-hidden rounded-3xl">
          <Image
            src={placeholderImages.hero}
            alt="Wide gallery showcase visual"
            width={1600}
            height={1000}
            className="h-auto w-full object-cover"
          />
        </div>
      </section>
    </PageShell>
  );
}
