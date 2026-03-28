import { useState, useRef } from "react";
import { Upload, X, Plus, FileText } from "lucide-react";
import { j01Data, j02Data, j03Data } from "@/data/job_desc";
import { S01Data, S02Data, S03Data, S04Data, S05Data } from "@/data/scenarios";
import { motion } from "framer-motion";
import ThemeSelect from "@/components/ThemeSelect";

const JOB_ROLES = [j01Data, j02Data, j03Data].map((j) => ({ id: j.job_id, title: j.title }));
const SCENARIOS = [S01Data, S02Data, S03Data, S04Data, S05Data].map((s) => ({ id: s.scenario_id, name: s.scenario_name }));

interface IntakeFormProps {
  onSubmit: (data: {
    role: string;
    poolType: "internal" | "hybrid";
    scenario: string;
    uploadedFiles: string[];
  }) => void;
  isLoading: boolean;
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export default function IntakeForm({ onSubmit, isLoading }: IntakeFormProps) {
  // Role
  const [selectedRole, setSelectedRole] = useState(JOB_ROLES[0].title);
  const [customRole, setCustomRole] = useState("");
  const [roleFileName, setRoleFileName] = useState("");
  const roleFileRef = useRef<HTMLInputElement>(null);

  // Pool
  const [poolType, setPoolType] = useState<"internal" | "hybrid">("internal");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const poolFileRef = useRef<HTMLInputElement>(null);

  // Scenario
  const [selectedScenario, setSelectedScenario] = useState("");
  const [customScenario, setCustomScenario] = useState("");
  const [scenarioFileName, setScenarioFileName] = useState("");
  const scenarioFileRef = useRef<HTMLInputElement>(null);

  const activeRole = customRole || selectedRole;
  const activeScenario = customScenario || selectedScenario;
  const canSubmit = activeRole && activeScenario && !isLoading;

  // Role handlers
  const handleCustomRoleChange = (val: string) => {
    setCustomRole(val);
    if (val) { setSelectedRole(""); setRoleFileName(""); }
  };

  const handleRoleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await readFileAsText(file);
    const content = file.name.endsWith(".json")
      ? (() => { try { const j = JSON.parse(text); return j.role ?? j.title ?? text; } catch { return text; } })()
      : text;
    setCustomRole(content.trim());
    setRoleFileName(file.name);
    setSelectedRole("");
    e.target.value = "";
  };

  const clearRoleFile = () => {
    setCustomRole("");
    setRoleFileName("");
    setSelectedRole(JOB_ROLES[0].title);
  };

  // Scenario handlers
  const handleCustomScenarioChange = (val: string) => {
    setCustomScenario(val);
    if (val) { setSelectedScenario(""); setScenarioFileName(""); }
  };

