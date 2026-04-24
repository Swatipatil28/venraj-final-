export function LoadingSpinner({ center = true }) {
  return (
    <div className={center ? "flex justify-center items-center py-20" : "inline-flex"}>
      <div className="w-8 h-8 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
    </div>
  );
}
export function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden animate-pulse" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(212,175,55,0.08)" }}>
      <div className="h-48 bg-white/5" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-white/5 rounded w-16" />
        <div className="h-5 bg-white/5 rounded w-3/4" />
        <div className="h-3 bg-white/5 rounded w-full" />
      </div>
    </div>
  );
}
export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="text-center py-16">
      <p className="text-ivory/40 mb-4 font-sans">{message || "Something went wrong."}</p>
      {onRetry && <button onClick={onRetry} className="btn-ghost text-[10px]">Try again</button>}
    </div>
  );
}
