import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Fingerprint, ShieldCheck, Wallet } from "lucide-react";
import { FyndLogo } from "@/components/liquid/FyndLogo";
import { ActionButton, Field, TextInput } from "@/components/app/shared";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

type Mode = "signup" | "login";
type Step = "passkey" | "profile";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signup");
  const [step, setStep] = useState<Step>("passkey");
  const [authing, setAuthing] = useState(false);

  // Simulate the LazorKit passkey ceremony.
  function runPasskey() {
    setAuthing(true);
    window.setTimeout(() => {
      setAuthing(false);
      if (mode === "login") {
        navigate({ to: "/onboarding" });
      } else {
        setStep("profile");
      }
    }, 1400);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-16 text-foreground grain">
      {/* themed ambient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[10%] top-[12%] h-[44vw] max-h-[560px] w-[44vw] max-w-[560px] rounded-full blob-a" style={{ background: "var(--gradient-ember)", filter: "blur(80px)" }} />
        <div className="absolute bottom-[6%] right-[8%] h-[40vw] max-h-[520px] w-[40vw] max-w-[520px] rounded-full blob-b" style={{ background: "var(--gradient-violet)", filter: "blur(90px)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 120% 90% at 50% 40%, transparent 30%, var(--background) 100%)" }} />
      </div>

      <div className="w-full max-w-md">
        <Link to="/" className="mb-10 flex justify-center">
          <FyndLogo size={34} />
        </Link>

        <div className="glass-panel rounded-[2rem] p-7 md:p-9">
          <AnimatePresence mode="wait">
            {step === "passkey" ? (
              <motion.div
                key="passkey"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1 className="text-display text-4xl md:text-5xl">
                  {mode === "signup" ? "Create your Fÿnd." : "Welcome back."}
                </h1>
                <p className="mt-3 text-sm text-muted-foreground">
                  One identity for jobs and gigs. Secured by a passkey — your Solana wallet comes
                  built in, no seed phrase, no extension.
                </p>

                <button
                  onClick={runPasskey}
                  disabled={authing}
                  className="group mt-8 flex w-full items-center justify-between gap-3 rounded-2xl border border-[oklch(1_0_0_/_0.14)] bg-[oklch(1_0_0_/_0.04)] px-5 py-4 text-left transition-all hover:border-[var(--color-ember)] hover:bg-[oklch(1_0_0_/_0.07)] disabled:opacity-70 cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span className="inline-flex size-11 items-center justify-center rounded-xl" style={{ background: "color-mix(in oklch, var(--color-ember) 18%, transparent)" }}>
                      <Fingerprint className="size-5" style={{ color: "var(--color-ember)" }} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">
                        {authing ? "Verifying passkey…" : "Continue with passkey"}
                      </span>
                      <span className="block text-xs text-muted-foreground">Powered by LazorKit</span>
                    </span>
                  </span>
                  {authing ? (
                    <span className="size-5 animate-spin rounded-full border-2 border-[var(--color-ember)] border-t-transparent" />
                  ) : (
                    <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  )}
                </button>

                <div className="mt-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span className="flex items-center gap-1.5"><ShieldCheck className="size-3.5" /> Passkey-secured</span>
                  <span className="flex items-center gap-1.5"><Wallet className="size-3.5" /> Wallet built-in</span>
                </div>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                  {mode === "signup" ? "Already on Fÿnd?" : "New here?"}{" "}
                  <button
                    onClick={() => setMode(mode === "signup" ? "login" : "signup")}
                    className="font-medium text-foreground underline-offset-4 hover:underline cursor-pointer"
                  >
                    {mode === "signup" ? "Log in" : "Create an account"}
                  </button>
                </p>
              </motion.div>
            ) : (
              <ProfileStep key="profile" onDone={() => navigate({ to: "/onboarding" })} />
            )}
          </AnimatePresence>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground/70">
          By continuing you agree to Fÿnd's Terms & Privacy.
        </p>
      </div>
    </div>
  );
}

function ProfileStep({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklch,var(--color-mint)_40%,transparent)] px-3 py-1 text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--color-mint)" }}>
        <ShieldCheck className="size-3.5" /> Passkey verified
      </div>
      <h1 className="text-display text-4xl md:text-5xl">Tell us who you are.</h1>
      <p className="mt-3 text-sm text-muted-foreground">A few details to set up your identity.</p>

      <form
        className="mt-7 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onDone();
        }}
      >
        <Field label="Full name">
          <TextInput defaultValue="Ada Okonkwo" placeholder="Your name" required />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Username">
            <TextInput defaultValue="ada" placeholder="username" required />
          </Field>
          <Field label="Country">
            <TextInput defaultValue="Nigeria" placeholder="Country" required />
          </Field>
        </div>
        <Field label="Email">
          <TextInput type="email" defaultValue="ada@fynd.xyz" placeholder="you@email.com" required />
        </Field>

        <ActionButton type="submit" className="mt-2 w-full">
          Continue to onboarding <ArrowRight className="size-4" />
        </ActionButton>
      </form>
    </motion.div>
  );
}
