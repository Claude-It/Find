import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, CalendarDays, ExternalLink, Trophy } from "lucide-react";
import { FyndLogo } from "@/components/liquid/FyndLogo";
import { Panel, Pill, StatCard } from "@/components/app/shared";
import { currentUser, earnerStats, featuredSubmissions, monthsSince } from "@/lib/mock-data";

export const Route = createFileRoute("/portfolio/$username")({
  component: PublicPortfolio,
});

function PublicPortfolio() {
  const { username } = Route.useParams();
  const months = monthsSince(currentUser.memberSince);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-5 py-8 text-foreground md:py-12">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-[8%] top-[8%] h-[40vw] max-h-[520px] w-[40vw] max-w-[520px] rounded-full blob-b"
          style={{ background: "var(--gradient-mint)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-[8%] right-[8%] h-[36vw] max-h-[480px] w-[36vw] max-w-[480px] rounded-full blob-c"
          style={{ background: "var(--gradient-violet)", filter: "blur(85px)" }}
        />
      </div>

      <header className="mx-auto flex max-w-6xl items-center justify-between">
        <Link to="/">
          <FyndLogo size={28} />
        </Link>
        <Link
          to="/auth"
          className="rounded-full border border-[oklch(1_0_0_/_0.14)] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
        >
          Join Fynd
        </Link>
      </header>

      <main className="mx-auto mt-12 max-w-6xl">
        <Panel className="overflow-hidden">
          <div
            className="h-44 w-full"
            style={{
              background:
                "linear-gradient(120deg, color-mix(in oklch, var(--color-mint) 26%, transparent), color-mix(in oklch, var(--color-ember) 24%, transparent), color-mix(in oklch, var(--color-violet) 24%, transparent))",
            }}
          />
          <div className="px-6 pb-8 md:px-9">
            <div className="-mt-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex items-end gap-5">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.fullName}
                  className="size-32 rounded-3xl border-2 border-[var(--card)] object-cover"
                />
                <div className="pb-2">
                  <Pill accent="mint">
                    <BadgeCheck className="size-3.5" /> Fynd verified
                  </Pill>
                  <h1 className="mt-3 text-display text-5xl md:text-7xl">
                    {username === currentUser.username ? currentUser.fullName : username}
                  </h1>
                  <div className="mt-2 text-muted-foreground">
                    @{username} · Quick Gigs portfolio
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.values(currentUser.socials).map((social) => (
                  <Pill key={social}>{social}</Pill>
                ))}
              </div>
            </div>

            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              {currentUser.bio}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {currentUser.skills.map((skill) => (
                <Pill key={skill} accent="mint">
                  {skill}
                </Pill>
              ))}
            </div>
          </div>
        </Panel>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <StatCard label="Bounties applied" value={earnerStats.applied} accent="mint" />
          <StatCard label="Bounties won" value={earnerStats.won} accent="ember" />
          <StatCard label="Win rate" value={`${earnerStats.winRate}%`} accent="violet" />
          <StatCard
            label="Total earned"
            value={`$${(earnerStats.totalEarned / 1000).toFixed(1)}k`}
            accent="mint"
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
          <Panel className="p-6 md:p-7">
            <h2 className="text-display text-3xl">Featured work</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {featuredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="overflow-hidden rounded-2xl border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.025)]"
                >
                  <img
                    src={submission.media}
                    alt={submission.title}
                    className="h-52 w-full object-cover"
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

          <Panel className="p-6">
            <h2 className="text-display text-3xl">Record</h2>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.025)] p-4">
              <CalendarDays className="size-5 text-[var(--color-mint)]" />
              <div>
                <div className="text-sm font-semibold">Member for {months} months</div>
                <div className="text-xs text-muted-foreground">Joined Sep 2025</div>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {earnerStats.wonBounties.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.025)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.org} · {item.date}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[var(--color-mint)]">
                      {item.reward.toLocaleString()} USDC
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="https://explorer.solana.com/?cluster=devnet"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-foreground hover:text-[var(--color-mint)]"
            >
              Verify chain-backed wins <ExternalLink className="size-3.5" />
            </a>
          </Panel>
        </div>
      </main>
    </div>
  );
}
