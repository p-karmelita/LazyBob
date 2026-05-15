# Developer Onboarding with LazyBob

Examples of using LazyBob to accelerate new developer onboarding.

## Quick Start for New Developers

### Day 1: Understanding the Codebase

```bash
# Step 1: Analyze the project structure
lazybob analyze ./src

# Step 2: Generate comprehensive documentation
lazybob docs ./src -o ./onboarding-docs -t "Project Overview"

# Step 3: Review code quality
lazybob review ./src --dry-run
```

### Week 1: Getting Productive

```bash
# Understand specific modules
lazybob analyze ./src/core
lazybob analyze ./src/services
lazybob analyze ./src/utils

# Generate module documentation
lazybob docs ./src/core -o ./docs/core -t "Core Module"
lazybob docs ./src/services -o ./docs/services -t "Services"
```

## Onboarding Workflows

### Complete Onboarding Script

```bash
#!/bin/bash
# onboard-developer.sh

echo "🚀 Welcome to the project! Let's get you started..."

# 1. Project Overview
echo "\n📊 Step 1: Analyzing project structure..."
lazybob analyze ./src > onboarding/analysis.txt

# 2. Generate Documentation
echo "\n📚 Step 2: Generating documentation..."
lazybob docs ./src -o ./onboarding/docs -t "Project Documentation"

# 3. Code Quality Review
echo "\n🔍 Step 3: Reviewing code quality..."
lazybob review ./src --dry-run > onboarding/review.txt

# 4. Generate Tests Overview
echo "\n🧪 Step 4: Analyzing test coverage..."
lazybob analyze ./tests > onboarding/tests-analysis.txt

echo "\n✅ Onboarding materials generated!"
echo "Check the ./onboarding directory for:"
echo "  - analysis.txt: Project structure and metrics"
echo "  - docs/: Comprehensive API documentation"
echo "  - review.txt: Code quality insights"
echo "  - tests-analysis.txt: Test coverage overview"
```

### Module-Specific Onboarding

```bash
#!/bin/bash
# onboard-to-module.sh

MODULE=$1

if [ -z "$MODULE" ]; then
  echo "Usage: ./onboard-to-module.sh <module-name>"
  exit 1
fi

echo "Onboarding to $MODULE module..."

# Analyze module
lazybob analyze ./src/$MODULE

# Generate module docs
lazybob docs ./src/$MODULE \
  -o ./onboarding/$MODULE \
  -t "$MODULE Module Documentation"

# Review module code
lazybob review ./src/$MODULE --dry-run

echo "✅ $MODULE onboarding complete!"
```

## Learning Paths

### Path 1: Frontend Developer

```bash
# Focus on UI components
lazybob analyze ./src/components
lazybob docs ./src/components -o ./docs/components

# Understand state management
lazybob analyze ./src/store
lazybob docs ./src/store -o ./docs/store

# Review styling
lazybob analyze ./src/styles
```

### Path 2: Backend Developer

```bash
# Understand API layer
lazybob analyze ./src/api
lazybob docs ./src/api -o ./docs/api

# Review data models
lazybob analyze ./src/models
lazybob docs ./src/models -o ./docs/models

# Check services
lazybob analyze ./src/services
lazybob docs ./src/services -o ./docs/services
```

### Path 3: Full Stack Developer

```bash
# Complete overview
lazybob analyze ./src
lazybob docs ./src -o ./docs/complete

# Focus areas
lazybob analyze ./src/api
lazybob analyze ./src/components
lazybob analyze ./src/services
```

## Interactive Onboarding

### Guided Tour

```bash
# Start with project info
lazybob info

# Analyze main entry point
lazybob analyze ./src/index.ts

# Understand core functionality
lazybob analyze ./src/core

# Review key services
lazybob analyze ./src/services

# Check utilities
lazybob analyze ./src/utils
```

### Hands-On Practice

```bash
# 1. Make a small change
lazybob refactor ./src/utils/example.ts \
  --description "Practice refactoring" \
  --dry-run

# 2. Generate tests
lazybob test ./src/utils/example.ts --dry-run

# 3. Review changes
lazybob review ./src/utils/example.ts --dry-run
```

