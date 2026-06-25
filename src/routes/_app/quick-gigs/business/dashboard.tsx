import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  CircleDollarSign,
  Crown,
  Plus,
  ShieldCheck,
  Trophy,
} from "lucide-react";
import {
  ActionButton,
  EscrowBadge,
  OrgAvatar,
  PageHeading,
  Panel,
  Pill,
  StatCard,
} from "@/components/app/shared";
import { businessBounties, businessProfile, submissions } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/quick-gigs/business/dashboard")({
  component: BusinessDashboard,
});

function BusinessDashboard() {
  const [selectedWinner, setSelectedWinner] = useState<string | null>("s1");
  const totalBudget = businessBounties.reduce((sum, bounty) => sum + bounty.reward, 0);
  const active = businessBounties.filter((bounty) => bounty.status === "Active").length;
  const winnerChosen = businessBounties.filter(
    (bounty) => bounty.status === "Winner chosen",
  ).length;

  return (
    <div>
      <PageHeading
        eyebrow="Quick Gigs · Business"
        title={
          <>
            Bounty <em className="italic text-[var(--color-mint)]">ops</em>.
          </>
        }
        sub="Post bounties, inspect submissions, choose winners, and hand release actions to the backend payment rail."
        action={
          <Link to="/quick-gigs/business/post-bounty">
            <ActionButton>
              <Plus className="size-4" /> Post bounty
            </ActionButton>
          </Link>
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        <StatCard label="Bounties" value={businessBounties.length} accent="mint" />
        <StatCard label="Active" value={active} accent="ember" />
        <StatCard label="Winner chosen" value={winnerChosen} accent="violet" />
        <StatCard
          label="Budget locked"
          value={`$${(totalBudget / 1000).toFixed(1)}k`}
          accent="mint"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <Panel className="p-6 md:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-display text-2xl">Posted bounties</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Review status, submissions, and release-readiness.
              </p>
            </div>
            <Pill accent="mint">Realtime counts</Pill>
          </div>

          <div className="mt-5 space-y-4">
            {businessBounties.map((bounty) => (
              <div
                key={bounty.id}
                className="rounded-2xl border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.025)] p-4"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <OrgAvatar src={bounty.orgLogo} name={bounty.org} size={46} />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{bounty.title}</h3>
                        <Pill accent={bounty.status === "Active" ? "mint" : "ember"}>
                          {bounty.status}
                        </Pill>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {bounty.reward.toLocaleString()} USDC · {bounty.submissions}/
                        {bounty.maxSubmissions} submissions · due {bounty.deadline}
                      </div>
                    </div>
                  </div>
                  <EscrowBadge funded={bounty.escrowFunded} />
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {submissions
                    .filter((submission) => submission.bountyId === bounty.id)
                    .map((submission) => (
                      <button
                        key={submission.id}
                        onClick={() => setSelectedWinner(submission.id)}
                        className="rounded-2xl border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.02)] p-4 text-left transition-colors hover:border-[var(--color-mint)] cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={submission.avatar}
                              alt={submission.earner}
                              className="size-10 rounded-xl object-cover"
                            />
                            <div>
                              <div className="text-sm font-medium">{submission.earner}</div>
                              <div className="text-xs text-muted-foreground">
                                {submission.submittedAt}
                              </div>
                            </div>
                          </div>
                          {selectedWinner === submission.id && (
                            <span className="inline-flex size-7 items-center justify-center rounded-full bg-[var(--color-mint)] text-[var(--primary-foreground)]">
                              <Check className="size-4" />
                            </span>
                          )}
                        </div>
                        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                          {submission.note}
                        </p>
                      </button>
                    ))}
                </div>

                {bounty.status === "Winner chosen" && (
                  <div className="mt-4 rounded-2xl border border-[color-mix(in_oklch,var(--color-mint)_35%,transparent)] bg-[color-mix(in_oklch,var(--color-mint)_8%,transparent)] p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-mint)]">
                          <Trophy className="size-4" /> Winner selected
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Wallet: {bounty.winnerWallet}
                        </div>
                      </div>
                      <ActionButton className="md:shrink-0">
                        Release funds <CircleDollarSign className="size-4" />
                      </ActionButton>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Panel>

        <aside className="space-y-6">
          <Panel className="p-6">
            <div className="flex items-center gap-3">
              <OrgAvatar src={businessProfile.logo} name={businessProfile.name} size={48} />
              <div>
                <div className="font-semibold">{businessProfile.name}</div>
                <div className="text-xs text-muted-foreground">{businessProfile.website}</div>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-[color-mix(in_oklch,var(--color-mint)_35%,transparent)] bg-[color-mix(in_oklch,var(--color-mint)_8%,transparent)] p-4 text-sm font-semibold text-[var(--color-mint)]">
              <BadgeCheck className="size-4" /> Business verified
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              Payout authority: {businessProfile.wallet}
            </div>
          </Panel>

          <Panel className="p-6">
            <h2 className="text-display text-2xl">Release flow</h2>
            <div className="mt-4 space-y-3">
              {["Winner selected", "Backend verifies escrow", "Funds released on-chain"].map(
                (step, index) => (
                  <div key={step} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span
                      className="inline-flex size-7 items-center justify-center rounded-full text-xs font-semibold"
                      style={{
                        background: index === 0 ? "var(--color-mint)" : "oklch(1 0 0 / 0.07)",
                        color:
                          index === 0 ? "var(--primary-foreground)" : "var(--muted-foreground)",
                      }}
                    >
                      {index + 1}
                    </span>
                    {step}
                  </div>
                ),
              )}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              The button renders the operational action and winner wallet. Backend handles the smart
              contract call, USDC SPL movement, and audit trail.
            </p>
          </Panel>

          <Link
            to="/quick-gigs/business/post-bounty"
            className="group flex items-center justify-between rounded-3xl border border-[oklch(1_0_0_/_0.1)] bg-[oklch(1_0_0_/_0.03)] p-5 transition-colors hover:border-[var(--color-mint)]"
          >
            <span className="flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-[color-mix(in_oklch,var(--color-mint)_16%,transparent)] text-[var(--color-mint)]">
                <ShieldCheck className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-semibold">Fund a new bounty</span>
                <span className="block text-xs text-muted-foreground">
                  Escrow through Paystack state
                </span>
              </span>
            </span>
            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
