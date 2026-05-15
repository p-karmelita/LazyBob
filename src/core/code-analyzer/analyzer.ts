/**
 * Code Analyzer Implementation
 */

import { glob } from 'glob';
import { readFile, stat } from 'fs/promises';
import { relative, extname, basename } from 'path';
import { logger } from '../../utils/logger.js';
import { AnalysisError, FileAccessError } from '../../utils/errors.js';
import { createTypeScriptParser } from './ts-parser.js';
import type {
  AnalysisOptions,
  AnalysisResult,
  AnalysisSummary,
  FileAnalysis,
  DependencyGraph,
  CodeMetrics,
  CodeIssue,
  LanguageStats,
} from './types.js';

/**
 * Code Analyzer class
 */
export class CodeAnalyzer {
  private readonly defaultOptions: Partial<AnalysisOptions> = {
    includeTests: true,
    generateDiagram: false,
    maxDepth: 10,
    filePatterns: ['**/*.ts', '**/*.js', '**/*.tsx', '**/*.jsx'],
    excludePatterns: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.git/**'],
    maxFileSizeMB: 10,
  };

  /**
   * Analyze a codebase
   */
  async analyze(options: AnalysisOptions): Promise<AnalysisResult> {
    const startTime = Date.now();
    const opts = { ...this.defaultOptions, ...options };

    logger.info('Starting code analysis', {
      path: opts.path,
      includeTests: opts.includeTests,
    });

    try {
      // Find files to analyze
      const files = await this.findFiles(opts);
      logger.debug(`Found ${files.length} files to analyze`);

      // Analyze each file
      const fileAnalyses: FileAnalysis[] = [];
      const issues: CodeIssue[] = [];

      for (const file of files) {
        try {
          const analysis = await this.analyzeFile(file, opts);
          fileAnalyses.push(analysis);
        } catch (error) {
          logger.warn(`Failed to analyze file: ${file}`, {
            error: error instanceof Error ? error.message : String(error),
          });
          issues.push({
            severity: 'warning',
            message: `Failed to analyze file: ${error instanceof Error ? error.message : String(error)}`,
            file,
            line: 0,
          });
        }
      }

      // Build dependency graph
      const dependencies = this.buildDependencyGraph(fileAnalyses);

      // Calculate metrics
      const metrics = this.calculateMetrics(fileAnalyses);

      // Generate summary
      const summary = this.generateSummary(fileAnalyses, startTime);

      logger.info('Code analysis completed', {
        files: summary.totalFiles,
        lines: summary.totalLines,
        duration: summary.duration,
      });

      return {
        summary,
        files: fileAnalyses,
        dependencies,
        metrics,
        issues,
      };
    } catch (error) {
      logger.error('Code analysis failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw new AnalysisError('Failed to analyze codebase', {
        path: opts.path,
        error,
      });
    }
  }

  /**
   * Find files to analyze
   */
  private async findFiles(options: AnalysisOptions): Promise<string[]> {
    // Check if path is a file
    try {
      const stats = await stat(options.path);
      if (stats.isFile()) {
        // If it's a file, return it directly
        return [options.path];
      }
    } catch (error) {
      // Path doesn't exist or is not accessible, continue with glob
    }

    const patterns = options.filePatterns || this.defaultOptions.filePatterns!;
    const ignore = options.excludePatterns || this.defaultOptions.excludePatterns!;

    // Add test exclusion if needed
    if (!options.includeTests) {
      ignore.push('**/*.test.*', '**/*.spec.*', '**/tests/**', '**/__tests__/**');
    }

    try {
      const files = await glob(patterns, {
        cwd: options.path,
        ignore,
        absolute: true,
        nodir: true,
      });

      // Filter by file size
      const validFiles: string[] = [];
      const maxSize = (options.maxFileSizeMB || 10) * 1024 * 1024;

      for (const file of files) {
        try {
          const stats = await stat(file);
          if (stats.size <= maxSize) {
            validFiles.push(file);
          } else {
            logger.warn(`Skipping large file: ${file}`, {
              size: stats.size,
              maxSize,
            });
          }
        } catch (error) {
          logger.warn(`Failed to stat file: ${file}`);
        }
      }

      return validFiles;
    } catch (error) {
      throw new FileAccessError('Failed to find files', options.path, { error });
    }
  }

