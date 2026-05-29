import type { ReactNode } from "react";

type ContactFormProps = {
  interests?: string[];
};

export function ContactForm({
  interests = ["Membership Enquiry", "Personal Training", "Gym Tour", "General Question"],
}: ContactFormProps) {
  return (
    <form className="premium-card rounded-3xl p-6 md:p-8">
      <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Send A Message</p>
      <h2 className="mt-3 text-2xl font-semibold">Tell Us Your Goals</h2>
      <p className="mt-2 text-sm text-slate-400">
        Fill in the form and our team will get back to you within one business day.
      </p>

      <div className="mt-6 space-y-4">
        <Field label="Full Name">
          <input
            type="text"
            name="name"
            placeholder="Your name"
            className={inputClass}
          />
        </Field>

        <Field label="Email Address">
          <input
            type="email"
            name="email"
            placeholder="you@email.com"
            className={inputClass}
          />
        </Field>

        <Field label="I'm Interested In">
          <select name="interest" className={inputClass} defaultValue="">
            <option value="" disabled>
              Select a topic
            </option>
            {interests.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Your Message">
          <textarea
            name="message"
            rows={4}
            placeholder="Tell us about your fitness goals or questions"
            className={inputClass}
          />
        </Field>

        <button
          type="button"
          className="w-full rounded-full bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Send Enquiry
        </button>

        <p className="text-center text-xs text-slate-500">
          Prefer instant replies? Use WhatsApp for the fastest response.
        </p>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-300/30";
