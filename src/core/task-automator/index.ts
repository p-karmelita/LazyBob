/**
 * Task Automator Module
 * 
 * Automates common development tasks using AI assistance
 */

export { TaskAutomator, createTaskAutomator } from './automator.js';
export { runTaskAutomator } from './cli.js';
export type {
  TaskType,
  TaskPriority,
  TaskStatus,
  AutomationStrategy,
  TaskConfig,
  TaskExecutionOptions,
  TaskResult,
  TaskChange,
  TaskError,
  TaskMetrics,
  CodeReviewOptions,
  RefactorOptions,
  TestGenerationOptions,
  BugFixOptions,
  FeatureOptions,
  OptimizationOptions,
  SecurityAuditOptions,
  DependencyUpdateOptions,
  TaskTemplate,
  TaskQueueItem,
  SchedulerConfig,
  AutomationReport,
} from './types.js';

// Made with Bob
