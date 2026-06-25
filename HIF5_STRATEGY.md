# HIF 5.0 Hackathon — Fÿnd Strategy & Track Plan

> Shared brief for the team + coding AI. Goal: enter ONE product across MULTIPLE tracks
> using our existing strengths. Read this so we're all aligned before building.

---

## TL;DR (read this first)

We build **Fÿnd** (our dual-sided job/gigs platform) as the hero product, wire **Solana Pay
escrow** into it, and spin off the **gig-escrow as a standalone Solana dApp on poof.new**.
Our Solana depth (the already-built **Solana Pay Dispatcher**) is the through-line that makes
**3 different tracks** credible at once: Solana, Vibecoding, and Alerta.

**One product + its infra → 6 tracks.**

---

## The hackathon: HIF 5.0

- **Tagline:** "Come for the build. Leave with the bag."
- **Total pool:** ₦2,000,000
- **Tracks:** 8 · **Duration:** ~13 days (CONFIRM exact deadline)
- **Main prizes judged on:** what you built, how well it runs, the problem it solves.

### Main pool
| Place | Prize |
|---|---|
| 🥇 01 | ₦1,000,000 |
| 🥈 02 | ₦600,000 |
| 🥉 03 | ₦400,000 |

### Side tracks (some prize figures are best-guess from a low-res image — CONFIRM)
| Track | Prize (approx) |
|---|---|
| Best Solana Integration | ~₦300k |
| Best AI Project | ~₦150k |
| Hardware Track | ~₦300k / ₦200k |
| Viewer's Choice | ~₦150k |
| Rising Star | ? |
| Best Alerta | ~₦150k |
| Vibecoding | ₦300k / ₦200k / ₦100k tiers |

---

## Our assets (what we already have)

- **Fÿnd** — dual-sided job/gigs platform (TanStack Start). User-ownable themes
  (liquid default + foundry web3 theme), "Hi there → own your design" pre-login flow built.
- **Solana Pay Dispatcher** — fully built (all 30 phases done, USDG payouts, 0 TS errors).
  This is our deepest, most defensible asset. It's what makes the Solana/Vibecoding/Alerta
  tracks all credible instead of shallow.

---

## Track-by-track map

| Track | Strength | Our play |
|---|---|---|
| **Main pool (₦1M)** | 🟢 Strong | Fÿnd as a polished, real, demoable product |
| **Best Solana Integration** | 🟢🟢 Strongest | Solana Pay escrow powered by the Dispatcher |
| **Vibecoding (poof.new)** | 🟢🟢 Strongest | Gig-escrow rebuilt as a Solana dApp on poof.new |
| **Best Alerta** | 🟢 Medium-strong | Monitor the Solana payment infra + SLA/dispute alerts |
| **Best AI Project** | 🟡 Medium | AI gig/talent matching or proposal assistant |
| **Viewer's Choice** | 🟡 Medium | The user-ownable theming demo (the "wow") |
| **Hardware** | 🔴 Skip | No hardware in our stack |
| **Rising Star** | ❓ TBD | Depends on eligibility (first-timers/underdogs?) — CONFIRM rules |

### The two artifacts that cover everything
| Artifact | Tracks it hits |
|---|---|
| **Fÿnd** (hand-built) + Solana Pay escrow + AI matching | Main pool · Best AI · Viewer's Choice |
| **Gig-escrow dApp rebuilt on poof.new** | Vibecoding · Best Solana Integration |

The connective tissue across all of it is **our Solana depth**.

---

## Platform notes (what these tools are)

### poof.new
- **What it is:** an AI builder that ships full-stack **Solana dApps from prompts**
  ("Build Solana dApps in Minutes").
- **Why it's our strongest track, not a side bet:** the Vibecoding trap is everyone ships a
  shallow CRUD app. We ship a *real* Solana dApp because we actually understand what we're
  prompting toward (escrow, PDAs, payouts). Our domain knowledge is the moat inside the no-code tool.

