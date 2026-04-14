/** All types that match the Summary Agent output contract. */

export interface SummaryHeader {
  role_title: string;
  scenario_name: string;
  confidence_pct: number;
  confidence_label: string;
  agent_count: number;
}

export interface IntelligenceCriterion {
  criterion_name: string;
  score: number;
  score_pct: number;
  evidence_tier: string;
  scenario_weight: number;
  evidence_snippet?: string;
  was_recalibrated?: boolean;
}

export interface RadarProfile {
  hard_skills: number;
  leadership: number;
  scenario_fit: number;
  team_fit: number;
  agility: number;
}

export interface DeliberationEntry {
  agent_label: string;
  agent_icon: string;
  duration: string;
  summary: string;
  evidence_highlight: string | null;
}

/** ai_rationale can be a plain string or an object with full_text/bullets */
export type AiRationale = string | { full_text: string; bullets?: string[] };

export interface SummaryCandidate {
  rank: number;
  candidate_id: string;
  candidate_name: string;
  candidate_type: string;
  composite_label: string;
  bremo_score: number;
  ai_rationale: AiRationale;
  intelligence_breakdown: IntelligenceCriterion[];
  core_strengths: string[];
  critical_risks: string[];
  challenger_view: string;
  stability_label: string;
  recommended_protocol: string[];
  radar_profile: RadarProfile;
  mitigation_strategy: string;
  deliberation_trace: DeliberationEntry[];
  business_impact?: string;
}

export interface SpeedVsFitEntry {
  candidate_id: string;
  candidate_name: string;
  candidate_type: string;
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
  header: SummaryHeader;
  candidates: SummaryCandidate[];
  speed_vs_fit?: SpeedVsFit;
  trade_off?: TradeOff;
}

export interface SummaryResult {
  ui_payload: UiPayload;
}

export interface DebugInfo {
  payloadSent: unknown;
  rawResponse: unknown;
  validationStatus: "passed" | "failed" | "pending";
  responseStatus?: number;
}
