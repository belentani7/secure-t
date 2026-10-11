export function Callout({
  title,
  children,
  tone = "gold"
}: {
  title: string;
  children: React.ReactNode;
  tone?: "gold" | "azure" | "coral";
}) {
  const tones = {
    gold: "border-l-[var(--color-gold)]",
    azure: "border-l-[var(--color-azure)]",
    coral: "border-l-[var(--color-coral)]"
  } as const;
  return (
    <aside className={`border-l-4 ${tones[tone]} bg-[var(--aurum-ink-soft)] p-4`}>
      <p className="mb-1 font-semibold text-[var(--color-gold-bright)]">{title}</p>
      <div className="text-[var(--aurum-muted)]">{children}</div>
    </aside>
  );
}
