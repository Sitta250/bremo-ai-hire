import { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle, ShieldAlert, Eye, CheckCircle2, CircleDot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Candidate } from "@/data/mockData";

function getBarColor(score: number) {
  if (score >= 8) return "bg-success";
  if (score >= 6) return "bg-primary";
  if (score >= 4) return "bg-warning";
  return "bg-danger";
}

function EvidenceBadge({ evidence }: { evidence: string }) {
  if (evidence === "Verified") return <span className="text-success text-xs">✓ Verified</span>;
  if (evidence === "Self-reported") return <span className="text-muted-foreground text-xs">◐ Self-reported</span>;
  return <span className="text-muted-foreground text-xs">○ Inferred</span>;
}

function StabilityBadge({ stability }: { stability: string }) {
  const colors: Record<string, string> = {
    Stable: "text-success border-success/30",
    Fragile: "text-warning border-warning/30",
    Volatile: "text-danger border-danger/30",
  };
  return (
    <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${colors[stability] || ""}`}>
      {stability}
    </span>
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
      {/* Collapsed Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-6 py-5 hover:bg-card-hover transition-colors text-left"
      >
        <span className={`text-2xl font-extrabold w-10 text-right ${rank === 1 ? "text-primary" : "text-muted-foreground"}`}>
          #{rank}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground text-base">{c.name}</span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                c.type === "Internal"
                  ? "bg-primary/20 text-primary"
                  : "bg-warning/20 text-warning"
              }`}
            >
              {c.type}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 uppercase tracking-wider text-xs">{c.archetype}</p>
        </div>

        <div className="hidden sm:flex items-center gap-2 flex-wrap">
          {c.quickTags.map((tag) => (
            <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-secondary text-secondary-foreground">
              {tag}
            </span>
          ))}
        </div>

        {c.flagCount > 0 && (
          <div className="flex items-center gap-1 text-warning text-xs">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{c.flagCount} flag{c.flagCount > 1 ? "s" : ""}</span>
          </div>
        )}

        <div className="text-right ml-2">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Bremo Score</div>
          <div className="text-3xl font-extrabold text-foreground text-score">{c.matchScore.toFixed(2)}</div>
        </div>

        <div className="text-muted-foreground ml-1">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Rationale */}
                <div className="lg:col-span-1">
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">AI Rationale</h3>
                  <p className="text-sm text-foreground leading-relaxed mb-4">{c.rationale}</p>
                  <div className="bg-secondary rounded p-3 text-xs font-mono text-muted-foreground">
                    {c.scoreFormula}
                  </div>
                </div>

                {/* Center: Criteria Bars */}
                <div className="lg:col-span-1">
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Intelligence Breakdown</h3>
                  <div className="space-y-2">
                    {c.criteria.map((cr) => (
                      <div key={cr.name} className="flex items-center gap-2 text-xs">
                        <span className="w-24 text-muted-foreground uppercase tracking-wider truncate">{cr.name}</span>
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${getBarColor(cr.score)}`} style={{ width: `${cr.score * 10}%` }} />
                        </div>
                        <span className="w-8 text-right text-foreground font-medium text-score">{cr.score.toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Strengths & Risks inline */}
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Core Strengths</h4>
                      <ul className="space-y-1.5">
                        {c.strengths.slice(0, 3).map((s, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-foreground">
                            <CheckCircle2 className="w-3 h-3 text-success mt-0.5 shrink-0" />
                            <span>{s.text.split(" — ")[0].split(" – ")[0].substring(0, 60)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Critical Risks</h4>
                      <ul className="space-y-1.5">
                        {c.risks.map((r, i) => (
                          <li key={i}>
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded ${
                                r.severity === "Critical"
                                  ? "bg-danger/15 text-danger"
                                  : "bg-warning/15 text-warning"
                              }`}
                            >
                              <AlertTriangle className="w-3 h-3" />
                              {r.text.substring(0, 40)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Right: Challenger View */}
                <div className="lg:col-span-1">
                  <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-warning" />
                      <h3 className="text-xs uppercase tracking-wider font-semibold text-warning">Challenger View</h3>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed italic mb-3">
                      "{c.challengerView}"
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Stability Meter</span>
                      <StabilityBadge stability={c.rankingStability} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Before You Decide */}
              <div className="mt-6 border-t border-border pt-5">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  Recommended Protocol: Before Deciding
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {c.actionItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-foreground bg-secondary rounded-md p-3">
                      <CircleDot className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Archetype */}
              <div className="mt-4 flex justify-end">
                <span className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                  {c.archetype}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
