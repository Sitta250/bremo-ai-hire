import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Zap,
} from "lucide-react";
import CompetencyRadar from "./CompetencyRadar";
import DeliberationTrace from "./DeliberationTrace";
import SpeedVsFitCard from "./SpeedVsFitCard";
import type { Candidate, SearchResult } from "@/data/mockData";

interface ResultsViewProps {
  results: SearchResult;
}

function getStartPeriod(candidate: Candidate, results: SearchResult) {
  const { fastest, best_fit: bestFit } = results.ui_payload.speed_vs_fit;
  if (candidate.id === fastest.candidate_id) return fastest.notice_period;
  if (candidate.id === bestFit.candidate_id) return bestFit.notice_period;
  return candidate.type === "Internal" ? "Internal move" : "External search";
}

function getBarColor(score: number) {
  if (score >= 8) return "bg-primary";
  if (score >= 6) return "bg-primary/50";
  if (score >= 4) return "bg-warning";
  return "bg-danger";
}

function EvidencePill({ evidence }: { evidence: "Verified" | "Self-reported" | "Inferred" }) {
  const styles = {
    Verified: "bg-success/10 text-success border-success/20",
    "Self-reported": "bg-warning/10 text-warning border-warning/20",
    Inferred: "bg-secondary text-muted-foreground border-border/40",
  };

  return (
    <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[11px] font-label font-semibold uppercase tracking-wide ${styles[evidence]}`}>
      {evidence === "Self-reported" ? "Self" : evidence}
    </span>
  );
}

function CandidateListItem({
  candidate,
  rank,
  selected,
  onSelect,
  results,
}: {
  candidate: Candidate;
  rank: number;
  selected: boolean;
  onSelect: () => void;
  results: SearchResult;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full rounded-lg border px-4 py-4 text-left transition-colors ${
        selected ? "border-primary bg-card" : "border-border/50 bg-card/70 hover:bg-card-hover"
      }`}
    >
      <div className="flex items-start gap-4">
        <span className={`mt-0.5 w-7 shrink-0 text-right font-label font-bold tabular-nums ${selected ? "text-primary" : "text-muted-foreground/60"}`}>
          {rank}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2.5 flex-wrap">
            <span className="font-headline text-lg font-bold text-foreground">{candidate.name}</span>
            <span className="text-[11px] font-label font-semibold uppercase tracking-wide leading-none text-muted-foreground">
              {getStartPeriod(candidate, results)}
            </span>
            <span className={`rounded border px-2 py-0.5 text-[10px] font-label font-semibold uppercase tracking-wide ${
              candidate.type === "Internal"
                ? "bg-primary/10 border-primary/20 text-primary"
                : "border-border/60 text-muted-foreground bg-transparent"
            }`}>
              {candidate.type}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{candidate.title}</p>
          <p className="mt-2 line-clamp-2 text-sm text-foreground/80">{candidate.oneLiner}</p>
        </div>
        <div className="shrink-0 text-right">
          <span className="block text-xs font-label uppercase tracking-widest text-muted-foreground mb-0.5">
            Score
          </span>
          <span className={`font-label font-bold tabular-nums leading-none ${selected ? "text-2xl text-primary" : "text-xl text-foreground/75"}`}>
            {candidate.matchScore.toFixed(2)}
          </span>
        </div>
      </div>
    </button>
  );
}

