import { useState, useRef } from "react";
import { Upload, X, Plus, FileText } from "lucide-react";
import { motion } from "framer-motion";
import ThemeSelect from "@/components/ThemeSelect";

type JobDescData = { job_id: string; title: string } & Record<string, unknown>;
type ScenarioData = { scenario_id: string; scenario_name: string } & Record<string, unknown>;
type TeamData = { team_profile_id: string; team_name: string } & Record<string, unknown>;

const JOB_MODULES = import.meta.glob("../data/job_desc/j*.ts", { eager: true }) as Record<string, { default: JobDescData }>;
const SCENARIO_MODULES = import.meta.glob("../data/scenarios/S*.ts", { eager: true }) as Record<string, { default: ScenarioData }>;
const TEAM_MODULES = import.meta.glob("../data/teams/t*.ts", { eager: true }) as Record<
  string,
  { default: TeamData }
>;
const JOB_ROLES = Object.values(JOB_MODULES)
  .map((module) => module.default)
  .sort((a, b) => a.title.localeCompare(b.title));
const SCENARIOS = Object.values(SCENARIO_MODULES)
  .map((module) => module.default)
  .sort((a, b) => a.scenario_name.localeCompare(b.scenario_name));
const TEAMS = Object.values(TEAM_MODULES)
  .map((module) => module.default)
  .sort((a, b) => a.team_name.localeCompare(b.team_name));

