/**
 * Mock data layer for the Fÿnd frontend.
 *
 * The real app reads from Firestore (see FRONTENDGUIDE.md). For the hackathon
 * frontend build every screen pulls from these in-memory fixtures so the UI is
 * fully navigable and demoable without a backend. Shapes mirror the Firestore
 * collections named in the guide so swapping in real listeners later is a
 * drop-in.
 */

export type SideId = "job-search" | "quick-gigs";

/* ----------------------------- skills ------------------------------ */

export const SEEKER_SKILLS = [
  "Virtual Assistant",
  "Graphic Designer",
  "Web Designer",
  "UI/UX Designer",
  "Software Engineer",
  "JavaScript Developer",
  "Python Developer",
  "TypeScript Developer",
  "Blockchain Engineer",
  "Solana Engineer",
  "Ethereum Engineer",
] as const;

export const GIG_CATEGORIES = ["Development", "Design", "Creator"] as const;
export type GigCategory = (typeof GIG_CATEGORIES)[number];

/* ----------------------------- the user ---------------------------- */

export const currentUser = {
  uid: "u_demo",
  fullName: "Ada Okonkwo",
  username: "ada",
  email: "ada@fynd.xyz",
  country: "Nigeria",
  avatar: "https://i.pravatar.cc/160?img=47",
  wallet: "7xKp...3mQ2",
  memberSince: "2025-09-01",
  credits: 145,
  vetted: true,
  vettedScore: 92,
  skills: ["TypeScript Developer", "Solana Engineer", "UI/UX Designer"],
  bio: "Full-stack engineer who ships. Solana, TypeScript, and pixel-tight UI. Ex-fintech, now building on-chain.",
  socials: { twitter: "@adabuilds", github: "ada-okonkwo", website: "ada.dev" },
};

export const companyProfile = {
  id: "c_demo",
  name: "Fynd Labs",
  email: "talent@fynd.xyz",
  website: "fynd.xyz",
  industry: "Hiring infrastructure",
  size: "11-50",
  logo: "https://logo.clearbit.com/lovable.dev",
  activePlan: "6-month",
  planRenews: "Sep 24, 2026",
};

export const businessProfile = {
  id: "biz_demo",
  name: "Superteam Lagos",
  email: "ops@superteam.fun",
  website: "superteam.fun",
  logo: "https://logo.clearbit.com/superteam.fun",
  verification: "Approved",
  wallet: "9yA4...P8k1",
};

/* ------------------------------- jobs ------------------------------ */

export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";

export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  type: JobType;
  location: string;
  remote: boolean;
  salary: string;
  fit: number; // 0-100 AI match
  skills: string[];
  description: string;
  cost: number; // credits to apply
}

