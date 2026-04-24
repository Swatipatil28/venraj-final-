export default function SectionTitle({ label, title, subtitle, center=false, light=false }) {
  return (
    <div className={`mb-10 ${center?"text-center":""}`}>
      {label && <div className="section-label mb-4">{label}</div>}
      <h2 className="font-display text-ivory font-light text-4xl md:text-5xl leading-tight"
        dangerouslySetInnerHTML={{__html: title}} />
      {subtitle && (
        <p className={`mt-4 font-sans text-ivory/40 text-sm font-light leading-relaxed max-w-xl ${center?"mx-auto":""}`}>{subtitle}</p>
      )}
    </div>
  );
}