## Common Onboarding Tasks

### Understanding Architecture

```bash
# Generate architecture documentation
lazybob docs ./src \
  -o ./docs/architecture \
  -t "System Architecture" \
  --diagrams

# Analyze dependencies
lazybob analyze ./src > architecture-analysis.txt
```

### Learning Code Patterns

```bash
# Analyze patterns in core modules
lazybob analyze ./src/core

# Generate pattern documentation
lazybob docs ./src/core \
  -o ./docs/patterns \
  -t "Code Patterns and Best Practices"
```

### Setting Up Development Environment

```bash
# Check project dependencies
lazybob analyze ./package.json

# Review configuration
lazybob analyze ./src/config

# Understand build process
lazybob analyze ./scripts
```

## Onboarding Checklist

Create a checklist for new developers:

```markdown
# Developer Onboarding Checklist

## Week 1: Understanding
- [ ] Run project analysis: `lazybob analyze ./src`
- [ ] Read generated documentation
- [ ] Review code quality report
- [ ] Understand project structure
- [ ] Set up development environment

## Week 2: Exploration
- [ ] Analyze core modules
- [ ] Generate module documentation
- [ ] Review key services
- [ ] Understand data flow
- [ ] Run existing tests

## Week 3: Contributing
- [ ] Make first small change
- [ ] Generate tests for changes
- [ ] Run code review
- [ ] Submit first PR
- [ ] Get code reviewed

## Week 4: Productivity
- [ ] Implement small feature
- [ ] Write comprehensive tests
- [ ] Update documentation
- [ ] Help onboard next developer
```

## Tips for Onboarding

1. **Start Small**: Begin with analysis and documentation
2. **Use Dry Run**: Preview changes before applying
3. **Ask Questions**: Use Bob IDE's Ask mode
4. **Review Code**: Learn from existing patterns
5. **Practice**: Use automation for learning

## Onboarding Resources

### Generated Materials

```bash
# Create onboarding package
mkdir -p onboarding/{docs,analysis,examples}

# Generate documentation
lazybob docs ./src -o ./onboarding/docs

# Create analysis reports
lazybob analyze ./src > ./onboarding/analysis/project.txt
lazybob analyze ./src/core > ./onboarding/analysis/core.txt
lazybob analyze ./src/services > ./onboarding/analysis/services.txt

# Generate example tests
lazybob test ./src/examples/sample.ts \
  --dry-run > ./onboarding/examples/test-example.txt
```

### Learning Scripts

```bash
# Create learning script
cat > learn-module.sh << 'EOF'
#!/bin/bash
MODULE=$1
echo "Learning about $MODULE..."
lazybob analyze ./src/$MODULE
lazybob docs ./src/$MODULE -o ./learning/$MODULE
echo "Check ./learning/$MODULE for documentation"
EOF

chmod +x learn-module.sh
```

## Mentorship Integration

### Mentor-Guided Onboarding

```bash
# Mentor prepares materials
lazybob docs ./src -o ./mentor-docs --private
lazybob analyze ./src > ./mentor-docs/analysis.txt

# New developer reviews
lazybob analyze ./src
lazybob docs ./src -o ./my-understanding

# Compare understanding
diff ./mentor-docs ./my-understanding
```

### Pair Programming Setup

```bash
# Analyze code together
lazybob analyze ./src/feature

# Review proposed changes
lazybob refactor ./src/feature --dry-run

# Generate tests together
lazybob test ./src/feature --dry-run
```

## Success Metrics

Track onboarding progress:

```bash
# Week 1: Understanding
lazybob analyze ./src | grep "Total Files"

# Week 2: Contribution
git log --author="new-developer" --oneline

# Week 3: Independence
lazybob review ./src/new-feature --dry-run

# Week 4: Productivity
git diff --stat main..new-developer-branch
```

## Continuous Learning

```bash
# Weekly code review
lazybob review ./src --dry-run

# Monthly documentation update
lazybob docs ./src -o ./docs

# Quarterly architecture review
lazybob analyze ./src --diagrams