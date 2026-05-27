/**
 * bridge.ts - Handles the data handoff between the Reality Check diagnostic
 * and the Wealth Blueprint Operating System.
 */

import { FinancialData, CalculationResult } from "@/types";

interface BridgePayload {
  name: string;
  tier: string;
  persona: string;
  weakness: string;
  score: number;
  goal: string;
}

/**
 * Generates a personalized URL for the Wealth Blueprint.
 * Encodes critical user data into the query string to allow the LP to personalize
 * its content based on the "humbling" that occurred in the Reality Check.
 */
export function generateBlueprintLink(baseUrl: string, userData: FinancialData, result: CalculationResult) {
  const payload: BridgePayload = {
    name: userData.firstName,
    tier: result.tier,
    persona: result.persona,
    weakness: result.weakness,
    score: result.score,
    goal: userData.goal,
  };

  // We use a simple query param approach for now as the LP can easily parse it.
  // For a production system, we might use a signed JWT or a temporary DB record.
  const params = new URLSearchParams({
    u: btoa(JSON.stringify(payload)), // Base64 encode the payload to keep the URL cleaner
    ref: 'reality-check'
  });

  return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'} ${params.toString()}`;
}

/**
 * Maps a financial persona or tier to a specific anchor/section on the Blueprint LP.
 * This ensures the user lands exactly where their "pain" is addressed.
 */
export function getPersonaAnchor(tier: string, persona: string): string {
  const anchorMap: Record<string, string> = {
    'SURVIVING': '#audit',
    'STABLE': '#value-stack',
    'COMFORTABLE': '#accelerator',
    'RICH': '#dashboard-preview',
  };

  // Use tier as the primary anchor, but can be expanded to a full persona map
  return anchorMap[tier] || '#hero';
}