  const handleScenarioFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await readFileAsText(file);
    const content = file.name.endsWith(".json")
      ? (() => { try { const j = JSON.parse(text); return j.scenario ?? j.description ?? text; } catch { return text; } })()
      : text;
    setCustomScenario(content.trim());
    setScenarioFileName(file.name);
    setSelectedScenario("");
    e.target.value = "";
  };

  const clearScenarioFile = () => {
    setCustomScenario("");
    setScenarioFileName("");
  };

  // Pool handlers
  const handlePoolFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files.map((f) => f.name)]);
  };

  const removePoolFile = (name: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f !== name));
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ role: activeRole, poolType, scenario: activeScenario, uploadedFiles });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[650px] mx-auto px-6"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
          Bremo Intelligence
        </h1>
        <p className="font-sans text-lg text-muted-foreground font-light max-w-xl mx-auto">
          AI-powered leadership hiring decisions for high-stakes transitions.
        </p>
      </div>

      <div className="flex flex-col gap-6 mb-10">

        {/* Role Selection */}
        <div className="bg-card rounded-2xl border border-border/40 p-8">
          <div className="flex items-center gap-3 mb-6">
            <svg className="text-primary w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
            </svg>
            <h2 className="font-headline font-bold text-base text-foreground">Role Selection</h2>
          </div>

          {/* Preset dropdown — dimmed when custom input is active */}
          <ThemeSelect
            options={JOB_ROLES.map((r) => ({ value: r.title, label: r.title }))}
            value={selectedRole}
            onChange={(val) => { setSelectedRole(val); setCustomRole(""); setRoleFileName(""); }}
            placeholder="Select a preset role…"
            disabled={!!customRole}
          />

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-[10px] font-label uppercase tracking-wider text-muted-foreground">or describe your own</span>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          {/* Custom text input */}
          <input
            type="text"
            value={customRole}
            onChange={(e) => handleCustomRoleChange(e.target.value)}
            placeholder="e.g., Head of battery cell manufacturing"
            className="w-full bg-secondary text-foreground rounded-xl px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all mb-3"
          />

          {/* File upload */}
          {roleFileName ? (
            <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs font-label font-bold text-primary truncate">{roleFileName}</span>
              </div>
              <button onClick={clearRoleFile} className="text-muted-foreground hover:text-danger ml-2 shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => roleFileRef.current?.click()}
              className="border border-dashed border-border/40 rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <Upload className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              <p className="text-[10px] font-label uppercase tracking-widest font-bold text-muted-foreground">
                Upload .txt or .json
              </p>
              <input ref={roleFileRef} type="file" accept=".txt,.json" onChange={handleRoleFile} className="hidden" />
            </div>
          )}
        </div>

        {/* Candidate Pool */}
        <div className="bg-card rounded-2xl border border-border/40 p-8">
          <div className="flex items-center gap-3 mb-6">
            <svg className="text-primary w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <h2 className="font-headline font-bold text-base text-foreground">Candidate Pool</h2>
          </div>

          <div className="flex gap-1.5 p-1.5 bg-secondary rounded-xl mb-6">
            <button
              onClick={() => setPoolType("internal")}
              className={`flex-1 py-2.5 text-[10px] font-label uppercase font-bold tracking-wider rounded-lg transition-all ${
                poolType === "internal" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Internal
            </button>
            <button
              onClick={() => setPoolType("hybrid")}
              className={`flex-1 py-2.5 text-[10px] font-label uppercase font-bold tracking-wider rounded-lg transition-all ${
                poolType === "hybrid" ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Hybrid
            </button>
          </div>

          <div
            onClick={() => poolFileRef.current?.click()}
            className="border-2 border-dashed border-border/50 rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
          >
            <Upload className="w-6 h-6 mx-auto mb-3 text-muted-foreground group-hover:text-primary transition-colors" />
            <p className="text-[10px] font-label uppercase tracking-widest font-bold text-muted-foreground">
              Drop External JSON Profiles
            </p>
            <input ref={poolFileRef} type="file" accept=".json" multiple onChange={handlePoolFileChange} className="hidden" />
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-3 space-y-1">
              {uploadedFiles.map((f) => (
                <div key={f} className="flex items-center justify-between bg-secondary rounded-lg px-3 py-1.5 text-xs text-foreground">
                  <span>{f}</span>
                  <button onClick={() => removePoolFile(f)} className="text-muted-foreground hover:text-danger ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Strategic Scenario */}
        <div className="bg-card rounded-2xl border border-border/40 p-8">
          <div className="flex items-center gap-3 mb-6">
            <svg className="text-primary w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <h2 className="font-headline font-bold text-base text-foreground">Strategic Scenario</h2>
          </div>

          {/* Preset dropdown */}
          <ThemeSelect
            options={SCENARIOS.map((s) => ({ value: s.name, label: s.name }))}
            value={selectedScenario}
            onChange={(val) => { setSelectedScenario(val); setCustomScenario(""); setScenarioFileName(""); }}
            placeholder="Select a scenario…"
            disabled={!!customScenario}
          />

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-[10px] font-label uppercase tracking-wider text-muted-foreground">or describe your own</span>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          {/* Custom text input */}
          <input
            type="text"
            value={customScenario}
            onChange={(e) => handleCustomScenarioChange(e.target.value)}
            placeholder="e.g., Sudden CEO departure with negative PR impact"
            className="w-full bg-secondary text-foreground rounded-xl px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all mb-3"
          />

          {/* File upload */}
          {scenarioFileName ? (
            <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs font-label font-bold text-primary truncate">{scenarioFileName}</span>
              </div>
              <button onClick={clearScenarioFile} className="text-muted-foreground hover:text-danger ml-2 shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => scenarioFileRef.current?.click()}
              className="border border-dashed border-border/40 rounded-xl px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group"
            >
              <Upload className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              <p className="text-[10px] font-label uppercase tracking-widest font-bold text-muted-foreground">
                Upload .txt or .json
              </p>
              <input ref={scenarioFileRef} type="file" accept=".txt,.json" onChange={handleScenarioFile} className="hidden" />
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="text-center mb-8">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`inline-flex items-center gap-2 px-10 py-4 rounded-xl text-sm font-label font-bold uppercase tracking-wider transition-all ${
            canSubmit
              ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25"
              : "bg-secondary text-muted-foreground cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing candidates…
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Find Best Match
            </>
          )}
        </button>
        <p className="mt-4 text-[10px] font-label uppercase tracking-widest text-muted-foreground/50">
          Powered by AI Evaluation Agents
        </p>
      </div>
    </motion.div>
  );
}