export const jobs: Job[] = [
  {
    id: "j1",
    title: "Senior Product Engineer",
    company: "Linear",
    logo: "https://logo.clearbit.com/linear.app",
    type: "Full-time",
    location: "Remote",
    remote: true,
    salary: "$180k–220k",
    fit: 98,
    skills: ["TypeScript", "React", "DX"],
    description:
      "Build the tools high-performance teams use to plan and ship. You'll own end-to-end features across our editor, sync engine, and API.",
    cost: 8,
  },
  {
    id: "j2",
    title: "Solana Protocol Engineer",
    company: "Helius",
    logo: "https://logo.clearbit.com/helius.dev",
    type: "Full-time",
    location: "Remote · GMT±3",
    remote: true,
    salary: "$160k–200k + tokens",
    fit: 95,
    skills: ["Rust", "Solana", "Anchor"],
    description:
      "Work at the lowest layers of Solana infrastructure — RPC, indexing, and developer tooling used by thousands of dApps.",
    cost: 10,
  },
  {
    id: "j3",
    title: "Frontend Engineer, Design Systems",
    company: "Vercel",
    logo: "https://logo.clearbit.com/vercel.com",
    type: "Full-time",
    location: "Remote",
    remote: true,
    salary: "$150k–190k",
    fit: 91,
    skills: ["React", "Tailwind", "A11y"],
    description:
      "Craft the components and primitives that power millions of developer dashboards. Obsessive attention to motion and detail required.",
    cost: 7,
  },
  {
    id: "j4",
    title: "Product Designer",
    company: "Ramp",
    logo: "https://logo.clearbit.com/ramp.com",
    type: "Full-time",
    location: "New York / Remote",
    remote: true,
    salary: "$140k–175k",
    fit: 87,
    skills: ["UI/UX", "Figma", "Fintech"],
    description:
      "Design financial workflows that feel effortless. You'll partner closely with engineering on a fast-moving surface.",
    cost: 6,
  },
  {
    id: "j5",
    title: "Smart Contract Engineer",
    company: "Phantom",
    logo: "https://logo.clearbit.com/phantom.app",
    type: "Contract",
    location: "Remote",
    remote: true,
    salary: "$90–130/hr",
    fit: 84,
    skills: ["Rust", "Solana", "Security"],
    description:
      "Audit and ship the on-chain programs behind the most-used Solana wallet. Security-first mindset essential.",
    cost: 9,
  },
  {
    id: "j6",
    title: "Founding Full-Stack Engineer",
    company: "Stealth Fintech",
    logo: "https://logo.clearbit.com/stripe.com",
    type: "Full-time",
    location: "Lagos / Remote",
    remote: true,
    salary: "$120k–160k + equity",
    fit: 80,
    skills: ["TypeScript", "Node", "Postgres"],
    description:
      "Be employee #3 at a fintech rebuilding cross-border payments for Africa. Wear every hat, own real surface area.",
    cost: 5,
  },
];

export type ApplicationStatus = "Submitted" | "Under review" | "Interview" | "Offer" | "Rejected";

export interface Application {
  id: string;
  jobId: string;
  title: string;
  company: string;
  logo: string;
  appliedAt: string;
  status: ApplicationStatus;
}

export const applications: Application[] = [
  {
    id: "a1",
    jobId: "j1",
    title: "Senior Product Engineer",
    company: "Linear",
    logo: "https://logo.clearbit.com/linear.app",
    appliedAt: "2d ago",
    status: "Interview",
  },
  {
    id: "a2",
    jobId: "j3",
    title: "Frontend Engineer, Design Systems",
    company: "Vercel",
    logo: "https://logo.clearbit.com/vercel.com",
    appliedAt: "4d ago",
    status: "Under review",
  },
  {
    id: "a3",
    jobId: "j6",
    title: "Founding Full-Stack Engineer",
    company: "Stealth Fintech",
    logo: "https://logo.clearbit.com/stripe.com",
    appliedAt: "1w ago",
    status: "Offer",
  },
  {
    id: "a4",
    jobId: "j5",
    title: "Smart Contract Engineer",
    company: "Phantom",
    logo: "https://logo.clearbit.com/phantom.app",
    appliedAt: "1w ago",
    status: "Rejected",
  },
];

/* --------------------------- company side -------------------------- */

export interface Applicant {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  score: number; // AI interview score
  status: ApplicationStatus;
}

export interface PostedJob {
  id: string;
  title: string;
  type: JobType;
  status: "Active" | "Closed";
  applicants: Applicant[];
}

