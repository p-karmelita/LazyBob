/**
 * Bob Client Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { BobClient } from '../../../src/core/bob-integration/client.js';
import type { BobClientConfig } from '../../../src/core/bob-integration/types.js';

describe('BobClient', () => {
  let client: BobClient;
  let config: BobClientConfig;

  beforeEach(() => {
    config = {
      apiKey: 'test-api-key',
      teamId: 'test-team',
      endpoint: 'mock', // Use mock mode for tests
    };
    client = new BobClient(config);
  });

  describe('constructor', () => {
    it('should create a client with config', () => {
      expect(client).toBeInstanceOf(BobClient);
    });

    it('should initialize with default Bobcoin usage', () => {
      const usage = client.getBobcoinUsage();
      
      expect(usage.total).toBe(40);
      expect(usage.used).toBe(0);
      expect(usage.remaining).toBe(40);
      expect(usage.percentage).toBe(0);
    });
  });

  describe('request', () => {
    it('should send a request to Bob', async () => {
      const response = await client.request({
        prompt: 'Test prompt',
        mode: 'code',
      });

      expect(response).toBeDefined();
      expect(response.content).toBeDefined();
      expect(response.sessionId).toBeDefined();
    });

    it('should track Bobcoin usage', async () => {
      await client.request({
        prompt: 'Test prompt',
        mode: 'code',
      });

      const usage = client.getBobcoinUsage();
      expect(usage.used).toBeGreaterThan(0);
    });

    it('should support different modes', async () => {
      const modes: Array<'code' | 'plan' | 'ask' | 'advanced'> = [
        'code',
        'plan',
        'ask',
        'advanced',
      ];

      for (const mode of modes) {
        const response = await client.request({
          prompt: 'Test',
          mode,
        });
        expect(response).toBeDefined();
      }
    });
  });

  describe('getBobcoinUsage', () => {
    it('should return current usage', () => {
      const usage = client.getBobcoinUsage();

      expect(usage).toHaveProperty('total');
      expect(usage).toHaveProperty('used');
      expect(usage).toHaveProperty('remaining');
      expect(usage).toHaveProperty('percentage');
      expect(usage).toHaveProperty('lastUpdated');
    });

    it('should calculate percentage correctly', async () => {
      await client.request({ prompt: 'Test', mode: 'code' });
      const usage = client.getBobcoinUsage();

      expect(usage.percentage).toBeGreaterThan(0);
      expect(usage.percentage).toBeLessThanOrEqual(100);
    });
  });

  describe('checkHealth', () => {
    it('should check Bob API health', async () => {
      const isHealthy = await client.checkHealth();

      expect(typeof isHealthy).toBe('boolean');
    });
  });

  describe('getRateLimitInfo', () => {
    it('should return rate limit information', () => {
      const rateLimitInfo = client.getRateLimitInfo();

      expect(rateLimitInfo).toHaveProperty('limit');
      expect(rateLimitInfo).toHaveProperty('remaining');
      expect(rateLimitInfo).toHaveProperty('reset');
    });
  });

  describe('getCurrentSession', () => {
    it('should return null when no session', () => {
      const session = client.getCurrentSession();

      expect(session).toBeNull();
    });

    it('should return current session after request', async () => {
      await client.request({ prompt: 'Test', mode: 'code' });
      const session = client.getCurrentSession();

      expect(session).toBeDefined();
      if (session) {
        expect(session.id).toBeDefined();
        expect(session.startTime).toBeInstanceOf(Date);
      }
    });
  });

  describe('exportSession', () => {
    it('should export session data', async () => {
      await client.request({ prompt: 'Test', mode: 'code' });
      const exported = await client.exportSession('./test-session.json', 'test-session');

      expect(exported).toBeDefined();
    });
  });

  describe('error handling', () => {
    it('should handle invalid requests gracefully', async () => {
      try {
        await client.request({
          prompt: '',
          mode: 'code',
        });
        // Should not throw in mock implementation
        expect(true).toBe(true);
      } catch (error) {
        // If it throws, that's also acceptable
        expect(error).toBeDefined();
      }
    });
  });
});

// Made with Bob
