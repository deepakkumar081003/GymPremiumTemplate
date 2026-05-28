import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { gymConfig } from "@/config/gym-config";
import { placeholderImages } from "@/config/site-content";

export default function ContactPage() {
  const whatsappLink = `https://wa.me/${gymConfig.whatsappNumber.replace(/\D/g, "")}`;

  return (
    <PageShell>
      <section className="premium-grid-bg mx-auto max-w-7xl px-6 py-16 md:py-24">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Contact</p>
        <h1 className="mt-4 text-4xl font-bold md:text-5xl">Visit or Message Us</h1>
        <p className="mt-6 max-w-3xl text-slate-300">
          Have questions about memberships or training? Reach out and we will help you get started.
        </p>
        <blockquote className="mt-6 max-w-3xl border-l-2 border-cyan-300/70 pl-4 text-sm italic text-slate-300">
          &ldquo;Your first step matters. We make it easy to start, stay, and scale your fitness journey.&rdquo;
        </blockquote>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="premium-card rounded-3xl p-6">
            <p className="text-sm text-slate-300">{gymConfig.address}</p>
            <p className="mt-2 text-sm text-slate-300">{gymConfig.phone}</p>
            <p className="mt-2 text-sm text-slate-300">{gymConfig.contactEmail}</p>
            <div className="mt-5 space-y-2 text-sm text-slate-300">
              {gymConfig.businessHours.map((hour) => (
                <p key={hour}>{hour}</p>
              ))}
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Chat on WhatsApp
            </a>
          </div>
          <form className="premium-card space-y-4 rounded-3xl p-6">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none ring-cyan-300 transition focus:ring-2"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none ring-cyan-300 transition focus:ring-2"
            />
            <textarea
              rows={4}
              placeholder="Tell us about your fitness goals"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none ring-cyan-300 transition focus:ring-2"
            />
            <button
              type="button"
              className="w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Send Enquiry
            </button>
          </form>
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <h2 className="text-3xl font-semibold">Quick Access</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              "Membership counselling support",
              "Personal goal planning session",
              "Gym tour and onboarding guidance",
            ].map((item) => (
              <article key={item} className="premium-card rounded-3xl p-6">
                <p className="text-sm text-slate-200">{item}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-semibold">Location & Brand Visuals</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <article className="premium-card overflow-hidden rounded-3xl">
            <Image
              src={placeholderImages.hero}
              alt="Location placeholder visual"
              width={1600}
              height={1000}
              className="h-auto w-full object-cover"
            />
          </article>
          <article className="premium-card overflow-hidden rounded-3xl">
            <Image
              src={placeholderImages.brand}
              alt="Gym logo placeholder"
              width={1200}
              height={800}
              className="h-auto w-full object-cover"
            />
          </article>
        </div>
      </section>
    </PageShell>
  );
}
