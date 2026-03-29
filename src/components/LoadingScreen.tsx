import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const STEPS = [
  "Connecting to evaluation agents…",
  "Analyzing candidate profiles…",
  "Scoring competencies & culture fit…",
  "Running trade-off deliberation…",
  "Generating final rankings…",
];

export default function LoadingScreen() {
  const [activeStep, setActiveStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeStep >= STEPS.length - 1) return;
    const delay = 8000 + Math.random() * 4000; // 8-12s per step
    const timeout = setTimeout(() => setActiveStep((s) => s + 1), delay);
    return () => clearTimeout(timeout);
  }, [activeStep]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeStr = minutes > 0
    ? `${minutes}m ${seconds.toString().padStart(2, "0")}s`
    : `${seconds}s`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center gap-10"
    >
      {/* Spinner */}
      <div className="relative flex items-center justify-center">
        <svg className="animate-spin w-14 h-14 text-primary" viewBox="0 0 48 48" fill="none">
          <circle className="opacity-15" cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-80" fill="currentColor" d="M8 24a16 16 0 0116-16V0C10.745 0 0 10.745 0 24h8z" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
        </div>
      </div>

      {/* Status text */}
      <div className="flex flex-col items-center gap-3 max-w-md text-center px-6">
        <h2 className="text-lg font-headline font-semibold text-foreground">
          AI Evaluation in Progress
        </h2>
        <motion.p
          key={activeStep}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm text-muted-foreground"
        >
          {STEPS[activeStep]}
        </motion.p>
      </div>

      {/* Step indicators */}
      <div className="flex flex-col gap-2.5 w-64">
        {STEPS.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full shrink-0 transition-colors duration-500 ${
                i < activeStep
                  ? "bg-primary"
                  : i === activeStep
                    ? "bg-primary animate-pulse"
                    : "bg-muted-foreground/25"
              }`}
            />
            <span
              className={`text-xs transition-colors duration-500 ${
                i <= activeStep ? "text-foreground" : "text-muted-foreground/40"
              }`}
            >
              {step.replace("…", "")}
            </span>
          </div>
        ))}
      </div>

      {/* Timer + footer */}
      <div className="flex flex-col items-center gap-2 mt-4">
        <p className="text-xs font-mono text-muted-foreground/60">{timeStr}</p>
        <p className="text-[11px] font-label uppercase tracking-widest text-muted-foreground/40">
          Powered by AI Evaluation Agents
        </p>
      </div>
    </motion.div>
  );
}
