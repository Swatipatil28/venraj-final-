export default function SectionIntro({ eyebrow, title, body, align = "left", action = null }) {
  const alignment = align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`mb-12 flex flex-col gap-5 md:mb-14 md:flex-row md:items-end md:justify-between ${alignment}`}>
      <div className={align === "center" ? "mx-auto max-w-3xl" : "max-w-2xl"}>
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
        {body ? <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">{body}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
