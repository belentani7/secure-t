import { forwardRef } from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "ghost" | "azure";
  size?: "sm" | "md";
}

/**
 * Botón AURUM. Los estilos usan los tokens de `tokens.css`; el foco es siempre
 * visible (WCAG 2.2, criterio 2.4.11) y el estado deshabilitado no depende sólo
 * del color (se reduce la opacidad y se bloquea el puntero).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "solid", size = "md", className = "", type = "button", ...rest },
  ref
) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-medium transition " +
    "focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50";
  const sizes = { sm: "px-3 py-1.5 text-[0.85rem]", md: "px-4 py-2 text-[0.95rem]" } as const;
  const variants = {
    solid: "bg-[var(--color-gold)] text-[var(--aurum-ink)] hover:bg-[var(--color-gold-bright)]",
    ghost: "border border-[var(--aurum-line-strong)] text-[var(--aurum-text)] hover:border-[var(--color-gold)]",
    azure: "border border-[var(--color-azure)] text-[var(--color-azure)] hover:bg-[rgb(90_169_255_/_12%)]"
  } as const;
  return <button ref={ref} type={type} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest} />;
});
