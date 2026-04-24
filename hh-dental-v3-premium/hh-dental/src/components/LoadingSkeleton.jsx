export function CardSkeleton({ count = 3, height = "h-72" }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`skeleton rounded-[28px] ${height}`} />
      ))}
    </div>
  );
}

export function PanelSkeleton({ height = "h-80" }) {
  return <div className={`skeleton rounded-[32px] ${height}`} />;
}
