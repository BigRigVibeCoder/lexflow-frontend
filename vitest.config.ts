/**
 * @file vitest.config.ts
 * @description Vitest configuration for LexFlow Frontend.
 *
 * Configures test environment, path aliases, and React plugin
 * per GOV-002 testing protocol. Tests run at TRACE log level
 * per GOV-006 §14.1.
 *
 * REF: GOV-002 (testing protocol)
 * REF: GOV-006 §14.1 (test log level)
 */

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/test/**", "src/**/*.d.ts"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
