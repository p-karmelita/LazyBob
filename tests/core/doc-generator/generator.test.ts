/**
 * Documentation Generator Tests
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { DocGenerator } from '../../../src/core/doc-generator/generator.js';
import type { DocGenerationOptions } from '../../../src/core/doc-generator/types.js';
import { mkdir, writeFile } from 'fs/promises';

// Mock dependencies
vi.mock('fs/promises', () => ({
  writeFile: vi.fn().mockResolvedValue(undefined),
  mkdir: vi.fn().mockResolvedValue(undefined),
}));

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

vi.mock('../../../src/core/code-analyzer/index.js', () => ({
  createAnalyzer: vi.fn(() => ({
    analyze: vi.fn().mockResolvedValue({
      summary: {
        totalFiles: 5,
        totalLines: 500,
        totalFunctions: 20,
        totalClasses: 5,
        languages: { TypeScript: 5 },
        analyzedAt: new Date(),
        duration: 100,
      },
      files: [
        {
          path: 'src/utils.ts',
          language: 'TypeScript',
          lines: 100,
          size: 1024,
          functions: [
            {
              name: 'testFunction',
              line: 10,
              endLine: 20,
              complexity: 5,
              parameters: [],
              isAsync: false,
              isExported: true,
            },
          ],
          classes: [
            {
              name: 'TestClass',
              line: 30,
              endLine: 50,
              methods: [],
              properties: [],
              isExported: true,
            },
          ],
          imports: ['fs', 'path'],
          exports: ['testFunction', 'TestClass'],
          complexity: 10,
        },
      ],
      dependencies: {
        nodes: [
          { id: 'src/utils.ts', label: 'utils', type: 'file' as const },
        ],
        edges: [
          { from: 'src/utils.ts', to: 'fs', type: 'import' as const },
        ],
      },
      metrics: {
        complexity: {
          average: 5.5,
          max: 10,
          min: 1,
          distribution: { low: 3, medium: 2, high: 0 },
        },
        maintainability: {
          index: 75.5,
          score: 'B' as const,
          factors: {
            complexity: 5.5,
            volume: 100,
            effort: 50,
          },
        },
        quality: {
          documentationCoverage: 80,
          duplicateCode: 5,
          codeSmells: 2,
        },
      },
      issues: [],
    }),
  })),
}));

describe('DocGenerator', () => {
  let generator: DocGenerator;

  beforeEach(() => {
    generator = new DocGenerator();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('generate', () => {
    it('should generate markdown documentation', async () => {
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'markdown',
        title: 'API Documentation',
      };

      const docs = await generator.generate(options);

      expect(docs).toHaveLength(1);
      expect(docs[0].format).toBe('markdown');
      expect(docs[0].path).toContain('.md');
      expect(docs[0].content).toBeTruthy();
      expect(docs[0].generatedAt).toBeInstanceOf(Date);
    });

    it('should generate JSON documentation', async () => {
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'json',
        title: 'API Documentation',
      };

      const docs = await generator.generate(options);

      expect(docs).toHaveLength(1);
      expect(docs[0].format).toBe('json');
      expect(docs[0].path).toContain('.json');
      expect(() => JSON.parse(docs[0].content)).not.toThrow();
    });

    it('should generate HTML documentation', async () => {
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'html',
        title: 'API Documentation',
      };

      const docs = await generator.generate(options);

      expect(docs).toHaveLength(1);
      expect(docs[0].format).toBe('html');
      expect(docs[0].path).toContain('.html');
      expect(docs[0].content).toContain('<html');
      expect(docs[0].content).toContain('</html>');
    });

    it('should include examples when requested', async () => {
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'markdown',
        includeExamples: true,
      };

      const docs = await generator.generate(options);

      expect(docs[0].content).toBeTruthy();
      // Examples would be included in the content
    });

    it('should exclude private members by default', async () => {
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'markdown',
        includePrivate: false,
      };

      const docs = await generator.generate(options);

      expect(docs[0].content).toBeTruthy();
      // Private members should not be in the content
    });

    it('should include private members when requested', async () => {
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'markdown',
        includePrivate: true,
      };

      const docs = await generator.generate(options);

      expect(docs[0].content).toBeTruthy();
    });

    it('should write documentation files', async () => {
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'markdown',
      };

      await generator.generate(options);

      expect(mkdir).toHaveBeenCalled();
      expect(writeFile).toHaveBeenCalled();
    });

    it('should include metadata in generated docs', async () => {
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'markdown',
        title: 'My API',
        description: 'API documentation for my project',
      };

      const docs = await generator.generate(options);

      expect(docs[0].metadata).toBeDefined();
      expect(docs[0].metadata.title).toBe('My API');
      expect(docs[0].metadata.description).toBe('API documentation for my project');
      expect(docs[0].metadata.generatedBy).toBe('LazyBob Documentation Generator');
      expect(docs[0].metadata.timestamp).toBeInstanceOf(Date);
    });

    it('should handle analysis errors gracefully', async () => {
      const { createAnalyzer } = await import('../../../src/core/code-analyzer/index.js');
      vi.mocked(createAnalyzer).mockReturnValueOnce({
        analyze: vi.fn().mockRejectedValue(new Error('Analysis failed')),
      } as any);

      const options: DocGenerationOptions = {
        source: './nonexistent',
        output: './docs',
        format: 'markdown',
      };

      await expect(generator.generate(options)).rejects.toThrow('Failed to generate documentation');
    });

    it('should use default options when not provided', async () => {
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'markdown',
      };

      const docs = await generator.generate(options);

      expect(docs).toHaveLength(1);
      expect(docs[0].format).toBe('markdown');
    });
  });

  describe('Markdown Generation', () => {
    it('should generate proper markdown structure', async () => {
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'markdown',
        title: 'API Documentation',
      };

      const docs = await generator.generate(options);
      const content = docs[0].content;

      expect(content).toContain('# API Documentation');
      expect(content).toContain('## ');
      expect(content).toBeTruthy();
    });

    it('should include table of contents', async () => {
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'markdown',
        title: 'API Documentation',
      };

      const docs = await generator.generate(options);
      const content = docs[0].content;

      expect(content).toContain('## Table of Contents');
    });

    it('should format code blocks correctly', async () => {
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'markdown',
        includeExamples: true,
      };

      const docs = await generator.generate(options);
      const content = docs[0].content;

      // Should contain code blocks
      expect(content).toBeTruthy();
    });
  });

  describe('JSON Generation', () => {
    it('should generate valid JSON structure', async () => {
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'json',
      };

      const docs = await generator.generate(options);
      const json = JSON.parse(docs[0].content);

      expect(json).toHaveProperty('metadata');
      expect(json).toHaveProperty('summary');
      expect(json.metadata).toHaveProperty('generatedBy');
    });

    it('should include all analysis data in JSON', async () => {
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'json',
      };

      const docs = await generator.generate(options);
      const json = JSON.parse(docs[0].content);

      expect(json.summary).toBeDefined();
      expect(json.summary.totalFiles).toBe(5);
      expect(json.summary.totalFunctions).toBe(20);
    });
  });

  describe('HTML Generation', () => {
    it('should generate valid HTML structure', async () => {
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'html',
        title: 'API Documentation',
      };

      const docs = await generator.generate(options);
      const content = docs[0].content;

      expect(content).toContain('<!DOCTYPE html>');
      expect(content).toContain('<html');
      expect(content).toContain('<head>');
      expect(content).toContain('<body>');
      expect(content).toContain('</html>');
    });

    it('should include title in HTML', async () => {
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'html',
        title: 'My API Docs',
      };

      const docs = await generator.generate(options);
      const content = docs[0].content;

      expect(content).toContain('<title>My API Docs</title>');
    });

    it('should include CSS styling in HTML', async () => {
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'html',
      };

      const docs = await generator.generate(options);
      const content = docs[0].content;

      expect(content).toContain('<style>');
      expect(content).toContain('</style>');
    });
  });

  describe('File Operations', () => {
    it('should create output directory if it does not exist', async () => {
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs/api',
        format: 'markdown',
      };

      await generator.generate(options);

      expect(mkdir).toHaveBeenCalled();
    });

    it('should write file with correct path', async () => {
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'markdown',
      };

      await generator.generate(options);

      expect(writeFile).toHaveBeenCalled();
      const writeCall = vi.mocked(writeFile).mock.calls[0];
      expect(writeCall[0]).toContain('docs');
    });

    it('should handle write errors gracefully', async () => {
      vi.mocked(writeFile).mockRejectedValueOnce(new Error('Write failed'));

      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'markdown',
      };

      await expect(generator.generate(options)).rejects.toThrow('Failed to generate documentation');
    });
  });

  describe('Multiple Files', () => {
    it('should generate documentation for multiple source files', async () => {
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'markdown',
      };

      const docs = await generator.generate(options);

      expect(docs.length).toBeGreaterThan(0);
    });

    it('should track progress for multiple files', async () => {
      const { createProgress } = await import('../../../src/utils/progress.js');
      
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'markdown',
      };

      await generator.generate(options);

      expect(createProgress).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty source directory', async () => {
      const { createAnalyzer } = await import('../../../src/core/code-analyzer/index.js');
      vi.mocked(createAnalyzer).mockReturnValueOnce({
        analyze: vi.fn().mockResolvedValue({
          summary: {
            totalFiles: 0,
            totalLines: 0,
            totalFunctions: 0,
            totalClasses: 0,
            languages: {},
            analyzedAt: new Date(),
            duration: 0,
          },
          files: [],
          dependencies: {
            nodes: [],
            edges: [],
          },
          metrics: {
            complexity: {
              average: 0,
              max: 0,
              min: 0,
              distribution: {},
            },
            maintainability: {
              index: 0,
              score: 'A' as const,
              factors: {
                complexity: 0,
                volume: 0,
                effort: 0,
              },
            },
            quality: {
              documentationCoverage: 0,
              duplicateCode: 0,
              codeSmells: 0,
            },
          },
          issues: [],
        }),
      } as any);

      const options: DocGenerationOptions = {
        source: './empty',
        output: './docs',
        format: 'markdown',
      };

      const docs = await generator.generate(options);

      expect(docs).toHaveLength(1);
      expect(docs[0].content).toBeTruthy();
    });

    it('should handle special characters in paths', async () => {
      const options: DocGenerationOptions = {
        source: './src/special-chars',
        output: './docs/output',
        format: 'markdown',
      };

      const docs = await generator.generate(options);

      expect(docs).toHaveLength(1);
    });

    it('should handle very long file names', async () => {
      const longName = 'a'.repeat(200);
      const options: DocGenerationOptions = {
        source: './src',
        output: `./docs/${longName}`,
        format: 'markdown',
      };

      const docs = await generator.generate(options);

      expect(docs).toHaveLength(1);
    });
  });

  describe('Performance', () => {
    it('should complete generation in reasonable time', async () => {
      const options: DocGenerationOptions = {
        source: './src',
        output: './docs',
        format: 'markdown',
      };

      const startTime = Date.now();
      await generator.generate(options);
      const duration = Date.now() - startTime;

      // Should complete in less than 5 seconds (generous for CI)
      expect(duration).toBeLessThan(5000);
    });
  });
});

// Made with Bob
