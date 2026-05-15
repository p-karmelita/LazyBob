/**
 * Task Automator Type Definitions
 */

/**
 * Task types that can be automated
 */
export type TaskType =
  | 'code-review'
  | 'refactor'
  | 'test-generation'
  | 'bug-fix'
  | 'feature-implementation'
  | 'documentation'
  | 'optimization'
  | 'security-audit'
  | 'dependency-update'
  | 'custom';

/**
 * Task priority levels
 */
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * Task status
 */
export type TaskStatus = 
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'failed'
  | 'cancelled';

/**
 * Automation strategy
 */
export type AutomationStrategy = 
  | 'bob-assisted'    // Use Bob IDE for automation
  | 'rule-based'      // Use predefined rules
  | 'ai-powered'      // Use AI models (watsonx)
  | 'hybrid';         // Combination of strategies

/**
 * Task configuration
 */
export interface TaskConfig {
  type: TaskType;
  priority: TaskPriority;
  strategy: AutomationStrategy;
  description: string;
  targetPath: string;
  options?: Record<string, unknown>;
}

/**
 * Task execution options
 */
export interface TaskExecutionOptions {
  dryRun?: boolean;
  interactive?: boolean;
  maxRetries?: number;
  timeout?: number;
  bobcoinLimit?: number;
}

/**
 * Task result
 */
export interface TaskResult {
  taskId: string;
  type: TaskType;
  status: TaskStatus;
  startTime: Date;
  endTime: Date;
  duration: number;
  success: boolean;
  changes: TaskChange[];
  errors: TaskError[];
  metrics: TaskMetrics;
  bobcoinUsed?: number;
}

/**
 * Task change record
 */
export interface TaskChange {
  type: 'file-created' | 'file-modified' | 'file-deleted' | 'line-added' | 'line-removed';
  path: string;
  description: string;
  before?: string;
  after?: string;
  lineNumber?: number;
}

/**
 * Task error
 */
export interface TaskError {
  code: string;
  message: string;
  path?: string;
  line?: number;
  severity: 'warning' | 'error' | 'critical';
  recoverable: boolean;
}

/**
 * Task metrics
 */
export interface TaskMetrics {
  filesAnalyzed: number;
  filesModified: number;
  linesAdded: number;
  linesRemoved: number;
  issuesFound: number;
  issuesFixed: number;
  testsCovered: number;
  complexityReduced: number;
}

/**
 * Code review task options
 */
export interface CodeReviewOptions {
  checkStyle?: boolean;
  checkSecurity?: boolean;
  checkPerformance?: boolean;
  checkMaintainability?: boolean;
  generateReport?: boolean;
  autoFix?: boolean;
}

/**
 * Refactor task options
 */
export interface RefactorOptions {
  extractFunctions?: boolean;
  removeDeadCode?: boolean;
  simplifyConditions?: boolean;
  improveNaming?: boolean;
  addTypes?: boolean;
  modernizeSyntax?: boolean;
}

/**
 * Test generation options
 */
export interface TestGenerationOptions {
  framework?: 'vitest' | 'jest' | 'mocha' | 'ava';
  coverage?: number;
  includeEdgeCases?: boolean;
  includeMocks?: boolean;
  generateFixtures?: boolean;
}

/**
 * Bug fix options
 */
export interface BugFixOptions {
  issueId?: string;
  description?: string;
  reproducible?: boolean;
  addTests?: boolean;
  updateDocs?: boolean;
}

/**
 * Feature implementation options
 */
export interface FeatureOptions {
  specification?: string;
  addTests?: boolean;
  addDocs?: boolean;
  followPatterns?: boolean;
}

/**
 * Optimization options
 */
export interface OptimizationOptions {
  target?: 'performance' | 'memory' | 'bundle-size' | 'all';
  aggressive?: boolean;
  measureBefore?: boolean;
  measureAfter?: boolean;
}

/**
 * Security audit options
 */
export interface SecurityAuditOptions {
  checkDependencies?: boolean;
  checkCredentials?: boolean;
  checkInjections?: boolean;
  checkCrypto?: boolean;
  generateReport?: boolean;
}

/**
 * Dependency update options
 */
export interface DependencyUpdateOptions {
  updateType?: 'patch' | 'minor' | 'major' | 'all';
  testAfterUpdate?: boolean;
  createBackup?: boolean;
  interactive?: boolean;
}

/**
 * Task template
 */
export interface TaskTemplate {
  name: string;
  description: string;
  type: TaskType;
  defaultPriority: TaskPriority;
  defaultStrategy: AutomationStrategy;
  requiredOptions: string[];
  optionalOptions: string[];
  estimatedDuration: number;
  bobcoinEstimate: number;
}

/**
 * Task queue item
 */
export interface TaskQueueItem {
  id: string;
  config: TaskConfig;
  options: TaskExecutionOptions;
  addedAt: Date;
  scheduledFor?: Date;
  dependencies?: string[];
}

/**
 * Task scheduler configuration
 */
export interface SchedulerConfig {
  maxConcurrent: number;
  priorityWeights: Record<TaskPriority, number>;
  retryStrategy: 'exponential' | 'linear' | 'fixed';
  retryDelay: number;
}

/**
 * Automation report
 */
export interface AutomationReport {
  summary: {
    totalTasks: number;
    completed: number;
    failed: number;
    cancelled: number;
    totalDuration: number;
    totalBobcoinUsed: number;
  };
  tasks: TaskResult[];
  recommendations: string[];
  generatedAt: Date;
}

// Made with Bob
