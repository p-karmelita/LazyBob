/**
 * LazyBob Dashboard API Server
 * Provides REST API endpoints for the dashboard
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';
import { getConfig } from '../utils/config.js';
import { createBobClient } from '../core/bob-integration/index.js';
import { analyzeCode } from '../core/code-analyzer/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DashboardServer {
  private app: Express;
  private port: number;
  private bobClient: any;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    // CORS
    this.app.use(cors());
    
    // JSON parsing
    this.app.use(express.json());
    
    // Static files (dashboard)
    const dashboardPath = path.join(__dirname, '../../dashboard');
    this.app.use(express.static(dashboardPath));
    
    // Logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`);
      next();
    });
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/api/health', this.handleHealth.bind(this));
    
    // Dashboard stats
    this.app.get('/api/stats', this.handleStats.bind(this));
    
    // Bob usage
    this.app.get('/api/bob/usage', this.handleBobUsage.bind(this));
    
    // Code analysis
    this.app.post('/api/analyze', this.handleAnalyze.bind(this));
    
    // Workflows
    this.app.get('/api/workflows', this.handleGetWorkflows.bind(this));
    this.app.post('/api/workflows', this.handleCreateWorkflow.bind(this));
    this.app.post('/api/workflows/:id/run', this.handleRunWorkflow.bind(this));
    
    // Activity feed
    this.app.get('/api/activity', this.handleActivity.bind(this));
    
    // Chat endpoint
    this.app.post('/api/chat', this.handleChat.bind(this));
    
    // Serve dashboard HTML for all other routes
    this.app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../../dashboard/index.html'));
    });
  }

  private async handleHealth(req: Request, res: Response): Promise<void> {
    try {
      const config = getConfig();
      const bobClient = createBobClient({
        apiKey: config.bob.apiKey,
        teamId: config.bob.teamId,
        endpoint: config.bob.endpoint,
      });

      const isHealthy = await bobClient.checkHealth();
      
      res.json({
        status: isHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async handleStats(req: Request, res: Response): Promise<void> {
    try {
      // Get project statistics
      const stats = {
        files: 156,
        lines: 7842,
        functions: 234,
        classes: 45,
        lastAnalysis: new Date().toISOString()
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async handleBobUsage(req: Request, res: Response): Promise<void> {
    try {
      const config = getConfig();
      const bobClient = createBobClient({
        apiKey: config.bob.apiKey,
        teamId: config.bob.teamId,
        endpoint: config.bob.endpoint,
      });

      const usage = bobClient.getBobcoinUsage();
      
      res.json({
        used: usage.used,
        total: usage.total,
        remaining: usage.remaining,
        percentage: usage.percentage,
        history: [
          { date: '2024-05-16', mode: 'Code', request: 'Analyze codebase', coins: 1, status: 'success' },
          { date: '2024-05-16', mode: 'Ask', request: 'Explain function', coins: 0.5, status: 'success' },
          { date: '2024-05-15', mode: 'Advanced', request: 'Complex refactoring', coins: 2, status: 'success' },
        ]
      });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async handleAnalyze(req: Request, res: Response): Promise<void> {
    try {
      const { path: targetPath } = req.body;
      
      if (!targetPath) {
        res.status(400).json({ error: 'Path is required' });
        return;
      }

      logger.info(`Analyzing code at: ${targetPath}`);
      const result = await analyzeCode(targetPath);
      
      res.json({
        success: true,
        result,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async handleGetWorkflows(req: Request, res: Response): Promise<void> {
    try {
      const workflows = [
        {
          id: '1',
          name: 'Code Review',
          description: 'Automated code review with AI analysis',
          steps: ['analyze', 'review', 'report'],
          runs: 24,
          avgDuration: '2.5 min',
          lastRun: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Documentation',
          description: 'Generate comprehensive documentation',
          steps: ['scan', 'generate', 'format'],
          runs: 18,
          avgDuration: '1.8 min',
          lastRun: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Testing',
          description: 'Create and run test suites',
          steps: ['analyze', 'generate-tests', 'run'],
          runs: 32,
          avgDuration: '3.2 min',
          lastRun: new Date().toISOString()
        }
      ];

      res.json(workflows);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async handleCreateWorkflow(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, steps } = req.body;
      
      if (!name || !steps) {
        res.status(400).json({ error: 'Name and steps are required' });
        return;
      }

      const workflow = {
        id: Date.now().toString(),
        name,
        description,
        steps,
        runs: 0,
        avgDuration: '0 min',
        created: new Date().toISOString()
      };

      logger.info(`Created workflow: ${name}`);
      res.json(workflow);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async handleRunWorkflow(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { params } = req.body;

      logger.info(`Running workflow: ${id}`);
      
      // Simulate workflow execution
      const result = {
        workflowId: id,
        status: 'running',
        startTime: new Date().toISOString(),
        steps: []
      };

      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async handleActivity(req: Request, res: Response): Promise<void> {
    try {
      const activities = [
        {
          icon: 'fa-code',
          iconColor: 'blue',
          title: 'Code analysis completed',
          time: '2 minutes ago',
          details: 'Analyzed 156 files'
        },
        {
          icon: 'fa-brain',
          iconColor: 'purple',
          title: 'AI suggestion generated',
          time: '15 minutes ago',
          details: 'Performance optimization suggestions'
        },
        {
          icon: 'fa-check-circle',
          iconColor: 'green',
          title: 'Code review passed',
          time: '1 hour ago',
          details: 'All checks passed successfully'
        },
        {
          icon: 'fa-file-alt',
          iconColor: 'orange',
          title: 'Documentation updated',
          time: '2 hours ago',
          details: 'API documentation regenerated'
        }
      ];

      res.json(activities);
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async handleChat(req: Request, res: Response): Promise<void> {
    try {
      const { message, context } = req.body;
      
      if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      logger.info(`Chat message: ${message}`);
      
      // Knowledge base for context-aware responses
      const knowledgeBase: Record<string, string> = {
        analyze: 'To analyze your code, click the "Run Analysis" button in the Code Analysis section, enter the path (e.g., ./src), and review the results.',
        workflow: 'To create a workflow, go to Workflows section, click "Create Workflow", enter name, description, and steps (comma-separated).',
        report: 'To generate a report, navigate to Reports section, click "Generate Report", select type (1-4), and the file will download automatically.',
        bobcoin: 'To monitor Bobcoin usage, go to Bob Usage section to view balance, history, and usage trends.',
        help: 'I can help with: Code Analysis, Workflows, Reports, Bobcoin Usage, and Dashboard Features. What would you like to know?'
      };

      // Simple keyword matching
      const lowerMessage = message.toLowerCase();
      let response = 'I can help you with LazyBob features. Try asking about: code analysis, workflows, reports, or Bobcoin usage.';
      
      for (const [key, value] of Object.entries(knowledgeBase)) {
        if (lowerMessage.includes(key)) {
          response = value;
          break;
        }
      }

      res.json({
        response,
        timestamp: new Date().toISOString(),
        context: context || 'general'
      });
    } catch (error) {
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  public async start(): Promise<void> {
    return new Promise((resolve) => {
      this.app.listen(this.port, () => {
        logger.info(`🚀 Dashboard server running on http://localhost:${this.port}`);
        logger.info(`📊 Dashboard available at http://localhost:${this.port}`);
        resolve();
      });
    });
  }
}

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new DashboardServer(3000);
  server.start().catch((error) => {
    logger.error('Failed to start server', { error });
    process.exit(1);
  });
}

// Made with Bob