function CandidateDetail({ candidate }: { candidate: Candidate }) {
  const [sortOrder, setSortOrder] = useState<"original" | "asc" | "desc">("original");

  const sortedCriteria = useMemo(() => {
    if (sortOrder === "desc") return [...candidate.criteria].sort((a, b) => b.score - a.score);
    if (sortOrder === "asc") return [...candidate.criteria].sort((a, b) => a.score - b.score);
    return candidate.criteria;
  }, [candidate.criteria, sortOrder]);

  return (
    <motion.div
      key={candidate.id}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-card rounded-lg border border-border/50 overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-border/40">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-headline text-3xl font-bold text-foreground">{candidate.name}</span>
              <span className={`text-xs font-label font-semibold uppercase tracking-wide px-2 py-0.5 rounded border ${
                candidate.type === "Internal"
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "border-border/60 text-muted-foreground bg-transparent"
              }`}>
                {candidate.type}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-sm text-muted-foreground">{candidate.title}</p>
              <span className="text-muted-foreground/50">·</span>
              <p className="text-xs font-label font-semibold uppercase tracking-wider text-primary/80">
                {candidate.archetype}
              </p>
            </div>
          </div>

          <div className="text-right ml-2 shrink-0">
            <span className="block text-xs font-label uppercase tracking-widest text-muted-foreground mb-0.5">
              Score
            </span>
            <span className="font-label font-bold tabular-nums leading-none text-3xl text-primary">
              {candidate.matchScore.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 pb-8 pt-4 border-t border-border/40">
        <div className="space-y-8">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-muted-foreground/70" />
                <h4 className="text-xs font-label uppercase tracking-widest text-muted-foreground">AI Rationale</h4>
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed">{candidate.rationale}</p>
            </div>

            <div className="col-span-12 lg:col-span-8">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-label uppercase tracking-widest text-muted-foreground">
                  Intelligence Breakdown
                </h4>
                <div className="flex items-center gap-0.5">
                  {(["original", "desc", "asc"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSortOrder(mode)}
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
                      <div className={`h-full rounded-full ${getBarColor(cr.score)}`} style={{ width: `${cr.score * 10}%` }} />
                    </div>
                    <span className="text-sm font-label tabular-nums text-foreground/70 w-8 text-right shrink-0">
                      {cr.score.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 border-t border-border/40 pt-6">
            <CompetencyRadar profile={candidate.radarProfile} />

            <div className="border border-border/50 rounded-lg p-4 flex flex-col bg-secondary/20">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-3.5 h-3.5 text-warning/70" />
                <span className="text-xs font-label font-semibold uppercase tracking-widest text-warning/80">
                  The Challenger&apos;s Dissent
                </span>
              </div>

              <div className="mb-3">
                <span className={`inline-flex rounded border px-2.5 py-1 text-[10px] font-label font-bold uppercase tracking-[0.18em] ${
                  candidate.rankingStability === "Stable"
                    ? "border-success/20 bg-success/10 text-success"
                    : candidate.rankingStability === "Fragile"
                      ? "border-warning/20 bg-warning/10 text-warning"
                      : "border-danger/20 bg-danger/10 text-danger"
                }`}>
                  {candidate.rankingStability}
                </span>
              </div>

              <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                &quot;{candidate.challengerView}&quot;
              </p>

              <div className="border-l-2 border-warning/50 pl-3 py-2 bg-warning/5 rounded-r">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="w-3 h-3 text-warning/80 shrink-0" />
                  <span className="text-xs font-label font-semibold text-warning/90">Mitigation Strategy</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{candidate.mitigationStrategy}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-border/40 pt-6">
            <div>
              <h4 className="text-xs font-label uppercase tracking-widest text-muted-foreground mb-3">Core Strengths</h4>
              <div className="space-y-3">
                {candidate.strengths.map((s, i) => (
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
                {candidate.risks.map((r, i) => (
                  <div key={i} className="px-2.5 py-2 rounded border border-warning/20 bg-warning/5 flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-warning/80" />
                    <span className="text-sm text-warning leading-snug">{r.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-border/40 pt-6">
            <DeliberationTrace entries={candidate.deliberationTrace} />
          </div>

          <div className="border-t border-border/40 pt-5">
            <h4 className="text-xs font-label uppercase tracking-widest text-muted-foreground mb-4">
              Recommended Protocol
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {candidate.actionItems.map((item, i) => (
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
  );
}

export default function ResultsView({ results }: ResultsViewProps) {
  const [selectedId, setSelectedId] = useState(results.candidates[0]?.id ?? "");
  const [leftPaneWidth, setLeftPaneWidth] = useState(360);
  const [isResizing, setIsResizing] = useState(false);
  const layoutRef = useRef<HTMLDivElement>(null);
  const selectedCandidate = results.candidates.find((candidate) => candidate.id === selectedId) ?? results.candidates[0];

  useEffect(() => {
    if (!isResizing) return;

    const handleMove = (event: MouseEvent) => {
      if (!layoutRef.current) return;
      const bounds = layoutRef.current.getBoundingClientRect();
      const nextWidth = event.clientX - bounds.left;
      const minWidth = 280;
      const maxWidth = Math.min(520, bounds.width - 420);
      setLeftPaneWidth(Math.max(minWidth, Math.min(maxWidth, nextWidth)));
    };

    const handleUp = () => setIsResizing(false);

    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-4">
        <SpeedVsFitCard data={results.ui_payload.speed_vs_fit} />
      </div>

      <div ref={layoutRef} className="grid grid-cols-1 xl:flex xl:items-start">
        <div
          className="xl:h-[calc(100vh-10rem)] xl:overflow-y-auto xl:shrink-0 xl:pr-3"
          style={{ width: leftPaneWidth }}
        >
          <div className="space-y-3">
            {results.candidates.map((candidate, idx) => (
              <CandidateListItem
                key={candidate.id}
                candidate={candidate}
                rank={idx + 1}
                selected={candidate.id === selectedCandidate.id}
                onSelect={() => setSelectedId(candidate.id)}
                results={results}
              />
            ))}
          </div>
        </div>

        <div className="hidden xl:flex xl:h-[calc(100vh-10rem)] xl:items-stretch">
          <button
            type="button"
            aria-label="Resize panels"
            onMouseDown={() => setIsResizing(true)}
            className="group relative w-4 shrink-0 cursor-col-resize"
          >
            <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border/80 transition-colors group-hover:bg-primary/60" />
            <span className="absolute left-1/2 top-1/2 h-12 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border transition-colors group-hover:bg-primary/60" />
          </button>
        </div>

        <div className="min-w-0 xl:h-[calc(100vh-10rem)] xl:overflow-y-auto xl:flex-1 xl:pl-3">
          {selectedCandidate && <CandidateDetail candidate={selectedCandidate} />}
        </div>
      </div>
    </div>
  );
}
