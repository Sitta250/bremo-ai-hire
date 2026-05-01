## Plan: Remove Competency Profile, expand Challenger's Dissent

**File: `src/components/ResultsView.tsx`** (lines ~200-235)

1. Remove the `<CompetencyRadar>` component call on line 201
2. Change the grid from `grid-cols-1 lg:grid-cols-2` to just a single column (remove grid entirely or use `grid-cols-1`)
3. The Challenger's Dissent block (lines 203-234) will now span the full width

Also remove the unused `CompetencyRadar` import on line 10.
