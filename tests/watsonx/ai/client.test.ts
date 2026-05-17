/**
 * watsonx.ai Client Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WatsonxAIClient } from '../../../src/watsonx/ai/client.js';
import { GraniteModel } from '../../../src/watsonx/ai/types.js';
import type { 
  WatsonxAIConfig,
  CodeSuggestionRequest,
  CodeReviewRequest,
  GenerationRequest,
} from '../../../src/watsonx/ai/types.js';

// Mock fetch
global.fetch = vi.fn();

// Mock logger
vi.mock('../../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

describe('WatsonxAIClient', () => {
  let client: WatsonxAIClient;
  let config: WatsonxAIConfig;

  beforeEach(() => {
    config = {
      apiKey: 'test-api-key',
      projectId: 'test-project-id',
      endpoint: 'https://api.watsonx.ai',
      version: '2023-05-29',
    };
    client = new WatsonxAIClient(config);
    vi.clearAllMocks();
  });

  describe('Constructor', () => {
    it('should create client with valid config', () => {
      expect(client).toBeInstanceOf(WatsonxAIClient);
    });

    it('should use default endpoint if not provided', () => {
      const configWithoutEndpoint = {
        apiKey: 'test-key',
        projectId: 'test-project',
      };
      const clientWithDefault = new WatsonxAIClient(configWithoutEndpoint);
      expect(clientWithDefault).toBeInstanceOf(WatsonxAIClient);
    });
  });

  describe('generate', () => {
    it('should generate text successfully', async () => {
      const mockResponse = {
        model_id: GraniteModel.CODE_20B,
        created_at: new Date().toISOString(),
        results: [{
          generated_text: 'Generated code here',
          generated_token_count: 50,
          input_token_count: 20,
          stop_reason: 'eos_token',
        }],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as any);

      const request: GenerationRequest = {
        input: 'Write a function to add two numbers',
        modelId: GraniteModel.CODE_20B,
      };

      const result = await client.generate(request);

      expect(result.results).toHaveLength(1);
      expect(result.results[0].generated_text).toBe('Generated code here');
      expect(result.results[0].generated_token_count).toBe(50);
    });

    it('should handle API errors', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        text: async () => 'Invalid API key',
      } as any);

      const request: GenerationRequest = {
        input: 'test input',
      };

      await expect(client.generate(request)).rejects.toThrow();
    });

    it('should include API key in headers', async () => {
      const mockResponse = {
        model_id: GraniteModel.CODE_20B,
        created_at: new Date().toISOString(),
        results: [{
          generated_text: 'test',
          generated_token_count: 1,
          input_token_count: 1,
          stop_reason: 'eos_token',
        }],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as any);

      const request: GenerationRequest = {
        input: 'test',
      };

      await client.generate(request);

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${config.apiKey}`,
          }),
        })
      );
    });
  });

  describe('getCodeSuggestion', () => {
    it('should get code suggestions successfully', async () => {
      const mockResponse = {
        model_id: GraniteModel.CODE_20B,
        created_at: new Date().toISOString(),
        results: [{
          generated_text: JSON.stringify({
            suggestion: 'Use const instead of let',
            confidence: 0.95,
            reasoning: 'Variable is not reassigned',
            improvements: ['Better performance', 'Clearer intent'],
          }),
          generated_token_count: 50,
          input_token_count: 20,
          stop_reason: 'eos_token',
        }],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as any);

      const request: CodeSuggestionRequest = {
        code: 'let value = 10;',
        language: 'typescript',
        task: 'improve',
      };

      const result = await client.getCodeSuggestion(request);

      expect(result.suggestion).toBe('Use const instead of let');
      expect(result.confidence).toBe(0.95);
      expect(result.improvements).toHaveLength(2);
    });

    it('should handle different task types', async () => {
      const tasks: Array<'improve' | 'explain' | 'fix' | 'optimize' | 'document'> = [
        'improve', 'explain', 'fix', 'optimize', 'document'
      ];

      for (const task of tasks) {
        const mockResponse = {
          model_id: GraniteModel.CODE_20B,
          created_at: new Date().toISOString(),
          results: [{
            generated_text: JSON.stringify({
              suggestion: `${task} suggestion`,
              confidence: 0.9,
              reasoning: 'test',
              improvements: [],
            }),
            generated_token_count: 10,
            input_token_count: 10,
            stop_reason: 'eos_token',
          }],
        };

        vi.mocked(fetch).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResponse,
        } as any);

        const request: CodeSuggestionRequest = {
          code: 'test code',
          language: 'typescript',
          task,
        };

        const result = await client.getCodeSuggestion(request);
        expect(result.suggestion).toContain(task);
      }
    });
  });

  describe('reviewCode', () => {
    it('should review code successfully', async () => {
      const mockResponse = {
        model_id: GraniteModel.CODE_20B,
        created_at: new Date().toISOString(),
        results: [{
          generated_text: JSON.stringify({
            issues: [
              {
                severity: 'warning',
                line: 5,
                message: 'Unused variable',
                suggestion: 'Remove unused variable',
                category: 'maintainability',
              },
            ],
            overallScore: 85,
            summary: 'Code quality is good',
            recommendations: ['Add more comments', 'Improve naming'],
          }),
          generated_token_count: 100,
          input_token_count: 50,
          stop_reason: 'eos_token',
        }],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as any);

      const request: CodeReviewRequest = {
        code: 'function test() { let x = 1; }',
        language: 'typescript',
      };

      const result = await client.reviewCode(request);

      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].severity).toBe('warning');
      expect(result.overallScore).toBe(85);
      expect(result.recommendations).toHaveLength(2);
    });

    it('should handle code with no issues', async () => {
      const mockResponse = {
        model_id: GraniteModel.CODE_20B,
        created_at: new Date().toISOString(),
        results: [{
          generated_text: JSON.stringify({
            issues: [],
            overallScore: 100,
            summary: 'Perfect code',
            recommendations: [],
          }),
          generated_token_count: 50,
          input_token_count: 30,
          stop_reason: 'eos_token',
        }],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as any);

      const request: CodeReviewRequest = {
        code: 'const x = 1;',
        language: 'typescript',
      };

      const result = await client.reviewCode(request);

      expect(result.issues).toHaveLength(0);
      expect(result.overallScore).toBe(100);
    });
  });

  describe('analyzeCode', () => {
    it('should analyze code successfully', async () => {
      const mockResponse = {
        model_id: GraniteModel.CODE_20B,
        created_at: new Date().toISOString(),
        results: [{
          generated_text: `Summary: Code analysis complete

Insights:
- Good structure
- Clear naming

Complexity Factors:
- Few branches
- Simple logic

Issues: None found`,
          generated_token_count: 200,
          input_token_count: 100,
          stop_reason: 'eos_token',
        }],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as any);

      const result = await client.analyzeCode('test code', 'typescript');

      expect(result.summary).toContain('Code analysis complete');
      expect(result.insights.length).toBeGreaterThan(0);
      expect(result.tokenUsage.inputTokens).toBe(100);
      expect(result.tokenUsage.outputTokens).toBe(200);
      expect(result.tokenUsage.totalTokens).toBe(300);
    });

    it('should include context when provided', async () => {
      const mockResponse = {
        model_id: GraniteModel.CODE_20B,
        created_at: new Date().toISOString(),
        results: [{
          generated_text: 'Summary: Analysis with context\n\nNo issues found.',
          generated_token_count: 10,
          input_token_count: 10,
          stop_reason: 'eos_token',
        }],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as any);

      const result = await client.analyzeCode('test', 'typescript', 'This is a utility function');

      expect(fetch).toHaveBeenCalled();
      expect(result.tokenUsage.inputTokens).toBe(10);
      expect(result.tokenUsage.outputTokens).toBe(10);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      const request: GenerationRequest = {
        input: 'test',
      };

      await expect(client.generate(request)).rejects.toThrow('Network error');
    });

    it('should handle rate limiting', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        text: async () => 'Rate limit exceeded',
      } as any);

      const request: GenerationRequest = {
        input: 'test',
      };

      await expect(client.generate(request)).rejects.toThrow();
    });

    it('should handle invalid JSON in response', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => { throw new Error('Invalid JSON'); },
      } as any);

      const request: GenerationRequest = {
        input: 'test',
      };

      await expect(client.generate(request)).rejects.toThrow();
    });
  });

  describe('Model Selection', () => {
    it('should use default model when not specified', async () => {
      const mockResponse = {
        model_id: GraniteModel.CODE_20B,
        created_at: new Date().toISOString(),
        results: [{
          generated_text: 'test',
          generated_token_count: 1,
          input_token_count: 1,
          stop_reason: 'eos_token',
        }],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as any);

      const request: GenerationRequest = {
        input: 'test',
      };

      await client.generate(request);

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining(GraniteModel.CODE_20B),
        })
      );
    });

    it('should use specified model', async () => {
      const mockResponse = {
        model_id: GraniteModel.CODE_8B,
        created_at: new Date().toISOString(),
        results: [{
          generated_text: 'test',
          generated_token_count: 1,
          input_token_count: 1,
          stop_reason: 'eos_token',
        }],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as any);

      const request: GenerationRequest = {
        input: 'test',
        modelId: GraniteModel.CODE_8B,
      };

      await client.generate(request);

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining(GraniteModel.CODE_8B),
        })
      );
    });
  });
});

// Made with Bob
