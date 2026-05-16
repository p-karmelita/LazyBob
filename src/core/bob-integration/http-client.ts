/**
 * HTTP Client for Bob API
 * Implements OpenAI-like API pattern for Bob integration
 */

import { logger } from '../../utils/logger.js';
import { BobAPIError } from '../../utils/errors.js';
import type { BobRequest, BobResponse } from './types.js';

export interface HTTPClientConfig {
  apiKey: string;
  endpoint: string;
  timeout?: number;
  retries?: number;
}

export interface APIRequest {
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface APIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * HTTP Client for Bob API
 */
export class BobHTTPClient {
  private readonly config: HTTPClientConfig;
  private readonly defaultTimeout = 30000; // 30 seconds
  private readonly defaultRetries = 3;

  constructor(config: HTTPClientConfig) {
    this.config = {
      timeout: this.defaultTimeout,
      retries: this.defaultRetries,
      ...config,
    };
  }

  /**
   * Send a chat completion request
   */
  async chatCompletion(request: BobRequest): Promise<BobResponse> {
    const apiRequest = this.buildAPIRequest(request);
    const response = await this.makeRequest('/v1/chat/completions', apiRequest);
    return this.parseAPIResponse(response);
  }

  /**
   * Build API request from Bob request
   */
  private buildAPIRequest(request: BobRequest): APIRequest {
    const messages: APIRequest['messages'] = [];

    // Add system message based on mode
    const systemPrompts: Record<string, string> = {
      code: 'You are Bob, a highly skilled software engineer. Provide code solutions with explanations.',
      plan: 'You are Bob, an expert project planner. Break down tasks and create actionable plans.',
      ask: 'You are Bob, a knowledgeable assistant. Answer questions clearly and concisely.',
      advanced: 'You are Bob, an advanced AI assistant with access to multiple tools and capabilities.',
    };

    const systemPrompt = systemPrompts[request.mode || 'code'] || systemPrompts.code;
    messages.push({
      role: 'system',
      content: systemPrompt,
    });

    // Add context if provided
    if (request.context) {
      messages.push({
        role: 'system',
        content: `Context: ${request.context}`,
      });
    }

    // Add user prompt
    messages.push({
      role: 'user',
      content: request.prompt,
    });

    return {
      messages,
      model: 'bob-v1', // Bob model identifier
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 2000,
      stream: false,
    };
  }

  /**
   * Make HTTP request with retries
   */
  private async makeRequest(
    endpoint: string,
    body: unknown,
    attempt = 1
  ): Promise<APIResponse> {
    const url = `${this.config.endpoint}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      logger.debug('Making Bob API request', {
        url,
        attempt,
        maxRetries: this.config.retries,
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'User-Agent': 'LazyBob/1.0.0',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new BobAPIError(
          `Bob API request failed: ${response.status} ${response.statusText}`,
          {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          }
        );
      }

      const data = await response.json() as APIResponse;
      logger.debug('Bob API request successful', {
        id: data.id,
        model: data.model,
        tokens: data.usage?.total_tokens,
      });

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle abort/timeout
      if (error instanceof Error && error.name === 'AbortError') {
        logger.warn('Bob API request timed out', { attempt, timeout: this.config.timeout });
        
        if (attempt < (this.config.retries || this.defaultRetries)) {
          logger.info('Retrying Bob API request', { attempt: attempt + 1 });
          await this.delay(1000 * attempt); // Exponential backoff
          return this.makeRequest(endpoint, body, attempt + 1);
        }
        
        throw new BobAPIError('Bob API request timed out after retries', {
          attempts: attempt,
          timeout: this.config.timeout,
        });
      }

      // Handle network errors with retry
      if (error instanceof Error && attempt < (this.config.retries || this.defaultRetries)) {
        logger.warn('Bob API request failed, retrying', {
          attempt,
          error: error.message,
        });
        await this.delay(1000 * attempt);
        return this.makeRequest(endpoint, body, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Parse API response to Bob response
   */
  private parseAPIResponse(apiResponse: APIResponse): BobResponse {
    const choice = apiResponse.choices[0];
    if (!choice) {
      throw new BobAPIError('No response choices returned from API', {
        response: apiResponse,
      });
    }

    // Estimate Bobcoin usage from token count
    // Assuming 1 Bobcoin ≈ 1000 tokens (adjust based on actual pricing)
    const bobcoinsUsed = Math.ceil((apiResponse.usage?.total_tokens || 0) / 1000);

    return {
      content: choice.message.content,
      bobcoinsUsed,
      sessionId: apiResponse.id,
      timestamp: new Date(apiResponse.created * 1000),
      metadata: {
        model: apiResponse.model,
        finishReason: choice.finish_reason,
        usage: apiResponse.usage,
      },
    };
  }

  /**
   * Delay helper for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Check API health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.config.endpoint}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      logger.warn('Bob API health check failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }
}

/**
 * Create HTTP client instance
 */
export function createHTTPClient(config: HTTPClientConfig): BobHTTPClient {
  return new BobHTTPClient(config);
}

// Made with Bob
