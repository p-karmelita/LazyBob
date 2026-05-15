/**
 * Configuration management for LazyBob
 */

import { config as dotenvConfig } from 'dotenv';
import { ConfigSchema, type Config } from '../types/index.js';
import { ConfigError } from './errors.js';
import { logger } from './logger.js';

/**
 * Load environment variables from .env file
 */
export function loadEnv(): void {
  const result = dotenvConfig();
  
  if (result.error) {
    logger.warn('No .env file found, using environment variables');
  } else {
    logger.debug('Loaded environment variables from .env file');
  }
}

/**
 * Load and validate configuration
 */
export function loadConfig(): Config {
  // Load environment variables
  loadEnv();

  // Check feature flags first
  const enableWatsonxAI = process.env.ENABLE_WATSONX_AI === 'true';
  const enableWatsonxOrchestrate = process.env.ENABLE_WATSONX_ORCHESTRATE === 'true';

  // Build configuration object
  const config = {
    bob: {
      apiKey: process.env.BOB_API_KEY || '',
      teamId: process.env.BOB_TEAM_ID || '',
      endpoint: process.env.BOB_ENDPOINT,
    },
    watsonx: {
      ai: enableWatsonxAI && process.env.WATSONX_API_KEY
        ? {
            apiKey: process.env.WATSONX_API_KEY,
            projectId: process.env.WATSONX_PROJECT_ID || '',
            endpoint: process.env.WATSONX_ENDPOINT || 'https://us-south.ml.cloud.ibm.com',
          }
        : undefined,
      orchestrate: enableWatsonxOrchestrate && process.env.ORCHESTRATE_API_KEY
        ? {
            apiKey: process.env.ORCHESTRATE_API_KEY,
            endpoint: process.env.ORCHESTRATE_ENDPOINT || '',
          }
        : undefined,
    },
    features: {
      enableWatsonxAI,
      enableWatsonxOrchestrate,
      enableAdvancedAnalysis: process.env.ENABLE_ADVANCED_ANALYSIS !== 'false',
      enableAutoDocumentation: process.env.ENABLE_AUTO_DOCUMENTATION !== 'false',
    },
    analysis: {
      maxFileSizeMB: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
      timeoutMs: parseInt(process.env.ANALYSIS_TIMEOUT_MS || '30000', 10),
      maxConcurrent: parseInt(process.env.MAX_CONCURRENT_ANALYSES || '5', 10),
    },
  };

  // Validate configuration
  try {
    const validated = ConfigSchema.parse(config);
    logger.debug('Configuration loaded and validated successfully');
    return validated;
  } catch (error) {
    logger.error('Configuration validation failed', {
      error: error instanceof Error ? error.message : String(error),
      config: JSON.stringify(config, null, 2),
    });
    throw new ConfigError('Invalid configuration', {
      error: error instanceof Error ? error.message : String(error),
      details: error,
    });
  }
}

/**
 * Validate required credentials
 */
export function validateCredentials(config: Config): void {
  const errors: string[] = [];

  // Check Bob credentials
  if (!config.bob.apiKey) {
    errors.push('BOB_API_KEY is required');
  }
  if (!config.bob.teamId) {
    errors.push('BOB_TEAM_ID is required');
  }

  // Check watsonx.ai credentials if enabled
  if (config.features.enableWatsonxAI) {
    if (!config.watsonx?.ai?.apiKey) {
      errors.push('WATSONX_API_KEY is required when watsonx.ai is enabled');
    }
    if (!config.watsonx?.ai?.projectId) {
      errors.push('WATSONX_PROJECT_ID is required when watsonx.ai is enabled');
    }
  }

  // Check watsonx Orchestrate credentials if enabled
  if (config.features.enableWatsonxOrchestrate) {
    if (!config.watsonx?.orchestrate?.apiKey) {
      errors.push('ORCHESTRATE_API_KEY is required when watsonx Orchestrate is enabled');
    }
    if (!config.watsonx?.orchestrate?.endpoint) {
      errors.push('ORCHESTRATE_ENDPOINT is required when watsonx Orchestrate is enabled');
    }
  }

  if (errors.length > 0) {
    throw new ConfigError('Missing required credentials', {
      errors,
      hint: 'Check your .env file or environment variables',
    });
  }

  logger.info('All required credentials validated');
}

/**
 * Get configuration with validation
 */
export function getConfig(): Config {
  const config = loadConfig();
  validateCredentials(config);
  return config;
}

/**
 * Check if watsonx.ai is available
 */
export function isWatsonxAIAvailable(config: Config): boolean {
  return (
    config.features.enableWatsonxAI &&
    !!config.watsonx?.ai?.apiKey &&
    !!config.watsonx?.ai?.projectId
  );
}

/**
 * Check if watsonx Orchestrate is available
 */
export function isWatsonxOrchestrateAvailable(config: Config): boolean {
  return (
    config.features.enableWatsonxOrchestrate &&
    !!config.watsonx?.orchestrate?.apiKey &&
    !!config.watsonx?.orchestrate?.endpoint
  );
}

// Made with Bob
