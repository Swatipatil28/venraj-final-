export default function SectionIntro({ eyebrow, title, body, align = "left", action = null }) {
  const alignment = align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`mb-10 sm:mb-12 md:mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${alignment}`}>
      <div className={align === "center" ? "mx-auto max-w-3xl" : "max-w-2xl"}>
        <p className="eyebrow mb-2 sm:mb-3 text-xs sm:text-sm">{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
        {body ? <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base leading-7 sm:leading-8 text-[var(--muted)]">{body}</p> : null}
      </div>
      {action ? <div className="w-full sm:w-auto">{action}</div> : null}
    </div>
  );
}
