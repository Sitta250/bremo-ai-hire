# Bremo AI Hire — End-to-End System & UI Flow
bremo-insight-hiring.lovable.app



<img width="1512" height="860" alt="image" src="https://github.com/user-attachments/assets/dfa8b116-ddeb-40d5-ac47-610d6bb9617b" />

<img width="1512" height="819" alt="image" src="https://github.com/user-attachments/assets/8364295f-a87e-45f6-a3f9-481ccaca38a4" />

<img width="255" height="644" alt="image" src="https://github.com/user-attachments/assets/f764242d-0a0f-4094-b460-6480ded5b56d" />

---
<img width="685" height="886" alt="image" src="https://github.com/user-attachments/assets/8e69a816-c55b-4729-9460-c5ae22b4397f" />



## 1. Product Goal

Bremo helps HR compare internal and external candidates for a senior manufacturing role under a specific business scenario.

The system combines:

* role fit
* scenario fit
* leadership/team interaction fit
* hiring practicality
* challenge/stability review

The output is not just a ranked list. It is a decision package the hiring committee can defend.

---

## 2. User Flow

### A. Strategic Setup

The user configures the search from the setup screen:

* select or describe the role
* choose the hiring team
* select or describe the strategic scenario
* choose internal candidates from the talent pool
* upload external CVs / candidate JSON

This screen defines the context for the full pipeline.

### B. Analysis Run

Once the setup is submitted, the multi-agent pipeline runs.

### C. Results View

The results page shows:

* speed vs fit comparison
* ranked top candidates
* selected candidate detail panel
* AI rationale
* intelligence breakdown bars
* competency radar
* challenger dissent
* mitigation strategy
* core strengths
* risk flags
* agentic deliberation trace
* recommended protocol

---

## 3. Final Pipeline Architecture

## Agent 1 — JD Agent

Purpose:
Turn the job description or hiring brief into a fixed 10-criterion evaluation framework.

What it does:

* extracts exactly 10 criteria
* assigns default weights summing to 1.00
* tags criteria by category
* marks the 3 role-critical factors
* adds machine-readable validation tags
* fills sparse inputs with realistic defaults and logs them in `input_gaps`

Output is the scoring blueprint for the rest of the system.

---

## Agent 2 — Candidate Fit Agent

Purpose:
Score each candidate against the 10 criteria from Agent 1.

What it does:

* evaluates each candidate criterion-by-criterion
* assigns a 0–10 score
* records evidence
* assigns evidence tier (`verified`, `stated`, `inferred`, `no_evidence`)
* assigns confidence per criterion
* calculates a base weighted total using Agent 1 default weights
* returns top strengths, main risks, role-critical gaps, and optional disqualifier

This agent evaluates each candidate on their own merits. It does not rank candidates.

---

## Agent 3 — Scenario Agent

Purpose:
Adjust the importance of the 10 criteria based on the active business scenario.

What it does:

* reads the 10 criteria from Agent 1
* reads the active business scenario
* outputs adjusted weights for all 10 original criteria
* ensures adjusted weights still sum to 1.00
* identifies scenario pressures
* adds advisory-only emergent criteria with `weight: 0.00`
* explains what goes wrong if hiring priorities are wrong for the current scenario

This agent does not score candidates.

---

## Agent 4 — Leadership Profile Agent

Purpose:
Build structured behavioral profiles for candidates and the existing leadership team.

What it does:

* profiles each candidate on:

  * primary and secondary archetype
  * decision style
  * change orientation
  * risk profile
* generates a concise composite label for candidates
* profiles each team member using the same framework
* returns profile confidence and short summaries

This creates a common language for team-fit analysis.

---

## Agent 5 — Team Interaction Fit Agent

Purpose:
Estimate how each candidate will work with the existing team.

What it does:

