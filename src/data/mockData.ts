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
}

export interface SearchResult {
  confidence: number;
  confidenceLevel: "High" | "Moderate" | "Low";
  candidates: Candidate[];
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
        "Lindström is the wrong specialist for this scenario. Her ranking would jump to #1 under EV Acceleration, but placing an EV transformation leader into a supply chain crisis role wastes her strengths and exposes the organization to unnecessary transition risk. Consider re-running analysis under a different scenario if EV is also a priority.",
      rankingStability: "Stable",
      actionItems: [
        "Consider re-running analysis with EV Acceleration scenario to see Lindström's true ranking",
        "Assess if the role could be scoped to include EV transition planning alongside crisis response",
        "Evaluate long-term strategic value vs. short-term crisis fit",
      ],
    },
  ],
};
