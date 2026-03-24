/**
 * @file api/health/__tests__/route.test.ts
 * @description Unit tests for the health check endpoint.
 *
 * Validates that GET /api/health returns the expected JSON structure
 * per SPR-001 T-002 acceptance criteria.
 *
 * REF: SPR-001 T-002 (health endpoint acceptance criteria)
 * REF: GOV-002 (testing protocol)
 */

import { describe, it, expect } from "vitest";
import { GET } from "../route";

describe("GET /api/health", () => {
  it("returns 200 with status ok and a valid ISO timestamp", async () => {
    const response = GET();

    /* Assert: response is 200 */
    expect(response.status).toBe(200);

    /* Assert: body matches expected shape */
    const body = await response.json() as { status: string; timestamp: string };
    expect(body.status).toBe("ok");
    expect(body.timestamp).toBeDefined();

    /* Assert: timestamp is valid ISO 8601 */
    const parsed = new Date(body.timestamp);
    expect(parsed.toISOString()).toBe(body.timestamp);
  });

  it("returns a timestamp close to the current time", async () => {
    const before = Date.now();
    const response = GET();
    const after = Date.now();

    const body = await response.json() as { timestamp: string };
    const responseTime = new Date(body.timestamp).getTime();

    /* Assert: timestamp is within the test execution window */
    expect(responseTime).toBeGreaterThanOrEqual(before);
    expect(responseTime).toBeLessThanOrEqual(after);
  });
});
