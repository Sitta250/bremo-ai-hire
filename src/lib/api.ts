/**
 * Submits the intake payload to the n8n webhook and returns the raw JSON response.
 * If VITE_USE_MOCK === "true", returns local mock data instead of calling the webhook.
 */
export async function submitIntake(payload: unknown): Promise<unknown> {
  if (import.meta.env.VITE_USE_MOCK === "true") {
    const { mockSummaryResult } = await import("@/data/mockSummaryResult");
    return mockSummaryResult;
  }

  const webhookUrl = "https://n8n-production-1d1e.up.railway.app/webhook/850910a7-8203-4499-a10a-e04ab736dccd";
  if (!webhookUrl) {
    throw new Error(
      "VITE_N8N_WEBHOOK_URL is not defined. Add it to your .env.local file."
    );
  }

  const MAX_RETRIES = 3;
  const RETRY_DELAY_MS = 5000;
  const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

  let response: Response | undefined;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
      response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      break; // success — exit retry loop
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const isNetworkError =
        msg.includes("Failed to fetch") ||
        msg.includes("NetworkError") ||
        msg.includes("AbortError") ||
        msg.includes("ECONNRESET") ||
        msg.includes("ETIMEDOUT") ||
        msg.includes("timeout") ||
        msg.includes("network");

      if (isNetworkError && attempt < MAX_RETRIES - 1) {
        console.log(`[submitIntake] Network error on attempt ${attempt + 1}, retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
        continue;
      }

      throw new Error(
        "Could not reach the n8n webhook after multiple retries. Check that:\n" +
        "1. Your n8n workflow is Active (not just in Test mode)\n" +
        '2. The webhook URL uses /webhook/ (not /webhook-test/)\n' +
        "3. The n8n server is running and accessible\n\n" +
        `Original error: ${msg}`
      );
    }
  }

  if (!response) {
    throw new Error("No response received after all retry attempts.");
  }

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Webhook returned ${response.status} ${response.statusText}` +
      (text ? `\n\nResponse body: ${text.slice(0, 500)}` : " (empty body)")
    );
  }

  if (!text || text.trim() === "") {
    throw new Error(
      "n8n returned an empty response. Make sure your workflow has a 'Respond to Webhook' node that returns the JSON body."
    );
  }

  let result: unknown;
  try {
    result = JSON.parse(text);
  } catch {
    throw new Error(
      `n8n response is not valid JSON.\n\nReceived: ${text.slice(0, 500)}`
    );
  }

  // Unwrap n8n's { output: "<stringified JSON>" } wrapper
  const unwrap = (obj: unknown): unknown => {
    if (Array.isArray(obj) && obj.length > 0) {
      return unwrap(obj[0]);
    }
    if (obj && typeof obj === "object" && "output" in (obj as Record<string, unknown>)) {
      const raw = (obj as Record<string, unknown>).output;
      if (typeof raw === "string") {
        const cleaned = raw
          .replace(/```json\s*/gi, "")
          .replace(/```\s*/g, "")
          .trim()
          .replace(/,\s*}/g, "}")
          .replace(/,\s*]/g, "]");
        try {
          return JSON.parse(cleaned);
        } catch {
          throw new Error(`Failed to parse nested output JSON.\n\n${cleaned.slice(0, 500)}`);
        }
      }
    }
    return obj;
  };

  const normalized = unwrap(result);

  // Normalize scenario_snippet → evidence_snippet in intelligence_breakdown
  if (normalized && typeof normalized === "object") {
    const payload = (normalized as Record<string, unknown>).ui_payload;
    if (payload && typeof payload === "object") {
      const candidates = (payload as Record<string, unknown>).candidates;
      if (Array.isArray(candidates)) {
        for (const c of candidates) {
          if (c && Array.isArray(c.intelligence_breakdown)) {
            for (const ib of c.intelligence_breakdown) {
              if (ib && !ib.evidence_snippet && ib.scenario_snippet) {
                ib.evidence_snippet = ib.scenario_snippet;
                delete ib.scenario_snippet;
              }
            }
          }
        }
      }
    }
  }

  return normalized;
}
