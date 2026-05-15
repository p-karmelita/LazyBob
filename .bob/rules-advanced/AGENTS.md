# Advanced Mode Rules

This file provides specific guidance for Bob when operating in Advanced mode.

## Mode Capabilities
- Full access to MCP servers
- Browser tools available
- Extended tool access for complex tasks

## Advanced Features

### MCP Server Integration
- Use MCP servers for external tool integration
- Configure MCP connections in project settings
- Handle MCP failures gracefully with fallbacks
- Document MCP dependencies in module docs

### Browser Tool Usage
- Use for web scraping documentation
- Fetch external API specifications
- Research best practices and patterns
- Validate external resource availability

### Complex Workflow Patterns
- Coordinate multi-step operations
- Orchestrate between different tools
- Handle long-running processes
- Implement retry logic with exponential backoff

## watsonx Integration (Advanced)

### watsonx.ai Usage
```typescript
import { WatsonxAI } from '../watsonx/ai';

const client = new WatsonxAI({
  apiKey: process.env.WATSONX_API_KEY,
  projectId: process.env.WATSONX_PROJECT_ID,
});

// Use Granite models for inference
const response = await client.generate({
  model: 'ibm/granite-13b-chat-v2',
  prompt: 'Your prompt here',
  parameters: {
    max_tokens: 1000,
    temperature: 0.7,
  },
});
```

### watsonx Orchestrate Integration
```typescript
import { WatsonxOrchestrate } from '../watsonx/orchestrate';

const orchestrate = new WatsonxOrchestrate({
  apiKey: process.env.ORCHESTRATE_API_KEY,
  endpoint: process.env.ORCHESTRATE_ENDPOINT,
});

// Create and deploy agents
await orchestrate.createAgent({
  name: 'DocumentationAgent',
  description: 'Generates documentation',
  tools: ['read_file', 'write_file'],
});
```

## Advanced Analysis Patterns

### Multi-File Analysis
- Analyze entire directory structures
- Track dependencies across files
- Generate architecture diagrams
- Identify code smells and patterns

### Performance Optimization
- Profile code execution
- Identify bottlenecks
- Suggest optimizations
- Benchmark improvements

### Security Analysis
- Scan for credential exposure
- Check for security vulnerabilities
- Validate input sanitization
- Review authentication patterns

## Resource Management

### Bobcoin Optimization
- Batch operations when possible
- Cache intermediate results
- Use streaming for large responses
- Monitor usage in real-time

### Credit Management (watsonx)
- Track token consumption
- Optimize prompt engineering
- Use smaller models when appropriate
- Implement response caching

## Error Recovery Patterns

```typescript
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(Math.pow(2, i) * 1000);
    }
  }
  throw new Error('Max retries exceeded');
}
```

## Critical Reminders
- Validate all external tool responses
- Implement timeouts for all operations
- Log all external API calls
- Handle rate limits proactively
- Never expose credentials in logs