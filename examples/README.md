# LazyBob Examples

This directory contains practical examples demonstrating LazyBob's capabilities.

## Directory Structure

- **automation/** - Task automation examples
- **documentation/** - Documentation generation examples
- **onboarding/** - New developer onboarding workflows

## Quick Start Examples

### 1. Code Analysis

Analyze your codebase to get insights and metrics:

```bash
# Analyze entire project
lazybob analyze ./src

# Analyze specific directory
lazybob analyze ./src/core --include-tests

# Get JSON output
lazybob analyze ./src --format json > analysis.json
```

### 2. Documentation Generation

Generate comprehensive API documentation:

```bash
# Generate markdown documentation
lazybob docs ./src -o ./docs

# Generate HTML documentation
lazybob docs ./src -o ./api-docs -f html -t "My API"

# Include diagrams and private members
lazybob docs ./src --diagrams --private
```

### 3. Code Review

Automated code review with issue detection:

```bash
# Quick code review
lazybob review ./src

# Dry run to preview issues
lazybob review ./src --dry-run

# Auto-fix issues
lazybob review ./src --auto-fix
```

### 4. Refactoring

Improve code quality and maintainability:

```bash
# Refactor a file
lazybob refactor ./src/utils.ts

# Refactor with description
lazybob refactor ./src/app.ts --description "Extract helper functions"

# Preview changes
lazybob refactor ./src/legacy.ts --dry-run
```

### 5. Test Generation

Generate comprehensive test suites:

```bash
# Generate tests with Vitest
lazybob test ./src/app.ts

# Generate tests with Jest
lazybob test ./src/utils.ts --framework jest

# Preview test generation
lazybob test ./src/service.ts --dry-run
```

### 6. Task Automation

Automate various development tasks:

```bash
# Code review automation
lazybob automate code-review ./src --priority high

# Bug fix automation
lazybob automate bug-fix ./src/bug.ts --description "Fix memory leak"

# Feature implementation
lazybob automate feature-implementation ./src/new-feature.ts \
  --description "Add user authentication"

# Security audit
lazybob automate security-audit ./src --priority critical

# Optimization
lazybob automate optimization ./src/performance.ts \
  --description "Improve algorithm efficiency"
```

## Advanced Examples

See the subdirectories for more detailed examples:

- [Automation Examples](./automation/README.md)
- [Documentation Examples](./documentation/README.md)
- [Onboarding Workflows](./onboarding/README.md)

## Integration with Bob IDE

LazyBob is designed to work seamlessly with IBM Bob IDE:

1. **Context-Aware**: Use `@file` and `@folder` mentions in Bob
2. **Mode Switching**: Leverage Bob's different modes (Code, Plan, Ask, Advanced)
3. **Session Tracking**: All Bob sessions are automatically tracked
4. **Bobcoin Management**: Monitor and optimize Bobcoin usage

## Best Practices

1. **Start with Analysis**: Always analyze code before making changes
2. **Use Dry Run**: Preview changes before applying them
3. **Incremental Changes**: Make small, focused changes
4. **Review Results**: Always review automated changes
5. **Track Sessions**: Export Bob sessions regularly

## Tips

- Use `--dry-run` to preview changes without applying them
- Combine commands in scripts for complex workflows
- Set appropriate priority levels for task automation
- Monitor Bobcoin usage to stay within budget
- Export Bob sessions to `bob_sessions/` directory

## Getting Help

```bash
# Show all commands
lazybob --help

# Show command-specific help
lazybob analyze --help
lazybob docs --help
lazybob automate --help
```

## Contributing

Found a useful workflow? Add it to the examples directory!