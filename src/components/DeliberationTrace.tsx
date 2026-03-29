import { Settings, Users, Brain, Handshake, Gavel, GitBranch } from "lucide-react";
import type { DeliberationEntry } from "@/lib/types";

const ICON_MAP = {
  settings:  Settings,
  users:     Users,
  brain:     Brain,
  handshake: Handshake,
  gavel:     Gavel,
};

const DOT_COLORS: Record<string, string> = {
  settings:  "bg-primary",
  users:     "bg-success",
  brain:     "bg-primary/80",
  handshake: "bg-warning",
  gavel:     "bg-primary",
};

function TraceCard({ entry }: { entry: DeliberationEntry }) {
  const Icon = ICON_MAP[entry.agent_icon];
  return (
    <div className="bg-card border border-border/50 rounded-lg p-4 flex-1">
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="font-label font-bold text-sm text-foreground leading-snug">{entry.agent_label}</p>
        <span className="text-xs font-label text-muted-foreground/60 bg-secondary px-1.5 py-0.5 rounded shrink-0">
          {entry.duration}
        </span>
      </div>
      <p className="text-sm text-foreground/75 leading-relaxed mb-0">
        {entry.summary}
      </p>
      {entry.evidence_highlight && (() => {
        const isEvidence = entry.evidence_highlight.startsWith("Evidence:");
        return (
          <div className={`mt-3 border-l-2 pl-3 py-1.5 rounded-r ${isEvidence ? "border-success/60 bg-success/5" : "border-warning/60 bg-warning/5"}`}>
            <p className={`text-xs leading-relaxed ${isEvidence ? "text-success/90" : "text-warning/90"}`}>{entry.evidence_highlight}</p>
          </div>
        );
      })()}
    </div>
  );
}

interface DeliberationTraceProps {
  entries: DeliberationEntry[];
}

export default function DeliberationTrace({ entries }: DeliberationTraceProps) {
  return (
    <div className="border border-border/50 rounded-lg p-5 bg-secondary/10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <GitBranch className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
        <h4 className="text-xs font-label uppercase tracking-widest text-muted-foreground">
          Agentic Deliberation Trace
        </h4>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Center vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/40 -translate-x-1/2" />

        <div className="flex flex-col gap-5">
          {entries.map((entry, i) => {
            const isRight = i % 2 === 0; // 0,2,4 → right; 1,3 → left
            const Icon = ICON_MAP[entry.agent_icon];
            const dotColor = DOT_COLORS[entry.agent_icon] ?? "bg-primary";

            return (
              <div key={i} className="flex items-center gap-4 min-h-[80px]">
                {/* Left slot */}
                <div className="flex-1 flex justify-end pr-4">
                  {!isRight && <TraceCard entry={entry} />}
                </div>

                {/* Center dot */}
                <div className={`w-9 h-9 rounded-full ${dotColor} flex items-center justify-center shrink-0 z-10 shadow-sm`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>

                {/* Right slot */}
                <div className="flex-1 pl-4">
                  {isRight && <TraceCard entry={entry} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
