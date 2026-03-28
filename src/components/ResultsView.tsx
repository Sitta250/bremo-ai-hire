import { motion } from "framer-motion";
import CandidateCard from "./CandidateCard";
import type { SearchResult } from "@/data/mockData";
import { ArrowLeftRight } from "lucide-react";

interface ResultsViewProps {
  results: SearchResult;
}

export default function ResultsView({ results }: ResultsViewProps) {
  const isHigh = results.confidenceLevel === "High";
  const isMod  = results.confidenceLevel === "Moderate";

  const colorText  = isHigh ? "text-green-400"  : isMod ? "text-warning"  : "text-danger";
  const colorText2 = isHigh ? "text-green-500"  : isMod ? "text-warning"  : "text-danger";
  const colorBg    = isHigh ? "bg-green-500"    : isMod ? "bg-warning"    : "bg-danger";
  const colorBg30  = isHigh ? "bg-green-500/30" : isMod ? "bg-warning/30" : "bg-danger/30";
  const colorBorder = isHigh ? "border-green-400/20" : isMod ? "border-warning/20" : "border-danger/20";

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Top summary strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row sm:items-start justify-between mb-8"
      >
        <div>
          <h2 className="font-headline text-5xl font-extrabold tracking-tighter text-foreground mb-2">Top 5 Candidates</h2>
          <p className="text-base text-muted-foreground">Ranked by weighted multi-agent consensus</p>
        </div>

        {/* Confidence box */}
        <div className={`mt-4 sm:mt-0 w-64 bg-card/50 rounded-xl border ${colorBorder} p-5`}>
          <div className="flex items-end justify-between mb-2">
            <div>
              <span className={`text-4xl font-label font-black ${colorText}`}>
                {results.confidence}%
              </span>
              <p className={`text-[11px] font-label font-bold uppercase tracking-tighter ${colorText2}`}>
                {results.confidenceLevel} Confidence
              </p>
            </div>
            <div className="relative flex items-center justify-center mb-4 mr-2">
              <span className={`h-2 w-2 rounded-full z-10 ${colorBg}`} />
              <span className={`absolute h-5 w-5 rounded-full animate-pulse ${colorBg30}`} />
            </div>
          </div>
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mb-3">
            <div className={`h-full ${colorBg}`} style={{ width: `${results.confidence}%` }} />
          </div>
          <p className="text-[10px] text-muted-foreground leading-tight">
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
