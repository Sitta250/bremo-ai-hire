

## Plan: Make UI resilient to icon and field variations

### Why
Instead of forcing n8n to match exact icon names, add a fallback so unknown icons render a default icon instead of crashing. Also accept `scenario_snippet` as an alias for `evidence_snippet`.

### Changes

**1. `src/components/DeliberationTrace.tsx`**
- Add a default/fallback icon (e.g. `CircleDot` from lucide) for any `agent_icon` value not in the map
- When looking up `Icon`, use `ICON_MAP[entry.agent_icon] ?? FallbackIcon`
- Same for dot color: fall back to `"bg-primary"`

**2. `src/lib/types.ts`**
- Change `agent_icon` type from the strict union to `string` so validation doesn't reject unknown values

**3. `src/lib/validateSummaryResult.ts`** (if icon validation exists)
- Remove or relax any strict icon value checks

**4. Normalize `scenario_snippet` → `evidence_snippet`**
- In the response parsing logic (`src/lib/api.ts` or wherever the n8n response is processed), map `scenario_snippet` to `evidence_snippet` if the latter is missing on any intelligence_breakdown entry

### Result
- Unknown icons show a neutral dot instead of crashing
- `scenario_snippet` works as a fallback for `evidence_snippet`
- No n8n changes required for these two issues