  /**
   * Analyze a single file
   */
  private async analyzeFile(filePath: string, options: AnalysisOptions): Promise<FileAnalysis> {
    try {
      const content = await readFile(filePath, 'utf-8');
      const lines = content.split('\n');
      const stats = await stat(filePath);
      const language = this.detectLanguage(filePath);
      const relativePath = relative(options.path, filePath);

      // Use TypeScript parser for .ts and .tsx files
      if (language === 'TypeScript') {
        try {
          const parser = createTypeScriptParser();
          const parsed = await parser.parseFile(filePath);
          parser.dispose();

          return {
            path: relativePath,
            language,
            lines: lines.length,
            size: stats.size,
            functions: parsed.functions,
            classes: parsed.classes,
            imports: parsed.imports,
            exports: parsed.exports,
            complexity: parsed.complexity,
          };
        } catch (parseError) {
          logger.warn('TypeScript parser failed, falling back to regex', {
            filePath: relativePath,
            error: parseError instanceof Error ? parseError.message : String(parseError),
          });
          // Fall through to regex-based parsing
        }
      }

      // Fallback: Basic regex-based analysis for other languages or if TS parsing fails
      const imports = this.extractImports(content, language);
      const exports = this.extractExports(content, language);
      const functions = this.extractFunctions(content, language);
      const classes = this.extractClasses(content, language);
      const complexity = this.calculateFileComplexity(content);

      return {
        path: relativePath,
        language,
        lines: lines.length,
        size: stats.size,
        functions,
        classes,
        imports,
        exports,
        complexity,
      };
    } catch (error) {
      throw new FileAccessError('Failed to analyze file', filePath, { error });
    }
  }

  /**
   * Detect programming language from file extension
   */
  private detectLanguage(filePath: string): string {
    const ext = extname(filePath).toLowerCase();
    const languageMap: Record<string, string> = {
      '.ts': 'TypeScript',
      '.tsx': 'TypeScript',
      '.js': 'JavaScript',
      '.jsx': 'JavaScript',
      '.py': 'Python',
      '.java': 'Java',
      '.go': 'Go',
      '.rs': 'Rust',
      '.cpp': 'C++',
      '.c': 'C',
      '.cs': 'C#',
      '.rb': 'Ruby',
      '.php': 'PHP',
    };
    return languageMap[ext] || 'Unknown';
  }

  /**
   * Extract imports from file content
   */
  private extractImports(content: string, language: string): string[] {
    const imports: string[] = [];
    
    if (language === 'TypeScript' || language === 'JavaScript') {
      // Match ES6 imports
      const importRegex = /import\s+(?:[\w\s{},*]+\s+from\s+)?['"]([^'"]+)['"]/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        imports.push(match[1]);
      }
      
      // Match require statements
      const requireRegex = /require\s*\(['"]([^'"]+)['"]\)/g;
      while ((match = requireRegex.exec(content)) !== null) {
        imports.push(match[1]);
      }
    }
    
