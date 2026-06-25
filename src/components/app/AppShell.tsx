/**
 * AppShell — the persistent post-login chrome.
 *
 *  • Global nav: logo, current-side indicator, side nav links, credits
 *    (job-search only), notifications, avatar menu, and a "Design" entry that
 *    re-opens the theme picker (so the whole app can be re-skinned from
 *    anywhere — the Viewer's-Choice money shot).
 *  • The Flip Switch: toggling sides plays a pancake-flip (Y-axis rotation)
 *    over the routed content, then lands on the other side's home screen.
 *
 * Built entirely on design-system tokens, so it lives in both themes.
 */
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Bell, LogOut, RefreshCw, SlidersHorizontal, User, Wallet } from "lucide-react";
import { FyndLogo } from "@/components/liquid/FyndLogo";
import { DesignOwnership } from "@/components/intro/DesignOwnership";
import { currentUser, notifications as seedNotifs, type SideId } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const SIDE_HOME: Record<SideId, string> = {
  "job-search": "/job-search/seeker/feed",
  "quick-gigs": "/quick-gigs/earner/feed",
};

const NAV_LINKS: Record<SideId, { label: string; to: string }[]> = {
  "job-search": [
    { label: "Feed", to: "/job-search/seeker/feed" },
    { label: "Profile", to: "/job-search/seeker/profile" },
    { label: "Companies", to: "/job-search/company/dashboard" },
    { label: "Switch", to: "/switch" },
  ],
  "quick-gigs": [
    { label: "Bounties", to: "/quick-gigs/earner/feed" },
    { label: "Profile", to: "/quick-gigs/earner/profile" },
    { label: "Business", to: "/quick-gigs/business/dashboard" },
    { label: "Switch", to: "/switch" },
  ],
};

