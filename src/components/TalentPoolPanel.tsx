import { useState, useRef } from "react";
import { Search, Upload, X } from "lucide-react";
import { internalPool } from "@/data/mockData";
import type { InternalPoolEntry } from "@/data/mockData";

function InitialsAvatar({ name }: { name: string }) {
  const clean = name.replace(/^Dr\.\s*/i, "").trim().split(" ");
  const initials = clean.length >= 2
    ? clean[0][0] + clean[clean.length - 1][0]
    : clean[0].slice(0, 2);
  return (
    <div className="w-11 h-11 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
      <span className="text-sm font-headline font-bold text-primary/80 uppercase">
        {initials.toUpperCase()}
      </span>
    </div>
  );
}

function PoolCard({
  candidate: c,
  selected,
  onToggle,
}: {
  candidate: InternalPoolEntry;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full rounded-lg border p-4 flex items-center gap-3 text-left transition-colors ${
        selected
          ? "bg-primary/5 border-primary/40"
          : "bg-card border-border/50 hover:border-border"
      }`}
    >
      <InitialsAvatar name={c.name} />
      <div className="min-w-0 flex-1">
        <p className="font-headline font-semibold text-sm text-foreground leading-snug truncate">{c.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{c.title}</p>
        <span className="inline-block mt-1.5 text-[10px] font-label font-semibold uppercase tracking-widest px-2 py-0.5 bg-secondary border border-border/40 rounded text-muted-foreground">
          {c.archetype}
        </span>
      </div>
      <div className={`shrink-0 w-4 h-4 rounded border transition-colors ${
        selected ? "bg-primary border-primary" : "border-border/60 bg-transparent"
      }`} />
    </button>
  );
}

interface TalentPoolPanelProps {
  uploadedFiles: string[];
  onFilesChange: (files: string[]) => void;
  selectedInternalIds: string[];
  onSelectedInternalIdsChange: (ids: string[]) => void;
}

export default function TalentPoolPanel({
  uploadedFiles,
  onFilesChange,
  selectedInternalIds,
  onSelectedInternalIdsChange,
}: TalentPoolPanelProps) {
  const [search, setSearch] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = search.trim()
    ? internalPool.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.archetype.toLowerCase().includes(search.toLowerCase())
      )
    : internalPool;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFilesChange([...uploadedFiles, ...files.map((f) => f.name)]);
    e.target.value = "";
  };

  const removeFile = (name: string) => {
    onFilesChange(uploadedFiles.filter((f) => f !== name));
  };

  const allSelected = selectedInternalIds.length === internalPool.length;

  const toggleCandidate = (id: string) => {
    onSelectedInternalIdsChange(
      selectedInternalIds.includes(id)
        ? selectedInternalIds.filter((candidateId) => candidateId !== id)
        : [...selectedInternalIds, id]
    );
  };

  const toggleSelectAll = () => {
    onSelectedInternalIdsChange(allSelected ? [] : internalPool.map((candidate) => candidate.id));
  };

  return (
    <div className="flex flex-col h-full">

      {/* ── Internal Talent Pool — scrollable ── */}
      <div className="flex-1 overflow-y-auto px-8 pt-8 pb-4">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <svg className="w-4 h-4 text-muted-foreground/70 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <h2 className="font-headline font-bold text-lg text-foreground">Internal Talent Pool</h2>
            <span className="text-xs font-label text-muted-foreground/50 border border-border/40 rounded px-1.5 py-0.5">
              {internalPool.length}
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees…"
              className="pl-9 pr-4 py-2 bg-secondary/60 border border-border/40 rounded text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/30 transition-all w-56"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-muted-foreground">
            Select which internal employees should be included in the analysis.
          </p>
          <button
            type="button"
            onClick={toggleSelectAll}
            className="text-xs font-label font-semibold uppercase tracking-wide text-primary hover:text-primary/80 transition-colors"
          >
            {allSelected ? "Clear All" : "Choose All"}
          </button>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((c) => (
              <PoolCard
                key={c.id}
                candidate={c}
                selected={selectedInternalIds.includes(c.id)}
                onToggle={() => toggleCandidate(c.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-6 text-center">No employees match your search.</p>
        )}
      </div>

      {/* ── External Applicants — fixed at bottom ── */}
      <div className="shrink-0 border-t border-border/60 bg-secondary/10 px-8 pt-5 pb-8">
        <div className="flex items-center gap-2.5 mb-4">
          <Upload className="w-4 h-4 text-muted-foreground/70 shrink-0" />
          <h2 className="font-headline font-bold text-lg text-foreground">External Applicants</h2>
        </div>

        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-border/40 rounded-lg p-6 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
            <Upload className="w-5 h-5 text-primary/70" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground/80">Upload CVs</p>
            <p className="text-xs text-muted-foreground mt-0.5">Drag and drop PDF or JSON files here, or click to browse</p>
          </div>
          <input ref={fileRef} type="file" accept=".json,.pdf" multiple onChange={handleFileChange} className="hidden" />
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-3 space-y-1.5 max-h-[120px] overflow-y-auto">
            {uploadedFiles.map((f) => (
              <div key={f} className="flex items-center justify-between bg-secondary/60 border border-border/30 rounded px-3 py-2">
                <span className="text-xs text-foreground/70 truncate">{f}</span>
                <button onClick={() => removeFile(f)} className="text-muted-foreground hover:text-danger ml-3 shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
