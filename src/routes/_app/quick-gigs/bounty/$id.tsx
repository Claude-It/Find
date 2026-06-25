import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Check, ExternalLink, FileUp, Send, UsersRound } from "lucide-react";
import {
  ActionButton,
  EscrowBadge,
  Field,
  OrgAvatar,
  Panel,
  Pill,
  TextArea,
  TextInput,
} from "@/components/app/shared";
import { bounties, submissions } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/quick-gigs/bounty/$id")({
  loader: ({ params }) => {
    const bounty = bounties.find((item) => item.id === params.id);
    if (!bounty) throw notFound();
    return { bounty };
  },
  component: BountyDetail,
});

function BountyDetail() {
  const { bounty } = Route.useLoaderData();
  const [submitOpen, setSubmitOpen] = useState(false);
  const visibleSubmissions = submissions.filter((submission) => submission.bountyId === bounty.id);

  return (
    <div>
      <Link
        to="/quick-gigs/earner/feed"
        className="mb-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to bounties
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Panel className="p-7 md:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <OrgAvatar src={bounty.orgLogo} name={bounty.org} size={56} />
              <div>
                <div className="font-semibold">{bounty.org}</div>
                <div className="text-sm text-muted-foreground">{bounty.category} bounty</div>
              </div>
            </div>
            <EscrowBadge funded={bounty.escrowFunded} />
          </div>

          <h1 className="mt-8 text-display text-5xl leading-[0.95] md:text-6xl">{bounty.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            {bounty.description}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Metric label="Reward" value={`${bounty.reward.toLocaleString()} USDC`} accent="mint" />
            <Metric label="Deadline" value={bounty.deadline} accent="ember" />
            <Metric
              label="Submissions"
              value={`${bounty.submissions}/${bounty.maxSubmissions}`}
              accent="violet"
            />
          </div>

          <div className="mt-8">
            <h2 className="text-display text-2xl">Requirements</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {bounty.requirements.map((requirement) => (
                <div
                  key={requirement}
                  className="flex items-start gap-3 rounded-2xl border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.025)] p-4 text-sm text-muted-foreground"
                >
                  <Check className="mt-0.5 size-4 shrink-0 text-[var(--color-mint)]" />
                  {requirement}
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <aside className="space-y-6">
          <Panel className="p-6">
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Submission window
            </div>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-display text-5xl text-[var(--color-mint)]">
                {bounty.daysLeft}
              </span>
              <span className="pb-2 text-sm text-muted-foreground">days left</span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-[oklch(1_0_0_/_0.08)]">
              <div
                className="h-full rounded-full bg-[var(--color-mint)]"
                style={{
                  width: `${Math.min(100, (bounty.submissions / bounty.maxSubmissions) * 100)}%`,
                }}
              />
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              {bounty.maxSubmissions - bounty.submissions} spots left before the cap closes.
            </div>
            <ActionButton className="mt-6 w-full" onClick={() => setSubmitOpen(true)}>
              Submit work <Send className="size-4" />
            </ActionButton>
          </Panel>

          <Panel className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-display text-2xl">Chain record</h2>
              <Pill accent={bounty.escrowFunded ? "mint" : undefined}>
                {bounty.escrowFunded ? "Verified" : "Pending"}
              </Pill>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Escrow status is shown from Firestore after backend chain confirmation. Smart contract
              calls stay server-side.
            </p>
            <a
              href="https://explorer.solana.com/?cluster=devnet"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-foreground hover:text-[var(--color-mint)]"
            >
              Solana devnet <ExternalLink className="size-3.5" />
            </a>
          </Panel>
        </aside>
      </div>

      <Panel className="mt-6 p-6 md:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-display text-2xl">Public submissions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Visible when the bounty is configured as public.
            </p>
          </div>
          <Pill>{visibleSubmissions.length} shown</Pill>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {visibleSubmissions.length > 0 ? (
            visibleSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="rounded-2xl border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.025)] p-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={submission.avatar}
                    alt={submission.earner}
                    className="size-10 rounded-xl object-cover"
                  />
                  <div>
                    <div className="text-sm font-semibold">{submission.earner}</div>
                    <div className="text-xs text-muted-foreground">{submission.submittedAt}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {submission.note}
                </p>
                <div className="mt-4 space-y-1">
                  {submission.links.map((link) => (
                    <div key={link} className="truncate text-xs text-foreground/90">
                      {link}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex items-center gap-3 rounded-2xl border border-dashed border-[oklch(1_0_0_/_0.14)] p-6 text-sm text-muted-foreground">
              <UsersRound className="size-5" /> No public submissions yet.
            </div>
          )}
        </div>
      </Panel>

      <AnimatePresence>
        {submitOpen && (
          <SubmissionModal onClose={() => setSubmitOpen(false)} title={bounty.title} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "mint" | "ember" | "violet";
}) {
  return (
    <div className="rounded-2xl border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.025)] p-4">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-2 text-xl font-semibold" style={{ color: `var(--color-${accent})` }}>
        {value}
      </div>
    </div>
  );
}

function SubmissionModal({ onClose, title }: { onClose: () => void; title: string }) {
  const [sent, setSent] = useState(false);

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
        className="relative z-10 w-full max-w-lg glass-panel rounded-[2rem] p-7"
      >
        {sent ? (
          <div className="text-center">
            <span className="mx-auto inline-flex size-16 items-center justify-center rounded-2xl bg-[color-mix(in_oklch,var(--color-mint)_18%,transparent)] text-[var(--color-mint)]">
              <Check className="size-8" />
            </span>
            <h2 className="mt-5 text-display text-3xl">Submission received.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your work is in review. Realtime updates will arrive through the notification bell.
            </p>
            <ActionButton className="mt-7 w-full" onClick={onClose}>
              Done
            </ActionButton>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              Submit work
            </div>
            <h2 className="mt-3 text-display text-3xl">{title}</h2>
            <div className="mt-6 space-y-5">
              <Field label="Submission note">
                <TextArea
                  rows={4}
                  placeholder="Describe what you built, shipped, or designed."
                  required
                />
              </Field>
              <Field label="Links">
                <TextInput placeholder="GitHub, Figma, live demo, video..." required />
              </Field>
              <Field label="File upload" hint="Optional supporting asset">
                <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-[oklch(1_0_0_/_0.18)] bg-[oklch(1_0_0_/_0.03)] px-4 py-5 transition-colors hover:border-[var(--color-mint)]">
                  <span className="flex items-center gap-3 text-sm text-muted-foreground">
                    <FileUp className="size-4" /> Attach file
                  </span>
                  <input type="file" className="hidden" />
                </label>
              </Field>
            </div>
            <div className="mt-7 flex justify-end gap-2">
              <ActionButton variant="ghost" onClick={onClose}>
                Cancel
              </ActionButton>
              <ActionButton type="submit">
                <Send className="size-4" /> Send submission
              </ActionButton>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
