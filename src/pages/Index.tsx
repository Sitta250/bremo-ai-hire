import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import IntakeForm from "@/components/IntakeForm";
import EditPanel from "@/components/EditPanel";
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
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (data: SearchParams) => {
    setSearchParams(data);
    setState("loading");

    // Simulated 2-second delay
    setTimeout(() => {
      setResults(mockResults);
      setState("results");
    }, 2000);
  };

  const handleEdit = () => setIsEditing(true);

  const handleEditConfirm = (role: string, scenario: string) => {
    setSearchParams((prev) => prev ? { ...prev, role, scenario } : prev);
    setIsEditing(false);
  };

  const handleNewSearch = () => {
    setState("intake");
    setSearchParams(null);
    setResults(null);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed nav header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl flex items-center justify-between px-8 py-4 border-b border-white/5">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
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

        {/* Results: role + scenario summary */}
        {state === "results" && searchParams && (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-[9px] font-label uppercase tracking-widest text-muted-foreground/60 mb-0.5">Role</p>
                <p className="text-sm font-headline font-bold text-foreground leading-tight">{searchParams.role}</p>
              </div>
              <div className="w-px h-8 bg-border/50" />
              <div className="text-center">
                <p className="text-[9px] font-label uppercase tracking-widest text-muted-foreground/60 mb-0.5">Scenario</p>
                <p className="text-sm font-headline font-bold text-primary leading-tight">{searchParams.scenario}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={handleEdit}
                className={`px-4 py-1.5 text-[10px] font-label font-bold uppercase tracking-wider border rounded transition-colors ${
                  isEditing
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-foreground hover:bg-secondary"
                }`}
              >
                Edit
              </button>
              <button
                onClick={handleNewSearch}
                className="px-4 py-1.5 text-[10px] font-label font-bold uppercase tracking-wider bg-primary text-white rounded hover:bg-primary/90 transition-colors"
              >
                New Search
              </button>
            </div>
          </div>
        )}
      </header>

      <AnimatePresence>
        {isEditing && searchParams && (
          <EditPanel
            currentRole={searchParams.role}
            currentScenario={searchParams.scenario}
            onConfirm={handleEditConfirm}
            onCancel={() => setIsEditing(false)}
          />
        )}
      </AnimatePresence>

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
            className="pt-20"
          >
            <ResultsView results={results} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
