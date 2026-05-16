// ===== API Integration Module =====

// API Configuration
const API_CONFIG = {
    baseURL: window.location.origin + '/api',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
};

// API Client Class
class APIClient {
    constructor(config = API_CONFIG) {
        this.config = config;
        this.cache = new Map();
        this.cacheTimeout = 60000; // 1 minute
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.config.baseURL}${endpoint}`;
        const cacheKey = `${options.method || 'GET'}_${endpoint}`;
        
        // Check cache for GET requests
        if (!options.method || options.method === 'GET') {
            const cached = this.getFromCache(cacheKey);
            if (cached) return cached;
        }
        
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        try {
            const response = await this.fetchWithRetry(url, defaultOptions);
            const data = await response.json();
            
            // Cache successful GET requests
            if (defaultOptions.method === 'GET') {
                this.setCache(cacheKey, data);
            }
            
            return data;
        } catch (error) {
            console.error(`API request failed: ${endpoint}`, error);
            throw error;
        }
    }

    // Fetch with retry logic
    async fetchWithRetry(url, options, attempt = 1) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
            
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return response;
        } catch (error) {
            if (attempt < this.config.retryAttempts) {
                await this.delay(this.config.retryDelay * attempt);
                return this.fetchWithRetry(url, options, attempt + 1);
            }
            throw error;
        }
    }

    // Cache management
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    clearCache() {
        this.cache.clear();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Create API client instance
const api = new APIClient();

// ===== Code Analysis API =====
const CodeAnalysisAPI = {
    // Analyze codebase
    async analyze(path) {
        return api.request('/code/analyze', {
            method: 'POST',
            body: JSON.stringify({ path })
        });
    },

    // Get analysis results
    async getResults(analysisId) {
        return api.request(`/code/analysis/${analysisId}`);
    },

    // Get code metrics
    async getMetrics() {
        return api.request('/code/metrics');
    },

    // Get complexity report
    async getComplexity() {
        return api.request('/code/complexity');
    },

    // Get dependencies
    async getDependencies() {
        return api.request('/code/dependencies');
    }
};

// ===== Bob Integration API =====
const BobAPI = {
    // Get Bobcoin usage
    async getUsage() {
        return api.request('/bob/usage');
    },

    // Get usage history
    async getHistory(startDate, endDate) {
        const params = new URLSearchParams({ startDate, endDate });
        return api.request(`/bob/history?${params}`);
    },

    // Get current session
    async getCurrentSession() {
        return api.request('/bob/session/current');
    },

    // Export session
    async exportSession(sessionId) {
        return api.request(`/bob/session/${sessionId}/export`, {
            method: 'POST'
        });
    },

    // Get rate limit info
    async getRateLimitInfo() {
        return api.request('/bob/rate-limit');
    },

    // Check health
    async checkHealth() {
        return api.request('/bob/health');
    }
};

// ===== watsonx AI API =====
const WatsonxAPI = {
    // Get code suggestion
    async getCodeSuggestion(code, language, context) {
        return api.request('/watsonx/suggest', {
            method: 'POST',
            body: JSON.stringify({ code, language, context })
        });
    },

    // Review code
    async reviewCode(code, language, focusAreas) {
        return api.request('/watsonx/review', {
            method: 'POST',
            body: JSON.stringify({ code, language, focusAreas })
        });
    },

    // Analyze code
    async analyzeCode(code, language, analysisTypes) {
        return api.request('/watsonx/analyze', {
            method: 'POST',
            body: JSON.stringify({ code, language, analysisTypes })
        });
    },

    // Get AI statistics
    async getStats() {
        return api.request('/watsonx/stats');
    },

    // Get model usage
    async getModelUsage() {
        return api.request('/watsonx/models/usage');
    },

    // Get token consumption
    async getTokenConsumption() {
        return api.request('/watsonx/tokens');
    }
};

// ===== Workflow API =====
const WorkflowAPI = {
    // List workflows
    async list() {
        return api.request('/workflows');
    },

    // Get workflow details
    async get(workflowId) {
        return api.request(`/workflows/${workflowId}`);
    },

    // Create workflow
    async create(workflow) {
        return api.request('/workflows', {
            method: 'POST',
            body: JSON.stringify(workflow)
        });
    },

    // Execute workflow
    async execute(workflowId, inputs) {
        return api.request(`/workflows/${workflowId}/execute`, {
            method: 'POST',
            body: JSON.stringify(inputs)
        });
    },

    // Get execution status
    async getExecutionStatus(executionId) {
        return api.request(`/workflows/executions/${executionId}`);
    },

    // Get execution history
    async getHistory() {
        return api.request('/workflows/executions');
    },

    // Create dev workflow
    async createDevWorkflow(template, config) {
        return api.request('/workflows/dev', {
            method: 'POST',
            body: JSON.stringify({ template, config })
        });
    }
};

// ===== Reports API =====
const ReportsAPI = {
    // Generate report
    async generate(type, options) {
        return api.request('/reports/generate', {
            method: 'POST',
            body: JSON.stringify({ type, options })
        });
    },

    // List reports
    async list() {
        return api.request('/reports');
    },

    // Get report
    async get(reportId) {
        return api.request(`/reports/${reportId}`);
    },

    // Download report
    async download(reportId, format) {
        const response = await fetch(
            `${API_CONFIG.baseURL}/reports/${reportId}/download?format=${format}`
        );
        return response.blob();
    },

    // Export data
    async exportData(format, filters) {
        return api.request('/reports/export', {
            method: 'POST',
            body: JSON.stringify({ format, filters })
        });
    }
};

// ===== Dashboard API =====
const DashboardAPI = {
    // Get overview data
    async getOverview() {
        return api.request('/dashboard/overview');
    },

    // Get activity feed
    async getActivity(limit = 10) {
        return api.request(`/dashboard/activity?limit=${limit}`);
    },

    // Get statistics
    async getStats() {
        return api.request('/dashboard/stats');
    },

    // Get insights
    async getInsights() {
        return api.request('/dashboard/insights');
    }
};

// ===== Mock Data for Development =====
const MockAPI = {
    // Mock code analysis data
    getCodeAnalysis() {
        return {
            files: 156,
            lines: 7842,
            functions: 234,
            classes: 45,
            complexity: {
                average: 3.2,
                max: 12,
                distribution: {
                    low: 45,
                    medium: 28,
                    high: 12,
                    veryHigh: 5
                }
            },
            languages: {
                typescript: 45,
                javascript: 25,
                css: 15,
                html: 10,
                json: 5
            },
            issues: [
                {
                    severity: 'high',
                    type: 'Security',
                    message: 'Potential SQL injection vulnerability',
                    file: 'src/database/query.ts',
                    line: 45
                },
                {
                    severity: 'medium',
                    type: 'Performance',
                    message: 'Inefficient loop detected',
                    file: 'src/utils/processor.ts',
                    line: 128
                }
            ]
        };
    },

    // Mock Bob usage data
    getBobUsage() {
        return {
            used: 4,
            total: 40,
            percentage: 10,
            history: [
                { date: '2024-05-16', mode: 'Code', coins: 1, status: 'success' },
                { date: '2024-05-16', mode: 'Ask', coins: 0.5, status: 'success' },
                { date: '2024-05-15', mode: 'Advanced', coins: 2, status: 'success' }
            ],
            byMode: {
                code: 40,
                ask: 30,
                advanced: 20,
                plan: 10
            }
        };
    },

    // Mock watsonx data
    getWatsonxStats() {
        return {
            suggestions: 42,
            reviews: 28,
            analyses: 57,
            tokensUsed: 15234,
            modelUsage: {
                'granite-8b': 45,
                'granite-20b': 78,
                'granite-34b': 32,
                'chat-8b': 56,
                'chat-20b': 23
            },
            tokenConsumption: {
                input: [2500, 3200, 2800, 3500],
                output: [1800, 2400, 2100, 2700]
            }
        };
    },

    // Mock workflow data
    getWorkflows() {
        return [
            {
                id: 'wf-1',
                name: 'Code Review',
                status: 'completed',
                runs: 24,
                avgDuration: 150,
                lastRun: '2024-05-16T10:30:00Z'
            },
            {
                id: 'wf-2',
                name: 'Documentation',
                status: 'running',
                runs: 18,
                avgDuration: 108,
                lastRun: '2024-05-16T11:00:00Z'
            }
        ];
    }
};

// ===== API Helper Functions =====
async function fetchWithFallback(apiCall, mockData) {
    try {
        return await apiCall();
    } catch (error) {
        console.warn('API call failed, using mock data:', error);
        return mockData;
    }
}

// ===== Export API Modules =====
window.API = {
    client: api,
    code: CodeAnalysisAPI,
    bob: BobAPI,
    watsonx: WatsonxAPI,
    workflows: WorkflowAPI,
    reports: ReportsAPI,
    dashboard: DashboardAPI,
    mock: MockAPI,
    fetchWithFallback
};

// ===== WebSocket for Real-time Updates =====
class DashboardWebSocket {
    constructor(url = 'ws://localhost:3000/ws') {
        this.url = url;
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
        this.listeners = new Map();
    }

    connect() {
        try {
            this.ws = new WebSocket(this.url);
            
            this.ws.onopen = () => {
                console.log('WebSocket connected');
                this.reconnectAttempts = 0;
                this.emit('connected');
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.emit(data.type, data.payload);
                } catch (error) {
                    console.error('WebSocket message parse error:', error);
                }
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.emit('error', error);
            };
            
            this.ws.onclose = () => {
                console.log('WebSocket disconnected');
                this.emit('disconnected');
                this.reconnect();
            };
        } catch (error) {
            console.error('WebSocket connection error:', error);
            this.reconnect();
        }
    }

    reconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => this.connect(), this.reconnectDelay);
        }
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    emit(event, data) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => callback(data));
        }
    }

    send(type, payload) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, payload }));
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

// Create WebSocket instance
const dashboardWS = new DashboardWebSocket();

// Export WebSocket
window.DashboardWS = dashboardWS;

// Auto-connect WebSocket (optional - can be enabled when backend is ready)
// dashboardWS.connect();

// Made with Bob
