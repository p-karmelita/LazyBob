# LazyBob Dashboard - User Guide

## 🚀 Getting Started

### Starting the Dashboard

1. **Start the server:**
   ```bash
   npm run dev:server
   ```

2. **Access the dashboard:**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## 📊 Dashboard Features

### 1. Overview Section

**What you see:**
- Total files analyzed
- Lines of code
- Bobcoins used
- AI requests made
- Recent activity feed

**Actions:**
- Click "Refresh" button to update data
- View real-time statistics

### 2. Code Analysis

**How to analyze code:**

1. Click **"Run Analysis"** button
2. Enter the path to analyze (e.g., `./src` or `.`)
3. Wait for analysis to complete
4. View results:
   - Code quality score
   - Complexity metrics
   - Issues and recommendations
   - Dependencies

**What you get:**
- Detailed code metrics
- Security issues
- Performance recommendations
- Code quality trends

### 3. Bob Usage Tracking

**Monitor your Bobcoin usage:**
- Current balance
- Usage history
- Usage by mode (Code/Ask/Advanced)
- Daily usage trends

**Features:**
- Real-time balance updates
- Detailed transaction history
- Usage analytics

### 4. Workflows

**Create a new workflow:**

1. Click **"Create Workflow"** button
2. Enter workflow details:
   - **Name:** e.g., "Code Review"
   - **Description:** What the workflow does
   - **Steps:** Comma-separated list (e.g., `analyze,review,report`)
3. Click OK to create

**Run a workflow:**

1. Find the workflow in the list
2. Click **"Run"** button next to it
3. Enter parameters (JSON format) or leave empty
4. Monitor execution

**Pre-configured workflows:**
- **Code Review:** Automated code review with AI
- **Documentation:** Generate comprehensive docs
- **Testing:** Create and run test suites

### 5. Reports

**Generate a report:**

1. Click **"Generate Report"** button
2. Select report type:
   - **1:** Performance Report
   - **2:** Security Audit
   - **3:** Code Quality Report
   - **4:** Full Report (all data)
3. Report downloads automatically as JSON

**Report contents:**
- Project statistics
- Bobcoin usage
- Workflow execution history
- Summary metrics

### 6. About Me

**Your profile section:**
- Personal information
- Skills and technologies
- Projects portfolio
- Experience timeline
- Achievements
- Contact information

## 🎯 Common Tasks

### Task 1: Analyze Your Codebase

```
1. Navigate to "Code Analysis" section
2. Click "Run Analysis"
3. Enter path: ./src
4. Review results and issues
```

### Task 2: Create Custom Workflow

```
1. Go to "Workflows" section
2. Click "Create Workflow"
3. Name: "My Custom Flow"
4. Description: "Custom automation"
5. Steps: step1,step2,step3
6. Click OK
```

### Task 3: Generate Project Report

```
1. Go to "Reports" section
2. Click "Generate Report"
3. Select type: 4 (Full Report)
4. File downloads automatically
```

### Task 4: Monitor Bobcoin Usage

```
1. Navigate to "Bob Usage" section
2. View current balance
3. Check usage history table
4. Analyze usage trends
```

## 🔧 API Integration

The dashboard connects to the LazyBob API server running on `http://localhost:3000/api`.

### Available Endpoints:

- `GET /api/health` - Health check
- `GET /api/stats` - Dashboard statistics
- `GET /api/bob/usage` - Bobcoin usage
- `POST /api/analyze` - Run code analysis
- `GET /api/workflows` - List workflows
- `POST /api/workflows` - Create workflow
- `POST /api/workflows/:id/run` - Run workflow
- `GET /api/activity` - Activity feed

## 💡 Tips & Tricks

### 1. Keyboard Shortcuts
- **Ctrl + R** - Refresh data
- **Esc** - Close mobile menu

### 2. Mobile Usage
- Tap hamburger menu (☰) to open navigation
- Tap outside menu to close
- All features work on mobile

### 3. Data Refresh
- Dashboard auto-refreshes every 30 seconds
- Click refresh button for manual update
- Real-time updates for all sections

### 4. Error Handling
- Errors show as toast notifications
- Check browser console for details
- Server must be running for API calls

## 🐛 Troubleshooting

### Dashboard won't load
```bash
# Check if server is running
npm run dev:server

# Check if port 3000 is available
lsof -i :3000
```

### API errors
```bash
# Verify .env file exists with credentials
cat .env

# Check server logs
npm run dev:server
```

### No data showing
```bash
# Refresh the page
# Check browser console for errors
# Verify API server is running
```

## 📝 Configuration

### Environment Variables

Create `.env` file in project root:

```env
BOB_API_KEY=your_api_key_here
BOB_TEAM_ID=your_team_id_here
BOB_ENDPOINT=https://bob.api.endpoint
```

### Server Port

Default port is 3000. To change:

```typescript
// src/server/index.ts
const server = new DashboardServer(3001); // Change port here
```

## 🔐 Security

- Never commit `.env` file
- Keep API keys secure
- Use HTTPS in production
- Validate all user inputs

## 📚 Additional Resources

- [Project README](../README.md)
- [API Documentation](../docs/API.md)
- [Bob Integration Guide](../docs/BOB_API_INTEGRATION.md)
- [Architecture Overview](../docs/ARCHITECTURE.md)

## 🆘 Support

For issues or questions:
1. Check this guide
2. Review error messages
3. Check browser console
4. Review server logs
5. Create GitHub issue

---

**Made with ❤️ using IBM Bob**