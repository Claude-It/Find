import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Clock, Mic, Video, Volume2 } from "lucide-react";
import { FyndLogo } from "@/components/liquid/FyndLogo";
import { ActionButton } from "@/components/app/shared";
import { interviewQuestions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/job-search/seeker/assessment")({
  component: Assessment,
});

type Phase = "welcome" | "permission" | "interview" | "complete";

/** Fÿnd's AI interviewer persona. */
const AI_NAME = "Nova";

function Assessment() {
  const [phase, setPhase] = useState<Phase>("welcome");

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* immersive themed backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[18%] h-[60vw] max-h-[760px] w-[60vw] max-w-[760px] -translate-x-1/2 rounded-full blob-a" style={{ background: "var(--gradient-ember)", filter: "blur(90px)" }} />
        <div className="absolute bottom-[-10%] right-[10%] h-[40vw] max-h-[520px] w-[40vw] max-w-[520px] rounded-full blob-c" style={{ background: "var(--gradient-violet)", filter: "blur(90px)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 120% 100% at 50% 30%, transparent 35%, var(--background) 100%)" }} />
      </div>

      <header className="flex items-center justify-between px-6 py-5 md:px-10">
        <FyndLogo size={24} />
        <span className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">AI Assessment</span>
      </header>

      <div className="flex flex-1 items-center justify-center px-5 pb-16">
        <AnimatePresence mode="wait">
          {phase === "welcome" && <Welcome key="w" onNext={() => setPhase("permission")} />}
          {phase === "permission" && <Permission key="p" onNext={() => setPhase("interview")} />}
          {phase === "interview" && <Interview key="i" onDone={() => setPhase("complete")} />}
          {phase === "complete" && <Complete key="c" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16, filter: "blur(6px)" }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="mx-auto max-w-xl text-center">
      <VoiceOrb state="idle" size={120} />
      <h1 className="mt-10 text-display text-5xl md:text-6xl">Meet {AI_NAME}.</h1>
      <p className="mx-auto mt-5 max-w-md text-muted-foreground">
        I'll ask a few questions about your craft — just talk to me like a real conversation. It
        takes about <span className="text-foreground">15 minutes</span>, and you only do it once.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        <span className="flex items-center gap-2"><Volume2 className="size-3.5" /> Voice-based</span>
        <span className="flex items-center gap-2"><Clock className="size-3.5" /> ~15 min</span>
        <span className="flex items-center gap-2"><Check className="size-3.5" /> One-time</span>
      </div>
      <div className="mt-10">
        <ActionButton onClick={onNext} className="px-10">I'm ready</ActionButton>
      </div>
    </motion.div>
  );
}

function Permission({ onNext }: { onNext: () => void }) {
  const [granted, setGranted] = useState({ cam: false, mic: false });
  const all = granted.cam && granted.mic;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45 }} className="mx-auto w-full max-w-md">
      <div className="glass-panel rounded-[2rem] p-8 text-center">
        <h2 className="text-display text-4xl">Quick permissions.</h2>
        <p className="mt-3 text-sm text-muted-foreground">{AI_NAME} needs your camera and mic for the interview. Nothing is recorded without you knowing.</p>
        <div className="mt-7 space-y-3">
          <PermRow icon={<Video className="size-5" />} label="Camera" granted={granted.cam} onGrant={() => setGranted((g) => ({ ...g, cam: true }))} />
          <PermRow icon={<Mic className="size-5" />} label="Microphone" granted={granted.mic} onGrant={() => setGranted((g) => ({ ...g, mic: true }))} />
        </div>
        <div className="mt-8">
          <ActionButton onClick={onNext} disabled={!all} className="w-full">{all ? "Begin interview" : "Grant access to continue"}</ActionButton>
        </div>
      </div>
    </motion.div>
  );
}

function PermRow({ icon, label, granted, onGrant }: { icon: React.ReactNode; label: string; granted: boolean; onGrant: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[oklch(1_0_0_/_0.1)] bg-[oklch(1_0_0_/_0.03)] px-4 py-3.5">
      <span className="flex items-center gap-3 text-sm"><span className="text-muted-foreground">{icon}</span>{label}</span>
      {granted ? (
        <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em]" style={{ color: "var(--color-mint)" }}><Check className="size-4" /> Allowed</span>
      ) : (
        <button onClick={onGrant} className="rounded-full border border-[oklch(1_0_0_/_0.16)] px-3.5 py-1.5 text-[11px] uppercase tracking-[0.16em] text-foreground transition-colors hover:border-[var(--color-ember)] cursor-pointer">Allow</button>
      )}
    </div>
  );
}

