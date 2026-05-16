# Bob API Integration Guide

## Overview

LazyBob now supports both **mock mode** (for testing) and **real HTTP API calls** to Bob IDE endpoints. The implementation follows OpenAI-like API patterns for compatibility and ease of use.

## Architecture

### Components

1. **BobHTTPClient** (`src/core/bob-integration/http-client.ts`)
   - Handles HTTP communication with Bob API
   - Implements retry logic with exponential backoff
   - Supports timeout configuration
   - Provides health check endpoint

2. **BobClient** (`src/core/bob-integration/client.ts`)
   - Main client interface
   - Supports both mock and real API modes
   - Tracks Bobcoin usage
   - Manages sessions

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Bob API Configuration
BOB_API_KEY=your-api-key-here
BOB_API_ENDPOINT=https://bob-api.example.com
BOB_TEAM_ID=your-team-id

# Optional: Use mock mode for testing
# BOB_API_ENDPOINT=mock
```

### Client Initialization

```typescript
import { BobClient } from './core/bob-integration';

// Real API mode
const client = new BobClient({
  apiKey: process.env.BOB_API_KEY!,
  teamId: process.env.BOB_TEAM_ID!,
  endpoint: process.env.BOB_API_ENDPOINT, // e.g., https://bob-api.example.com
});

// Mock mode (for testing)
const mockClient = new BobClient({
  apiKey: 'test-key',
  teamId: 'test-team',
  endpoint: 'mock', // or omit endpoint
});
```

## API Endpoints

### Chat Completion

**Endpoint**: `POST /v1/chat/completions`

**Request Format**:
```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are Bob, a highly skilled software engineer..."
    },
    {
      "role": "user",
      "content": "Write a function to calculate fibonacci numbers"
    }
  ],
  "model": "bob-v1",
  "temperature": 0.7,
  "max_tokens": 2000,
  "stream": false
}
```

**Response Format**:
```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "bob-v1",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Here's a fibonacci function..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 150,
    "total_tokens": 200
  }
}
```

### Health Check

**Endpoint**: `GET /health`

**Headers**:
```
Authorization: Bearer {API_KEY}
```

**Response**: `200 OK` if healthy

## Usage Examples

### Basic Request

```typescript
const response = await client.request({
  prompt: 'Explain TypeScript generics',
  mode: 'ask',
  temperature: 0.7,
  maxTokens: 1000,
});

console.log(response.content);
console.log(`Bobcoins used: ${response.bobcoinsUsed}`);
```

### With Context

```typescript
const response = await client.request({
  prompt: 'Refactor this code',
  context: 'File: src/utils/helper.ts\nCode: ...',
  mode: 'code',
  files: ['src/utils/helper.ts'],
});
```

### Different Modes

```typescript
// Code mode - for code generation and modification
await client.request({
  prompt: 'Create a REST API endpoint',
  mode: 'code',
});

// Plan mode - for project planning and task breakdown
await client.request({
  prompt: 'Plan a microservices architecture',
  mode: 'plan',
});

// Ask mode - for questions and explanations
await client.request({
  prompt: 'What is dependency injection?',
  mode: 'ask',
});

// Advanced mode - with tool access
await client.request({
  prompt: 'Analyze this codebase and suggest improvements',
  mode: 'advanced',
});
```

### Session Management

```typescript
// Start a session
const session = client.startSession('code');

// Make requests (tracked in session)
await client.request({ prompt: 'Task 1', mode: 'code' });
await client.request({ prompt: 'Task 2', mode: 'code' });

// Get current session
const currentSession = client.getCurrentSession();
console.log(`Bobcoins used in session: ${currentSession?.bobcoinsUsed}`);

// End session
const completedSession = client.endSession();

// Export session report
await client.exportSession('./session-report.json', session.id);
```

### Bobcoin Tracking

```typescript
// Get current usage
const usage = client.getBobcoinUsage();
console.log(`Used: ${usage.used}/${usage.total}`);
console.log(`Remaining: ${usage.remaining}`);
console.log(`Percentage: ${usage.percentage.toFixed(2)}%`);

