// ===== Charts Configuration and Initialization =====

// Chart.js default configuration
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = '#334155';
Chart.defaults.font.family = "'Inter', sans-serif";

// Color palette
const colors = {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    purple: '#a855f7',
    pink: '#ec4899',
    cyan: '#06b6d4',
    orange: '#f97316'
};

// Gradient helper
function createGradient(ctx, color1, color2) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
}

// ===== Activity Chart =====
function initActivityChart() {
    const canvas = document.getElementById('activityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const gradient = createGradient(ctx, colors.primary, colors.secondary);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Code Changes',
                data: [65, 78, 90, 81, 95, 72, 88],
                borderColor: colors.primary,
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            }, {
                label: 'AI Requests',
                data: [28, 48, 40, 55, 62, 45, 58],
                borderColor: colors.secondary,
                backgroundColor: 'transparent',
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12,
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    },
                    ticks: {
                        padding: 10
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        padding: 10
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// ===== Language Distribution Chart =====
function initLanguageChart() {
    const canvas = document.getElementById('languageChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['TypeScript', 'JavaScript', 'CSS', 'HTML', 'JSON'],
            datasets: [{
                data: [45, 25, 15, 10, 5],
                backgroundColor: [
                    colors.primary,
                    colors.secondary,
                    colors.success,
                    colors.warning,
                    colors.info
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 15,
                        generateLabels: (chart) => {
                            const data = chart.data;
                            return data.labels.map((label, i) => ({
                                text: `${label} (${data.datasets[0].data[i]}%)`,
                                fillStyle: data.datasets[0].backgroundColor[i],
                                hidden: false,
                                index: i
                            }));
                        }
                    }
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: (context) => {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// ===== Complexity Chart =====
function initComplexityChart() {
    const canvas = document.getElementById('complexityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Low', 'Medium', 'High', 'Very High'],
            datasets: [{
                label: 'Functions',
                data: [45, 28, 12, 5],
                backgroundColor: [
                    colors.success,
                    colors.info,
                    colors.warning,
                    colors.danger
                ],
                borderRadius: 8,
                barThickness: 40
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    },
                    ticks: {
                        padding: 10
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        padding: 10
                    }
                }
            }
        }
    });
}

// ===== Mode Usage Chart =====
function initModeUsageChart() {
    const canvas = document.getElementById('modeUsageChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Code', 'Ask', 'Advanced', 'Plan'],
            datasets: [{
                data: [40, 30, 20, 10],
                backgroundColor: [
                    colors.primary,
                    colors.success,
                    colors.warning,
                    colors.info
                ],
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: (context) => {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            }
        }
    });
}

// ===== Daily Usage Chart =====
function initDailyUsageChart() {
    const canvas = document.getElementById('dailyUsageChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Bobcoins Used',
                data: [0.5, 1.2, 0.8, 1.5, 0.3, 0.2, 0.5],
                borderColor: colors.warning,
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: colors.warning
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: (context) => {
                            return `Used: ${context.parsed.y} coins`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    },
                    ticks: {
                        padding: 10,
                        callback: (value) => value + ' coins'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        padding: 10
                    }
                }
            }
        }
    });
}

// ===== Model Usage Chart =====
function initModelUsageChart() {
    const canvas = document.getElementById('modelUsageChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Granite 8B', 'Granite 20B', 'Granite 34B', 'Chat 8B', 'Chat 20B'],
            datasets: [{
                label: 'Requests',
                data: [45, 78, 32, 56, 23],
                backgroundColor: colors.primary,
                borderRadius: 8,
                barThickness: 30
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    },
                    ticks: {
                        padding: 10
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        padding: 10
                    }
                }
            }
        }
    });
}

// ===== Token Consumption Chart =====
function initTokenChart() {
    const canvas = document.getElementById('tokenChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const gradient = createGradient(ctx, colors.secondary, colors.primary);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Input Tokens',
                data: [2500, 3200, 2800, 3500],
                borderColor: colors.primary,
                backgroundColor: 'transparent',
                tension: 0.4,
                pointRadius: 4
            }, {
                label: 'Output Tokens',
                data: [1800, 2400, 2100, 2700],
                borderColor: colors.secondary,
                backgroundColor: 'transparent',
                tension: 0.4,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    },
                    ticks: {
                        padding: 10,
                        callback: (value) => value.toLocaleString()
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        padding: 10
                    }
                }
            }
        }
    });
}

// ===== Initialize All Charts =====
function initializeAllCharts() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(createAllCharts, 100);
        });
    } else {
        setTimeout(createAllCharts, 100);
    }
}

function createAllCharts() {
    try {
        initActivityChart();
        initLanguageChart();
        initComplexityChart();
        initModeUsageChart();
        initDailyUsageChart();
        initModelUsageChart();
        initTokenChart();
        console.log('All charts initialized successfully');
    } catch (error) {
        console.error('Error initializing charts:', error);
    }
}

// ===== Chart Update Functions =====
function updateChartData(chartId, newData) {
    const chart = Chart.getChart(chartId);
    if (chart) {
        chart.data.datasets[0].data = newData;
        chart.update('active');
    }
}

function addChartDataPoint(chartId, label, data) {
    const chart = Chart.getChart(chartId);
    if (chart) {
        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
        chart.update();
    }
}

// ===== Export Functions =====
window.ChartsModule = {
    initializeAllCharts,
    updateChartData,
    addChartDataPoint,
    colors
};

// Auto-initialize charts
initializeAllCharts();

// Made with Bob
