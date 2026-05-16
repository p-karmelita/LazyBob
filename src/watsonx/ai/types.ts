/**
 * Type definitions for watsonx.ai integration
 */

/**
 * watsonx.ai client configuration
 */
export interface WatsonxAIConfig {
  apiKey: string;
  projectId: string;
  endpoint?: string;
  version?: string;
}

/**
 * Model parameters for text generation
 */
export interface ModelParameters {
  decoding_method?: 'greedy' | 'sample';
  max_new_tokens?: number;
  min_new_tokens?: number;
  temperature?: number;
  top_k?: number;
  top_p?: number;
  repetition_penalty?: number;
  stop_sequences?: string[];
}

/**
 * Text generation request
 */
export interface GenerationRequest {
  input: string;
  modelId?: string;
  parameters?: ModelParameters;
  projectId?: string;
}

/**
 * Text generation response
 */
export interface GenerationResponse {
  model_id: string;
  created_at: string;
  results: Array<{
    generated_text: string;
    generated_token_count: number;
    input_token_count: number;
    stop_reason: string;
  }>;
}

/**
 * Code suggestion request
 */
export interface CodeSuggestionRequest {
  code: string;
  language: string;
  context?: string;
  task: 'improve' | 'explain' | 'fix' | 'optimize' | 'document';
}

/**
 * Code suggestion response
 */
export interface CodeSuggestionResponse {
  suggestion: string;
  confidence: number;
  reasoning: string;
  improvements: string[];
}

/**
 * Code review request
 */
export interface CodeReviewRequest {
  code: string;
  language: string;
  filePath?: string;
}

/**
 * Code review issue
 */
export interface CodeReviewIssue {
  severity: 'error' | 'warning' | 'info';
  line: number;
  message: string;
  suggestion?: string;
  category: 'security' | 'performance' | 'style' | 'bug' | 'maintainability';
}

/**
 * Code review response
 */
export interface CodeReviewResponse {
  issues: CodeReviewIssue[];
  overallScore: number;
  summary: string;
  recommendations: string[];
}

/**
 * Available Granite models
 */
export enum GraniteModel {
  CODE_8B = 'ibm/granite-8b-code-instruct',
  CODE_20B = 'ibm/granite-20b-code-instruct',
  CODE_34B = 'ibm/granite-34b-code-instruct',
  CHAT_8B = 'ibm/granite-8b-chat',
  CHAT_13B = 'ibm/granite-13b-chat-v2',
}

/**
 * Model capabilities
 */
export interface ModelCapabilities {
  maxTokens: number;
  supportsCodeGeneration: boolean;
  supportsChat: boolean;
  languages: string[];
}

/**
 * Token usage information
 */
export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost?: number;
}

/**
 * AI-powered analysis result
 */
export interface AIAnalysisResult {
  summary: string;
  insights: string[];
  suggestions: CodeSuggestionResponse[];
  complexity: {
    score: number;
    factors: string[];
  };
  quality: {
    score: number;
    issues: CodeReviewIssue[];
  };
  tokenUsage: TokenUsage;
}

// Made with Bob
