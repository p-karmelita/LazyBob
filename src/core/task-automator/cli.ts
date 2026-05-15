/**
 * Task Automator CLI
 */

import chalk from 'chalk';
import { createTaskAutomator } from './automator.js';
import { logger } from '../../utils/logger.js';
import type {
  TaskConfig,
  TaskExecutionOptions,
  TaskType,
  TaskPriority,
  AutomationStrategy,
} from './types.js';

/**
 * Run task automation from CLI
 */
export async function runTaskAutomator(options: {
  type: TaskType;
  path: string;
  description?: string;
  priority?: TaskPriority;
  strategy?: AutomationStrategy;
  dryRun?: boolean;
  interactive?: boolean;
}): Promise<void> {
  console.log(chalk.bold.blue('\n⚡ LazyBob Task Automator\n'));

  const startTime = Date.now();

  try {
    const automator = createTaskAutomator();

    const taskConfig: TaskConfig = {
      type: options.type,
      priority: options.priority || 'medium',
      strategy: options.strategy || 'bob-assisted',
      description: options.description || `Automated ${options.type} task`,
      targetPath: options.path,
    };

    const executionOptions: TaskExecutionOptions = {
      dryRun: options.dryRun ?? false,
      interactive: options.interactive ?? false,
      maxRetries: 3,
      timeout: 300000,
      bobcoinLimit: 10,
    };

    console.log(chalk.cyan('Task Configuration:'));
    console.log(`  Type:         ${chalk.white(taskConfig.type)}`);
    console.log(`  Priority:     ${getPriorityColor(taskConfig.priority)(taskConfig.priority)}`);
    console.log(`  Strategy:     ${chalk.white(taskConfig.strategy)}`);
    console.log(`  Target:       ${chalk.white(taskConfig.targetPath)}`);
    console.log(`  Description:  ${chalk.white(taskConfig.description)}`);
    console.log('');

    console.log(chalk.cyan('Execution Options:'));
    console.log(`  Dry Run:      ${executionOptions.dryRun ? chalk.yellow('Yes') : chalk.green('No')}`);
    console.log(`  Interactive:  ${executionOptions.interactive ? chalk.green('Yes') : chalk.gray('No')}`);
    console.log(`  Max Retries:  ${chalk.white(executionOptions.maxRetries)}`);
    console.log(`  Timeout:      ${chalk.white((executionOptions.timeout! / 1000).toFixed(0) + 's')}`);
    console.log('');

    if (executionOptions.dryRun) {
      console.log(chalk.yellow('⚠️  DRY RUN MODE - No changes will be made\n'));
    }

    console.log(chalk.cyan('Executing task...'));
    const result = await automator.executeTask(taskConfig, executionOptions);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('');
    if (result.success) {
      console.log(chalk.bold.green('✓ Task completed successfully!\n'));
    } else {
      console.log(chalk.bold.red('✗ Task failed\n'));
    }

    // Display results
    console.log(chalk.cyan('Results:'));
    console.log(`  Status:       ${getStatusColor(result.status)(result.status)}`);
    console.log(`  Duration:     ${chalk.white(duration + 's')}`);
    console.log(`  Changes:      ${chalk.white(result.changes.length)}`);
    console.log(`  Errors:       ${result.errors.length > 0 ? chalk.red(result.errors.length) : chalk.green('0')}`);
    if (result.bobcoinUsed !== undefined) {
      console.log(`  Bobcoin Used: ${chalk.yellow(result.bobcoinUsed)}`);
    }
    console.log('');

    // Display metrics
    console.log(chalk.cyan('Metrics:'));
    console.log(`  Files Analyzed:  ${chalk.white(result.metrics.filesAnalyzed)}`);
    console.log(`  Files Modified:  ${chalk.white(result.metrics.filesModified)}`);
    console.log(`  Lines Added:     ${chalk.green('+' + result.metrics.linesAdded)}`);
    console.log(`  Lines Removed:   ${chalk.red('-' + result.metrics.linesRemoved)}`);
    console.log(`  Issues Found:    ${chalk.white(result.metrics.issuesFound)}`);
    console.log(`  Issues Fixed:    ${chalk.green(result.metrics.issuesFixed)}`);
    console.log('');

    // Display changes
    if (result.changes.length > 0) {
      console.log(chalk.cyan('Changes:'));
      for (const change of result.changes.slice(0, 10)) {
        const icon = getChangeIcon(change.type);
        console.log(`  ${icon} ${chalk.white(change.path)}`);
        console.log(`    ${chalk.gray(change.description)}`);
      }
      if (result.changes.length > 10) {
        console.log(`  ${chalk.gray(`... and ${result.changes.length - 10} more changes`)}`);
      }
      console.log('');
    }

    // Display errors
    if (result.errors.length > 0) {
      console.log(chalk.cyan('Errors:'));
      for (const error of result.errors.slice(0, 5)) {
        const severityColor = error.severity === 'critical' ? chalk.red : 
                             error.severity === 'error' ? chalk.red :
                             chalk.yellow;
        console.log(`  ${severityColor('•')} ${error.message}`);
        if (error.path) {
          console.log(`    ${chalk.gray(`${error.path}:${error.line || '?'}`)}`);
        }
      }
      if (result.errors.length > 5) {
        console.log(`  ${chalk.gray(`... and ${result.errors.length - 5} more errors`)}`);
      }
      console.log('');
    }

    if (!result.success) {
      process.exit(1);
    }

  } catch (error) {
    console.log('');
    console.log(chalk.bold.red('✗ Task automation failed\n'));
    
    if (error instanceof Error) {
      console.log(chalk.red('Error:'), error.message);
      if (error.stack) {
        logger.error('Stack trace', { stack: error.stack });
      }
    } else {
      console.log(chalk.red('Error:'), String(error));
    }
    
    process.exit(1);
  }
}

/**
 * Get color for priority
 */
function getPriorityColor(priority: TaskPriority): typeof chalk.red {
  switch (priority) {
    case 'critical':
      return chalk.red;
    case 'high':
      return chalk.hex('#FFA500'); // orange
    case 'medium':
      return chalk.yellow;
    case 'low':
      return chalk.gray;
  }
}

/**
 * Get color for status
 */
function getStatusColor(status: string): typeof chalk.green {
  switch (status) {
    case 'completed':
      return chalk.green;
    case 'in-progress':
      return chalk.yellow;
    case 'failed':
      return chalk.red;
    case 'cancelled':
      return chalk.gray;
    default:
      return chalk.white;
  }
}

/**
 * Get icon for change type
 */
function getChangeIcon(type: string): string {
  switch (type) {
    case 'file-created':
      return chalk.green('+');
    case 'file-modified':
      return chalk.yellow('~');
    case 'file-deleted':
      return chalk.red('-');
    case 'line-added':
      return chalk.green('+');
    case 'line-removed':
      return chalk.red('-');
    default:
      return chalk.white('•');
  }
}

// Made with Bob
