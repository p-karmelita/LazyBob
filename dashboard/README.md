# LazyBob Dashboard

A modern, interactive web dashboard for monitoring and analyzing LazyBob's AI-powered development activities.

## Features

### 📊 Overview Dashboard
- Real-time statistics (files, lines of code, Bobcoins, AI requests)
- Activity timeline with recent events
- Interactive charts for code activity and language distribution
- Responsive design for all screen sizes

### 💻 Code Analysis
- Code quality scoring with visual indicators
- Complexity analysis with distribution charts
- Dependency visualization
- Issues and recommendations list
- Real-time analysis execution

### 🪙 Bob Usage Analytics
- Bobcoin balance and usage tracking
- Usage history table with filtering
- Mode-based usage breakdown (Code, Ask, Advanced, Plan)
- Daily usage trends
- Visual progress indicators

### 🤖 watsonx AI Integration
- AI request statistics (suggestions, reviews, analyses)
- Token consumption tracking
- Model usage distribution
- AI insights and recommendations
- Real-time AI feature testing

### 🔄 Workflow Automation
- Pre-built workflow cards (Code Review, Documentation, Testing, Deployment)
- Workflow execution history timeline
- Performance metrics (runs, average duration)
- One-click workflow execution

### 📈 Reports & Analytics
- Performance reports
- Security audit reports
- Code quality reports
- Multiple export formats (CSV, Excel, PDF, JSON)
- Download and sharing capabilities

## Technology Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Vanilla JS for maximum performance
- **Chart.js**: Interactive data visualization

### Design
- **Dark Theme**: Easy on the eyes for long coding sessions
- **Responsive**: Mobile-first design approach
- **Animations**: Smooth transitions and micro-interactions
- **Icons**: Font Awesome 6 for consistent iconography

## File Structure

```
dashboard/
├── index.html              # Main dashboard HTML
├── css/
│   └── styles.css         # Complete styling (1024 lines)
├── js/
│   ├── dashboard.js       # Main dashboard logic (545 lines)
│   ├── charts.js          # Chart.js configurations (565 lines)
│   └── api.js             # API integration layer (520 lines)
├── assets/                # Images and other assets
└── README.md             # This file
```

## Getting Started

### 1. Open the Dashboard

Simply open `index.html` in a modern web browser:

```bash
# Using Python's built-in server
cd dashboard
python3 -m http.server 8080

# Or using Node.js http-server
npx http-server -p 8080

# Then open http://localhost:8080 in your browser
```

### 2. Connect to Backend (Optional)

The dashboard works with mock data by default. To connect to the LazyBob backend:

1. Update API configuration in `js/api.js`:
```javascript
const API_CONFIG = {
    baseURL: 'http://your-backend-url/api',
    timeout: 30000
};
```

2. Enable WebSocket for real-time updates:
```javascript
// In js/api.js, uncomment:
dashboardWS.connect();
```

### 3. Customize

Edit the configuration in `js/dashboard.js`:

```javascript
const state = {
    currentSection: 'overview',
    refreshInterval: 30000, // Auto-refresh interval
    // ... other settings
};
```

## Features in Detail

### Navigation
- **Sidebar Navigation**: Quick access to all sections
- **Responsive Menu**: Mobile-friendly hamburger menu
- **Active States**: Visual feedback for current section
- **Smooth Transitions**: Animated section changes

### Data Visualization
- **Line Charts**: Activity trends and usage patterns
- **Doughnut Charts**: Language and mode distribution
- **Bar Charts**: Complexity and model usage
- **Pie Charts**: Category breakdowns
- **Progress Bars**: Quality metrics and usage indicators

### Interactivity
- **Real-time Updates**: Auto-refresh every 30 seconds
- **Manual Refresh**: Refresh button with animation
- **Search**: Global search functionality
- **Filters**: Date range pickers and dropdown filters
- **Actions**: Run analysis, test AI, create workflows

### Notifications
- **Toast Messages**: Non-intrusive notifications
- **Loading Overlay**: Visual feedback during operations
- **Status Indicators**: System health and connection status
- **Error Handling**: Graceful error messages

## API Integration

### Available Endpoints

The dashboard expects the following API endpoints:

