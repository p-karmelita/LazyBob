#!/usr/bin/env node

/**
 * LazyBob Unified CLI
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { runCodeAnalyzer } from '../core/code-analyzer/cli.js';
import { runDocGenerator } from '../core/doc-generator/cli.js';
import { runTaskAutomator } from '../core/task-automator/cli.js';
import type { TaskType, TaskPriority, AutomationStrategy } from '../core/task-automator/types.js';

const program = new Command();

// Package info
program
  .name('lazybob')
  .description('LazyBob - AI-Powered Development Accelerator')
  .version('1.0.0');

// Analyze command
program
  .command('analyze')
  .description('Analyze codebase for insights and metrics')
  .argument('<path>', 'Path to analyze')
  .option('--include-tests', 'Include test files in analysis')
  .option('--format <format>', 'Output format (json, text)', 'text')
  .action(async (path: string, options) => {
    try {
      await runCodeAnalyzer({
        path,
        includeTests: options.includeTests || false,
        format: options.format,
      });
    } catch (error) {
      console.error(chalk.red('Analysis failed:'), error);
      process.exit(1);
    }
  });

// Generate docs command
program
  .command('docs')
  .description('Generate documentation from code')
  .argument('<source>', 'Source directory')
  .option('-o, --output <dir>', 'Output directory', './docs')
  .option('-f, --format <format>', 'Output format (markdown, json, html)', 'markdown')
  .option('-t, --title <title>', 'Documentation title')
  .option('-d, --description <desc>', 'Documentation description')
  .option('--no-examples', 'Exclude code examples')
  .option('--diagrams', 'Include diagrams')
  .option('--private', 'Include private members')
  .action(async (source: string, options) => {
    try {
      await runDocGenerator({
        source,
        output: options.output,
        format: options.format,
        title: options.title,
        description: options.description,
        includeExamples: options.examples !== false,
        includeDiagrams: options.diagrams || false,
        includePrivate: options.private || false,
      });
    } catch (error) {
      console.error(chalk.red('Documentation generation failed:'), error);
      process.exit(1);
    }
  });

// Automate command
program
  .command('automate')
  .description('Automate development tasks')
  .argument('<type>', 'Task type (code-review, refactor, test-generation, etc.)')
  .argument('<path>', 'Target path')
  .option('--description <desc>', 'Task description')
  .option('--priority <level>', 'Priority level (low, medium, high, critical)', 'medium')
  .option('--strategy <strategy>', 'Automation strategy (bob-assisted, rule-based, ai-powered, hybrid)', 'bob-assisted')
  .option('--dry-run', 'Preview changes without applying')
  .option('--interactive', 'Enable interactive mode')
  .action(async (type: string, path: string, options) => {
    try {
      await runTaskAutomator({
        type: type as TaskType,
        path,
        description: options.description,
        priority: options.priority as TaskPriority,
        strategy: options.strategy as AutomationStrategy,
        dryRun: options.dryRun || false,
        interactive: options.interactive || false,
      });
    } catch (error) {
      console.error(chalk.red('Task automation failed:'), error);
      process.exit(1);
    }
  });

// Review command (shorthand for code-review automation)
program
  .command('review')
  .description('Quick code review')
  .argument('<path>', 'Path to review')
  .option('--auto-fix', 'Automatically fix issues')
  .option('--dry-run', 'Preview changes without applying')
  .action(async (path: string, options) => {
    try {
      await runTaskAutomator({
        type: 'code-review',
        path,
        description: 'Code review',
        priority: 'medium',
        strategy: 'bob-assisted',
        dryRun: options.dryRun || false,
        interactive: false,
      });
    } catch (error) {
      console.error(chalk.red('Code review failed:'), error);
      process.exit(1);
    }
  });

// Refactor command (shorthand for refactor automation)
program
  .command('refactor')
  .description('Refactor code')
  .argument('<path>', 'Path to refactor')
  .option('--description <desc>', 'Refactoring description')
  .option('--dry-run', 'Preview changes without applying')
  .action(async (path: string, options) => {
    try {
      await runTaskAutomator({
        type: 'refactor',
        path,
        description: options.description || 'Refactor code',
        priority: 'medium',
        strategy: 'bob-assisted',
        dryRun: options.dryRun || false,
        interactive: false,
      });
    } catch (error) {
      console.error(chalk.red('Refactoring failed:'), error);
      process.exit(1);
    }
  });

// Test command (shorthand for test generation)
program
  .command('test')
  .description('Generate tests')
  .argument('<path>', 'Path to generate tests for')
  .option('--framework <framework>', 'Test framework (vitest, jest, mocha)', 'vitest')
  .option('--coverage <percent>', 'Target coverage percentage', '80')
  .option('--dry-run', 'Preview changes without applying')
  .action(async (path: string, options) => {
    try {
      await runTaskAutomator({
        type: 'test-generation',
        path,
        description: `Generate tests with ${options.framework}`,
        priority: 'medium',
        strategy: 'bob-assisted',
        dryRun: options.dryRun || false,
        interactive: false,
      });
    } catch (error) {
      console.error(chalk.red('Test generation failed:'), error);
      process.exit(1);
    }
  });

// Info command
program
  .command('info')
  .description('Display LazyBob information')
  .action(() => {
    console.log(chalk.bold.blue('\n🤖 LazyBob v1.0.0\n'));
    console.log(chalk.cyan('AI-Powered Development Accelerator'));
    console.log(chalk.gray('Built for IBM Bob Hackathon\n'));
    
    console.log(chalk.bold('Available Commands:'));
    console.log('  analyze      Analyze codebase');
    console.log('  docs         Generate documentation');
    console.log('  automate     Automate tasks');
    console.log('  review       Quick code review');
    console.log('  refactor     Refactor code');
    console.log('  test         Generate tests');
    console.log('  info         Show this information\n');
    
    console.log(chalk.bold('Examples:'));
    console.log('  lazybob analyze ./src');
    console.log('  lazybob docs ./src -o ./api-docs');
    console.log('  lazybob review ./src --dry-run');
    console.log('  lazybob refactor ./src/utils.ts');
    console.log('  lazybob test ./src/app.ts\n');
  });

// Parse arguments
program.parse();

// Made with Bob
