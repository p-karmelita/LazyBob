// ===== Dashboard Main JavaScript =====

// Global state
const state = {
    currentSection: 'overview',
    data: {
        files: 0,
        lines: 0,
        bobcoins: { used: 0, total: 40 },
        aiRequests: 0,
        activities: [],
        issues: [],
        workflows: []
    },
    charts: {},
    refreshInterval: null
};

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeEventListeners();
    loadDashboardData();
    // Auto-refresh disabled for mock data dashboard
    // startAutoRefresh();
    showToast('Dashboard loaded successfully', 'success');
});

// ===== Navigation =====
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.dataset.section;
            
            // Don't do anything if already active
            if (item.classList.contains('active')) return;
            
            // Find current active section
            const currentSection = document.querySelector('.content-section.active');
            
            // Add fade-out animation to current section
            if (currentSection) {
                currentSection.classList.add('fade-out');
                
                // Wait for fade-out animation to complete
                setTimeout(() => {
                    currentSection.classList.remove('active', 'fade-out');
                    
                    // Show new section with fade-in
                    const newSection = document.getElementById(sectionId);
                    newSection.classList.add('active');
                }, 300);
            } else {
                // No current section, just show the new one
                document.getElementById(sectionId).classList.add('active');
            }
            
            // Update active states for navigation
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Update page title with smooth transition
            const title = item.querySelector('span').textContent;
            const pageTitle = document.querySelector('.page-title');
            pageTitle.style.opacity = '0';
            setTimeout(() => {
                pageTitle.textContent = title;
                pageTitle.style.opacity = '1';
            }, 150);
            
            state.currentSection = sectionId;
            loadSectionData(sectionId);
            
            // Close mobile menu if open
            closeMobileMenu();
        });
    });
}

// ===== Event Listeners =====
function initializeEventListeners() {
    // Menu toggle for mobile
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle?.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Add overlay when menu is open
        toggleOverlay();
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });
    
    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    refreshBtn?.addEventListener('click', () => {
        refreshBtn.querySelector('i').style.animation = 'spin 1s linear';
        setTimeout(() => {
            refreshBtn.querySelector('i').style.animation = '';
        }, 1000);
        loadDashboardData();
        showToast('Data refreshed', 'info');
    });
    
    // Run analysis button
    const runAnalysisBtn = document.getElementById('runAnalysisBtn');
    runAnalysisBtn?.addEventListener('click', runCodeAnalysis);
    
    // Test AI button
    const testAIBtn = document.getElementById('testAIBtn');
    testAIBtn?.addEventListener('click', testAIFeatures);
    
    // Create workflow button
    const createWorkflowBtn = document.getElementById('createWorkflowBtn');
    createWorkflowBtn?.addEventListener('click', createWorkflow);
    
    // Generate report button
    const generateReportBtn = document.getElementById('generateReportBtn');
    generateReportBtn?.addEventListener('click', generateReport);
}

