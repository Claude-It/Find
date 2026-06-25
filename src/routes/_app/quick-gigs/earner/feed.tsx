import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, CalendarClock, Search, Trophy, Users } from "lucide-react";
import {
  ActionButton,
  EscrowBadge,
  OrgAvatar,
  PageHeading,
  Panel,
  Pill,
  StatCard,
  TextInput,
} from "@/components/app/shared";
import { bounties, GIG_CATEGORIES, type GigCategory } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/quick-gigs/earner/feed")({
  component: EarnerFeed,
});

type CategoryFilter = GigCategory | "All";

function EarnerFeed() {
  const [category, setCategory] = useState<CategoryFilter>("Development");
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      bounties.filter((bounty) => {
        const matchesCategory = category === "All" || bounty.category === category;
        const matchesQuery =
          query.trim().length === 0 ||
          `${bounty.title} ${bounty.org} ${bounty.description}`
            .toLowerCase()
            .includes(query.toLowerCase());
        return matchesCategory && matchesQuery;
      }),
    [category, query],
  );

  return (
    <div>
      <PageHeading
        eyebrow="Quick Gigs · Earner"
        title={
          <>
            Paid bounties, <em className="italic text-[var(--color-mint)]">funded</em> first.
          </>
        }
        sub="Defaulted to your skill categories. Every card shows reward, deadline, cap, company, and escrow status before you decide to submit."
        action={
          <ActionButton
            variant="outline"
            className="border-[color-mix(in_oklch,var(--color-mint)_35%,transparent)]"
          >
            <Trophy className="size-4" /> Portfolio ready
          </ActionButton>
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Open rewards" value="$13k" accent="mint" hint="Across matching bounties" />
        <StatCard
          label="Funded escrow"
          value="5/6"
          accent="ember"
          hint="Backend-synced chain status"
        />
        <StatCard label="Submission caps" value="35" accent="violet" hint="Maximum per bounty" />
      </div>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {[...GIG_CATEGORIES, "All" as const].map((item) => (
            <button
              key={item}
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
        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bounties"
            className="pl-10"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {filtered.map((bounty) => (
          <Link
            key={bounty.id}
            to="/quick-gigs/bounty/$id"
            params={{ id: bounty.id }}
            className="radial-card group flex min-h-[330px] flex-col rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <OrgAvatar src={bounty.orgLogo} name={bounty.org} size={48} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{bounty.org}</div>
                  <div className="text-xs text-muted-foreground">{bounty.category}</div>
                </div>
              </div>
              <EscrowBadge funded={bounty.escrowFunded} />
            </div>

            <h2 className="mt-6 text-display text-3xl leading-tight">{bounty.title}</h2>
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {bounty.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Pill accent="mint">{bounty.reward.toLocaleString()} USDC</Pill>
              <Pill>
                {bounty.submissions}/{bounty.maxSubmissions} submissions
              </Pill>
              <Pill>{bounty.daysLeft} days left</Pill>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-5">
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarClock className="size-4" /> Due {bounty.deadline}
              </span>
              <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-foreground">
                View bounty{" "}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <Panel className="mt-8 flex flex-col items-center justify-center p-10 text-center">
          <Users className="size-9 text-muted-foreground" />
          <h2 className="mt-4 text-display text-3xl">No bounties in this view.</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Try a different category or clear your search.
          </p>
        </Panel>
      )}
    </div>
  );
}
