/**
 * Custom error classes for LazyBob
 */

/**
 * Base application error class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      stack: this.stack,
    };
  }
}

/**
 * Bob API related errors
 */
export class BobAPIError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'BOB_API_ERROR', context);
    this.name = 'BobAPIError';
  }
}

/**
 * Rate limit exceeded error
 */
export class RateLimitError extends AppError {
  constructor(
    message: string = 'Rate limit exceeded',
    public readonly retryAfter?: number,
    context?: Record<string, unknown>
  ) {
    super(message, 'RATE_LIMIT_ERROR', { ...context, retryAfter });
    this.name = 'RateLimitError';
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', context?: Record<string, unknown>) {
    super(message, 'AUTHENTICATION_ERROR', context);
    this.name = 'AuthenticationError';
  }
}

/**
 * Bobcoin exhausted error
 */
export class BobcoinExhaustedError extends AppError {
  constructor(message: string = 'Bobcoins exhausted', context?: Record<string, unknown>) {
    super(message, 'BOBCOIN_EXHAUSTED', context);
    this.name = 'BobcoinExhaustedError';
  }
}

/**
 * Code analysis related errors
 */
export class AnalysisError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'ANALYSIS_ERROR', context);
    this.name = 'AnalysisError';
  }
}

/**
 * Parse error during code analysis
 */
export class ParseError extends AppError {
  constructor(
    message: string,
    public readonly file: string,
    public readonly line?: number,
    context?: Record<string, unknown>
  ) {
    super(message, 'PARSE_ERROR', { ...context, file, line });
    this.name = 'ParseError';
  }
}

/**
 * File access error
 */
export class FileAccessError extends AppError {
  constructor(
    message: string,
    public readonly path: string,
    context?: Record<string, unknown>
  ) {
    super(message, 'FILE_ACCESS_ERROR', { ...context, path });
    this.name = 'FileAccessError';
  }
}

/**
 * Validation related errors
 */
export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', context);
    this.name = 'ValidationError';
  }
}

/**
 * Configuration error
 */
export class ConfigError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'CONFIG_ERROR', context);
    this.name = 'ConfigError';
  }
}

/**
 * Input validation error
 */
export class InputError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'INPUT_ERROR', context);
    this.name = 'InputError';
  }
}

/**
 * Check if error is an instance of AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Check if error is a Bob API error
 */
export function isBobAPIError(error: unknown): error is BobAPIError {
  return error instanceof BobAPIError;
}

/**
 * Check if error is a rate limit error
 */
export function isRateLimitError(error: unknown): error is RateLimitError {
  return error instanceof RateLimitError;
}

/**
 * Format error for logging
 */
export function formatError(error: unknown): string {
  if (isAppError(error)) {
    return JSON.stringify(error.toJSON(), null, 2);
  }
  
  if (error instanceof Error) {
    return `${error.name}: ${error.message}\n${error.stack}`;
  }
  
  return String(error);
}

// Made with Bob
