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
      <AnimatePresence mode="wait">
        {(state === "intake" || state === "loading") && (
          <motion.div
            key="intake"
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen flex items-center justify-center py-12"
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
