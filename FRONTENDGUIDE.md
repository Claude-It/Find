# Find — Frontend Documentation

## Overview

**Find** is a dual-sided platform combining a vetted job search experience with a quick gigs/bounty system inspired by Superteam Earn. This document covers all frontend work required to build the platform.

---

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Database / Realtime | Firebase Firestore (realtime listeners via `onSnapshot`) |
| Auth | LazorKit (handles both authentication and Solana wallet — do not add a separate wallet adapter) |
| AI — Interviewer | Google Gemini API |
| AI — Job Auto-Applier | Google Gemini API |
| Payments (frontend scope) | Paystack (JavaScript SDK / inline) |
| Blockchain UI | Set up UI only — backend team handles all smart contract logic, escrow, NFT minting, USDC SPL token interactions, and on-chain records. The only blockchain library the frontend integrates directly is **LazorKit**. |

---

## Project Structure (Recommended)

```
/app
  /landing                  → Landing page (pre-auth)
  /auth                     → Sign up / Login
  /onboarding               → Role selection after signup
  /job-search
    /seeker
      /assessment           → AI interview flow
      /feed                 → Job feed (swipe UI)
      /profile              → Seeker profile
    /company
      /dashboard            → Post jobs, view applications
      /plans                → Subscription plan selection & Paystack payment
  /quick-gigs
    /earner
      /feed                 → Bounty feed
      /profile              → Earner profile + portfolio export
    /business
      /dashboard            → Post bounties, pick winners
      /post-bounty          → Bounty creation form + escrow deposit UI (Paystack)
  /switch                   → Pancake flip transition (shared layout component)
/components
/lib
  /firebase.ts
  /gemini.ts
  /lazorkit.ts
  /paystack.ts
```

---

## Pages & Screens

---

### 1. Landing Page `/`

The public-facing page shown before any signup or login.

**Content sections:**
- Hero section — headline, subheadline, CTA buttons (Get Started, Log In)
- "Two sides of Find" explainer — Job Search side vs Quick Gigs side with brief descriptions
- How it works — step-by-step for both sides
- Why Find — key differentiators (AI-vetting, blockchain-backed escrow, auto-apply)
- Footer — links, socials

**Notes:**
- This is a marketing page; keep it fast and visually engaging
- No auth required to view

---

### 2. Auth Pages `/auth`

**Sign Up:**
- LazorKit handles the auth flow (passkey/wallet-based)
- After LazorKit signup, collect: full name, username, email, country
- On submit → user document created in Firestore
- Redirect to Onboarding

**Log In:**
- LazorKit handles login
- On success → redirect to last active side (Job Search or Quick Gigs) or Onboarding if first time

---

### 3. Onboarding `/onboarding`

After signup, user chooses which side(s) of the app to join. This is a separate step from auth.

**UI:**
- Two cards: "Join Job Search" and "Join Quick Gigs"
- User can select one or both
- Each card has a short description of what that side involves
- CTA → takes them to the respective enrollment flow

---

## Job Search Side

---

### 4. Job Search Enrollment (Seeker) `/job-search/seeker/enroll`

Form shown when a user clicks "Join Job Search" as a seeker.

**Fields:**
- Skill categories (multi-select):
  - Virtual Assistant
  - Graphic Designer
  - Web Designer
  - UI/UX Designer
  - Software Engineer
  - JavaScript Developer
  - Python Developer
  - TypeScript Developer
  - Blockchain Engineer
  - Solana Engineer
  - Ethereum Engineer
- Upload resume (PDF) — optional at this stage
- Years of experience
- Portfolio link (optional)
- Brief bio

**On submit:**
- Data saved to Firestore
- Email triggered (backend) with AI interview link
- User sees a "pending assessment" state on their dashboard

---

### 5. AI Interview `/job-search/seeker/assessment`

Accessed via the unique link sent to the user's email. This is the core vetting flow.

**Flow:**
1. Welcome screen — explains the process, estimated duration
2. Camera/mic permission prompt (video interview)
3. AI interviewer asks questions based on the user's selected skill categories (the AI will talk to you with a voice just like the Zara model in Micro1)
4. User answers each question (voice)
5. Timer indicator (15 mins)
6. Completion screen — "Your assessment is under review. You'll hear back within 1–2 days."

