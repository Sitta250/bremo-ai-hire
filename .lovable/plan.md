

## Plan: Remove `decision_brief` and confirm n8n JSON format

### What changes

**1. `src/lib/types.ts`**
- Remove the `DecisionBrief` interface
- Remove `decision_brief` from `SummaryResult` (so it only has `ui_payload`)

**2. `src/lib/validateSummaryResult.ts`**
- Remove the `decision_brief` validation check (lines 15-17)

**3. `src/data/mockSummaryResult.ts`**
- Remove the `decision_brief` object from mock data

---

### Confirmed: JSON format n8n must return

n8n returns **one single JSON object**. No `decision_brief` needed:

```json
{
  "ui_payload": {
    "header": {
      "role_title": "string",
      "scenario_name": "string",
      "confidence_pct": 85,
      "confidence_label": "string",
      "agent_count": 5
    },
    "candidates": [
      {
        "rank": 1,
        "candidate_id": "C01",
        "candidate_name": "Jane Doe",
        "candidate_type": "internal",
        "composite_label": "Top Pick – Crisis Leader",
        "bremo_score": 8.5,
        "ai_rationale": "Plain string or { \"full_text\": \"...\", \"bullets\": [\"...\"] }",
        "intelligence_breakdown": [
          {
            "criterion_name": "Crisis Management",
            "score": 8.5,
            "score_pct": 85,
            "evidence_tier": "Strong",
            "scenario_weight": 0.3,
            "evidence_snippet": "optional text",
            "was_recalibrated": false
          }
        ],
        "core_strengths": ["strength 1", "strength 2"],
        "critical_risks": ["risk 1"],
        "challenger_view": "Counter-argument text",
        "stability_label": "Stable",
        "recommended_protocol": ["Step 1", "Step 2"],
        "radar_profile": {
          "hard_skills": 8,
          "leadership": 7,
          "scenario_fit": 9,
          "team_fit": 7,
          "agility": 8
        },
        "mitigation_strategy": "How to address risks",
        "deliberation_trace": [
          {
            "agent_label": "Technical Agent",
            "agent_icon": "settings",
            "duration": "2m 15s",
            "summary": "Agent conclusion",
            "evidence_highlight": "optional quote"
          }
        ],
        "business_impact": "optional text"
      }
    ],
    "speed_vs_fit": {
      "fastest": { "candidate_id": "C01", "candidate_name": "...", "candidate_type": "internal", "notice_period": "Immediate", "bremo_score": 8.5 },
      "best_fit": { "candidate_id": "C02", "candidate_name": "...", "candidate_type": "external", "notice_period": "3 months", "bremo_score": 9.1 },
      "gap_summary": "...",
      "same_person": false
    },
    "trade_off": {
      "candidate_1": "C01",
      "candidate_2": "C02",
      "key_differentiator": "...",
      "reversal_condition": "...",
      "sensitivity_hint": "..."
    }
  }
}
```

**Key rules:**
- `bremo_score` and `score` must be **numbers**, not strings
- `agent_icon` must be one of: `"settings"`, `"users"`, `"brain"`, `"handshake"`, `"gavel"`
- `speed_vs_fit` and `trade_off` are **optional**
- All candidates go in the single `candidates` array
- n8n can wrap this in `{ "output": "..." }` — the frontend auto-unwraps it

