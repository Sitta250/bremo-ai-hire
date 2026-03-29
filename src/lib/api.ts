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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120_000);

  let response: Response;
  try {
    response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error(
        "Request timed out after 120 seconds. The n8n workflow may be too slow or unreachable."
      );
    }
    // "Failed to fetch" — network or CORS error
    throw new Error(
      "Could not reach the n8n webhook. Check that:\n" +
      "1. Your n8n workflow is Active (not just in Test mode)\n" +
      '2. The webhook URL uses /webhook/ (not /webhook-test/)\n' +
      "3. The n8n server is running and accessible\n\n" +
      `Original error: ${err instanceof Error ? err.message : String(err)}`
    );
  } finally {
    clearTimeout(timeoutId);
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

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `n8n response is not valid JSON.\n\nReceived: ${text.slice(0, 500)}`
    );
  }
}