    return imports;
  }

  /**
   * Extract exports from file content
   */
  private extractExports(content: string, language: string): string[] {
    const exports: string[] = [];
    
    if (language === 'TypeScript' || language === 'JavaScript') {
      // Match named exports
      const exportRegex = /export\s+(?:const|let|var|function|class|interface|type|enum)\s+(\w+)/g;
      let match;
      while ((match = exportRegex.exec(content)) !== null) {
        exports.push(match[1]);
      }
      
      // Match export { ... }
      const exportBlockRegex = /export\s*{\s*([^}]+)\s*}/g;
      while ((match = exportBlockRegex.exec(content)) !== null) {
        const names = match[1].split(',').map(n => n.trim().split(/\s+as\s+/)[0]);
        exports.push(...names);
      }
    }
    
    return exports;
  }

  /**
   * Extract functions from file content (simplified)
   */
  private extractFunctions(content: string, language: string) {
    const functions = [];
    
    if (language === 'TypeScript' || language === 'JavaScript') {
      // Match function declarations
      const funcRegex = /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(/g;
      let match;
      let lineNumber = 1;
      
      for (const line of content.split('\n')) {
        funcRegex.lastIndex = 0;
        if ((match = funcRegex.exec(line)) !== null) {
          functions.push({
            name: match[1],
            line: lineNumber,
            complexity: 1,
            parameters: [],
            isAsync: line.includes('async'),
            isExported: line.includes('export'),
          });
        }
        lineNumber++;
      }
    }
    
    return functions;
  }

  /**
   * Extract classes from file content (simplified)
   */
  private extractClasses(content: string, language: string) {
    const classes = [];
    
    if (language === 'TypeScript' || language === 'JavaScript') {
      // Match class declarations
      const classRegex = /(?:export\s+)?class\s+(\w+)/g;
      let match;
      let lineNumber = 1;
      
      for (const line of content.split('\n')) {
        classRegex.lastIndex = 0;
        if ((match = classRegex.exec(line)) !== null) {
          classes.push({
            name: match[1],
            line: lineNumber,
            methods: [],
            properties: [],
            isExported: line.includes('export'),
          });
        }
        lineNumber++;
      }
    }
    
    return classes;
  }

  /**
   * Calculate file complexity (simplified cyclomatic complexity)
   */
  private calculateFileComplexity(content: string): number {
    let complexity = 1; // Base complexity
    
    // Count decision points
    const decisionKeywords = ['if', 'else', 'for', 'while', 'case', 'catch', '&&', '||', '?'];
    
    for (const keyword of decisionKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const matches = content.match(regex);
      if (matches) {
        complexity += matches.length;
      }
    }
    
    return complexity;
  }

  /**
   * Build dependency graph
   */
  private buildDependencyGraph(files: FileAnalysis[]): DependencyGraph {
    const nodes = files.map(file => ({
      id: file.path,
      label: basename(file.path),
      type: 'file' as const,
      path: file.path,
    }));

    const edges = files.flatMap(file =>
      file.imports.map(imp => ({
        from: file.path,
        to: imp,
        type: 'import' as const,
      }))
    );

    return { nodes, edges };
  }

  /**
   * Calculate code metrics
   */
  private calculateMetrics(files: FileAnalysis[]): CodeMetrics {
    const complexities = files.map(f => f.complexity);
    const totalComplexity = complexities.reduce((sum, c) => sum + c, 0);
    const avgComplexity = totalComplexity / files.length || 0;

    // Calculate maintainability index (simplified)
    const totalLines = files.reduce((sum, f) => sum + f.lines, 0);
    const volume = totalLines * Math.log2(totalLines || 1);
    const maintainabilityIndex = Math.max(0, (171 - 5.2 * Math.log(volume) - 0.23 * avgComplexity) * 100 / 171);

    const score = 
      maintainabilityIndex >= 80 ? 'A' :
      maintainabilityIndex >= 60 ? 'B' :
      maintainabilityIndex >= 40 ? 'C' :
      maintainabilityIndex >= 20 ? 'D' : 'F';

    // Calculate documentation coverage
    const totalFunctions = files.reduce((sum, f) => sum + f.functions.length, 0);
    const documentationCoverage = totalFunctions > 0 ? 50 : 0; // Simplified

    return {
      complexity: {
        average: avgComplexity,
        max: Math.max(...complexities, 0),
        min: Math.min(...complexities, 0),
        distribution: this.calculateComplexityDistribution(complexities),
      },
      maintainability: {
        index: maintainabilityIndex,
        score,
        factors: {
          complexity: avgComplexity,
          volume,
          effort: volume * avgComplexity,
        },
      },
      quality: {
        documentationCoverage,
        duplicateCode: 0,
        codeSmells: 0,
      },
    };
  }

  /**
   * Calculate complexity distribution
   */
  private calculateComplexityDistribution(complexities: number[]): Record<string, number> {
    const distribution: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
      veryHigh: 0,
    };

    for (const complexity of complexities) {
      if (complexity <= 5) distribution.low++;
      else if (complexity <= 10) distribution.medium++;
      else if (complexity <= 20) distribution.high++;
      else distribution.veryHigh++;
    }

    return distribution;
  }

  /**
   * Generate analysis summary
   */
  private generateSummary(files: FileAnalysis[], startTime: number): AnalysisSummary {
    const languages: Record<string, number> = {};
    let totalLines = 0;
    let totalFunctions = 0;
    let totalClasses = 0;

    for (const file of files) {
      languages[file.language] = (languages[file.language] || 0) + 1;
      totalLines += file.lines;
      totalFunctions += file.functions.length;
      totalClasses += file.classes.length;
    }

    return {
      totalFiles: files.length,
      totalLines,
      totalFunctions,
      totalClasses,
      languages,
      analyzedAt: new Date(),
      duration: Date.now() - startTime,
    };
  }

  /**
   * Get language statistics
   */
  getLanguageStats(result: AnalysisResult): LanguageStats[] {
    const stats: LanguageStats[] = [];
    const totalFiles = result.summary.totalFiles;

    for (const [language, count] of Object.entries(result.summary.languages)) {
      const languageFiles = result.files.filter(f => f.language === language);
      const lines = languageFiles.reduce((sum, f) => sum + f.lines, 0);

      stats.push({
        language,
        files: count,
        lines,
        percentage: (count / totalFiles) * 100,
      });
    }

    return stats.sort((a, b) => b.files - a.files);
  }
}

/**
 * Create a code analyzer instance
 */
export function createAnalyzer(): CodeAnalyzer {
  return new CodeAnalyzer();
}

// Made with Bob
