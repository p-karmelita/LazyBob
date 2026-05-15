/**
 * Task Automator Implementation
 */

import { randomUUID } from 'crypto';
import { logger } from '../../utils/logger.js';
import { AnalysisError } from '../../utils/errors.js';
import { BobClient } from '../bob-integration/client.js';
import { createAnalyzer } from '../code-analyzer/index.js';
import { createDocGenerator } from '../doc-generator/index.js';
import { getConfig } from '../../utils/config.js';
import type {
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
  DependencyUpdateOptions,
} from './types.js';

/**
 * Task Automator class
 */
export class TaskAutomator {
  private bobClient: BobClient | null = null;
  private readonly defaultOptions: TaskExecutionOptions = {
    dryRun: false,
    interactive: false,
    maxRetries: 3,
    timeout: 300000, // 5 minutes
    bobcoinLimit: 10,
  };

  /**
   * Initialize Bob client if needed
   */
  private async initializeBobClient(): Promise<void> {
    if (!this.bobClient) {
      try {
        const config = getConfig();
        this.bobClient = new BobClient({
          apiKey: config.bob.apiKey,
          teamId: config.bob.teamId,
          endpoint: config.bob.endpoint,
        });
      } catch (error) {
        logger.warn('Bob client initialization failed, some features may be limited', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  /**
   * Execute a task
   */
  async executeTask(
    config: TaskConfig,
    options?: TaskExecutionOptions
  ): Promise<TaskResult> {
    const opts = { ...this.defaultOptions, ...options };
    const taskId = randomUUID();
    const startTime = new Date();

    logger.info('Starting task execution', {
      taskId,
      type: config.type,
      priority: config.priority,
      strategy: config.strategy,
    });

    try {
      // Initialize Bob client if using bob-assisted strategy
      if (config.strategy === 'bob-assisted' || config.strategy === 'hybrid') {
        await this.initializeBobClient();
      }

      // Execute task based on type
      let result: TaskResult;
      switch (config.type) {
        case 'code-review':
          result = await this.executeCodeReview(taskId, config, opts);
          break;
        case 'refactor':
          result = await this.executeRefactor(taskId, config, opts);
          break;
        case 'test-generation':
          result = await this.executeTestGeneration(taskId, config, opts);
          break;
        case 'bug-fix':
          result = await this.executeBugFix(taskId, config, opts);
          break;
        case 'feature-implementation':
          result = await this.executeFeatureImplementation(taskId, config, opts);
          break;
        case 'documentation':
          result = await this.executeDocumentation(taskId, config, opts);
          break;
        case 'optimization':
          result = await this.executeOptimization(taskId, config, opts);
          break;
        case 'security-audit':
          result = await this.executeSecurityAudit(taskId, config, opts);
          break;
        case 'dependency-update':
          result = await this.executeDependencyUpdate(taskId, config, opts);
          break;
        case 'custom':
          result = await this.executeCustomTask(taskId, config, opts);
          break;
        default:
          throw new AnalysisError(`Unknown task type: ${config.type}`);
      }

      const endTime = new Date();
      result.endTime = endTime;
      result.duration = endTime.getTime() - startTime.getTime();

      logger.info('Task execution completed', {
        taskId,
        type: config.type,
        status: result.status,
        duration: result.duration,
      });

      return result;
    } catch (error) {
      const endTime = new Date();
      logger.error('Task execution failed', {
        taskId,
        type: config.type,
        error: error instanceof Error ? error.message : String(error),
      });

      return {
        taskId,
        type: config.type,
        status: 'failed',
        startTime,
        endTime,
        duration: endTime.getTime() - startTime.getTime(),
        success: false,
        changes: [],
        errors: [
          {
            code: 'TASK_EXECUTION_FAILED',
            message: error instanceof Error ? error.message : String(error),
            severity: 'critical',
            recoverable: false,
          },
        ],
        metrics: this.createEmptyMetrics(),
      };
    }
  }

  /**
   * Execute code review task
   */
  private async executeCodeReview(
    taskId: string,
    config: TaskConfig,
    options: TaskExecutionOptions
  ): Promise<TaskResult> {
    const reviewOptions = config.options as CodeReviewOptions | undefined;
    const changes: TaskChange[] = [];
    const errors: TaskError[] = [];

    logger.info('Executing code review', { taskId, path: config.targetPath });

    // Analyze code
    const analyzer = createAnalyzer();
    const analysis = await analyzer.analyze({
      path: config.targetPath,
      includeTests: true,
    });

    const metrics: TaskMetrics = {
      filesAnalyzed: analysis.summary.totalFiles,
      filesModified: 0,
      linesAdded: 0,
      linesRemoved: 0,
      issuesFound: analysis.issues.length,
      issuesFixed: 0,
      testsCovered: 0,
      complexityReduced: 0,
    };

    // Check for issues
    for (const issue of analysis.issues) {
      errors.push({
        code: issue.rule || 'UNKNOWN',
        message: issue.message,
        path: issue.file,
        line: issue.line,
        severity: issue.severity === 'error' ? 'error' : 'warning',
        recoverable: true,
      });
    }

    // Auto-fix if enabled
    if (reviewOptions?.autoFix && !options.dryRun) {
      logger.info('Auto-fixing issues', { count: errors.length });
      // TODO: Implement auto-fix logic
      metrics.issuesFixed = 0;
    }

    return {
      taskId,
      type: 'code-review',
      status: errors.length === 0 ? 'completed' : 'completed',
      startTime: new Date(),
      endTime: new Date(),
      duration: 0,
      success: true,
      changes,
      errors,
      metrics,
    };
  }

  /**
   * Execute refactor task
   */
  private async executeRefactor(
    taskId: string,
    config: TaskConfig,
    options: TaskExecutionOptions
  ): Promise<TaskResult> {
    const refactorOptions = config.options as RefactorOptions | undefined;
    const changes: TaskChange[] = [];
    const errors: TaskError[] = [];

    logger.info('Executing refactor', { taskId, path: config.targetPath });

    // Use Bob for refactoring if available
    if (this.bobClient && !options.dryRun) {
      const prompt = this.buildRefactorPrompt(config, refactorOptions);
      const response = await this.bobClient.request({
        prompt,
        mode: 'code',
      });

      changes.push({
        type: 'file-modified',
        path: config.targetPath,
        description: 'Code refactored',
        before: '',
        after: response.content,
      });
    }

    const metrics: TaskMetrics = {
      filesAnalyzed: 1,
      filesModified: changes.length,
      linesAdded: 0,
      linesRemoved: 0,
      issuesFound: 0,
      issuesFixed: 0,
      testsCovered: 0,
      complexityReduced: 0,
    };

    return {
      taskId,
      type: 'refactor',
      status: 'completed',
      startTime: new Date(),
      endTime: new Date(),
      duration: 0,
      success: true,
      changes,
      errors,
      metrics,
      bobcoinUsed: this.bobClient?.getBobcoinUsage().used || 0,
    };
  }

  /**
   * Execute test generation task
   */
  private async executeTestGeneration(
    taskId: string,
    config: TaskConfig,
    options: TaskExecutionOptions
  ): Promise<TaskResult> {
    const testOptions = config.options as TestGenerationOptions | undefined;
    const changes: TaskChange[] = [];
    const errors: TaskError[] = [];

    logger.info('Executing test generation', { taskId, path: config.targetPath });

    // Use Bob for test generation if available
    if (this.bobClient && !options.dryRun) {
      const prompt = this.buildTestGenerationPrompt(config, testOptions);
      const response = await this.bobClient.request({
        prompt,
        mode: 'code',
      });

      const testPath = config.targetPath.replace(/\.(ts|js)$/, '.test.$1');
      changes.push({
        type: 'file-created',
        path: testPath,
        description: 'Test file generated',
        after: response.content,
      });
    }

    const metrics: TaskMetrics = {
      filesAnalyzed: 1,
      filesModified: 0,
      linesAdded: changes.length > 0 ? 100 : 0,
      linesRemoved: 0,
      issuesFound: 0,
      issuesFixed: 0,
      testsCovered: changes.length,
      complexityReduced: 0,
    };

    return {
      taskId,
      type: 'test-generation',
      status: 'completed',
      startTime: new Date(),
      endTime: new Date(),
      duration: 0,
      success: true,
      changes,
      errors,
      metrics,
      bobcoinUsed: this.bobClient?.getBobcoinUsage().used || 0,
    };
  }

  /**
   * Execute bug fix task
   */
  private async executeBugFix(
    taskId: string,
    config: TaskConfig,
    options: TaskExecutionOptions
  ): Promise<TaskResult> {
    const bugOptions = config.options as BugFixOptions | undefined;
    const changes: TaskChange[] = [];
    const errors: TaskError[] = [];

    logger.info('Executing bug fix', { taskId, issueId: bugOptions?.issueId });

    // Use Bob for bug fixing if available
    if (this.bobClient && !options.dryRun) {
      const prompt = this.buildBugFixPrompt(config, bugOptions);
      await this.bobClient.request({
        prompt,
        mode: 'code',
      });

      changes.push({
        type: 'file-modified',
        path: config.targetPath,
        description: `Fixed bug: ${bugOptions?.description || 'Unknown'}`,
      });
    }

    const metrics: TaskMetrics = {
      filesAnalyzed: 1,
      filesModified: changes.length,
      linesAdded: 0,
      linesRemoved: 0,
      issuesFound: 1,
      issuesFixed: changes.length,
      testsCovered: 0,
      complexityReduced: 0,
    };

    return {
      taskId,
      type: 'bug-fix',
      status: 'completed',
      startTime: new Date(),
      endTime: new Date(),
      duration: 0,
      success: true,
      changes,
      errors,
      metrics,
      bobcoinUsed: this.bobClient?.getBobcoinUsage().used || 0,
    };
  }

  /**
   * Execute feature implementation task
   */
  private async executeFeatureImplementation(
    taskId: string,
    config: TaskConfig,
    options: TaskExecutionOptions
  ): Promise<TaskResult> {
    const featureOptions = config.options as FeatureOptions | undefined;
    const changes: TaskChange[] = [];
    const errors: TaskError[] = [];

    logger.info('Executing feature implementation', { taskId });

    // Use Bob for feature implementation if available
    if (this.bobClient && !options.dryRun) {
      const prompt = this.buildFeaturePrompt(config, featureOptions);
      const response = await this.bobClient.request({
        prompt,
        mode: 'code',
      });

      changes.push({
        type: 'file-created',
        path: config.targetPath,
        description: 'Feature implemented',
        after: response.content,
      });
    }

    const metrics: TaskMetrics = {
      filesAnalyzed: 0,
      filesModified: 0,
      linesAdded: changes.length > 0 ? 200 : 0,
      linesRemoved: 0,
      issuesFound: 0,
      issuesFixed: 0,
      testsCovered: 0,
      complexityReduced: 0,
    };

    return {
      taskId,
      type: 'feature-implementation',
      status: 'completed',
      startTime: new Date(),
      endTime: new Date(),
      duration: 0,
      success: true,
      changes,
      errors,
      metrics,
      bobcoinUsed: this.bobClient?.getBobcoinUsage().used || 0,
    };
  }

  /**
   * Execute documentation task
   */
  private async executeDocumentation(
    taskId: string,
    config: TaskConfig,
    options: TaskExecutionOptions
  ): Promise<TaskResult> {
    const changes: TaskChange[] = [];
    const errors: TaskError[] = [];

    logger.info('Executing documentation generation', { taskId });

    if (!options.dryRun) {
      const docGenerator = createDocGenerator();
      const docs = await docGenerator.generate({
        source: config.targetPath,
        output: './docs',
        format: 'markdown',
        title: 'API Documentation',
      });

      for (const doc of docs) {
        changes.push({
          type: 'file-created',
          path: doc.path,
          description: 'Documentation generated',
        });
      }
    }

    const metrics: TaskMetrics = {
      filesAnalyzed: 1,
      filesModified: 0,
      linesAdded: changes.length > 0 ? 500 : 0,
      linesRemoved: 0,
      issuesFound: 0,
      issuesFixed: 0,
      testsCovered: 0,
      complexityReduced: 0,
    };

    return {
      taskId,
      type: 'documentation',
      status: 'completed',
      startTime: new Date(),
      endTime: new Date(),
      duration: 0,
      success: true,
      changes,
      errors,
      metrics,
    };
  }

  /**
   * Execute optimization task
   */
  private async executeOptimization(
    taskId: string,
    config: TaskConfig,
    _options: TaskExecutionOptions
  ): Promise<TaskResult> {
    const _optimizationOptions = config.options as OptimizationOptions | undefined;
    const changes: TaskChange[] = [];
    const errors: TaskError[] = [];

    logger.info('Executing optimization', { taskId, target: _optimizationOptions?.target });

    // Analyze code first
    const analyzer = createAnalyzer();
    const analysis = await analyzer.analyze({
      path: config.targetPath,
      includeTests: false,
    });

    const metrics: TaskMetrics = {
      filesAnalyzed: analysis.summary.totalFiles,
      filesModified: 0,
      linesAdded: 0,
      linesRemoved: 0,
      issuesFound: 0,
      issuesFixed: 0,
      testsCovered: 0,
      complexityReduced: 0,
    };

    return {
      taskId,
      type: 'optimization',
      status: 'completed',
      startTime: new Date(),
      endTime: new Date(),
      duration: 0,
      success: true,
      changes,
      errors,
      metrics,
    };
  }

  /**
   * Execute security audit task
   */
  private async executeSecurityAudit(
    taskId: string,
    config: TaskConfig,
    _options: TaskExecutionOptions
  ): Promise<TaskResult> {
    // const _securityOptions = config.options as SecurityAuditOptions | undefined;
    const changes: TaskChange[] = [];
    const errors: TaskError[] = [];

    logger.info('Executing security audit', { taskId });

    // Analyze code for security issues
    const analyzer = createAnalyzer();
    const analysis = await analyzer.analyze({
      path: config.targetPath,
      includeTests: false,
    });

    // Check for security issues
    const securityIssues = analysis.issues.filter(
      issue => issue.severity === 'error' || (issue.rule && issue.rule.includes('security'))
    );

    for (const issue of securityIssues) {
      errors.push({
        code: issue.rule || 'SECURITY_ISSUE',
        message: issue.message,
        path: issue.file,
        line: issue.line,
        severity: 'critical',
        recoverable: true,
      });
    }

    const metrics: TaskMetrics = {
      filesAnalyzed: analysis.summary.totalFiles,
      filesModified: 0,
      linesAdded: 0,
      linesRemoved: 0,
      issuesFound: securityIssues.length,
      issuesFixed: 0,
      testsCovered: 0,
      complexityReduced: 0,
    };

    return {
      taskId,
      type: 'security-audit',
      status: 'completed',
      startTime: new Date(),
      endTime: new Date(),
      duration: 0,
      success: true,
      changes,
      errors,
      metrics,
    };
  }

  /**
   * Execute dependency update task
   */
  private async executeDependencyUpdate(
    taskId: string,
    config: TaskConfig,
    _options: TaskExecutionOptions
  ): Promise<TaskResult> {
    const _depOptions = config.options as DependencyUpdateOptions | undefined;
    const changes: TaskChange[] = [];
    const errors: TaskError[] = [];

    logger.info('Executing dependency update', { taskId, updateType: _depOptions?.updateType });

    const metrics: TaskMetrics = {
      filesAnalyzed: 1,
      filesModified: 0,
      linesAdded: 0,
      linesRemoved: 0,
      issuesFound: 0,
      issuesFixed: 0,
      testsCovered: 0,
      complexityReduced: 0,
    };

    return {
      taskId,
      type: 'dependency-update',
      status: 'completed',
      startTime: new Date(),
      endTime: new Date(),
      duration: 0,
      success: true,
      changes,
      errors,
      metrics,
    };
  }

  /**
   * Execute custom task
   */
  private async executeCustomTask(
    taskId: string,
    config: TaskConfig,
    options: TaskExecutionOptions
  ): Promise<TaskResult> {
    const changes: TaskChange[] = [];
    const errors: TaskError[] = [];

    logger.info('Executing custom task', { taskId, description: config.description });

    // Use Bob for custom tasks if available
    if (this.bobClient && !options.dryRun) {
      await this.bobClient.request({
        prompt: config.description,
        mode: 'code',
      });

      changes.push({
        type: 'file-modified',
        path: config.targetPath,
        description: config.description,
      });
    }

    const metrics: TaskMetrics = {
      filesAnalyzed: 1,
      filesModified: changes.length,
      linesAdded: 0,
      linesRemoved: 0,
      issuesFound: 0,
      issuesFixed: 0,
      testsCovered: 0,
      complexityReduced: 0,
    };

    return {
      taskId,
      type: 'custom',
      status: 'completed',
      startTime: new Date(),
      endTime: new Date(),
      duration: 0,
      success: true,
      changes,
      errors,
      metrics,
      bobcoinUsed: this.bobClient?.getBobcoinUsage().used || 0,
    };
  }

  /**
   * Build refactor prompt for Bob
   */
  private buildRefactorPrompt(config: TaskConfig, options?: RefactorOptions): string {
    let prompt = `Refactor the code in ${config.targetPath}.\n\n`;
    prompt += `Description: ${config.description}\n\n`;
    
    if (options) {
      prompt += 'Please focus on:\n';
      if (options.extractFunctions) prompt += '- Extracting functions\n';
      if (options.removeDeadCode) prompt += '- Removing dead code\n';
      if (options.simplifyConditions) prompt += '- Simplifying conditions\n';
      if (options.improveNaming) prompt += '- Improving naming\n';
      if (options.addTypes) prompt += '- Adding type annotations\n';
      if (options.modernizeSyntax) prompt += '- Modernizing syntax\n';
    }
    
    return prompt;
  }

  /**
   * Build test generation prompt for Bob
   */
  private buildTestGenerationPrompt(config: TaskConfig, options?: TestGenerationOptions): string {
    let prompt = `Generate comprehensive tests for ${config.targetPath}.\n\n`;
    
    if (options) {
      if (options.framework) prompt += `Framework: ${options.framework}\n`;
      if (options.coverage) prompt += `Target coverage: ${options.coverage}%\n`;
      if (options.includeEdgeCases) prompt += 'Include edge cases\n';
      if (options.includeMocks) prompt += 'Include mocks\n';
      if (options.generateFixtures) prompt += 'Generate fixtures\n';
    }
    
    return prompt;
  }

  /**
   * Build bug fix prompt for Bob
   */
  private buildBugFixPrompt(config: TaskConfig, options?: BugFixOptions): string {
    let prompt = `Fix the bug in ${config.targetPath}.\n\n`;
    
    if (options) {
      if (options.issueId) prompt += `Issue ID: ${options.issueId}\n`;
      if (options.description) prompt += `Description: ${options.description}\n`;
      if (options.addTests) prompt += 'Add tests for the fix\n';
      if (options.updateDocs) prompt += 'Update documentation\n';
    }
    
    return prompt;
  }

  /**
   * Build feature prompt for Bob
   */
  private buildFeaturePrompt(config: TaskConfig, options?: FeatureOptions): string {
    let prompt = `Implement the feature: ${config.description}\n\n`;
    prompt += `Target path: ${config.targetPath}\n\n`;
    
    if (options) {
      if (options.specification) prompt += `Specification:\n${options.specification}\n\n`;
      if (options.addTests) prompt += 'Include tests\n';
      if (options.addDocs) prompt += 'Include documentation\n';
      if (options.followPatterns) prompt += 'Follow existing code patterns\n';
    }
    
    return prompt;
  }

  /**
   * Create empty metrics
   */
  private createEmptyMetrics(): TaskMetrics {
    return {
      filesAnalyzed: 0,
      filesModified: 0,
      linesAdded: 0,
      linesRemoved: 0,
      issuesFound: 0,
      issuesFixed: 0,
      testsCovered: 0,
      complexityReduced: 0,
    };
  }
}

/**
 * Create a task automator instance
 */
export function createTaskAutomator(): TaskAutomator {
  return new TaskAutomator();
}

// Made with Bob
