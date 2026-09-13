import type { Page } from "@playwright/test";

export function ruleGlossHeaders(headers: Record<string, string>) {
  if (process.env.UI_TEST_RULE_GLOSS !== "1") return headers;
  return {
    ...headers,
    "x-groq-api-key": "gsk-invalid-ui-regression-fixture",
    "x-openai-api-key": "sk-invalid-ui-regression-fixture",
  };
}

/** Keep UI tests on the real signing pipeline without consuming LLM quota. */
export async function useRuleGlossWhenRequested(page: Page) {
  if (process.env.UI_TEST_RULE_GLOSS !== "1") return;
  await page.route("**/api/translate", route => route.continue({
    // Rejected test-only credentials exercise the supported rule fallback;
    // they never use the deployment account's paid model credentials.
    headers: ruleGlossHeaders(route.request().headers()),
  }));
}
