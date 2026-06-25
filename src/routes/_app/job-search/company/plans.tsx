import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, CreditCard, Sparkles } from "lucide-react";
import { ActionButton, PageHeading, Panel, Pill } from "@/components/app/shared";
import { companyProfile, plans, type Plan } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/job-search/company/plans")({
  component: CompanyPlans,
});

function CompanyPlans() {
  const [selected, setSelected] = useState<Plan | null>(null);

  return (
    <div>
      <PageHeading
        eyebrow="Company setup · Plans"
        title={
          <>
            Choose a <em className="italic text-[var(--color-ember)]">hiring</em> lane.
          </>
        }
        sub="Paystack is wired as a frontend checkout state for the demo. Backend verification will activate the plan after payment."
      />

      <div className="mt-10 grid gap-5 lg:grid-cols-4">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelected(plan)}
            className={cn(
              "radial-card group flex min-h-[390px] flex-col rounded-3xl p-6 text-left transition-all duration-300 hover:-translate-y-1 cursor-pointer",
              plan.highlight && "shadow-[var(--shadow-glow)]",
            )}
            style={
              plan.highlight
                ? ({ borderColor: "var(--color-ember)" } as React.CSSProperties)
                : undefined
            }
          >
            <div className="flex items-center justify-between gap-3">
              <Pill accent={plan.highlight ? "ember" : undefined}>{plan.posts}</Pill>
              {plan.highlight && <Sparkles className="size-4 text-[var(--color-ember)]" />}
            </div>
            <h2 className="mt-6 text-display text-3xl">{plan.name}</h2>
            <div className="mt-3 flex items-end gap-1">
              <span className="text-display text-5xl text-[var(--color-ember)]">{plan.price}</span>
              <span className="pb-2 text-sm text-muted-foreground">{plan.cadence}</span>
            </div>
            <ul className="mt-6 space-y-3 border-t border-border/40 pt-5">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-[var(--color-mint)]" />
                  {feature}
                </li>
              ))}
            </ul>
            <span className="mt-auto inline-flex items-center gap-2 pt-7 text-[11px] uppercase tracking-[0.2em] text-foreground">
              Select plan{" "}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        ))}
      </div>

      <Panel className="mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-semibold">{companyProfile.name}</div>
          <div className="text-xs text-muted-foreground">
            {companyProfile.email} · {companyProfile.industry} · {companyProfile.size}
          </div>
        </div>
        <Pill accent="mint">Profile saved</Pill>
      </Panel>

      <AnimatePresence>
        {selected && <PaystackPlanModal plan={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

function PaystackPlanModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const [paid, setPaid] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-5"
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md glass-panel rounded-[2rem] p-7"
      >
        {paid ? (
          <div className="text-center">
            <span className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl bg-[color-mix(in_oklch,var(--color-mint)_18%,transparent)] text-[var(--color-mint)]">
              <Check className="size-7" />
            </span>
            <h2 className="mt-5 text-display text-3xl">Plan activated.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Backend verification confirmed the payment reference and unlocked the company
              dashboard.
            </p>
            <ActionButton
              className="mt-7 w-full"
              onClick={() => navigate({ to: "/job-search/company/dashboard" })}
            >
              Open dashboard <ArrowRight className="size-4" />
            </ActionButton>
          </div>
        ) : (
          <>
            <CreditCard className="size-8 text-[var(--color-ember)]" />
            <h2 className="mt-5 text-display text-3xl">Pay with Paystack</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Activate {plan.name} for {companyProfile.name}. This is the sandbox checkout state.
            </p>
            <div className="mt-6 rounded-2xl border border-[oklch(1_0_0_/_0.1)] bg-[oklch(1_0_0_/_0.03)] p-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">{plan.posts}</span>
                <span className="text-display text-4xl text-[var(--color-ember)]">
                  {plan.price}
                </span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Reference: ps_test_hif5_company_plan
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <ActionButton variant="ghost" className="flex-1" onClick={onClose}>
                Cancel
              </ActionButton>
              <ActionButton className="flex-1" onClick={() => setPaid(true)}>
                Complete payment
              </ActionButton>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
