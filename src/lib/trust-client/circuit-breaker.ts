import { logger } from "@/lib/logger";

/** Circuit breaker states per CON-001 §3.1. */
type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

/** Circuit breaker configuration per CON-001 §3.1. */
interface CircuitBreakerConfig {
  /** Max requests to track for error rate calculation. */
  volumeThreshold: number;
  /** Error percentage to trip the breaker (0-100). */
  errorThresholdPercentage: number;
  /** Milliseconds before OPEN → HALF_OPEN. */
  resetTimeout: number;
  /** Request timeout in milliseconds. */
  timeout: number;
}

/** Default config per CON-001 §3.1. */
const DEFAULT_CONFIG: CircuitBreakerConfig = {
  volumeThreshold: 5,
  errorThresholdPercentage: 50,
  resetTimeout: 30_000,
  timeout: 5_000,
};

/** Circuit breaker wrapping async functions. Tracks error rate and trips when threshold exceeded. */
export class CircuitBreaker {
  private state: CircuitState = "CLOSED";
  private failures = 0;
  private successes = 0;
  private lastFailureTime = 0;
  private readonly config: CircuitBreakerConfig;

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /** Execute a function through the circuit breaker. */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime >= this.config.resetTimeout) {
        this.state = "HALF_OPEN";
        logger.info({ state: "HALF_OPEN" }, "trust.circuit_breaker.transition");
      } else {
        throw new CircuitBreakerError("Trust service unavailable (circuit open)");
      }
    }

    try {
      const result = await Promise.race([
        fn(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new CircuitBreakerError("Trust service timeout")), this.config.timeout)
        ),
      ]);
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  private onSuccess(): void {
    this.successes++;
    if (this.state === "HALF_OPEN") {
      this.state = "CLOSED";
      this.failures = 0;
      this.successes = 0;
      logger.info({ state: "CLOSED" }, "trust.circuit_breaker.transition");
    }
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    const total = this.failures + this.successes;
    if (total >= this.config.volumeThreshold) {
      const errorRate = (this.failures / total) * 100;
      if (errorRate >= this.config.errorThresholdPercentage) {
        this.state = "OPEN";
        logger.warn({ errorRate, failures: this.failures, total }, "trust.circuit_breaker.tripped");
      }
    }
  }

  /** Get current circuit state (for testing/monitoring). */
  getState(): CircuitState {
    return this.state;
  }

  /** Reset circuit to CLOSED (for testing). */
  reset(): void {
    this.state = "CLOSED";
    this.failures = 0;
    this.successes = 0;
    this.lastFailureTime = 0;
  }
}

/** Error thrown when circuit breaker is open or request times out. */
export class CircuitBreakerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitBreakerError";
  }
}
