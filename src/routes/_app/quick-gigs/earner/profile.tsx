import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  Copy,
  ExternalLink,
  Link as LinkIcon,
  Share2,
  Trophy,
} from "lucide-react";
import { ActionButton, PageHeading, Panel, Pill, StatCard } from "@/components/app/shared";
import { currentUser, earnerStats, featuredSubmissions, monthsSince } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/quick-gigs/earner/profile")({
  component: EarnerProfile,
});

function EarnerProfile() {
  const [exported, setExported] = useState(false);
  const months = monthsSince(currentUser.memberSince);
  const portfolioUrl = `find.xyz/portfolio/${currentUser.username}`;

  return (
    <div>
      <PageHeading
        eyebrow="Quick Gigs · Earner"
        title={
          <>
            Proof of <em className="italic text-[var(--color-mint)]">work</em>.
          </>
        }
        sub="Your bounty record, wins, earnings, socials, and featured submissions become a public portfolio when exported."
        action={
          <ActionButton onClick={() => setExported(true)}>
            <Share2 className="size-4" /> Export portfolio
          </ActionButton>
        }
      />

      <Panel className="mt-8 overflow-hidden">
        <div
          className="h-28 w-full"
          style={{
            background:
              "linear-gradient(120deg, color-mix(in oklch, var(--color-mint) 26%, transparent), color-mix(in oklch, var(--color-violet) 26%, transparent))",
          }}
        />
        <div className="px-6 pb-7 md:px-8">
          <div className="-mt-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.fullName}
                className="size-24 rounded-2xl border-2 border-[var(--card)] object-cover"
              />
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-display text-3xl md:text-4xl">{currentUser.fullName}</h1>
                  <Pill accent="mint">
                    <BadgeCheck className="size-3.5" /> Verified earner
                  </Pill>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  @{currentUser.username} · Member for {months} months
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.values(currentUser.socials).map((item) => (
                <Pill key={item}>{item}</Pill>
              ))}
            </div>
          </div>
          <p className="mt-6 max-w-2xl text-muted-foreground">{currentUser.bio}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {currentUser.skills.map((skill) => (
              <Pill key={skill} accent="mint">
                {skill}
              </Pill>
            ))}
          </div>
        </div>
      </Panel>

      {exported && (
        <Panel className="mt-6 flex flex-col gap-4 border-[color-mix(in_oklch,var(--color-mint)_40%,transparent)] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-semibold text-[var(--color-mint)]">Portfolio link generated</div>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <LinkIcon className="size-4" /> {portfolioUrl}
            </div>
          </div>
          <div className="flex gap-2">
            <ActionButton variant="ghost">
              <Copy className="size-4" /> Copy
            </ActionButton>
            <Link to="/portfolio/$username" params={{ username: currentUser.username }}>
              <ActionButton>
                Open <ExternalLink className="size-4" />
              </ActionButton>
            </Link>
          </div>
        </Panel>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <StatCard label="Applied" value={earnerStats.applied} accent="mint" />
        <StatCard label="Won" value={earnerStats.won} accent="ember" />
        <StatCard label="Win rate" value={`${earnerStats.winRate}%`} accent="violet" />
        <StatCard
          label="Earned"
          value={`$${(earnerStats.totalEarned / 1000).toFixed(1)}k`}
          accent="mint"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <Panel className="p-6 md:p-7">
          <h2 className="text-display text-2xl">Bounty history</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <HistoryList title="Applied" items={earnerStats.appliedBounties} />
            <HistoryList title="Won" items={earnerStats.wonBounties} winner />
          </div>
        </Panel>

        <Panel className="p-6">
          <h2 className="text-display text-2xl">Membership</h2>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.025)] p-4">
            <CalendarDays className="size-5 text-[var(--color-mint)]" />
            <div>
              <div className="text-sm font-semibold">Joined Sep 2025</div>
              <div className="text-xs text-muted-foreground">Member for {months} months</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Exported portfolios include membership duration, bounty links, win badges, earnings,
            social links, and selected submissions.
          </p>
        </Panel>
      </div>

      <Panel className="mt-6 p-6 md:p-7">
        <h2 className="text-display text-2xl">Featured submissions</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {featuredSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="overflow-hidden rounded-2xl border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.025)]"
            >
              <img
                src={submission.media}
                alt={submission.title}
                className="h-44 w-full object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{submission.title}</div>
                    <div className="text-xs text-muted-foreground">{submission.org}</div>
                  </div>
                  <Pill accent={submission.result === "Winner" ? "mint" : undefined}>
                    {submission.result === "Winner" && <Trophy className="size-3.5" />}
                    {submission.result}
                  </Pill>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function HistoryList({
  title,
  items,
  winner,
}: {
  title: string;
  items: Array<{ title: string; org: string; reward: number; status?: string; date?: string }>;
  winner?: boolean;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{title}</div>
      <div className="mt-3 space-y-3">
        {items.map((item) => (
          <div
            key={`${item.org}-${item.title}`}
            className="rounded-2xl border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.025)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium">{item.title}</div>
                <div className="text-xs text-muted-foreground">
                  {item.org} · {item.date ?? item.status}
                </div>
              </div>
              <Pill accent={winner ? "mint" : undefined}>{item.reward.toLocaleString()} USDC</Pill>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
