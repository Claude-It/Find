import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check, FileText, Upload } from "lucide-react";
import { FyndLogo } from "@/components/liquid/FyndLogo";
import { ActionButton, Field, TextInput, TextArea } from "@/components/app/shared";
import { SEEKER_SKILLS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/job-search/seeker/enroll")({
  component: SeekerEnroll,
});

function SeekerEnroll() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<string[]>(["TypeScript Developer", "Solana Engineer"]);
  const toggle = (s: string) => setSkills((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-5 py-16 text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[8%] top-[10%] h-[40vw] max-h-[520px] w-[40vw] max-w-[520px] rounded-full blob-a" style={{ background: "var(--gradient-ember)", filter: "blur(80px)" }} />
      </div>

      <div className="mx-auto max-w-2xl">
        <Link to="/" className="mb-10 flex justify-center"><FyndLogo size={28} /></Link>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="glass-panel rounded-[2rem] p-7 md:p-9">
          <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Step 2 of 2 · Job Search</div>
          <h1 className="mt-3 text-display text-4xl md:text-5xl">What do you do?</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Pick your crafts. Your AI interview and matches are scoped to exactly these — broad
            skills get sub-topic coverage, specific ones stay focused.
          </p>

          <form className="mt-7 space-y-6" onSubmit={(e) => { e.preventDefault(); navigate({ to: "/job-search/seeker/assessment" }); }}>
            <Field label={`Skill categories · ${skills.length} selected`}>
              <div className="flex flex-wrap gap-2.5">
                {SEEKER_SKILLS.map((s) => {
                  const on = skills.includes(s);
                  return (
                    <button key={s} type="button" onClick={() => toggle(s)} className={cn("inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm transition-all cursor-pointer", on ? "border-[var(--color-ember)] bg-[color-mix(in_oklch,var(--color-ember)_12%,transparent)] text-foreground" : "border-[oklch(1_0_0_/_0.12)] text-muted-foreground hover:text-foreground")}>
                      {on && <Check className="size-3.5" style={{ color: "var(--color-ember)" }} />} {s}
                    </button>
                  );
                })}
              </div>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Years of experience"><TextInput type="number" min={0} defaultValue={4} /></Field>
              <Field label="Portfolio link" hint="Optional"><TextInput placeholder="yoursite.com" /></Field>
            </div>

            <Field label="Resume" hint="PDF — optional, you can add it later">
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-[oklch(1_0_0_/_0.18)] bg-[oklch(1_0_0_/_0.03)] px-4 py-5 transition-colors hover:border-[var(--color-ember)]">
                <span className="flex items-center gap-3 text-sm text-muted-foreground"><Upload className="size-4" /> Upload your resume</span>
                <FileText className="size-4 text-muted-foreground" />
                <input type="file" accept="application/pdf" className="hidden" />
              </label>
            </Field>

            <Field label="Brief bio"><TextArea rows={3} defaultValue="Full-stack engineer who ships. Solana, TypeScript, and pixel-tight UI." /></Field>

            <ActionButton type="submit" className="w-full" disabled={skills.length === 0}>
              Start AI assessment <ArrowRight className="size-4" />
            </ActionButton>
            <p className="text-center text-xs text-muted-foreground/70">Takes ~15 minutes · voice-based · one-time</p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
