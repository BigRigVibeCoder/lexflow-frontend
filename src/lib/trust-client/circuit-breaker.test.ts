import { describe, it, expect, vi, beforeEach } from "vitest";
vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } }));
import { CircuitBreaker, CircuitBreakerError } from "./circuit-breaker";

describe("CircuitBreaker", () => {
  let cb: CircuitBreaker;
  beforeEach(() => { cb = new CircuitBreaker({ volumeThreshold: 3, errorThresholdPercentage: 50, resetTimeout: 100, timeout: 1000 }); });

  it("allows calls when CLOSED", async () => {
    const result = await cb.execute(() => Promise.resolve("ok"));
    expect(result).toBe("ok");
    expect(cb.getState()).toBe("CLOSED");
  });

  it("trips to OPEN after threshold failures", async () => {
    const fail = () => cb.execute(() => Promise.reject(new Error("fail"))).catch(() => {});
    await fail(); await fail(); await fail();
    expect(cb.getState()).toBe("OPEN");
  });

  it("rejects immediately when OPEN", async () => {
    const fail = () => cb.execute(() => Promise.reject(new Error("fail"))).catch(() => {});
    await fail(); await fail(); await fail();
    await expect(cb.execute(() => Promise.resolve("ok"))).rejects.toThrow(CircuitBreakerError);
  });

  it("transitions to HALF_OPEN after resetTimeout", async () => {
    const fail = () => cb.execute(() => Promise.reject(new Error("fail"))).catch(() => {});
    await fail(); await fail(); await fail();
    await new Promise(r => setTimeout(r, 150));
    const result = await cb.execute(() => Promise.resolve("ok"));
    expect(result).toBe("ok");
    expect(cb.getState()).toBe("CLOSED");
  });

  it("resets state", () => {
    cb.reset();
    expect(cb.getState()).toBe("CLOSED");
  });
});
