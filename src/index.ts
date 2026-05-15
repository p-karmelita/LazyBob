/**
 * LazyBob - AI-Powered Development Accelerator
 * Main entry point
 */

import { logger } from './utils/logger.js';
import { getConfig } from './utils/config.js';
import { createBobClient } from './core/bob-integration/index.js';

/**
 * Main application entry point
 */
export async function main(): Promise<void> {
  try {
    logger.info('🚀 LazyBob starting...');

    // Load configuration
    const config = getConfig();
    logger.info('Configuration loaded successfully');

    // Initialize Bob client
    const bobClient = createBobClient({
      apiKey: config.bob.apiKey,
      teamId: config.bob.teamId,
      endpoint: config.bob.endpoint,
    });

    // Check Bob health
    const isHealthy = await bobClient.checkHealth();
    if (!isHealthy) {
      logger.error('Bob health check failed');
      process.exit(1);
    }

    logger.info('✅ LazyBob initialized successfully');
    const bobcoinUsage = bobClient.getBobcoinUsage();
    logger.info('Bobcoin usage', {
      used: bobcoinUsage.used,
      remaining: bobcoinUsage.remaining,
      percentage: bobcoinUsage.percentage,
    });

    // Display welcome message
    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                                                            ║');
    console.log('║                  🤖 LazyBob v1.0.0                         ║');
    console.log('║         AI-Powered Development Accelerator                 ║');
    console.log('║                                                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    logger.info('Ready to accelerate your development! 🚀');
    logger.info('Use CLI commands or Bob IDE to interact with LazyBob');

  } catch (error) {
    logger.error('Failed to start LazyBob', {
      error: error instanceof Error ? error.message : String(error),
    });
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

// Made with Bob
