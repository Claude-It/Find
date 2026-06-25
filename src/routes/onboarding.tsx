import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Briefcase, Check, Zap } from "lucide-react";
import { FyndLogo } from "@/components/liquid/FyndLogo";
import { ActionButton } from "@/components/app/shared";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

type Side = "job-search" | "quick-gigs";

function Onboarding() {
  const navigate = useNavigate();
  const [picked, setPicked] = useState<Side[]>([]);

  const toggle = (s: Side) =>
    setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  function proceed() {
    if (picked.includes("job-search")) {
      navigate({ to: "/job-search/seeker/enroll" });
    } else if (picked.includes("quick-gigs")) {
      navigate({ to: "/quick-gigs/enroll" });
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-5 py-16 text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[6%] top-[8%] h-[40vw] max-h-[520px] w-[40vw] max-w-[520px] rounded-full blob-a" style={{ background: "var(--gradient-ember)", filter: "blur(80px)" }} />
        <div className="absolute bottom-[4%] right-[6%] h-[38vw] max-h-[500px] w-[38vw] max-w-[500px] rounded-full blob-b" style={{ background: "var(--gradient-mint)", filter: "blur(85px)" }} />
      </div>

      <div className="mx-auto max-w-4xl">
        <Link to="/" className="mb-12 flex justify-center">
          <FyndLogo size={30} />
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Step 1 of 2</div>
          <h1 className="mt-4 text-display text-5xl md:text-7xl">Which side are you on?</h1>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Pick one — or both. One Fÿnd account works everywhere, and you can flip between sides
            any time with a single tap.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <SideOption
            picked={picked.includes("job-search")}
            onClick={() => toggle("job-search")}
            accent="ember"
            icon={<Briefcase className="size-6" />}
            tag="Job Search"
            title="Find vetted work"
            desc="Take one AI-led assessment, then let Fÿnd match and auto-apply to roles you'd actually love."
            points={["AI interviewer vets you once", "Swipe a feed of ranked roles", "Auto-apply while you sleep"]}
          />
          <SideOption
            picked={picked.includes("quick-gigs")}
            onClick={() => toggle("quick-gigs")}
            accent="mint"
            icon={<Zap className="size-6" />}
            tag="Quick Gigs"
            title="Earn on bounties"
            desc="Browse paid bounties, submit your work, and get paid in USDC the moment you're picked — escrow on-chain."
            points={["Escrow funded before you start", "USDC payouts, instantly", "A portfolio you own & export"]}
          />
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <ActionButton onClick={proceed} disabled={picked.length === 0} className="px-10">
            {picked.length === 2 ? "Join both sides" : "Continue"} <ArrowRight className="size-4" />
          </ActionButton>
          <span className="text-xs text-muted-foreground/70">
            {picked.length === 0 ? "Select at least one to continue" : "You can add the other side later"}
          </span>
        </div>
      </div>
    </div>
  );
}

function SideOption({
  picked,
  onClick,
  accent,
  icon,
  tag,
  title,
  desc,
  points,
}: {
  picked: boolean;
  onClick: () => void;
  accent: "ember" | "mint";
  icon: React.ReactNode;
  tag: string;
  title: string;
  desc: string;
  points: string[];
}) {
  const color = `var(--color-${accent})`;
  return (
    <button
      onClick={onClick}
      className={cn(
        "radial-card group relative overflow-hidden rounded-3xl p-8 text-left transition-all duration-300 cursor-pointer hover:-translate-y-1",
        picked && "shadow-[var(--shadow-glow)]",
      )}
      style={picked ? ({ borderColor: color } as React.CSSProperties) : undefined}
    >
      <span
        className={cn(
          "absolute right-5 top-5 inline-flex size-7 items-center justify-center rounded-full transition-all",
          picked ? "scale-100" : "scale-90 opacity-40",
        )}
        style={{ background: picked ? color : "oklch(1 0 0 / 0.1)", color: picked ? "var(--primary-foreground)" : "transparent" }}
      >
        <Check className="size-4" />
      </span>

      <span className="inline-flex size-12 items-center justify-center rounded-2xl" style={{ background: `color-mix(in oklch, ${color} 16%, transparent)`, color }}>
        {icon}
      </span>
      <div className="mt-6 text-[11px] uppercase tracking-[0.22em]" style={{ color }}>{tag}</div>
      <h3 className="mt-2 text-display text-3xl md:text-4xl">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{desc}</p>
      <ul className="mt-6 space-y-2.5 border-t border-border/40 pt-5">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2.5 text-sm text-foreground/90">
            <span className="mt-1.5 size-1 rounded-full" style={{ background: color }} />
            {p}
          </li>
        ))}
      </ul>
    </button>
  );
}
