/**
 * Documentation Generator CLI
 */

import chalk from 'chalk';
import { createDocGenerator } from './generator.js';
import { logger } from '../../utils/logger.js';
import type { DocGenerationOptions } from './types.js';

/**
 * Run documentation generation from CLI
 */
export async function runDocGenerator(options: {
  source: string;
  output: string;
  format?: 'markdown' | 'json' | 'html';
  title?: string;
  description?: string;
  includeExamples?: boolean;
  includeDiagrams?: boolean;
  includePrivate?: boolean;
}): Promise<void> {
  console.log(chalk.bold.blue('\n📚 LazyBob Documentation Generator\n'));

  const startTime = Date.now();

  try {
    const generator = createDocGenerator();

    const docOptions: DocGenerationOptions = {
      source: options.source,
      output: options.output,
      format: options.format || 'markdown',
      title: options.title,
      description: options.description,
      includeExamples: options.includeExamples ?? true,
      includeDiagrams: options.includeDiagrams ?? false,
      includePrivate: options.includePrivate ?? false,
    };

    console.log(chalk.cyan('Configuration:'));
    console.log(`  Source:          ${chalk.white(docOptions.source)}`);
    console.log(`  Output:          ${chalk.white(docOptions.output)}`);
    console.log(`  Format:          ${chalk.white(docOptions.format)}`);
    if (docOptions.title) {
      console.log(`  Title:           ${chalk.white(docOptions.title)}`);
    }
    console.log(`  Include Examples: ${docOptions.includeExamples ? chalk.green('Yes') : chalk.gray('No')}`);
    console.log(`  Include Diagrams: ${docOptions.includeDiagrams ? chalk.green('Yes') : chalk.gray('No')}`);
    console.log(`  Include Private:  ${docOptions.includePrivate ? chalk.green('Yes') : chalk.gray('No')}`);
    console.log('');

    console.log(chalk.cyan('Generating documentation...'));
    const docs = await generator.generate(docOptions);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('');
    console.log(chalk.bold.green('✓ Documentation generated successfully!\n'));

    console.log(chalk.cyan('Generated Files:'));
    for (const doc of docs) {
      console.log(`  ${chalk.white('•')} ${chalk.white(doc.path)}`);
      console.log(`    Format:       ${chalk.gray(doc.format)}`);
      console.log(`    Generated:    ${chalk.gray(doc.generatedAt.toLocaleString())}`);
      console.log(`    Size:         ${chalk.gray(formatBytes(doc.content.length))}`);
      console.log('');
    }

    console.log(chalk.cyan('Summary:'));
    console.log(`  Files:        ${chalk.white(docs.length)}`);
    console.log(`  Duration:     ${chalk.white(duration + 's')}`);
    console.log('');

  } catch (error) {
    console.log('');
    console.log(chalk.bold.red('✗ Documentation generation failed\n'));
    
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
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Made with Bob
