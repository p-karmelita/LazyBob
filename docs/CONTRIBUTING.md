# Contributing to LazyBob

Thank you for your interest in contributing to LazyBob! This guide will help you get started with the development process.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Standards](#code-standards)
4. [Testing Guidelines](#testing-guidelines)
5. [Documentation](#documentation)
6. [Pull Request Process](#pull-request-process)
7. [Using IBM Bob](#using-ibm-bob)

## Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- IBM Bob IDE installed and configured
- Git for version control

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd lazybob

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure your environment
# Edit .env with your credentials

# Verify setup
npm run type-check
npm test
```

## Development Workflow

### 1. Create a Feature Branch
```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name
```

### 2. Make Changes
- Write code following our [Code Standards](#code-standards)
- Add tests for new functionality
- Update documentation as needed
- Use Bob IDE for assistance

### 3. Test Your Changes
```bash
# Run type checking
npm run type-check

# Run linter
npm run lint

# Run tests
npm test

# Check formatting
npm run format:check
```

### 4. Commit Changes
```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add code analysis feature"

# Use conventional commit format:
# feat: new feature
# fix: bug fix
# docs: documentation changes
# test: test additions/changes
# refactor: code refactoring
# chore: maintenance tasks
```

### 5. Export Bob Session
```bash
# After completing work with Bob:
# 1. Open Bob IDE History
# 2. Select your task
# 3. Export session report
# 4. Save to bob_sessions/
```

### 6. Push and Create PR
```bash
# Push to remote
git push origin feature/your-feature-name

# Create Pull Request on GitHub
# Include:
# - Clear description of changes
# - Link to related issues
# - Screenshots if applicable
# - Bob session reports
```

## Code Standards

### TypeScript Guidelines

#### Type Safety
```typescript
// ✅ Good: Explicit types
function analyzeCode(path: string): Promise<AnalysisResult> {
  // implementation
}

// ❌ Bad: Implicit any
function analyzeCode(path) {
  // implementation
}
```

#### Error Handling
```typescript
// ✅ Good: Custom error classes
import { AnalysisError } from '../utils/errors';

try {
  await operation();
} catch (error) {
  throw new AnalysisError('Operation failed', { 
    path, 
    originalError: error 
  });
}

// ❌ Bad: Generic errors
try {
  await operation();
} catch (error) {
  throw new Error('Something went wrong');
}
```

#### Imports Organization
```typescript
// ✅ Good: Organized imports
// External dependencies
import { z } from 'zod';
import chalk from 'chalk';

// Internal modules
import { BobClient } from '../bob-integration';
import { analyzeCode } from './analyzer';

// Types
import type { AnalysisResult, Config } from '../types';

// ❌ Bad: Mixed imports
import { analyzeCode } from './analyzer';
import { z } from 'zod';
import type { Config } from '../types';
import chalk from 'chalk';
```

### Naming Conventions

```typescript
// Files: kebab-case
// code-analyzer.ts
// doc-generator.ts

// Classes: PascalCase
class CodeAnalyzer {}
class BobClient {}

// Functions/Variables: camelCase
function analyzeCode() {}
const analysisResult = {};

// Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 10;
const DEFAULT_TIMEOUT = 30000;

// Interfaces/Types: PascalCase
interface AnalysisOptions {}
type Result<T> = {};
```

### Code Style

#### Function Length
- Keep functions under 50 lines
- Extract complex logic into helper functions
- Use descriptive names

#### Comments
```typescript
// ✅ Good: Explain why, not what
// Use exponential backoff to handle rate limits gracefully
await retryWithBackoff(operation);

// ❌ Bad: State the obvious
// Call the retry function
await retryWithBackoff(operation);
```

#### JSDoc for Public APIs
```typescript
/**
 * Analyzes a codebase and generates insights
 * 
 * @param options - Analysis configuration options
 * @returns Promise resolving to analysis results
 * @throws {AnalysisError} If analysis fails
 * 
 * @example
 * ```typescript
 * const results = await analyzer.analyze({
 *   path: './src',
 *   includeTests: true
 * });
 * ```
 */
async analyze(options: AnalysisOptions): Promise<AnalysisResult> {
  // implementation
}
```

## Testing Guidelines

### Test Structure
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CodeAnalyzer } from './code-analyzer';

describe('CodeAnalyzer', () => {
  let analyzer: CodeAnalyzer;

  beforeEach(() => {
    analyzer = new CodeAnalyzer();
  });

  afterEach(() => {
    // cleanup
  });

  describe('analyze', () => {
    it('should analyze valid code successfully', async () => {
      const result = await analyzer.analyze({ path: './test-fixtures' });
      
      expect(result).toBeDefined();
      expect(result.summary.totalFiles).toBeGreaterThan(0);
    });

    it('should throw error for invalid path', async () => {
      await expect(
        analyzer.analyze({ path: './nonexistent' })
      ).rejects.toThrow(AnalysisError);
    });
  });
});
```

### Test Coverage
- Aim for >80% coverage on core modules
- Test happy paths and error cases
- Mock external dependencies (Bob API, watsonx)
- Use test fixtures for consistent data

### Running Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- code-analyzer.test.ts

# Run with coverage
npm run test:coverage

# Run in watch mode
npm test -- --watch

# Run with UI
npm run test:ui
```

## Documentation

### Code Documentation
- Add JSDoc comments for public APIs
- Explain complex algorithms
- Document assumptions and constraints
- Include usage examples

### README Updates
- Update feature list for new capabilities
- Add usage examples
- Update installation steps if needed
- Keep architecture diagrams current

### AGENTS.md Updates
- Document new patterns discovered
- Add project-specific conventions
- Update module structure information
- Include Bob integration patterns

## Pull Request Process

### Before Submitting
- [ ] All tests pass
- [ ] Code is properly formatted
- [ ] TypeScript compiles without errors
- [ ] Documentation is updated
- [ ] Bob session exported and included
- [ ] No credentials in code

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2

## Testing
How was this tested?

## Bob Usage
- Bobcoins used: X
- Bob sessions: [link to exported sessions]

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Code follows style guidelines
- [ ] No credentials committed
```

### Review Process
1. Automated checks run (linting, tests, type-checking)
2. Code review by team member
3. Address feedback
4. Approval and merge

## Using IBM Bob

### Bob Modes for Development

#### Code Mode
Use for implementation:
```
@file src/core/code-analyzer/client.ts
Implement the analyze method that scans files and extracts metrics
```

#### Plan Mode
Use for design:
```
Design the architecture for the documentation generator module.
Consider: file parsing, markdown generation, diagram creation
```

#### Ask Mode
Use for questions:
```
@folder src/core
Explain how the Bob integration layer handles rate limiting
```

#### Advanced Mode
Use for complex tasks:
```
Analyze the entire codebase and suggest performance optimizations.
Use MCP tools to fetch best practices from external sources.
```

### Bob Best Practices

1. **Use Context Mentions**
   - `@file` for specific files
   - `@folder` for directories
   - `@problems` for errors

2. **Create Checkpoints**
   - Before major refactoring
   - After completing features
   - Before risky changes

3. **Export Sessions**
   - After each significant task
   - Save to `bob_sessions/`
   - Include in commits

4. **Optimize Bobcoin Usage**
   - Batch related questions
   - Use caching when possible
   - Be specific in prompts

## Hackathon-Specific Guidelines

### Bobcoin Management
- Track usage in Bob IDE settings
- Coordinate with team on coin allocation
- Prioritize critical features
- Use watsonx for some operations if needed

### Session Reports
- Export all development sessions
- Include screenshots of consumption
- Document in `bob_sessions/README.md`
- Ensure no credentials in exports

### Security
- Never commit `.env` file
- Review all files before commit
- Use `.gitignore` properly
- Rotate keys if exposed

## Getting Help

### Resources
- [Project README](../README.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [Setup Guide](./SETUP_GUIDE.md)
- [IBM Bob Documentation](https://ibm.github.io/bob-ide/)

### Communication
- Team chat for quick questions
- GitHub issues for bugs/features
- Code reviews for feedback
- Hackathon support for IBM Bob issues

## Code of Conduct

- Be respectful and professional
- Provide constructive feedback
- Help team members learn
- Share knowledge and insights
- Celebrate successes together

---

Thank you for contributing to LazyBob! 🚀