* compares each candidate to each team member
* marks each pair as `strong`, `moderate`, `weak`, or `friction`
* weights the critical relationship more heavily
* produces a `team_fit_score` from 0–10
* explains overall team impact (`stabilize`, `complement`, `neutral`, `disrupt`)
* returns combination risk and integration timeline

This agent does not evaluate technical competence.

---

## Python Scoring Step

Purpose:
Compute final numerical score outputs from the structured agent results.

### Step 1 — Scenario-weighted score

For each candidate:

`scenario_weighted_score = sum(raw criterion score × scenario-adjusted weight)`

Inputs:

* Agent 2 candidate scores
* Agent 3 adjusted weights

### Step 2 — Final BREMO score

For each candidate:

`bremo_score = (scenario_weighted_score × 0.75) + (team_fit_score × 0.25)`

Inputs:

* Python scenario-weighted results
* Agent 5 team fit scores

Python is the source of truth for:

* `scenario_weighted_score`
* `team_fit_score`
* `bremo_score`
* final rank order

---

## Agent 6 — Decision Agent

Purpose:
Explain the ranked output and turn it into a committee-ready recommendation.

What it does:

* consumes the Python ranking as source of truth
* explains why each candidate landed where they did
* gives full reasoning for the top 5
* builds top-5 intelligence breakdowns
* compares fastest available vs best fit
* compares #1 vs #2 directly
* produces confidence assessment and data gaps

This agent does not recalculate scores.

---

## Agent 7 — Challenger Agent

Purpose:
Pressure-test the recommendation before an offer is made.

What it does:

* challenges evidence quality
* challenges scenario dependency
* checks for underrated candidates
* flags team-dynamics failure modes
* flags practical hiring risks
* assigns stability labels to top candidates
* tells HR what must be verified before proceeding

This agent does not change ranking or scores.

---

## Agent 8 — Summary Agent

Purpose:
Convert the final outputs into a clean executive brief and a UI payload.

What it does:

* writes the final boardroom summary
* assembles the UI payload for the result screen
* fills any missing top-5 UI detail using fallback data from upstream agents
* computes display-only fields such as radar profile and confidence label

This is the final presentation layer.

---

## 4. Source of Truth by Layer

### Agent 1 is source of truth for:

* role title
* 10 criteria
* default weights
* role-critical factors
* criteria categories

### Agent 2 is source of truth for:

* raw per-criterion candidate scores
* evidence and evidence tier
* base weighted total

### Agent 3 is source of truth for:

* scenario name
* scenario pressures
* adjusted weights
* scenario risk profile

### Agent 4 is source of truth for:

* candidate composite labels
* leadership style/archetype profiles
* team profiles

### Agent 5 is source of truth for:

* team fit score
* per-member compatibility
* overall team impact
* integration risk and timeline

### Python is source of truth for:

* scenario-weighted score
* BREMO score
* final ranking order

### Agent 6 is source of truth for:

* ranking explanation
* top-5 reasoning
* speed-vs-fit analysis
* #1 vs #2 trade-off
* confidence assessment

### Agent 7 is source of truth for:

* challenge lens
* stability labels
* verification requirements
* major execution risks

### Agent 8 is source of truth for:

* final executive brief
* final UI payload

---

## 5. High-Level Data Flow

### Inputs from UI

* role / JD / hiring brief
* team selection
* scenario selection / scenario text
* internal candidate selection
* external CVs / structured candidate files

### Pipeline flow

1. Agent 1 creates the 10-criterion role framework
2. Agent 2 scores all candidates against the framework
3. Agent 3 adjusts the criterion weights for the selected scenario
4. Agent 4 builds leadership profiles for candidates and team
5. Agent 5 calculates team interaction fit
6. Python computes scenario-weighted score and final BREMO score
7. Agent 6 explains the ranking and trade-offs
8. Agent 7 challenges the recommendation and flags fragility
9. Agent 8 packages everything into executive brief + UI payload

---

## 6. Result Page Structure

## A. Top strip

Displays search context:

