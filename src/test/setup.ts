/**
 * @file test/setup.ts
 * @description Global test setup for Vitest.
 *
 * Configures testing-library/jest-dom matchers and sets test log level
 * to TRACE per GOV-006 §14.1.
 *
 * REF: GOV-002 (testing protocol)
 * REF: GOV-006 §14.1 (test log level)
 */

import "@testing-library/jest-dom/vitest";

/* Set log level to TRACE during tests per GOV-006 §14.1 */
process.env.LOG_LEVEL = "trace";
process.env.SERVICE_NAME = "lexflow-web-test";
