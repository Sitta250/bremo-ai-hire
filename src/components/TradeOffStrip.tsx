import { Scale, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import type { TradeOff } from "@/data/mockData";

export default function TradeOffStrip({ data }: { data: TradeOff }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }}
      className="bg-background border border-border/50 rounded-lg px-5 py-4 my-3 flex items-start gap-4"
    >
      <div className="flex items-center gap-2 shrink-0 pt-0.5">
        <Scale className="w-4 h-4 text-muted-foreground/70" />
        <p className="text-xs font-label font-semibold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
          #1 vs #2
        </p>
      </div>

      <div className="w-px self-stretch bg-border/50 shrink-0" />

      <div className="flex-1 min-w-0 space-y-1.5">
        <p className="text-sm text-foreground/85 leading-snug">
          {data.key_differentiator}
        </p>
        <p className="text-sm leading-snug flex items-center gap-1.5 flex-wrap">
          <RefreshCw className="w-3.5 h-3.5 text-warning/80 shrink-0" />
          <span className="text-warning font-label font-semibold text-xs uppercase tracking-wide">Ranking flips if:</span>
          <span className="text-muted-foreground">{data.reversal_condition}</span>
        </p>
      </div>
    </motion.div>
  );
}
