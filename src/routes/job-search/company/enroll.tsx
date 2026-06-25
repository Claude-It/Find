import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Building2, Upload } from "lucide-react";
import { FyndLogo } from "@/components/liquid/FyndLogo";
import { ActionButton, Field, TextInput } from "@/components/app/shared";

export const Route = createFileRoute("/job-search/company/enroll")({
  component: CompanyEnroll,
});

function CompanyEnroll() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-5 py-16 text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-[8%] top-[8%] h-[40vw] max-h-[520px] w-[40vw] max-w-[520px] rounded-full blob-a"
          style={{ background: "var(--gradient-ember)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-[5%] right-[8%] h-[36vw] max-h-[480px] w-[36vw] max-w-[480px] rounded-full blob-c"
          style={{ background: "var(--gradient-violet)", filter: "blur(85px)" }}
        />
      </div>

      <div className="mx-auto max-w-2xl">
        <Link to="/" className="mb-10 flex justify-center">
          <FyndLogo size={28} />
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel rounded-[2rem] p-7 md:p-9"
        >
          <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-[color-mix(in_oklch,var(--color-ember)_16%,transparent)] text-[var(--color-ember)]">
            <Building2 className="size-6" />
          </div>
          <div className="mt-6 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            Job Search · Company
          </div>
          <h1 className="mt-3 text-display text-4xl md:text-5xl">Hire from the vetted pool.</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Set up your company profile, choose a posting plan, then review AI-ranked applicants
            with interview scores and generated cover letters.
          </p>

          <form
            className="mt-7 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/job-search/company/plans" });
            }}
          >
            <Field label="Company name">
              <TextInput defaultValue="Fynd Labs" placeholder="Acme Labs" required />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company email">
                <TextInput
                  defaultValue="talent@fynd.xyz"
                  type="email"
                  placeholder="team@company.com"
                  required
                />
              </Field>
              <Field label="Website">
                <TextInput defaultValue="fynd.xyz" placeholder="company.com" />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Industry">
                <TextInput defaultValue="Hiring infrastructure" placeholder="Fintech, AI, etc." />
              </Field>
              <Field label="Company size">
                <TextInput defaultValue="11-50" placeholder="1-10, 11-50, 51-200" />
              </Field>
            </div>
            <Field label="Logo" hint="PNG, JPG, or SVG">
              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-[oklch(1_0_0_/_0.18)] bg-[oklch(1_0_0_/_0.03)] px-4 py-5 transition-colors hover:border-[var(--color-ember)]">
                <span className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Upload className="size-4" /> Upload company logo
                </span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </Field>

            <ActionButton type="submit" className="w-full">
              Continue to plans <ArrowRight className="size-4" />
            </ActionButton>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
