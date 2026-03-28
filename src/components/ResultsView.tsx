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
        <div className="mt-3 sm:mt-0 bg-card border border-border rounded-lg p-5 min-w-[260px]">
          <div className="flex items-start justify-between mb-1">
            <div>
              <div className={`text-4xl font-extrabold ${dotTextColor}`}>
                {results.confidence}%
              </div>
              <div className={`text-xs uppercase tracking-wider font-bold mt-1 ${dotTextColor}`}>
                {results.confidenceLevel} Confidence
              </div>
            </div>
            <span className={`w-3 h-3 rounded-full ${dotColor} mt-2 shrink-0`} />
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden my-3">
            <div
              className={`h-full rounded-full ${dotColor}`}
              style={{ width: `${results.confidence}%` }}
            />
          </div>
          <div className="border-t border-border pt-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Based on evidence verification across 8 independent AI agents.
            </p>
          </div>
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
