# Ask Mode Rules

This file provides specific guidance for Bob when operating in Ask mode.

## Mode Purpose
- Provide explanations and documentation
- Answer technical questions
- Analyze code without modifications
- Guide architectural decisions

## Response Guidelines

### Explanation Style
- Use clear, concise language
- Provide code examples when helpful
- Reference specific files and line numbers
- Include visual diagrams for complex concepts

### Code Analysis
- Explain code flow and logic
- Identify patterns and anti-patterns
- Suggest improvements without implementing
- Highlight potential issues

### Documentation Focus
- Explain project architecture
- Describe module relationships
- Document API contracts
- Clarify design decisions

## Project-Specific Context

### Architecture Overview
```
LazyBob follows a modular architecture:
- Core modules in src/core/ are independent
- Bob integration layer handles all AI interactions
- Optional watsonx modules extend capabilities
- CLI tools provide command-line access
```

### Key Modules
1. **bob-integration**: Bob IDE API client and utilities
2. **code-analyzer**: Static code analysis engine
3. **doc-generator**: Automated documentation creation
4. **task-automator**: Repetitive task automation

### Technology Stack
- **Runtime**: Node.js 18+ with ES modules
- **Language**: TypeScript with strict mode
- **Testing**: Vitest for unit/integration tests
- **Validation**: Zod for runtime type checking
- **CLI**: Commander for command-line interface

## Common Questions

### "How does Bob integration work?"
All Bob interactions go through `src/core/bob-integration/`:
- `BobClient` class handles API calls
- Bobcoin usage is tracked automatically
- Sessions are exported to `bob_sessions/`
- Rate limiting and retries are built-in

### "How to add a new feature?"
1. Create module in `src/core/<feature-name>/`
2. Define types in `types.ts`
3. Implement in `client.ts`
4. Add tests in `*.test.ts`
5. Export from `index.ts`
6. Add CLI command if needed

### "What about watsonx integration?"
watsonx integration is optional:
- Check `ENABLE_WATSONX_*` feature flags
- Modules in `src/watsonx/` handle integration
- Gracefully degrade if not configured
- Monitor credit usage carefully

### "How to optimize Bobcoin usage?"
- Batch operations when possible
- Cache responses appropriately
- Use context mentions efficiently
- Monitor usage in Bob IDE settings

## Documentation Standards

### Code Comments
- Use JSDoc for public APIs
- Explain "why" not "what"
- Document assumptions and constraints
- Include usage examples

### README Updates
- Keep installation steps current
- Document new features
- Update usage examples
- Maintain architecture diagrams

### API Documentation
- Generate with `npm run generate-docs`
- Include request/response examples
- Document error cases
- Specify rate limits

## Critical Information

### Hackathon Constraints
- 40 Bobcoins per team member
- $80 IBM Cloud credits (if using watsonx)
- Must export Bob sessions for judging
- No credentials in repository

### Security Notes
- Never expose API keys
- Validate all inputs
- Sanitize error messages
- Use environment variables

### Best Practices
- Follow TypeScript strict mode
- Write tests for all features
- Keep modules independent
- Document architectural decisions