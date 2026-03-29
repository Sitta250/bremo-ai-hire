

## Fix "Failed to fetch" — Two Changes

### Problem
- The webhook URL (`/webhook-test/...`) only works when n8n editor is open in test mode
- The payload includes full data for 35 candidates, making it extremely large

### Plan

**Step 1: Add a timeout and better error handling to `src/lib/api.ts`**
- Wrap the fetch call with `AbortController` set to 120 seconds
- Catch network errors and show a user-friendly message distinguishing between:
  - Network/CORS errors ("Failed to fetch" → suggest checking n8n is running)
  - Timeout errors
  - HTTP errors from n8n

**Step 2: Add CORS-friendly error messaging**
- When the error is "Failed to fetch", display a specific message: "Could not reach the n8n webhook. Make sure your n8n workflow is active and the webhook URL uses `/webhook/` (not `/webhook-test/`)."

### Technical Details
- File changed: `src/lib/api.ts`
- No structural changes to the payload or UI components
- The timeout prevents the app from hanging indefinitely

### User Action Required
- In your n8n workflow, switch from **Test** mode to **Active** (toggle the workflow on)
- Update the webhook URL secret from `/webhook-test/evaluate-candidates` to `/webhook/evaluate-candidates`

