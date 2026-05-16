/**
 * Logger Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { logger } from '../../src/utils/logger.js';

describe('Logger', () => {
  beforeEach(() => {
    // Clear console spies
    vi.clearAllMocks();
  });

  describe('info', () => {
    it('should log info messages', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      logger.info('Test message');
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should log info messages with metadata', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      logger.info('Test message', { key: 'value' });
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('error', () => {
    it('should log error messages', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      logger.error('Error message');
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should log error messages with metadata', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      logger.error('Error message', { error: 'details' });
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('warn', () => {
    it('should log warning messages', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      logger.warn('Warning message');
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('debug', () => {
    it('should log debug messages', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const originalLevel = logger.getLevel();
      logger.setLevel('debug');
      
      logger.debug('Debug message');
      
      expect(consoleSpy).toHaveBeenCalled();
      logger.setLevel(originalLevel);
      consoleSpy.mockRestore();
    });
  });

  describe('getHistory', () => {
    it('should return log history', () => {
      const history = logger.getHistory();
      
      expect(Array.isArray(history)).toBe(true);
    });

    it('should include recent log entries', () => {
      logger.info('Test entry');
      const history = logger.getHistory();
      
      expect(history.length).toBeGreaterThan(0);
    });
  });

  describe('clearHistory', () => {
    it('should clear log history', () => {
      logger.info('Test entry');
      logger.clearHistory();
      const history = logger.getHistory();
      
      expect(history.length).toBe(0);
    });
  });
});

// Made with Bob