// ===== Data Loading =====
async function loadDashboardData() {
    showLoading(true);
    
    try {
        // Load real data from API
        await Promise.all([
            loadOverviewData(),
            loadCodeAnalysisData(),
            loadBobUsageData(),
            loadWatsonxData(),
            loadWorkflowsData()
        ]);
        
        updateDashboard();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showToast('Error loading data: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function loadOverviewData() {
    try {
        // Load stats from API
        const stats = await api.request('/stats');
        state.data.files = stats.files || 0;
        state.data.lines = stats.lines || 0;
        state.data.aiRequests = stats.functions || 0;
        
        // Load activity feed
        const activities = await api.request('/activity');
        state.data.activities = activities;
    } catch (error) {
        console.error('Error loading overview data:', error);
        // Use fallback data
        state.data.files = 0;
        state.data.lines = 0;
        state.data.aiRequests = 0;
        state.data.activities = [];
    }
}

async function loadCodeAnalysisData() {
    return new Promise(resolve => {
        setTimeout(() => {
            state.data.issues = [
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
                },
                {
                    severity: 'low',
                    type: 'Code Style',
                    message: 'Missing JSDoc comment',
                    file: 'src/core/analyzer.ts',
                    line: 67
                }
            ];
            resolve();
        }, 300);
    });
}

async function loadBobUsageData() {
    try {
        const usage = await api.request('/bob/usage');
        state.data.bobcoins.used = usage.used || 0;
        state.data.bobcoins.total = usage.total || 40;
        state.data.bobcoins.history = usage.history || [];
    } catch (error) {
        console.error('Error loading Bob usage data:', error);
        state.data.bobcoins.used = 0;
        state.data.bobcoins.total = 40;
        state.data.bobcoins.history = [];
    }
}

async function loadWatsonxData() {
    return new Promise(resolve => {
        setTimeout(() => {
            // watsonx data loaded
            resolve();
        }, 400);
    });
}

async function loadWorkflowsData() {
    try {
        const workflows = await api.request('/workflows');
        state.data.workflows = workflows || [];
    } catch (error) {
        console.error('Error loading workflows data:', error);
        state.data.workflows = [];
    }
}

// ===== Update Dashboard =====
function updateDashboard() {
    updateStats();
    updateActivityList();
    updateIssuesList();
    updateUsageDisplay();
    updateAIStats();
    updateWorkflowTimeline();
}

function updateStats() {
    document.getElementById('totalFiles').textContent = state.data.files.toLocaleString();
    document.getElementById('totalLines').textContent = state.data.lines.toLocaleString();
    document.getElementById('bobcoinsUsed').textContent = state.data.bobcoins.used;
    document.getElementById('aiRequests').textContent = state.data.aiRequests.toLocaleString();
}

function updateActivityList() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    activityList.innerHTML = state.data.activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon stat-icon ${activity.iconColor}">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

function updateIssuesList() {
    const issuesList = document.getElementById('issuesList');
    if (!issuesList) return;
    
    issuesList.innerHTML = state.data.issues.map(issue => `
        <div class="issue-item">
            <div class="issue-severity ${issue.severity}">
                ${issue.severity[0].toUpperCase()}
            </div>
            <div class="issue-content">
                <div class="issue-title">
                    <strong>${issue.type}:</strong> ${issue.message}
                </div>
                <div class="issue-location">
                    ${issue.file}:${issue.line}
                </div>
            </div>
        </div>
    `).join('');
}

function updateUsageDisplay() {
    const used = state.data.bobcoins.used;
    const total = state.data.bobcoins.total;
    const percentage = (used / total) * 100;
    
    const balanceEl = document.getElementById('bobcoinBalance');
    const usedCoinsEl = document.getElementById('usedCoins');
    const usageFillEl = document.getElementById('usageFill');
    
    if (balanceEl) balanceEl.textContent = total - used;
    if (usedCoinsEl) usedCoinsEl.textContent = used;
    if (usageFillEl) usageFillEl.style.width = `${percentage}%`;
}

function updateAIStats() {
    const suggestionsEl = document.getElementById('suggestionsCount');
    const reviewsEl = document.getElementById('reviewsCount');
    const analysesEl = document.getElementById('analysesCount');
    const tokensEl = document.getElementById('tokensUsed');
    
    if (suggestionsEl) suggestionsEl.textContent = '42';
    if (reviewsEl) reviewsEl.textContent = '28';
    if (analysesEl) analysesEl.textContent = '57';
    if (tokensEl) tokensEl.textContent = '15.2K';
}

function updateWorkflowTimeline() {
    const timeline = document.getElementById('workflowTimeline');
    if (!timeline) return;
    
    timeline.innerHTML = state.data.workflows.map(workflow => `
        <div class="timeline-item">
            <div class="timeline-marker completed"></div>
            <div class="timeline-content">
                <h5>${workflow.name}</h5>
                <p>Runs: ${workflow.runs} • Avg: ${workflow.avgDuration}</p>
                <button class="btn-secondary btn-sm" onclick="runWorkflow('${workflow.id}')">
                    <i class="fas fa-play"></i> Run
                </button>
            </div>
        </div>
    `).join('');
}

// Run specific workflow
async function runWorkflow(workflowId) {
    const workflow = state.data.workflows.find(w => w.id === workflowId);
    if (!workflow) {
        showToast('Workflow not found', 'error');
        return;
    }
    
    const params = prompt(`Enter parameters for "${workflow.name}" (JSON format or leave empty):`, '{}');
    if (params === null) return;
    
    let parsedParams = {};
    try {
        parsedParams = params ? JSON.parse(params) : {};
    } catch (error) {
        showToast('Invalid JSON parameters', 'error');
        return;
    }
    
    showLoading(true);
    showToast(`Running workflow: ${workflow.name}...`, 'info');
    
    try {
        const result = await api.request(`/workflows/${workflowId}/run`, {
            method: 'POST',
            body: JSON.stringify({ params: parsedParams })
        });
        
        showToast(`Workflow "${workflow.name}" started successfully!`, 'success');
        await loadWorkflowsData();
        updateWorkflowTimeline();
    } catch (error) {
        console.error('Workflow execution error:', error);
        showToast('Failed to run workflow: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// Make runWorkflow available globally
window.runWorkflow = runWorkflow;

// ===== Section Loading =====
function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'overview':
            // Overview data already loaded
            break;
        case 'code-analysis':
            loadCodeAnalysisSection();
            break;
        case 'bob-usage':
            loadBobUsageSection();
            break;
        case 'watsonx':
            loadWatsonxSection();
            break;
        case 'workflows':
            loadWorkflowsSection();
            break;
        case 'reports':
            loadReportsSection();
            break;
        case 'about':
            loadAboutSection();
            break;
    }
}

function loadCodeAnalysisSection() {
    // Load code analysis specific data
    console.log('Loading code analysis section');
}

function loadBobUsageSection() {
    // Load Bob usage specific data
    console.log('Loading Bob usage section');
    loadUsageHistory();
}

function loadWatsonxSection() {
    // Load watsonx specific data
    console.log('Loading watsonx section');
    loadAIInsights();
}

function loadWorkflowsSection() {
    // Load workflows specific data
    console.log('Loading workflows section');
}

function loadReportsSection() {
    // Load reports specific data
    console.log('Loading reports section');
}

function loadAboutSection() {
    // Load about section specific data
    console.log('Loading about section');
    // About section is static content, no dynamic loading needed
    // Could add animations or dynamic content here if needed
}

// ===== Actions =====
async function runCodeAnalysis() {
    showLoading(true);
    showToast('Running code analysis...', 'info');
    
    try {
        // Simulate analysis with mock data (no backend required)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate random analysis results
        const randomIssues = [
            {
                severity: 'high',
                type: 'Security',
                message: 'Potential SQL injection vulnerability detected',
                file: 'src/database/query.ts',
                line: Math.floor(Math.random() * 100) + 1
            },
            {
                severity: 'medium',
                type: 'Performance',
                message: 'Inefficient loop detected - consider using map/filter',
                file: 'src/utils/processor.ts',
                line: Math.floor(Math.random() * 200) + 1
            },
            {
                severity: 'low',
                type: 'Code Style',
                message: 'Missing JSDoc comment for public function',
                file: 'src/core/analyzer.ts',
                line: Math.floor(Math.random() * 150) + 1
            },
            {
                severity: 'medium',
                type: 'Best Practice',
                message: 'Consider using async/await instead of callbacks',
                file: 'src/api/client.ts',
                line: Math.floor(Math.random() * 180) + 1
            }
        ];
        
        // Update state with new mock data
        state.data.issues = randomIssues;
        state.data.files = Math.floor(Math.random() * 50) + 150;
        state.data.lines = Math.floor(Math.random() * 2000) + 7000;
        
        showToast('Code analysis completed successfully!', 'success');
        updateIssuesList();
        updateStats();
    } catch (error) {
        console.error('Analysis error:', error);
        showToast('Analysis failed: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function testAIFeatures() {
    showLoading(true);
    showToast('Testing AI features...', 'info');
    
    try {
        // Simulate AI test
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showToast('AI features working correctly', 'success');
        updateAIStats();
    } catch (error) {
        showToast('AI test failed', 'error');
    } finally {
        showLoading(false);
    }
}

async function createWorkflow() {
    // Prompt for workflow details
    const name = prompt('Enter workflow name:');
    if (!name) return;
    
    const description = prompt('Enter workflow description:');
    const stepsInput = prompt('Enter workflow steps (comma-separated):', 'analyze,review,report');
    
    if (!stepsInput) return;
    
    const steps = stepsInput.split(',').map(s => s.trim());
    
    showLoading(true);
    showToast('Creating workflow...', 'info');
    
    try {
        // Simulate workflow creation with mock data
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Add workflow to mock data
        const newWorkflow = {
            id: Date.now(),
            name,
            description: description || 'Custom workflow',
            steps,
            status: 'active',
            created: new Date().toISOString()
        };
        
        // Update state
        state.workflows.push(newWorkflow);
        
        showToast(`Workflow "${name}" created successfully!`, 'success');
        await loadWorkflowsData();
        updateWorkflowTimeline();
    } catch (error) {
        console.error('Workflow creation error:', error);
        showToast('Failed to create workflow: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

async function generateReport() {
    const reportType = prompt('Select report type:\n1. Performance\n2. Security\n3. Code Quality\n4. Full Report\n\nEnter number (1-4):', '4');
    
    if (!reportType) return;
    
    const types = {
        '1': 'performance',
        '2': 'security',
        '3': 'quality',
        '4': 'full'
    };
    
    const type = types[reportType] || 'full';
    
    showLoading(true);
    showToast('Generating report...', 'info');
    
    try {
        // Simulate report generation with mock data
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Use current state data for report
        const report = {
            type,
            timestamp: new Date().toISOString(),
            stats: {
                files: state.stats.files,
                lines: state.stats.lines,
                functions: state.stats.functions,
                classes: state.stats.classes,
                issues: state.stats.issues
            },
            bobUsage: {
                used: state.bobUsage.used,
                remaining: state.bobUsage.remaining,
                total: state.bobUsage.total
            },
            workflows: state.workflows,
            analysis: state.analysis,
            summary: {
                totalFiles: state.stats.files,
                totalLines: state.stats.lines,
                bobcoinsUsed: state.bobUsage.used,
                workflowsRun: state.workflows.length,
                issuesFound: state.stats.issues,
                reportType: type
            }
        };
        
        // Download as JSON
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lazybob-report-${type}-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Report generated and downloaded successfully!', 'success');
    } catch (error) {
        console.error('Report generation error:', error);
        showToast('Failed to generate report: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

// ===== Helper Functions =====
function loadUsageHistory() {
    const table = document.getElementById('usageHistoryTable');
    if (!table) return;
    
    const history = [
        { date: '2024-05-16', mode: 'Code', request: 'Analyze codebase', coins: 1, status: 'success' },
        { date: '2024-05-16', mode: 'Ask', request: 'Explain function', coins: 0.5, status: 'success' },
        { date: '2024-05-15', mode: 'Advanced', request: 'Complex refactoring', coins: 2, status: 'success' },
        { date: '2024-05-15', mode: 'Code', request: 'Generate tests', coins: 1, status: 'success' }
    ];
    
    table.innerHTML = history.map(item => `
        <tr>
            <td>${item.date}</td>
            <td><span class="badge">${item.mode}</span></td>
            <td>${item.request}</td>
            <td>${item.coins}</td>
            <td><span class="status-badge ${item.status}">${item.status}</span></td>
        </tr>
    `).join('');
}

function loadAIInsights() {
    const grid = document.getElementById('insightsGrid');
    if (!grid) return;
    
    const insights = [
        {
            icon: 'fa-lightbulb',
            title: 'Code Optimization',
            description: 'Found 12 opportunities to improve performance',
            action: 'View Details'
        },
        {
            icon: 'fa-shield-alt',
            title: 'Security Scan',
            description: '2 potential vulnerabilities detected',
            action: 'Review Issues'
        },
        {
            icon: 'fa-chart-line',
            title: 'Quality Trends',
            description: 'Code quality improved by 15% this week',
            action: 'View Report'
        }
    ];
    
    grid.innerHTML = insights.map(insight => `
        <div class="insight-card">
            <i class="fas ${insight.icon}"></i>
            <h5>${insight.title}</h5>
            <p>${insight.description}</p>
            <button class="btn-secondary">${insight.action}</button>
        </div>
    `).join('');
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.toggle('active', show);
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getToastIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function startAutoRefresh() {
    // Refresh data every 30 seconds
    state.refreshInterval = setInterval(() => {
        loadDashboardData();
    }, 30000);
}

// ===== Cleanup =====
window.addEventListener('beforeunload', () => {
    if (state.refreshInterval) {
        clearInterval(state.refreshInterval);
    }

// ===== Mobile Menu Functions =====
function closeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.getElementById('menuToggle');
    
    if (sidebar && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        menuToggle?.classList.remove('active');
        removeOverlay();
    }
}

function toggleOverlay() {
    let overlay = document.getElementById('mobileOverlay');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'mobileOverlay';
        overlay.className = 'mobile-overlay';
        overlay.addEventListener('click', closeMobileMenu);
        document.body.appendChild(overlay);
    }
    
    // Toggle visibility
    setTimeout(() => {
        overlay.classList.toggle('active');
    }, 10);
}

function removeOverlay() {
    const overlay = document.getElementById('mobileOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

// ===== Page Title Transition =====
function updatePageTitle(title) {
    const pageTitle = document.querySelector('.page-title');
    if (!pageTitle) return;
    
    pageTitle.style.transition = 'opacity 0.3s ease';
    pageTitle.style.opacity = '0';
    
    setTimeout(() => {
        pageTitle.textContent = title;
        pageTitle.style.opacity = '1';
    }, 150);
}
});

// ===== Export for use in other modules =====
window.DashboardApp = {
    state,
    loadDashboardData,
    showToast,
    showLoading,
    closeMobileMenu,
    updatePageTitle
};

// Made with Bob
