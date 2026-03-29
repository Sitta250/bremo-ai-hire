import { Pencil, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import logo from "@/logo.png";

interface SummaryBarProps {
  role: string;
  poolType: "internal" | "hybrid";
  uploadedCount: number;
  scenario: string;
  onEdit: () => void;
  onNewSearch: () => void;
}

export default function SummaryBar({ role, poolType, uploadedCount, scenario, onEdit, onNewSearch }: SummaryBarProps) {
  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-30 bg-card/95 backdrop-blur border-b border-border"
    >
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-7 w-7 shrink-0 object-contain" />
            <span className="font-bold text-foreground">Bremo</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-muted-foreground">
            <div>
              <span className="text-xs uppercase tracking-wider block text-muted-foreground/60">Role</span>
              <span className="text-foreground font-medium">{role}</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <span className="text-xs uppercase tracking-wider block text-muted-foreground/60">Pool</span>
              <span className="text-foreground font-medium">
                {poolType === "internal" ? "Internal" : `Internal + External (${uploadedCount} uploaded)`}
              </span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <span className="text-xs uppercase tracking-wider block text-muted-foreground/60">Scenario</span>
              <span className="text-foreground font-medium">{scenario}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-wider border border-border rounded-md text-foreground hover:bg-secondary transition-colors"
          >
            <Pencil className="w-3 h-3" /> Edit
          </button>
          <button
            onClick={onNewSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-wider bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> New Search
          </button>
        </div>
      </div>
    </motion.div>
  );
}
