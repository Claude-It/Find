import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  CalendarClock,
  Check,
  CircleDollarSign,
  FileText,
  ShieldCheck,
} from "lucide-react";
import {
  ActionButton,
  Field,
  PageHeading,
  Panel,
  Pill,
  TextArea,
  TextInput,
} from "@/components/app/shared";
import { GIG_CATEGORIES, type GigCategory } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/quick-gigs/business/post-bounty")({
  component: PostBounty,
});

type Step = "details" | "fund" | "done";

function PostBounty() {
  const [step, setStep] = useState<Step>("details");
  const [category, setCategory] = useState<GigCategory>("Development");
  const [reward, setReward] = useState(2500);
  const [maxSubmissions, setMaxSubmissions] = useState(35);
  const cappedSubmissions = useMemo(
    () => Math.min(35, Math.max(1, maxSubmissions)),
    [maxSubmissions],
  );

  return (
    <div>
      <PageHeading
        eyebrow="Quick Gigs · Post bounty"
        title={
          <>
            Create and <em className="italic text-[var(--color-mint)]">fund</em> a bounty.
          </>
        }
        sub="Capture the requirements first, then move to escrow funding. The UI reflects Paystack verification and backend-populated chain status."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <Panel className="p-6 md:p-8">
          <StepHeader step={step} />
          {step === "details" && (
            <form
              className="mt-7 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                setStep("fund");
              }}
            >
              <Field label="Bounty title">
                <TextInput defaultValue="Build a Solana Pay checkout widget" required />
              </Field>
              <Field label="Description">
                <TextArea
                  rows={5}
                  defaultValue="Ship an embeddable checkout widget with USDC support, mobile QR fallback, and a polished success state."
                />
              </Field>
              <Field label="Skill category">
                <div className="flex flex-wrap gap-2">
                  {GIG_CATEGORIES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em] transition-all cursor-pointer",
                        category === item
                          ? "border-[var(--color-mint)] bg-[color-mix(in_oklch,var(--color-mint)_12%,transparent)] text-foreground"
                          : "border-[oklch(1_0_0_/_0.1)] text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </Field>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Reward amount">
                  <TextInput
                    type="number"
                    min={1}
                    value={reward}
                    onChange={(e) => setReward(Number(e.target.value))}
                  />
                </Field>
                <Field label="Deadline">
                  <TextInput type="date" defaultValue="2026-07-10" />
                </Field>
                <Field label="Max submissions" hint="Cannot exceed 35">
                  <TextInput
                    type="number"
                    min={1}
                    max={35}
                    value={maxSubmissions}
                    onChange={(e) => setMaxSubmissions(Number(e.target.value))}
                  />
                </Field>
              </div>
              <Field label="Submission requirements">
                <TextArea
                  rows={4}
                  defaultValue={
                    "Working demo deployed\nSource on GitHub\nUSDC + SOL support\nMobile QR fallback"
                  }
                />
              </Field>
              <div className="flex justify-end">
                <ActionButton type="submit">
                  Continue to escrow <ArrowRight className="size-4" />
                </ActionButton>
              </div>
            </form>
          )}

          {step === "fund" && (
            <FundEscrow
              reward={reward}
              maxSubmissions={cappedSubmissions}
              category={category}
              onBack={() => setStep("details")}
              onFunded={() => setStep("done")}
            />
          )}

          {step === "done" && <EscrowFunded />}
        </Panel>

        <aside className="space-y-6">
          <Panel className="p-6">
            <h2 className="text-display text-2xl">Preview</h2>
            <div className="mt-4 rounded-2xl border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.025)] p-4">
              <Pill accent="mint">{category}</Pill>
              <h3 className="mt-4 text-display text-2xl">Solana Pay checkout widget</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Reward locked before submissions open.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Pill accent="mint">{reward.toLocaleString()} USDC</Pill>
                <Pill>{cappedSubmissions} max</Pill>
              </div>
            </div>
          </Panel>

          <Panel className="p-6">
            <h2 className="text-display text-2xl">Funding scope</h2>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <CircleDollarSign className="size-4 text-[var(--color-mint)]" /> Paystack inline
                checkout
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="size-4 text-[var(--color-ember)]" /> Backend verifies
                reference
              </li>
              <li className="flex items-center gap-3">
                <CalendarClock className="size-4 text-[var(--color-violet)]" /> Escrow status
                appears after chain sync
              </li>
            </ul>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function StepHeader({ step }: { step: Step }) {
  const items: Array<{ id: Step; label: string }> = [
    { id: "details", label: "Details" },
    { id: "fund", label: "Fund escrow" },
    { id: "done", label: "Active" },
  ];
  const index = items.findIndex((item) => item.id === step);

  return (
    <div>
      <div className="flex items-center gap-2">
        {items.map((item, itemIndex) => (
          <div key={item.id} className="flex flex-1 items-center gap-2">
            <span
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
              style={{
                background: itemIndex <= index ? "var(--color-mint)" : "oklch(1 0 0 / 0.07)",
                color: itemIndex <= index ? "var(--primary-foreground)" : "var(--muted-foreground)",
              }}
            >
              {itemIndex + 1}
            </span>
            <span className="hidden text-[11px] uppercase tracking-[0.16em] text-muted-foreground sm:inline">
              {item.label}
            </span>
            {itemIndex < items.length - 1 && <span className="h-px flex-1 bg-border/60" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function FundEscrow({
  reward,
  maxSubmissions,
  category,
  onBack,
  onFunded,
}: {
  reward: number;
  maxSubmissions: number;
  category: GigCategory;
  onBack: () => void;
  onFunded: () => void;
}) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="mt-7">
      <div className="grid gap-4 md:grid-cols-3">
        <Summary label="Reward" value={`${reward.toLocaleString()} USDC`} />
        <Summary label="Category" value={category} />
        <Summary label="Submission cap" value={`${maxSubmissions}`} />
      </div>

      <Panel className="mt-6 p-5">
        <div className="flex items-start gap-3">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_oklch,var(--color-mint)_16%,transparent)] text-[var(--color-mint)]">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <h2 className="font-semibold">Escrow deposit required</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Paystack receives the funding deposit. Backend verification then records the escrow
              status and activates the bounty.
            </p>
          </div>
        </div>
      </Panel>

      <div className="mt-7 flex justify-end gap-2">
        <ActionButton variant="ghost" onClick={onBack}>
          Back
        </ActionButton>
        <ActionButton onClick={() => setCheckoutOpen(true)}>
          Fund escrow <CircleDollarSign className="size-4" />
        </ActionButton>
      </div>

      <AnimatePresence>
        {checkoutOpen && (
          <PaystackEscrowModal
            reward={reward}
            onClose={() => setCheckoutOpen(false)}
            onPaid={onFunded}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.025)] p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-2 text-lg font-semibold">{value}</div>
    </div>
  );
}

function PaystackEscrowModal({
  reward,
  onClose,
  onPaid,
}: {
  reward: number;
  onClose: () => void;
  onPaid: () => void;
}) {
  const [verifying, setVerifying] = useState(false);

  function complete() {
    setVerifying(true);
    window.setTimeout(onPaid, 900);
  }

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
        className="relative z-10 w-full max-w-sm glass-panel rounded-[2rem] p-7 text-center"
      >
        <CircleDollarSign className="mx-auto size-9 text-[var(--color-mint)]" />
        <h2 className="mt-5 text-display text-3xl">Fund escrow</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Deposit {reward.toLocaleString()} USDC equivalent through Paystack sandbox.
        </p>
        <div className="mt-6 rounded-2xl border border-[oklch(1_0_0_/_0.1)] bg-[oklch(1_0_0_/_0.03)] p-5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Total deposit</span>
            <span className="text-display text-4xl text-[var(--color-mint)]">
              ${reward.toLocaleString()}
            </span>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            Reference: ps_test_hif5_bounty_escrow
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <ActionButton className="w-full" onClick={complete} disabled={verifying}>
            {verifying ? "Verifying..." : "Complete payment"}
          </ActionButton>
          <button
            onClick={onClose}
            className="w-full text-xs text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function EscrowFunded() {
  const navigate = useNavigate();
  return (
    <div className="mt-8 text-center">
      <span className="mx-auto inline-flex size-18 items-center justify-center rounded-3xl bg-[color-mix(in_oklch,var(--color-mint)_18%,transparent)] text-[var(--color-mint)]">
        <Check className="size-9" />
      </span>
      <h2 className="mt-6 text-display text-4xl">Escrow funded.</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        Backend verification confirmed the payment reference. The bounty is now active and will show
        funded escrow once the chain listener writes the status.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ActionButton onClick={() => navigate({ to: "/quick-gigs/business/dashboard" })}>
          Open dashboard <ArrowRight className="size-4" />
        </ActionButton>
        <ActionButton variant="ghost" onClick={() => window.location.reload()}>
          <FileText className="size-4" /> Create another
        </ActionButton>
      </div>
    </div>
  );
}
