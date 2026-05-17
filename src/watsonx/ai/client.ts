/**
 * watsonx.ai Client Implementation
 * Provides AI-powered code analysis and suggestions using IBM Granite models
 */

import { logger } from '../../utils/logger.js';
import { AppError } from '../../utils/errors.js';
import {
  GraniteModel,
  type WatsonxAIConfig,
  type GenerationRequest,
  type GenerationResponse,
  type CodeSuggestionRequest,
  type CodeSuggestionResponse,
  type CodeReviewRequest,
  type CodeReviewResponse,
  type AIAnalysisResult,
  type ModelParameters,
} from './types.js';

/**
 * watsonx.ai Client
 */
export class WatsonxAIClient {
  private readonly config: WatsonxAIConfig;
  private readonly defaultModel: GraniteModel;
  private readonly endpoint: string;

  constructor(config: WatsonxAIConfig) {
    this.config = config;
    this.defaultModel = GraniteModel.CODE_20B;
    this.endpoint = config.endpoint || 'https://us-south.ml.cloud.ibm.com';
    
    logger.info('watsonx.ai client initialized', {
      endpoint: this.endpoint,
      projectId: config.projectId,
    });
  }

  /**
   * Generate text using watsonx.ai
   */
  async generate(request: GenerationRequest): Promise<GenerationResponse> {
    const modelId = request.modelId || this.defaultModel;
    const url = `${this.endpoint}/ml/v1/text/generation?version=${this.config.version || '2023-05-29'}`;

    try {
      logger.debug('Generating text with watsonx.ai', {
        modelId,
        inputLength: request.input.length,
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          model_id: modelId,
          input: request.input,
          parameters: request.parameters || this.getDefaultParameters(),
          project_id: request.projectId || this.config.projectId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new AppError(
          `watsonx.ai generation failed: ${response.status} ${response.statusText}`,
          'WATSONX_API_ERROR',
          { status: response.status, body: errorText }
        );
      }

      const result = await response.json() as GenerationResponse;
      
      logger.info('watsonx.ai generation completed', {
        modelId,
        tokensGenerated: result.results[0]?.generated_token_count,
      });

      return result;
    } catch (error) {
      logger.error('watsonx.ai generation failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Get AI-powered code suggestions
   */
  async getCodeSuggestion(request: CodeSuggestionRequest): Promise<CodeSuggestionResponse> {
    const prompt = this.buildCodeSuggestionPrompt(request);
    
    const response = await this.generate({
      input: prompt,
      modelId: GraniteModel.CODE_20B,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9,
      },
    });

    return this.parseCodeSuggestion(response, request);
  }

  /**
   * Perform AI-powered code review
   */
  async reviewCode(request: CodeReviewRequest): Promise<CodeReviewResponse> {
    const prompt = this.buildCodeReviewPrompt(request);
    
    const response = await this.generate({
      input: prompt,
      modelId: GraniteModel.CODE_20B,
      parameters: {
        max_new_tokens: 1500,
        temperature: 0.5,
        top_p: 0.95,
      },
    });

    return this.parseCodeReview(response);
  }

  /**
   * Perform comprehensive AI analysis
   */
  async analyzeCode(code: string, language: string, context?: string): Promise<AIAnalysisResult> {
    const prompt = `Analyze the following ${language} code and provide:
1. A brief summary
2. Key insights about the code structure and design
3. Suggestions for improvements
4. Complexity assessment
5. Quality assessment with specific issues

${context ? `Context: ${context}\n\n` : ''}Code:
\`\`\`${language}
${code}
\`\`\`

Provide a detailed analysis in JSON format.`;

    const response = await this.generate({
      input: prompt,
      modelId: GraniteModel.CODE_20B,
      parameters: {
        max_new_tokens: 2000,
        temperature: 0.6,
      },
    });

    return this.parseAIAnalysis(response, code);
  }

  /**
   * Build code suggestion prompt
   */
  private buildCodeSuggestionPrompt(request: CodeSuggestionRequest): string {
    const taskPrompts = {
      improve: 'Improve the following code by making it more efficient, readable, and maintainable',
      explain: 'Explain what the following code does in detail',
      fix: 'Identify and fix any bugs or issues in the following code',
      optimize: 'Optimize the following code for better performance',
      document: 'Add comprehensive documentation and comments to the following code',
    };

    return `${taskPrompts[request.task]}:

Language: ${request.language}
${request.context ? `Context: ${request.context}\n` : ''}
Code:
\`\`\`${request.language}
${request.code}
\`\`\`

Provide your ${request.task === 'explain' ? 'explanation' : 'improved code'} with reasoning.`;
  }

  /**
   * Build code review prompt
   */
  private buildCodeReviewPrompt(request: CodeReviewRequest): string {
    return `Perform a comprehensive code review of the following ${request.language} code:

${request.filePath ? `File: ${request.filePath}\n` : ''}
Code:
\`\`\`${request.language}
${request.code}
\`\`\`

Review for:
1. Security vulnerabilities
2. Performance issues
3. Code style and best practices
4. Potential bugs
5. Maintainability concerns

Provide specific issues with line numbers, severity levels, and suggestions for fixes.`;
  }

  /**
   * Parse code suggestion response
   */
  private parseCodeSuggestion(
    response: GenerationResponse,
    _request: CodeSuggestionRequest
  ): CodeSuggestionResponse {
    const generatedText = response.results[0]?.generated_text || '';
    
    // Try to parse as JSON first (for structured responses)
    try {
      const parsed = JSON.parse(generatedText);
      if (parsed.suggestion !== undefined) {
        return {
          suggestion: parsed.suggestion || '',
          confidence: parsed.confidence || 0.85,
          reasoning: parsed.reasoning || '',
          improvements: parsed.improvements || [],
        };
      }
    } catch {
      // Not JSON, continue with text parsing
    }
    
    // Extract suggestion and reasoning from the response
    const lines = generatedText.split('\n');
    const suggestion = lines.slice(0, -2).join('\n').trim();
    const reasoning = lines.slice(-2).join('\n').trim();

    return {
      suggestion,
      confidence: 0.85, // Could be calculated based on model confidence
      reasoning,
      improvements: this.extractImprovements(generatedText),
    };
  }

  /**
   * Parse code review response
   */
  private parseCodeReview(response: GenerationResponse): CodeReviewResponse {
    const generatedText = response.results[0]?.generated_text || '';
    
    // Try to parse as JSON first (for structured responses)
    try {
      const parsed = JSON.parse(generatedText);
      if (parsed.issues && typeof parsed.overallScore === 'number') {
        return {
          issues: parsed.issues,
          overallScore: parsed.overallScore,
          summary: parsed.summary || this.extractSummary(generatedText),
          recommendations: parsed.recommendations || this.extractRecommendations(generatedText),
        };
      }
    } catch {
      // Not JSON, continue with text parsing
    }
    
    // Parse the review text to extract structured information
    const issues = this.extractIssues(generatedText);
    const overallScore = this.calculateOverallScore(issues);
    
    return {
      issues,
      overallScore,
      summary: this.extractSummary(generatedText),
      recommendations: this.extractRecommendations(generatedText),
    };
  }

  /**
   * Parse AI analysis response
   */
  private parseAIAnalysis(response: GenerationResponse, originalCode: string): AIAnalysisResult {
    const generatedText = response.results[0]?.generated_text || '';
    const result = response.results[0];
    
    return {
      summary: this.extractSummary(generatedText),
      insights: this.extractInsights(generatedText),
      suggestions: [],
      complexity: {
        score: this.estimateComplexity(originalCode),
        factors: this.extractComplexityFactors(generatedText),
      },
      quality: {
        score: 75, // Default score
        issues: this.extractIssues(generatedText),
      },
      tokenUsage: {
        inputTokens: result?.input_token_count || 0,
        outputTokens: result?.generated_token_count || 0,
        totalTokens: (result?.input_token_count || 0) + (result?.generated_token_count || 0),
      },
    };
  }

  /**
   * Extract improvements from generated text
   */
  private extractImprovements(text: string): string[] {
    const improvements: string[] = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.match(/^[-*]\s+/)) {
        improvements.push(line.replace(/^[-*]\s+/, '').trim());
      }
    }
    
    return improvements.length > 0 ? improvements : ['Code improved'];
  }

  /**
   * Extract issues from review text
   */
  private extractIssues(text: string): Array<{
    severity: 'error' | 'warning' | 'info';
    line: number;
    message: string;
    suggestion?: string;
    category: 'security' | 'performance' | 'style' | 'bug' | 'maintainability';
  }> {
    // Simple extraction - in production, use more sophisticated parsing
    const issues = [];
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('error') || line.includes('bug')) {
        issues.push({
          severity: 'error' as const,
          line: i + 1,
          message: line.trim(),
          category: 'bug' as const,
        });
      } else if (line.includes('warning') || line.includes('performance')) {
        issues.push({
          severity: 'warning' as const,
          line: i + 1,
          message: line.trim(),
          category: 'performance' as const,
        });
      }
    }
    
