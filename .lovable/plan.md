

## Remove Timeout on Webhook Call

**Change**: In `src/lib/api.ts`, remove the `AbortController` timeout so the fetch call waits indefinitely for n8n to respond.

### Technical Details
- Remove the `AbortController`, `setTimeout`, and `clearTimeout` logic
- Remove the timeout-specific error handling branch
- Keep the other error handling (network/CORS errors, HTTP errors, empty response, invalid JSON)

**File**: `src/lib/api.ts`

