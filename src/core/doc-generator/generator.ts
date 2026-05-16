/**
 * Documentation Generator Implementation
 */

import { writeFile, mkdir } from 'fs/promises';
import { dirname, join, basename, extname } from 'path';
import { logger } from '../../utils/logger.js';
import { AnalysisError } from '../../utils/errors.js';
import { createProgress } from '../../utils/progress.js';
import { createAnalyzer } from '../code-analyzer/index.js';
import type {
  DocGenerationOptions,
  GeneratedDoc,
  APIDocumentation,
} from './types.js';
import type { AnalysisResult } from '../code-analyzer/types.js';

/**
 * Documentation Generator class
 */
export class DocGenerator {
  private readonly defaultOptions: Partial<DocGenerationOptions> = {
    format: 'markdown',
    includeExamples: true,
    includeDiagrams: false,
    includePrivate: false,
  };

  /**
   * Generate documentation
   */
  async generate(options: DocGenerationOptions): Promise<GeneratedDoc[]> {
    const opts = { ...this.defaultOptions, ...options };
    
    logger.info('Starting documentation generation', {
      source: opts.source,
      output: opts.output,
      format: opts.format,
    });

    try {
      // Analyze the codebase first
      const analyzeProgress = createProgress({
        style: 'spinner',
        message: 'Analyzing codebase...',
      });
      analyzeProgress.start();

      const analyzer = createAnalyzer();
      const analysis = await analyzer.analyze({
        path: opts.source,
        includeTests: false,
      });

      analyzeProgress.complete('✓ Analysis complete');

      // Generate documentation based on format
      const genProgress = createProgress({
        style: 'spinner',
        message: `Generating ${opts.format} documentation...`,
      });
      genProgress.start();

      const docs: GeneratedDoc[] = [];

      if (opts.format === 'markdown') {
        const doc = await this.generateMarkdown(analysis, opts);
        docs.push(doc);
      } else if (opts.format === 'json') {
        const doc = await this.generateJSON(analysis, opts);
        docs.push(doc);
      } else if (opts.format === 'html') {
        const doc = await this.generateHTML(analysis, opts);
        docs.push(doc);
      }

      genProgress.complete('✓ Documentation generated');

      // Write documentation files
      const writeProgress = createProgress({
        total: docs.length,
        style: 'bar',
        message: 'Writing files',
      });
      writeProgress.start();

      for (let i = 0; i < docs.length; i++) {
        const doc = docs[i];
        await this.writeDoc(doc);
        writeProgress.update(i + 1, `Writing: ${basename(doc.path)}`);
      }

      writeProgress.complete('✓ Files written');

      logger.info('Documentation generation completed', {
        files: docs.length,
        output: opts.output,
      });

      return docs;
    } catch (error) {
      logger.error('Documentation generation failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AnalysisError('Failed to generate documentation', {
        source: opts.source,
        error,
      });
    }
  }

  /**
   * Generate Markdown documentation
   */
  private async generateMarkdown(
    analysis: AnalysisResult,
    options: DocGenerationOptions
  ): Promise<GeneratedDoc> {
    const sections: string[] = [];

    // Title and description
    sections.push(`# ${options.title || 'API Documentation'}\n`);
    if (options.description) {
      sections.push(`${options.description}\n`);
    }

    // Table of contents
    sections.push('## Table of Contents\n');
    sections.push(this.generateTOC(analysis));

    // Overview
    sections.push('\n## Overview\n');
    sections.push(this.generateOverview(analysis));

    // Modules
    if (analysis.files.length > 0) {
      sections.push('\n## Modules\n');
      sections.push(this.generateModulesSection(analysis));
    }

    // Functions
    const allFunctions = analysis.files.flatMap(f => f.functions);
    if (allFunctions.length > 0) {
      sections.push('\n## Functions\n');
      sections.push(this.generateFunctionsSection(analysis));
    }

    // Classes
    const allClasses = analysis.files.flatMap(f => f.classes);
    if (allClasses.length > 0) {
      sections.push('\n## Classes\n');
      sections.push(this.generateClassesSection(analysis));
    }

    // Dependencies
    if (analysis.dependencies.edges.length > 0) {
      sections.push('\n## Dependencies\n');
      sections.push(this.generateDependenciesSection(analysis));
    }

    // Metrics
    sections.push('\n## Code Metrics\n');
    sections.push(this.generateMetricsSection(analysis));

    const content = sections.join('\n');

    return {
      path: join(options.output, 'API.md'),
      content,
      format: 'markdown',
      generatedAt: new Date(),
      metadata: {
        title: options.title || 'API Documentation',
        description: options.description,
        generatedBy: 'LazyBob Documentation Generator',
        timestamp: new Date(),
      },
    };
  }

  /**
   * Generate table of contents
   */
  private generateTOC(analysis: AnalysisResult): string {
    const toc: string[] = [];
    
    toc.push('- [Overview](#overview)');
    
    if (analysis.files.length > 0) {
      toc.push('- [Modules](#modules)');
    }
    
    const allFunctions = analysis.files.flatMap(f => f.functions);
    if (allFunctions.length > 0) {
      toc.push('- [Functions](#functions)');
    }
    
    const allClasses = analysis.files.flatMap(f => f.classes);
    if (allClasses.length > 0) {
      toc.push('- [Classes](#classes)');
    }
    
    if (analysis.dependencies.edges.length > 0) {
      toc.push('- [Dependencies](#dependencies)');
    }
    
    toc.push('- [Code Metrics](#code-metrics)');
    
    return toc.join('\n');
  }

  /**
   * Generate overview section
   */
  private generateOverview(analysis: AnalysisResult): string {
    const lines: string[] = [];
    
    lines.push(`This documentation covers ${analysis.summary.totalFiles} files with ${analysis.summary.totalLines.toLocaleString()} lines of code.\n`);
    
    lines.push('### Statistics\n');
    lines.push(`- **Total Files**: ${analysis.summary.totalFiles}`);
    lines.push(`- **Total Lines**: ${analysis.summary.totalLines.toLocaleString()}`);
    lines.push(`- **Total Functions**: ${analysis.summary.totalFunctions}`);
    lines.push(`- **Total Classes**: ${analysis.summary.totalClasses}`);
    
    lines.push('\n### Languages\n');
    for (const [lang, count] of Object.entries(analysis.summary.languages)) {
      lines.push(`- **${lang}**: ${count} files`);
    }
    
    return lines.join('\n');
  }

  /**
   * Generate modules section
   */
  private generateModulesSection(analysis: AnalysisResult): string {
    const lines: string[] = [];
    
    for (const file of analysis.files) {
      lines.push(`### \`${file.path}\`\n`);
      lines.push(`**Language**: ${file.language}  `);
      lines.push(`**Lines**: ${file.lines}  `);
      lines.push(`**Complexity**: ${file.complexity}\n`);
      
      if (file.exports.length > 0) {
        lines.push('**Exports**:');
        for (const exp of file.exports) {
          lines.push(`- \`${exp}\``);
        }
        lines.push('');
      }
      
      if (file.imports.length > 0) {
        lines.push('**Imports**:');
        for (const imp of file.imports.slice(0, 5)) {
          lines.push(`- \`${imp}\``);
        }
        if (file.imports.length > 5) {
          lines.push(`- ... and ${file.imports.length - 5} more`);
        }
        lines.push('');
      }
    }
    
    return lines.join('\n');
  }

  /**
   * Generate functions section
   */
  private generateFunctionsSection(analysis: AnalysisResult): string {
    const lines: string[] = [];
    
    for (const file of analysis.files) {
      if (file.functions.length === 0) continue;
      
      lines.push(`### Functions in \`${file.path}\`\n`);
      
      for (const func of file.functions) {
        const asyncLabel = func.isAsync ? 'async ' : '';
        const exportLabel = func.isExported ? 'export ' : '';
        
        lines.push(`#### \`${exportLabel}${asyncLabel}function ${func.name}()\``);
        lines.push('');
        lines.push(`**Location**: Line ${func.line}  `);
        lines.push(`**Complexity**: ${func.complexity}  `);
        lines.push(`**Exported**: ${func.isExported ? 'Yes' : 'No'}  `);
        lines.push(`**Async**: ${func.isAsync ? 'Yes' : 'No'}\n`);
      }
    }
    
    return lines.join('\n');
  }

  /**
   * Generate classes section
   */
  private generateClassesSection(analysis: AnalysisResult): string {
    const lines: string[] = [];
    
    for (const file of analysis.files) {
      if (file.classes.length === 0) continue;
      
      lines.push(`### Classes in \`${file.path}\`\n`);
      
      for (const cls of file.classes) {
        const exportLabel = cls.isExported ? 'export ' : '';
        
        lines.push(`#### \`${exportLabel}class ${cls.name}\``);
        lines.push('');
        lines.push(`**Location**: Line ${cls.line}  `);
        lines.push(`**Exported**: ${cls.isExported ? 'Yes' : 'No'}  `);
        lines.push(`**Methods**: ${cls.methods.length}  `);
        lines.push(`**Properties**: ${cls.properties.length}\n`);
      }
    }
    
    return lines.join('\n');
  }

  /**
   * Generate dependencies section
   */
  private generateDependenciesSection(analysis: AnalysisResult): string {
    const lines: string[] = [];
    
    lines.push('### Dependency Graph\n');
    lines.push(`Total dependencies: ${analysis.dependencies.edges.length}\n`);
    
    // Group by source file
    const depsByFile = new Map<string, string[]>();
    for (const edge of analysis.dependencies.edges) {
      if (!depsByFile.has(edge.from)) {
        depsByFile.set(edge.from, []);
      }
      depsByFile.get(edge.from)!.push(edge.to);
    }
    
    for (const [file, deps] of depsByFile.entries()) {
      lines.push(`**\`${file}\`** imports:`);
      for (const dep of deps.slice(0, 10)) {
        lines.push(`- \`${dep}\``);
      }
      if (deps.length > 10) {
        lines.push(`- ... and ${deps.length - 10} more`);
      }
      lines.push('');
    }
    
    return lines.join('\n');
  }

  /**
   * Generate metrics section
   */
  private generateMetricsSection(analysis: AnalysisResult): string {
    const lines: string[] = [];
    const metrics = analysis.metrics;
    
    lines.push('### Complexity\n');
    lines.push(`- **Average**: ${metrics.complexity.average.toFixed(2)}`);
    lines.push(`- **Maximum**: ${metrics.complexity.max}`);
    lines.push(`- **Minimum**: ${metrics.complexity.min}\n`);
    
    lines.push('### Maintainability\n');
    lines.push(`- **Index**: ${metrics.maintainability.index.toFixed(2)}`);
    lines.push(`- **Score**: ${metrics.maintainability.score}`);
    lines.push(`- **Complexity Factor**: ${metrics.maintainability.factors.complexity.toFixed(2)}`);
    lines.push(`- **Volume**: ${metrics.maintainability.factors.volume.toFixed(2)}\n`);
    
    lines.push('### Quality\n');
    lines.push(`- **Documentation Coverage**: ${metrics.quality.documentationCoverage.toFixed(1)}%`);
    lines.push(`- **Code Smells**: ${metrics.quality.codeSmells}`);
    lines.push(`- **Duplicate Code**: ${metrics.quality.duplicateCode}%\n`);
    
    return lines.join('\n');
  }

  /**
   * Generate JSON documentation
   */
  private async generateJSON(
    analysis: AnalysisResult,
    options: DocGenerationOptions
  ): Promise<GeneratedDoc> {
    const apiDoc: APIDocumentation = {
      modules: [],
      types: [],
      functions: [],
      classes: [],
      interfaces: [],
    };

    // Convert analysis to API documentation format
    for (const file of analysis.files) {
      // Add module
      apiDoc.modules.push({
        name: basename(file.path, extname(file.path)),
        path: file.path,
        description: `Module containing ${file.functions.length} functions and ${file.classes.length} classes`,
        exports: file.exports,
        imports: file.imports,
      });

      // Add functions
      for (const func of file.functions) {
        apiDoc.functions.push({
          name: func.name,
          description: `Function ${func.name}`,
          parameters: func.parameters.map(p => ({
            name: p.name,
            type: p.type || 'any',
            description: '',
            required: !p.optional,
            default: p.defaultValue,
          })),
          returns: {
            type: func.returnType || 'void',
            description: '',
          },
          file: file.path,
          line: func.line,
        });
      }

      // Add classes
      for (const cls of file.classes) {
        apiDoc.classes.push({
          name: cls.name,
          description: `Class ${cls.name}`,
          constructor: {
            description: `Constructor for ${cls.name}`,
            parameters: [],
          },
          methods: cls.methods.map(m => ({
            name: m.name,
            description: `Method ${m.name}`,
            parameters: m.parameters.map(p => ({
              name: p.name,
              type: p.type || 'any',
              description: '',
              required: !p.optional,
              default: p.defaultValue,
            })),
            returns: {
              type: m.returnType || 'void',
              description: '',
            },
            visibility: 'public',
            static: false,
            async: m.isAsync,
          })),
          properties: cls.properties.map(p => ({
            name: p.name,
            type: p.type || 'any',
            description: '',
            required: true,
            readonly: p.isReadonly,
          })),
          file: file.path,
          line: cls.line,
        });
      }
    }

    const content = JSON.stringify(apiDoc, null, 2);

    return {
      path: join(options.output, 'api.json'),
      content,
      format: 'json',
      generatedAt: new Date(),
      metadata: {
        title: options.title || 'API Documentation',
        description: options.description,
        generatedBy: 'LazyBob Documentation Generator',
        timestamp: new Date(),
      },
    };
  }

  /**
   * Generate HTML documentation
   */
  private async generateHTML(
    analysis: AnalysisResult,
    options: DocGenerationOptions
  ): Promise<GeneratedDoc> {
    // Generate markdown first, then wrap in HTML
    const markdownDoc = await this.generateMarkdown(analysis, options);
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${options.title || 'API Documentation'}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3, h4 { color: #2c3e50; }
        code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        pre {
            background: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        a { color: #3498db; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="content">
        ${this.markdownToHTML(markdownDoc.content)}
    </div>
</body>
</html>
    `.trim();

    return {
      path: join(options.output, 'index.html'),
      content: html,
      format: 'html',
      generatedAt: new Date(),
      metadata: markdownDoc.metadata,
    };
  }

  /**
   * Simple markdown to HTML converter
   */
  private markdownToHTML(markdown: string): string {
    let html = markdown;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Lists
    html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    return html;
  }

  /**
   * Write documentation to file
   */
  private async writeDoc(doc: GeneratedDoc): Promise<void> {
    try {
      // Ensure output directory exists
      await mkdir(dirname(doc.path), { recursive: true });
      
      // Write file
      await writeFile(doc.path, doc.content, 'utf-8');
      
      logger.info(`Documentation written to ${doc.path}`);
    } catch (error) {
      throw new AnalysisError('Failed to write documentation', {
        path: doc.path,
        error,
      });
    }
  }
}

/**
 * Create a documentation generator instance
 */
export function createDocGenerator(): DocGenerator {
  return new DocGenerator();
}

// Made with Bob
