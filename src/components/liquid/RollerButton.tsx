import { useMemo, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RollerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  variant?: "primary" | "ghost" | "outline";
  icon?: ReactNode;
}

/**
 * Slot-machine / casino roller text on hover. Each letter sits in its own
 * overflow-hidden column with two stacked copies; on hover the column
 * translates up by 1em, staggered per char.
 */
export function RollerButton({
  children,
  variant = "primary",
  icon,
  className,
  ...rest
}: RollerButtonProps) {
  const letters = useMemo(() => children.split(""), [children]);

  const variantClass =
    variant === "primary"
      ? "bg-[var(--color-ember)] text-[color:var(--primary-foreground)] hover:shadow-[var(--shadow-glow)] hover:brightness-110"
      : variant === "outline"
        ? "bg-transparent text-foreground border border-[oklch(1_0_0_/_0.18)] hover:border-[var(--color-ember)] hover:bg-[oklch(1_0_0_/_0.04)]"
        : "bg-[oklch(1_0_0_/_0.05)] text-foreground border border-[oklch(1_0_0_/_0.08)] hover:bg-[oklch(1_0_0_/_0.09)]";

  return (
    <button
      {...rest}
      className={cn(
        "roller-btn group relative inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] transition-all duration-300 cursor-pointer select-none",
        variantClass,
        className,
      )}
    >
      <span className="inline-flex" style={{ height: "1em", lineHeight: 1 }}>
        {letters.map((char, i) => {
          const display = char === " " ? " " : char;
          return (
            <span
              key={i}
              className="relative inline-block overflow-hidden align-top"
              style={{ height: "1em", lineHeight: 1 }}
            >
              <span className="roller-col block" style={{ transitionDelay: `${i * 28}ms` }}>
                <span className="block" style={{ height: "1em", lineHeight: 1 }}>
                  {display}
                </span>
                <span className="block" style={{ height: "1em", lineHeight: 1 }}>
                  {display}
                </span>
              </span>
            </span>
          );
        })}
      </span>
      {icon && <span className="relative inline-flex">{icon}</span>}
      <style>{`
        .roller-btn .roller-col {
          transform: translateY(0);
          transition: transform 520ms cubic-bezier(0.7, 0, 0.2, 1);
        }
        .roller-btn:hover .roller-col {
          transform: translateY(-1em);
        }
      `}</style>
    </button>
  );
}
