import { motion } from "motion/react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Sparkles,
  Shield,
  Zap,
  Wand2,
  Trophy,
  Wallet,
  SlidersHorizontal,
} from "lucide-react";
import { FyndLogo } from "./FyndLogo";
import { RollerButton } from "./RollerButton";
import { LiquidGlassHero } from "./LiquidGlassHero";
// Reveal is a theme-agnostic scroll-in wrapper; shared across both landings.
import { Reveal } from "@/components/liquid/Reveal";

/*
 * The Foundry landing intentionally shares its TEXT CONTENT with the default
 * (liquid) landing — only the skin differs: cool web3 palette, Space Grotesk,
 * and the shattering glass hero instead of liquid blobs.
 */

interface LandingProps {
  onOpenSettings?: () => void;
}

export function FoundryLanding({ onOpenSettings }: LandingProps) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      <Nav onOpenSettings={onOpenSettings} />
      <Hero />
      <Marquee />
      <TwoSides />
      <HowItWorks />
      <Why />
      <CTA />
      <Footer onOpenSettings={onOpenSettings} />
    </div>
  );
}

/* ---------------- NAV ---------------- */
function Nav({ onOpenSettings }: LandingProps) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 inset-x-0 z-50 px-6 pt-5">
      <div className="mx-auto max-w-7xl glass-panel rounded-full flex items-center justify-between pl-5 pr-2 py-2">
        <a href="#" className="flex items-center">
          <FyndLogo size={26} />
        </a>
        <nav className="hidden md:flex items-center gap-8 text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
          <a href="#sides" className="hover:text-foreground transition-colors">
            Platform
          </a>
          <a href="#how" className="hover:text-foreground transition-colors">
            How it works
          </a>
          <a href="#why" className="hover:text-foreground transition-colors">
            Why Fÿnd
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            aria-label="Change design"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Design</span>
          </button>
          <RollerButton
            variant="primary"
            icon={<ArrowUpRight className="h-4 w-4" />}
            onClick={() => navigate({ to: "/auth" })}
          >
            Get started
          </RollerButton>
        </div>
      </div>
    </header>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-24 px-6 overflow-hidden">
      {/* Shattering glass hero background */}
      <div className="absolute inset-0 -z-10">
        <LiquidGlassHero />
        {/* readability vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 120% 90% at 50% 45%, transparent 30%, var(--background) 92%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ember)] animate-pulse" />
            Now in private beta
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="text-display text-foreground mx-auto max-w-5xl">
            <span className="block text-[clamp(3rem,10vw,8.5rem)]">
              Work that <em className="italic text-[var(--color-ember)]">finds</em> you.
            </span>
            <span className="block text-[clamp(1.25rem,2.4vw,2rem)] text-muted-foreground/80 font-sans not-italic tracking-tight mt-6 leading-snug">
              Not the other way around.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="mt-10 mx-auto max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            Two sides, one platform. A vetted job search powered by an AI interviewer and
            auto-applier — and a quick-gig bounty board with escrow on-chain.
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <RollerButton
              variant="primary"
              icon={<ArrowUpRight className="h-4 w-4" />}
              onClick={() => navigate({ to: "/job-search/seeker/feed" })}
            >
              Start finding
            </RollerButton>
            <RollerButton
              variant="outline"
              onClick={() => navigate({ to: "/quick-gigs/business/post-bounty" })}
            >
              Post a bounty
            </RollerButton>
          </div>
        </Reveal>

        {/* Floating glass card preview */}
        <Reveal delay={0.6}>
          <motion.div
            initial={{ y: 40 }}
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="mt-24 mx-auto max-w-3xl glass-panel rounded-3xl p-2"
          >
            <div
              className="rounded-[20px] p-8 md:p-10"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.14 0.02 250 / 0.9), oklch(0.1 0.02 250 / 0.6))",
              }}
            >
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                <span>Live match · 00:08 ago</span>
                <span className="text-[var(--color-mint)]">98% fit</span>
              </div>
              <div className="mt-6 text-left">
                <div className="text-2xl md:text-3xl text-display">Senior Product Engineer</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Linear · Remote · $180k–220k
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  <Pill>TypeScript</Pill>
                  <Pill>React</Pill>
                  <Pill>DX</Pill>
                </div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Auto-applied by AI →
                </div>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.18em] border border-[oklch(1_0_0_/_0.08)] text-muted-foreground bg-[oklch(1_0_0_/_0.03)]">
      {children}
    </span>
  );
}

