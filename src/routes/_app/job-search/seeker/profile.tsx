import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheck, FileText, Pencil } from "lucide-react";
import { ActionButton, OrgAvatar, Panel, Pill, StatCard } from "@/components/app/shared";
import { applications, currentUser, helpers } from "@/lib/mock-data";

export const Route = createFileRoute("/_app/job-search/seeker/profile")({
  component: SeekerProfile,
});

function SeekerProfile() {
  return (
    <div>
      {/* header card */}
      <Panel className="overflow-hidden">
        <div className="h-28 w-full" style={{ background: "linear-gradient(120deg, color-mix(in oklch, var(--color-ember) 30%, transparent), color-mix(in oklch, var(--color-violet) 28%, transparent))" }} />
        <div className="px-6 pb-6 md:px-8 md:pb-8">
          <div className="-mt-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-4">
              <img src={currentUser.avatar} alt={currentUser.fullName} className="size-24 rounded-2xl border-2 border-[var(--card)] object-cover" />
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-display text-3xl md:text-4xl">{currentUser.fullName}</h1>
                  {currentUser.vetted && (
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ background: "color-mix(in oklch, var(--color-mint) 16%, transparent)", color: "var(--color-mint)" }}>
                      <BadgeCheck className="size-3.5" /> Vetted {currentUser.vettedScore}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">@{currentUser.username} · {currentUser.country}</div>
              </div>
            </div>
            <ActionButton variant="outline"><Pencil className="size-4" /> Edit profile</ActionButton>
          </div>

          <p className="mt-6 max-w-2xl text-muted-foreground">{currentUser.bio}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {currentUser.skills.map((s) => <Pill key={s} accent="ember">{s}</Pill>)}
          </div>
        </div>
      </Panel>

      {/* stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Applications" value={applications.length} accent="ember" />
        <StatCard label="Assessment score" value={currentUser.vettedScore} hint="Top 8% of TypeScript engineers" accent="mint" />
        <StatCard label="Credits" value={currentUser.credits} accent="violet" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* application history */}
        <Panel className="p-6 md:p-7">
          <h2 className="text-display text-2xl">Application history</h2>
          <div className="mt-5 space-y-3">
            {applications.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-4 rounded-2xl border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.02)] p-4">
                <div className="flex items-center gap-3">
                  <OrgAvatar src={a.logo} name={a.company} size={40} />
                  <div>
                    <div className="text-sm font-medium">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.company} · {a.appliedAt}</div>
                  </div>
                </div>
                <span className="text-[11px] uppercase tracking-[0.16em]" style={{ color: helpers.statusColor(a.status) }}>{a.status}</span>
              </div>
            ))}
          </div>
        </Panel>

        {/* resume */}
        <Panel className="p-6">
          <h2 className="text-display text-2xl">Resume</h2>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[oklch(1_0_0_/_0.1)] bg-[oklch(1_0_0_/_0.03)] p-4">
            <span className="inline-flex size-11 items-center justify-center rounded-xl" style={{ background: "color-mix(in oklch, var(--color-ember) 16%, transparent)", color: "var(--color-ember)" }}>
              <FileText className="size-5" />
            </span>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">ada-okonkwo-resume.pdf</div>
              <div className="text-xs text-muted-foreground">AI-enhanced · updated 2d ago</div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <ActionButton variant="outline" className="w-full">Replace resume</ActionButton>
            <p className="text-center text-xs text-muted-foreground/70">Used when you turn off AI resume generation</p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
