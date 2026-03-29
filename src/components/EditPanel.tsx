import { useState, useRef, useEffect } from "react";
import { Upload, X, FileText } from "lucide-react";
import { motion } from "framer-motion";
import ThemeSelect from "@/components/ThemeSelect";
type JobDescData = { job_id: string; title: string };
type ScenarioData = { scenario_id: string; scenario_name: string };
type TeamData = { team_profile_id: string; team_name: string };

const JOB_MODULES = import.meta.glob("../data/job_desc/j*.ts", { eager: true }) as Record<string, { default: JobDescData }>;
const SCENARIO_MODULES = import.meta.glob("../data/scenarios/S*.ts", { eager: true }) as Record<string, { default: ScenarioData }>;
const TEAM_MODULES = import.meta.glob("../data/teams/t*.ts", { eager: true }) as Record<string, { default: TeamData }>;
const JOB_ROLES = Object.values(JOB_MODULES).map((m) => m.default).sort((a, b) => a.title.localeCompare(b.title));
const SCENARIOS = Object.values(SCENARIO_MODULES).map((m) => m.default).sort((a, b) => a.scenario_name.localeCompare(b.scenario_name));
const TEAMS = Object.values(TEAM_MODULES).map((m) => m.default).sort((a, b) => a.team_name.localeCompare(b.team_name));

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

interface EditPanelProps {
  currentRole: string;
  currentTeam: string;
  currentScenario: string;
  field: "role" | "team" | "scenario" | "both";
  onConfirm: (role: string, team: string, scenario: string) => void;
  onCancel: () => void;
}

function FieldUpload({
  fileName,
  onFile,
  onClear,
  accept,
}: {
  fileName: string;
  onFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  accept: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return fileName ? (
    <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded px-3 py-2">
      <div className="flex items-center gap-2 min-w-0">
        <FileText className="w-3 h-3 text-primary/70 shrink-0" />
        <span className="text-xs text-primary/80 truncate">{fileName}</span>
      </div>
      <button onClick={onClear} className="text-muted-foreground hover:text-danger ml-2 shrink-0">
        <X className="w-3 h-3" />
      </button>
    </div>
  ) : (
    <div
      onClick={() => ref.current?.click()}
      className="border border-dashed border-border/40 rounded px-3 py-2 flex items-center gap-2 cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all group"
    >
      <Upload className="w-3 h-3 text-muted-foreground/70 group-hover:text-primary/80 transition-colors shrink-0" />
      <p className="text-xs font-label uppercase tracking-widest text-muted-foreground">
        Upload .txt or .json
      </p>
      <input ref={ref} type="file" accept={accept} onChange={onFile} className="hidden" />
    </div>
  );
}

export default function EditPanel({ currentRole, currentTeam, currentScenario, field, onConfirm, onCancel }: EditPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const showRole = field === "role" || field === "both";
  const showTeam = field === "team" || field === "both";
  const showScenario = field === "scenario" || field === "both";
  // Role state
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [customRole, setCustomRole] = useState("");
  const [roleFileName, setRoleFileName] = useState("");

  // Team state
  const [selectedTeam, setSelectedTeam] = useState(currentTeam);

  // Scenario state
  const [selectedScenario, setSelectedScenario] = useState(currentScenario);
  const [customScenario, setCustomScenario] = useState("");
  const [scenarioFileName, setScenarioFileName] = useState("");

  const activeRole = customRole || selectedRole;
  const activeTeam = selectedTeam;
  const activeScenario = customScenario || selectedScenario;
  const canConfirm = (!showRole || activeRole) && (!showTeam || activeTeam) && (!showScenario || activeScenario);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onCancel();
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [onCancel]);

  // Role handlers
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

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="fixed top-[57px] left-0 w-full z-40 bg-background border-b border-border/60 shadow-md shadow-foreground/8"
    >
      <div ref={panelRef} className="max-w-6xl mx-auto px-8 py-6">
        <div className={`grid gap-8 mb-5 ${field === "both" ? "grid-cols-3" : "grid-cols-1 max-w-sm"}`}>

          {/* Role */}
          {showRole && <div>
            <p className="text-xs font-label uppercase tracking-widest text-muted-foreground mb-3">Role</p>
            <ThemeSelect
              options={JOB_ROLES.map((r) => ({ value: r.title, label: r.title }))}
              value={selectedRole}
              onChange={(val) => { setSelectedRole(val); setCustomRole(""); setRoleFileName(""); }}
              placeholder="Select a preset role…"
              disabled={!!customRole}
            />
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-border/40" />
              <span className="text-xs font-label text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            <input
              type="text"
              value={customRole}
              onChange={(e) => { setCustomRole(e.target.value); if (e.target.value) { setSelectedRole(""); setRoleFileName(""); } }}
              placeholder="e.g., Head of battery cell manufacturing"
              className="w-full bg-secondary/60 text-foreground rounded px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/70 border border-border/40 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/40 transition-all mb-3"
            />
            <FieldUpload
              fileName={roleFileName}
              onFile={handleRoleFile}
              onClear={clearRoleFile}
              accept=".txt,.json"
            />
          </div>}

          {/* Team */}
          {showTeam && <div>
            <p className="text-xs font-label uppercase tracking-widest text-muted-foreground mb-3">Team</p>
            <ThemeSelect
              options={TEAMS.map((team) => ({ value: team.team_name, label: team.team_name }))}
              value={selectedTeam}
              onChange={setSelectedTeam}
              placeholder="Select a team…"
            />
          </div>}

          {/* Scenario */}
          {showScenario && <div>
            <p className="text-xs font-label uppercase tracking-widest text-muted-foreground mb-3">Scenario</p>
            <ThemeSelect
              options={SCENARIOS.map((s) => ({ value: s.scenario_name, label: s.scenario_name }))}
              value={selectedScenario}
              onChange={(val) => { setSelectedScenario(val); setCustomScenario(""); setScenarioFileName(""); }}
              placeholder="Select a scenario…"
              disabled={!!customScenario}
            />
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-border/40" />
              <span className="text-xs font-label text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            <input
              type="text"
              value={customScenario}
              onChange={(e) => { setCustomScenario(e.target.value); if (e.target.value) { setSelectedScenario(""); setScenarioFileName(""); } }}
              placeholder="e.g., Sudden CEO departure with negative PR impact"
              className="w-full bg-secondary/60 text-foreground rounded px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/70 border border-border/40 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/40 transition-all mb-3"
            />
            <FieldUpload
              fileName={scenarioFileName}
              onFile={handleScenarioFile}
              onClear={clearScenarioFile}
              accept=".txt,.json"
            />
          </div>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 border-t border-border/40 pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-label font-semibold uppercase tracking-wide border border-border/50 rounded text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => canConfirm && onConfirm(
              showRole ? activeRole : currentRole,
              showTeam ? activeTeam : currentTeam,
              showScenario ? activeScenario : currentScenario
            )}
            disabled={!canConfirm}
            className={`px-5 py-2 text-xs font-label font-semibold uppercase tracking-wide rounded transition-colors ${
              canConfirm
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-secondary text-muted-foreground cursor-not-allowed border border-border/40"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </motion.div>
  );
}
