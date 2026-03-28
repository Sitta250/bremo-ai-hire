import { useState, useRef } from "react";
import { Upload, X, FileText } from "lucide-react";
import { motion } from "framer-motion";
import ThemeSelect from "@/components/ThemeSelect";
import { j01Data, j02Data, j03Data } from "@/data/job_desc";
import { S01Data, S02Data, S03Data, S04Data, S05Data } from "@/data/scenarios";

const JOB_ROLES = [j01Data, j02Data, j03Data].map((j) => ({ id: j.job_id, title: j.title }));
const SCENARIOS = [S01Data, S02Data, S03Data, S04Data, S05Data].map((s) => ({ id: s.scenario_id, name: s.scenario_name }));

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
  currentScenario: string;
  onConfirm: (role: string, scenario: string) => void;
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
    <div className="flex items-center justify-between bg-primary/10 border border-primary/20 rounded-xl px-3 py-2.5">
      <div className="flex items-center gap-2 min-w-0">
        <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="text-xs font-label font-bold text-primary truncate">{fileName}</span>
      </div>
      <button onClick={onClear} className="text-muted-foreground hover:text-danger ml-2 shrink-0">
        <X className="w-3 h-3" />
      </button>
    </div>
  ) : (
    <div
      onClick={() => ref.current?.click()}
      className="border border-dashed border-border/40 rounded-xl px-3 py-2.5 flex items-center gap-2 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group"
    >
      <Upload className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
      <p className="text-[10px] font-label uppercase tracking-widest font-bold text-muted-foreground">
        Upload .txt or .json
      </p>
      <input ref={ref} type="file" accept={accept} onChange={onFile} className="hidden" />
    </div>
  );
}

export default function EditPanel({ currentRole, currentScenario, onConfirm, onCancel }: EditPanelProps) {
  // Role state
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const [customRole, setCustomRole] = useState("");
  const [roleFileName, setRoleFileName] = useState("");

  // Scenario state
  const [selectedScenario, setSelectedScenario] = useState(currentScenario);
  const [customScenario, setCustomScenario] = useState("");
  const [scenarioFileName, setScenarioFileName] = useState("");

  const activeRole = customRole || selectedRole;
  const activeScenario = customScenario || selectedScenario;
  const canConfirm = activeRole && activeScenario;

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
      className="fixed top-[65px] left-0 w-full z-40 bg-background/95 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/30"
    >
      <div className="max-w-6xl mx-auto px-8 py-6">
        <div className="grid grid-cols-2 gap-8 mb-5">

          {/* Role */}
          <div>
            <p className="text-[9px] font-label uppercase tracking-widest text-muted-foreground/60 mb-3">Role</p>
            <ThemeSelect
              options={JOB_ROLES.map((r) => ({ value: r.title, label: r.title }))}
              value={selectedRole}
              onChange={(val) => { setSelectedRole(val); setCustomRole(""); setRoleFileName(""); }}
              placeholder="Select a preset role…"
              disabled={!!customRole}
            />
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-border/40" />
              <span className="text-[9px] font-label uppercase tracking-wider text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            <input
              type="text"
              value={customRole}
              onChange={(e) => { setCustomRole(e.target.value); if (e.target.value) { setSelectedRole(""); setRoleFileName(""); } }}
              placeholder="e.g., Head of battery cell manufacturing"
              className="w-full bg-secondary text-foreground rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all mb-3"
            />
            <FieldUpload
              fileName={roleFileName}
              onFile={handleRoleFile}
              onClear={clearRoleFile}
              accept=".txt,.json"
            />
          </div>

          {/* Scenario */}
          <div>
            <p className="text-[9px] font-label uppercase tracking-widest text-muted-foreground/60 mb-3">Scenario</p>
            <ThemeSelect
              options={SCENARIOS.map((s) => ({ value: s.name, label: s.name }))}
              value={selectedScenario}
              onChange={(val) => { setSelectedScenario(val); setCustomScenario(""); setScenarioFileName(""); }}
              placeholder="Select a scenario…"
              disabled={!!customScenario}
            />
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-border/40" />
              <span className="text-[9px] font-label uppercase tracking-wider text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border/40" />
            </div>
            <input
              type="text"
              value={customScenario}
              onChange={(e) => { setCustomScenario(e.target.value); if (e.target.value) { setSelectedScenario(""); setScenarioFileName(""); } }}
              placeholder="e.g., Sudden CEO departure with negative PR impact"
              className="w-full bg-secondary text-foreground rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all mb-3"
            />
            <FieldUpload
              fileName={scenarioFileName}
              onFile={handleScenarioFile}
              onClear={clearScenarioFile}
              accept=".txt,.json"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-white/5 pt-4">
          <button
            onClick={onCancel}
            className="px-5 py-2 text-[10px] font-label font-bold uppercase tracking-wider border border-border rounded-lg text-foreground hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => canConfirm && onConfirm(activeRole, activeScenario)}
            disabled={!canConfirm}
            className={`px-6 py-2 text-[10px] font-label font-bold uppercase tracking-wider rounded-lg transition-colors ${
              canConfirm
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </motion.div>
  );
}
