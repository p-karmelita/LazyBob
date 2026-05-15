# LazyBob Setup Guide

Complete guide for setting up and running the LazyBob project for the IBM Bob Hackathon.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [IBM Bob Setup](#ibm-bob-setup)
3. [Project Installation](#project-installation)
4. [Configuration](#configuration)
5. [Optional: watsonx Setup](#optional-watsonx-setup)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher
- **Git**: For version control
- **VS Code**: Recommended IDE

### Verify Installation
```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
git --version   # Any recent version
```

### IBM Bob Account
- Registered for IBM Bob Hackathon
- Received invitation email to join hackathon team
- Created IBMid for authentication

## IBM Bob Setup

### Step 1: Install Bob IDE

1. **Download Bob IDE**
   - Visit [Bob IDE Installation](https://ibm.github.io/bob-ide/installation)
   - Download for your operating system
   - Follow installation instructions

2. **Verify System Requirements**
   - Check minimum system requirements
   - Ensure compatible OS version
   - Verify available disk space

### Step 2: Sign In to Bob

1. **Launch Bob IDE**
   ```bash
   # Open VS Code with Bob extension
   code .
   ```

2. **Authenticate**
   - Click "Log in to Bob" button
   - Complete IBMid authentication in browser
   - Return to Bob IDE after authentication

3. **Select Hackathon Team**
   - Open Bob Settings (gear icon)
   - Navigate to General section
   - Select team: `ibm-hackathon-xxx`
   - Verify Bobcoin allocation (40 coins)

### Step 3: Configure Bob IDE

1. **Enable Required Features**
   - Open Bob Settings
   - Enable "Auto-approve" for trusted operations (optional)
   - Configure custom modes (will be set up by project)

2. **Set Up Context**
   - Familiarize with context mentions (`@file`, `@folder`)
   - Learn about Bob modes (Code, Plan, Ask, Advanced)
   - Review Bob tips and features

### Step 4: Configure Firewall (if needed)

If you experience network issues:
```bash
# Allow outbound traffic to Bob API endpoints
# Refer to: https://ibm.github.io/bob-ide/firewall
```

## Project Installation

### Step 1: Clone Repository

```bash
# Clone the repository
git clone <repository-url>
cd lazybob

# Verify you're in the correct directory
pwd  # Should show /path/to/lazybob
```

### Step 2: Install Dependencies

```bash
# Install all npm packages
npm install

# This will install:
# - Core dependencies (TypeScript, Zod, Commander, etc.)
# - Development tools (ESLint, Prettier, Vitest)
# - Optional watsonx packages (if needed)
```

### Step 3: Verify Installation

```bash
# Check that all dependencies are installed
npm list --depth=0

# Verify TypeScript compilation
npm run type-check

# Run tests to ensure everything works
npm test
```

## Configuration

### Step 1: Environment Variables

1. **Copy Example Environment File**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` File**
   ```bash
   # Open in your editor
   nano .env  # or code .env
   ```

3. **Configure Required Variables**
   ```env
   # IBM Bob Configuration (Required)
   BOB_TEAM_ID=ibm-hackathon-xxx
   BOB_API_KEY=your_bob_api_key_here
   
   # Application Configuration
   NODE_ENV=development
   LOG_LEVEL=info
   
   # Feature Flags
   ENABLE_WATSONX_AI=false
   ENABLE_WATSONX_ORCHESTRATE=false
   ENABLE_ADVANCED_ANALYSIS=true
   ENABLE_AUTO_DOCUMENTATION=true
   ```

### Step 2: Bob Configuration Files

The project includes pre-configured Bob rules:
```
.bob/
├── rules-code/AGENTS.md       # Code mode rules
├── rules-advanced/AGENTS.md   # Advanced mode rules
├── rules-ask/AGENTS.md        # Ask mode rules
└── rules-plan/AGENTS.md       # Plan mode rules
```

These files are automatically loaded by Bob IDE.

### Step 3: Verify Configuration

```bash
# Build the project
npm run build

# Run in development mode
npm run dev

# Should see: "LazyBob development server running..."
```

## Optional: watsonx Setup

### Prerequisites
- IBM Cloud account (hackathon-provisioned)
- watsonx.ai access
- watsonx Orchestrate access (optional)

### Step 1: Request IBM Cloud Account

1. **Submit Request**
   - Visit: https://www.ibm.com/account/reg/us-en/signup?formid=urx-54370
   - Use your hackathon registration email
   - Create or sign in with IBMid

2. **Wait for Invitation**
   - Check email for IBM Cloud invitation
   - Accept invitation to join cloud account
   - Verify account name: `xxxxxxx - watsonx`

### Step 2: Access watsonx.ai

1. **Navigate to watsonx.ai**
   - Log in to IBM Cloud dashboard
   - Go to Resource List
   - Find "watsonx-Hackathon" service
   - Click "Launch watsonx.ai"

2. **Get API Credentials**
   - Go to watsonx.ai home page
   - Scroll to "Developer access" section
   - Select your project
   - Copy Project ID
   - Create API key
   - Save credentials securely

3. **Configure Environment**
   ```env
   # Add to .env file
   WATSONX_API_KEY=your_api_key_here
   WATSONX_PROJECT_ID=your_project_id_here
   WATSONX_ENDPOINT=https://us-south.ml.cloud.ibm.com
   
   # Enable watsonx features
   ENABLE_WATSONX_AI=true
   ```

### Step 3: Access watsonx Orchestrate (Optional)

1. **Navigate to Orchestrate**
   - From IBM Cloud dashboard
   - Go to Resource List → AI/Machine Learning
   - Select "watsonx-Hackathon Orchestrate"
   - Click "Launch watsonx Orchestrate"

2. **Get Orchestrate Credentials**
   - Access Orchestrate settings
   - Generate API key
   - Note endpoint URL

3. **Configure Environment**
   ```env
   # Add to .env file
   ORCHESTRATE_API_KEY=your_orchestrate_key_here
   ORCHESTRATE_ENDPOINT=your_endpoint_here
   
   # Enable Orchestrate features
   ENABLE_WATSONX_ORCHESTRATE=true
   ```

### Step 4: Verify watsonx Integration

```bash
# Test watsonx.ai connection
npm run test -- watsonx

# Should see: "watsonx.ai connection successful"
```

## Verification

### Step 1: Run All Checks

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Formatting check
npm run format:check

# Run tests
npm test

# Build project
npm run build
```

### Step 2: Test Core Features

```bash
# Test code analysis
npm run analyze -- ./src

# Test documentation generation
npm run generate-docs -- ./src

# Test task automation
npm run automate -- help
```

### Step 3: Verify Bob Integration

1. **Open Bob IDE**
   - Open project in VS Code with Bob
   - Check Bob is connected (green indicator)
   - Verify Bobcoin balance in settings

2. **Test Bob Interaction**
   - Open Bob chat
   - Send test message: "Explain the project structure"
   - Verify Bob responds with project context

3. **Export Test Session**
   - Complete a simple task with Bob
   - Export session report
   - Verify report saved to `bob_sessions/`

## Troubleshooting

### Common Issues

#### 1. Bob IDE Not Connecting

**Symptoms**: Bob shows "Not connected" or authentication fails

**Solutions**:
```bash
# Check internet connection
ping ibm.com

# Verify IBMid credentials
# Re-authenticate in Bob IDE

# Check firewall settings
# Allow outbound traffic to Bob API endpoints

# Restart VS Code
code --disable-extensions
```

#### 2. Node.js Version Issues

**Symptoms**: "Error: Unsupported Node.js version"

**Solutions**:
```bash
# Check current version
node --version

# Install Node.js 18+ using nvm
nvm install 18
nvm use 18

# Or download from nodejs.org
```

#### 3. Dependency Installation Fails

**Symptoms**: npm install errors

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Try with legacy peer deps
npm install --legacy-peer-deps
```

#### 4. TypeScript Compilation Errors

**Symptoms**: Build fails with type errors

**Solutions**:
```bash
# Check TypeScript version
npx tsc --version

# Clean build artifacts
rm -rf dist

# Rebuild
npm run build

# Check for missing type definitions
npm install --save-dev @types/node
```

#### 5. watsonx Connection Issues

**Symptoms**: watsonx API calls fail

**Solutions**:
```bash
# Verify credentials in .env
cat .env | grep WATSONX

# Test API key validity
curl -X POST 'https://iam.cloud.ibm.com/identity/token' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d "grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=YOUR_API_KEY"

# Check IBM Cloud account status
# Verify credits haven't been exhausted
```

#### 6. Bobcoin Exhausted

**Symptoms**: Bob operations fail with "Insufficient Bobcoins"

**Solutions**:
- Monitor usage in Bob IDE settings
- Optimize queries to use fewer coins
- Use caching for repeated operations
- Consider using watsonx for some operations
- Contact hackathon support if needed

### Getting Help

#### Documentation Resources
- [LazyBob README](../README.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [IBM Bob FAQ](https://ibm.github.io/bob-ide/faq)
- [watsonx Documentation](https://www.ibm.com/watsonx)

#### Support Channels
- Hackathon support team
- IBM Bob community
- Project GitHub issues
- Team collaboration channels

### Best Practices

1. **Regular Backups**
   ```bash
   # Commit changes frequently
   git add .
   git commit -m "Progress checkpoint"
   
   # Export Bob sessions regularly
   # Save to bob_sessions/ directory
   ```

2. **Monitor Resources**
   - Check Bobcoin usage daily
   - Monitor IBM Cloud credits (if using watsonx)
   - Track API rate limits
   - Review error logs

3. **Security**
   - Never commit `.env` file
   - Keep credentials secure
   - Rotate API keys regularly
   - Review `.gitignore` before commits

4. **Development Workflow**
   - Use Bob modes appropriately
   - Create checkpoints before major changes
   - Write tests for new features
   - Document as you go

## Next Steps

After successful setup:

1. **Explore Examples**
   ```bash
   cd examples/
   # Review example use cases
   ```

2. **Read Documentation**
   - Review [ARCHITECTURE.md](./ARCHITECTURE.md)
   - Study [AGENTS.md](../AGENTS.md)
   - Check mode-specific rules in `.bob/rules-*/`

3. **Start Building**
   - Plan your features
   - Use Bob for implementation
   - Export sessions for judging
   - Document your progress

4. **Prepare for Demo**
   - Test all features
   - Create demo script
   - Prepare presentation
   - Export final Bob sessions

## Hackathon Checklist

- [ ] Bob IDE installed and authenticated
- [ ] Project cloned and dependencies installed
- [ ] Environment variables configured
- [ ] All tests passing
- [ ] Bob integration verified
- [ ] Optional: watsonx configured
- [ ] First Bob session exported
- [ ] Ready to start building!

---

**Need Help?** Check the [Troubleshooting](#troubleshooting) section or contact the hackathon support team.

**Ready to Build?** Start with the [README](../README.md) for usage instructions!