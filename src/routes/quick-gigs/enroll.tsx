import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Building2, Check, Clock, Sparkles, Upload, UserRound } from "lucide-react";
import { FyndLogo } from "@/components/liquid/FyndLogo";
import { ActionButton, Field, TextInput, TextArea } from "@/components/app/shared";
import { GIG_CATEGORIES, type GigCategory } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/quick-gigs/enroll")({
  component: QuickGigsEnroll,
});

type Role = "earner" | "business" | null;

function QuickGigsEnroll() {
  const [role, setRole] = useState<Role>(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-5 py-16 text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[8%] top-[10%] h-[40vw] max-h-[520px] w-[40vw] max-w-[520px] rounded-full blob-b" style={{ background: "var(--gradient-mint)", filter: "blur(85px)" }} />
        <div className="absolute bottom-[6%] left-[8%] h-[36vw] max-h-[480px] w-[36vw] max-w-[480px] rounded-full blob-c" style={{ background: "var(--gradient-violet)", filter: "blur(85px)" }} />
      </div>

      <div className="mx-auto max-w-3xl">
        <Link to="/" className="mb-10 flex justify-center"><FyndLogo size={28} /></Link>

        <AnimatePresence mode="wait">
          {submitted ? (
            <VerificationPending key="pending" />
          ) : role === null ? (
            <motion.div key="pick" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.4 }}>
              <div className="text-center">
                <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Quick Gigs</div>
                <h1 className="mt-3 text-display text-5xl md:text-6xl">How will you use it?</h1>
                <p className="mx-auto mt-4 max-w-md text-muted-foreground">Earn on bounties, or post them. Pick a role to get set up.</p>
              </div>
              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                <RoleCard accent="mint" icon={<UserRound className="size-6" />} title="I'm an earner" desc="Win paid bounties and build a portfolio you own." onClick={() => setRole("earner")} />
                <RoleCard accent="violet" icon={<Building2 className="size-6" />} title="I'm a business" desc="Post bounties, fund escrow, pick winners." onClick={() => setRole("business")} />
              </div>
            </motion.div>
          ) : role === "earner" ? (
            <EarnerForm key="earner" onBack={() => setRole(null)} />
          ) : (
            <BusinessForm key="business" onBack={() => setRole(null)} onSubmit={() => setSubmitted(true)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function RoleCard({ accent, icon, title, desc, onClick }: { accent: "mint" | "violet"; icon: React.ReactNode; title: string; desc: string; onClick: () => void }) {
  const color = `var(--color-${accent})`;
  return (
    <button onClick={onClick} className="radial-card group rounded-3xl p-8 text-left transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      <span className="inline-flex size-12 items-center justify-center rounded-2xl" style={{ background: `color-mix(in oklch, ${color} 16%, transparent)`, color }}>{icon}</span>
      <h3 className="mt-6 text-display text-3xl">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-foreground">
        Continue <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
      </span>
    </button>
  );
}

function EarnerForm({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const [cats, setCats] = useState<GigCategory[]>(["Development"]);
  const toggle = (c: GigCategory) => setCats((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.4 }} className="glass-panel rounded-[2rem] p-7 md:p-9">
      <BackLink onBack={onBack} />
      <h1 className="mt-4 text-display text-4xl md:text-5xl">Set up your earner profile.</h1>
      <p className="mt-3 text-sm text-muted-foreground">Pick what you do — we'll tune your bounty feed to match.</p>

      <form className="mt-7 space-y-6" onSubmit={(e) => { e.preventDefault(); navigate({ to: "/quick-gigs/earner/feed" }); }}>
        <Field label="Skill categories">
          <div className="flex flex-wrap gap-2.5">
            {GIG_CATEGORIES.map((c) => {
              const on = cats.includes(c);
              return (
                <button key={c} type="button" onClick={() => toggle(c)} className={cn("inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all cursor-pointer", on ? "border-[var(--color-mint)] bg-[color-mix(in_oklch,var(--color-mint)_12%,transparent)] text-foreground" : "border-[oklch(1_0_0_/_0.12)] text-muted-foreground hover:text-foreground")}>
                  {on && <Check className="size-3.5" style={{ color: "var(--color-mint)" }} />} {c}
                </button>
              );
            })}
          </div>
        </Field>
        <Field label="Short bio" hint="Optional — what makes you worth picking?">
          <TextArea rows={3} placeholder="I ship clean Solana frontends fast…" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Twitter / X" hint="Optional"><TextInput placeholder="@handle" /></Field>
          <Field label="GitHub / Portfolio" hint="Optional"><TextInput placeholder="github.com/you" /></Field>
        </div>
        <ActionButton type="submit" variant="primary" className="w-full" >
          Enter the bounty feed <ArrowRight className="size-4" />
        </ActionButton>
      </form>
    </motion.div>
  );
}

function BusinessForm({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.4 }} className="glass-panel rounded-[2rem] p-7 md:p-9">
      <BackLink onBack={onBack} />
      <h1 className="mt-4 text-display text-4xl md:text-5xl">Register your business.</h1>
      <p className="mt-3 text-sm text-muted-foreground">We verify businesses before they can fund bounties. Takes up to 48 hours.</p>

      <form className="mt-7 space-y-5" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <Field label="Company name"><TextInput placeholder="Acme Labs" required /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company email"><TextInput type="email" placeholder="team@acme.xyz" required /></Field>
          <Field label="Website"><TextInput placeholder="acme.xyz" /></Field>
        </div>
        <Field label="Social handles" hint="X, LinkedIn, etc."><TextInput placeholder="@acmelabs" /></Field>
        <Field label="Official document" hint="CAC, business license, or certificate of incorporation">
          <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-[oklch(1_0_0_/_0.18)] bg-[oklch(1_0_0_/_0.03)] px-4 py-5 transition-colors hover:border-[var(--color-violet)]">
            <span className="flex items-center gap-3 text-sm text-muted-foreground">
              <Upload className="size-4" /> Drop a PDF or click to upload
            </span>
            <input type="file" accept="application/pdf" className="hidden" />
          </label>
        </Field>
        <ActionButton type="submit" variant="primary" className="w-full">
          Submit for verification <ArrowRight className="size-4" />
        </ActionButton>
      </form>
    </motion.div>
  );
}

function VerificationPending() {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="glass-panel rounded-[2rem] p-10 text-center md:p-14">
      <span className="mx-auto inline-flex size-16 items-center justify-center rounded-2xl" style={{ background: "color-mix(in oklch, var(--color-violet) 16%, transparent)", color: "var(--color-violet)" }}>
        <Clock className="size-7" />
      </span>
      <h1 className="mt-6 text-display text-4xl md:text-5xl">Verification pending.</h1>
      <p className="mx-auto mt-4 max-w-md text-muted-foreground">
        Thanks — we're reviewing your documents. You'll get an email within 48 hours. While you
        wait, you can explore the dashboard in preview mode.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ActionButton onClick={() => navigate({ to: "/quick-gigs/business/dashboard" })}>
          <Sparkles className="size-4" /> Preview dashboard
        </ActionButton>
        <ActionButton variant="ghost" onClick={() => navigate({ to: "/" })}>Back home</ActionButton>
      </div>
    </motion.div>
  );
}

function BackLink({ onBack }: { onBack: () => void }) {
  return (
    <button onClick={onBack} className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground cursor-pointer">
      <ArrowRight className="size-3.5 rotate-180" /> Back
    </button>
  );
}