function Interview({ onDone }: { onDone: () => void }) {
  const [qIndex, setQIndex] = useState(0);
  const [thinking, setThinking] = useState(true);
  const [answering, setAnswering] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(15 * 60);
  const timerRef = useRef<number | null>(null);

  const total = interviewQuestions.length;
  const question = interviewQuestions[qIndex];

  // countdown
  useEffect(() => {
    timerRef.current = window.setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, []);

  // Nova "thinks" before each question, then speaks.
  useEffect(() => {
    setThinking(true);
    setAnswering(false);
    const t = window.setTimeout(() => setThinking(false), 1400);
    return () => window.clearTimeout(t);
  }, [qIndex]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  function next() {
    if (qIndex + 1 < total) setQIndex((i) => i + 1);
    else onDone();
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className="mx-auto w-full max-w-2xl">
      {/* progress + timer */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} className="h-1 w-8 rounded-full transition-colors" style={{ background: i <= qIndex ? "var(--color-ember)" : "oklch(1 0 0 / 0.12)" }} />
          ))}
        </div>
        <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-[oklch(1_0_0_/_0.12)] px-3 py-1.5 text-xs tabular-nums", secondsLeft < 60 && "text-[var(--destructive)]")}>
          <Clock className="size-3.5" /> {mm}:{ss}
        </span>
      </div>

      <div className="flex flex-col items-center text-center">
        <VoiceOrb state={thinking ? "thinking" : answering ? "listening" : "speaking"} size={140} />
        <span className="mt-5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {AI_NAME} · {thinking ? "thinking…" : answering ? "listening…" : "asking"}
        </span>

        <div className="mt-6 min-h-[5.5rem]">
          <AnimatePresence mode="wait">
            {thinking ? (
              <motion.div key="dots" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center gap-1.5 py-6">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} className="size-2 rounded-full bg-muted-foreground" animate={{ y: [0, -6, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </motion.div>
            ) : (
              <motion.p key={qIndex} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }} className="text-display text-2xl leading-snug md:text-3xl">
                "{question}"
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {!thinking && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 flex flex-col items-center gap-4">
            <button
              onClick={() => setAnswering((a) => !a)}
              className={cn("inline-flex size-16 items-center justify-center rounded-full border-2 transition-all cursor-pointer", answering ? "border-[var(--color-ember)] bg-[color-mix(in_oklch,var(--color-ember)_18%,transparent)]" : "border-[oklch(1_0_0_/_0.2)] hover:border-[var(--color-ember)]")}
            >
              <Mic className="size-6" style={{ color: answering ? "var(--color-ember)" : undefined }} />
            </button>
            <span className="text-xs text-muted-foreground">{answering ? "Recording your answer — tap to stop" : "Tap to answer by voice"}</span>
            <button onClick={next} className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline cursor-pointer">
              {qIndex + 1 < total ? "Next question →" : "Finish interview →"}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function Complete() {
  const navigate = useNavigate();
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="mx-auto max-w-lg text-center">
      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 14 }} className="mx-auto inline-flex size-20 items-center justify-center rounded-full" style={{ background: "color-mix(in oklch, var(--color-mint) 18%, transparent)", color: "var(--color-mint)" }}>
        <Check className="size-9" />
      </motion.span>
      <h1 className="mt-8 text-display text-5xl md:text-6xl">All done.</h1>
      <p className="mx-auto mt-5 max-w-md text-muted-foreground">
        Nice work. Your assessment is under review — you'll hear back within 1–2 days. Once you're
        approved, your matched feed unlocks.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <ActionButton onClick={() => navigate({ to: "/job-search/seeker/feed" })}>Preview my feed</ActionButton>
        <ActionButton variant="ghost" onClick={() => navigate({ to: "/onboarding" })}>Back to onboarding</ActionButton>
      </div>
    </motion.div>
  );
}

/* Animated voice orb — the AI's "presence". Pulses differently per state. */
function VoiceOrb({ state, size }: { state: "idle" | "thinking" | "speaking" | "listening"; size: number }) {
  const color = state === "listening" ? "var(--color-mint)" : "var(--color-ember)";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* outer rings */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute inset-0 rounded-full"
          style={{ border: `1px solid ${color}`, opacity: 0.3 }}
          animate={state === "idle" ? { scale: [1, 1.15, 1], opacity: [0.25, 0, 0.25] } : { scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: state === "thinking" ? 1.4 : 2.4, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
        />
      ))}
      {/* core */}
      <motion.div
        className="absolute inset-[18%] rounded-full"
        style={{ background: `radial-gradient(circle at 35% 30%, ${color}, color-mix(in oklch, ${color} 30%, transparent))`, boxShadow: `0 0 60px ${color}` }}
        animate={
          state === "speaking"
            ? { scale: [1, 1.08, 0.96, 1.05, 1] }
            : state === "listening"
              ? { scale: [1, 1.12, 1] }
              : state === "thinking"
                ? { scale: [1, 0.94, 1] }
                : { scale: [1, 1.04, 1] }
        }
        transition={{ duration: state === "speaking" ? 0.6 : 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