/* ---------------- MARQUEE ---------------- */
function Marquee() {
  const items = [
    "Vetted talent",
    "AI interviewer",
    "On-chain escrow",
    "USDC payouts",
    "Auto-apply",
    "Bounty boards",
    "Reputation NFTs",
    "Pancake flip UI",
  ];
  const row = [...items, ...items];
  return (
    <section className="py-12 border-y border-border/40 overflow-hidden">
      <div className="marquee flex gap-12 text-display text-3xl md:text-5xl text-muted-foreground/60 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-12">
            {t}
            <span className="text-[var(--color-ember)]">✦</span>
          </span>
        ))}
      </div>
    </section>
  );
}

/* ---------------- TWO SIDES ---------------- */
function TwoSides() {
  return (
    <section id="sides" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel>02 — The platform</SectionLabel>
          <h2 className="text-display text-5xl md:text-7xl mt-4 max-w-3xl">
            Two sides. <em className="italic text-muted-foreground">One flip away.</em>
          </h2>
        </Reveal>

        <div className="mt-20 grid md:grid-cols-2 gap-6">
          <Reveal delay={0.1}>
            <SideCard
              tag="Job Search"
              title="For seekers & companies"
              desc="Take an AI-led assessment once. Get matched to roles you'd actually love. Let the AI auto-apply on your behalf while you sleep."
              accent="ember"
              points={[
                "AI interviewer that learns your craft",
                "Auto-apply with personalized cover",
                "Companies see ranked, pre-vetted talent",
              ]}
            />
          </Reveal>
          <Reveal delay={0.2}>
            <SideCard
              tag="Quick Gigs"
              title="For earners & businesses"
              desc="Post a bounty, fund escrow in one click, pick a winner. Earners build a portfolio of real, paid work — verified on-chain."
              accent="mint"
              points={[
                "Escrow held until winner is picked",
                "Paid out in USDC, instantly",
                "Portable reputation, owned by you",
              ]}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function SideCard({
  tag,
  title,
  desc,
  points,
  accent,
}: {
  tag: string;
  title: string;
  desc: string;
  points: string[];
  accent: "ember" | "mint";
}) {
  const accentColor = accent === "ember" ? "var(--color-ember)" : "var(--color-mint)";
  return (
    <div
      className="radial-card rounded-3xl p-10 md:p-12 h-full group transition-all duration-500 hover:-translate-y-1"
      style={
        {
          "--rx": accent === "ember" ? "15%" : "85%",
          "--ry": "0%",
        } as React.CSSProperties
      }
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.22em]" style={{ color: accentColor }}>
          {tag}
        </span>
        <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
      <h3 className="text-display text-4xl md:text-5xl mt-8">{title}</h3>
      <p className="mt-5 text-muted-foreground leading-relaxed max-w-md">{desc}</p>
      <ul className="mt-10 space-y-4 border-t border-border/40 pt-8">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-3 text-sm">
            <span className="mt-2 w-1 h-1 rounded-full" style={{ background: accentColor }} />
            <span className="text-foreground/90">{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- HOW IT WORKS ---------------- */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "Sign in with passkey",
      d: "One-tap auth via LazorKit — your wallet comes built-in.",
    },
    {
      n: "02",
      t: "Pick a side",
      d: "Job seeker, company, earner, or business. Flip between them any time.",
    },
    {
      n: "03",
      t: "Let Fÿnd work",
      d: "AI matches, auto-applies, or routes bounties straight to your dashboard.",
    },
    { n: "04", t: "Get paid", d: "Offers land in your inbox. Bounty rewards land in your wallet." },
  ];
  return (
    <section id="how" className="px-6 py-32 border-t border-border/40">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel>03 — How it works</SectionLabel>
          <h2 className="text-display text-5xl md:text-7xl mt-4 max-w-3xl">
            Four steps. <em className="italic text-[var(--color-ember)]">Zero friction.</em>
          </h2>
        </Reveal>
        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="radial-card rounded-2xl p-8 h-full">
                <div className="text-display text-5xl text-[var(--color-ember)]">{s.n}</div>
                <div className="mt-8 text-lg font-medium">{s.t}</div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- WHY ---------------- */
function Why() {
  const items = [
    {
      icon: Wand2,
      t: "AI that actually vets",
      d: "A structured interview process that scores craft, not keywords.",
    },
    {
      icon: Shield,
      t: "Escrow on-chain",
      d: "Bounty funds are locked the moment you post. Trustless, by default.",
    },
    {
      icon: Zap,
      t: "Auto-apply",
      d: "Personalized cover letters fired off to every qualifying role.",
    },
    {
      icon: Trophy,
      t: "Portable reputation",
      d: "Every win is a verifiable NFT credential you own.",
    },
    { icon: Wallet, t: "USDC payouts", d: "No invoice ping-pong. Win it, withdraw it, done." },
    {
      icon: Sparkles,
      t: "Pancake flip",
      d: "Switch between job seeker and gig earner with a single tap.",
    },
  ];
  return (
    <section id="why" className="px-6 py-32 border-t border-border/40">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel>04 — Why Fÿnd</SectionLabel>
          <h2 className="text-display text-5xl md:text-7xl mt-4 max-w-3xl">
            Built different. <em className="italic text-muted-foreground">On purpose.</em>
          </h2>
        </Reveal>
        <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <Reveal key={it.t} delay={i * 0.07}>
              <div className="radial-card rounded-2xl p-8 h-full group hover:border-[oklch(1_0_0_/_0.12)] transition-colors">
                <it.icon className="h-6 w-6 text-[var(--color-ember)]" />
                <div className="mt-6 text-display text-2xl">{it.t}</div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{it.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */
function CTA() {
  const navigate = useNavigate();

  return (
    <section className="px-6 py-32">
      <Reveal>
        <div className="mx-auto max-w-6xl glass-panel rounded-[2.5rem] p-16 md:p-24 text-center relative overflow-hidden">
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full"
            style={{
              background: "radial-gradient(circle, oklch(0.78 0.16 195 / 0.3), transparent 60%)",
              filter: "blur(60px)",
            }}
          />
          <div className="relative">
            <FyndLogo size={48} />
            <h2 className="text-display text-5xl md:text-8xl mt-10">
              Stop searching.{" "}
              <em className="italic text-[var(--color-ember)]">Start being found.</em>
            </h2>
            <p className="mt-8 text-muted-foreground max-w-xl mx-auto">
              Join the private beta. We're onboarding the first 500 seekers, companies, and bounty
              hunters this month.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <RollerButton
                variant="primary"
                icon={<ArrowUpRight className="h-4 w-4" />}
                onClick={() => navigate({ to: "/auth" })}
              >
                Request access
              </RollerButton>
              <RollerButton variant="ghost" onClick={() => navigate({ to: "/switch" })}>
                See the switch
              </RollerButton>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer({ onOpenSettings }: LandingProps) {
  return (
    <footer className="px-6 pb-12 pt-6 border-t border-border/40">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <FyndLogo size={24} />
          <p className="mt-3 text-xs text-muted-foreground max-w-xs">
            Work that finds you. Built for seekers, earners, and the companies that want them.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">
            Twitter
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Discord
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Docs
          </a>
          <button
            onClick={onOpenSettings}
            className="uppercase tracking-[0.22em] hover:text-foreground transition-colors cursor-pointer"
          >
            Design
          </button>
        </div>
        <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground/60">
          © {new Date().getFullYear()} Fÿnd Labs
        </div>
      </div>
    </footer>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">{children}</div>
  );
}
