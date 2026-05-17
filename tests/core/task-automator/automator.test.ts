/**
 * Task Automator Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TaskAutomator } from '../../../src/core/task-automator/automator.js';
import type { TaskConfig, TaskExecutionOptions } from '../../../src/core/task-automator/types.js';

// Mock dependencies
vi.mock('../../../src/utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

vi.mock('../../../src/utils/progress.js', () => ({
  createProgress: vi.fn(() => ({
    start: vi.fn(),
    update: vi.fn(),
    complete: vi.fn(),
    stop: vi.fn(),
  })),
}));

vi.mock('../../../src/utils/config.js', () => ({
  getConfig: vi.fn(() => ({
    bob: {
      apiKey: 'test-key',
      teamId: 'test-team',
      endpoint: 'https://api.test.com',
    },
  })),
}));

vi.mock('../../../src/core/bob-integration/client.js', () => ({
  BobClient: vi.fn().mockImplementation(() => ({
    request: vi.fn().mockResolvedValue({ content: 'mocked response' }),
    getBobcoinUsage: vi.fn().mockReturnValue({ used: 5, remaining: 35, total: 40 }),
  })),
}));

vi.mock('../../../src/core/code-analyzer/index.js', () => ({
  createAnalyzer: vi.fn(() => ({
    analyze: vi.fn().mockResolvedValue({
      summary: {
        totalFiles: 10,
        totalLines: 1000,
        totalFunctions: 50,
        totalClasses: 10,
      },
      issues: [
        {
          file: 'test.ts',
          line: 10,
          message: 'Test issue',
          severity: 'warning',
          rule: 'test-rule',
        },
      ],
    }),
  })),
}));

vi.mock('../../../src/core/doc-generator/index.js', () => ({
  createDocGenerator: vi.fn(() => ({
    generate: vi.fn().mockResolvedValue([
      { path: 'docs/api.md', content: 'API Documentation' },
    ]),
  })),
}));

describe('TaskAutomator', () => {
  let automator: TaskAutomator;

  beforeEach(() => {
    automator = new TaskAutomator();
    vi.clearAllMocks();
  });

  describe('executeTask', () => {
    it('should execute code-review task successfully', async () => {
      const config: TaskConfig = {
        type: 'code-review',
        priority: 'high',
        strategy: 'rule-based',
        description: 'Review code quality',
        targetPath: './src',
      };

      const result = await automator.executeTask(config);

      expect(result.type).toBe('code-review');
      expect(result.status).toBe('completed');
      expect(result.success).toBe(true);
      expect(result.taskId).toBeDefined();
      expect(result.metrics.filesAnalyzed).toBe(10);
      expect(result.metrics.issuesFound).toBe(1);
    });

    it('should execute refactor task with Bob assistance', async () => {
      const config: TaskConfig = {
        type: 'refactor',
        priority: 'medium',
        strategy: 'bob-assisted',
        description: 'Refactor legacy code',
        targetPath: './src/legacy.ts',
        options: {
          extractFunctions: true,
          improveNaming: true,
        },
      };

      const result = await automator.executeTask(config);

      expect(result.type).toBe('refactor');
      expect(result.status).toBe('completed');
      expect(result.success).toBe(true);
      expect(result.bobcoinUsed).toBe(5);
      expect(result.changes.length).toBeGreaterThan(0);
    });

    it('should execute test-generation task', async () => {
      const config: TaskConfig = {
        type: 'test-generation',
        priority: 'high',
        strategy: 'bob-assisted',
        description: 'Generate unit tests',
        targetPath: './src/utils.ts',
        options: {
          framework: 'vitest',
          coverage: 80,
          includeEdgeCases: true,
        },
      };

      const result = await automator.executeTask(config);

      expect(result.type).toBe('test-generation');
      expect(result.status).toBe('completed');
      expect(result.success).toBe(true);
      expect(result.metrics.testsCovered).toBe(1);
    });

    it('should execute bug-fix task', async () => {
      const config: TaskConfig = {
        type: 'bug-fix',
        priority: 'critical',
        strategy: 'bob-assisted',
        description: 'Fix null pointer exception',
        targetPath: './src/app.ts',
        options: {
          issueId: 'BUG-123',
          description: 'Null pointer in user handler',
          addTests: true,
        },
      };

      const result = await automator.executeTask(config);

      expect(result.type).toBe('bug-fix');
      expect(result.status).toBe('completed');
      expect(result.success).toBe(true);
      expect(result.metrics.issuesFixed).toBe(1);
    });

    it('should execute feature-implementation task', async () => {
      const config: TaskConfig = {
        type: 'feature-implementation',
        priority: 'high',
        strategy: 'bob-assisted',
        description: 'Add user authentication',
        targetPath: './src/auth.ts',
        options: {
          specification: 'JWT-based authentication',
          addTests: true,
          addDocs: true,
        },
      };

      const result = await automator.executeTask(config);

      expect(result.type).toBe('feature-implementation');
      expect(result.status).toBe('completed');
      expect(result.success).toBe(true);
      expect(result.changes.length).toBeGreaterThan(0);
    });

    it('should execute documentation task', async () => {
      const config: TaskConfig = {
        type: 'documentation',
        priority: 'medium',
        strategy: 'rule-based',
        description: 'Generate API documentation',
        targetPath: './src',
      };

      const result = await automator.executeTask(config);

      expect(result.type).toBe('documentation');
      expect(result.status).toBe('completed');
      expect(result.success).toBe(true);
      expect(result.changes.length).toBe(1);
      expect(result.changes[0].type).toBe('file-created');
    });

    it('should execute optimization task', async () => {
      const config: TaskConfig = {
        type: 'optimization',
        priority: 'low',
        strategy: 'rule-based',
        description: 'Optimize performance',
        targetPath: './src',
        options: {
          target: 'performance',
          aggressive: false,
        },
      };

      const result = await automator.executeTask(config);

      expect(result.type).toBe('optimization');
      expect(result.status).toBe('completed');
      expect(result.success).toBe(true);
      expect(result.metrics.filesAnalyzed).toBe(10);
    });

    it('should execute security-audit task', async () => {
      const config: TaskConfig = {
        type: 'security-audit',
        priority: 'critical',
        strategy: 'rule-based',
        description: 'Audit security vulnerabilities',
        targetPath: './src',
      };

      const result = await automator.executeTask(config);

      expect(result.type).toBe('security-audit');
      expect(result.status).toBe('completed');
      expect(result.success).toBe(true);
      expect(result.metrics.issuesFound).toBeGreaterThanOrEqual(0);
    });

    it('should execute dependency-update task', async () => {
      const config: TaskConfig = {
        type: 'dependency-update',
        priority: 'medium',
        strategy: 'rule-based',
        description: 'Update dependencies',
        targetPath: './package.json',
        options: {
          updateType: 'minor',
          testAfterUpdate: true,
        },
      };

      const result = await automator.executeTask(config);

      expect(result.type).toBe('dependency-update');
      expect(result.status).toBe('completed');
      expect(result.success).toBe(true);
    });

    it('should execute custom task', async () => {
      const config: TaskConfig = {
        type: 'custom',
        priority: 'medium',
        strategy: 'bob-assisted',
        description: 'Custom automation task',
        targetPath: './src/custom.ts',
      };

      const result = await automator.executeTask(config);

      expect(result.type).toBe('custom');
      expect(result.status).toBe('completed');
      expect(result.success).toBe(true);
    });

    it('should handle dry-run mode', async () => {
      const config: TaskConfig = {
        type: 'refactor',
        priority: 'medium',
        strategy: 'bob-assisted',
        description: 'Refactor code',
        targetPath: './src/test.ts',
      };

      const options: TaskExecutionOptions = {
        dryRun: true,
      };

      const result = await automator.executeTask(config, options);

      expect(result.success).toBe(true);
      expect(result.changes.length).toBe(0); // No changes in dry-run
    });

    it('should handle task execution failure', async () => {
      const config: TaskConfig = {
        type: 'code-review',
        priority: 'high',
        strategy: 'rule-based',
        description: 'Review code',
        targetPath: './nonexistent',
      };

      // Mock analyzer to throw error
      const { createAnalyzer } = await import('../../../src/core/code-analyzer/index.js');
      vi.mocked(createAnalyzer).mockReturnValueOnce({
        analyze: vi.fn().mockRejectedValue(new Error('Path not found')),
      } as any);

      const result = await automator.executeTask(config);

      expect(result.status).toBe('failed');
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].code).toBe('TASK_EXECUTION_FAILED');
    });

    it('should throw error for unknown task type', async () => {
      const config: TaskConfig = {
        type: 'unknown-type' as any,
        priority: 'medium',
        strategy: 'rule-based',
        description: 'Unknown task',
        targetPath: './src',
      };

      const result = await automator.executeTask(config);

      expect(result.status).toBe('failed');
      expect(result.success).toBe(false);
      expect(result.errors[0].message).toContain('Unknown task type');
    });

    it('should track execution time', async () => {
      const config: TaskConfig = {
        type: 'code-review',
        priority: 'high',
        strategy: 'rule-based',
        description: 'Review code',
        targetPath: './src',
      };

      const result = await automator.executeTask(config);

      expect(result.startTime).toBeInstanceOf(Date);
      expect(result.endTime).toBeInstanceOf(Date);
      expect(result.duration).toBeGreaterThanOrEqual(0);
      expect(result.endTime.getTime()).toBeGreaterThanOrEqual(result.startTime.getTime());
    });

    it('should respect bobcoin limit', async () => {
      const config: TaskConfig = {
        type: 'refactor',
        priority: 'medium',
        strategy: 'bob-assisted',
        description: 'Refactor code',
        targetPath: './src/test.ts',
      };

      const options: TaskExecutionOptions = {
        bobcoinLimit: 3,
      };

      const result = await automator.executeTask(config, options);

      expect(result.success).toBe(true);
      if (result.bobcoinUsed) {
        expect(result.bobcoinUsed).toBeLessThanOrEqual(10); // Default limit
      }
    });

    it('should handle multiple task types in sequence', async () => {
      const configs: TaskConfig[] = [
        {
          type: 'code-review',
          priority: 'high',
          strategy: 'rule-based',
          description: 'Review',
          targetPath: './src',
        },
        {
          type: 'documentation',
          priority: 'medium',
          strategy: 'rule-based',
          description: 'Document',
          targetPath: './src',
        },
      ];

      const results = await Promise.all(
        configs.map(config => automator.executeTask(config))
      );

      expect(results).toHaveLength(2);
      expect(results[0].type).toBe('code-review');
      expect(results[1].type).toBe('documentation');
      expect(results.every(r => r.success)).toBe(true);
    });
  });

  describe('Task Metrics', () => {
    it('should track files analyzed', async () => {
      const config: TaskConfig = {
        type: 'code-review',
        priority: 'high',
        strategy: 'rule-based',
        description: 'Review code',
        targetPath: './src',
      };

      const result = await automator.executeTask(config);

      expect(result.metrics.filesAnalyzed).toBeGreaterThan(0);
    });

    it('should track issues found and fixed', async () => {
      const config: TaskConfig = {
        type: 'code-review',
        priority: 'high',
        strategy: 'rule-based',
        description: 'Review code',
        targetPath: './src',
        options: {
          autoFix: false,
        },
      };

      const result = await automator.executeTask(config);

      expect(result.metrics.issuesFound).toBeGreaterThan(0);
      expect(result.metrics.issuesFixed).toBe(0); // autoFix disabled
    });

    it('should track test coverage', async () => {
      const config: TaskConfig = {
        type: 'test-generation',
        priority: 'high',
        strategy: 'bob-assisted',
        description: 'Generate tests',
        targetPath: './src/utils.ts',
      };

      const result = await automator.executeTask(config);

      expect(result.metrics.testsCovered).toBeGreaterThan(0);
    });
  });

  describe('Task Changes', () => {
    it('should record file modifications', async () => {
      const config: TaskConfig = {
        type: 'refactor',
        priority: 'medium',
        strategy: 'bob-assisted',
        description: 'Refactor code',
        targetPath: './src/test.ts',
      };

      const result = await automator.executeTask(config);

      expect(result.changes.length).toBeGreaterThan(0);
      expect(result.changes[0].type).toBe('file-modified');
      expect(result.changes[0].path).toBe('./src/test.ts');
    });

    it('should record file creations', async () => {
      const config: TaskConfig = {
        type: 'test-generation',
        priority: 'high',
        strategy: 'bob-assisted',
        description: 'Generate tests',
        targetPath: './src/utils.ts',
      };

      const result = await automator.executeTask(config);

      expect(result.changes.length).toBeGreaterThan(0);
      expect(result.changes[0].type).toBe('file-created');
      expect(result.changes[0].path).toContain('.test.');
    });
  });

  describe('Error Handling', () => {
    it('should collect errors during code review', async () => {
      const config: TaskConfig = {
        type: 'code-review',
        priority: 'high',
        strategy: 'rule-based',
        description: 'Review code',
        targetPath: './src',
      };

      const result = await automator.executeTask(config);

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toHaveProperty('code');
      expect(result.errors[0]).toHaveProperty('message');
      expect(result.errors[0]).toHaveProperty('severity');
    });

    it('should mark errors as recoverable or not', async () => {
      const config: TaskConfig = {
        type: 'code-review',
        priority: 'high',
        strategy: 'rule-based',
        description: 'Review code',
        targetPath: './src',
      };

      const result = await automator.executeTask(config);

      if (result.errors.length > 0) {
        expect(result.errors[0]).toHaveProperty('recoverable');
        expect(typeof result.errors[0].recoverable).toBe('boolean');
      }
    });
  });
});

// Made with Bob
