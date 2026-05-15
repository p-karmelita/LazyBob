# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Context
LazyBob is an AI-powered development accelerator for the IBM Bob Hackathon. It automates code analysis, documentation generation, and task automation using IBM Bob IDE as the core component.

## Essential Commands

### Development
```bash
npm run dev              # Watch mode with tsx
npm run build            # TypeScript compilation
npm test                 # Run vitest tests
npm run type-check       # TypeScript validation without emit
```

### CLI Tools
```bash
npm run analyze -- <path>           # Analyze codebase
npm run generate-docs -- <path>     # Generate documentation
npm run automate -- <task-type>     # Run automation tasks
```

## Code Style Guidelines

### Imports
- Use ES modules (`import`/`export`)
- Group imports: external → internal → types
- Use path aliases from tsconfig when available

### TypeScript
- Strict mode enabled - all types required
- Use Zod for runtime validation
- Prefer `interface` over `type` for object shapes
- Use `unknown` instead of `any`

### Naming Conventions
- Files: kebab-case (`code-analyzer.ts`)
- Classes: PascalCase (`CodeAnalyzer`)
- Functions/variables: camelCase (`analyzeCode`)
- Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- Types/Interfaces: PascalCase with descriptive names

### Error Handling
- Use custom error classes in `src/utils/errors.ts`
- Always provide context in error messages
- Log errors with appropriate levels (error, warn, info)
- Never expose sensitive data in error messages

### Testing
- Test files colocated with source: `*.test.ts`
- Use descriptive test names: `describe('feature') { it('should...') }`
- Mock external dependencies (Bob API, watsonx)
- Aim for >80% coverage on core modules

## Project-Specific Patterns

### Bob Integration
- All Bob interactions go through `src/core/bob-integration/`
- Use `BobClient` class for API calls
- Track Bobcoin usage in all operations
- Export session reports to `bob_sessions/`

### Credential Management
- NEVER commit credentials (enforced by .gitignore)
- Use environment variables from `.env`
- Validate credentials at startup
- Fail fast if required credentials missing

### Module Structure
Each core module follows this pattern:
```
module-name/
├── index.ts           # Public API exports
├── types.ts           # Module-specific types
├── client.ts          # Main implementation
├── utils.ts           # Helper functions
└── *.test.ts          # Tests
```

### watsonx Integration (Optional)
- Check feature flags before using watsonx
- Handle API failures gracefully
- Cache responses when appropriate
- Monitor credit usage

## Critical Constraints

1. **Bobcoin Budget**: 40 coins per team member - optimize usage
2. **No Credentials in Git**: Automatic account suspension if violated
3. **Session Reports Required**: Export all Bob sessions to `bob_sessions/`
4. **Node.js >= 18**: Required for ES modules and modern features
5. **TypeScript Strict Mode**: No implicit any, all types required

## Architecture Notes

- **Modular Design**: Core modules are independent and composable
- **CLI-First**: All features accessible via command line
- **Bob-Centric**: Bob IDE is the primary interface, code supports it
- **Optional watsonx**: Features work without watsonx integration
- **Type-Safe**: Full TypeScript with strict checking

## Common Tasks

### Adding a New Feature
1. Create module in appropriate `src/core/` subdirectory
2. Define types in `types.ts`
3. Implement in `client.ts` or `index.ts`
4. Add tests in `*.test.ts`
5. Export from module's `index.ts`
6. Add CLI command if needed in `scripts/`

### Working with Bob
1. Use Bob modes appropriately (Code/Plan/Ask/Advanced)
2. Leverage context mentions (`@file`, `@folder`)
3. Create checkpoints before major changes
4. Export sessions regularly
5. Monitor Bobcoin usage

### Documentation Updates
- Update README.md for user-facing changes
- Update AGENTS.md for development patterns
- Generate API docs with `npm run generate-docs`
- Keep examples in `examples/` directory current