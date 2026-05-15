/**
 * Core type definitions for LazyBob
 */

import { z } from 'zod';

// ============================================================================
// Configuration Types
// ============================================================================

export const ConfigSchema = z.object({
  bob: z.object({
    apiKey: z.string().min(1),
    teamId: z.string().min(1),
    endpoint: z.string().url().optional(),
  }),
  watsonx: z
    .object({
      ai: z
        .object({
          apiKey: z.string().min(1),
          projectId: z.string().min(1),
          endpoint: z.string().url(),
        })
        .optional(),
      orchestrate: z
        .object({
          apiKey: z.string().min(1),
          endpoint: z.string().url(),
        })
        .optional(),
    })
    .optional(),
  features: z.object({
    enableWatsonxAI: z.boolean().default(false),
    enableWatsonxOrchestrate: z.boolean().default(false),
    enableAdvancedAnalysis: z.boolean().default(true),
    enableAutoDocumentation: z.boolean().default(true),
  }),
  analysis: z.object({
    maxFileSizeMB: z.number().positive().default(10),
    timeoutMs: z.number().positive().default(30000),
    maxConcurrent: z.number().positive().default(5),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;

// ============================================================================
// Bob Integration Types
// ============================================================================

export interface BobClientConfig {
  apiKey: string;
  teamId: string;
  endpoint?: string;
}

export interface BobRequest {
  prompt: string;
  context?: string;
  mode?: 'code' | 'plan' | 'ask' | 'advanced';
  files?: string[];
}

export interface BobResponse {
  content: string;
  bobcoinsUsed: number;
  sessionId: string;
  timestamp: Date;
}

export interface BobSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  bobcoinsUsed: number;
  tasks: BobTask[];
}

export interface BobTask {
  id: string;
  description: string;
  mode: string;
  bobcoinsUsed: number;
  timestamp: Date;
}

// ============================================================================
// Code Analysis Types
// ============================================================================

export interface AnalysisOptions {
  path: string;
  includeTests?: boolean;
  generateDiagram?: boolean;
  maxDepth?: number;
  filePatterns?: string[];
  excludePatterns?: string[];
}

export interface AnalysisResult {
  summary: AnalysisSummary;
  files: FileAnalysis[];
  dependencies: DependencyGraph;
  metrics: CodeMetrics;
  issues: CodeIssue[];
}

export interface AnalysisSummary {
  totalFiles: number;
  totalLines: number;
  totalFunctions: number;
  totalClasses: number;
  languages: Record<string, number>;
  analyzedAt: Date;
}

export interface FileAnalysis {
  path: string;
  language: string;
  lines: number;
  functions: FunctionInfo[];
  classes: ClassInfo[];
  imports: string[];
  exports: string[];
}

export interface FunctionInfo {
  name: string;
  line: number;
  complexity: number;
  parameters: string[];
  returnType?: string;
}

export interface ClassInfo {
  name: string;
  line: number;
  methods: FunctionInfo[];
  properties: string[];
}

export interface DependencyGraph {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

export interface DependencyNode {
  id: string;
  label: string;
  type: 'file' | 'module' | 'package';
}

export interface DependencyEdge {
  from: string;
  to: string;
  type: 'import' | 'require' | 'dynamic';
}

export interface CodeMetrics {
  complexity: ComplexityMetrics;
  maintainability: MaintainabilityMetrics;
  quality: QualityMetrics;
}

export interface ComplexityMetrics {
  average: number;
  max: number;
  distribution: Record<string, number>;
}

export interface MaintainabilityMetrics {
  index: number;
  score: 'A' | 'B' | 'C' | 'D' | 'F';
}

export interface QualityMetrics {
  testCoverage?: number;
  documentationCoverage: number;
  duplicateCode: number;
}

export interface CodeIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
  file: string;
  line: number;
  rule?: string;
}

// ============================================================================
// Documentation Generation Types
// ============================================================================

export interface DocGenerationOptions {
  source: string;
  output: string;
  format: 'markdown' | 'html' | 'json';
  includeExamples?: boolean;
  includeDiagrams?: boolean;
  template?: string;
}

export interface GeneratedDoc {
  path: string;
  content: string;
  format: string;
  generatedAt: Date;
}

export interface APIDocumentation {
  modules: ModuleDoc[];
  types: TypeDoc[];
  functions: FunctionDoc[];
  classes: ClassDoc[];
}

export interface ModuleDoc {
  name: string;
  description: string;
  exports: string[];
  examples?: string[];
}

export interface TypeDoc {
  name: string;
  description: string;
  properties: PropertyDoc[];
  examples?: string[];
}

export interface PropertyDoc {
  name: string;
  type: string;
  description: string;
  required: boolean;
  default?: string;
}

export interface FunctionDoc {
  name: string;
  description: string;
  parameters: ParameterDoc[];
  returns: ReturnDoc;
  examples?: string[];
  throws?: string[];
}

export interface ParameterDoc {
  name: string;
  type: string;
  description: string;
  required: boolean;
  default?: string;
}

export interface ReturnDoc {
  type: string;
  description: string;
}

export interface ClassDoc {
  name: string;
  description: string;
  constructor: FunctionDoc;
  methods: FunctionDoc[];
  properties: PropertyDoc[];
  examples?: string[];
}

// ============================================================================
// Task Automation Types
// ============================================================================

export interface TaskOptions {
  task: string;
  name?: string;
  template?: string;
  output?: string;
  dryRun?: boolean;
  interactive?: boolean;
}

export interface TaskResult {
  success: boolean;
  message: string;
  filesCreated: string[];
  filesModified: string[];
  errors?: string[];
}

export interface TaskTemplate {
  name: string;
  description: string;
  files: TemplateFile[];
  prompts?: TemplatePrompt[];
}

export interface TemplateFile {
  path: string;
  content: string;
  variables?: string[];
}

export interface TemplatePrompt {
  name: string;
  message: string;
  type: 'text' | 'select' | 'confirm' | 'multiselect';
  choices?: string[];
  default?: string;
  validate?: (value: string) => boolean | string;
}

// ============================================================================
// Error Types
// ============================================================================

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class BobAPIError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'BOB_API_ERROR', context);
    this.name = 'BobAPIError';
  }
}

export class AnalysisError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'ANALYSIS_ERROR', context);
    this.name = 'AnalysisError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', context);
    this.name = 'ValidationError';
  }
}

// ============================================================================
// Utility Types
// ============================================================================

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

export interface ProgressEvent {
  current: number;
  total: number;
  message: string;
  percentage: number;
}

export type ProgressCallback = (event: ProgressEvent) => void;

export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

// Made with Bob
