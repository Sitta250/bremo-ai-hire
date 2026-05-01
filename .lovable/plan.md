## Changes in `src/lib/api.ts`

1. **Update webhook URL** to `https://n8n-production-1d1e.up.railway.app/webhook/850910a7-8203-4499-a10a-e04ab736dccd`

2. **Add a 15-minute fetch timeout** using `AbortController` so the frontend waits up to 15 minutes for n8n to respond before giving up.

3. **Keep retries at 3** but the long timeout per attempt means the system will patiently wait for slow AI processing.