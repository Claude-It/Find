import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRightLeft, Briefcase, RefreshCw, Zap } from "lucide-react";
import { ActionButton, PageHeading, Panel, Pill } from "@/components/app/shared";

export const Route = createFileRoute("/_app/switch")({
  component: SwitchShowcase,
});

function SwitchShowcase() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeading
        eyebrow="Shared · Flip switch"
        title={
          <>
            One account, <em className="italic text-[var(--color-ember)]">two</em> sides.
          </>
        }
        sub="This is the explicit switch screen from the guide. The persistent nav button performs the same pancake flip and lands users on the opposite side."
        action={
          <ActionButton onClick={() => navigate({ to: "/quick-gigs/earner/feed" })}>
            Try Quick Gigs <RefreshCw className="size-4" />
          </ActionButton>
        }
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.8fr_1fr] lg:items-center">
        <SideCard
          icon={<Briefcase className="size-7" />}
          label="Job Search"
          title="AI-vetted roles"
          copy="Assessment scores, swipe-to-apply, credits, and AI-generated applications all live here."
          accent="ember"
          action={() => navigate({ to: "/job-search/seeker/feed" })}
        />

        <div className="relative flex min-h-72 items-center justify-center">
          <motion.div
            className="absolute inset-8 rounded-[2rem] border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.03)]"
            style={{ transformStyle: "preserve-3d" }}
            animate={{ rotateY: [0, 180, 360] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: [0.7, 0, 0.2, 1] }}
          />
          <span className="relative inline-flex size-24 items-center justify-center rounded-full glass-panel">
            <ArrowRightLeft className="size-9 text-[var(--color-violet)]" />
          </span>
        </div>

        <SideCard
          icon={<Zap className="size-7" />}
          label="Quick Gigs"
          title="Escrow-backed bounties"
          copy="Funded bounties, submissions, public portfolios, winner selection, and release-funds UI live here."
          accent="mint"
          action={() => navigate({ to: "/quick-gigs/earner/feed" })}
        />
      </div>
    </div>
  );
}

function SideCard({
  icon,
  label,
  title,
  copy,
  accent,
  action,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  copy: string;
  accent: "ember" | "mint";
  action: () => void;
}) {
  const color = `var(--color-${accent})`;

  return (
    <Panel className="p-7 md:p-8">
      <span
        className="inline-flex size-14 items-center justify-center rounded-2xl"
        style={{ background: `color-mix(in oklch, ${color} 16%, transparent)`, color }}
      >
        {icon}
      </span>
      <div className="mt-6">
        <Pill accent={accent}>{label}</Pill>
        <h2 className="mt-4 text-display text-4xl">{title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy}</p>
      </div>
      <ActionButton className="mt-7" variant="outline" onClick={action}>
        Open side
      </ActionButton>
    </Panel>
  );
}
