import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
import { Check, Heart, RotateCcw, Sparkles, Wallet, X, Zap } from "lucide-react";
import { ActionButton, OrgAvatar, Pill, PageHeading, Panel } from "@/components/app/shared";
import { jobs, applications, currentUser, helpers, type Job, type JobType } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/job-search/seeker/feed")({
  component: SeekerFeed,
});

const TYPES: (JobType | "All")[] = ["All", "Full-time", "Contract", "Part-time", "Internship"];

function SeekerFeed() {
  const [tab, setTab] = useState<"discover" | "applied">("discover");
  const [typeFilter, setTypeFilter] = useState<JobType | "All">("All");
  const [credits, setCredits] = useState(currentUser.credits);
  const [buyOpen, setBuyOpen] = useState(false);

  return (
    <div>
      <PageHeading
        eyebrow="Job Search · Seeker"
        title={<>Your <em className="italic" style={{ color: "var(--color-ember)" }}>matched</em> feed.</>}
        sub="Swipe right to let Fÿnd auto-apply for you. Swipe left to pass. Every match is ranked by your AI assessment."
        action={<CreditMeter credits={credits} onBuy={() => setBuyOpen(true)} />}
      />

      {/* tabs */}
      <div className="mt-10 flex items-center gap-2">
        <TabButton active={tab === "discover"} onClick={() => setTab("discover")}>Discover</TabButton>
        <TabButton active={tab === "applied"} onClick={() => setTab("applied")}>Applied · {applications.length}</TabButton>
      </div>

      {tab === "discover" ? (
        <Discover typeFilter={typeFilter} setTypeFilter={setTypeFilter} credits={credits} setCredits={setCredits} onNeedCredits={() => setBuyOpen(true)} />
      ) : (
        <Applied />
      )}

      <AnimatePresence>
        {buyOpen && <BuyCreditsModal onClose={() => setBuyOpen(false)} onBuy={() => { setCredits((c) => c + 200); setBuyOpen(false); }} />}
      </AnimatePresence>
    </div>
  );
}

function CreditMeter({ credits, onBuy }: { credits: number; onBuy: () => void }) {
  const low = credits < 30;
  return (
    <button onClick={onBuy} className={cn("inline-flex items-center gap-3 rounded-2xl border px-5 py-3 text-left transition-colors cursor-pointer", low ? "border-[color-mix(in_oklch,var(--destructive)_45%,transparent)]" : "border-[oklch(1_0_0_/_0.12)] hover:border-[var(--color-ember)]")}>
      <Wallet className="size-5" style={{ color: low ? "var(--destructive)" : "var(--color-ember)" }} />
      <span>
        <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Credits</span>
        <span className="block text-xl font-semibold tabular-nums">{credits}</span>
      </span>
      <span className="ml-2 rounded-full bg-[oklch(1_0_0_/_0.06)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{low ? "Top up" : "Buy"}</span>
    </button>
  );
}

