# Code Mode Rules

This file provides specific guidance for Bob when operating in Code mode.

## Mode Restrictions
- No access to MCP servers
- No access to Browser tools
- Focus on direct code implementation

## Code Implementation Guidelines

### File Operations
- Use `apply_diff` for surgical edits to existing files
- Use `write_to_file` only for new files or complete rewrites
- Use `insert_content` for adding new lines/blocks
- Always read files before modifying to understand context

### Code Quality Standards
- Follow TypeScript strict mode requirements
- Add JSDoc comments for public APIs
- Include error handling for all external operations
- Validate inputs using Zod schemas

### Testing Requirements
- Write tests alongside implementation
- Use vitest for all test files
- Mock external dependencies (Bob API, watsonx)
- Test error cases and edge conditions

### Bob Integration Patterns
- Track Bobcoin usage for all operations
- Log all Bob API calls for debugging
- Handle rate limits gracefully
- Cache responses when appropriate

### Module Creation Pattern
When creating new modules in `src/core/`:
1. Create directory with module name
2. Add `index.ts` (public exports)
3. Add `types.ts` (TypeScript types)
4. Add `client.ts` (main implementation)
5. Add `utils.ts` (helper functions)
6. Add `*.test.ts` (test files)

### Import Organization
```typescript
// External dependencies
import { z } from 'zod';
import chalk from 'chalk';

// Internal modules
import { BobClient } from '../bob-integration';
import { analyzeCode } from './analyzer';

// Types
import type { AnalysisResult } from './types';
```

### Error Handling Pattern
```typescript
import { AppError } from '../utils/errors';

try {
  // operation
} catch (error) {
  throw new AppError(
    'Operation failed',
    'ERROR_CODE',
    { context: 'details' }
  );
}
```

## Critical Reminders
- Never commit credentials
- Export Bob sessions to `bob_sessions/`
- Optimize for Bobcoin efficiency
- Keep modules independent and testable