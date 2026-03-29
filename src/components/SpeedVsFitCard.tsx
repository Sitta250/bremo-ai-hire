import { Zap, CheckCircle2, Info } from "lucide-react";
import { motion } from "framer-motion";
import type { SpeedVsFit, SpeedVsFitEntry } from "@/lib/types";

function CandidateColumn({
  entry,
  label,
  accentClass,
  borderClass,
  bgClass,
}: {
  entry: SpeedVsFitEntry;
  label: string;
  accentClass: string;
  borderClass: string;
  bgClass: string;
}) {
  const isInternal = entry.candidate_type === "internal";
  return (
    <div className="flex-1 px-6 py-5">
      <p className={`text-xs font-label font-semibold uppercase tracking-widest mb-3 ${accentClass}`}>
        {label}
      </p>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <p className="font-headline font-bold text-lg text-foreground leading-tight truncate">
              {entry.candidate_name}
            </p>
            <span className="text-[11px] font-label font-semibold uppercase tracking-wide leading-none text-muted-foreground">
              {entry.notice_period}
            </span>
          </div>
        </div>
        <span className={`shrink-0 mt-0.5 text-xs font-label font-semibold uppercase tracking-wide px-2 py-0.5 rounded border ${
          isInternal
            ? "bg-primary/10 border-primary/20 text-primary"
            : "border-border/60 text-muted-foreground"
        }`}>
          {isInternal ? "Internal" : "External"}
        </span>
      </div>
      <div className={`inline-flex items-baseline gap-1.5 px-3 py-1.5 rounded border ${borderClass} ${bgClass}`}>
        <span className={`text-2xl font-label font-bold tabular-nums ${accentClass}`}>
          {entry.bremo_score.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export default function SpeedVsFitCard({ data }: { data: SpeedVsFit }) {
  if (data.same_person) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35 }}
        className="bg-card border border-border/50 rounded-lg px-5 py-4 flex items-center gap-3 mb-4"
      >
        <CheckCircle2 className="w-4 h-4 text-success/80 shrink-0" />
        <div>
          <p className="text-sm text-foreground/85">
            The top-ranked candidate is also the fastest available — no trade-off required.
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            {data.best_fit.candidate_name} · Bremo {data.best_fit.bremo_score.toFixed(2)} · Starts: {data.best_fit.notice_period}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.35 }}
      className="bg-card border border-border/50 rounded-lg overflow-hidden mb-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-6 pt-4 pb-3 border-b border-border/40">
        <Zap className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
        <span className="text-xs font-label font-semibold uppercase tracking-widest text-muted-foreground">
          Speed vs Fit Analysis
        </span>
      </div>

      {/* Two columns */}
      <div className="flex divide-x divide-border/40">
        <CandidateColumn
          entry={data.best_fit}
          label="Best Fit"
          accentClass="text-primary"
          borderClass="border-primary/20"
          bgClass="bg-primary/5"
        />
        <CandidateColumn
          entry={data.fastest}
          label="Fastest Available"
          accentClass="text-warning"
          borderClass="border-warning/20"
          bgClass="bg-warning/5"
        />
      </div>

      {/* Gap summary */}
      <div className="flex items-start gap-2.5 px-6 py-3.5 border-t border-border/40 bg-secondary/20">
        <Info className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          {data.gap_summary}
        </p>
      </div>
    </motion.div>
  );
}