    return issues;
  }

  /**
   * Calculate overall score from issues
   */
  private calculateOverallScore(issues: any[]): number {
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    
    return Math.max(0, 100 - (errorCount * 10) - (warningCount * 5));
  }

  /**
   * Extract summary from text
   */
  private extractSummary(text: string): string {
    const lines = text.split('\n');
    return lines.slice(0, 3).join(' ').trim() || 'Analysis completed';
  }

  /**
   * Extract insights from text
   */
  private extractInsights(text: string): string[] {
    const insights: string[] = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.match(/^[-*]\s+/) || line.includes('insight')) {
        insights.push(line.replace(/^[-*]\s+/, '').trim());
      }
    }
    
    return insights.length > 0 ? insights : ['Code structure analyzed'];
  }

  /**
   * Extract recommendations from text
   */
  private extractRecommendations(text: string): string[] {
    const recommendations: string[] = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.includes('recommend') || line.includes('should')) {
        recommendations.push(line.trim());
      }
    }
    
    return recommendations.length > 0 ? recommendations : ['Follow best practices'];
  }

  /**
   * Extract complexity factors from text
   */
  private extractComplexityFactors(text: string): string[] {
    const factors: string[] = [];
    const keywords = ['nested', 'loop', 'condition', 'recursive', 'complex'];
    
    for (const keyword of keywords) {
      if (text.toLowerCase().includes(keyword)) {
        factors.push(keyword);
      }
    }
    
    return factors.length > 0 ? factors : ['standard complexity'];
  }

  /**
   * Estimate code complexity
   */
  private estimateComplexity(code: string): number {
    const lines = code.split('\n').length;
    const conditions = (code.match(/if|else|switch|case/g) || []).length;
    const loops = (code.match(/for|while|do/g) || []).length;
    
    return Math.min(100, (lines / 10) + (conditions * 5) + (loops * 5));
  }

  /**
   * Get default model parameters
   */
  private getDefaultParameters(): ModelParameters {
    return {
      decoding_method: 'greedy',
      max_new_tokens: 1000,
      min_new_tokens: 1,
      temperature: 0.7,
      top_k: 50,
      top_p: 1,
      repetition_penalty: 1.0,
    };
  }

  /**
   * Check if watsonx.ai is available
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.endpoint}/ml/v1/deployments?version=2023-05-29`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });
      
      return response.ok;
    } catch (error) {
      logger.warn('watsonx.ai health check failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }
}

/**
 * Create watsonx.ai client instance
 */
export function createWatsonxAIClient(config: WatsonxAIConfig): WatsonxAIClient {
  return new WatsonxAIClient(config);
}

// Made with Bob
