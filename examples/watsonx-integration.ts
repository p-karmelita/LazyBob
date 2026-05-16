/**
 * watsonx Integration Example
 * Demonstrates AI-powered features using watsonx.ai and watsonx Orchestrate
 */

import { createWatsonxAIClient, GraniteModel } from '../src/watsonx/ai/index.js';
import { createOrchestrateClient, DevWorkflowTemplate } from '../src/watsonx/orchestrate/index.js';
import { logger } from '../src/utils/logger.js';

/**
 * Example: AI-Powered Code Suggestions
 */
async function aiCodeSuggestions() {
  console.log('\n🤖 AI-Powered Code Suggestions\n');

  const aiClient = createWatsonxAIClient({
    apiKey: process.env.WATSONX_API_KEY || 'your-api-key',
    projectId: process.env.WATSONX_PROJECT_ID || 'your-project-id',
    endpoint: process.env.WATSONX_ENDPOINT,
  });

  const sampleCode = `
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}
  `;

  try {
    // Get code improvement suggestions
    const suggestion = await aiClient.getCodeSuggestion({
      code: sampleCode,
      language: 'javascript',
      task: 'improve',
      context: 'E-commerce shopping cart',
    });

    console.log('✨ Improved Code:');
    console.log(suggestion.suggestion);
    console.log('\n📝 Reasoning:');
    console.log(suggestion.reasoning);
    console.log('\n🎯 Improvements:');
    suggestion.improvements.forEach((imp, i) => {
      console.log(`  ${i + 1}. ${imp}`);
    });
    console.log(`\n💯 Confidence: ${(suggestion.confidence * 100).toFixed(1)}%`);
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
  }
}

/**
 * Example: AI-Powered Code Review
 */
