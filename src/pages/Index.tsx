import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import IntakeForm from "@/components/IntakeForm";
import SummaryBar from "@/components/SummaryBar";
import ResultsView from "@/components/ResultsView";
import { mockResults } from "@/data/mockData";
import type { SearchResult } from "@/data/mockData";

interface SearchParams {
  role: string;
  poolType: "internal" | "hybrid";
  scenario: string;
  uploadedFiles: string[];
}

export default function Index() {
  const [state, setState] = useState<"intake" | "loading" | "results">("intake");
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [results, setResults] = useState<SearchResult | null>(null);

  const handleSubmit = (data: SearchParams) => {
    setSearchParams(data);
    setState("loading");

    // Simulated 2-second delay
    setTimeout(() => {
      setResults(mockResults);
      setState("results");
    }, 2000);
  };

  const handleEdit = () => {
    setState("intake");
    setResults(null);
  };

  const handleNewSearch = () => {
    setState("intake");
    setSearchParams(null);
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed nav header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl flex justify-between items-center px-8 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
              <rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity="0.6" />
              <rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity="0.6" />
              <rect x="9" y="9" width="5" height="5" rx="1" fill="white" opacity="0.3" />
            </svg>
          </div>
          <span className="font-headline font-black tracking-tighter text-xl uppercase text-foreground">
            Br<span className="text-primary">e</span>mo
          </span>
        </div>
        {state === "results" && (
          <button
            onClick={handleNewSearch}
            className="bg-primary/10 text-primary px-5 py-2 rounded-lg font-label text-[10px] font-bold uppercase tracking-wider hover:bg-primary/20 transition-all"
          >
            New Search
          </button>
        )}
      </header>

      <AnimatePresence mode="wait">
        {(state === "intake" || state === "loading") && (
          <motion.div
            key="intake"
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen flex items-center justify-center pt-28 pb-12"
          >
            <IntakeForm onSubmit={handleSubmit} isLoading={state === "loading"} />
          </motion.div>
        )}

        {state === "results" && searchParams && results && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <SummaryBar
              role={searchParams.role}
              poolType={searchParams.poolType}
              uploadedCount={searchParams.uploadedFiles.length}
              scenario={searchParams.scenario}
              onEdit={handleEdit}
              onNewSearch={handleNewSearch}
            />
            <ResultsView results={results} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
