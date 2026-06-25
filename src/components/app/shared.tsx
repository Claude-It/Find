/**
 * Shared, theme-aware building blocks for the in-app (post-login) screens.
 *
 * Everything here is built on the design-system CSS tokens (bg-card,
 * text-muted-foreground, glass-panel, radial-card, --color-ember …) so every
 * screen re-skins instantly when the user flips between the Liquid and Foundry
 * themes. That live re-skin is the headline demo moment.
 */
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Section eyebrow label, e.g. "02 — The platform". */
export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("text-[11px] uppercase tracking-[0.28em] text-muted-foreground", className)}>
      {children}
    </div>
  );
}

/* Small rounded tag. */
export function Pill({
  children,
  accent,
  className,
}: {
  children: ReactNode;
  accent?: "ember" | "mint" | "violet";
  className?: string;
}) {
  const color =
    accent === "ember"
      ? "var(--color-ember)"
      : accent === "mint"
        ? "var(--color-mint)"
        : accent === "violet"
          ? "var(--color-violet)"
          : undefined;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.16em]",
        "border-[oklch(1_0_0_/_0.1)] bg-[oklch(1_0_0_/_0.03)] text-muted-foreground",
        className,
      )}
      style={color ? { color, borderColor: "color-mix(in oklch, " + "currentColor 35%, transparent)" } : undefined}
    >
      {children}
    </span>
  );
}

/* Glass card surface used for most app panels. */
export function Panel({
  children,
  className,
  glow,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={cn(
        "radial-card rounded-3xl",
        glow && "shadow-[var(--shadow-glow)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* A KPI / stat block. */
export function StatCard({
  label,
  value,
  hint,
  accent = "ember",
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: "ember" | "mint" | "violet";
}) {
  const color = `var(--color-${accent})`;
  return (
    <Panel className="p-6">
      <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-3 text-display text-4xl md:text-5xl" style={{ color }}>
        {value}
      </div>
      {hint && <div className="mt-2 text-xs text-muted-foreground">{hint}</div>}
    </Panel>
  );
}

/* On-chain escrow status chip. */
export function EscrowBadge({ funded }: { funded: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em]",
        funded
          ? "border-[color-mix(in_oklch,var(--color-mint)_40%,transparent)] text-[var(--color-mint)] bg-[color-mix(in_oklch,var(--color-mint)_10%,transparent)]"
          : "border-[oklch(1_0_0_/_0.12)] text-muted-foreground bg-[oklch(1_0_0_/_0.03)]",
      )}
    >
      <span
        className={cn("size-1.5 rounded-full", funded && "animate-pulse")}
        style={{ background: funded ? "var(--color-mint)" : "var(--color-muted-foreground)" }}
      />
      {funded ? "Funds in escrow" : "Awaiting escrow"}
    </span>
  );
}

/* Page title block used at the top of app screens. */
export function PageHeading({
  eyebrow,
  title,
  sub,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <SectionLabel className="mb-3">{eyebrow}</SectionLabel>}
        <h1 className="text-display text-4xl leading-[0.95] md:text-6xl">{title}</h1>
        {sub && <p className="mt-4 max-w-xl text-muted-foreground">{sub}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* Primary pill action button (token-styled, works in both themes). */
export function ActionButton({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "ghost";
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
}) {
  const variantClass =
    variant === "primary"
      ? "bg-[var(--color-ember)] text-[color:var(--primary-foreground)] hover:brightness-110 hover:shadow-[var(--shadow-glow)]"
      : variant === "outline"
        ? "bg-transparent text-foreground border border-[oklch(1_0_0_/_0.18)] hover:border-[var(--color-ember)] hover:bg-[oklch(1_0_0_/_0.04)]"
        : "bg-[oklch(1_0_0_/_0.05)] text-foreground border border-[oklch(1_0_0_/_0.08)] hover:bg-[oklch(1_0_0_/_0.09)]";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] transition-all duration-300 cursor-pointer select-none disabled:cursor-not-allowed disabled:opacity-50",
        variantClass,
        className,
      )}
    >
      {children}
    </button>
  );
}

/* Labelled form field shell. */
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
      {hint && <span className="mt-1.5 block text-xs text-muted-foreground/70">{hint}</span>}
    </label>
  );
}

/* Token-styled text input. */
export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-xl border border-[oklch(1_0_0_/_0.1)] bg-[oklch(1_0_0_/_0.03)] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-[var(--color-ember)] focus:bg-[oklch(1_0_0_/_0.05)]",
        props.className,
      )}
    />
  );
}

/* Token-styled textarea. */
export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-xl border border-[oklch(1_0_0_/_0.1)] bg-[oklch(1_0_0_/_0.03)] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-[var(--color-ember)] focus:bg-[oklch(1_0_0_/_0.05)] resize-none",
        props.className,
      )}
    />
  );
}

/* Company / org avatar that gracefully falls back to an initial. */
export function OrgAvatar({ src, name, size = 40 }: { src?: string; name: string; size?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[oklch(1_0_0_/_0.1)] bg-[oklch(1_0_0_/_0.04)] text-sm font-semibold text-muted-foreground"
      style={{ width: size, height: size }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        name.charAt(0)
      )}
    </span>
  );
}
