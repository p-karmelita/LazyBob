#!/usr/bin/env node

/**
 * Task Automator CLI Runner
 */

import { runTaskAutomator } from './cli.js';
import type { TaskType, TaskPriority, AutomationStrategy } from './types.js';

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: npm run automate -- <type> <path> [options]

Arguments:
  <type>                Task type (code-review, refactor, test-generation, bug-fix, 
                        feature-implementation, documentation, optimization, 
                        security-audit, dependency-update, custom)
  <path>                Target file or directory path

Options:
  --description <desc>  Task description
  --priority <level>    Priority: low, medium, high, critical (default: medium)
  --strategy <strat>    Strategy: bob-assisted, rule-based, ai-powered, hybrid 
                        (default: bob-assisted)
  --dry-run             Preview changes without applying them
  --interactive         Enable interactive mode
  --help, -h            Show this help message

Examples:
  npm run automate -- code-review ./src
  npm run automate -- refactor ./src/utils.ts --description "Extract functions"
  npm run automate -- test-generation ./src/app.ts --dry-run
  npm run automate -- bug-fix ./src/bug.ts --priority high --description "Fix memory leak"
  npm run automate -- documentation ./src --strategy bob-assisted
  `);
  process.exit(0);
}

// Parse arguments
const type = args[0] as TaskType;
const path = args[1];

if (!path) {
  console.error('Error: Target path is required');
  process.exit(1);
}

// Validate task type
const validTypes: TaskType[] = [
  'code-review',
  'refactor',
  'test-generation',
  'bug-fix',
  'feature-implementation',
  'documentation',
  'optimization',
  'security-audit',
  'dependency-update',
  'custom',
];

if (!validTypes.includes(type)) {
  console.error(`Error: Invalid task type '${type}'`);
  console.error(`Valid types: ${validTypes.join(', ')}`);
  process.exit(1);
}

let description: string | undefined;
let priority: TaskPriority = 'medium';
let strategy: AutomationStrategy = 'bob-assisted';
let dryRun = false;
let interactive = false;

for (let i = 2; i < args.length; i++) {
  const arg = args[i];
  
  switch (arg) {
    case '--description':
      description = args[++i];
      break;
    case '--priority':
      const priorityArg = args[++i] as TaskPriority;
      if (['low', 'medium', 'high', 'critical'].includes(priorityArg)) {
        priority = priorityArg;
      } else {
        console.error(`Invalid priority: ${priorityArg}`);
        process.exit(1);
      }
      break;
    case '--strategy':
      const strategyArg = args[++i] as AutomationStrategy;
      if (['bob-assisted', 'rule-based', 'ai-powered', 'hybrid'].includes(strategyArg)) {
        strategy = strategyArg;
      } else {
        console.error(`Invalid strategy: ${strategyArg}`);
        process.exit(1);
      }
      break;
    case '--dry-run':
      dryRun = true;
      break;
    case '--interactive':
      interactive = true;
      break;
    default:
      if (arg.startsWith('--')) {
        console.error(`Unknown option: ${arg}`);
        process.exit(1);
      }
  }
}

// Run task automator
runTaskAutomator({
  type,
  path,
  description,
  priority,
  strategy,
  dryRun,
  interactive,
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

// Made with Bob