#### Code Analysis
- `POST /api/code/analyze` - Run code analysis
- `GET /api/code/metrics` - Get code metrics
- `GET /api/code/complexity` - Get complexity report
- `GET /api/code/dependencies` - Get dependencies

#### Bob Integration
- `GET /api/bob/usage` - Get Bobcoin usage
- `GET /api/bob/history` - Get usage history
- `GET /api/bob/session/current` - Get current session
- `POST /api/bob/session/:id/export` - Export session

#### watsonx AI
- `POST /api/watsonx/suggest` - Get code suggestions
- `POST /api/watsonx/review` - Review code
- `POST /api/watsonx/analyze` - Analyze code
- `GET /api/watsonx/stats` - Get AI statistics

#### Workflows
- `GET /api/workflows` - List workflows
- `POST /api/workflows` - Create workflow
- `POST /api/workflows/:id/execute` - Execute workflow
- `GET /api/workflows/executions` - Get execution history

#### Reports
- `POST /api/reports/generate` - Generate report
- `GET /api/reports` - List reports
- `GET /api/reports/:id/download` - Download report

### Mock Data

The dashboard includes comprehensive mock data for development:

```javascript
// Use mock data
const data = window.API.mock.getCodeAnalysis();

// Or fetch from API with fallback
const data = await window.API.fetchWithFallback(
    () => window.API.code.getMetrics(),
    window.API.mock.getCodeAnalysis()
);
```

## Customization

### Colors

Edit CSS variables in `css/styles.css`:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #10b981;
    /* ... more colors */
}
```

### Charts

Customize charts in `js/charts.js`:

```javascript
const colors = {
    primary: '#667eea',
    secondary: '#764ba2',
    /* ... more colors */
};
```

### Layout

Adjust layout variables:

```css
:root {
    --sidebar-width: 260px;
    --header-height: 70px;
}
```

## Browser Support

- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions
- Safari: ✅ Latest 2 versions
- Mobile browsers: ✅ iOS Safari, Chrome Mobile

## Performance

- **Lazy Loading**: Charts load on demand
- **Caching**: API responses cached for 1 minute
- **Debouncing**: Search and filter inputs debounced
- **Optimized Rendering**: Minimal DOM manipulation
- **Code Splitting**: Modular JavaScript architecture

## Accessibility

- **Semantic HTML**: Proper heading hierarchy
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA compliant
- **Focus Indicators**: Visible focus states

## Development

### Adding New Sections

1. Add HTML section in `index.html`:
```html
<section id="new-section" class="content-section">
    <!-- Your content -->
</section>
```

2. Add navigation item:
```html
<a href="#new-section" class="nav-item" data-section="new-section">
    <i class="fas fa-icon"></i>
    <span>New Section</span>
</a>
```

3. Add section loader in `js/dashboard.js`:
```javascript
function loadNewSection() {
    // Load section data
}
```

### Adding New Charts

1. Add canvas in HTML:
```html
<canvas id="newChart"></canvas>
```

2. Create chart function in `js/charts.js`:
```javascript
function initNewChart() {
    const canvas = document.getElementById('newChart');
    // Chart configuration
}
```

3. Call in initialization:
```javascript
function createAllCharts() {
    // ... existing charts
    initNewChart();
}
```

## Troubleshooting

### Charts Not Displaying
- Ensure Chart.js CDN is loaded
- Check browser console for errors
- Verify canvas elements exist

### API Errors
- Check API endpoint URLs
- Verify CORS configuration
- Check network tab in DevTools

### Styling Issues
- Clear browser cache
- Check CSS file is loaded
- Verify CSS variables are defined

## Future Enhancements

- [ ] Real-time collaboration features
- [ ] Custom dashboard layouts
- [ ] Advanced filtering and search
- [ ] Export dashboard as PDF
- [ ] Dark/Light theme toggle
- [ ] Customizable widgets
- [ ] Integration with more AI models
- [ ] Advanced analytics and predictions

## Contributing

To contribute to the dashboard:

1. Follow the existing code style
2. Test in multiple browsers
3. Ensure responsive design
4. Add comments for complex logic
5. Update this README if needed

## License

MIT License - See main project LICENSE file

## Support

For issues or questions:
- Check the troubleshooting section
- Review the code comments
- Open an issue on GitHub

---

**Built with ❤️ for the LazyBob project**