export const postedJobs: PostedJob[] = [
  {
    id: "pj1",
    title: "Senior Frontend Engineer",
    type: "Full-time",
    status: "Active",
    applicants: [
      {
        id: "ap1",
        name: "Ada Okonkwo",
        avatar: "https://i.pravatar.cc/80?img=47",
        skills: ["TypeScript", "React"],
        score: 92,
        status: "Interview",
      },
      {
        id: "ap2",
        name: "Diego Marín",
        avatar: "https://i.pravatar.cc/80?img=12",
        skills: ["React", "CSS"],
        score: 88,
        status: "Under review",
      },
      {
        id: "ap3",
        name: "Wei Chen",
        avatar: "https://i.pravatar.cc/80?img=33",
        skills: ["Vue", "TypeScript"],
        score: 79,
        status: "Submitted",
      },
    ],
  },
  {
    id: "pj2",
    title: "Solana Engineer",
    type: "Contract",
    status: "Active",
    applicants: [
      {
        id: "ap4",
        name: "Kofi Mensah",
        avatar: "https://i.pravatar.cc/80?img=15",
        skills: ["Rust", "Anchor"],
        score: 95,
        status: "Offer",
      },
      {
        id: "ap5",
        name: "Sara Lind",
        avatar: "https://i.pravatar.cc/80?img=20",
        skills: ["Solana", "Rust"],
        score: 83,
        status: "Submitted",
      },
    ],
  },
  { id: "pj3", title: "Product Designer", type: "Full-time", status: "Closed", applicants: [] },
];

export const applicantLetters: Record<string, string> = {
  ap1: "Ada connected our design-system work to measurable onboarding wins, then mapped her Solana experience to our marketplace roadmap. Strong signal for product ownership.",
  ap2: "Diego's letter highlights component architecture, accessibility, and fast iteration in a compact, role-specific way.",
  ap3: "Wei framed TypeScript and state management around maintainability for a distributed frontend team.",
  ap4: "Kofi emphasized Anchor, program testing, and incident response for protocol launches.",
  ap5: "Sara focused on Solana developer tooling and security reviews for production programs.",
};

export interface Plan {
  id: string;
  name: string;
  price: string;
  cadence: string;
  highlight?: boolean;
  features: string[];
  posts: string;
}

export const plans: Plan[] = [
  {
    id: "pay",
    name: "Pay per post",
    price: "$49",
    cadence: "one-time",
    posts: "1 job post",
    features: ["Single active listing", "AI-ranked applicants", "30-day visibility"],
  },
  {
    id: "q",
    name: "3-month",
    price: "$129",
    cadence: "/quarter",
    posts: "5 active posts",
    features: [
      "5 concurrent listings",
      "AI-ranked applicants",
      "Priority placement",
      "Email support",
    ],
  },
  {
    id: "h",
    name: "6-month",
    price: "$229",
    cadence: "/half-year",
    highlight: true,
    posts: "15 active posts",
    features: [
      "15 concurrent listings",
      "AI-ranked applicants",
      "Priority placement",
      "Team seats",
      "Analytics",
    ],
  },
  {
    id: "y",
    name: "1-year",
    price: "$399",
    cadence: "/year",
    posts: "Unlimited posts",
    features: [
      "Unlimited listings",
      "AI-ranked applicants",
      "Top placement",
      "Team seats",
      "Dedicated success",
    ],
  },
];

/* ---------------------------- bounties ----------------------------- */

export interface Bounty {
  id: string;
  title: string;
  org: string;
  orgLogo: string;
  category: GigCategory;
  reward: number; // USDC
  deadline: string;
  daysLeft: number;
  submissions: number;
  maxSubmissions: number;
  escrowFunded: boolean;
  description: string;
  requirements: string[];
}

