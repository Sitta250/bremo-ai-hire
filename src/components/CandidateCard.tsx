import { useState, useMemo } from "react";
import { AlertTriangle, CheckCircle2, HelpCircle, Sparkles, ChevronDown, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Candidate } from "@/data/mockData";
import CompetencyRadar from "@/components/CompetencyRadar";
import DeliberationTrace from "@/components/DeliberationTrace";

function getBarColor(score: number) {
  if (score >= 8) return "bg-primary";
  if (score >= 6) return "bg-primary/50";
  if (score >= 4) return "bg-warning";
  return "bg-danger";
}

function EvidencePill({ evidence }: { evidence: "Verified" | "Self-reported" | "Inferred" }) {
  const styles = {
    Verified:        "bg-success/10 text-success border-success/20",
    "Self-reported": "bg-warning/10 text-warning border-warning/20",
    Inferred:        "bg-secondary text-muted-foreground border-border/40",
  };
  return (
    <span className={`shrink-0 text-[11px] font-label font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded border ${styles[evidence]}`}>
      {evidence === "Self-reported" ? "Self" : evidence}
    </span>
  );
}

function StabilityGauge({ stability }: { stability: string }) {
  const cx = 110;
  const cy = 112;
  const outerR = 88;
  const innerR = 62;
  const startAngle = 180;
  const endAngle = 0;
  const gap = 4;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const polar = (r: number, angle: number) => ({
    x: cx + r * Math.cos(toRad(angle)),
    y: cy - r * Math.sin(toRad(angle)),
  });
  const arcFlag = (from: number, to: number) => Math.abs(from - to) > 180 ? 1 : 0;
  const segmentPath = (from: number, to: number) => {
    const o1 = polar(outerR, from);
    const o2 = polar(outerR, to);
    const i2 = polar(innerR, to);
    const i1 = polar(innerR, from);
    return [
      `M ${o1.x.toFixed(2)} ${o1.y.toFixed(2)}`,
      `A ${outerR} ${outerR} 0 ${arcFlag(from, to)} 1 ${o2.x.toFixed(2)} ${o2.y.toFixed(2)}`,
      `L ${i2.x.toFixed(2)} ${i2.y.toFixed(2)}`,
      `A ${innerR} ${innerR} 0 ${arcFlag(from, to)} 0 ${i1.x.toFixed(2)} ${i1.y.toFixed(2)}`,
      "Z",
    ].join(" ");
  };

  const dialSegments = [
    { key: "volatile", from: 180, to: 120, color: "hsl(var(--danger) / 0.9)" },
    { key: "fragile", from: 120, to: 60, color: "hsl(var(--warning) / 0.82)" },
    { key: "stable", from: 60, to: 0, color: "hsl(var(--success) / 0.92)" },
  ] as const;

  const statusMap = {
    Volatile: { score: 18, angle: 150, tone: "hsl(var(--danger))" },
    Fragile: { score: 52, angle: 90, tone: "hsl(var(--warning))" },
    Stable: { score: 84, angle: 30, tone: "hsl(var(--success))" },
  } as const;

  const activeStatus = statusMap[stability as keyof typeof statusMap] ?? statusMap.Fragile;
  const activeSegment = stability === "Volatile" ? "volatile" : stability === "Stable" ? "stable" : "fragile";
  const needleAngle = activeStatus.angle;

  return (
    <div className="mx-auto max-w-[260px]">
      <div className="relative rounded-[1.5rem] bg-[linear-gradient(180deg,hsl(var(--secondary)/0.3),hsl(var(--secondary)/0.08))] px-4 pb-4 pt-3">
        <svg viewBox="0 0 220 150" className="mx-auto block w-full">
          {dialSegments.map((segment) => (
            <path
              key={segment.key}
              d={segmentPath(segment.from - gap / 2, segment.to + gap / 2)}
              fill={segment.color}
              opacity={segment.key === activeSegment ? 1 : 0.38}
            />
          ))}

          <g
            style={{
              transformBox: "fill-box",
              transformOrigin: `${cx}px ${cy}px`,
              transform: `rotate(${needleAngle - 90}deg)`,
            }}
          >
            <path
              d={`M ${cx - 3} ${cy - 2} L ${cx + 3} ${cy - 2} L ${cx + 1.8} ${cy - 76} Q ${cx} ${cy - 88} ${cx - 1.8} ${cy - 76} Z`}
              fill="hsl(var(--foreground))"
              opacity="0.92"
            />
          </g>

          <circle cx={cx} cy={cy} r="11" fill="hsl(var(--card))" stroke="hsl(var(--foreground) / 0.16)" />
          <circle cx={cx} cy={cy} r="4" fill={activeStatus.tone} />

          <text
            x={cx}
            y="88"
            textAnchor="middle"
            className="fill-foreground text-[28px] font-bold"
            style={{ letterSpacing: "-0.04em" }}
          >
            {activeStatus.score}
          </text>
        </svg>

        <div className="mt-[-6px] flex items-start justify-between px-1">
        </div>

        <div className="mt-3 text-center">
          <div
            className="inline-flex rounded-full border px-3 py-1 text-[10px] font-label font-bold uppercase tracking-[0.24em]"
            style={{
              color: activeStatus.tone,
              borderColor: `${activeStatus.tone.replace(")", " / 0.22)")}`,
              backgroundColor: `${activeStatus.tone.replace(")", " / 0.08)")}`,
            }}
          >
            {stability}
          </div>
        </div>
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.06, duration: 0.35 }}
      className={`bg-card rounded-lg overflow-hidden transition-colors duration-200 border-l-[2px] ${
        expanded ? "border-primary" : "border-transparent hover:bg-card-hover"
      }`}
    >
      {/* Card Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-5 px-6 py-5 text-left cursor-pointer"
      >
        <span className={`font-label font-bold tabular-nums shrink-0 w-8 text-right ${
          expanded ? "text-2xl text-primary/70" : "text-xl text-muted-foreground/50"
        }`}>
          {rank}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={`font-headline font-bold ${expanded ? "text-2xl text-foreground" : "text-xl text-foreground"}`}>
              {c.name}
            </span>
            <span className={`text-xs font-label font-semibold uppercase tracking-wide px-2 py-0.5 rounded border ${
              c.type === "Internal"
                ? "bg-primary/10 border-primary/20 text-primary"
                : "border-border/60 text-muted-foreground bg-transparent"
            }`}>
              {c.type}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-sm text-muted-foreground">{c.title}</p>
            <span className="text-muted-foreground/50">·</span>
            <p className={`text-xs font-label font-semibold uppercase tracking-wider ${
              expanded ? "text-primary/80" : "text-muted-foreground/70"
            }`}>
              {c.archetype}
            </p>
          </div>
        </div>

        {!expanded && (
          <div className="hidden lg:flex items-center gap-1.5 flex-wrap max-w-xs">
            {c.quickTags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs font-label px-2 py-0.5 bg-secondary text-muted-foreground rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="text-right ml-2 shrink-0">
          <span className="block text-xs font-label uppercase tracking-widest text-muted-foreground mb-0.5">
            Score
          </span>
          <span className={`font-label font-bold tabular-nums leading-none ${
            expanded ? "text-3xl text-primary" : "text-2xl text-foreground/75"
          }`}>
            {c.matchScore.toFixed(2)}
          </span>
        </div>

        <ChevronDown className={`w-4 h-4 text-muted-foreground/70 shrink-0 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-8 pt-4 border-t border-border/40">
              <div className="space-y-8">

                {/* ── Row 1: AI Rationale + Intelligence Breakdown ── */}
                <div className="grid grid-cols-12 gap-8">
                  {/* AI Rationale */}
                  <div className="col-span-12 lg:col-span-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-3.5 h-3.5 text-muted-foreground/70" />
                      <h4 className="text-xs font-label uppercase tracking-widest text-muted-foreground">AI Rationale</h4>
                    </div>
                    <p className="text-sm text-foreground/85 leading-relaxed">{c.rationale}</p>
                  </div>

                  {/* Intelligence Breakdown */}
                  <div className="col-span-12 lg:col-span-8">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-label uppercase tracking-widest text-muted-foreground">
                        Intelligence Breakdown
                      </h4>
                      <div className="flex items-center gap-0.5">
                        {(["original", "desc", "asc"] as const).map((mode) => (
                          <button
                            key={mode}
                            onClick={(e) => { e.stopPropagation(); setSortOrder(mode); }}
                            className={`text-[11px] font-label font-semibold uppercase tracking-wide px-2 py-0.5 rounded transition-colors ${
                              sortOrder === mode
                                ? "bg-primary/15 text-primary"
                                : "text-muted-foreground/60 hover:text-muted-foreground"
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
                          <span className="w-36 text-xs font-label uppercase tracking-wide text-muted-foreground truncate shrink-0">
                            {cr.name}
                          </span>
                          <div className="flex-1 h-[5px] bg-border rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getBarColor(cr.score)}`}
                              style={{ width: `${cr.score * 10}%` }}
                            />
                          </div>
                          <span className="text-sm font-label tabular-nums text-foreground/70 w-8 text-right shrink-0">
                            {cr.score.toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Row 2: CompetencyRadar + Challenger Dissent ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 border-t border-border/40 pt-6">
                  {/* Competency Radar */}
                  <CompetencyRadar profile={c.radarProfile} />

                  {/* Challenger Dissent */}
                  <div className="border border-border/50 rounded-lg p-4 flex flex-col bg-secondary/20">
                    <div className="flex items-center gap-2 mb-3">
                      <HelpCircle className="w-3.5 h-3.5 text-warning/70" />
                      <span className="text-xs font-label font-semibold uppercase tracking-widest text-warning/80">
                        The Challenger's Dissent
                      </span>
                    </div>

                    {/* Gauge at the top */}
                    <div className="mb-3">
                      <StabilityGauge stability={c.rankingStability} />
                    </div>

                    <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                      "{c.challengerView}"
                    </p>

                    {/* Mitigation strategy */}
                    <div className="border-l-2 border-warning/50 pl-3 py-2 bg-warning/5 rounded-r">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Zap className="w-3 h-3 text-warning/80 shrink-0" />
                        <span className="text-xs font-label font-semibold text-warning/90">Mitigation Strategy</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{c.mitigationStrategy}</p>
                    </div>
                  </div>
                </div>

                {/* ── Row 3: Strengths + Risks ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-border/40 pt-6">
                  <div>
                    <h4 className="text-xs font-label uppercase tracking-widest text-muted-foreground mb-3">Core Strengths</h4>
                    <div className="space-y-3">
                      {c.strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-success/80 mt-0.5 shrink-0" />
                          <div className="min-w-0 space-y-1">
                            <p className="text-sm text-foreground/85 leading-snug">{s.text}</p>
                            <EvidencePill evidence={s.evidence} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-label uppercase tracking-widest text-muted-foreground mb-3">Risk Flags</h4>
                    <div className="space-y-2">
                      {c.risks.map((r, i) => (
                        <div key={i} className="px-2.5 py-2 rounded border border-warning/20 bg-warning/5 flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-warning/80" />
                          <span className="text-sm text-warning leading-snug">{r.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── Row 4: Deliberation Trace ── */}
                <div className="border-t border-border/40 pt-6">
                  <DeliberationTrace entries={c.deliberationTrace} />
                </div>

                {/* ── Row 5: Recommended Protocol ── */}
                <div className="border-t border-border/40 pt-5">
                  <h4 className="text-xs font-label uppercase tracking-widest text-muted-foreground mb-4">
                    Recommended Protocol
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {c.actionItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="h-5 w-5 rounded bg-primary/10 text-primary font-label text-xs font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <p className="text-sm text-foreground/75 leading-relaxed">{item}</p>
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
