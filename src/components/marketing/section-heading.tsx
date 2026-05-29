type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "mx-auto text-center" : "max-w-3xl";

  return (
    <div className={alignClass}>
      {eyebrow && (
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">{eyebrow}</p>
      )}
      <h2 className={`${eyebrow ? "mt-3" : ""} text-3xl font-semibold`}>{title}</h2>
      {description && <p className="mt-3 text-slate-300">{description}</p>}
    </div>
  );
}
