export interface InternalPoolEntry {
  id: string;
  name: string;
  title: string;
  archetype: string;
}

export const internalPool: InternalPoolEntry[] = [
  { id: "IP01", name: "Dr. Stefan Keller",  title: "VP Production, BMW Regensburg",    archetype: "Operational Steward"  },
  { id: "IP02", name: "Fatima Al-Rashidi",  title: "Director Strategy, BMW Group",      archetype: "Strategic Navigator"  },
  { id: "IP03", name: "Klaus Weber",        title: "Plant Manager, Dingolfing",         archetype: "Process Optimizer"    },
  { id: "IP04", name: "Andrea Müller",      title: "Head of Quality Systems, Leipzig",  archetype: "Quality Guardian"     },
];

export interface SpeedVsFitEntry {
  candidate_id: string;
  candidate_name: string;
  candidate_type: "internal" | "external";
  notice_period: string;
  bremo_score: number;
}

export interface SpeedVsFit {
  fastest: SpeedVsFitEntry;
  best_fit: SpeedVsFitEntry;
  gap_summary: string;
  same_person: boolean;
}

export interface TradeOff {
  candidate_1: string;
  candidate_2: string;
  key_differentiator: string;
  reversal_condition: string;
  sensitivity_hint: string;
}

export interface UiPayload {
  speed_vs_fit: SpeedVsFit;
  trade_off: TradeOff;
}

export interface RadarProfile {
  hard_skills: number;   // 0–100
  leadership: number;
  scenario_fit: number;
  team_fit: number;
  agility: number;
}

export interface TraceEntry {
  agent_label: string;
  agent_icon: "settings" | "users" | "brain" | "handshake" | "gavel";
  duration: string;
  summary: string;
  evidence_highlight: string | null;
}

export interface Candidate {
  id: string;
  name: string;
  title: string;
  type: "Internal" | "External";
  archetype: string;
  matchScore: number;
  oneLiner: string;
  quickTags: string[];
  flagCount: number;
  rationale: string;
  scoreFormula: string;
  criteria: { name: string; score: number }[];
  strengths: { text: string; evidence: "Verified" | "Self-reported" | "Inferred" }[];
  risks: { text: string; severity: "Monitor" | "Critical" }[];
  challengerView: string;
  rankingStability: "Stable" | "Fragile" | "Volatile";
  actionItems: string[];
  radarProfile: RadarProfile;
  mitigationStrategy: string;
  deliberationTrace: TraceEntry[];
}

export interface SearchResult {
  confidence: number;
  confidenceLevel: "High" | "Moderate" | "Low";
  candidates: Candidate[];
  ui_payload: UiPayload;
}

export const PRESET_ROLES = [
  "Head of Production",
  "VP Engineering",
  "Chief Digital Officer",
  "Director of Supply Chain",
  "Head of Quality Assurance",
];

export const SCENARIOS = [
  "Normal Operations",
  "Supply Chain Crisis",
  "EV Acceleration",
  "Talent Retention War",
  "Regulatory Pressure",
];

