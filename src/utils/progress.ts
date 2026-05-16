/**
 * Progress indicator utilities for LazyBob
 */

import chalk from 'chalk';

export type ProgressStyle = 'bar' | 'spinner' | 'dots' | 'simple';

/**
 * Progress indicator configuration
 */
export interface ProgressConfig {
  total?: number;
  style?: ProgressStyle;
  width?: number;
  showPercentage?: boolean;
  showCount?: boolean;
  showEta?: boolean;
  message?: string;
}

/**
 * Progress state
 */
interface ProgressState {
  current: number;
  total: number;
  startTime: number;
  lastUpdate: number;
  message: string;
}

/**
 * Spinner frames
 */
const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const DOTS_FRAMES = ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'];

/**
 * Progress indicator class
 */
export class ProgressIndicator {
  private config: Required<ProgressConfig>;
  private state: ProgressState;
  private interval: NodeJS.Timeout | null = null;
  private frameIndex = 0;
  private isActive = false;

  constructor(config: ProgressConfig = {}) {
    this.config = {
      total: config.total || 100,
      style: config.style || 'bar',
      width: config.width || 40,
      showPercentage: config.showPercentage ?? true,
      showCount: config.showCount ?? true,
      showEta: config.showEta ?? true,
      message: config.message || 'Processing',
    };

    this.state = {
      current: 0,
      total: this.config.total,
      startTime: Date.now(),
      lastUpdate: Date.now(),
      message: this.config.message,
    };
  }

  /**
   * Start the progress indicator
   */
  start(message?: string): void {
    if (this.isActive) return;

    this.isActive = true;
    this.state.startTime = Date.now();
    this.state.lastUpdate = Date.now();
    
    if (message) {
      this.state.message = message;
    }

    if (this.config.style === 'spinner' || this.config.style === 'dots') {
      this.interval = setInterval(() => {
        this.render();
      }, 80);
    }

    this.render();
  }

  /**
   * Update progress
   */
  update(current: number, message?: string): void {
    if (!this.isActive) return;

    this.state.current = Math.min(current, this.state.total);
    this.state.lastUpdate = Date.now();
    
    if (message) {
      this.state.message = message;
    }

    this.render();
  }

  /**
   * Increment progress
   */
  increment(amount = 1, message?: string): void {
    this.update(this.state.current + amount, message);
  }

  /**
   * Set total
   */
  setTotal(total: number): void {
    this.state.total = total;
    this.config.total = total;
  }

  /**
   * Complete the progress indicator
   */
  complete(message?: string): void {
    if (!this.isActive) return;

    this.state.current = this.state.total;
    
    if (message) {
      this.state.message = message;
    }

    this.render();
    this.stop();
    
    // Print newline after completion
    process.stdout.write('\n');
  }

  /**
   * Stop the progress indicator
   */
  stop(): void {
    if (!this.isActive) return;

    this.isActive = false;
    
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  /**
   * Render the progress indicator
   */
  private render(): void {
    if (!this.isActive) return;

    const output = this.buildOutput();
    
    // Clear line and write output
    process.stdout.write('\r\x1b[K' + output);
  }

  /**
   * Build output string
   */
  private buildOutput(): string {
    const parts: string[] = [];

    // Add spinner/dots if applicable
    if (this.config.style === 'spinner') {
      const frame = SPINNER_FRAMES[this.frameIndex % SPINNER_FRAMES.length];
      parts.push(chalk.cyan(frame));
      this.frameIndex++;
    } else if (this.config.style === 'dots') {
      const frame = DOTS_FRAMES[this.frameIndex % DOTS_FRAMES.length];
      parts.push(chalk.cyan(frame));
      this.frameIndex++;
    }

    // Add message
    parts.push(chalk.bold(this.state.message));

    // Add progress bar
    if (this.config.style === 'bar') {
      parts.push(this.buildProgressBar());
    }

    // Add percentage
    if (this.config.showPercentage) {
      const percentage = Math.round((this.state.current / this.state.total) * 100);
      parts.push(chalk.cyan(`${percentage}%`));
    }

    // Add count
    if (this.config.showCount) {
      parts.push(chalk.gray(`(${this.state.current}/${this.state.total})`));
    }

    // Add ETA
    if (this.config.showEta && this.state.current > 0) {
      const eta = this.calculateETA();
      if (eta) {
        parts.push(chalk.gray(`ETA: ${eta}`));
      }
    }

    return parts.join(' ');
  }

  /**
   * Build progress bar
   */
  private buildProgressBar(): string {
    const percentage = this.state.current / this.state.total;
    const filled = Math.round(this.config.width * percentage);
    const empty = this.config.width - filled;

    const filledBar = chalk.green('█'.repeat(filled));
    const emptyBar = chalk.gray('░'.repeat(empty));

    return `[${filledBar}${emptyBar}]`;
  }

  /**
   * Calculate estimated time remaining
   */
  private calculateETA(): string | null {
    const elapsed = Date.now() - this.state.startTime;
    const rate = this.state.current / elapsed;
    
    if (rate === 0) return null;

    const remaining = (this.state.total - this.state.current) / rate;
    
    if (remaining < 1000) {
      return '<1s';
    } else if (remaining < 60000) {
      return `${Math.round(remaining / 1000)}s`;
    } else if (remaining < 3600000) {
      return `${Math.round(remaining / 60000)}m`;
    } else {
      return `${Math.round(remaining / 3600000)}h`;
    }
  }
}

/**
 * Create a progress indicator
 */
export function createProgress(config?: ProgressConfig): ProgressIndicator {
  return new ProgressIndicator(config);
}

/**
 * Simple progress wrapper for async operations
 */
export async function withProgress<T>(
  message: string,
  operation: (progress: ProgressIndicator) => Promise<T>,
  config?: ProgressConfig
): Promise<T> {
  const progress = createProgress({ ...config, message });
  progress.start();

  try {
    const result = await operation(progress);
    progress.complete('✓ Done');
    return result;
  } catch (error) {
    progress.stop();
    process.stdout.write('\n');
    throw error;
  }
}

// Made with Bob