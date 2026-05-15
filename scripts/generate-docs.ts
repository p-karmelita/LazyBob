#!/usr/bin/env node

/**
 * Documentation Generator CLI Script
 */

import { runDocGenerator } from '../src/core/doc-generator/cli.js';

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: npm run generate-docs -- <source> [options]

Arguments:
  <source>              Source directory to analyze

Options:
  --output <dir>        Output directory (default: ./docs)
  --format <format>     Output format: markdown, json, html (default: markdown)
  --title <title>       Documentation title
  --description <desc>  Documentation description
  --examples            Include code examples (default: true)
  --diagrams            Include diagrams (default: false)
  --private             Include private members (default: false)
  --help, -h            Show this help message

Examples:
  npm run generate-docs -- ./src
  npm run generate-docs -- ./src --output ./api-docs --format html
  npm run generate-docs -- ./src --title "My API" --examples --diagrams
  `);
  process.exit(0);
}

// Parse arguments
const source = args[0];
let output = './docs';
let format: 'markdown' | 'json' | 'html' = 'markdown';
let title: string | undefined;
let description: string | undefined;
let includeExamples = true;
let includeDiagrams = false;
let includePrivate = false;

for (let i = 1; i < args.length; i++) {
  const arg = args[i];
  
  switch (arg) {
    case '--output':
      output = args[++i];
      break;
    case '--format':
      const formatArg = args[++i];
      if (formatArg === 'markdown' || formatArg === 'json' || formatArg === 'html') {
        format = formatArg;
      } else {
        console.error(`Invalid format: ${formatArg}. Must be markdown, json, or html.`);
        process.exit(1);
      }
      break;
    case '--title':
      title = args[++i];
      break;
    case '--description':
      description = args[++i];
      break;
    case '--examples':
      includeExamples = true;
      break;
    case '--no-examples':
      includeExamples = false;
      break;
    case '--diagrams':
      includeDiagrams = true;
      break;
    case '--private':
      includePrivate = true;
      break;
    default:
      console.error(`Unknown option: ${arg}`);
      process.exit(1);
  }
}

// Run documentation generator
runDocGenerator({
  source,
  output,
  format,
  title,
  description,
  includeExamples,
  includeDiagrams,
  includePrivate,
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

// Made with Bob