**Gemini Integration:**
- Use Gemini API to generate questions dynamically based on selected skills
- System prompt should instruct Gemini to:
  - Quiz only on selected skill categories
  - For broad fields (e.g. Software Engineer), cover JS, Python, TS sub-topics
  - For specific fields (e.g. JS Developer only), stay scoped to that topic
  - Ask follow-up questions based on user answers
  - Maintain a professional interviewer persona with Find's AI identity/name
- Send conversation history with each Gemini request to maintain context
- Store full interview transcript in Firestore for backend review

**Notes:**
- The interview link should be time-limited or single-use (backend enforces, frontend just renders)
- Show a clear "thinking..." state while Gemini generates the next question

---

### 6. Seeker Dashboard / Job Feed `/job-search/seeker/feed`

Only accessible to approved seekers.

**UI:**
- Swipe card interface (Tinder-style):
  - Swipe right → interested (triggers AI auto-apply)
  - Swipe left → pass
  - Each card shows: job title, company name, job type (fulltime/part-time/contract/internship), location/remote, brief description
- Filter bar: job type, location, skill category
- "Applied Jobs" tab — list of jobs already applied to with status
- Credit balance shown prominently (e.g. "Credits: 145")
- Warning when credits are low

**Credit logic (UI only):**
- Each swipe right costs credits (minimum 5, varies by job — value fetched from Firestore)
- If insufficient credits → show modal prompting credit purchase (Paystack)
- Credit purchase modal: "Buy 200 credits for $5" → Paystack inline checkout

**Paystack Integration (credit purchase):**
```javascript
// Trigger Paystack inline for credit top-up
PaystackPop.setup({
  key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY, // test key
  email: user.email,
  amount: 500, // $5 in cents (Paystack uses kobo for NGN — adjust currency accordingly)
  currency: 'USD',
  metadata: { userId: user.uid, creditAmount: 200 },
  callback: (response) => {
    // Notify backend to verify and credit the user
  }
});
```

---

### 7. AI Auto-Applier

Triggered when a user swipes right on a job.

**Gemini Integration:**
- Show a loading state: "Applying for you..."
- Send to Gemini: user profile data (skills, experience, bio, resume text if uploaded) + job description
- Gemini generates:
  - A tailored cover letter
  - A custom resume (if user has not toggled "use my own resume")
- Display a preview of the generated cover letter and resume before final submission
- User can toggle: "Use my uploaded resume" — if toggled, skip AI resume generation
- Confirm button → backend submits to company

**UI states:**
- Generating → Preview → Confirm/Edit → Submitted
- On confirm: deduct credits from UI optimistically, sync with Firestore

---

### 8. Seeker Profile `/job-search/seeker/profile`

- Name, photo, bio
- Skills list
- Resume (uploaded or AI-generated)
- Application history
- Approval badge (shows they passed the AI interview)
- Edit profile option

---

### 9. Company Enrollment (Job Search) `/job-search/company/enroll`

Shown when a user joins the Job Search side as a company.

**Fields:**
- Company name
- Company email
- Website
- Industry
- Company size
- Logo upload

**On submit → Plan selection screen**

---

### 10. Plan Selection `/job-search/company/plans`

**Plans:**
- Pay per job post (one-time)
- 3-month plan
- 6-month plan
- 1-year plan

Each plan card shows: price, what's included, job post limit or unlimited.

**Paystack Integration (plan purchase):**
- On plan select → Paystack inline checkout
- On success → notify backend to activate plan
- On activation → redirect to company dashboard

---

### 11. Company Dashboard (Job Search) `/job-search/company/dashboard`

- Post a new job (form: title, description, type, location, skills required, salary range)
- View all posted jobs with status (active/closed)
- View applications per job
- Each application shows: seeker name, skills, AI interview score/status, generated cover letter, resume
- "Contact" button per applicant (opens email or in-platform message — decide scope)
- Active plan indicator + renewal CTA

---

## Quick Gigs Side

---

