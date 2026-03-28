import { useState } from "react";
import { ChevronUp, AlertTriangle, CheckCircle2, HelpCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Candidate } from "@/data/mockData";

function getBarColor(score: number) {
  if (score >= 8) return "bg-primary";
  if (score >= 6) return "bg-primary/60";
  if (score >= 4) return "bg-warning";
  return "bg-danger";
}

function StabilityMeter({ stability }: { stability: string }) {
  const pct = stability === "Stable" ? 80 : stability === "Fragile" ? 45 : 20;
  const color = stability === "Stable" ? "bg-success" : stability === "Fragile" ? "bg-warning" : "bg-danger";
  const textColor = stability === "Stable" ? "text-success" : stability === "Fragile" ? "text-warning" : "text-danger";
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Stability Meter</span>
        <span className={`text-[10px] uppercase tracking-wider font-bold ${textColor}`}>{stability}</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

interface CandidateCardProps {
  candidate: Candidate;
  rank: number;
}

export default function CandidateCard({ candidate, rank }: CandidateCardProps) {
  const [expanded, setExpanded] = useState(rank === 1);
  const c = candidate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1, duration: 0.4 }}
      className={`bg-card border rounded-lg overflow-hidden transition-colors ${
        rank === 1 ? "border-primary/40" : "border-border"
      }`}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-6 py-5 hover:bg-card-hover transition-colors text-left"
      >
        <span className={`text-2xl font-extrabold w-10 text-right shrink-0 ${rank === 1 ? "text-primary" : "text-muted-foreground"}`}>
          #{rank}
        </span>


        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-foreground text-lg">{c.name}</span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                c.type === "Internal"
                  ? "border-primary/40 text-primary"
                  : "border-muted-foreground/40 text-muted-foreground"
              }`}
            >
              {c.type}
            </span>
          </div>
          <p className="text-xs text-warning font-semibold italic mt-0.5">"{c.archetype}"</p>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            {c.quickTags.map((tag) => (
              <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-border text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="text-right ml-2 shrink-0">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Bremo Score</div>
          <div className="text-4xl font-extrabold text-foreground text-score leading-none">{c.matchScore.toFixed(2)}</div>
        </div>

        <div className="text-muted-foreground ml-1 shrink-0">
          <ChevronUp className={`w-5 h-5 transition-transform duration-200 ${expanded ? "" : "rotate-180"}`} />
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-border pt-6">
              {/* Three column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: AI Rationale + Challenger View */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">AI Rationale</h3>
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed mb-6">{c.rationale}</p>

                  {/* Challenger View */}
                  <div className="bg-card-hover border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <HelpCircle className="w-4 h-4 text-warning" />
                      <h3 className="text-xs uppercase tracking-wider font-bold text-warning">Challenger View</h3>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed italic mb-4">
                      "{c.challengerView}"
                    </p>
                    <StabilityMeter stability={c.rankingStability} />
                  </div>
                </div>

                {/* Center: Intelligence Breakdown */}
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
                    Intelligence Breakdown (10 Metrics)
                  </h3>
                  <div className="space-y-3">
                    {c.criteria.map((cr) => (
                      <div key={cr.name} className="flex items-center gap-3">
                        <span className="w-[140px] text-[10px] text-muted-foreground uppercase tracking-wider truncate shrink-0">
                          {cr.name}
                        </span>
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${getBarColor(cr.score)}`}
                            style={{ width: `${cr.score * 10}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-foreground font-semibold text-xs text-score shrink-0">
                          {cr.score.toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Core Strengths + Critical Risks */}
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Core Strengths</h3>
                  <ul className="space-y-3 mb-6">
                    {c.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                        <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                        <div>
                          <span>{s.text}</span>
                          <span className={`ml-2 text-[10px] font-semibold ${
                            s.evidence === "Verified" ? "text-success" : "text-muted-foreground"
                          }`}>
                            {s.evidence}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Critical Risks</h3>
                  <div className="space-y-2">
                    {c.risks.map((r, i) => (
                      <div
                        key={i}
                        className={`rounded-md p-3 text-xs uppercase tracking-wider font-semibold leading-relaxed ${
                          r.severity === "Critical"
                            ? "bg-danger/10 border border-danger/20 text-danger"
                            : "bg-warning/10 border border-warning/20 text-warning"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          <span className="normal-case text-[11px]">{r.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Before You Decide — numbered action items */}
              <div className="mt-8 border-t border-border pt-6">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-4">
                  Recommended Protocol: Before Deciding
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {c.actionItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-foreground/90">
                      <span className="w-8 h-8 rounded-full border border-primary/40 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-xs leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
