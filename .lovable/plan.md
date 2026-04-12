

## Problem

The app is sending requests to `https://n8n-production-c2b0.up.railway.app/webhook/evaluate-candidates` instead of the test URL `https://n8n-production-c2b0.up.railway.app/webhook-test/850910a7-8203-4499-a10a-e04ab736dccd`.

The `.env` file has no `VITE_N8N_WEBHOOK_URL` set, so the fallback in `api.ts` should apply — but the deployed build appears to have a stale/cached value. The `/webhook/evaluate-candidates` URL isn't anywhere in the current codebase.

## Fix

**1. Hardcode the correct URL directly in `src/lib/api.ts`** (remove reliance on env var for now)

Change line 11 from:
```ts
const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL || "https://n8n-production-c2b0.up.railway.app/webhook-test/850910a7-8203-4499-a10a-e04ab736dccd";
```
to:
```ts
const webhookUrl = "https://n8n-production-c2b0.up.railway.app/webhook-test/850910a7-8203-4499-a10a-e04ab736dccd";
```

This eliminates any possibility of a stale env var override. Once you move to production, we'll switch it back to use an env var with `/webhook/` path.

**2. Also reduce retry aggressiveness** — currently 180 retries × 5s = 15 minutes of retrying on failure. Since n8n is in test mode and will only respond while you're watching, reduce to 3 retries so errors surface quickly.

## Result
Requests will go to the correct test webhook URL. Errors will surface in ~15 seconds instead of 15 minutes.