export const mockResults: SearchResult = {
  confidence: 82,
  confidenceLevel: "High",
  ui_payload: {
    speed_vs_fit: {
      fastest: {
        candidate_id: "C01",
        candidate_name: "Dr. Stefan Keller",
        candidate_type: "internal",
        notice_period: "Immediate",
        bremo_score: 7.52,
      },
      best_fit: {
        candidate_id: "C02",
        candidate_name: "Maria Santos",
        candidate_type: "external",
        notice_period: "14 weeks",
        bremo_score: 8.41,
      },
      gap_summary: "The top-ranked candidate (Santos) is unavailable for ~14 weeks due to her notice period. If the crisis demands leadership within 30 days, Keller can step in immediately — at a 0.89-point fit cost.",
      same_person: false,
    },
    trade_off: {
      candidate_1: "Maria Santos",
      candidate_2: "Dr. Stefan Keller",
      key_differentiator: "Santos scores +3.4 points higher on Crisis Management and has demonstrated dual-supplier pivots at scale — capabilities Keller has not been tested on.",
      reversal_condition: "Crisis weighting drops below 35% and cultural fit weighting rises above 45%",
      sensitivity_hint: "The gap is stable under most scenario adjustments but narrows significantly under low-urgency configurations.",
    },
  },
  candidates: [
    {
      id: "C02",
      name: "Maria Santos",
      title: "COO, Stellantis Iberia",
      type: "External",
      archetype: "Crisis Operator",
      matchScore: 8.41,
      oneLiner: "Crisis management and supply chain experience directly match scenario demands.",
      quickTags: ["Crisis Leadership", "Supply Chain", "Multi-plant Experience"],
      flagCount: 2,
      rationale:
        "Santos demonstrated exceptional tactical command during the 2021 semiconductor shortage at Stellantis Iberia. Her ability to pivot manufacturing pipelines within 48 hours is a direct match for the current Supply Chain Crisis parameters. She excels in high-pressure environments where technical debt must be managed alongside logistics volatility. Her leadership style is decisive and data-driven, with a track record of reducing downtime by 34% during the 2022 European logistics disruption.",
      scoreFormula: "(8.7 × 0.75) + (7.5 × 0.25) = 8.41",
      criteria: [
        { name: "Crisis Management", score: 9.2 },
        { name: "Supply Chain Exp.", score: 9.0 },
        { name: "Leadership Track Record", score: 8.5 },
        { name: "Strategic Thinking", score: 7.8 },
        { name: "Operational Excellence", score: 8.8 },
        { name: "People & Culture Fit", score: 6.5 },
        { name: "Innovation Capability", score: 7.0 },
        { name: "Stakeholder Mgmt", score: 8.2 },
        { name: "Industry Knowledge", score: 8.7 },
        { name: "Change Management", score: 7.9 },
      ],
      strengths: [
        { text: "Led Stellantis through semiconductor crisis — 91% production retention vs 70% industry average", evidence: "Verified" },
        { text: "Dual-sourced 14 Tier-1 suppliers within 6 months during the logistics crunch", evidence: "Verified" },
        { text: "Managed 3 plants simultaneously across 2 countries during pandemic shutdowns", evidence: "Verified" },
        { text: "Fluent in 4 languages: English, Portuguese, Spanish, German", evidence: "Self-reported" },
      ],
      risks: [
        { text: "3-month notice period — earliest realistic start is 14 weeks out.", severity: "Monitor" },
        { text: "Cultural integration risk — Stellantis operating culture differs significantly from BMW Regensburg.", severity: "Monitor" },
      ],
      challengerView:
        "Santos is a wartime leader. Compared to the internal benchmarks at BMW Regensburg, her high-intensity style may lead to friction in periods of stabilization. Consider if the goal is immediate crisis resolution or long-term cultural integration.",
      rankingStability: "Fragile",
      actionItems: [
        "Verify 'Semiconductor Pivot' claims with former Stellantis Iberia board members.",
        "Assess cultural fit for the existing 200-person engineering department at BMW Regensburg.",
        "Simulate a 'post-crisis' roadmap interview to check her strategic vision beyond the crisis.",
        "Establish equity package benchmarks for external hires of this caliber.",
      ],
      radarProfile: { hard_skills: 68, leadership: 67, scenario_fit: 84, team_fit: 65, agility: 70 },
      mitigationStrategy: "Pair with a strong internal deputy who has deep BMW Production System knowledge to cover the 3–6 month cultural onboarding gap and ensure BPS continuity.",
      deliberationTrace: [
        {
          agent_label: "JD & Scenario Agents",
          agent_icon: "settings",
          duration: "0.3s",
          summary: "Extracted 10 criteria from Head of Production JD. Supply Chain Crisis scenario detected — Crisis Management (C3) and Supply Chain Exp (C9) weights tripled to 0.22 and 0.20.",
          evidence_highlight: null,
        },
        {
          agent_label: "Candidate Evaluator",
          agent_icon: "users",
          duration: "1.6s",
          summary: "Scored Maria Santos across 10 criteria. Highest scores on Crisis Management (9.2) and Supply Chain Exp (9.0). Both tier-1 evidence verified.",
          evidence_highlight: "Evidence: +9.2 on Crisis Management for leading 14-plant semiconductor response at Stellantis with 91% production retention vs 70% industry avg.",
        },
        {
          agent_label: "Leadership Profiler",
          agent_icon: "brain",
          duration: "0.8s",
          summary: "Classified as Crisis Operator archetype with Directive decision style. High scenario alignment under Supply Chain Crisis — notice period risk flagged.",
          evidence_highlight: null,
        },
        {
          agent_label: "Team Fit Analyzer",
          agent_icon: "handshake",
          duration: "0.6s",
          summary: "Team fit score: 6.5/10. Moderate friction risk with existing BMW Production System culture — high-intensity external style may clash with consensus-driven plant leadership.",
          evidence_highlight: "Risk: Cultural operating model at Stellantis Iberia differs significantly from BMW Regensburg — integration timeline estimated 4–6 months.",
        },
        {
          agent_label: "Decision & Challenge",
          agent_icon: "gavel",
          duration: "0.9s",
          summary: "Ranked #1 with BREMO 8.41. Challenger flagged ranking as FRAGILE — depends on two tier-2 scores that could shift on deeper verification.",
          evidence_highlight: "Sensitivity: If Crisis Management drops 9.2 → 7.0, Stefan Keller overtakes by 0.3 points.",
        },
      ],
    },
    {
      id: "C01",
      name: "Dr. Stefan Keller",
      title: "VP Production, BMW Regensburg",
      type: "Internal",
      archetype: "Operational Steward",
      matchScore: 7.52,
      oneLiner: "Internal knowledge is valuable but crisis-specific scores lag behind.",
      quickTags: ["Operational Excellence", "BMW Culture", "Team Builder"],
      flagCount: 1,
      rationale:
        "Dr. Keller brings deep institutional knowledge of BMW's production systems and a 12-year track record of incremental optimization at the Regensburg plant. His leadership style prioritizes consensus and long-term stability. While he lacks direct crisis management experience at the scale required, his understanding of internal processes, supplier relationships, and team dynamics makes him a lower-risk choice. He would require a dedicated crisis advisor during the first 6 months.",
      scoreFormula: "(7.8 × 0.75) + (6.7 × 0.25) = 7.52",
      criteria: [
        { name: "Crisis Management", score: 5.8 },
        { name: "Supply Chain Exp.", score: 7.2 },
        { name: "Leadership Track Record", score: 8.5 },
        { name: "Strategic Thinking", score: 6.5 },
        { name: "Operational Excellence", score: 8.9 },
        { name: "People & Culture Fit", score: 9.5 },
        { name: "Innovation Capability", score: 6.5 },
        { name: "Stakeholder Mgmt", score: 7.4 },
        { name: "Industry Knowledge", score: 9.2 },
        { name: "Change Management", score: 6.0 },
      ],
      strengths: [
        { text: "12 years at BMW with deep institutional knowledge of production systems", evidence: "Verified" },
        { text: "Led Regensburg plant to #1 efficiency rating in BMW network for 3 consecutive years", evidence: "Verified" },
        { text: "Strong internal network across engineering, procurement, and quality teams", evidence: "Verified" },
        { text: "Known for building high-retention teams — turnover rate 40% below plant average", evidence: "Verified" },
      ],
      risks: [
        { text: "No direct crisis management experience at scale — only managed localized disruptions", severity: "Monitor" },
      ],
      challengerView:
        "Keller is a peacetime operator being considered for a wartime role. His consensus-driven style could slow decision-making during acute supply chain disruptions. The 1.0-point gap behind Santos widens if crisis weighting increases even slightly.",
      rankingStability: "Stable",
      actionItems: [
        "Assess crisis readiness through simulation exercise with supply chain team",
        "Identify experienced crisis advisor to pair with Keller during transition",
        "Evaluate internal promotion timeline against crisis urgency requirements",
      ],
      radarProfile: { hard_skills: 85, leadership: 75, scenario_fit: 58, team_fit: 93, agility: 55 },
      mitigationStrategy: "Assign a dedicated crisis advisor for the first 90 days and run weekly scenario simulations to rapidly build crisis muscle memory before the critical 30-day window closes.",
      deliberationTrace: [
        {
          agent_label: "JD & Scenario Agents",
          agent_icon: "settings",
          duration: "0.3s",
          summary: "Extracted 10 criteria from Head of Production JD. Supply Chain Crisis scenario applied — operational credentials weighted heavily at 0.22, disadvantaging peacetime profiles.",
          evidence_highlight: null,
        },
        {
          agent_label: "Candidate Evaluator",
          agent_icon: "users",
          duration: "1.4s",
          summary: "Scored Dr. Keller across 10 criteria. Exceptional Culture Fit (9.5) and Industry Knowledge (9.2). Crisis Management gap flagged at 5.8 — only localized disruptions on record.",
          evidence_highlight: "Evidence: 12-year tenure at BMW with #1 plant efficiency rating for 3 consecutive years — verified via internal HR and plant audit records.",
        },
        {
          agent_label: "Leadership Profiler",
          agent_icon: "brain",
          duration: "0.7s",
          summary: "Classified as Operational Steward with consensus-driven style. Strong peacetime profile — crisis execution readiness flagged as unverified at scale.",
          evidence_highlight: null,
        },
        {
          agent_label: "Team Fit Analyzer",
          agent_icon: "handshake",
          duration: "0.5s",
          summary: "Team fit score: 9.5/10 — highest in pool. Deep institutional trust with engineering, procurement, and quality teams. Smooth transition expected with no friction risk.",
          evidence_highlight: "Strength: Team turnover rate 40% below plant average — strong indicator of loyalty and sustainable leadership stability.",
        },
        {
          agent_label: "Decision & Challenge",
          agent_icon: "gavel",
          duration: "0.8s",
          summary: "Ranked #2 with BREMO 7.52. Challenger argues crisis weights are underestimating execution risk — wartime mandate requires tested crisis leadership, not institutional stability.",
          evidence_highlight: "Sensitivity: If crisis weighting rises above 35%, gap to Santos narrows to 0.5 but Keller does not overtake under current evidence.",
        },
      ],
    },
    {
      id: "C05",
      name: "Fatima Al-Rashidi",
      title: "Director Strategy, BMW Group",
      type: "Internal",
      archetype: "Strategic Navigator",
      matchScore: 6.89,
      oneLiner: "Strategic thinking is useful but lacks operational crisis credentials.",
      quickTags: ["Strategic Planning", "Data-Driven", "Internal Mobility"],
      flagCount: 1,
      rationale:
        "Al-Rashidi brings exceptional strategic analysis capabilities and a deep understanding of BMW's competitive landscape. Her scenario planning work during the 2023 EV transition was highly regarded at board level. However, she lacks hands-on operational experience in production environments. Moving from strategy to production leadership during a crisis represents a significant role transition that carries execution risk.",
      scoreFormula: "(7.1 × 0.75) + (6.3 × 0.25) = 6.89",
      criteria: [
        { name: "Crisis Management", score: 5.2 },
        { name: "Supply Chain Exp.", score: 5.8 },
        { name: "Leadership Track Record", score: 7.5 },
        { name: "Strategic Thinking", score: 8.5 },
        { name: "Operational Excellence", score: 4.5 },
        { name: "People & Culture Fit", score: 9.2 },
        { name: "Innovation Capability", score: 8.5 },
        { name: "Stakeholder Mgmt", score: 8.0 },
        { name: "Industry Knowledge", score: 8.8 },
        { name: "Change Management", score: 7.0 },
      ],
      strengths: [
        { text: "Led BMW Group's 2023 EV transition scenario planning — presented directly to board", evidence: "Verified" },
        { text: "Built cross-functional strategy team that identified $200M cost optimization opportunity", evidence: "Verified" },
        { text: "Strong analytical framework — data-driven decision making across complex variables", evidence: "Verified" },
      ],
      risks: [
        { text: "No operational production management experience — strategy-to-operations gap is significant", severity: "Monitor" },
      ],
      challengerView:
        "Al-Rashidi's strength is thinking about crises, not managing them in real-time. The gap between strategic planning and floor-level crisis response is substantial. Without a strong operational deputy, this appointment could create a leadership vacuum during the critical first 90 days.",
      rankingStability: "Stable",
      actionItems: [
        "Arrange 2-week production floor immersion at Regensburg or Dingolfing plant",
        "Identify strong operational deputy to complement strategic leadership style",
        "Evaluate readiness through crisis simulation with real supply chain data",
      ],
      radarProfile: { hard_skills: 55, leadership: 80, scenario_fit: 52, team_fit: 90, agility: 82 },
      mitigationStrategy: "Embed within the Regensburg production floor for 4 weeks before formal appointment and designate an experienced operations lead as co-pilot for the first 6 months.",
      deliberationTrace: [
        {
          agent_label: "JD & Scenario Agents",
          agent_icon: "settings",
          duration: "0.3s",
          summary: "Supply Chain Crisis scenario applied — operational criteria heavily weighted, systematically disadvantaging strategy-first profiles with limited floor experience.",
          evidence_highlight: null,
        },
        {
          agent_label: "Candidate Evaluator",
          agent_icon: "users",
          duration: "1.5s",
          summary: "Scored Al-Rashidi across 10 criteria. High Strategic Thinking (8.5) and Culture Fit (9.2). Operational Excellence gap flagged at 4.5 — no direct production floor history.",
          evidence_highlight: "Evidence: Board-level EV scenario planning confirmed via internal deck reference — strategic depth verified, operational execution depth unverified.",
        },
        {
          agent_label: "Leadership Profiler",
          agent_icon: "brain",
          duration: "0.7s",
          summary: "Classified as Strategic Navigator with analytical decision style. High ceiling in stable or transformational scenarios — crisis execution risk rated significant.",
          evidence_highlight: null,
        },
        {
          agent_label: "Team Fit Analyzer",
          agent_icon: "handshake",
          duration: "0.5s",
          summary: "Team fit score: 9.2/10. Strong stakeholder relationships at BMW Group level. Production floor teams are unknown — no direct report history in manufacturing.",
          evidence_highlight: "Risk: Strategy-to-operations transition in a live crisis creates a dual-learning load — role requires a strong operational co-pilot from day one.",
        },
        {
          agent_label: "Decision & Challenge",
          agent_icon: "gavel",
          duration: "0.9s",
          summary: "Ranked #3 with BREMO 6.89. Challenger argues score is optimistic — Operational Excellence gap of 4.5 should be treated as near-disqualifying under a crisis mandate.",
          evidence_highlight: "Sensitivity: If Operational Excellence weight rises to 0.18, Al-Rashidi drops to #4 behind Nakamura.",
        },
      ],
    },
    {
      id: "C06",
      name: "Takeshi Nakamura",
      title: "Chief Compliance Officer, Toyota EU",
      type: "External",
      archetype: "Quality Guardian",
      matchScore: 6.72,
      oneLiner: "Regulatory depth is an asset but not the primary need here.",
      quickTags: ["Regulatory Expertise", "Quality Systems", "Cross-cultural"],
      flagCount: 2,
      rationale:
        "Nakamura brings world-class regulatory and compliance expertise from Toyota's European operations. His understanding of quality systems and regulatory frameworks would strengthen any production leadership team. However, his experience is primarily in compliance rather than production operations, and the current crisis scenario requires hands-on supply chain management skills that fall outside his core competency.",
      scoreFormula: "(6.9 × 0.75) + (6.2 × 0.25) = 6.72",
      criteria: [
        { name: "Crisis Management", score: 6.0 },
        { name: "Supply Chain Exp.", score: 5.5 },
        { name: "Leadership Track Record", score: 7.0 },
        { name: "Strategic Thinking", score: 6.2 },
        { name: "Operational Excellence", score: 6.8 },
        { name: "People & Culture Fit", score: 5.5 },
        { name: "Innovation Capability", score: 5.8 },
        { name: "Stakeholder Mgmt", score: 7.2 },
        { name: "Industry Knowledge", score: 8.5 },
        { name: "Change Management", score: 6.0 },
      ],
      strengths: [
        { text: "Designed Toyota EU's regulatory compliance framework adopted across 8 countries", evidence: "Verified" },
        { text: "Deep expertise in automotive quality management systems (IATF 16949)", evidence: "Verified" },
        { text: "Cross-cultural leadership experience managing teams across Japan, Germany, and UK", evidence: "Verified" },
      ],
      risks: [
        { text: "Primary expertise is compliance, not production operations — skill gap for this role", severity: "Monitor" },
        { text: "Cultural integration from Toyota to BMW may require extended adaptation period", severity: "Monitor" },
      ],
      challengerView:
        "Nakamura is being evaluated for a production crisis role based on adjacent compliance skills. While regulatory expertise has value, it's not the primary competency needed for acute supply chain disruption management. This ranking reflects scenario mismatch rather than candidate quality.",
      rankingStability: "Stable",
      actionItems: [
        "Assess willingness to transition from compliance to production leadership",
        "Conduct cultural fit assessment with BMW production leadership team",
        "Evaluate competitive offer requirements — Toyota compensation may exceed BMW bands",
      ],
      radarProfile: { hard_skills: 72, leadership: 68, scenario_fit: 55, team_fit: 52, agility: 58 },
      mitigationStrategy: "Re-scope the role to include a compliance and quality mandate alongside production, leveraging his IATF expertise while filling operational gaps with a strong production-experienced deputy.",
      deliberationTrace: [
        {
          agent_label: "JD & Scenario Agents",
          agent_icon: "settings",
          duration: "0.3s",
          summary: "Supply Chain Crisis scenario applied — compliance expertise scored low relevance at 0.05. Operational and crisis criteria dominate at combined 0.42 weight.",
          evidence_highlight: null,
        },
        {
          agent_label: "Candidate Evaluator",
          agent_icon: "users",
          duration: "1.4s",
          summary: "Scored Nakamura across 10 criteria. Industry Knowledge strong (8.5) and Stakeholder Mgmt solid (7.2). Supply Chain Exp gap identified at 5.5.",
          evidence_highlight: "Evidence: Toyota EU compliance framework across 8 countries — regulatory depth verified. Supply chain operations experience unverified.",
        },
        {
          agent_label: "Leadership Profiler",
          agent_icon: "brain",
          duration: "0.8s",
          summary: "Classified as Quality Guardian with process-oriented style. Strong regulatory intelligence but limited evidence of crisis response leadership under supply chain pressure.",
          evidence_highlight: null,
        },
        {
          agent_label: "Team Fit Analyzer",
          agent_icon: "handshake",
          duration: "0.6s",
          summary: "Team fit score: 5.5/10. Toyota-to-BMW culture gap flagged. Cross-cultural experience is an asset but operating model differences require 3–5 month extended onboarding.",
          evidence_highlight: "Risk: BMW production culture is significantly more consensus-based than Toyota's hierarchical quality-gate model — management style conflict likely.",
        },
        {
          agent_label: "Decision & Challenge",
          agent_icon: "gavel",
          duration: "0.7s",
          summary: "Ranked #4 with BREMO 6.72. Challenger flagged this as a scenario mismatch — Nakamura would rank #2 under a Regulatory Pressure scenario.",
          evidence_highlight: "Sensitivity: Under Regulatory Pressure scenario, Nakamura overtakes Al-Rashidi and approaches Keller with an estimated BREMO of 7.1.",
        },
      ],
    },
    {
      id: "C03",
      name: "Dr. Anika Lindström",
      title: "Head of EV Programs, Volvo Cars",
      type: "External",
      archetype: "Transformation Catalyst",
      matchScore: 6.45,
      oneLiner: "EV expertise is strong but not relevant to this crisis scenario.",
      quickTags: ["EV Expertise", "Transformation", "Sustainability"],
      flagCount: 1,
      rationale:
        "Dr. Lindström is a standout candidate for EV-related roles and transformation leadership. Her work at Volvo Cars on the Recharge program has been widely recognized. However, for a Supply Chain Crisis scenario focused on traditional production, her EV-specific expertise doesn't directly translate. She would rank significantly higher under an EV Acceleration scenario where her skills become the primary evaluation criteria.",
      scoreFormula: "(6.6 × 0.75) + (6.0 × 0.25) = 6.45",
      criteria: [
        { name: "Crisis Management", score: 5.5 },
        { name: "Supply Chain Exp.", score: 5.0 },
        { name: "Leadership Track Record", score: 7.2 },
        { name: "Strategic Thinking", score: 6.5 },
        { name: "Operational Excellence", score: 6.5 },
        { name: "People & Culture Fit", score: 5.0 },
        { name: "Innovation Capability", score: 9.5 },
        { name: "Stakeholder Mgmt", score: 6.8 },
        { name: "Industry Knowledge", score: 7.5 },
        { name: "Change Management", score: 8.8 },
      ],
      strengths: [
        { text: "Led Volvo's Recharge EV program from concept to production — 3 vehicle platforms", evidence: "Verified" },
        { text: "Published researcher in sustainable manufacturing with 12 peer-reviewed papers", evidence: "Verified" },
        { text: "Built cross-functional EV team of 200+ engineers from scratch", evidence: "Verified" },
      ],
      risks: [
        { text: "EV-focused expertise doesn't address the core supply chain crisis requirements", severity: "Monitor" },
      ],
      challengerView:
        "Lindström is the wrong specialist for this scenario. Her ranking would jump to #1 under EV Acceleration, but placing an EV transformation leader into a supply chain crisis role wastes her strengths and exposes the organization to unnecessary transition risk.",
      rankingStability: "Stable",
      actionItems: [
        "Consider re-running analysis with EV Acceleration scenario to see Lindström's true ranking",
        "Assess if the role could be scoped to include EV transition planning alongside crisis response",
        "Evaluate long-term strategic value vs. short-term crisis fit",
      ],
      radarProfile: { hard_skills: 88, leadership: 70, scenario_fit: 48, team_fit: 50, agility: 92 },
      mitigationStrategy: "Re-scope the role to Head of EV Production Readiness before appointing — this eliminates the scenario mismatch and fully leverages her proven transformation capabilities.",
      deliberationTrace: [
        {
          agent_label: "JD & Scenario Agents",
          agent_icon: "settings",
          duration: "0.3s",
          summary: "Supply Chain Crisis scenario applied — EV expertise scored low relevance. Innovation Capability weight reduced to 0.05, actively penalising Lindström's core competency set.",
          evidence_highlight: null,
        },
        {
          agent_label: "Candidate Evaluator",
          agent_icon: "users",
          duration: "1.5s",
          summary: "Scored Dr. Lindström across 10 criteria. Innovation Capability exceptional (9.5) and Change Management strong (8.8). Crisis Management and Supply Chain Exp both below 6.0.",
          evidence_highlight: "Evidence: Led Volvo Recharge EV program across 3 platforms with 200+ engineer team — transformational depth verified by published research and org records.",
        },
        {
          agent_label: "Leadership Profiler",
          agent_icon: "brain",
          duration: "0.9s",
          summary: "Classified as Transformation Catalyst with visionary style. Ranks #1 in EV Acceleration scenario — current scenario structurally penalises her entire competency profile.",
          evidence_highlight: null,
        },
        {
          agent_label: "Team Fit Analyzer",
          agent_icon: "handshake",
          duration: "0.5s",
          summary: "Team fit score: 5.0/10 — lowest in pool. BMW Production System culture and Volvo EV-first culture operate on fundamentally different management philosophies.",
          evidence_highlight: "Risk: Appointing a transformational leader into a crisis stabilisation role creates dual-mandate confusion — production teams may receive mixed strategic signals.",
        },
        {
          agent_label: "Decision & Challenge",
          agent_icon: "gavel",
          duration: "0.8s",
          summary: "Ranked #5 with BREMO 6.45. Challenger strongly recommended scenario re-run before dismissal — under EV Acceleration she would rank #1 by a margin of 0.8 over Santos.",
          evidence_highlight: "Sensitivity: This ranking is entirely scenario-dependent. Re-run with EV Acceleration before making any final decision on Lindström.",
        },
      ],
    },
  ],
};
