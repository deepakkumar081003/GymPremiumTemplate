import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { CtaSection } from "@/components/cta-section";
import { ContactForm } from "@/components/marketing/contact-form";
import { ContactHeroPanel } from "@/components/marketing/contact-hero-panel";
import { ContactInfoPanel } from "@/components/marketing/contact-info-panel";
import { FeatureIconGrid } from "@/components/marketing/feature-icon-grid";
import { LocationMap } from "@/components/marketing/location-map";
import { SectionHeading } from "@/components/marketing/section-heading";
import { gymConfig } from "@/config/gym-config";
import {
  contactFormInterests,
  contactHeroImage,
  contactQuickAccess,
} from "@/config/site-content";

export default function ContactPage() {
  const whatsappLink = `https://wa.me/${gymConfig.whatsappNumber.replace(/\D/g, "")}`;

  const heroDetails = [
    {
      icon: "map-pin" as const,
      label: "Visit Us",
      value: gymConfig.address,
    },
    {
      icon: "phone" as const,
      label: "Call",
      value: gymConfig.phone,
      href: `tel:${gymConfig.phone.replace(/\s/g, "")}`,
    },
    {
      icon: "mail" as const,
      label: "Email",
      value: gymConfig.contactEmail,
      href: `mailto:${gymConfig.contactEmail}`,
    },
    {
      icon: "clock" as const,
      label: "Today",
      value: gymConfig.businessHours[0] ?? "Open daily",
    },
  ];

  return (
    <PageShell>
      <section className="premium-grid-bg mx-auto grid w-full max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-white/15 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
            Contact
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">Visit or Message Us</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Have questions about memberships or training? Reach out and we will help you get started
            with the right plan and coaching path.
          </p>
          <blockquote className="mt-6 max-w-lg border-l-2 border-cyan-300/70 pl-4 text-sm italic text-slate-300">
            &ldquo;Your first step matters. We make it easy to start, stay, and scale your fitness
            journey.&rdquo;
          </blockquote>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-cyan-400 px-7 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Chat on WhatsApp
            </a>
            <Link
              href="/plans"
              className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold transition hover:border-white/40 hover:bg-white/5"
            >
              View Plans
            </Link>
          </div>
        </div>

        <ContactHeroPanel
          image={contactHeroImage}
          imageAlt={`${gymConfig.gymName} location`}
          details={heroDetails}
          whatsappHref={whatsappLink}
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <SectionHeading
          eyebrow="Get In Touch"
          title="We Are Here To Help"
          description="Choose the channel that works best for you — message, call, visit, or send the form below."
        />
        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-8">
          <ContactInfoPanel
            address={gymConfig.address}
            phone={gymConfig.phone}
            email={gymConfig.contactEmail}
            businessHours={gymConfig.businessHours}
            whatsappHref={whatsappLink}
            socialLinks={gymConfig.socialLinks}
          />
          <ContactForm interests={contactFormInterests} />
        </div>
      </section>

      <section className="border-y border-white/10 bg-slate-900/60">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <SectionHeading
            eyebrow="How We Help"
            title="Quick Access"
            description="Common reasons members reach out — we make every first conversation clear and useful."
          />
          <div className="mt-8">
            <FeatureIconGrid items={contactQuickAccess} columns={3} variant="compact" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <SectionHeading
          eyebrow="Location"
          title="Find Us On The Map"
          description={`${gymConfig.gymName} is open throughout the week — stop by during business hours for a tour or quick chat.`}
        />
        <div className="mt-8">
          <LocationMap
            latitude={gymConfig.location.latitude}
            longitude={gymConfig.location.longitude}
            zoom={gymConfig.location.zoom}
            label={gymConfig.location.mapLabel}
            address={gymConfig.address}
          />
        </div>
      </section>

      <CtaSection
        eyebrow="Start Today"
        title="Your fitness journey begins with one conversation."
        description="Message us on WhatsApp, call the front desk, or walk in during opening hours — we are ready when you are."
        primaryHref="/plans"
        primaryLabel="Browse Membership Plans"
        secondaryHref="/gallery"
        secondaryLabel="Explore The Gym"
        highlights={[
          { value: "<24h", label: "Response Time" },
          { value: "7 Days", label: "Open Weekly" },
          { value: "Free", label: "Gym Tours" },
        ]}
      />
    </PageShell>
  );
}
