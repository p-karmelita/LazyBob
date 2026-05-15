/**
 * Type definitions for Code Analyzer
 */

/**
 * Analysis options
 */
export interface AnalysisOptions {
  path: string;
  includeTests?: boolean;
  generateDiagram?: boolean;
  maxDepth?: number;
  filePatterns?: string[];
  excludePatterns?: string[];
  maxFileSizeMB?: number;
}

/**
 * Analysis result
 */
export interface AnalysisResult {
  summary: AnalysisSummary;
  files: FileAnalysis[];
  dependencies: DependencyGraph;
  metrics: CodeMetrics;
  issues: CodeIssue[];
}

/**
 * Analysis summary
 */
export interface AnalysisSummary {
  totalFiles: number;
  totalLines: number;
  totalFunctions: number;
  totalClasses: number;
  languages: Record<string, number>;
  analyzedAt: Date;
  duration: number;
}

/**
 * File analysis
 */
export interface FileAnalysis {
  path: string;
  language: string;
  lines: number;
  size: number;
  functions: FunctionInfo[];
  classes: ClassInfo[];
  imports: string[];
  exports: string[];
  complexity: number;
}

/**
 * Function information
 */
export interface FunctionInfo {
  name: string;
  line: number;
  endLine?: number;
  complexity: number;
  parameters: ParameterInfo[];
  returnType?: string;
  isAsync: boolean;
  isExported: boolean;
}

/**
 * Parameter information
 */
export interface ParameterInfo {
  name: string;
  type?: string;
  optional: boolean;
  defaultValue?: string;
}

/**
 * Class information
 */
export interface ClassInfo {
  name: string;
  line: number;
  endLine?: number;
  methods: FunctionInfo[];
  properties: PropertyInfo[];
  isExported: boolean;
  extendsClass?: string;
  implementsInterfaces?: string[];
}

/**
 * Property information
 */
export interface PropertyInfo {
  name: string;
  type?: string;
  visibility: 'public' | 'private' | 'protected';
  isStatic: boolean;
  isReadonly: boolean;
}

/**
 * Dependency graph
 */
export interface DependencyGraph {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

/**
 * Dependency node
 */
export interface DependencyNode {
  id: string;
  label: string;
  type: 'file' | 'module' | 'package';
  path?: string;
}

/**
 * Dependency edge
 */
export interface DependencyEdge {
  from: string;
  to: string;
  type: 'import' | 'require' | 'dynamic';
  line?: number;
}

/**
 * Code metrics
 */
export interface CodeMetrics {
  complexity: ComplexityMetrics;
  maintainability: MaintainabilityMetrics;
  quality: QualityMetrics;
}

/**
 * Complexity metrics
 */
export interface ComplexityMetrics {
  average: number;
  max: number;
  min: number;
  distribution: Record<string, number>;
}

/**
 * Maintainability metrics
 */
export interface MaintainabilityMetrics {
  index: number;
  score: 'A' | 'B' | 'C' | 'D' | 'F';
  factors: {
    complexity: number;
    volume: number;
    effort: number;
  };
}

/**
 * Quality metrics
 */
export interface QualityMetrics {
  testCoverage?: number;
  documentationCoverage: number;
  duplicateCode: number;
  codeSmells: number;
}

/**
 * Code issue
 */
export interface CodeIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
  file: string;
  line: number;
  column?: number;
  rule?: string;
  suggestion?: string;
}

/**
 * Language statistics
 */
export interface LanguageStats {
  language: string;
  files: number;
  lines: number;
  percentage: number;
}

// Made with Bob