### Alerta
- **What it is:** an **operational monitoring console** (ops/DevOps tool). Prometheus, Nagios,
  Zabbix, Cloudwatch etc. fire JSON alerts into it over HTTP; it de-dupes and correlates by
  `environment` + `resource` + `severity` and shows them in a console. Has a generic JSON HTTP
  API (accepts any alert + custom service/tags/attributes), Python SDK + CLI.
- **Weak fit (avoid):** "alert me when I get a gig / when payment lands." Those are *user
  success notifications* — a job for push/email/Telegram, not an ops alert console. A judge who
  knows Alerta will catch this as using the tool against its grain.
- **Strong fit (do this):** monitor our **Solana payment infrastructure** — a genuine,
  non-contrived reason to use Alerta.

---

## What we're doing on poof.new (the simple version)

Build the **gig escrow** as a standalone Solana dApp:

1. Client locks funds on-chain (escrow PDA tied to a gig ID).
2. Freelancer accepts + does the work (funds stay locked, visible to both).
3. Client approves → escrow releases payment to freelancer's wallet.
4. Dispute → funds stay locked until resolved (this is where Alerta fires).

That one dApp, prompted into existence on poof.new, **is** our Vibecoding entry, and the same
artifact also counts as a Best Solana Integration entry.

**Why a slice, not all of Fÿnd:** poof.new builds Solana dApps. The rest of Fÿnd (theming,
feeds, profiles, dual-sided UI) does NOT belong there — we'd fight the tool. We carve out the
one piece that is genuinely a Solana dApp: the escrow.

**Our edge inside the tool:** because we built the Dispatcher, we know what *correct* looks like
(PDA derivation, release authority, signature checks). We steer poof.new toward a sound dApp and
patch what it gets wrong. Others prompt blind.

### ⚠️ Validate poof.new BEFORE committing hours
1. How deep is its generated program? Custom escrow PDAs + release logic, or only token transfers?
2. Can we export/edit the code, or are we locked in their builder?
- **Action:** spend ~30 min prompting it for a trivial escrow first. If it can't do real escrow,
  pivot the Vibecoding entry to a simpler-but-complete Solana dApp (e.g. a tip/bounty board) and
  keep the deep escrow in Fÿnd proper.

---

## Alerta integration plan (the strong, on-grain version)

**Lead with infra monitoring** of the Solana payment rails (highest-stakes, most failure-prone
part of any product = genuine reason to monitor). Fire alerts into Alerta when:

- a **payout/escrow release fails** or reverts on-chain
- the **Solana RPC node** is down / rate-limited / lagging
- the **dispatcher queue backs up** (jobs stuck unprocessed)
- **signature verification fails** (possible fraud/bug)
- **hot wallet balance drops** below a payout threshold
- **webhook delivery fails**

De-dupes naturally (a failing RPC = one correlated alert, not 500).

**Bonus — legitimate operational *business* alerts** (alert-worthy because they need human action):
- **escrow held >48h unreleased** (SLA breach)
- **dispute opened** (needs intervention)

Avoid: "you got a gig 🎉" style success pings — not alert-worthy.

---

## Recommended build plan

**One domain, two artifacts, six tracks:**

1. **Fÿnd** — polish the real product (main pool + Viewer's Choice via theming demo).
2. **Solana Pay escrow** in Fÿnd via the Dispatcher (Best Solana Integration).
3. **Gig-escrow dApp on poof.new** (Vibecoding) — validate the tool first (30-min test).
4. **Alerta** monitoring the payment infra + SLA/dispute alerts (Best Alerta).
5. **AI matching/proposal layer** in Fÿnd (Best AI) — secondary, net-new work.

---

## Open questions to confirm

- [ ] Exact deadline / days remaining.
- [ ] Eligibility limits (team size, "must be new project", etc.).
- [ ] **Rising Star** criteria (first-timers/underdogs?).
- [ ] Side-track prize figures (some are guesses from a low-res image).
- [ ] poof.new depth + code export (the 30-min validation test).
