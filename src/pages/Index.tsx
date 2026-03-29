import { useState, useEffect } from "react";
import { Sun, Moon, AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import IntakeForm from "@/components/IntakeForm";
import TalentPoolPanel from "@/components/TalentPoolPanel";
import EditPanel from "@/components/EditPanel";
import ResultsView from "@/components/ResultsView";
import LoadingScreen from "@/components/LoadingScreen";
import { internalPool } from "@/data/mockData";
import type { SummaryResult, DebugInfo } from "@/lib/types";
import { submitIntake } from "@/lib/api";
import { validateSummaryResult } from "@/lib/validateSummaryResult";
import logo from "@/logo.png";

interface SearchParams {
  role: string;
  roleInfo: Record<string, unknown>;
  team: string;
  teamInfo: Record<string, unknown>;
  poolType: "internal" | "hybrid";
  selectedInternalIds: string[];
  internalCandidates: Record<string, unknown>[];
  scenario: string;
  scenarioInfo: Record<string, unknown>;
  uploadedFiles: string[];
}

const SHOW_DEBUG = import.meta.env.VITE_SHOW_DEBUG === "true";

export default function Index() {
  const [state, setState] = useState<"intake" | "loading" | "results">("intake");
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [editingField, setEditingField] = useState<"role" | "team" | "scenario" | "both" | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Talent pool state (lifted up so handleSubmit can access it)
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedInternalIds, setSelectedInternalIds] = useState<string[]>(() => internalPool.map((c) => c.id));

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("bremo-theme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("bremo-theme", theme);
  }, [theme]);

  const handleSubmit = async (data: {
    role: string;
    roleInfo: Record<string, unknown>;
    team: string;
    teamInfo: Record<string, unknown>;
    scenario: string;
    scenarioInfo: Record<string, unknown>;
  }) => {
    const payload: SearchParams = {
      role: data.role,
      roleInfo: data.roleInfo,
      team: data.team,
      teamInfo: data.teamInfo,
      scenario: data.scenario,
      scenarioInfo: data.scenarioInfo,
      poolType: uploadedFiles.length > 0 ? "hybrid" : "internal",
      selectedInternalIds,
      internalCandidates: internalPool.filter((c) => selectedInternalIds.includes(c.id)).map((c) => c.fullData),
      uploadedFiles,
    };

    setSearchParams(payload);
    setState("loading");
    setError(null);
    setDebugInfo({ payloadSent: payload, rawResponse: null, validationStatus: "pending" });

    try {
      const raw = await submitIntake(payload);
      setDebugInfo((prev) => prev ? { ...prev, rawResponse: raw } : prev);

      const validated = validateSummaryResult(raw);
      setDebugInfo((prev) => prev ? { ...prev, validationStatus: "passed" } : prev);

      setSummaryResult(validated);
      setState("results");
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      const status = (err as Error & { status?: number }).status;
      setDebugInfo((prev) => prev
        ? { ...prev, validationStatus: "failed", ...(status ? { responseStatus: status } : {}) }
        : prev
      );
      setError(message);
      setState("intake");
    }
  };

  const handleEdit = () => setEditingField("both");

  const handleEditConfirm = async (role: string, team: string, scenario: string) => {
    const updated = searchParams ? { ...searchParams, role, team, scenario } : null;
    setSearchParams(updated);
    setEditingField(null);
    if (!updated) return;
    setIsRefreshing(true);
    try {
      const raw = await submitIntake(updated);
      const validated = validateSummaryResult(raw);
      setSummaryResult(validated);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unknown error occurred";
      setError(message);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleNewSearch = () => {
    setState("intake");
    setSearchParams(null);
    setSummaryResult(null);
    setError(null);
    setDebugInfo(null);
    setEditingField(null);
    setSelectedInternalIds(internalPool.map((c) => c.id));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed nav header */}
      <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md px-8 py-3.5 border-b border-border/60">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0 justify-self-start">
          <img src={logo} alt="Logo" className="h-8 w-8 shrink-0 object-contain" />
          <span className="font-headline font-bold tracking-tight text-base text-foreground">
            Bremo
          </span>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-1 w-7 h-7 flex items-center justify-center rounded border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Results: role + scenario summary */}
        {state === "results" && searchParams && (
          <div className="flex items-center gap-5 justify-self-center">
            <div className="flex items-center gap-5">
              <button
                onClick={() => setEditingField(editingField === "role" ? null : "role")}
                className="text-left group cursor-pointer"
              >
                <p className="text-xs font-label uppercase tracking-widest text-muted-foreground mb-0.5">Role</p>
                <p className={`text-sm font-medium leading-tight transition-colors max-w-[180px] truncate ${editingField === "role" ? "text-primary" : "text-foreground group-hover:text-primary/80"}`}>{searchParams.role}</p>
              </button>
              <div className="w-px h-7 bg-border/60" />
              <button
                onClick={() => setEditingField(editingField === "team" ? null : "team")}
                className="text-left group cursor-pointer"
              >
                <p className="text-xs font-label uppercase tracking-widest text-muted-foreground mb-0.5">Team</p>
                <p className={`text-sm font-medium leading-tight transition-colors max-w-[220px] truncate ${editingField === "team" ? "text-primary" : "text-foreground group-hover:text-primary/80"}`}>{searchParams.team}</p>
              </button>
              <div className="w-px h-7 bg-border/60" />
              <button
                onClick={() => setEditingField(editingField === "scenario" ? null : "scenario")}
                className="text-left group cursor-pointer"
              >
                <p className="text-xs font-label uppercase tracking-widest text-muted-foreground mb-0.5">Scenario</p>
                <p className={`text-sm font-medium leading-tight transition-colors max-w-[200px] truncate ${editingField === "scenario" ? "text-primary" : "text-foreground group-hover:text-primary/80"}`}>{searchParams.scenario}</p>
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 justify-self-end">
          {state === "results" && searchParams && (
            <>
              <button
                onClick={handleEdit}
                className={`px-3 py-1.5 text-xs font-label font-semibold uppercase tracking-wide border rounded transition-colors ${
                  editingField === "both"
                    ? "border-primary/60 text-primary bg-primary/10"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                Edit
              </button>
              <button
                onClick={handleNewSearch}
                className="px-3 py-1.5 text-xs font-label font-semibold uppercase tracking-wide bg-primary/90 text-primary-foreground rounded hover:bg-primary transition-colors"
              >
                New Search
              </button>
            </>
          )}
        </div>
        </div>
      </header>

      <AnimatePresence>
        {editingField && searchParams && (
          <EditPanel
            currentRole={searchParams.role}
            currentTeam={searchParams.team}
            currentScenario={searchParams.scenario}
            field={editingField}
            onConfirm={handleEditConfirm}
            onCancel={() => setEditingField(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {state === "intake" && (
          <motion.div
            key="intake"
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.4 }}
            className="flex pt-[57px] h-screen"
          >
            {/* Left 1/3 — form */}
            <div className="w-[360px] shrink-0 border-r border-border/60 overflow-y-auto flex flex-col">
              <div className="flex-1 px-6 py-7">
                {/* Error banner */}
                {error && (
                  <div className="mb-4 flex items-start gap-2.5 px-3.5 py-3 rounded-lg border border-danger/30 bg-danger/10">
                    <AlertCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                    <p className="text-sm text-danger leading-snug">{error}</p>
                  </div>
                )}
                <IntakeForm onSubmit={handleSubmit} isLoading={false} />
              </div>
            </div>

            {/* Right 2/3 — talent pool */}
            <div className="flex-1 overflow-y-auto bg-secondary/10">
              <TalentPoolPanel
                uploadedFiles={uploadedFiles}
                onFilesChange={setUploadedFiles}
                selectedInternalIds={selectedInternalIds}
                onSelectedInternalIdsChange={setSelectedInternalIds}
              />
            </div>
          </motion.div>
        )}

        {state === "loading" && <LoadingScreen key="loading" />}

        {state === "results" && summaryResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="pt-20 relative"
          >
            <ResultsView summaryResult={summaryResult} />

            <AnimatePresence>
              {isRefreshing && (
                <motion.div
                  key="reloading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-x-0 bottom-0 top-[57px] bg-background z-30 flex flex-col items-center justify-center gap-6"
                >
                  <div className="flex flex-col items-center gap-4">
                    <svg className="animate-spin w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <div className="text-center">
                      <p className="text-sm font-headline font-semibold text-foreground mb-1">Re-analyzing candidates</p>
                      {searchParams && (
                        <p className="text-sm text-muted-foreground">
                          {searchParams.role} · {searchParams.scenario}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs font-label uppercase tracking-widest text-muted-foreground">
                    Powered by AI Evaluation Agents
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Debug panel — only shown when VITE_SHOW_DEBUG=true */}
      {SHOW_DEBUG && debugInfo && (
        <div className="fixed bottom-4 right-4 z-50 w-[420px] max-h-[70vh] overflow-y-auto rounded-lg border border-border bg-background/98 shadow-xl text-xs font-mono">
          <div className="sticky top-0 bg-background/98 border-b border-border px-4 py-2.5 flex items-center justify-between">
            <span className="font-bold text-foreground text-[11px] uppercase tracking-widest">Debug Panel</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">State:</span>
              <span className="text-foreground">{state}</span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Validation:</span>
              <span className={
                debugInfo.validationStatus === "passed"
                  ? "text-green-500"
                  : debugInfo.validationStatus === "failed"
                    ? "text-red-500"
                    : "text-yellow-500"
              }>
                {debugInfo.validationStatus}
              </span>
            </div>
            {debugInfo.responseStatus !== undefined && (
              <div>
                <span className="text-muted-foreground">HTTP Status: </span>
                <span className="text-foreground">{debugInfo.responseStatus}</span>
              </div>
            )}
            {error && (
              <div>
                <span className="text-muted-foreground block mb-1">Error:</span>
                <span className="text-red-400 break-all">{error}</span>
              </div>
            )}
            <div>
              <span className="text-muted-foreground block mb-1">Payload Sent:</span>
              <pre className="text-foreground/70 whitespace-pre-wrap break-all bg-secondary/50 p-2 rounded text-[10px] leading-relaxed">
                {JSON.stringify(debugInfo.payloadSent, null, 2)}
              </pre>
            </div>
            {debugInfo.rawResponse !== null && (
              <div>
                <span className="text-muted-foreground block mb-1">Raw Response:</span>
                <pre className="text-foreground/70 whitespace-pre-wrap break-all bg-secondary/50 p-2 rounded text-[10px] leading-relaxed">
                  {JSON.stringify(debugInfo.rawResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
