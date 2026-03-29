

## Fix: Parse n8n's `output` wrapper

The n8n webhook returns `{ "output": "<stringified JSON>" }` instead of raw JSON. The app needs to unwrap and parse that inner string.

### Changes

**`src/lib/api.ts`** — After parsing the response JSON, check if the result has an `output` string field. If so, parse that inner string to get the actual payload. Include cleanup for markdown code fences and trailing comma fixes.

**`src/lib/validateSummaryResult.ts`** — No changes needed; once the unwrapping is done in `api.ts`, validation will receive the correct shape.

### Technical Detail

```
n8n returns:  { "output": "{\"decision_brief\": {...}, \"ui_payload\": {...}}" }
We need:      { "decision_brief": {...}, "ui_payload": {...} }
```

In `submitIntake`, after the initial `JSON.parse(text)`, add:

1. If result is an object with a string `output` property, `JSON.parse(result.output)` (with markdown/trailing-comma cleanup)
2. If result is an array, take the first element and repeat the check
3. Return the unwrapped object

This is a single-file change in `src/lib/api.ts`.

