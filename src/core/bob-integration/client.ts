/**
 * Bob API Client Implementation
 * 
 * This is a mock implementation for the hackathon project structure.
 * In a real implementation, this would interact with the actual Bob API.
 */

import { logger } from '../../utils/logger.js';
import { BobAPIError, BobcoinExhaustedError } from '../../utils/errors.js';
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
    logger.info('Bob client initialized', {
      teamId: config.teamId,
      endpoint: config.endpoint || 'default',
    });
  }

  /**
   * Send a request to Bob
   */
  async request(request: BobRequest): Promise<BobResponse> {
    logger.debug('Sending request to Bob', {
      mode: request.mode,
      promptLength: request.prompt.length,
    });

    // Check Bobcoin availability
    if (this.bobcoinUsage.remaining <= 0) {
      throw new BobcoinExhaustedError('No Bobcoins remaining', {
        used: this.bobcoinUsage.used,
        total: this.bobcoinUsage.total,
      });
    }

    // Simulate API call
    // In real implementation, this would call the actual Bob API
    try {
      const response = await this.simulateBobRequest(request);
      
      // Update Bobcoin usage
      this.updateBobcoinUsage(response.bobcoinsUsed);
      
      logger.info('Bob request completed', {
        bobcoinsUsed: response.bobcoinsUsed,
        remaining: this.bobcoinUsage.remaining,
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
  async exportSession(sessionId: string, outputPath: string): Promise<void> {
    logger.info('Exporting session report', {
      sessionId,
      outputPath,
    });

    // In real implementation, this would export the actual session
    // For now, we just log the action
    logger.debug('Session export completed (mock)');
  }

  /**
   * Get rate limit information
   */
  async getRateLimitInfo(): Promise<RateLimitInfo> {
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
