import { useState, useMemo } from "react";
import { AlertTriangle, CheckCircle2, HelpCircle, Sparkles, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Candidate } from "@/data/mockData";

function getBarColor(score: number) {
  if (score >= 8) return "bg-primary";
  if (score >= 6) return "bg-primary/60";
  if (score >= 4) return "bg-warning";
  return "bg-danger";
}

function StabilityMeter({ stability }: { stability: string }) {
  const pct = stability === "Stable" ? 80 : stability === "Fragile" ? 35 : 15;
  const color = stability === "Stable" ? "bg-success" : "bg-[#ffb691]";
  const textColor = stability === "Stable" ? "text-success" : "text-[#ffb691]";
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-label uppercase tracking-widest text-muted-foreground">Stability Meter</span>
        <span className={`text-[10px] font-label uppercase tracking-widest font-bold ${textColor}`}>{stability}</span>
      </div>
      <div className="h-1 bg-secondary rounded-full overflow-hidden">
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
  const c = candidate;
  const [expanded, setExpanded] = useState(rank === 1);
  const [sortOrder, setSortOrder] = useState<"original" | "asc" | "desc">("original");

  const sortedCriteria = useMemo(() => {
    if (sortOrder === "desc") return [...c.criteria].sort((a, b) => b.score - a.score);
    if (sortOrder === "asc")  return [...c.criteria].sort((a, b) => a.score - b.score);
    return c.criteria;
  }, [c.criteria, sortOrder]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.08, duration: 0.4 }}
      className={`bg-card rounded-xl overflow-hidden transition-all duration-300 border-l-4 ${
        expanded
          ? "border-primary shadow-[0_0_40px_rgba(27,105,212,0.12)]"
          : "border-transparent hover:bg-card-hover"
      }`}
    >
      {/* Card Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-5 px-6 py-5 text-left cursor-pointer"
      >
        {/* Rank */}
        <span
          className={`font-label font-black shrink-0 ${
            expanded ? "text-3xl text-primary opacity-50" : "text-2xl text-muted-foreground opacity-30"
          }`}
        >
          #{rank}
        </span>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-headline font-bold ${expanded ? "text-2xl text-foreground" : "text-xl text-foreground"}`}>
              {c.name}
            </span>
            <span
              className={`text-[10px] font-label font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                c.type === "Internal"
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "border-border/40 text-muted-foreground"
              }`}
            >
              {c.type}
            </span>
          </div>
          <p
            className={`font-label text-[10px] tracking-widest font-bold uppercase mt-1 ${
              expanded ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {c.archetype}
          </p>
        </div>

        {/* Score */}
        <div className="text-right ml-2 shrink-0">
          <span className="block text-[10px] font-label uppercase tracking-widest text-muted-foreground mb-0.5">
            Bremo Score
          </span>
          <span
            className={`font-label font-black leading-none ${
              expanded ? "text-4xl text-primary" : "text-3xl text-foreground/70"
            }`}
          >
            {c.matchScore.toFixed(2)}
          </span>
        </div>

        {/* Chevron */}
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
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
            <div className="px-6 pb-8 pt-5 border-t border-white/5">
              <div className="grid grid-cols-12 gap-8">

                {/* Col 1 (4/12): AI Rationale */}
                <div className="col-span-12 lg:col-span-4 space-y-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                      <h4 className="text-[10px] font-label uppercase tracking-widest text-muted-foreground">AI Rationale</h4>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{c.rationale}</p>
                  </div>
                </div>

                {/* Col 2 (5/12): Intelligence Breakdown + Strengths & Risks grid */}
                <div className="col-span-12 lg:col-span-5 space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[10px] font-label uppercase tracking-widest text-muted-foreground">
                        Intelligence Breakdown
                      </h4>
                      <div className="flex items-center gap-1">
                        {(["original", "desc", "asc"] as const).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => setSortOrder(mode)}
                            className={`text-[9px] font-label font-bold uppercase tracking-wider px-2 py-0.5 rounded transition-colors ${
                              sortOrder === mode
                                ? "bg-primary/20 text-primary"
                                : "text-muted-foreground/50 hover:text-muted-foreground"
                            }`}
                          >
                            {mode === "original" ? "Default" : mode === "desc" ? "High↓" : "Low↑"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {sortedCriteria.map((cr) => (
                        <div key={cr.name} className="flex items-center gap-4">
                          <span className="w-28 text-[10px] font-label uppercase tracking-wide text-muted-foreground truncate shrink-0">
                            {cr.name}
                          </span>
                          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getBarColor(cr.score)}`}
                              style={{ width: `${cr.score * 10}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-label text-foreground w-6 text-right shrink-0">
                            {Math.round(cr.score * 10)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths + Risks side-by-side */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-[10px] font-label uppercase tracking-widest text-muted-foreground mb-3">Core Strengths</h4>
                      <div className="space-y-2">
                        {c.strengths.map((s, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
                            <span className="text-xs text-foreground/90">{s.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-label uppercase tracking-widest text-muted-foreground mb-3">Critical Risks</h4>
                      <div className="space-y-2">
                        {c.risks.map((r, i) => (
                          <div
                            key={i}
                            className="px-2 py-1 rounded border border-[#b44d00]/30 bg-[#b44d00]/5 flex items-center gap-2"
                          >
                            <AlertTriangle className="w-3 h-3 shrink-0 text-[#ffb691]" />
                            <span className="text-[10px] font-label font-bold uppercase text-[#ffb691]">
                              {r.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Col 3 (3/12): Challenger View */}
                <div className="col-span-12 lg:col-span-3">
                  <div className="bg-gradient-to-br from-[#ffb691]/10 to-transparent border border-[#ffb691]/20 rounded-xl p-5 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <HelpCircle className="w-4 h-4 text-[#ffb691]" />
                      <span className="text-[10px] font-label font-black uppercase tracking-widest text-[#ffb691]">Challenger View</span>
                    </div>
                    <p className="text-xs italic text-foreground/70 leading-relaxed mb-6 flex-1">
                      "{c.challengerView}"
                    </p>
                    <StabilityMeter stability={c.rankingStability} />
                  </div>
                </div>

                {/* Bottom: Recommended Protocol */}
                <div className="col-span-12 border-t border-white/5 pt-6 mt-2">
                  <h4 className="text-[10px] font-label uppercase tracking-widest text-muted-foreground mb-4">
                    Recommended Protocol: Before Deciding
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {c.actionItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="h-5 w-5 rounded-full bg-primary/15 text-primary font-label text-[10px] font-bold flex items-center justify-center shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="text-[11px] text-foreground/70 leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