export const bounties: Bounty[] = [
  {
    id: "b1",
    title: "Build a Solana Pay checkout widget",
    org: "Superteam",
    orgLogo: "https://logo.clearbit.com/superteam.fun",
    category: "Development",
    reward: 2500,
    deadline: "Jun 30",
    daysLeft: 6,
    submissions: 12,
    maxSubmissions: 35,
    escrowFunded: true,
    description:
      "Ship an embeddable, framework-agnostic Solana Pay checkout widget. Must support USDC + SOL, mobile QR, and a clean success state. Open-source, MIT.",
    requirements: [
      "Working demo deployed",
      "Source on GitHub (MIT)",
      "USDC + SOL support",
      "Mobile QR fallback",
    ],
  },
  {
    id: "b2",
    title: "Design a wallet onboarding flow",
    org: "Phantom",
    orgLogo: "https://logo.clearbit.com/phantom.app",
    category: "Design",
    reward: 1200,
    deadline: "Jul 4",
    daysLeft: 10,
    submissions: 28,
    maxSubmissions: 35,
    escrowFunded: true,
    description:
      "Reimagine first-time wallet onboarding for non-crypto-native users. Figma file + prototype. Bonus for a motion spec.",
    requirements: ["Figma source file", "Interactive prototype", "Light + dark", "Handoff-ready"],
  },
  {
    id: "b3",
    title: "Write a launch thread + explainer video",
    org: "Helius",
    orgLogo: "https://logo.clearbit.com/helius.dev",
    category: "Creator",
    reward: 800,
    deadline: "Jul 1",
    daysLeft: 7,
    submissions: 9,
    maxSubmissions: 20,
    escrowFunded: true,
    description:
      "Produce a punchy launch thread (X) plus a 60-second explainer video for our new RPC product. Hook-first, developer audience.",
    requirements: [
      "X thread (8+ posts)",
      "60s video",
      "Original assets",
      "Posted from your handle",
    ],
  },
  {
    id: "b4",
    title: "Smart contract security review",
    org: "Marginfi",
    orgLogo: "https://logo.clearbit.com/marginfi.com",
    category: "Development",
    reward: 4000,
    deadline: "Jul 8",
    daysLeft: 14,
    submissions: 4,
    maxSubmissions: 10,
    escrowFunded: true,
    description:
      "Audit a 600-line Anchor program. Deliver a written report with severity-ranked findings and suggested fixes.",
    requirements: ["Written report (PDF)", "Severity ranking", "Repro steps", "Suggested patches"],
  },
  {
    id: "b5",
    title: "Create a brand illustration set",
    org: "Tensor",
    orgLogo: "https://logo.clearbit.com/tensor.trade",
    category: "Design",
    reward: 1500,
    deadline: "Jul 6",
    daysLeft: 12,
    submissions: 17,
    maxSubmissions: 35,
    escrowFunded: true,
    description:
      "Design a cohesive set of 8 spot illustrations for our marketing site. Bold, modern, web3-native aesthetic.",
    requirements: ["8 illustrations", "SVG + PNG export", "Source files", "Usage guide"],
  },
  {
    id: "b6",
    title: "Build a Telegram trading bot",
    org: "Jupiter",
    orgLogo: "https://logo.clearbit.com/jup.ag",
    category: "Development",
    reward: 3000,
    deadline: "Jul 10",
    daysLeft: 16,
    submissions: 6,
    maxSubmissions: 25,
    escrowFunded: false,
    description:
      "Build a Telegram bot that executes swaps via the Jupiter API with slippage controls and a clean UX.",
    requirements: ["Deployed bot", "Source (MIT)", "Slippage controls", "Demo video"],
  },
];

export type BountyStatus = "Active" | "Closed" | "Winner chosen";

export const businessBounties: Array<Bounty & { status: BountyStatus; winnerWallet?: string }> = [
  {
    ...bounties[0],
    status: "Winner chosen",
    winnerWallet: "7xKp9mQ2cP1a8...F3mQ2",
  },
  {
    ...bounties[1],
    status: "Active",
  },
  {
    ...bounties[5],
    status: "Active",
  },
];

export interface Submission {
  id: string;
  bountyId: string;
  earner: string;
  avatar: string;
  submittedAt: string;
  note: string;
  links: string[];
  winner?: boolean;
}

export const submissions: Submission[] = [
  {
    id: "s1",
    bountyId: "b1",
    earner: "Ada Okonkwo",
    avatar: "https://i.pravatar.cc/80?img=47",
    submittedAt: "3h ago",
    note: "Deployed widget + MIT repo. Added Apple-Pay-style sheet.",
    links: ["github.com/ada/solpay", "solpay-demo.vercel.app"],
  },
  {
    id: "s2",
    bountyId: "b1",
    earner: "Kofi Mensah",
    avatar: "https://i.pravatar.cc/80?img=15",
    submittedAt: "1d ago",
    note: "Framework-agnostic web component, 4kb gzipped.",
    links: ["github.com/kofi/pay-wc"],
  },
  {
    id: "s3",
    bountyId: "b1",
    earner: "Sara Lind",
    avatar: "https://i.pravatar.cc/80?img=20",
    submittedAt: "2d ago",
    note: "React + vanilla builds, full QR fallback.",
    links: ["github.com/sara/checkout"],
  },
];

