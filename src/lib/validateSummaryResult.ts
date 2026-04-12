import type { SummaryResult } from "./types";

/**
 * Validates the shape of the Summary Agent response.
 * Throws a clear error if required fields are missing.
 * Returns the typed SummaryResult on success.
 */
export function validateSummaryResult(data: unknown): SummaryResult {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid Summary Agent response format");
  }

  const result = data as Record<string, unknown>;


  if (!result.ui_payload || typeof result.ui_payload !== "object") {
    throw new Error("Invalid Summary Agent response format: missing ui_payload");
  }

  const uiPayload = result.ui_payload as Record<string, unknown>;

  if (!uiPayload.header || typeof uiPayload.header !== "object") {
    throw new Error(
      "Invalid Summary Agent response format: missing ui_payload.header"
    );
  }

  if (!Array.isArray(uiPayload.candidates)) {
    throw new Error(
      "Invalid Summary Agent response format: ui_payload.candidates must be an array"
    );
  }

  return data as SummaryResult;
}