// Check if running low
if (usage.percentage >= 80) {
  console.warn('Bobcoin usage is high!');
}
```

### Health Check

```typescript
const isHealthy = await client.checkHealth();
if (!isHealthy) {
  console.error('Bob API is not available');
}
```

## Error Handling

```typescript
import { BobAPIError, BobcoinExhaustedError } from './utils/errors';

try {
  const response = await client.request({
    prompt: 'Generate code',
    mode: 'code',
  });
} catch (error) {
  if (error instanceof BobcoinExhaustedError) {
    console.error('No Bobcoins remaining!');
    console.error(`Used: ${error.context.used}/${error.context.total}`);
  } else if (error instanceof BobAPIError) {
    console.error('API request failed:', error.message);
    console.error('Context:', error.context);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## HTTP Client Features

### Automatic Retries

The HTTP client automatically retries failed requests up to 3 times with exponential backoff:

- Attempt 1: Immediate
- Attempt 2: 1 second delay
- Attempt 3: 2 second delay

### Timeout Configuration

Default timeout is 30 seconds. Configure when creating the client:

```typescript
const client = new BobClient({
  apiKey: 'your-key',
  teamId: 'your-team',
  endpoint: 'https://bob-api.example.com',
  // Custom timeout via HTTP client (internal)
});
```

### Request Headers

All requests include:
```
Content-Type: application/json
Authorization: Bearer {API_KEY}
User-Agent: LazyBob/1.0.0
```

## Bobcoin Pricing

Bobcoin usage is calculated based on token count:
- **1 Bobcoin ≈ 1000 tokens**
- Includes both prompt and completion tokens
- Total team allocation: **40 Bobcoins per member**

## Testing

### Mock Mode

For testing, use mock mode which simulates API responses:

```typescript
const mockClient = new BobClient({
  apiKey: 'test-key',
  teamId: 'test-team',
  endpoint: 'mock',
});

// Returns mock responses without making HTTP calls
const response = await mockClient.request({
  prompt: 'Test prompt',
  mode: 'code',
});
```

### Integration Tests

Run tests with:
```bash
npm test
```

All tests use mock mode by default to avoid consuming Bobcoins.

## Best Practices

1. **Use Mock Mode for Development**
   - Set `BOB_API_ENDPOINT=mock` in `.env` during development
   - Switch to real API only when needed

2. **Monitor Bobcoin Usage**
   - Check usage regularly with `getBobcoinUsage()`
   - Set up alerts when usage exceeds 80%

3. **Export Sessions**
   - Export all Bob sessions to `bob_sessions/` directory
   - Required for hackathon judging

4. **Handle Errors Gracefully**
   - Always wrap API calls in try-catch
   - Provide fallback behavior for API failures

5. **Optimize Prompts**
   - Keep prompts concise to reduce token usage
   - Use context parameter instead of including code in prompt

6. **Use Appropriate Modes**
   - `code`: For code generation and modification
   - `plan`: For planning and architecture
   - `ask`: For questions and explanations
   - `advanced`: For complex tasks requiring tools

## Troubleshooting

### Connection Errors

```
Error: fetch failed
Cause: getaddrinfo ENOTFOUND
```

**Solution**: Check that `BOB_API_ENDPOINT` is correct and accessible.

### Authentication Errors

```
Error: 401 Unauthorized
```

**Solution**: Verify `BOB_API_KEY` is valid and not expired.

### Rate Limiting

```
Error: 429 Too Many Requests
```

**Solution**: Implement request throttling or wait before retrying.

### Bobcoin Exhaustion

```
Error: No Bobcoins remaining
```

**Solution**: Monitor usage and optimize prompts to reduce token consumption.

## API Reference

See [types.ts](../src/core/bob-integration/types.ts) for complete type definitions.

## Support

For issues or questions:
1. Check the [troubleshooting section](#troubleshooting)
2. Review error logs in console
3. Verify environment configuration
4. Test with mock mode first

---

**Note**: This integration is designed for the IBM Bob Hackathon. Adjust API endpoints and authentication as needed for your specific Bob IDE deployment.