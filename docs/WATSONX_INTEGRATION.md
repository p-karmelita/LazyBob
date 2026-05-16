# watsonx Integration Guide

This guide covers the integration of IBM watsonx.ai and watsonx Orchestrate into LazyBob for AI-powered development features.

## Table of Contents

1. [Overview](#overview)
2. [watsonx.ai Integration](#watsonxai-integration)
3. [watsonx Orchestrate Integration](#watsonx-orchestrate-integration)
4. [Configuration](#configuration)
5. [Usage Examples](#usage-examples)
6. [API Reference](#api-reference)
7. [Cost Management](#cost-management)
8. [Best Practices](#best-practices)

## Overview

LazyBob integrates with two IBM watsonx services:

- **watsonx.ai**: AI-powered code generation, analysis, and suggestions using IBM Granite models
- **watsonx Orchestrate**: Workflow automation and AI agent orchestration for complex development tasks

### Key Features

- 🤖 AI-powered code suggestions and improvements
- 🔍 Intelligent code review and analysis
- 🔄 Automated development workflows
- 🎯 AI agents for autonomous task execution
- 📊 Token usage tracking and cost optimization

## watsonx.ai Integration

### Supported Models

LazyBob supports IBM Granite code models:

```typescript
enum GraniteModel {
  CODE_8B = 'ibm/granite-8b-code-instruct',      // Fast, efficient
  CODE_20B = 'ibm/granite-20b-code-instruct',    // Balanced
  CODE_34B = 'ibm/granite-34b-code-instruct',    // Most capable
  CHAT_8B = 'ibm/granite-8b-code-chat',          // Conversational
  CHAT_20B = 'ibm/granite-20b-code-chat',        // Advanced chat
}
```

### Core Capabilities

#### 1. Code Generation

Generate code from natural language descriptions:

```typescript
import { WatsonxAIClient, GraniteModel } from './watsonx/ai';

const client = new WatsonxAIClient({
  apiKey: process.env.WATSONX_API_KEY!,
  projectId: process.env.WATSONX_PROJECT_ID!,
});

const response = await client.generate({
  model: GraniteModel.CODE_20B,
  prompt: 'Create a TypeScript function to validate email addresses',
  maxTokens: 500,
  temperature: 0.7,
});

console.log(response.generatedText);
console.log(`Tokens used: ${response.tokenUsage.totalTokens}`);
```

#### 2. Code Suggestions

Get AI-powered code improvements:

```typescript
const suggestion = await client.getCodeSuggestion({
  code: `
    function processData(data) {
      let result = [];
      for (let i = 0; i < data.length; i++) {
        result.push(data[i] * 2);
      }
      return result;
    }
  `,
  language: 'typescript',
  context: 'Optimize this function for better performance',
  model: GraniteModel.CODE_20B,
});

console.log('Original:', suggestion.originalCode);
console.log('Improved:', suggestion.suggestedCode);
console.log('Explanation:', suggestion.explanation);
console.log('Improvements:', suggestion.improvements);
```

#### 3. Code Review

Automated code review with AI:

```typescript
const review = await client.reviewCode({
  code: sourceCode,
  language: 'typescript',
  focusAreas: ['security', 'performance', 'maintainability'],
  model: GraniteModel.CODE_34B,
});

console.log('Overall Score:', review.overallScore);
console.log('Issues Found:', review.issues.length);

review.issues.forEach(issue => {
  console.log(`[${issue.severity}] ${issue.type}: ${issue.message}`);
  console.log(`  Line ${issue.line}: ${issue.suggestion}`);
});
```

#### 4. Comprehensive Analysis

Deep code analysis with multiple perspectives:

```typescript
const analysis = await client.analyzeCode({
  code: sourceCode,
  language: 'typescript',
  analysisTypes: ['quality', 'security', 'performance', 'maintainability'],
  model: GraniteModel.CODE_34B,
});

console.log('Quality Score:', analysis.qualityScore);
console.log('Security Issues:', analysis.securityIssues.length);
console.log('Performance Issues:', analysis.performanceIssues.length);
console.log('Suggestions:', analysis.suggestions);
```

## watsonx Orchestrate Integration

### Workflow Automation

Pre-built development workflows:

```typescript
import { OrchestrateClient, DevWorkflowTemplate } from './watsonx/orchestrate';

const orchestrate = new OrchestrateClient({
  apiKey: process.env.WATSONX_ORCHESTRATE_KEY!,
  instanceId: process.env.WATSONX_ORCHESTRATE_INSTANCE!,
});

// Code Review Workflow
const reviewWorkflow = orchestrate.createDevWorkflow(
  DevWorkflowTemplate.CODE_REVIEW,
  {
    repository: 'my-repo',
    branch: 'feature/new-feature',
    reviewers: ['senior-dev@example.com'],
  }
);

const reviewResult = await orchestrate.executeWorkflow(reviewWorkflow.id);
console.log('Review Status:', reviewResult.status);
console.log('Results:', reviewResult.results);
```

### Available Workflow Templates

1. **CODE_REVIEW**: Automated code review with AI analysis
2. **DOCUMENTATION**: Generate comprehensive documentation
3. **TESTING**: Create and run test suites
4. **DEPLOYMENT**: Automated deployment pipeline
5. **REFACTORING**: Code refactoring with AI suggestions

### AI Agents

Autonomous agents for complex tasks:

```typescript
// Create an AI agent
const agent = await orchestrate.createAgent({
  name: 'CodeRefactorAgent',
  description: 'Refactors code for better maintainability',
  skills: ['code-analysis', 'refactoring', 'testing'],
  model: 'granite-20b-code',
  autonomyLevel: 'supervised',
});

// Execute agent task
const execution = await orchestrate.executeAgent(agent.id, {
  task: 'Refactor the authentication module',
  context: {
    files: ['src/auth/*.ts'],
    constraints: ['maintain backward compatibility'],
  },
});

console.log('Agent Status:', execution.status);
console.log('Steps Taken:', execution.steps);
console.log('Results:', execution.results);
```

### Automation Tasks

Execute specific automation tasks:

```typescript
const task = await orchestrate.executeAutomationTask({
  type: 'code-generation',
  description: 'Generate REST API endpoints for user management',
  parameters: {
    framework: 'express',
    database: 'postgresql',
    authentication: 'jwt',
  },
});

console.log('Generated Code:', task.results.code);
console.log('Tests:', task.results.tests);
console.log('Documentation:', task.results.documentation);
```

## Configuration

### Environment Variables

Create a `.env` file with your credentials:

```bash
# watsonx.ai Configuration
WATSONX_API_KEY=your_watsonx_api_key
WATSONX_PROJECT_ID=your_project_id
WATSONX_REGION=us-south

# watsonx Orchestrate Configuration
WATSONX_ORCHESTRATE_KEY=your_orchestrate_key
WATSONX_ORCHESTRATE_INSTANCE=your_instance_id
WATSONX_ORCHESTRATE_REGION=us-south

# Optional: Model Preferences
WATSONX_DEFAULT_MODEL=ibm/granite-20b-code-instruct
WATSONX_MAX_TOKENS=2000
WATSONX_TEMPERATURE=0.7
```

### Client Configuration

```typescript
// watsonx.ai Client
const aiClient = new WatsonxAIClient({
  apiKey: process.env.WATSONX_API_KEY!,
  projectId: process.env.WATSONX_PROJECT_ID!,
  region: process.env.WATSONX_REGION || 'us-south',
  defaultModel: GraniteModel.CODE_20B,
  maxTokens: 2000,
  temperature: 0.7,
});

// watsonx Orchestrate Client
const orchestrateClient = new OrchestrateClient({
  apiKey: process.env.WATSONX_ORCHESTRATE_KEY!,
  instanceId: process.env.WATSONX_ORCHESTRATE_INSTANCE!,
  region: process.env.WATSONX_ORCHESTRATE_REGION || 'us-south',
  timeout: 30000,
});
```

## Usage Examples

### Example 1: AI-Powered Code Refactoring

```typescript
import { WatsonxAIClient, GraniteModel } from './watsonx/ai';

async function refactorCode(code: string) {
  const client = new WatsonxAIClient({
    apiKey: process.env.WATSONX_API_KEY!,
    projectId: process.env.WATSONX_PROJECT_ID!,
  });

  // Get code suggestions
  const suggestion = await client.getCodeSuggestion({
    code,
    language: 'typescript',
    context: 'Refactor for better readability and performance',
    model: GraniteModel.CODE_20B,
  });

  // Review the suggested code
  const review = await client.reviewCode({
    code: suggestion.suggestedCode,
    language: 'typescript',
    focusAreas: ['performance', 'maintainability'],
    model: GraniteModel.CODE_34B,
  });

  return {
    original: code,
    refactored: suggestion.suggestedCode,
    improvements: suggestion.improvements,
    reviewScore: review.overallScore,
    issues: review.issues,
  };
}
```

### Example 2: Automated Development Workflow

```typescript
import { OrchestrateClient, DevWorkflowTemplate } from './watsonx/orchestrate';

async function automateFeatureDevelopment(featureName: string) {
  const orchestrate = new OrchestrateClient({
    apiKey: process.env.WATSONX_ORCHESTRATE_KEY!,
    instanceId: process.env.WATSONX_ORCHESTRATE_INSTANCE!,
  });

  // Step 1: Generate code
  const codeGenTask = await orchestrate.executeAutomationTask({
    type: 'code-generation',
    description: `Generate ${featureName} feature`,
    parameters: { framework: 'express', testing: true },
  });

  // Step 2: Run tests
  const testWorkflow = orchestrate.createDevWorkflow(
    DevWorkflowTemplate.TESTING,
    { testFiles: codeGenTask.results.tests }
  );
  await orchestrate.executeWorkflow(testWorkflow.id);

  // Step 3: Generate documentation
  const docWorkflow = orchestrate.createDevWorkflow(
    DevWorkflowTemplate.DOCUMENTATION,
    { sourceFiles: codeGenTask.results.code }
  );
  await orchestrate.executeWorkflow(docWorkflow.id);

  return {
    code: codeGenTask.results.code,
    tests: codeGenTask.results.tests,
    documentation: codeGenTask.results.documentation,
  };
}
```

### Example 3: AI Agent for Code Review

```typescript
async function aiCodeReview(pullRequestId: string) {
  const orchestrate = new OrchestrateClient({
    apiKey: process.env.WATSONX_ORCHESTRATE_KEY!,
    instanceId: process.env.WATSONX_ORCHESTRATE_INSTANCE!,
  });

  // Create specialized review agent
  const agent = await orchestrate.createAgent({
    name: 'CodeReviewAgent',
    description: 'Reviews code for quality, security, and best practices',
    skills: ['code-analysis', 'security-audit', 'performance-testing'],
    model: 'granite-34b-code',
    autonomyLevel: 'supervised',
  });

  // Execute review
  const execution = await orchestrate.executeAgent(agent.id, {
    task: `Review pull request #${pullRequestId}`,
    context: {
      repository: 'my-repo',
      branch: 'feature-branch',
      focusAreas: ['security', 'performance', 'maintainability'],
    },
  });

  return {
    status: execution.status,
    findings: execution.results.findings,
    recommendations: execution.results.recommendations,
    approvalStatus: execution.results.approved,
  };
}
```

## API Reference

### WatsonxAIClient

#### Constructor Options

```typescript
interface WatsonxAIConfig {
  apiKey: string;           // watsonx.ai API key
  projectId: string;        // Project ID
  region?: string;          // Region (default: 'us-south')
  defaultModel?: GraniteModel;  // Default model
  maxTokens?: number;       // Max tokens (default: 2000)
  temperature?: number;     // Temperature (default: 0.7)
}
```

#### Methods

- `generate(request: GenerationRequest): Promise<GenerationResponse>`
- `getCodeSuggestion(request: CodeSuggestionRequest): Promise<CodeSuggestionResponse>`
- `reviewCode(request: CodeReviewRequest): Promise<CodeReviewResponse>`
- `analyzeCode(request: CodeAnalysisRequest): Promise<CodeAnalysisResponse>`

### OrchestrateClient

#### Constructor Options

```typescript
interface OrchestrateConfig {
  apiKey: string;           // Orchestrate API key
  instanceId: string;       // Instance ID
  region?: string;          // Region (default: 'us-south')
  timeout?: number;         // Request timeout (default: 30000)
}
```

#### Methods

- `createWorkflow(workflow: Workflow): Promise<Workflow>`
- `executeWorkflow(workflowId: string, inputs?: Record<string, any>): Promise<WorkflowExecution>`
- `createDevWorkflow(template: DevWorkflowTemplate, config: any): Workflow`
- `createAgent(config: AgentConfig): Promise<Agent>`
- `executeAgent(agentId: string, task: AgentTask): Promise<AgentExecution>`
- `executeAutomationTask(task: AutomationTask): Promise<AutomationTaskResult>`

## Cost Management

### Token Usage Tracking

All watsonx.ai operations return token usage information:

```typescript
const response = await client.generate({
  model: GraniteModel.CODE_20B,
  prompt: 'Generate code...',
});

console.log('Input tokens:', response.tokenUsage.inputTokens);
console.log('Output tokens:', response.tokenUsage.outputTokens);
console.log('Total tokens:', response.tokenUsage.totalTokens);
console.log('Estimated cost:', response.tokenUsage.estimatedCost);
```

### Cost Optimization Tips

1. **Choose the right model**: Use smaller models (8B) for simple tasks
2. **Limit max tokens**: Set appropriate `maxTokens` limits
3. **Cache responses**: Store and reuse AI responses when possible
4. **Batch operations**: Combine multiple requests when feasible
5. **Use lower temperature**: Reduce `temperature` for deterministic outputs

### Pricing Estimates

Approximate token costs (subject to change):

- **Granite 8B models**: ~$0.0001 per 1K tokens
- **Granite 20B models**: ~$0.0003 per 1K tokens
- **Granite 34B models**: ~$0.0005 per 1K tokens

## Best Practices

### 1. Error Handling

Always handle errors gracefully:

```typescript
try {
  const result = await client.generate(request);
  // Process result
} catch (error) {
  if (error instanceof AppError) {
    console.error(`watsonx error: ${error.message}`);
    console.error(`Code: ${error.code}`);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### 2. Rate Limiting

Implement rate limiting for production use:

```typescript
import pLimit from 'p-limit';

const limit = pLimit(5); // Max 5 concurrent requests

const results = await Promise.all(
  tasks.map(task => limit(() => client.generate(task)))
);
```

### 3. Prompt Engineering

Write clear, specific prompts:

```typescript
// ❌ Vague
const prompt = 'Make this better';

// ✅ Specific
const prompt = `
Refactor this TypeScript function to:
1. Use async/await instead of callbacks
2. Add proper error handling
3. Improve variable naming
4. Add JSDoc comments
`;
```

### 4. Model Selection

Choose models based on task complexity:

- **Simple tasks**: Granite 8B (fast, cost-effective)
- **Standard tasks**: Granite 20B (balanced)
- **Complex tasks**: Granite 34B (most capable)
- **Interactive**: Chat models for conversational interfaces

### 5. Security

Never expose credentials:

```typescript
// ❌ Don't hardcode
const apiKey = 'sk-abc123...';

// ✅ Use environment variables
const apiKey = process.env.WATSONX_API_KEY;
if (!apiKey) {
  throw new Error('WATSONX_API_KEY not configured');
}
```

## Troubleshooting

### Common Issues

#### Authentication Errors

```
Error: Invalid API key
```

**Solution**: Verify your API key and project ID in `.env`

#### Rate Limit Exceeded

```
Error: Rate limit exceeded
```

**Solution**: Implement exponential backoff and reduce request frequency

#### Token Limit Exceeded

```
Error: Maximum token limit exceeded
```

**Solution**: Reduce `maxTokens` or split large requests

#### Model Not Available

```
Error: Model not found
```

**Solution**: Verify model name and region availability

## Additional Resources

- [IBM watsonx.ai Documentation](https://www.ibm.com/docs/en/watsonx-as-a-service)
- [IBM watsonx Orchestrate Documentation](https://www.ibm.com/docs/en/watsonx/orchestrate)
- [Granite Models Overview](https://www.ibm.com/granite)
- [LazyBob Examples](../examples/watsonx-integration.ts)

## Support

For issues or questions:

1. Check the [troubleshooting section](#troubleshooting)
2. Review [example code](../examples/watsonx-integration.ts)
3. Consult IBM watsonx documentation
4. Open an issue on GitHub

---

**Note**: This integration requires valid IBM watsonx credentials. Sign up at [IBM Cloud](https://cloud.ibm.com) to get started.