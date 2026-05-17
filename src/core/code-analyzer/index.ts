/**
 * Code Analyzer Module
 *
 * Provides static code analysis and insight extraction
 */

export * from './types.js';
export * from './analyzer.js';

import { CodeAnalyzer } from './analyzer.js';
import type { AnalysisOptions, AnalysisResult } from './types.js';

/**
 * Helper function to analyze code
 */
export async function analyzeCode(path: string, options?: Partial<AnalysisOptions>): Promise<AnalysisResult> {
  const analyzer = new CodeAnalyzer();
  return analyzer.analyze({
    path,
    ...options
  } as AnalysisOptions);
}

// Made with Bob
