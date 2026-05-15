#!/usr/bin/env node
/**
 * Code Analyzer CLI
 */

import { createAnalyzer } from './analyzer.js';
import { logger } from '../../utils/logger.js';
import chalk from 'chalk';

/**
 * Run code analyzer from CLI
 */
export async function runCodeAnalyzer(options: {
  path: string;
  includeTests?: boolean;
  format?: string;
}): Promise<void> {
  const path = options.path;

  console.log(chalk.bold.blue('\n🔍 LazyBob Code Analyzer\n'));

  try {
    const analyzer = createAnalyzer();
    
    logger.info(`Analyzing codebase at: ${path}`);
    
    const result = await analyzer.analyze({
      path,
      includeTests: options.includeTests ?? true,
      generateDiagram: false,
    });

    // Display summary
    console.log(chalk.bold('\n📊 Analysis Summary\n'));
    console.log(`${chalk.cyan('Total Files:')} ${result.summary.totalFiles}`);
    console.log(`${chalk.cyan('Total Lines:')} ${result.summary.totalLines.toLocaleString()}`);
    console.log(`${chalk.cyan('Total Functions:')} ${result.summary.totalFunctions}`);
    console.log(`${chalk.cyan('Total Classes:')} ${result.summary.totalClasses}`);
    console.log(`${chalk.cyan('Duration:')} ${result.summary.duration}ms`);

    // Display language breakdown
    console.log(chalk.bold('\n📚 Languages\n'));
    const langStats = analyzer.getLanguageStats(result);
    for (const stat of langStats) {
      console.log(
        `${chalk.yellow(stat.language.padEnd(15))} ` +
        `${stat.files.toString().padStart(4)} files  ` +
        `${stat.lines.toLocaleString().padStart(8)} lines  ` +
        `${chalk.gray(stat.percentage.toFixed(1) + '%')}`
      );
    }

    // Display metrics
    console.log(chalk.bold('\n📈 Code Metrics\n'));
    console.log(`${chalk.cyan('Complexity (avg):')} ${result.metrics.complexity.average.toFixed(2)}`);
    console.log(`${chalk.cyan('Complexity (max):')} ${result.metrics.complexity.max}`);
    console.log(`${chalk.cyan('Maintainability:')} ${result.metrics.maintainability.score} (${result.metrics.maintainability.index.toFixed(1)})`);
    console.log(`${chalk.cyan('Documentation:')} ${result.metrics.quality.documentationCoverage.toFixed(1)}%`);

    // Display complexity distribution
    console.log(chalk.bold('\n🎯 Complexity Distribution\n'));
    const dist = result.metrics.complexity.distribution;
    console.log(`${chalk.green('Low (1-5):')} ${dist.low} files`);
    console.log(`${chalk.yellow('Medium (6-10):')} ${dist.medium} files`);
    console.log(`${chalk.hex('#FFA500')('High (11-20):')} ${dist.high} files`);
    console.log(`${chalk.red('Very High (>20):')} ${dist.veryHigh} files`);

    // Display issues
    if (result.issues.length > 0) {
      console.log(chalk.bold('\n⚠️  Issues\n'));
      for (const issue of result.issues.slice(0, 10)) {
        const icon = issue.severity === 'error' ? '❌' : issue.severity === 'warning' ? '⚠️' : 'ℹ️';
        console.log(`${icon} ${chalk.gray(issue.file)}:${issue.line} - ${issue.message}`);
      }
      if (result.issues.length > 10) {
        console.log(chalk.gray(`\n... and ${result.issues.length - 10} more issues`));
      }
    }

    console.log(chalk.bold.green('\n✅ Analysis complete!\n'));
    
  } catch (error) {
    console.error(chalk.bold.red('\n❌ Analysis failed\n'));
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

/**
 * Main CLI function
 */
async function main() {
  const args = process.argv.slice(2);
  const path = args[0] || '.';
  
  await runCodeAnalyzer({
    path,
    includeTests: true,
    format: 'text',
  });
}

// Run CLI if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

// Made with Bob
