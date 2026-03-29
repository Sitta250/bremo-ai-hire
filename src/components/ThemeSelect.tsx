import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import { motion } from "framer-motion";

export interface ThemeSelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ThemeSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
  disabled = false,
}: ThemeSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selectedLabel = options.find((o) => o.value === value)?.label;

  const filtered = query.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
    else setQuery("");
  }, [open]);

  return (
    <div ref={ref} className="relative mb-3">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`w-full flex items-center justify-between bg-secondary/60 border border-border/40 rounded px-3.5 py-2.5 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-primary/50 ${
          disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-secondary/80 cursor-pointer"
        } ${open ? "ring-1 ring-primary/50 border-primary/40" : ""}`}
      >
        <span className={selectedLabel ? "text-foreground" : "text-muted-foreground/80"}>
          {selectedLabel ?? placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute z-50 mt-1 w-full bg-card border border-border/60 rounded-lg overflow-hidden shadow-lg shadow-foreground/10"
        >
          {/* Search input */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border/40">
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          {/* Options list */}
          <div className="max-h-52 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); setQuery(""); }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-colors ${
                    opt.value === value
                      ? "bg-primary/15 text-primary"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <span>{opt.label}</span>
                  {opt.value === value && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))
            ) : (
              <p className="px-4 py-3 text-sm text-muted-foreground">No matches</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