function Discover({
  typeFilter,
  setTypeFilter,
  credits,
  setCredits,
  onNeedCredits,
}: {
  typeFilter: JobType | "All";
  setTypeFilter: (t: JobType | "All") => void;
  credits: number;
  setCredits: (fn: (c: number) => number) => void;
  onNeedCredits: () => void;
}) {
  const pool = useMemo(() => jobs.filter((j) => typeFilter === "All" || j.type === typeFilter), [typeFilter]);
  const [index, setIndex] = useState(0);
  const [applyJob, setApplyJob] = useState<Job | null>(null);
  const [lastPass, setLastPass] = useState<Job | null>(null);

  const remaining = pool.slice(index);
  const exhausted = remaining.length === 0;

  function advance() {
    setIndex((i) => i + 1);
  }
  function onSwipe(dir: "left" | "right", job: Job) {
    if (dir === "right") {
      if (credits < job.cost) { onNeedCredits(); return; }
      setApplyJob(job);
    } else {
      setLastPass(job);
    }
    advance();
  }

  return (
    <div>
      {/* filters */}
      <div className="mt-8 flex flex-wrap gap-2">
        {TYPES.map((t) => (
          <button key={t} onClick={() => { setTypeFilter(t); setIndex(0); }} className={cn("rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] transition-all cursor-pointer", typeFilter === t ? "border-[var(--color-ember)] bg-[color-mix(in_oklch,var(--color-ember)_12%,transparent)] text-foreground" : "border-[oklch(1_0_0_/_0.1)] text-muted-foreground hover:text-foreground")}>
            {t}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_300px]">
        {/* card stack */}
        <div className="relative mx-auto h-[480px] w-full max-w-md">
          {exhausted ? (
            <EmptyStack onReset={() => setIndex(0)} />
          ) : (
            <>
              {remaining.slice(0, 3).reverse().map((job, i) => {
                const depth = remaining.slice(0, 3).length - 1 - i;
                const isTop = depth === 0;
                return (
                  <SwipeCard key={job.id} job={job} isTop={isTop} depth={depth} onSwipe={(dir) => onSwipe(dir, job)} />
                );
              })}
            </>
          )}
        </div>

        {/* side rail */}
        <div className="space-y-4">
          <Panel className="p-6">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">How it works</div>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3"><Heart className="size-4" style={{ color: "var(--color-mint)" }} /> Swipe right → AI auto-applies</li>
              <li className="flex items-center gap-3"><X className="size-4 text-muted-foreground" /> Swipe left → pass</li>
              <li className="flex items-center gap-3"><Zap className="size-4" style={{ color: "var(--color-ember)" }} /> Each apply costs credits</li>
            </ul>
          </Panel>
          {lastPass && (
            <Panel className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Passed on {lastPass.company}</span>
                <button onClick={() => setIndex((i) => Math.max(0, i - 1))} className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-foreground hover:text-[var(--color-ember)] cursor-pointer">
                  <RotateCcw className="size-3.5" /> Undo
                </button>
              </div>
            </Panel>
          )}
          <div className="px-1 text-xs text-muted-foreground/70">{remaining.length} roles left in this filter</div>
        </div>
      </div>

      <AnimatePresence>
        {applyJob && (
          <AutoApplyModal job={applyJob} onClose={() => setApplyJob(null)} onConfirm={() => { setCredits((c) => c - applyJob.cost); setApplyJob(null); }} />
        )}
      </AnimatePresence>
    </div>
  );
}

function SwipeCard({ job, isTop, depth, onSwipe }: { job: Job; isTop: boolean; depth: number; onSwipe: (dir: "left" | "right") => void }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  const applyOpacity = useTransform(x, [20, 140], [0, 1]);
  const passOpacity = useTransform(x, [-20, -140], [0, 1]);

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x: isTop ? x : 0, rotate: isTop ? rotate : 0, zIndex: 10 - depth }}
      initial={{ scale: 1 - depth * 0.04, y: depth * 14, opacity: depth > 2 ? 0 : 1 }}
      animate={{ scale: 1 - depth * 0.04, y: depth * 14, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(_, info) => {
        if (info.offset.x > 130) onSwipe("right");
        else if (info.offset.x < -130) onSwipe("left");
      }}
      whileDrag={{ cursor: "grabbing" }}
    >
      <div className="radial-card grain relative flex h-full flex-col overflow-hidden rounded-[2rem] p-7" style={{ ["--rx" as string]: "80%" }}>
        {/* swipe overlays */}
        <motion.span style={{ opacity: applyOpacity }} className="absolute left-6 top-6 z-10 rotate-[-12deg] rounded-xl border-2 px-4 py-1.5 text-sm font-bold uppercase tracking-widest" >
          <span style={{ color: "var(--color-mint)", borderColor: "var(--color-mint)" }}>Apply</span>
        </motion.span>
        <motion.span style={{ opacity: passOpacity }} className="absolute right-6 top-6 z-10 rotate-[12deg] rounded-xl border-2 px-4 py-1.5 text-sm font-bold uppercase tracking-widest" >
          <span style={{ color: "var(--destructive)", borderColor: "var(--destructive)" }}>Pass</span>
        </motion.span>

        <div className="flex items-start justify-between">
          <OrgAvatar src={job.logo} name={job.company} size={52} />
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold" style={{ background: "color-mix(in oklch, var(--color-mint) 14%, transparent)", color: "var(--color-mint)" }}>
            <Sparkles className="size-3.5" /> {job.fit}% fit
          </span>
        </div>

        <div className="mt-7">
          <h3 className="text-display text-3xl leading-tight md:text-4xl">{job.title}</h3>
          <div className="mt-2 text-sm text-muted-foreground">{job.company} · {job.location}</div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Pill accent="ember">{job.type}</Pill>
          {job.skills.map((s) => <Pill key={s}>{s}</Pill>)}
        </div>

        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{job.description}</p>

        <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-5">
          <span className="text-display text-xl" style={{ color: "var(--color-ember)" }}>{job.salary}</span>
          <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{job.cost} credits to apply</span>
        </div>

        {/* action buttons (a11y + non-drag) */}
        {isTop && (
          <div className="mt-6 flex items-center justify-center gap-5">
            <CircleBtn label="Pass" onClick={() => onSwipe("left")} variant="pass"><X className="size-6" /></CircleBtn>
            <CircleBtn label="Apply" onClick={() => onSwipe("right")} variant="apply"><Heart className="size-6" /></CircleBtn>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function CircleBtn({ children, label, onClick, variant }: { children: React.ReactNode; label: string; onClick: () => void; variant: "pass" | "apply" }) {
  return (
    <button onClick={onClick} aria-label={label} className={cn("inline-flex size-14 items-center justify-center rounded-full border-2 transition-all hover:scale-110 cursor-pointer", variant === "apply" ? "border-[var(--color-mint)] text-[var(--color-mint)] hover:bg-[color-mix(in_oklch,var(--color-mint)_14%,transparent)]" : "border-[oklch(1_0_0_/_0.2)] text-muted-foreground hover:border-[var(--destructive)] hover:text-[var(--destructive)]")}>
      {children}
    </button>
  );
}

function EmptyStack({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-[2rem] border border-dashed border-[oklch(1_0_0_/_0.14)] text-center">
      <Check className="size-10" style={{ color: "var(--color-mint)" }} />
      <h3 className="mt-5 text-display text-2xl">You're all caught up.</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">No more roles in this filter. New matches drop daily.</p>
      <button onClick={onReset} className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-foreground hover:text-[var(--color-ember)] cursor-pointer"><RotateCcw className="size-3.5" /> Replay stack</button>
    </div>
  );
}

/* ---------------------------- auto-apply --------------------------- */

function AutoApplyModal({ job, onClose, onConfirm }: { job: Job; onClose: () => void; onConfirm: () => void }) {
  const [stage, setStage] = useState<"generating" | "preview">("generating");
  const [useOwnResume, setUseOwnResume] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setStage("preview"), 1900);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <Overlay onClose={onClose}>
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="relative z-10 w-full max-w-lg glass-panel rounded-[2rem] p-7 md:p-8">
        <div className="flex items-center gap-3">
          <OrgAvatar src={job.logo} name={job.company} size={44} />
          <div>
            <div className="text-sm font-semibold">{job.title}</div>
            <div className="text-xs text-muted-foreground">{job.company}</div>
          </div>
        </div>

        {stage === "generating" ? (
          <div className="py-12 text-center">
            <div className="mx-auto flex items-center justify-center gap-1.5">
              {[0, 1, 2].map((i) => <motion.span key={i} className="size-2.5 rounded-full" style={{ background: "var(--color-ember)" }} animate={{ y: [0, -8, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />)}
            </div>
            <h3 className="mt-6 text-display text-3xl">Applying for you…</h3>
            <p className="mt-2 text-sm text-muted-foreground">Nova is tailoring a cover letter and resume to this role.</p>
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em]" style={{ color: "var(--color-mint)" }}><Sparkles className="size-3.5" /> Draft ready</span>
              <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                <input type="checkbox" checked={useOwnResume} onChange={(e) => setUseOwnResume(e.target.checked)} className="accent-[var(--color-ember)]" /> Use my own resume
              </label>
            </div>
            <div className="mt-4 max-h-52 overflow-y-auto rounded-2xl border border-[oklch(1_0_0_/_0.1)] bg-[oklch(1_0_0_/_0.03)] p-5 text-sm leading-relaxed text-muted-foreground">
              <p>Dear {job.company} team,</p>
              <p className="mt-3">As a {currentUser.skills[0]} with a track record of shipping {job.skills.join(", ")} at speed, your {job.title} role is exactly the surface I want to own. I've spent the last four years…</p>
              <p className="mt-3">…which is why I'd bring immediate leverage to your team. {useOwnResume ? "My attached resume covers the rest." : "Fÿnd generated a tailored resume to match."}</p>
              <p className="mt-3">— {currentUser.fullName}</p>
            </div>
            <div className="mt-6 flex items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">{job.cost} credits will be used</span>
              <div className="flex gap-2">
                <ActionButton variant="ghost" onClick={onClose}>Edit</ActionButton>
                <ActionButton onClick={onConfirm}><Check className="size-4" /> Confirm & send</ActionButton>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </Overlay>
  );
}

function BuyCreditsModal({ onClose, onBuy }: { onClose: () => void; onBuy: () => void }) {
  return (
    <Overlay onClose={onClose}>
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }} transition={{ duration: 0.3 }} className="relative z-10 w-full max-w-sm glass-panel rounded-[2rem] p-7 text-center">
        <Wallet className="mx-auto size-9" style={{ color: "var(--color-ember)" }} />
        <h3 className="mt-5 text-display text-3xl">Top up credits</h3>
        <p className="mt-2 text-sm text-muted-foreground">Buy 200 credits for $5. Enough for ~25 auto-applies.</p>
        <div className="mt-6 rounded-2xl border border-[oklch(1_0_0_/_0.1)] bg-[oklch(1_0_0_/_0.03)] p-5">
          <div className="flex items-baseline justify-between"><span className="text-sm text-muted-foreground">200 credits</span><span className="text-display text-3xl" style={{ color: "var(--color-ember)" }}>$5</span></div>
        </div>
        <div className="mt-6 space-y-2">
          <ActionButton onClick={onBuy} className="w-full">Pay with Paystack</ActionButton>
          <button onClick={onClose} className="w-full text-xs text-muted-foreground hover:text-foreground cursor-pointer">Maybe later</button>
        </div>
      </motion.div>
    </Overlay>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={onClose} />
      {children}
    </motion.div>
  );
}

/* ------------------------------ applied ---------------------------- */

function Applied() {
  return (
    <div className="mt-10 space-y-3">
      {applications.map((a) => (
        <Panel key={a.id} className="flex items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-4">
            <OrgAvatar src={a.logo} name={a.company} size={44} />
            <div>
              <div className="font-medium">{a.title}</div>
              <div className="text-xs text-muted-foreground">{a.company} · applied {a.appliedAt}</div>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.16em]" style={{ color: helpers.statusColor(a.status), borderColor: "color-mix(in oklch, " + helpers.statusColor(a.status) + " 40%, transparent)" }}>
            {a.status}
          </span>
        </Panel>
      ))}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn("rounded-full px-5 py-2.5 text-xs uppercase tracking-[0.16em] transition-all cursor-pointer", active ? "bg-[oklch(1_0_0_/_0.08)] text-foreground" : "text-muted-foreground hover:text-foreground")}>
      {children}
    </button>
  );
}
