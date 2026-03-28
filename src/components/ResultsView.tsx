import { motion } from "framer-motion";
import CandidateCard from "./CandidateCard";
import type { SearchResult } from "@/data/mockData";
import { ArrowLeftRight } from "lucide-react";

interface ResultsViewProps {
  results: SearchResult;
}

export default function ResultsView({ results }: ResultsViewProps) {
  const dotColor =
    results.confidenceLevel === "High"
      ? "bg-success"
      : results.confidenceLevel === "Moderate"
      ? "bg-warning"
      : "bg-danger";

  const dotTextColor =
    results.confidenceLevel === "High"
      ? "text-success"
      : results.confidenceLevel === "Moderate"
      ? "text-warning"
      : "text-danger";

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Top summary strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between mb-8"
      >
        <div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Top 5 Candidates</h2>
          <p className="text-sm text-muted-foreground mt-1">Ranked by weighted multi-agent consensus</p>
        </div>
        <div className="mt-3 sm:mt-0 bg-card border border-border rounded-lg px-4 py-3 min-w-[200px]">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-extrabold ${dotTextColor}`}>{results.confidence}%</span>
              <span className={`text-[10px] uppercase tracking-wider font-bold ${dotTextColor}`}>
                {results.confidenceLevel}
              </span>
            </div>
            <span className={`w-2.5 h-2.5 rounded-full ${dotColor} shrink-0`} />
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden mb-2">
            <div className={`h-full rounded-full ${dotColor}`} style={{ width: `${results.confidence}%` }} />
          </div>
          <p className="text-[10px] text-muted-foreground leading-snug">
            Based on evidence verification across 8 independent AI agents.
          </p>
        </div>
      </motion.div>

      {/* Candidate Cards */}
      <div className="space-y-4">
        {results.candidates.map((candidate, idx) => (
          <CandidateCard key={candidate.id} candidate={candidate} rank={idx + 1} />
        ))}
      </div>

      {/* Comparison View */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center"
      >
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <span className="px-2 py-0.5 rounded bg-secondary text-[10px] font-bold">Alpha</span>
        </div>
        <button
          disabled
          className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-md bg-secondary text-muted-foreground text-sm cursor-not-allowed"
          title="Coming soon"
        >
          <ArrowLeftRight className="w-4 h-4" />
          Comparison View — Coming Soon
        </button>
        <p className="text-xs text-muted-foreground mt-4">
          Our intelligence engine updates scores every 6 hours based on real-world market volatility
          and internal sentiment signals. Last updated: <strong className="text-foreground">Today, 04:12 GMT</strong>.
        </p>
      </motion.div>
    </div>
  );
}
