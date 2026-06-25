import { useMemo, type ButtonHTMLAttributes, type ReactNode } from "react";

interface RollerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  variant?: "primary" | "ghost" | "outline";
  icon?: ReactNode;
}

const NBSP = " ";

/**
 * Slot-machine roller text on hover. Each letter sits in its own
 * overflow-hidden column with two stacked copies; on hover the column rolls up
 * by exactly 1em, staggered per character.
 */
export function RollerButton({
  children,
  variant = "primary",
  icon,
  className = "",
  ...rest
}: RollerButtonProps) {
  const letters = useMemo(() => children.split(""), [children]);

  const variantClass =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:brightness-110 hover:shadow-[0_0_40px_-5px_oklch(0.78_0.16_195/0.7)]"
      : variant === "outline"
        ? "border border-white/20 bg-transparent text-foreground hover:border-primary hover:bg-white/5"
        : "border border-white/15 bg-white/5 text-foreground hover:bg-white/10 hover:border-white/30";

  return (
    <button
      {...rest}
      className={`roller-btn group relative inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-300 cursor-pointer select-none ${variantClass} ${className}`}
    >
      <span className="inline-flex" style={{ height: "1em", lineHeight: 1 }}>
        {letters.map((char, i) => {
          const display = char === " " ? NBSP : char;
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
