import type { SummaryResult } from "@/lib/types";

export const mockSummaryResult: SummaryResult = {
  ui_payload: {
    header: {
      role_title: "Head of Production — EMEA",
      scenario_name: "Supply Chain Crisis",
      confidence_pct: 82,
      confidence_label: "High",
      agent_count: 5,
    },
    candidates: [
      {
        rank: 1,
        candidate_id: "C02",
        candidate_name: "Maria Santos",
        candidate_type: "external",
        composite_label: "Crisis Operator",
        bremo_score: 8.41,
        ai_rationale:
          "Santos demonstrated exceptional tactical command during the 2021 semiconductor shortage at Stellantis Iberia. Her ability to pivot manufacturing pipelines within 48 hours is a direct match for the current Supply Chain Crisis parameters. She excels in high-pressure environments where technical debt must be managed alongside logistics volatility. Her leadership style is decisive and data-driven, with a track record of reducing downtime by 34% during the 2022 European logistics disruption.",
        intelligence_breakdown: [
          { criterion_name: "Crisis Management",       score: 9.2, score_pct: 92, evidence_tier: "Tier 1", scenario_weight: 0.22 },
          { criterion_name: "Supply Chain Exp.",       score: 9.0, score_pct: 90, evidence_tier: "Tier 1", scenario_weight: 0.20 },
          { criterion_name: "Operational Excellence",  score: 8.8, score_pct: 88, evidence_tier: "Tier 1", scenario_weight: 0.15 },
          { criterion_name: "Leadership Track Record", score: 8.5, score_pct: 85, evidence_tier: "Tier 1", scenario_weight: 0.12 },
          { criterion_name: "Stakeholder Mgmt",        score: 8.2, score_pct: 82, evidence_tier: "Tier 2", scenario_weight: 0.08 },
          { criterion_name: "Industry Knowledge",      score: 8.7, score_pct: 87, evidence_tier: "Tier 1", scenario_weight: 0.07 },
          { criterion_name: "Strategic Thinking",      score: 7.8, score_pct: 78, evidence_tier: "Tier 2", scenario_weight: 0.06 },
          { criterion_name: "Change Management",       score: 7.9, score_pct: 79, evidence_tier: "Tier 2", scenario_weight: 0.05 },
          { criterion_name: "Innovation Capability",   score: 7.0, score_pct: 70, evidence_tier: "Tier 2", scenario_weight: 0.04 },
          { criterion_name: "People & Culture Fit",    score: 6.5, score_pct: 65, evidence_tier: "Tier 2", scenario_weight: 0.03 },
        ],
        core_strengths: [
          "Led Stellantis through semiconductor crisis — 91% production retention vs 70% industry average",
          "Dual-sourced 14 Tier-1 suppliers within 6 months during the logistics crunch",
          "Managed 3 plants simultaneously across 2 countries during pandemic shutdowns",
          "Fluent in 4 languages: English, Portuguese, Spanish, German",
        ],
        critical_risks: [
          "3-month notice period — earliest realistic start is 14 weeks out",
          "Cultural integration risk — Stellantis operating culture differs significantly from BMW Regensburg",
        ],
        challenger_view:
          "Santos is a wartime leader. Compared to the internal benchmarks at BMW Regensburg, her high-intensity style may lead to friction in periods of stabilization. Consider if the goal is immediate crisis resolution or long-term cultural integration.",
        stability_label: "Fragile",
        recommended_protocol: [
          "Verify 'Semiconductor Pivot' claims with former Stellantis Iberia board members.",
          "Assess cultural fit for the existing 200-person engineering department at BMW Regensburg.",
          "Simulate a 'post-crisis' roadmap interview to check her strategic vision beyond the crisis.",
          "Establish equity package benchmarks for external hires of this caliber.",
        ],
        radar_profile: { hard_skills: 68, leadership: 67, scenario_fit: 84, team_fit: 65, agility: 70 },
        mitigation_strategy:
          "Pair with a strong internal deputy who has deep BMW Production System knowledge to cover the 3–6 month cultural onboarding gap and ensure BPS continuity.",
        deliberation_trace: [
          {
            agent_label: "JD & Scenario Agents",
            agent_icon: "settings",
            duration: "0.3s",
            summary:
              "Extracted 10 criteria from Head of Production JD. Supply Chain Crisis scenario detected — Crisis Management (C3) and Supply Chain Exp (C9) weights tripled to 0.22 and 0.20.",
            evidence_highlight: null,
          },
          {
            agent_label: "Candidate Evaluator",
            agent_icon: "users",
            duration: "1.6s",
            summary:
              "Scored Maria Santos across 10 criteria. Highest scores on Crisis Management (9.2) and Supply Chain Exp (9.0). Both tier-1 evidence verified.",
            evidence_highlight:
              "Evidence: +9.2 on Crisis Management for leading 14-plant semiconductor response at Stellantis with 91% production retention vs 70% industry avg.",
          },
          {
            agent_label: "Leadership Profiler",
            agent_icon: "brain",
            duration: "0.8s",
            summary:
              "Classified as Crisis Operator archetype with Directive decision style. High scenario alignment under Supply Chain Crisis — notice period risk flagged.",
            evidence_highlight: null,
          },
          {
            agent_label: "Team Fit Analyzer",
            agent_icon: "handshake",
            duration: "0.6s",
            summary:
              "Team fit score: 6.5/10. Moderate friction risk with existing BMW Production System culture — high-intensity external style may clash with consensus-driven plant leadership.",
            evidence_highlight:
              "Risk: Cultural operating model at Stellantis Iberia differs significantly from BMW Regensburg — integration timeline estimated 4–6 months.",
          },
          {
            agent_label: "Decision & Challenge",
            agent_icon: "gavel",
            duration: "0.9s",
            summary:
              "Ranked #1 with BREMO 8.41. Challenger flagged ranking as FRAGILE — depends on two tier-2 scores that could shift on deeper verification.",
            evidence_highlight:
              "Sensitivity: If Crisis Management drops 9.2 → 7.0, Stefan Keller overtakes by 0.3 points.",
          },
        ],
      },
      {
        rank: 2,
        candidate_id: "C01",
        candidate_name: "Dr. Stefan Keller",
        candidate_type: "internal",
        composite_label: "Operational Steward",
        bremo_score: 7.52,
        ai_rationale:
          "Dr. Keller brings deep institutional knowledge of BMW's production systems and a 12-year track record of incremental optimization at the Regensburg plant. His leadership style prioritizes consensus and long-term stability. While he lacks direct crisis management experience at the scale required, his understanding of internal processes, supplier relationships, and team dynamics makes him a lower-risk choice. He would require a dedicated crisis advisor during the first 6 months.",
        intelligence_breakdown: [
          { criterion_name: "People & Culture Fit",    score: 9.5, score_pct: 95, evidence_tier: "Tier 1", scenario_weight: 0.03 },
          { criterion_name: "Industry Knowledge",      score: 9.2, score_pct: 92, evidence_tier: "Tier 1", scenario_weight: 0.07 },
          { criterion_name: "Operational Excellence",  score: 8.9, score_pct: 89, evidence_tier: "Tier 1", scenario_weight: 0.15 },
          { criterion_name: "Leadership Track Record", score: 8.5, score_pct: 85, evidence_tier: "Tier 1", scenario_weight: 0.12 },
          { criterion_name: "Stakeholder Mgmt",        score: 7.4, score_pct: 74, evidence_tier: "Tier 2", scenario_weight: 0.08 },
          { criterion_name: "Supply Chain Exp.",       score: 7.2, score_pct: 72, evidence_tier: "Tier 2", scenario_weight: 0.20 },
          { criterion_name: "Strategic Thinking",      score: 6.5, score_pct: 65, evidence_tier: "Tier 2", scenario_weight: 0.06 },
          { criterion_name: "Innovation Capability",   score: 6.5, score_pct: 65, evidence_tier: "Tier 2", scenario_weight: 0.04 },
          { criterion_name: "Change Management",       score: 6.0, score_pct: 60, evidence_tier: "Tier 2", scenario_weight: 0.05 },
          { criterion_name: "Crisis Management",       score: 5.8, score_pct: 58, evidence_tier: "Tier 2", scenario_weight: 0.22 },
        ],
        core_strengths: [
          "12 years at BMW with deep institutional knowledge of production systems",
          "Led Regensburg plant to #1 efficiency rating in BMW network for 3 consecutive years",
          "Strong internal network across engineering, procurement, and quality teams",
          "Known for building high-retention teams — turnover rate 40% below plant average",
        ],
        critical_risks: [
          "No direct crisis management experience at scale — only managed localized disruptions",
        ],
        challenger_view:
          "Keller is a peacetime operator being considered for a wartime role. His consensus-driven style could slow decision-making during acute supply chain disruptions. The 1.0-point gap behind Santos widens if crisis weighting increases even slightly.",
        stability_label: "Stable",
        recommended_protocol: [
          "Assess crisis readiness through simulation exercise with supply chain team.",
          "Identify experienced crisis advisor to pair with Keller during transition.",
          "Evaluate internal promotion timeline against crisis urgency requirements.",
          "Run a 30-day decision-speed assessment before formal appointment.",
        ],
        radar_profile: { hard_skills: 85, leadership: 75, scenario_fit: 58, team_fit: 93, agility: 55 },
        mitigation_strategy:
          "Assign a dedicated crisis advisor for the first 90 days and run weekly scenario simulations to rapidly build crisis muscle memory before the critical 30-day window closes.",
        deliberation_trace: [
          {
            agent_label: "JD & Scenario Agents",
            agent_icon: "settings",
            duration: "0.3s",
            summary:
              "Extracted 10 criteria from Head of Production JD. Supply Chain Crisis scenario applied — operational credentials weighted heavily at 0.22, disadvantaging peacetime profiles.",
            evidence_highlight: null,
          },
          {
            agent_label: "Candidate Evaluator",
            agent_icon: "users",
            duration: "1.4s",
            summary:
              "Scored Dr. Keller across 10 criteria. Exceptional Culture Fit (9.5) and Industry Knowledge (9.2). Crisis Management gap flagged at 5.8 — only localized disruptions on record.",
            evidence_highlight:
              "Evidence: 12-year tenure at BMW with #1 plant efficiency rating for 3 consecutive years — verified via internal HR and plant audit records.",
          },
          {
            agent_label: "Leadership Profiler",
            agent_icon: "brain",
            duration: "0.7s",
            summary:
              "Classified as Operational Steward with consensus-driven style. Strong peacetime profile — crisis execution readiness flagged as unverified at scale.",
            evidence_highlight: null,
          },
          {
            agent_label: "Team Fit Analyzer",
            agent_icon: "handshake",
            duration: "0.5s",
            summary:
              "Team fit score: 9.5/10 — highest in pool. Deep institutional trust with engineering, procurement, and quality teams. Smooth transition expected with no friction risk.",
            evidence_highlight:
              "Strength: Team turnover rate 40% below plant average — strong indicator of loyalty and sustainable leadership stability.",
          },
          {
            agent_label: "Decision & Challenge",
            agent_icon: "gavel",
            duration: "0.8s",
            summary:
              "Ranked #2 with BREMO 7.52. Challenger argues crisis weights are underestimating execution risk — wartime mandate requires tested crisis leadership, not institutional stability.",
            evidence_highlight:
              "Sensitivity: If crisis weighting rises above 35%, gap to Santos narrows to 0.5 but Keller does not overtake under current evidence.",
          },
        ],
      },
    ],
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
      gap_summary:
        "The top-ranked candidate (Santos) is unavailable for ~14 weeks due to her notice period. If the crisis demands leadership within 30 days, Keller can step in immediately — at a 0.89-point fit cost.",
      same_person: false,
    },
    trade_off: {
      candidate_1: "Maria Santos",
      candidate_2: "Dr. Stefan Keller",
      key_differentiator:
        "Santos scores +3.4 points higher on Crisis Management and has demonstrated dual-supplier pivots at scale — capabilities Keller has not been tested on.",
      reversal_condition:
        "Crisis weighting drops below 35% and cultural fit weighting rises above 45%",
      sensitivity_hint:
        "The gap is stable under most scenario adjustments but narrows significantly under low-urgency configurations.",
    },
  },
};
