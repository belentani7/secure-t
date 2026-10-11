export function Badge({
  children,
  tone = "gold"
}: {
  children: React.ReactNode;
  tone?: "gold" | "azure" | "mint" | "coral";
}) {
  const tones = {
    gold: "border-[var(--aurum-line-strong)] text-[var(--color-gold-bright)]",
    azure: "border-[var(--color-azure)] text-[var(--color-azure)]",
    mint: "border-[var(--color-mint)] text-[var(--color-mint)]",
    coral: "border-[var(--color-coral)] text-[var(--color-coral)]"
  } as const;
  return (
    <span className={`inline-flex items-center rounded-[var(--radius-pill)] border px-2 py-0.5 text-[0.72rem] ${tones[tone]}`}>
      {children}
    </span>
  );
}