/* ----------------------- earner profile stats ---------------------- */

export const earnerStats = {
  applied: 34,
  won: 11,
  winRate: 32,
  totalEarned: 18750,
  appliedBounties: [
    {
      id: "b2",
      title: "Design a wallet onboarding flow",
      org: "Phantom",
      reward: 1200,
      status: "In review",
    },
    {
      id: "b5",
      title: "Create a brand illustration set",
      org: "Tensor",
      reward: 1500,
      status: "In review",
    },
  ],
  wonBounties: [
    { id: "w1", title: "Landing page redesign", org: "Drift", reward: 2000, date: "May 2026" },
    { id: "w2", title: "Solana Pay integration", org: "Superteam", reward: 2500, date: "Apr 2026" },
    { id: "w3", title: "Mascot illustration", org: "Tensor", reward: 1200, date: "Mar 2026" },
  ],
};

export const featuredSubmissions = [
  {
    id: "fs1",
    title: "Solana Pay Checkout",
    org: "Superteam",
    media:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    result: "Winner",
  },
  {
    id: "fs2",
    title: "Wallet Onboarding Prototype",
    org: "Phantom",
    media:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=900&q=80",
    result: "Finalist",
  },
];

export function monthsSince(date: string) {
  const start = new Date(date);
  const now = new Date("2026-06-24T00:00:00Z");
  return Math.max(
    1,
    (now.getFullYear() - start.getFullYear()) * 12 + now.getMonth() - start.getMonth(),
  );
}

/* --------------------------- notifications ------------------------- */

export type NotifKind = "application" | "bounty" | "winner" | "verification" | "escrow" | "message";

export interface Notification {
  id: string;
  kind: NotifKind;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  side: SideId;
}

export const notifications: Notification[] = [
  {
    id: "n1",
    kind: "application",
    title: "Interview invite",
    body: "Linear moved your application to Interview.",
    time: "12m",
    unread: true,
    side: "job-search",
  },
  {
    id: "n2",
    kind: "winner",
    title: "You won a bounty 🎉",
    body: "Superteam picked your Solana Pay submission. 2,500 USDC released.",
    time: "1h",
    unread: true,
    side: "quick-gigs",
  },
  {
    id: "n3",
    kind: "escrow",
    title: "Escrow funded",
    body: "Funds for ‘Solana Pay checkout widget’ are locked on-chain.",
    time: "3h",
    unread: true,
    side: "quick-gigs",
  },
  {
    id: "n4",
    kind: "application",
    title: "Auto-apply sent",
    body: "Fÿnd applied to Vercel · Design Systems on your behalf.",
    time: "5h",
    unread: false,
    side: "job-search",
  },
  {
    id: "n5",
    kind: "bounty",
    title: "New submission",
    body: "Kofi submitted to your ‘checkout widget’ bounty.",
    time: "1d",
    unread: false,
    side: "quick-gigs",
  },
];

/* ------------------------- AI interview Q's ------------------------ */

export const interviewQuestions = [
  "Walk me through how you'd architect a real-time sync engine for a collaborative editor.",
  "On Solana, how do you derive a PDA and why would you use one for an escrow account?",
  "Describe a time a TypeScript type made an entire class of bugs impossible.",
  "How would you design the swipe-to-apply interaction to feel instant under load?",
];

export const helpers = {
  statusColor(status: ApplicationStatus): string {
    switch (status) {
      case "Offer":
        return "var(--color-mint)";
      case "Interview":
        return "var(--color-ember)";
      case "Rejected":
        return "var(--destructive)";
      default:
        return "var(--color-muted-foreground)";
    }
  },
};
