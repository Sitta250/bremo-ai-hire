import { useState, useRef } from "react";
import { ChevronDown, Upload, X, Sparkles } from "lucide-react";
import { PRESET_ROLES, SCENARIOS } from "@/data/mockData";
import { motion } from "framer-motion";

interface IntakeFormProps {
  onSubmit: (data: {
    role: string;
    poolType: "internal" | "hybrid";
    scenario: string;
    uploadedFiles: string[];
  }) => void;
  isLoading: boolean;
}

export default function IntakeForm({ onSubmit, isLoading }: IntakeFormProps) {
  const [selectedRole, setSelectedRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [poolType, setPoolType] = useState<"internal" | "hybrid">("internal");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [selectedScenario, setSelectedScenario] = useState("");
  const [customScenario, setCustomScenario] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeRole = customRole || selectedRole;
  const activeScenario = customScenario || selectedScenario;
  const canSubmit = activeRole && activeScenario && !isLoading;

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setCustomRole("");
    setDropdownOpen(false);
  };

  const handleCustomRoleChange = (val: string) => {
    setCustomRole(val);
    if (val) setSelectedRole("");
  };

  const handleScenarioSelect = (scenario: string) => {
    setSelectedScenario(scenario);
    setCustomScenario("");
  };

  const handleCustomScenarioChange = (val: string) => {
    setCustomScenario(val);
    if (val) setSelectedScenario("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files.map((f) => f.name)]);
  };

  const removeFile = (name: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f !== name));
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      role: activeRole,
      poolType,
      scenario: activeScenario,
      uploadedFiles,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto px-6"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
              <rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity="0.6" />
              <rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity="0.6" />
              <rect x="9" y="9" width="5" height="5" rx="1" fill="white" opacity="0.3" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-wide text-foreground">
            BR<span className="text-primary">E</span>MO
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3 tracking-tight">
          Bremo Intelligence
        </h1>
        <p className="text-muted-foreground text-lg">
          AI-powered leadership hiring decisions for high-stakes transitions.
        </p>
      </div>

      {/* Form Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Role Selection */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-primary text-lg">👤</span>
            <h2 className="font-semibold text-foreground tracking-wide text-sm uppercase">Role Selection</h2>
          </div>

          {/* Dropdown */}
          <div className="relative mb-4">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between bg-secondary text-secondary-foreground rounded-md px-4 py-3 text-sm hover:bg-card-hover transition-colors"
            >
              <span className={selectedRole ? "text-foreground" : "text-muted-foreground"}>
                {selectedRole || "Select a preset role…"}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
            {dropdownOpen && (
              <div className="absolute z-20 mt-1 w-full bg-card border border-border rounded-md shadow-xl overflow-hidden">
                {PRESET_ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
              Or describe the role in your own words
            </label>
            <input
              type="text"
              value={customRole}
              onChange={(e) => handleCustomRoleChange(e.target.value)}
              placeholder="e.g., 'Head of battery cell manufacturing'"
              className="w-full bg-secondary text-foreground rounded-md px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Describe the responsibilities, seniority level, and team context.
          </p>
        </div>

        {/* Candidate Pool */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-primary text-lg">👥</span>
            <h2 className="font-semibold text-foreground tracking-wide text-sm uppercase">Candidate Pool</h2>
          </div>

          <div className="flex rounded-md overflow-hidden mb-4">
            <button
              onClick={() => setPoolType("internal")}
              className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                poolType === "internal"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Internal
            </button>
            <button
              onClick={() => setPoolType("hybrid")}
              className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                poolType === "hybrid"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Hybrid
            </button>
          </div>

          {poolType === "internal" ? (
            <p className="text-sm text-muted-foreground">
              We'll evaluate from the internal candidate database.
            </p>
          ) : (
            <div>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-border rounded-md p-6 text-center cursor-pointer hover:border-muted-foreground transition-colors"
              >
                <Upload className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Drop external JSON profiles
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              {uploadedFiles.length > 0 && (
                <div className="mt-3 space-y-1">
                  {uploadedFiles.map((f) => (
                    <div key={f} className="flex items-center justify-between bg-secondary rounded px-3 py-1.5 text-xs text-foreground">
                      <span>{f}</span>
                      <button onClick={() => removeFile(f)} className="text-muted-foreground hover:text-danger">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                External candidates are uploaded as structured JSON profiles.
              </p>
            </div>
          )}
        </div>

        {/* Business Scenario — full width */}
        <div className="bg-card rounded-lg border border-border p-6 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-primary text-lg">⚡</span>
            <h2 className="font-semibold text-foreground tracking-wide text-sm uppercase">Strategic Scenario</h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {SCENARIOS.map((s) => (
              <button
                key={s}
                onClick={() => handleScenarioSelect(s)}
                className={`px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors ${
                  selectedScenario === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground uppercase">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
            Or describe a custom scenario
          </label>
          <input
            type="text"
            value={customScenario}
            onChange={(e) => handleCustomScenarioChange(e.target.value)}
            placeholder="e.g., 'Sudden CEO departure with negative PR impact'"
            className="w-full bg-secondary text-foreground rounded-md px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <p className="text-xs text-muted-foreground mt-2">
            The scenario changes how candidates are evaluated — different crises need different leaders.
          </p>
        </div>
      </div>

      {/* Submit */}
      <div className="text-center mb-8">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={`inline-flex items-center gap-2 px-10 py-4 rounded-lg text-base font-semibold transition-all ${
            canSubmit
              ? "bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/25"
              : "bg-secondary text-muted-foreground cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing candidates…
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Find Best Match
            </>
          )}
        </button>
        <p className="text-xs text-muted-foreground mt-3 uppercase tracking-wider">
          ⚙ Powered by 8 AI evaluation agents
        </p>
      </div>
    </motion.div>
  );
}
