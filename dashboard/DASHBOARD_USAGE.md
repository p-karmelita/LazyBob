# LazyBob Dashboard Usage Guide

## Starting the Dashboard

### Quick Start
```bash
# From project root
./start-dashboard.sh
```

### Manual Start
```bash
# Build the project
npm run build

# Start the server
node dist/server/index.js
```

The dashboard will be available at: **http://localhost:3000**

## Report Generation

### Using the Dashboard UI

1. **Navigate to Reports Section**
   - Click "Reports" in the left sidebar
   - Or go to http://localhost:3000/#reports

2. **Generate a Report**
   - Click the "Generate Report" button
   - Select report type when prompted:
     - `1` - Performance Report
     - `2` - Security Audit
     - `3` - Code Quality Report
     - `4` - Full Report (recommended)
   - Report will automatically download as JSON

3. **Report Contents**
   The generated report includes:
   - **Stats**: Files, lines of code, functions, classes, issues
   - **Bob Usage**: Bobcoins used, remaining, total, percentage
   - **Workflows**: List of workflows with run counts
   - **Summary**: Aggregated metrics
   - **Metadata**: Generation timestamp, version, options

### API Endpoint

You can also generate reports programmatically:

```javascript
// POST /api/reports/generate
const response = await fetch('http://localhost:3000/api/reports/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'full',  // or 'performance', 'security', 'quality'
    options: {
      includeCharts: true,
      includeHistory: true
    }
  })
});

const data = await response.json();
console.log(data.report);
```

### Export Options

The Reports section also provides export buttons for different formats:
- **Export CSV** - Comma-separated values
- **Export Excel** - Excel spreadsheet
- **Export PDF** - PDF document
- **Export JSON** - JSON format (default)

## Troubleshooting

### "Failed to generate report" Error

**Cause**: Server is not running or API endpoint is unreachable

**Solution**:
1. Ensure the server is running: `node dist/server/index.js`
2. Check console for errors: Open browser DevTools (F12)
3. Verify server is accessible: http://localhost:3000/api/health

### "Cannot read properties of undefined" Error

**Cause**: API response structure mismatch or network error

**Solution**:
1. Check server logs for errors
2. Verify `.env` file has correct Bob API credentials
3. Test API endpoint directly: 
   ```bash
   curl -X POST http://localhost:3000/api/reports/generate \
     -H "Content-Type: application/json" \
     -d '{"type":"full","options":{}}'
   ```

### Server Won't Start

**Cause**: Port 3000 already in use or build errors

**Solution**:
1. Check if port is in use: `lsof -i :3000`
2. Kill existing process: `kill -9 <PID>`
3. Or change port in `src/server/index.ts`
4. Rebuild: `npm run build`

## Features

### Dashboard Sections

1. **Overview** - Quick stats and activity feed
2. **Code Analysis** - Code quality metrics and issues
3. **Bob Usage** - Bobcoin tracking and history
4. **watsonx AI** - AI analytics and insights
5. **Workflows** - Automation workflows
6. **Reports** - Report generation and exports
7. **About Me** - Developer information

### Real-time Updates

The dashboard automatically refreshes data every 30 seconds when enabled. You can also manually refresh using the refresh button in the header.

### AI Chat Assistant

Click the chat button in the bottom-right corner to interact with the LazyBob AI assistant for help with:
- Running code analysis
- Creating workflows
- Generating reports
- Understanding features
- Troubleshooting issues

## API Endpoints

All endpoints are prefixed with `/api`:

- `GET /api/health` - Health check
- `GET /api/stats` - Project statistics
- `GET /api/bob/usage` - Bobcoin usage
- `POST /api/analyze` - Run code analysis
- `GET /api/workflows` - List workflows
- `POST /api/workflows` - Create workflow
- `POST /api/workflows/:id/run` - Run workflow
- `GET /api/activity` - Activity feed
- `POST /api/chat` - Chat with AI assistant
- `POST /api/reports/generate` - Generate report

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
BOB_API_KEY=your_api_key_here
BOB_TEAM_ID=your_team_id_here
BOB_ENDPOINT=https://bob.build/api
```

### Server Port

Default port is 3000. To change:

1. Edit `src/server/index.ts`
2. Change `new DashboardServer(3000)` to desired port
3. Rebuild: `npm run build`

## Support

For issues or questions:
- Check the main README.md
- Review AGENTS.md for development guidelines
- Open an issue on GitHub
- Contact: karpiotr90@gmail.com