* role
* team
* scenario
* edit / new search controls

## B. Speed vs Fit Analysis

Shows:

* best-fit candidate
* fastest-available candidate
* score difference
* notice period trade-off

This is the committee’s first operational reality check.

## C. Ranked candidate list

Left column shows ranked candidates with:

* rank
* name
* internal/external badge
* short descriptor
* short rationale snippet
* score

This acts as the navigation rail for the deeper detail view.

## D. Candidate detail panel

For the selected candidate, the center/right panel shows:

* candidate name, role, label, score
* AI rationale
* intelligence breakdown bars
* competency radar
* challenger dissent
* mitigation strategy
* core strengths
* risk flags
* agentic deliberation trace
* recommended protocol

---

## 7. UI Field Mapping

## Speed vs Fit card

Derived from Agent 6:

* fastest available
* best fit
* gap summary

## Candidate list cards

Primarily from Agent 6:

* rank
* name
* type
* label
* score
* short summary

## AI rationale panel

From Agent 8 synthesis using Agent 6 reasoning.

## Intelligence breakdown

Built from:

* Agent 6 if present
* otherwise Agent 2 + Agent 3 + Agent 1 fallback

## Competency radar

Computed in Agent 8 from:

* Agent 1 criterion categories
* criterion score percentages
* scenario-weighted score
* team-fit score

## Challenger dissent

Built from Agent 7 concerns.

## Mitigation strategy

Built from Agent 7 recommended actions.

## Core strengths

Primarily from Agent 6.

## Risk flags

Merged from:

* Agent 6 risks
* Agent 7 practical risk flags
* Agent 7 team-dynamics concerns when relevant

## Deliberation trace

Assembled in Agent 8 from upstream agent conclusions.

## Recommended protocol

Built from Agent 7’s concrete verification and mitigation actions.

---

## 8. Scoring Logic Summary

### Role fit base scores

Created by Agent 2 using Agent 1 criteria.

### Scenario fit

Created by applying Agent 3 adjusted weights to Agent 2 raw criterion scores.

### Team fit

Created by Agent 5 as a separate 0–10 score.

### Final score

`BREMO = (scenario_weighted_score × 0.75) + (team_fit_score × 0.25)`

This final score determines the ranking.

---

## 9. Why This Architecture Works

This design separates concerns cleanly:

* one agent defines what matters
* one agent scores candidate fit
* one agent adjusts priorities for context
* one agent models leadership behavior
* one agent models team interaction
* Python owns the math
* one agent explains the result
* one agent attacks the result
* one agent packages it for humans

That makes the system easier to debug, easier to trust, and easier to show in a committee setting.

---

## 10. Guardrails

To keep the system reliable:

* Agent 1 must always output exactly 10 criteria
* Agent 3 must always return all 10 adjusted weights
* emergent criteria must remain advisory-only
* Python must remain the only source of truth for final rank and score
* Agent 6 must explain, not recompute
* Agent 7 must challenge, not rerank
* Agent 8 must package, not invent

---

## 11. Current Product Narrative

In plain English, Bremo answers:

* Who is the best candidate for this role?
* Who fits this scenario best right now?
* Who fits the team best?
* What are we missing if we hire the current #1?
* Who is the fastest safe option?
* How fragile is the recommendation?
* What should HR verify before moving?

That is why the output feels closer to a hiring committee brief than a simple ranking dashboard.


## CV Upload & Data Flow

External CVs are uploaded through the Lovable frontend and sent to an n8n webhook.  
n8n runs on Railway, where it handles CV parsing, normalization, and workflow orchestration.  
Each uploaded applicant is converted into the same structured schema used across the system, so internal and external candidates can be evaluated consistently.  

The repo includes `bremo_v2.json`, which contains the required structured fields for candidates, team context, scenarios, and analysis inputs. This acts as the source data contract for the pipeline and ensures every agent receives clean, predictable input.