function sideFromPath(pathname: string): SideId {
  return pathname.startsWith("/quick-gigs") ? "quick-gigs" : "job-search";
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const side = sideFromPath(location.pathname);
  const other: SideId = side === "job-search" ? "quick-gigs" : "job-search";

  const [out, setOut] = useState(false);
  const [designOpen, setDesignOpen] = useState(false);

  const flip = useCallback(() => {
    if (out) return;
    if (prefersReducedMotion()) {
      navigate({ to: SIDE_HOME[other] });
      return;
    }
    setOut(true);
    window.setTimeout(() => navigate({ to: SIDE_HOME[other] }), 300);
    window.setTimeout(() => setOut(false), 320);
  }, [out, other, navigate]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* ambient backdrop — themed */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <div
          className="absolute -top-32 left-[8%] h-[40vw] max-h-[520px] w-[40vw] max-w-[520px] rounded-full blob-a"
          style={{ background: "var(--gradient-ember)", filter: "blur(70px)" }}
        />
        <div
          className="absolute bottom-[-10%] right-[6%] h-[36vw] max-h-[480px] w-[36vw] max-w-[480px] rounded-full blob-b"
          style={{ background: "var(--gradient-mint)", filter: "blur(80px)" }}
        />
      </div>

      <TopNav
        side={side}
        other={other}
        onFlip={flip}
        flipping={out}
        onOpenDesign={() => setDesignOpen(true)}
      />

      {/* Flip-able routed content */}
      <main
        className="mx-auto w-full max-w-7xl px-5 pb-24 pt-28 md:px-8"
        style={{ perspective: 1400 }}
      >
        <motion.div
          animate={{ rotateY: out ? 90 : 0, opacity: out ? 0 : 1 }}
          transition={{ duration: 0.3, ease: [0.7, 0, 0.2, 1] }}
          style={{ transformStyle: "preserve-3d", transformOrigin: "center" }}
        >
          <Outlet />
        </motion.div>
      </main>

      <AnimatePresence>
        {designOpen && (
          <DesignOwnership key="app-design" mode="settings" onClose={() => setDesignOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------- nav ------------------------------- */

function TopNav({
  side,
  other,
  onFlip,
  flipping,
  onOpenDesign,
}: {
  side: SideId;
  other: SideId;
  onFlip: () => void;
  flipping: boolean;
  onOpenDesign: () => void;
}) {
  const sideLabel = side === "job-search" ? "Job Search" : "Quick Gigs";
  const otherLabel = other === "job-search" ? "Job Search" : "Quick Gigs";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full glass-panel py-2 pl-5 pr-2">
        {/* left: brand + side indicator */}
        <div className="flex items-center gap-4">
          <Link to={SIDE_HOME[side]} className="flex items-center">
            <FyndLogo size={24} />
          </Link>
          <span className="hidden items-center gap-2 rounded-full border border-[oklch(1_0_0_/_0.1)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline-flex">
            <span
              className="size-1.5 rounded-full"
              style={{
                background: side === "job-search" ? "var(--color-ember)" : "var(--color-mint)",
              }}
            />
            {sideLabel}
          </span>
        </div>

        {/* center: side links */}
        <nav className="hidden items-center gap-7 text-[12px] uppercase tracking-[0.18em] text-muted-foreground lg:flex">
          {NAV_LINKS[side].map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="transition-colors hover:text-foreground [&.active]:text-foreground"
              activeProps={{ className: "active text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* right: utilities */}
        <div className="flex items-center gap-1.5">
          {side === "job-search" && <CreditsChip />}

          <FlipButton onFlip={onFlip} flipping={flipping} otherLabel={otherLabel} other={other} />

          <NotificationsBell side={side} />

          <IconButton label="Design" onClick={onOpenDesign}>
            <SlidersHorizontal className="size-4" />
          </IconButton>

          <AvatarMenu onOpenDesign={onOpenDesign} />
        </div>
      </div>
    </header>
  );
}

function CreditsChip() {
  const low = currentUser.credits < 30;
  return (
    <Link
      to="/job-search/seeker/feed"
      className={cn(
        "hidden items-center gap-1.5 rounded-full border px-3 py-2 text-[11px] font-medium tracking-wide transition-colors md:inline-flex",
        low
          ? "border-[color-mix(in_oklch,var(--destructive)_45%,transparent)] text-[var(--destructive)]"
          : "border-[oklch(1_0_0_/_0.12)] text-muted-foreground hover:text-foreground",
      )}
      title="Credits"
    >
      <Wallet className="size-3.5" />
      {currentUser.credits}
    </Link>
  );
}

function FlipButton({
  onFlip,
  flipping,
  otherLabel,
  other,
}: {
  onFlip: () => void;
  flipping: boolean;
  otherLabel: string;
  other: SideId;
}) {
  return (
    <button
      onClick={onFlip}
      disabled={flipping}
      title={`Switch to ${otherLabel}`}
      className="group inline-flex items-center gap-2 rounded-full border border-[oklch(1_0_0_/_0.14)] bg-[oklch(1_0_0_/_0.04)] px-3 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground transition-all hover:border-[var(--color-ember)] hover:bg-[oklch(1_0_0_/_0.07)] disabled:opacity-60 cursor-pointer"
    >
      <RefreshCw
        className={cn(
          "size-3.5 transition-transform duration-500 group-hover:rotate-180",
          flipping && "animate-spin",
        )}
        style={{ color: other === "job-search" ? "var(--color-ember)" : "var(--color-mint)" }}
      />
      <span className="hidden sm:inline">{otherLabel}</span>
    </button>
  );
}

function IconButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[oklch(1_0_0_/_0.06)] hover:text-foreground cursor-pointer"
    >
      {children}
    </button>
  );
}

/* --------------------------- notifications ------------------------- */

function NotificationsBell({ side }: { side: SideId }) {
  const [open, setOpen] = useState(false);
  const items = seedNotifs;
  const unread = items.filter((n) => n.unread).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        className="relative inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[oklch(1_0_0_/_0.06)] hover:text-foreground cursor-pointer"
      >
        <Bell className="size-4" />
        {unread > 0 && (
          <span
            className="absolute right-1.5 top-1.5 size-2 rounded-full ring-2 ring-[var(--card)]"
            style={{ background: "var(--color-ember)" }}
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 z-50 mt-3 w-[min(86vw,340px)] overflow-hidden rounded-2xl glass-panel"
            >
              <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
                <span className="text-sm font-semibold">Notifications</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {unread} new
                </span>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                {items.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "flex gap-3 border-b border-border/30 px-4 py-3 last:border-0 transition-colors hover:bg-[oklch(1_0_0_/_0.03)]",
                      n.unread && "bg-[oklch(1_0_0_/_0.02)]",
                    )}
                  >
                    <span
                      className="mt-1.5 size-1.5 shrink-0 rounded-full"
                      style={{
                        background:
                          n.side === "job-search" ? "var(--color-ember)" : "var(--color-mint)",
                        opacity: n.unread ? 1 : 0.3,
                      }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-medium">{n.title}</span>
                        <span className="shrink-0 text-[10px] text-muted-foreground">{n.time}</span>
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {n.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ----------------------------- avatar ------------------------------ */

function AvatarMenu({ onOpenDesign }: { onOpenDesign: () => void }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="ml-0.5 inline-flex size-9 items-center justify-center overflow-hidden rounded-full border border-[oklch(1_0_0_/_0.14)] transition-transform hover:scale-105 cursor-pointer"
      >
        <img
          src={currentUser.avatar}
          alt={currentUser.fullName}
          className="h-full w-full object-cover"
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute right-0 z-50 mt-3 w-60 overflow-hidden rounded-2xl glass-panel"
            >
              <div className="border-b border-border/40 px-4 py-3">
                <div className="text-sm font-semibold">{currentUser.fullName}</div>
                <div className="text-xs text-muted-foreground">@{currentUser.username}</div>
              </div>
              <div className="p-1.5">
                <MenuItem
                  icon={<User className="size-4" />}
                  onClick={() => {
                    setOpen(false);
                    navigate({ to: "/job-search/seeker/profile" });
                  }}
                >
                  View profile
                </MenuItem>
                <MenuItem
                  icon={<SlidersHorizontal className="size-4" />}
                  onClick={() => {
                    setOpen(false);
                    onOpenDesign();
                  }}
                >
                  Change design
                </MenuItem>
                <MenuItem
                  icon={<LogOut className="size-4" />}
                  onClick={() => {
                    setOpen(false);
                    navigate({ to: "/" });
                  }}
                >
                  Log out
                </MenuItem>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({
  children,
  icon,
  onClick,
}: {
  children: ReactNode;
  icon: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-foreground/90 transition-colors hover:bg-[oklch(1_0_0_/_0.06)] cursor-pointer"
    >
      <span className="text-muted-foreground">{icon}</span>
      {children}
    </button>
  );
}
