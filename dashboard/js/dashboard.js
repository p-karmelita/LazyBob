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
    startAutoRefresh();
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
            
            // Update active states
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            item.classList.add('active');
            document.getElementById(sectionId).classList.add('active');
            
            // Update page title
            const title = item.querySelector('span').textContent;
            document.querySelector('.page-title').textContent = title;
            
            state.currentSection = sectionId;
            loadSectionData(sectionId);
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
        // Simulate API calls - replace with actual API endpoints
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
        showToast('Error loading data', 'error');
    } finally {
        showLoading(false);
    }
}

async function loadOverviewData() {
    // Simulate API call
    return new Promise(resolve => {
        setTimeout(() => {
            state.data.files = 156;
            state.data.lines = 7842;
            state.data.bobcoins.used = 4;
            state.data.aiRequests = 127;
            
            state.data.activities = [
                {
                    icon: 'fa-code',
                    iconColor: 'blue',
                    title: 'Code analysis completed',
                    time: '2 minutes ago'
                },
                {
                    icon: 'fa-brain',
                    iconColor: 'purple',
                    title: 'AI suggestion generated',
                    time: '15 minutes ago'
                },
                {
                    icon: 'fa-check-circle',
                    iconColor: 'green',
                    title: 'Code review passed',
                    time: '1 hour ago'
                },
                {
                    icon: 'fa-file-alt',
                    iconColor: 'orange',
                    title: 'Documentation updated',
                    time: '2 hours ago'
                }
            ];
            
            resolve();
        }, 500);
    });
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
    return new Promise(resolve => {
        setTimeout(() => {
            // Bob usage data loaded
            resolve();
        }, 200);
    });
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
    return new Promise(resolve => {
        setTimeout(() => {
            state.data.workflows = [
                {
                    name: 'Code Review',
                    status: 'completed',
                    time: '5 minutes ago',
                    duration: '2.5 min'
                },
                {
                    name: 'Documentation',
                    status: 'running',
                    time: 'In progress',
                    duration: '1.2 min'
                },
                {
                    name: 'Testing',
                    status: 'completed',
                    time: '1 hour ago',
                    duration: '3.8 min'
                }
            ];
            resolve();
        }, 350);
    });
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
            <div class="timeline-marker ${workflow.status}"></div>
            <div class="timeline-content">
                <h5>${workflow.name}</h5>
                <p>${workflow.time} • ${workflow.duration}</p>
            </div>
        </div>
    `).join('');
}

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

// ===== Actions =====
async function runCodeAnalysis() {
    showLoading(true);
    showToast('Running code analysis...', 'info');
    
    try {
        // Simulate analysis
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        showToast('Code analysis completed', 'success');
        await loadCodeAnalysisData();
        updateIssuesList();
    } catch (error) {
        showToast('Analysis failed', 'error');
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

function createWorkflow() {
    showToast('Workflow creation coming soon', 'info');
}

function generateReport() {
    showToast('Generating report...', 'info');
    
    setTimeout(() => {
        showToast('Report generated successfully', 'success');
    }, 1500);
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
});

// ===== Export for use in other modules =====
window.DashboardApp = {
    state,
    loadDashboardData,
    showToast,
    showLoading
};

// Made with Bob
