/**
 * Type definitions for Bob Integration
 */

/**
 * Bob client configuration
 */
export interface BobClientConfig {
  apiKey: string;
  teamId: string;
  endpoint?: string;
}

/**
 * Bob request options
 */
export interface BobRequest {
  prompt: string;
  context?: string;
  mode?: 'code' | 'plan' | 'ask' | 'advanced';
  files?: string[];
  maxTokens?: number;
  temperature?: number;
}

/**
 * Bob response
 */
export interface BobResponse {
  content: string;
  bobcoinsUsed: number;
  sessionId: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Bob session information
 */
export interface BobSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  bobcoinsUsed: number;
  tasks: BobTask[];
  mode?: string;
}

/**
 * Bob task information
 */
export interface BobTask {
  id: string;
  description: string;
  mode: string;
  bobcoinsUsed: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
}

/**
 * Bobcoin usage tracking
 */
export interface BobcoinUsage {
  total: number;
  used: number;
  remaining: number;
  percentage: number;
  lastUpdated: Date;
}

/**
 * Session export options
 */
export interface SessionExportOptions {
  sessionId: string;
  outputPath: string;
  includeScreenshot?: boolean;
  format?: 'markdown' | 'json';
}

/**
 * Rate limit information
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: Date;
}

// Made with Bob