### 12. Quick Gigs Enrollment `/quick-gigs/enroll`

After joining Quick Gigs, user picks a role:

**Earner:**
- Select skill categories: Development / Design / Creator
- Bio (optional)
- Social links (optional)
- On submit → earner feed

**Business/Corporate:**
- Company name
- Company email
- Social handles
- Company website
- Official document upload (CAC, business license, etc.)
- On submit → "Verification pending (up to 48 hours)" screen

---

### 13. Earner Feed `/quick-gigs/earner/feed`

- List of active bounties, default filtered to user's skill categories
- Category tabs to switch (Development / Design / Creator / All)
- Each bounty card: title, reward amount, skill required, deadline, submissions count / max submissions, posted by (company name + logo)
- Click bounty → bounty detail page
- Apply button on detail page → submission form (text, links, file upload)

---

### 14. Bounty Detail Page `/quick-gigs/bounty/[id]`

- Full bounty description
- Reward amount
- Deadline
- Submission count (e.g. 12/35)
- Requirements
- Submit work button → opens submission modal
- List of public submissions (if bounty is set to public)

**Blockchain UI note:** Show escrow status badge (e.g. "Funds in escrow ✓") — data fetched from Firestore (backend populates this from chain). Do not integrate smart contract directly.

---

### 15. Earner Profile & Portfolio `/quick-gigs/earner/profile`

**Profile sections:**
- Name, photo, bio, skills
- Member since date + "Member for X months" display
- Stats: bounties applied, bounties won, win rate %, total earned
- Bounties applied (list with links)
- Bounties won (list with links + winner badge)
- Social links

**Portfolio Export:**
- "Export Portfolio" button
- Generates a shareable link (e.g. `find.xyz/portfolio/username`)
- Portfolio page is a separate public-facing Next.js route `/portfolio/[username]`
- Template will be provided from a GitHub repo (to be added later) — frontend team will adapt it to pull from Firestore user data
- Portfolio page content:
  - Name, photo, bio
  - Skills with badges
  - Date of membership + duration
  - Bounties applied (with links)
  - Bounties won (with links + badges)
  - Win rate
  - Total earnings
  - Social links
  - Any featured submissions

---

### 16. Business Dashboard (Quick Gigs) `/quick-gigs/business/dashboard`

- View all posted bounties + status (active / closed / winner chosen)
- View submissions per bounty
- Choose winner button → triggers winner selection flow
- Blockchain UI: "Release funds to winner" button — set up the UI, show wallet address of winner. Backend team handles actual smart contract call and payout.
- Post new bounty CTA

---

### 17. Post Bounty Form `/quick-gigs/business/post-bounty`

**Fields:**
- Bounty title
- Description (rich text)
- Skill category (Development / Design / Creator)
- Reward amount (in USDC or USD equivalent)
- Deadline
- Max submissions (default 35, can be set lower, cannot exceed 35)
- Submission requirements

**Escrow deposit (Paystack):**
- After form fill → "Fund Escrow" step
- Show total amount to deposit
- Paystack inline checkout for the reward amount
- On success → notify backend to verify payment and activate bounty
- Blockchain UI note: Show "Escrow funded ✓" status once backend confirms. Do not interact with smart contract directly.

---

## Shared / Global Components

---

### 18. The Flip Switch (Job Search ↔ Quick Gigs)

A persistent UI element (nav or floating button) that lets users switch between the two sides of the app.

**Animation spec:**
- When toggled, the entire screen should animate like a **pancake flip** — the current view rotates/flips on the Y-axis (or X-axis) and the other side flips into view
- Use CSS `perspective` + `rotateY` transform with a smooth ease curve, or use Framer Motion's `AnimatePresence` with a custom flip variant
- The flip should feel satisfying and fast (~400–600ms)
- On flip completion → user is now on the other side of the app

**Implementation suggestion (Framer Motion):**
```jsx
// Wrap page content in motion.div with rotateY animation
// Use AnimatePresence to handle exit/enter of each side
```

**Placement:** Top nav or as a prominent toggle button clearly labeled "Switch to Quick Gigs" / "Switch to Job Search"

---

### 19. Notifications

