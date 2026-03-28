import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
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
  const ref = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find((o) => o.value === value)?.label;

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={ref} className="relative mb-3">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`w-full flex items-center justify-between bg-secondary rounded-xl px-4 py-3.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
          disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-secondary/80 cursor-pointer"
        } ${open ? "ring-2 ring-primary" : ""}`}
      >
        <span className={selectedLabel ? "text-foreground" : "text-muted-foreground"}>
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
          className="absolute z-50 mt-2 w-full bg-card border border-border/60 rounded-xl overflow-hidden shadow-2xl shadow-black/40"
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm text-left transition-colors ${
                opt.value === value
                  ? "bg-primary/15 text-primary"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <span>{opt.label}</span>
              {opt.value === value && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
