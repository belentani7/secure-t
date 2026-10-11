export function Progress({
  value,
  max = 100,
  label
}: {
  value: number;
  max?: number;
  label: string;
}) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-label={label}
      className="h-2 w-full overflow-hidden rounded-[var(--radius-pill)] bg-[var(--aurum-ink-raised)]"
    >
      <span
        className="block h-full bg-[linear-gradient(90deg,var(--color-gold-deep),var(--color-gold-bright))]"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
