export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[var(--radius-lg)] border border-[var(--aurum-line)] bg-[var(--aurum-ink-soft)] p-5 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h3 id={id} className="mb-2 text-[var(--step-1)] font-semibold text-[var(--color-gold-bright)]">
      {children}
    </h3>
  );
}
