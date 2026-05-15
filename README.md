# LazyBob - AI-Powered Development Accelerator

> **Turn ideas into impact faster** - An intelligent development assistant powered by IBM Bob

## 🎯 Project Overview

LazyBob is a comprehensive development accelerator built for the IBM Bob Hackathon. It leverages IBM Bob's AI capabilities to help developers work smarter and faster by automating repetitive tasks, generating documentation, analyzing code, and providing intelligent assistance throughout the development lifecycle.

## 🚀 Key Features

### 1. **Rapid Code Understanding**
- Analyze existing codebases and explain architecture
- Generate visual flow diagrams
- Create onboarding guides for new team members
- Identify dependencies and relationships

### 2. **Automated Documentation Generation**
- Generate comprehensive README files
- Create API documentation automatically
- Add intelligent inline code comments
- Generate test documentation

### 3. **Task Automation**
- Generate boilerplate code
- Automate refactoring tasks
- Create test cases automatically
- Generate configuration files

### 4. **Intelligent Debugging**
- Analyze errors with context
- Identify root causes
- Suggest fixes
- Improve code quality

## 🏗️ Project Structure

```
lazybob/
├── .bob/                          # Bob-specific configurations
│   ├── rules-code/                # Code mode rules
│   ├── rules-advanced/            # Advanced mode rules
│   ├── rules-ask/                 # Ask mode rules
│   └── rules-plan/                # Plan mode rules
├── src/
│   ├── core/                      # Core functionality
│   │   ├── bob-integration/       # Bob IDE integration layer
│   │   ├── code-analyzer/         # Code analysis engine
│   │   ├── doc-generator/         # Documentation generator
│   │   └── task-automator/        # Task automation engine
│   ├── watsonx/                   # Optional watsonx integration
│   │   ├── orchestrate/           # Orchestrate agents
│   │   └── ai/                    # watsonx.ai integration
│   ├── utils/                     # Utility functions
│   └── types/                     # TypeScript type definitions
├── examples/                      # Example use cases
│   ├── onboarding/                # Onboarding examples
│   ├── documentation/             # Documentation examples
│   └── automation/                # Automation examples
├── tests/                         # Test suites
├── docs/                          # Project documentation
├── bob_sessions/                  # Bob task session reports (for judging)
└── scripts/                       # Utility scripts
```

## 📋 Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0
- **IBM Bob IDE**: Installed and configured
- **IBMid**: For Bob authentication
- **Git**: For version control

### Optional (for watsonx integration)
- IBM Cloud account with watsonx access
- watsonx.ai API credentials
- watsonx Orchestrate access

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lazybob
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials (if using watsonx)
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## 🎮 Usage

### Development Mode
```bash
npm run dev
```

### Code Analysis
```bash
npm run analyze -- <path-to-code>
```

### Generate Documentation
```bash
npm run generate-docs -- <path-to-code>
```

### Task Automation
```bash
npm run automate -- <task-type>
```

### Run Tests
```bash
npm test
```

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Formatting
```bash
npm run format
npm run format:check
```

## 🤖 Working with IBM Bob

### Bob IDE Setup

1. **Install Bob IDE** following the [official instructions](https://ibm.github.io/bob-ide/)
2. **Sign in** with your hackathon IBMid
3. **Select the hackathon team**: `ibm-hackathon-xxx`
4. **Monitor Bobcoins**: Check usage in Settings → General

### Bob Modes

This project uses custom Bob modes for different tasks:

- **Code Mode**: For implementation and code changes
- **Advanced Mode**: For complex tasks with MCP/Browser tools
- **Ask Mode**: For explanations and documentation
- **Plan Mode**: For architecture and design decisions

### Best Practices

- Use Bob's context mentions (`@file`, `@folder`) for precise assistance
- Leverage literate coding for inline code generation
- Create checkpoints before major changes
- Export task sessions regularly for judging

## 📊 Monitoring Bobcoin Usage

Track your Bobcoin consumption:
1. Open Bob IDE Settings
2. Navigate to General section
3. View usage percentage
4. Plan tasks to optimize coin usage

**Hackathon Allocation**: 40 Bobcoins per team member

## 🧪 Testing Strategy

- **Unit Tests**: `npm test`
- **Coverage**: `npm run test:coverage`
- **UI Tests**: `npm run test:ui`

## 📚 Documentation

- [Project Analysis](./PROJECT_ANALYSIS.md) - Detailed project analysis and architecture
- [API Documentation](./docs/api.md) - API reference (generated)
- [Examples](./examples/) - Usage examples and tutorials
- [Bob Sessions](./bob_sessions/) - Task session reports for judging

## 🎯 Hackathon Deliverables

### Required
- ✅ Working solution using IBM Bob IDE
- ✅ Bob task session reports in `bob_sessions/`
- ✅ Clean, documented code repository
- ✅ README with setup instructions
- ✅ Demo video/presentation

### Optional
- ⚡ watsonx.ai integration
- ⚡ watsonx Orchestrate agents
- ⚡ Advanced automation workflows

## 🔒 Security Notes

**CRITICAL**: Never commit credentials to the repository!

- IBM Cloud API keys
- watsonx credentials
- Bob authentication tokens
- Any sensitive configuration

All credentials are in `.gitignore` and will trigger account suspension if exposed.

## 🤝 Contributing

This is a hackathon project. For team collaboration:

1. Create feature branches
2. Use Bob for code reviews
3. Export Bob sessions for each major feature
4. Keep documentation updated

## 📝 License

MIT License - See [LICENSE](./LICENSE) file for details

## 👥 Team

LazyBob Team - IBM Bob Hackathon 2026

## 🙏 Acknowledgments

- IBM Bob team for the amazing development tool
- IBM watsonx team for AI capabilities
- Hackathon organizers and mentors

## 📞 Support

For hackathon-specific questions:
- Check the [Hackathon Guide](./docs/HACKATHON_GUIDE.md)
- Review [Bob FAQ](https://ibm.github.io/bob-ide/faq)
- Contact hackathon support team

---

**Built with ❤️ using IBM Bob IDE**