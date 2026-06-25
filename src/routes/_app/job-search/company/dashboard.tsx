import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Mail,
  Plus,
  Send,
  UsersRound,
} from "lucide-react";
import {
  ActionButton,
  Field,
  OrgAvatar,
  PageHeading,
  Panel,
  Pill,
  StatCard,
  TextArea,
  TextInput,
} from "@/components/app/shared";
import {
  applicantLetters,
  companyProfile,
  helpers,
  postedJobs,
  SEEKER_SKILLS,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/job-search/company/dashboard")({
  component: CompanyDashboard,
});

function CompanyDashboard() {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const activeJobs = postedJobs.filter((job) => job.status === "Active");
  const applicants = postedJobs.flatMap((job) => job.applicants);

  return (
    <div>
      <PageHeading
        eyebrow="Job Search · Company"
        title={
          <>
            Hiring <em className="italic text-[var(--color-ember)]">command</em> center.
          </>
        }
        sub="Post roles, review AI-vetted applicants, inspect generated application material, and keep the active plan visible."
        action={
          <ActionButton onClick={() => setShowForm((open) => !open)}>
            <Plus className="size-4" /> New job
          </ActionButton>
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Active jobs" value={activeJobs.length} accent="ember" />
        <StatCard
          label="Applicants"
          value={applicants.length}
          accent="mint"
          hint="AI-ranked by score"
        />
        <StatCard
          label="Plan"
          value={companyProfile.activePlan}
          accent="violet"
          hint={`Renews ${companyProfile.planRenews}`}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {showForm && <PostJobForm onClose={() => setShowForm(false)} />}

          <Panel className="p-6 md:p-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-display text-2xl">Posted jobs</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Open each role to review applicants and status.
                </p>
              </div>
              <Pill accent="ember">{postedJobs.length} total</Pill>
            </div>

            <div className="mt-5 space-y-4">
              {postedJobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-2xl border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.02)] p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{job.title}</h3>
                        <Pill accent={job.status === "Active" ? "mint" : undefined}>
                          {job.status}
                        </Pill>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {job.type} · {job.applicants.length} applicants
                      </div>
                    </div>
                    <button className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground cursor-pointer">
                      View listing <ArrowRight className="size-3.5" />
                    </button>
                  </div>

                  {job.applicants.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {job.applicants.map((applicant) => (
                        <ApplicantRow key={applicant.id} applicant={applicant} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <aside className="space-y-6">
          <Panel className="p-6">
            <div className="flex items-center gap-3">
              <OrgAvatar src={companyProfile.logo} name={companyProfile.name} size={48} />
              <div>
                <div className="font-semibold">{companyProfile.name}</div>
                <div className="text-xs text-muted-foreground">{companyProfile.website}</div>
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-[color-mix(in_oklch,var(--color-mint)_35%,transparent)] bg-[color-mix(in_oklch,var(--color-mint)_8%,transparent)] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-mint)]">
                <BadgeCheck className="size-4" /> {companyProfile.activePlan} active
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Priority placement and 15 active posts.
              </p>
            </div>
            <ActionButton
              variant="outline"
              className="mt-5 w-full"
              onClick={() => navigate({ to: "/job-search/company/plans" })}
            >
              Renew or change plan
            </ActionButton>
          </Panel>

          <Panel className="p-6">
            <h2 className="text-display text-2xl">Review queue</h2>
            <div className="mt-4 space-y-3">
              {applicants.slice(0, 4).map((applicant) => (
                <div key={applicant.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={applicant.avatar}
                      alt={applicant.name}
                      className="size-9 rounded-xl object-cover"
                    />
                    <div>
                      <div className="text-sm font-medium">{applicant.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {applicant.score}% interview score
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[var(--color-ember)]">
                    {applicant.status}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function PostJobForm({ onClose }: { onClose: () => void }) {
  return (
    <Panel className="p-6 md:p-7">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-display text-2xl">Post a new job</h2>
        <BriefcaseBusiness className="size-5 text-[var(--color-ember)]" />
      </div>
      <form
        className="mt-5 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <Field label="Job title">
          <TextInput defaultValue="Senior Frontend Engineer" required />
        </Field>
        <Field label="Description">
          <TextArea
            rows={4}
            defaultValue="Own the frontend surface for a fast-growing talent marketplace."
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Type">
            <TextInput defaultValue="Full-time" />
          </Field>
          <Field label="Location">
            <TextInput defaultValue="Remote" />
          </Field>
          <Field label="Salary range">
            <TextInput defaultValue="$140k-180k" />
          </Field>
        </div>
        <Field label="Skills required">
          <div className="flex flex-wrap gap-2">
            {SEEKER_SKILLS.slice(3, 9).map((skill) => (
              <Pill key={skill} accent={skill.includes("TypeScript") ? "ember" : undefined}>
                {skill}
              </Pill>
            ))}
          </div>
        </Field>
        <div className="flex justify-end gap-2">
          <ActionButton variant="ghost" onClick={onClose}>
            Cancel
          </ActionButton>
          <ActionButton type="submit">
            <Send className="size-4" /> Publish role
          </ActionButton>
        </div>
      </form>
    </Panel>
  );
}

function ApplicantRow({
  applicant,
}: {
  applicant: (typeof postedJobs)[number]["applicants"][number];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-[oklch(1_0_0_/_0.08)] bg-[oklch(1_0_0_/_0.025)] p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={applicant.avatar}
            alt={applicant.name}
            className="size-11 rounded-xl object-cover"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{applicant.name}</span>
              <span
                className="rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.14em]"
                style={{
                  color: helpers.statusColor(applicant.status),
                  borderColor: `color-mix(in oklch, ${helpers.statusColor(applicant.status)} 38%, transparent)`,
                }}
              >
                {applicant.status}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {applicant.skills.map((skill) => (
                <span key={skill} className="text-xs text-muted-foreground">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
              applicant.score >= 90
                ? "bg-[color-mix(in_oklch,var(--color-mint)_14%,transparent)] text-[var(--color-mint)]"
                : "bg-[oklch(1_0_0_/_0.05)] text-muted-foreground",
            )}
          >
            <UsersRound className="size-3.5" /> {applicant.score}
          </span>
          <button
            onClick={() => setOpen((value) => !value)}
            className="rounded-full border border-[oklch(1_0_0_/_0.12)] px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-foreground transition-colors hover:border-[var(--color-ember)] cursor-pointer"
          >
            {open ? "Hide" : "Review"}
          </button>
          <a
            href={`mailto:${applicant.name.toLowerCase().replaceAll(" ", ".")}@example.com`}
            className="inline-flex size-9 items-center justify-center rounded-full border border-[oklch(1_0_0_/_0.12)] text-muted-foreground transition-colors hover:border-[var(--color-ember)] hover:text-foreground"
            aria-label={`Contact ${applicant.name}`}
          >
            <Mail className="size-4" />
          </a>
        </div>
      </div>

      {open && (
        <div className="mt-4 grid gap-3 border-t border-border/40 pt-4 md:grid-cols-2">
          <div className="rounded-xl bg-[oklch(1_0_0_/_0.03)] p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Generated cover letter
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {applicantLetters[applicant.id] ??
                "Generated application material is ready for review."}
            </p>
          </div>
          <div className="rounded-xl bg-[oklch(1_0_0_/_0.03)] p-4">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Resume
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              AI-enhanced resume attached with interview transcript, skills, and role-specific
              highlights.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
