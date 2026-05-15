/**
 * Logging utilities for LazyBob
 */

import chalk from 'chalk';
import type { LogEntry } from '../types/index.js';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Logger configuration
 */
export interface LoggerConfig {
  level: LogLevel;
  enableColors: boolean;
  enableTimestamp: boolean;
}

/**
 * Default logger configuration
 */
const defaultConfig: LoggerConfig = {
  level: (process.env.LOG_LEVEL as LogLevel) || 'info',
  enableColors: true,
  enableTimestamp: true,
};

/**
 * Log level priorities
 */
const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Logger class
 */
export class Logger {
  private config: LoggerConfig;
  private history: LogEntry[] = [];

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Check if a log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.level];
  }

  /**
   * Format log message
   */
  private format(level: LogLevel, message: string, context?: Record<string, unknown>): string {
    const parts: string[] = [];

    // Timestamp
    if (this.config.enableTimestamp) {
      const timestamp = new Date().toISOString();
      parts.push(this.config.enableColors ? chalk.gray(timestamp) : timestamp);
    }

    // Level
    const levelStr = level.toUpperCase().padEnd(5);
    if (this.config.enableColors) {
      const coloredLevel = {
        debug: chalk.blue(levelStr),
        info: chalk.green(levelStr),
        warn: chalk.yellow(levelStr),
        error: chalk.red(levelStr),
      }[level];
      parts.push(coloredLevel);
    } else {
      parts.push(levelStr);
    }

    // Message
    parts.push(message);

    // Context
    if (context && Object.keys(context).length > 0) {
      const contextStr = JSON.stringify(context, null, 2);
      parts.push(this.config.enableColors ? chalk.gray(contextStr) : contextStr);
    }

    return parts.join(' ');
  }

  /**
   * Log a message
   */
  private log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context,
    };

    this.history.push(entry);

    const formatted = this.format(level, message, context);
    
    if (level === 'error') {
      console.error(formatted);
    } else if (level === 'warn') {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: Record<string, unknown>): void {
    this.log('debug', message, context);
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, unknown>): void {
    this.log('info', message, context);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, unknown>): void {
    this.log('warn', message, context);
  }

  /**
   * Log error message
   */
  error(message: string, context?: Record<string, unknown>): void {
    this.log('error', message, context);
  }

  /**
   * Get log history
   */
  getHistory(): LogEntry[] {
    return [...this.history];
  }

  /**
   * Clear log history
   */
  clearHistory(): void {
    this.history = [];
  }

  /**
   * Set log level
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  /**
   * Get current log level
   */
  getLevel(): LogLevel {
    return this.config.level;
  }
}

/**
 * Default logger instance
 */
export const logger = new Logger();

/**
 * Create a new logger instance
 */
export function createLogger(config?: Partial<LoggerConfig>): Logger {
  return new Logger(config);
}

// Made with Bob