- Bell icon in nav
- Realtime updates via Firestore `onSnapshot`:
  - Job Search: application status updates, company messages
  - Quick Gigs: bounty submission received (business), winner chosen (earner), verification approved (business)
- Unread count badge

---

### 20. Global Nav

- Find logo
- Current side indicator (Job Search or Quick Gigs)
- Flip switch button
- Notifications bell
- User avatar → profile dropdown (view profile, settings, logout)
- Credit balance (Job Search side only)

---

## Firebase Firestore — Collections (Frontend Reference)

Frontend reads/writes to these collections. Backend team owns schema fully — this is a reference only.

| Collection | Used for |
|---|---|
| `users` | Base user profile, auth info |
| `jobseeker_profiles` | Job search seeker data, skills, approval status |
| `company_profiles` | Job search company data, active plan |
| `jobs` | Job listings posted by companies |
| `applications` | Swipe-right applications, status |
| `assessments` | AI interview transcripts and results |
| `earner_profiles` | Quick gigs earner data |
| `business_profiles` | Quick gigs business data, verification status |
| `bounties` | Bounty listings, escrow status, winner |
| `submissions` | Earner submissions per bounty |
| `credits` | User credit balance and transaction log |
| `notifications` | Per-user notification feed |

Use `onSnapshot` for realtime updates on: notifications, application status, bounty submission counts, escrow status.

---

## AI Integration Summary

### Gemini — AI Interviewer
- **Where:** `/job-search/seeker/assessment`
- **What it does:** Conducts a dynamic voice-based interview based on the user's selected skill categories (voice model: Zara-like from Micro1)
- **Key prompt rules:**
  - Only quiz on selected skills
  - Broad field = cover sub-topics; specific field = stay scoped
  - Follow up on answers intelligently
  - Maintain Find's AI persona (give the AI a name — TBD by product team)
- **Store:** Full transcript to Firestore after completion

### Gemini — AI Auto-Applier
- **Where:** Job feed, triggered on swipe right
- **What it does:** Takes user profile + job description and generates a tailored cover letter and (optionally) a custom resume
- **Resume toggle:** If user enables "use my resume," skip resume generation
- **Show preview** before final confirmation

---

## Blockchain — Frontend Scope (Important)

The platform uses Solana-based blockchain infrastructure. Here is what the frontend team does and does not do:

| Feature | Frontend responsibility |
|---|---|
| **LazorKit auth** | ✅ Full integration — handles auth and wallet connection in one |
| **Escrow status display** | ✅ Show UI badge (data from Firestore, populated by backend) |
| **"Release funds" button** | ✅ Render the button and winner wallet address — backend handles the actual call |
| **NFT badge display** | ✅ Show badge/achievement UI if data exists in Firestore |
| **On-chain bounty record link** | ✅ Show Solana explorer link if backend provides transaction hash |
| **Smart contracts** | ❌ Backend team only |
| **USDC SPL token logic** | ❌ Backend team only |
| **NFT minting** | ❌ Backend team only |
| **Solana Pay** | ❌ Backend team only |

The blockchain stack uses **Solana (devnet)** for all on-chain activity. All real funds and mainnet interactions are out of scope for now.

---

## Paystack Integration (Frontend Scope)

Frontend handles Paystack for:
1. **Credit purchase** (Job Search seekers — 200 credits for $5)
2. **Plan purchase** (Job Search companies)
3. **Bounty escrow deposit** (Quick Gigs businesses)

Use Paystack inline JS SDK. Always use **test/sandbox keys** during development.

On payment success → call your backend API to verify the transaction reference before updating any UI state or Firestore data. Never trust the frontend callback alone.

---

## Notes for the Frontend Team

- One Find account works across both sides — no separate login for Job Search vs Quick Gigs
- The flip switch should always be accessible once a user is logged in and enrolled on at least one side
- If a user is only enrolled on one side, the flip button should prompt them to join the other side instead of switching
- All payment amounts during development are test/sandbox — no real money
- Portfolio page (`/portfolio/[username]`) is public and does not require login to view
- The GitHub portfolio template will be provided later — build the route and data-fetching layer now, template UI comes after