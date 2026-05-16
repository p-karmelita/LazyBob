#!/usr/bin/env node
/**
 * Progress Indicator Demo
 * 
 * This script demonstrates the various progress indicator styles
 * available in LazyBob.
 */

import { createProgress, withProgress } from '../src/utils/progress.js';

/**
 * Demo: Progress bar
 */
async function demoProgressBar() {
  console.log('\n=== Progress Bar Demo ===\n');
  
  const progress = createProgress({
    total: 50,
    style: 'bar',
    message: 'Processing items',
  });

  progress.start();

  for (let i = 0; i < 50; i++) {
    await sleep(50);
    progress.update(i + 1, `Processing item ${i + 1}`);
  }

  progress.complete('✓ All items processed');
}

/**
 * Demo: Spinner
 */
async function demoSpinner() {
  console.log('\n=== Spinner Demo ===\n');
  
  const progress = createProgress({
    style: 'spinner',
    message: 'Loading data',
  });

  progress.start();
  await sleep(3000);
  progress.complete('✓ Data loaded');
}

/**
 * Demo: Dots
 */
async function demoDots() {
  console.log('\n=== Dots Demo ===\n');
  
  const progress = createProgress({
    style: 'dots',
    message: 'Connecting to server',
  });

  progress.start();
  await sleep(2000);
  progress.complete('✓ Connected');
}

/**
 * Demo: withProgress wrapper
 */
async function demoWithProgress() {
  console.log('\n=== withProgress Wrapper Demo ===\n');
  
  const result = await withProgress(
    'Analyzing files',
    async (progress) => {
      const files = ['file1.ts', 'file2.ts', 'file3.ts', 'file4.ts', 'file5.ts'];
      progress.setTotal(files.length);
      
      const results = [];
      for (let i = 0; i < files.length; i++) {
        await sleep(500);
        progress.update(i + 1, `Analyzing ${files[i]}`);
        results.push(`Analyzed ${files[i]}`);
      }
      
      return results;
    },
    { style: 'bar' }
  );
  
  console.log('Results:', result);
}

/**
 * Demo: Multiple progress indicators
 */
async function demoMultipleProgress() {
  console.log('\n=== Multiple Progress Indicators Demo ===\n');
  
  // Phase 1: Finding files
  const findProgress = createProgress({
    style: 'spinner',
    message: 'Finding files...',
  });
  findProgress.start();
  await sleep(1000);
  findProgress.complete('✓ Found 25 files');
  
  // Phase 2: Analyzing files
  const analyzeProgress = createProgress({
    total: 25,
    style: 'bar',
    message: 'Analyzing files',
  });
  analyzeProgress.start();
  
  for (let i = 0; i < 25; i++) {
    await sleep(100);
    analyzeProgress.update(i + 1);
  }
  
  analyzeProgress.complete('✓ Analysis complete');
  
  // Phase 3: Generating report
  const reportProgress = createProgress({
    style: 'spinner',
    message: 'Generating report...',
  });
  reportProgress.start();
  await sleep(1500);
  reportProgress.complete('✓ Report generated');
}

/**
 * Demo: Progress with ETA
 */
async function demoProgressWithETA() {
  console.log('\n=== Progress with ETA Demo ===\n');
  
  const progress = createProgress({
    total: 100,
    style: 'bar',
    message: 'Processing large dataset',
    showEta: true,
  });

  progress.start();

  for (let i = 0; i < 100; i++) {
    await sleep(50);
    progress.update(i + 1);
  }

  progress.complete('✓ Dataset processed');
}

/**
 * Helper: Sleep function
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main demo runner
 */
async function main() {
  console.log('LazyBob Progress Indicators Demo');
  console.log('=================================');
  
  try {
    await demoProgressBar();
    await sleep(500);
    
    await demoSpinner();
    await sleep(500);
    
    await demoDots();
    await sleep(500);
    
    await demoWithProgress();
    await sleep(500);
    
    await demoMultipleProgress();
    await sleep(500);
    
    await demoProgressWithETA();
    
    console.log('\n=== Demo Complete ===\n');
  } catch (error) {
    console.error('Demo failed:', error);
    process.exit(1);
  }
}

// Run the demo
main();

// Made with Bob
