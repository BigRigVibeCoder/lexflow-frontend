/**
 * @file errors.ts
 * @description Structured error handling infrastructure for LexFlow Web Service.
 *
 * Implements GOV-004 §3.2 — ApplicationError base class with ErrorContext.
 * All application errors MUST extend this class. No bare string throws allowed.
 *
 * Used by: all API routes, middleware, tRPC procedures.
 *
 * READING GUIDE FOR INCIDENT RESPONDERS:
 * 1. If you see UNKNOWN category errors  → check if new error types need classification
 * 2. If error IDs are missing            → check ErrorContext instantiation
 * 3. If correlation IDs are missing      → check middleware pipeline
 *
 * REF: GOV-004 §2 (error taxonomy)
 * REF: GOV-004 §3.2 (TypeScript implementation)
 */

import { randomUUID } from "crypto";

/* ─── Error Category Taxonomy (GOV-004 §2) ─────────────────────────── */

/**
 * 13-category error taxonomy per GOV-004 §2.
 * Every error MUST be classified into one of these categories.
 * The category drives retry strategy and severity mapping.
 *
 * REF: GOV-004 §2 (error taxonomy)
 * REF: GOV-004 §3.1 (severity mapping)
 */
export enum ErrorCategory {
  /** Bad input — wrong type, missing field, out of range */
  VALIDATION = "VALIDATION",
  /** Domain rule violation — duplicate entry, invalid state */
  BUSINESS_LOGIC = "BUSINESS_LOGIC",
  /** Third-party API failure — timeout, 5xx */
  EXTERNAL_SERVICE = "EXTERNAL_SERVICE",
  /** Data layer failure — connection lost, lock timeout */
  DATABASE = "DATABASE",
  /** Missing resource — file not found, model missing */
  RESOURCE = "RESOURCE",
  /** System exhaustion — OOM, disk full, port in use */
  INFRASTRUCTURE = "INFRASTRUCTURE",
  /** Invalid startup config — parse failure, missing env var */
  CONFIGURATION = "CONFIGURATION",
  /** Connection failure, DNS resolution, TLS errors */
  NETWORK = "NETWORK",
  /** Auth failure, permission denied, token expired */
  SECURITY = "SECURITY",
  /** Sensor/actuator failure, device timeout */
  HARDWARE = "HARDWARE",
  /** Unrecoverable — data corruption, safety breach */
  FATAL = "FATAL",
  /** Temporary glitch — noise, blip, race condition */
  TRANSIENT = "TRANSIENT",
  /** Uncaught generic exception */
  UNKNOWN = "UNKNOWN",
}

/* ─── Error Context (GOV-004 §3.2) ────────────────────────────────── */

/**
 * Structured context attached to every application error.
 * Carries enough information for forensic debugging without secrets.
 *
 * REF: GOV-004 §3.2 (TypeScript ErrorContext)
 * REF: GOV-004 §8 (correlation IDs)
 */
export interface ErrorContext {
  /** Unique error identifier for tracing. Format: `err-{12 hex chars}` */
  readonly errorId: string;
  /** Error category from the 13-category taxonomy */
  readonly category: ErrorCategory;
  /** The operation that was being performed (e.g., "user.login") */
  readonly operation?: string;
  /** The component/module that generated the error */
  readonly component?: string;
  /** Request correlation ID from GOV-004 §8 */
  readonly correlationId?: string;
  /** Sanitized input data — NO secrets, passwords, or tokens */
  readonly inputData?: Record<string, unknown>;
  /** Whether this error can be retried */
  readonly retryable: boolean;
}

/* ─── Application Error Base Class ─────────────────────────────────── */

/** Maximum length for error IDs. */
const ERROR_ID_PREFIX_LENGTH = 12;

/**
 * Generate a unique error ID.
 *
 * PRECONDITION: crypto.randomUUID available (Node 19+).
 * POSTCONDITION: Returns string in format `err-{12hexchars}`.
 */
function generateErrorId(): string {
  return `err-${randomUUID().replaceAll("-", "").slice(0, ERROR_ID_PREFIX_LENGTH)}`;
}

/**
 * Base error class for all LexFlow application errors.
 *
 * All custom exceptions MUST extend this class. Bare `throw new Error()`
 * is forbidden in application code per GOV-004 §3.
 *
 * FAILURE MODE: If this class itself fails to construct, the global
 * exception handler (GOV-004 §4.2) catches it as an unhandled exception.
 * BLAST RADIUS: Error context would be missing from logs.
 * MITIGATION: Constructor uses safe defaults for all fields.
 *
 * @example
 * ```ts
 * throw new ApplicationError("User not found", {
 *   category: ErrorCategory.RESOURCE,
 *   operation: "user.getById",
 *   component: "user-service",
 *   retryable: false,
 * });
 * ```
 */
export class ApplicationError extends Error {
  public readonly context: ErrorContext;
  public override readonly cause?: Error;

  constructor(
    message: string,
    context: Partial<ErrorContext> = {},
    cause?: Error,
  ) {
    super(message);
    this.name = "ApplicationError";
    this.context = {
      errorId: generateErrorId(),
      category: ErrorCategory.UNKNOWN,
      retryable: false,
      ...context,
    };
    this.cause = cause;
  }
}

/* ─── Structured Error Response Helper ─────────────────────────────── */

/**
 * Shape of a structured error response returned by API routes.
 * REF: GOV-004 §3.2 (structured error responses)
 */
export interface StructuredErrorResponse {
  readonly error: {
    readonly message: string;
    readonly errorId: string;
    readonly category: ErrorCategory;
    readonly correlationId?: string;
  };
}

/**
 * Convert an ApplicationError into a structured JSON response body.
 *
 * PRECONDITION: error is an ApplicationError instance.
 * POSTCONDITION: Returns a sanitized error response (no stack traces or secrets).
 * SIDE EFFECTS: None.
 *
 * @param error - The application error to convert
 * @returns Structured error response suitable for HTTP response body
 *
 * @example
 * ```ts
 * const body = toErrorResponse(new ApplicationError("Not found", {
 *   category: ErrorCategory.RESOURCE,
 * }));
 * return Response.json(body, { status: 404 });
 * ```
 */
export function toErrorResponse(error: ApplicationError): StructuredErrorResponse {
  return {
    error: {
      message: error.message,
      errorId: error.context.errorId,
      category: error.context.category,
      correlationId: error.context.correlationId,
    },
  };
}
