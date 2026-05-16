/**
 * Type definitions for watsonx Orchestrate integration
 */

/**
 * Orchestrate client configuration
 */
export interface OrchestrateConfig {
  apiKey: string;
  endpoint: string;
  instanceId?: string;
}

/**
 * Skill definition
 */
export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  parameters: SkillParameter[];
}

/**
 * Skill parameter
 */
export interface SkillParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  default?: any;
}

/**
 * Workflow definition
 */
export interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  triggers?: WorkflowTrigger[];
}

/**
 * Workflow step
 */
export interface WorkflowStep {
  id: string;
  name: string;
  skillId: string;
  inputs: Record<string, any>;
  outputs?: Record<string, string>;
  condition?: string;
  onError?: 'continue' | 'stop' | 'retry';
}

/**
 * Workflow trigger
 */
export interface WorkflowTrigger {
  type: 'schedule' | 'event' | 'manual';
  config: Record<string, any>;
}

/**
 * Workflow execution request
 */
export interface WorkflowExecutionRequest {
  workflowId: string;
  inputs?: Record<string, any>;
  async?: boolean;
}

/**
 * Workflow execution response
 */
export interface WorkflowExecutionResponse {
  executionId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  outputs?: Record<string, any>;
  error?: string;
  steps: StepExecution[];
}

/**
 * Step execution details
 */
export interface StepExecution {
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startTime?: Date;
  endTime?: Date;
  inputs: Record<string, any>;
  outputs?: Record<string, any>;
  error?: string;
}

/**
 * Development workflow templates
 */
export enum DevWorkflowTemplate {
  CODE_REVIEW = 'code-review-workflow',
  DOCUMENTATION = 'documentation-workflow',
  TESTING = 'testing-workflow',
  DEPLOYMENT = 'deployment-workflow',
  REFACTORING = 'refactoring-workflow',
}

/**
 * Automation task
 */
export interface AutomationTask {
  id: string;
  type: 'code-review' | 'documentation' | 'testing' | 'refactoring' | 'deployment';
  status: 'pending' | 'running' | 'completed' | 'failed';
  inputs: Record<string, any>;
  outputs?: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

/**
 * Agent configuration
 */
export interface AgentConfig {
  name: string;
  description: string;
  skills: string[];
  autonomy: 'low' | 'medium' | 'high';
  maxIterations?: number;
}

/**
 * Agent execution result
 */
export interface AgentExecutionResult {
  success: boolean;
  iterations: number;
  actions: AgentAction[];
  finalOutput: any;
  reasoning: string[];
}

/**
 * Agent action
 */
export interface AgentAction {
  skillId: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  reasoning: string;
  timestamp: Date;
}

// Made with Bob
