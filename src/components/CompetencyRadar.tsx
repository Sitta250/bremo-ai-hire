import type { RadarProfile } from "@/data/mockData";

// Pentagon axes: top → clockwise
const AXES: { key: keyof RadarProfile; label: string; angle: number; anchor: string; dx: number; dy: number }[] = [
  { key: "hard_skills",  label: "Hard Skills",  angle: 90,   anchor: "middle", dx: 0,   dy: -10 },
  { key: "leadership",   label: "Leadership",   angle: 18,   anchor: "start",  dx: 8,   dy: 0   },
  { key: "scenario_fit", label: "Scenario Fit", angle: -54,  anchor: "start",  dx: 8,   dy: 14  },
  { key: "team_fit",     label: "Team Fit",     angle: -126, anchor: "end",    dx: -8,  dy: 14  },
  { key: "agility",      label: "Agility",      angle: 162,  anchor: "end",    dx: -8,  dy: 0   },
];

const cx = 125, cy = 120, maxR = 80, labelR = 105;
const toRad = (d: number) => (d * Math.PI) / 180;
const pt = (r: number, deg: number): [number, number] => [
  cx + r * Math.cos(toRad(deg)),
  cy - r * Math.sin(toRad(deg)),
];

function polyPath(points: [number, number][]): string {
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`).join(" ") + " Z";
}

interface CompetencyRadarProps {
  profile: RadarProfile;
}

export default function CompetencyRadar({ profile }: CompetencyRadarProps) {
  const bgLevels = [0.25, 0.5, 0.75, 1.0];
  const axisPoints = AXES.map((a) => pt(maxR, a.angle));
  const dataPoints = AXES.map((a) => pt((profile[a.key] / 100) * maxR, a.angle));

  return (
    <div className="border border-border/50 rounded-lg p-4 bg-secondary/10">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <h4 className="text-xs font-label uppercase tracking-widest text-muted-foreground">Competency Profile</h4>
      </div>

      <svg
        viewBox="0 0 250 235"
        className="w-full max-w-[260px] mx-auto block"
        overflow="visible"
      >
        {/* Background rings */}
        {bgLevels.map((frac) => (
          <path
            key={frac}
            d={polyPath(AXES.map((a) => pt(maxR * frac, a.angle)))}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="0.8"
          />
        ))}

        {/* Axis lines */}
        {axisPoints.map(([x, y], i) => (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={x} y2={y}
            stroke="hsl(var(--border))"
            strokeWidth="0.8"
          />
        ))}

        {/* Data polygon */}
        <path
          d={polyPath(dataPoints)}
          fill="hsl(var(--primary) / 0.18)"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Data dots */}
        {dataPoints.map(([x, y], i) => (
          <circle
            key={i}
            cx={x} cy={y} r="3"
            fill="hsl(var(--primary))"
          />
        ))}

        {/* Axis labels */}
        {AXES.map((a) => {
          const [lx, ly] = pt(labelR, a.angle);
          return (
            <text
              key={a.key}
              x={lx + a.dx}
              y={ly + a.dy}
              textAnchor={a.anchor}
              fontSize="10"
              fill="hsl(var(--muted-foreground))"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="500"
            >
              {a.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