interface IntakeFormProps {
  onSubmit: (data: {
    role: string;
    roleInfo: Record<string, unknown>;
    team: string;
    teamInfo: Record<string, unknown>;
    scenario: string;
    scenarioInfo: Record<string, unknown>;
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
  const [selectedRoleId, setSelectedRoleId] = useState(JOB_ROLES[0]?.job_id ?? "");
  const [customRole, setCustomRole] = useState("");
  const [roleFileName, setRoleFileName] = useState("");
  const roleFileRef = useRef<HTMLInputElement>(null);

  // Scenario
  const [selectedScenarioId, setSelectedScenarioId] = useState("");
  const [customScenario, setCustomScenario] = useState("");
  const [scenarioFileName, setScenarioFileName] = useState("");
  const scenarioFileRef = useRef<HTMLInputElement>(null);

  // Team
  const [selectedTeamId, setSelectedTeamId] = useState(TEAMS[0]?.team_profile_id ?? "");

  const selectedRole = JOB_ROLES.find((role) => role.job_id === selectedRoleId) ?? null;
  const selectedScenario = SCENARIOS.find((scenario) => scenario.scenario_id === selectedScenarioId) ?? null;
  const selectedTeam = TEAMS.find((team) => team.team_profile_id === selectedTeamId) ?? null;

  const activeRole = customRole || selectedRole?.title || "";
  const activeScenario = customScenario || selectedScenario?.scenario_name || "";
  const activeTeam = selectedTeam?.team_name || "";
  const canSubmit = activeRole && activeTeam && activeScenario && !isLoading;

  // Role handlers
  const handleCustomRoleChange = (val: string) => {
    setCustomRole(val);
    if (val) { setSelectedRoleId(""); setRoleFileName(""); }
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
    setSelectedRoleId("");
    e.target.value = "";
  };

  const clearRoleFile = () => {
    setCustomRole("");
    setRoleFileName("");
    setSelectedRoleId(JOB_ROLES[0]?.job_id ?? "");
  };

  // Scenario handlers
  const handleCustomScenarioChange = (val: string) => {
    setCustomScenario(val);
    if (val) { setSelectedScenarioId(""); setScenarioFileName(""); }
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
    setSelectedScenarioId("");
    e.target.value = "";
  };

  const clearScenarioFile = () => {
    setCustomScenario("");
    setScenarioFileName("");
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      role: activeRole,
      roleInfo: selectedRole
        ? selectedRole
        : { source: roleFileName ? "uploaded" : "custom", content: activeRole, fileName: roleFileName || null },
      team: activeTeam,
      teamInfo: selectedTeam ?? { source: "unknown", content: activeTeam },
      scenario: activeScenario,
      scenarioInfo: selectedScenario
        ? selectedScenario
        : { source: scenarioFileName ? "uploaded" : "custom", content: activeScenario, fileName: scenarioFileName || null },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Header */}
      <div className="mb-5">
        <h1 className="font-headline text-2xl font-bold tracking-tight text-foreground mb-1">
          Strategic Setup
        </h1>
      </div>

      <div className="flex flex-col gap-3 mb-5">

        {/* Role Selection */}
        <div className="bg-card rounded-lg border border-border/50 p-4">
          <div className="flex items-center gap-2.5 mb-4">
            <svg className="text-primary/70 w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
            </svg>
            <h2 className="font-label font-semibold text-sm text-foreground/90">Role Selection</h2>
          </div>

          <ThemeSelect
            options={JOB_ROLES.map((role) => ({ value: role.job_id, label: role.title }))}
            value={selectedRoleId}
            onChange={(val) => { setSelectedRoleId(val); setCustomRole(""); setRoleFileName(""); }}
            placeholder="Select a preset role…"
            disabled={!!customRole}
          />

          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-[10px] font-label text-muted-foreground">or describe your own</span>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          <input
            type="text"
            value={customRole}
            onChange={(e) => handleCustomRoleChange(e.target.value)}
            placeholder="e.g., Head of battery cell manufacturing"
            className="w-full bg-secondary/60 text-foreground rounded px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/70 border border-border/40 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/40 transition-all mb-3"
          />

          {roleFileName ? (
            <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded px-3 py-2">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                <span className="text-xs text-primary/80 truncate">{roleFileName}</span>
              </div>
              <button onClick={clearRoleFile} className="text-muted-foreground hover:text-danger ml-2 shrink-0">
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => roleFileRef.current?.click()}
              className="border border-dashed border-border/40 rounded px-3 py-2 flex items-center gap-2.5 cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all group"
            >
              <Upload className="w-3.5 h-3.5 text-muted-foreground/70 group-hover:text-primary/80 transition-colors shrink-0" />
              <p className="text-xs font-label uppercase tracking-widest text-muted-foreground">
                Upload .txt or .json
              </p>
              <input ref={roleFileRef} type="file" accept=".txt,.json" onChange={handleRoleFile} className="hidden" />
            </div>
          )}
        </div>

        {/* Strategic Scenario */}
        <div className="bg-card rounded-lg border border-border/50 p-4">
          <div className="flex items-center gap-2.5 mb-4">
            <svg className="text-primary/70 w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <h2 className="font-label font-semibold text-sm text-foreground/90">Hiring Team</h2>
          </div>

          <ThemeSelect
            options={TEAMS.map((team) => ({ value: team.team_profile_id, label: team.team_name }))}
            value={selectedTeamId}
            onChange={setSelectedTeamId}
            placeholder="Select a team…"
          />

          <p className="text-xs text-muted-foreground">
            Choose the team this role will join. You can also search inside the dropdown.
          </p>
        </div>

        {/* Strategic Scenario */}
        <div className="bg-card rounded-lg border border-border/50 p-4">
          <div className="flex items-center gap-2.5 mb-4">
            <svg className="text-primary/70 w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <h2 className="font-label font-semibold text-sm text-foreground/90">Strategic Scenario</h2>
          </div>

          <ThemeSelect
            options={SCENARIOS.map((scenario) => ({ value: scenario.scenario_id, label: scenario.scenario_name }))}
            value={selectedScenarioId}
            onChange={(val) => { setSelectedScenarioId(val); setCustomScenario(""); setScenarioFileName(""); }}
            placeholder="Select a scenario…"
            disabled={!!customScenario}
          />

          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-border/40" />
            <span className="text-[10px] font-label text-muted-foreground">or describe your own</span>
            <div className="flex-1 h-px bg-border/40" />
          </div>

          <input
            type="text"
            value={customScenario}
            onChange={(e) => handleCustomScenarioChange(e.target.value)}
            placeholder="e.g., Sudden CEO departure with negative PR impact"
            className="w-full bg-secondary/60 text-foreground rounded px-3.5 py-2.5 text-sm placeholder:text-muted-foreground/70 border border-border/40 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/40 transition-all mb-3"
          />

          {scenarioFileName ? (
            <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded px-3 py-2">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                <span className="text-xs text-primary/80 truncate">{scenarioFileName}</span>
              </div>
              <button onClick={clearScenarioFile} className="text-muted-foreground hover:text-danger ml-2 shrink-0">
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => scenarioFileRef.current?.click()}
              className="border border-dashed border-border/40 rounded px-3 py-2 flex items-center gap-2.5 cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all group"
            >
              <Upload className="w-3.5 h-3.5 text-muted-foreground/70 group-hover:text-primary/80 transition-colors shrink-0" />
              <p className="text-xs font-label uppercase tracking-widest text-muted-foreground">
                Upload .txt or .json
              </p>
              <input ref={scenarioFileRef} type="file" accept=".txt,.json" onChange={handleScenarioFile} className="hidden" />
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded text-sm font-label font-semibold uppercase tracking-wide transition-all ${
          canSubmit
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-secondary text-muted-foreground cursor-not-allowed border border-border/40"
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
            Run Analysis
          </>
        )}
      </button>
    </motion.div>
  );
}
