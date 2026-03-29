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

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Read as text first so we can show a useful error if the body is empty or not valid JSON
  const text = await response.text();

  if (!response.ok) {
    const err = new Error(
      `Webhook request failed: ${response.status} ${response.statusText}` +
      (text ? `\n\nResponse body: ${text.slice(0, 500)}` : " (empty body)")
    );
    (err as Error & { status: number }).status = response.status;
    throw err;
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
