# Task Automation Examples

This directory contains examples of automating common development tasks with LazyBob.

## Table of Contents

1. [Code Review Automation](#code-review-automation)
2. [Refactoring Workflows](#refactoring-workflows)
3. [Test Generation](#test-generation)
4. [Bug Fixing](#bug-fixing)
5. [Feature Implementation](#feature-implementation)
6. [Security Audits](#security-audits)
7. [Performance Optimization](#performance-optimization)

## Code Review Automation

### Basic Code Review

```bash
# Review entire codebase
lazybob automate code-review ./src

# Review with dry run
lazybob automate code-review ./src --dry-run

# High priority review
lazybob automate code-review ./src --priority high
```

### Advanced Code Review

```bash
# Review with specific strategy
lazybob automate code-review ./src \
  --strategy hybrid \
  --description "Focus on security and performance"

# Interactive review
lazybob automate code-review ./src \
  --interactive \
  --priority critical
```

## Refactoring Workflows

### Simple Refactoring

```bash
# Refactor a single file
lazybob automate refactor ./src/utils/helpers.ts \
  --description "Extract utility functions"

# Refactor with preview
lazybob automate refactor ./src/legacy-code.ts \
  --dry-run \
  --description "Modernize syntax and improve naming"
```

### Complex Refactoring

```bash
# Refactor entire module
lazybob automate refactor ./src/core/old-module \
  --priority high \
  --strategy bob-assisted \
  --description "Refactor to use modern patterns and TypeScript features"

# Refactor with specific goals
lazybob automate refactor ./src/services/api.ts \
  --description "Extract functions, improve naming, add types, remove dead code"
```

## Test Generation

### Unit Test Generation

```bash
# Generate tests for a file
lazybob automate test-generation ./src/utils/calculator.ts

# Generate tests with specific framework
lazybob automate test-generation ./src/services/user.ts \
  --description "Generate tests with Vitest, include edge cases and mocks"

# Preview test generation
lazybob automate test-generation ./src/core/engine.ts --dry-run
```

### Integration Test Generation

```bash
# Generate integration tests
lazybob automate test-generation ./src/api/routes.ts \
  --description "Generate integration tests with fixtures and mocks" \
  --priority high
```

## Bug Fixing

### Simple Bug Fix

```bash
# Fix a known bug
lazybob automate bug-fix ./src/components/form.ts \
  --description "Fix validation error on empty input"

# Fix with tests
lazybob automate bug-fix ./src/utils/parser.ts \
  --description "Fix parsing error, add regression tests"
```

### Complex Bug Fix

```bash
# Fix memory leak
lazybob automate bug-fix ./src/services/cache.ts \
  --priority critical \
  --description "Fix memory leak in cache cleanup, add monitoring"

# Fix with documentation update
lazybob automate bug-fix ./src/core/processor.ts \
  --description "Fix race condition, update docs, add tests"
```

## Feature Implementation

### New Feature

```bash
# Implement simple feature
lazybob automate feature-implementation ./src/features/export.ts \
  --description "Add CSV export functionality"

# Implement with tests and docs
lazybob automate feature-implementation ./src/features/auth.ts \
  --priority high \
  --description "Implement OAuth authentication with tests and documentation"
```

### Feature with Dependencies

```bash
# Complex feature implementation
lazybob automate feature-implementation ./src/features/analytics.ts \
  --strategy hybrid \
  --description "Implement analytics tracking with privacy controls, tests, and docs"
```

## Security Audits

### Basic Security Audit

```bash
# Audit codebase
lazybob automate security-audit ./src

# Audit with report
lazybob automate security-audit ./src \
  --priority critical \
  --description "Check for credentials, injections, and crypto issues"
```

### Comprehensive Security Audit

```bash
# Full security audit
lazybob automate security-audit ./src \
  --strategy ai-powered \
  --priority critical \
  --description "Comprehensive security audit: dependencies, credentials, injections, crypto"
```

## Performance Optimization

### Basic Optimization

```bash
# Optimize file
lazybob automate optimization ./src/utils/processor.ts \
  --description "Optimize algorithm for better performance"

# Optimize with measurements
lazybob automate optimization ./src/services/data.ts \
  --description "Optimize data processing, measure before and after"
```

### Advanced Optimization

```bash
# Aggressive optimization
lazybob automate optimization ./src/core/engine.ts \
  --priority high \
  --strategy hybrid \
  --description "Aggressive optimization: performance, memory, bundle size"
```

## Batch Automation

### Script Example

Create a script to automate multiple tasks:

```bash
#!/bin/bash
# automation-workflow.sh

echo "Starting LazyBob automation workflow..."

# 1. Code review
echo "Step 1: Code review"
lazybob automate code-review ./src --dry-run

# 2. Generate tests
echo "Step 2: Generate tests"
lazybob automate test-generation ./src/utils --dry-run

# 3. Security audit
echo "Step 3: Security audit"
lazybob automate security-audit ./src --priority high

# 4. Generate documentation
echo "Step 4: Generate documentation"
lazybob docs ./src -o ./docs

echo "Workflow complete!"
```

## Best Practices

1. **Always use --dry-run first** to preview changes
2. **Set appropriate priority levels** based on task urgency
3. **Provide clear descriptions** for better AI assistance
4. **Review automated changes** before committing
5. **Track Bobcoin usage** to stay within budget
6. **Export Bob sessions** for audit trail

## Tips

- Use `--interactive` mode for complex tasks requiring decisions
- Combine automation with manual review for best results
- Start with small, focused tasks before automating larger workflows
- Monitor task execution time and adjust timeouts if needed
- Use different strategies (bob-assisted, rule-based, ai-powered, hybrid) based on task complexity

## Troubleshooting

### Task Fails

```bash
# Increase timeout
lazybob automate refactor ./large-file.ts \
  --description "Refactor" \
  --timeout 600000  # 10 minutes
```

### Bobcoin Limit Exceeded

```bash
# Set Bobcoin limit
lazybob automate code-review ./src \
  --bobcoin-limit 5
```

### Need More Control

```bash
# Use interactive mode
lazybob automate feature-implementation ./src/new-feature.ts \
  --interactive \
  --description "Implement feature with step-by-step guidance"