async function aiCodeReview() {
  console.log('\n🔍 AI-Powered Code Review\n');

  const aiClient = createWatsonxAIClient({
    apiKey: process.env.WATSONX_API_KEY || 'your-api-key',
    projectId: process.env.WATSONX_PROJECT_ID || 'your-project-id',
  });

  const codeToReview = `
function processUserData(data) {
  const result = eval(data.expression);
  return result;
}
  `;

  try {
    const review = await aiClient.reviewCode({
      code: codeToReview,
      language: 'javascript',
      filePath: 'src/utils/processor.js',
    });

    console.log(`📊 Overall Score: ${review.overallScore}/100`);
    console.log('\n📋 Summary:');
    console.log(review.summary);

    if (review.issues.length > 0) {
      console.log('\n⚠️  Issues Found:');
      review.issues.forEach((issue, i) => {
        const icon = issue.severity === 'error' ? '🔴' : issue.severity === 'warning' ? '🟡' : 'ℹ️';
        console.log(`\n  ${icon} ${issue.severity.toUpperCase()} (Line ${issue.line})`);
        console.log(`     Category: ${issue.category}`);
        console.log(`     ${issue.message}`);
        if (issue.suggestion) {
          console.log(`     💡 Suggestion: ${issue.suggestion}`);
        }
      });
    }

    if (review.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      review.recommendations.forEach((rec, i) => {
        console.log(`  ${i + 1}. ${rec}`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
  }
}

/**
 * Example: Comprehensive AI Analysis
 */
async function comprehensiveAnalysis() {
  console.log('\n📊 Comprehensive AI Analysis\n');

  const aiClient = createWatsonxAIClient({
    apiKey: process.env.WATSONX_API_KEY || 'your-api-key',
    projectId: process.env.WATSONX_PROJECT_ID || 'your-project-id',
  });

  const complexCode = `
class UserManager {
  constructor(db) {
    this.db = db;
    this.cache = new Map();
  }

  async getUser(id) {
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }
    const user = await this.db.query('SELECT * FROM users WHERE id = ?', [id]);
    this.cache.set(id, user);
    return user;
  }

  async updateUser(id, data) {
    await this.db.query('UPDATE users SET ? WHERE id = ?', [data, id]);
    this.cache.delete(id);
  }
}
  `;

  try {
    const analysis = await aiClient.analyzeCode(
      complexCode,
      'javascript',
      'User management system with caching'
    );

    console.log('📝 Summary:');
    console.log(analysis.summary);

    console.log('\n💡 Key Insights:');
    analysis.insights.forEach((insight, i) => {
      console.log(`  ${i + 1}. ${insight}`);
    });

    console.log('\n🔢 Complexity Analysis:');
    console.log(`  Score: ${analysis.complexity.score.toFixed(1)}/100`);
    console.log(`  Factors: ${analysis.complexity.factors.join(', ')}`);

    console.log('\n✅ Quality Assessment:');
    console.log(`  Score: ${analysis.quality.score}/100`);
    console.log(`  Issues: ${analysis.quality.issues.length}`);

    console.log('\n📈 Token Usage:');
    console.log(`  Input: ${analysis.tokenUsage.inputTokens}`);
    console.log(`  Output: ${analysis.tokenUsage.outputTokens}`);
    console.log(`  Total: ${analysis.tokenUsage.totalTokens}`);
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
  }
}

/**
 * Example: Workflow Automation with Orchestrate
 */
async function workflowAutomation() {
  console.log('\n⚙️  Workflow Automation\n');

  const orchestrateClient = createOrchestrateClient({
    apiKey: process.env.ORCHESTRATE_API_KEY || 'your-api-key',
    endpoint: process.env.ORCHESTRATE_ENDPOINT || 'https://orchestrate.example.com',
  });

  try {
    // Create a code review workflow
    const workflow = await orchestrateClient.createDevWorkflow(
      DevWorkflowTemplate.CODE_REVIEW,
      {
        repository: 'my-repo',
        branch: 'main',
        files: ['src/**/*.ts'],
      }
    );

    console.log(`✅ Created workflow: ${workflow.name}`);
    console.log(`   ID: ${workflow.id}`);
    console.log(`   Steps: ${workflow.steps.length}`);

    // Execute the workflow
    console.log('\n🚀 Executing workflow...');
    const execution = await orchestrateClient.executeWorkflow({
      workflowId: workflow.id,
      inputs: {
        threshold: 80,
        autoFix: false,
      },
      async: false,
    });

    console.log(`\n📊 Execution Results:`);
    console.log(`   Status: ${execution.status}`);
    console.log(`   Duration: ${execution.endTime && execution.startTime ? 
      (execution.endTime.getTime() - execution.startTime.getTime()) / 1000 : 'N/A'}s`);
    
    if (execution.outputs) {
      console.log(`   Outputs:`, execution.outputs);
    }

    // Show step details
    console.log('\n📋 Step Details:');
    execution.steps.forEach((step, i) => {
      const icon = step.status === 'completed' ? '✅' : 
                   step.status === 'failed' ? '❌' : 
                   step.status === 'running' ? '⏳' : '⏸️';
      console.log(`   ${icon} Step ${i + 1}: ${step.stepId} - ${step.status}`);
    });
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
  }
}

/**
 * Example: AI Agent Execution
 */
async function aiAgentExecution() {
  console.log('\n🤖 AI Agent Execution\n');

  const orchestrateClient = createOrchestrateClient({
    apiKey: process.env.ORCHESTRATE_API_KEY || 'your-api-key',
    endpoint: process.env.ORCHESTRATE_ENDPOINT || 'https://orchestrate.example.com',
  });

  try {
    const agentConfig = {
      name: 'Code Improvement Agent',
      description: 'Autonomous agent for code quality improvement',
      skills: ['code-analyzer', 'ai-suggester', 'refactorer'],
      autonomy: 'medium' as const,
      maxIterations: 5,
    };

    const goal = 'Improve code quality and reduce complexity';
    const context = {
      codebase: './src',
      language: 'typescript',
      targetScore: 90,
    };

    console.log(`🎯 Goal: ${goal}`);
    console.log(`🔧 Skills: ${agentConfig.skills.join(', ')}`);
    console.log('\n⏳ Agent working...\n');

    const result = await orchestrateClient.executeAgent(agentConfig, goal, context);

    console.log(`\n${result.success ? '✅' : '❌'} Agent ${result.success ? 'Succeeded' : 'Failed'}`);
    console.log(`   Iterations: ${result.iterations}`);
    console.log(`   Actions Taken: ${result.actions.length}`);

    if (result.actions.length > 0) {
      console.log('\n📋 Actions:');
      result.actions.forEach((action, i) => {
        console.log(`   ${i + 1}. ${action.skillId}`);
        console.log(`      Reasoning: ${action.reasoning}`);
      });
    }

    if (result.reasoning.length > 0) {
      console.log('\n💭 Agent Reasoning:');
      result.reasoning.forEach((reason, i) => {
        console.log(`   ${i + 1}. ${reason}`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
  }
}

/**
 * Example: Automation Task Execution
 */
async function automationTask() {
  console.log('\n⚡ Automation Task Execution\n');

  const orchestrateClient = createOrchestrateClient({
    apiKey: process.env.ORCHESTRATE_API_KEY || 'your-api-key',
    endpoint: process.env.ORCHESTRATE_ENDPOINT || 'https://orchestrate.example.com',
  });

  try {
    const task = await orchestrateClient.executeAutomationTask({
      type: 'code-review',
      inputs: {
        files: ['src/core/**/*.ts'],
        rules: ['security', 'performance', 'style'],
        autoFix: true,
      },
    });

    console.log(`📋 Task: ${task.type}`);
    console.log(`   ID: ${task.id}`);
    console.log(`   Status: ${task.status}`);
    
    if (task.status === 'completed' && task.outputs) {
      console.log('\n✅ Results:');
      console.log(JSON.stringify(task.outputs, null, 2));
    } else if (task.status === 'failed') {
      console.log(`\n❌ Error: ${task.error}`);
    }

    if (task.completedAt) {
      const duration = task.completedAt.getTime() - task.createdAt.getTime();
      console.log(`\n⏱️  Duration: ${(duration / 1000).toFixed(2)}s`);
    }
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
  }
}

/**
 * Main function - run all examples
 */
async function main() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║           watsonx Integration Examples                     ║');
  console.log('║     AI-Powered Development with IBM watsonx                ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  try {
    // Run examples
    await aiCodeSuggestions();
    await aiCodeReview();
    await comprehensiveAnalysis();
    await workflowAutomation();
    await aiAgentExecution();
    await automationTask();

    console.log('\n✅ All examples completed!\n');
  } catch (error) {
    console.error('\n❌ Example failed:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export {
  aiCodeSuggestions,
  aiCodeReview,
  comprehensiveAnalysis,
  workflowAutomation,
  aiAgentExecution,
  automationTask,
};

// Made with Bob
