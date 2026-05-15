/**
 * Error Classes Tests
 */

import { describe, it, expect } from 'vitest';
import {
  AppError,
  BobAPIError,
  BobcoinExhaustedError,
  AnalysisError,
  ValidationError,
  ConfigError,
} from '../../src/utils/errors.js';

describe('Error Classes', () => {
  describe('AppError', () => {
    it('should create an error with message', () => {
      const error = new AppError('Test error', 'TEST_ERROR');
      
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('AppError');
      expect(error.code).toBe('TEST_ERROR');
    });

    it('should create an error with context', () => {
      const error = new AppError('Test error', 'TEST_ERROR', { key: 'value' });
      
      expect(error.context).toEqual({ key: 'value' });
    });

    it('should be an instance of Error', () => {
      const error = new AppError('Test error', 'TEST_ERROR');
      
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('BobAPIError', () => {
    it('should create a Bob API error', () => {
      const error = new BobAPIError('API failed');
      
      expect(error.message).toBe('API failed');
      expect(error.name).toBe('BobAPIError');
      expect(error.code).toBe('BOB_API_ERROR');
    });

    it('should include status code in context', () => {
      const error = new BobAPIError('API failed', { statusCode: 500 });
      
      expect(error.context?.statusCode).toBe(500);
    });
  });

  describe('BobcoinExhaustedError', () => {
    it('should create a Bobcoin exhausted error', () => {
      const error = new BobcoinExhaustedError('No Bobcoins left');
      
      expect(error.message).toBe('No Bobcoins left');
      expect(error.name).toBe('BobcoinExhaustedError');
      expect(error.code).toBe('BOBCOIN_EXHAUSTED');
    });

    it('should include usage in context', () => {
      const error = new BobcoinExhaustedError('No Bobcoins left', {
        used: 40,
        total: 40,
      });
      
      expect(error.context?.used).toBe(40);
      expect(error.context?.total).toBe(40);
    });
  });

  describe('AnalysisError', () => {
    it('should create an analysis error', () => {
      const error = new AnalysisError('Analysis failed');
      
      expect(error.message).toBe('Analysis failed');
      expect(error.name).toBe('AnalysisError');
      expect(error.code).toBe('ANALYSIS_ERROR');
    });

    it('should include file path in context', () => {
      const error = new AnalysisError('Analysis failed', {
        path: '/path/to/file.ts',
      });
      
      expect(error.context?.path).toBe('/path/to/file.ts');
    });
  });

  describe('ValidationError', () => {
    it('should create a validation error', () => {
      const error = new ValidationError('Invalid input');
      
      expect(error.message).toBe('Invalid input');
      expect(error.name).toBe('ValidationError');
      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('should include validation errors in context', () => {
      const error = new ValidationError('Invalid input', {
        errors: ['Field required', 'Invalid format'],
      });
      
      expect(error.context?.errors).toEqual(['Field required', 'Invalid format']);
    });
  });

  describe('ConfigError', () => {
    it('should create a config error', () => {
      const error = new ConfigError('Config invalid');
      
      expect(error.message).toBe('Config invalid');
      expect(error.name).toBe('ConfigError');
      expect(error.code).toBe('CONFIG_ERROR');
    });

    it('should include config details in context', () => {
      const error = new ConfigError('Config invalid', {
        field: 'apiKey',
        reason: 'Missing',
      });
      
      expect(error.context?.field).toBe('apiKey');
      expect(error.context?.reason).toBe('Missing');
    });
  });

  describe('Error inheritance', () => {
    it('should maintain prototype chain', () => {
      const error = new BobAPIError('Test');
      
      expect(error).toBeInstanceOf(BobAPIError);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(Error);
    });

    it('should have correct error names', () => {
      const errors = [
        new AppError('test', 'TEST_ERROR'),
        new BobAPIError('test'),
        new BobcoinExhaustedError('test'),
        new AnalysisError('test'),
        new ValidationError('test'),
        new ConfigError('test'),
      ];

      expect(errors[0].name).toBe('AppError');
      expect(errors[1].name).toBe('BobAPIError');
      expect(errors[2].name).toBe('BobcoinExhaustedError');
      expect(errors[3].name).toBe('AnalysisError');
      expect(errors[4].name).toBe('ValidationError');
      expect(errors[5].name).toBe('ConfigError');
    });
  });
});

// Made with Bob
