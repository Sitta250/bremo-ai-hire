/**
 * Submits the intake payload to the n8n webhook and returns the raw JSON response.
 * If VITE_USE_MOCK === "true", returns local mock data instead of calling the webhook.
 */
export async function submitIntake(payload: unknown): Promise<unknown> {
  if (import.meta.env.VITE_USE_MOCK === "true") {
    const { mockSummaryResult } = await import("@/data/mockSummaryResult");
    return mockSummaryResult;
  }

  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error(
      "VITE_N8N_WEBHOOK_URL is not defined. Add it to your .env.local file."
    );
  }

  let response: Response;
  try {
    response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err: unknown) {
    throw new Error(
      "Could not reach the n8n webhook. Check that:\n" +
      "1. Your n8n workflow is Active (not just in Test mode)\n" +
      '2. The webhook URL uses /webhook/ (not /webhook-test/)\n' +
      "3. The n8n server is running and accessible\n\n" +
      `Original error: ${err instanceof Error ? err.message : String(err)}`
    );
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

  return unwrap(result);
}
