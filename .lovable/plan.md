

## Problem

The `fetch` call to n8n likely fails due to infrastructure-level timeouts (browser, proxy, or CDN typically cut connections after 1-2 minutes). When that happens, the `catch` block fires and sets `setState("intake")`, bouncing the user back to the form — making it look like the UI "rushed" past loading.

## Solution

Add automatic retry with exponential backoff in `submitIntake`. If a network error occurs (not an HTTP error response), retry the request instead of throwing. This keeps the loading screen visible while n8n processes.

## Changes

### `src/lib/api.ts`
- Wrap the `fetch` call in a retry loop (up to 60 retries, ~15+ minutes total coverage)
- Only retry on network errors (`Failed to fetch`, `AbortError`, connection reset) — NOT on HTTP error responses (4xx/5xx)
- Add a small delay between retries (5 seconds) to avoid hammering the endpoint
- Keep all existing unwrap/parse logic unchanged

### `src/pages/Index.tsx`
- In the `catch` block of `handleSubmit`: instead of immediately going to `setState("intake")`, only do so for non-retryable errors (the retry logic in api.ts will handle transient failures)
- No change needed if api.ts handles retries internally (it won't throw until all retries exhausted)

## Technical Detail

```text
Attempt 1: fetch → network error (timeout after ~60s)
  wait 5s
Attempt 2: fetch → network error
  wait 5s
...
Attempt N: fetch → 200 OK with result → return parsed data
```

This gives ~15 minutes of patience before finally throwing. The loading screen stays visible throughout because `submitIntake` only resolves/rejects after all retries.

