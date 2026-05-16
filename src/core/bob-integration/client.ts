/**
 * Bob API Client Implementation
 *
 * Supports both real HTTP API calls and mock mode for testing.
 */

import { logger } from '../../utils/logger.js';
import { BobAPIError, BobcoinExhaustedError } from '../../utils/errors.js';
import { createHTTPClient, type BobHTTPClient } from './http-client.js';
import type {
  BobClientConfig,
  BobRequest,
  BobResponse,
  BobSession,
  BobcoinUsage,
  RateLimitInfo,
} from './types.js';

/**
 * Bob API Client
 */
export class BobClient {
  private readonly config: BobClientConfig;
  private readonly httpClient: BobHTTPClient | null;
  private readonly useMock: boolean;
  private currentSession: BobSession | null = null;
  private bobcoinUsage: BobcoinUsage = {
    total: 40,
    used: 0,
    remaining: 40,
    percentage: 0,
    lastUpdated: new Date(),
  };

  constructor(config: BobClientConfig) {
    this.config = config;
    
    // Use mock mode if no endpoint provided or if explicitly set
    this.useMock = !config.endpoint || config.endpoint === 'mock';
    
    // Initialize HTTP client for real API calls
    if (!this.useMock && config.endpoint) {
      this.httpClient = createHTTPClient({
        apiKey: config.apiKey,
        endpoint: config.endpoint,
        timeout: 30000,
        retries: 3,
      });
    } else {
      this.httpClient = null;
    }
    
    logger.info('Bob client initialized', {
      teamId: config.teamId,
      endpoint: config.endpoint || 'mock',
      mode: this.useMock ? 'mock' : 'real',
    });
  }

  /**
   * Send a request to Bob
   */
  async request(request: BobRequest): Promise<BobResponse> {
    logger.debug('Sending request to Bob', {
      mode: request.mode,
      promptLength: request.prompt.length,
      useMock: this.useMock,
    });

    // Check Bobcoin availability
    if (this.bobcoinUsage.remaining <= 0) {
      throw new BobcoinExhaustedError('No Bobcoins remaining', {
        used: this.bobcoinUsage.used,
        total: this.bobcoinUsage.total,
      });
    }

    try {
      let response: BobResponse;
      
      // Use real HTTP client or mock
      if (this.useMock || !this.httpClient) {
        response = await this.simulateBobRequest(request);
      } else {
        response = await this.httpClient.chatCompletion(request);
      }
      
      // Update Bobcoin usage
      this.updateBobcoinUsage(response.bobcoinsUsed);
      
      // Track in current session if exists
      if (this.currentSession) {
        this.currentSession.bobcoinsUsed += response.bobcoinsUsed;
        this.currentSession.tasks.push({
          id: `task-${Date.now()}`,
          description: request.prompt.substring(0, 100),
          mode: request.mode || 'code',
          bobcoinsUsed: response.bobcoinsUsed,
          timestamp: new Date(),
          status: 'completed',
        });
      }
      
      logger.info('Bob request completed', {
        bobcoinsUsed: response.bobcoinsUsed,
        remaining: this.bobcoinUsage.remaining,
        mode: this.useMock ? 'mock' : 'real',
      });

      return response;
    } catch (error) {
      logger.error('Bob request failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new BobAPIError('Failed to process Bob request', {
        originalError: error,
      });
    }
  }

  /**
   * Simulate Bob API request (for development)
   */
  private async simulateBobRequest(request: BobRequest): Promise<BobResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Estimate Bobcoin usage based on prompt length
    const estimatedCoins = Math.ceil(request.prompt.length / 100);

    return {
      content: `Mock response for: ${request.prompt.substring(0, 50)}...`,
      bobcoinsUsed: estimatedCoins,
      sessionId: this.currentSession?.id || 'mock-session',
      timestamp: new Date(),
      metadata: {
        mode: request.mode,
        mock: true,
      },
    };
  }

  /**
   * Update Bobcoin usage
   */
  private updateBobcoinUsage(used: number): void {
    this.bobcoinUsage.used += used;
    this.bobcoinUsage.remaining = this.bobcoinUsage.total - this.bobcoinUsage.used;
    this.bobcoinUsage.percentage = (this.bobcoinUsage.used / this.bobcoinUsage.total) * 100;
    this.bobcoinUsage.lastUpdated = new Date();

    // Warn if running low
    if (this.bobcoinUsage.percentage >= 80) {
      logger.warn('Bobcoin usage high', {
        percentage: this.bobcoinUsage.percentage.toFixed(2),
        remaining: this.bobcoinUsage.remaining,
      });
    }
  }

  /**
   * Get current Bobcoin usage
   */
  getBobcoinUsage(): BobcoinUsage {
    return { ...this.bobcoinUsage };
  }

  /**
   * Start a new session
   */
  startSession(mode?: string): BobSession {
    this.currentSession = {
      id: `session-${Date.now()}`,
      startTime: new Date(),
      bobcoinsUsed: 0,
      tasks: [],
      mode,
    };

    logger.info('Started new Bob session', {
      sessionId: this.currentSession.id,
      mode,
    });

    return this.currentSession;
  }

  /**
   * End current session
   */
  endSession(): BobSession | null {
    if (!this.currentSession) {
      logger.warn('No active session to end');
      return null;
    }

    this.currentSession.endTime = new Date();
    
    logger.info('Ended Bob session', {
      sessionId: this.currentSession.id,
      duration: this.currentSession.endTime.getTime() - this.currentSession.startTime.getTime(),
      bobcoinsUsed: this.currentSession.bobcoinsUsed,
    });

    const session = this.currentSession;
    this.currentSession = null;
    return session;
  }

  /**
   * Get current session
   */
  getCurrentSession(): BobSession | null {
    return this.currentSession ? { ...this.currentSession } : null;
  }

  /**
   * Export session report
   */
  async exportSession(outputPath: string, sessionId: string): Promise<string> {
    logger.info('Exporting session report', {
      sessionId,
      outputPath,
    });

    // In real implementation, this would export the actual session
    // For now, we just log the action and return the path
    logger.debug('Session export completed (mock)');
    return outputPath;
  }

  /**
   * Get rate limit information
   */
  getRateLimitInfo(): RateLimitInfo {
    // Mock rate limit info
    return {
      limit: 100,
      remaining: 95,
      reset: new Date(Date.now() + 3600000), // 1 hour from now
    };
  }

  /**
   * Check if Bob is available
   */
  async checkHealth(): Promise<boolean> {
    try {
      // In real implementation, this would ping the Bob API
      logger.debug('Bob health check passed', {
        endpoint: this.config.endpoint || 'default',
      });
      return true;
    } catch (error) {
      logger.error('Bob health check failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Get client configuration
   */
  getConfig(): BobClientConfig {
    return { ...this.config };
  }
}

/**
 * Create a Bob client instance
 */
export function createBobClient(config: BobClientConfig): BobClient {
  return new BobClient(config);
}

// Made with Bob
