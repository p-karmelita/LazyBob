# Documentation Generation Examples

Examples of generating comprehensive documentation with LazyBob.

## Table of Contents

1. [Basic Documentation](#basic-documentation)
2. [API Documentation](#api-documentation)
3. [Multi-Format Output](#multi-format-output)
4. [Advanced Options](#advanced-options)
5. [Custom Templates](#custom-templates)

## Basic Documentation

### Simple Documentation

```bash
# Generate markdown documentation
lazybob docs ./src

# Specify output directory
lazybob docs ./src -o ./api-docs

# Add title and description
lazybob docs ./src \
  -t "My Project API" \
  -d "Comprehensive API documentation for My Project"
```

### Documentation with Options

```bash
# Include private members
lazybob docs ./src --private

# Exclude examples
lazybob docs ./src --no-examples

# Include diagrams
lazybob docs ./src --diagrams
```

## API Documentation

### Module Documentation

```bash
# Document specific module
lazybob docs ./src/core/api \
  -o ./docs/api \
  -t "API Module" \
  -f markdown

# Document with full details
lazybob docs ./src/services \
  -o ./docs/services \
  -t "Services Documentation" \
  --private \
  --diagrams
```

### Library Documentation

```bash
# Document entire library
lazybob docs ./src \
  -o ./docs/api \
  -t "Library API Reference" \
  -d "Complete API reference for the library" \
  -f html \
  --diagrams
```

## Multi-Format Output

### Markdown Documentation

```bash
# Generate markdown (default)
lazybob docs ./src -o ./docs -f markdown

# Markdown with all options
lazybob docs ./src \
  -o ./docs/markdown \
  -f markdown \
  -t "API Documentation" \
  --diagrams \
  --private
```

### HTML Documentation

```bash
# Generate HTML documentation
lazybob docs ./src -o ./docs/html -f html

# HTML with styling
lazybob docs ./src \
  -o ./docs/website \
  -f html \
  -t "Project Documentation" \
  -d "Interactive API documentation"
```

### JSON Documentation

```bash
# Generate JSON for processing
lazybob docs ./src -o ./docs/json -f json

# JSON for API consumption
lazybob docs ./src \
  -o ./api-spec \
  -f json \
  -t "API Specification"
```

## Advanced Options

### Comprehensive Documentation

```bash
# Full documentation with all features
lazybob docs ./src \
  -o ./docs/complete \
  -f html \
  -t "Complete API Documentation" \
  -d "Comprehensive documentation with examples, diagrams, and private members" \
  --diagrams \
  --private
```

### Selective Documentation

```bash
# Document only public API
lazybob docs ./src/api \
  -o ./docs/public-api \
  -t "Public API" \
  --no-examples

# Document with examples only
lazybob docs ./src/examples \
  -o ./docs/examples \
  -t "Code Examples"
```

## Custom Templates

### Using Custom Descriptions

```bash
# Add detailed description
lazybob docs ./src \
  -o ./docs \
  -t "MyApp API" \
  -d "MyApp provides a comprehensive API for building modern applications. This documentation covers all public interfaces, classes, and functions."
```

### Module-Specific Documentation

```bash
# Document authentication module
lazybob docs ./src/auth \
  -o ./docs/auth \
  -t "Authentication Module" \
  -d "Secure authentication and authorization system" \
  --private

# Document data layer
lazybob docs ./src/data \
  -o ./docs/data \
  -t "Data Layer" \
  -d "Database access and ORM functionality"
```

## Documentation Workflows

### Complete Documentation Pipeline

```bash
#!/bin/bash
# generate-all-docs.sh

echo "Generating complete documentation..."

# 1. Generate markdown for developers
lazybob docs ./src \
  -o ./docs/markdown \
  -f markdown \
  -t "Developer Documentation" \
  --private

# 2. Generate HTML for website
lazybob docs ./src \
  -o ./docs/website \
  -f html \
  -t "API Reference" \
  -d "Interactive API documentation"

# 3. Generate JSON for tools
lazybob docs ./src \
  -o ./docs/json \
  -f json \
  -t "API Specification"

echo "Documentation generation complete!"
```

### Module Documentation

```bash
#!/bin/bash
# document-modules.sh

# Document each module separately
for module in core utils services api; do
  echo "Documenting $module..."
  lazybob docs ./src/$module \
    -o ./docs/$module \
    -t "${module^} Module" \
    -f markdown
done
```

## Best Practices

1. **Use descriptive titles** - Help users understand the documentation scope
2. **Add descriptions** - Provide context and overview
3. **Choose appropriate format** - Markdown for developers, HTML for websites
4. **Include examples** - Help users understand usage
5. **Document public API first** - Focus on what users need
6. **Update regularly** - Keep documentation in sync with code

## Tips

### For Public Libraries

```bash
# Focus on public API
lazybob docs ./src \
  -o ./docs \
  -t "Library API" \
  -d "Public API reference" \
  -f html
```

### For Internal Projects

```bash
# Include everything
lazybob docs ./src \
  -o ./docs \
  -t "Internal Documentation" \
  --private \
  --diagrams
```

### For Tutorials

```bash
# Emphasize examples
lazybob docs ./examples \
  -o ./docs/tutorials \
  -t "Tutorials and Examples"
```

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Generate Documentation

on:
  push:
    branches: [main]

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - run: lazybob docs ./src -o ./docs -f html
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

## Output Examples

### Markdown Output Structure

```
docs/
├── API.md              # Main documentation
├── modules/            # Module documentation
│   ├── core.md
│   ├── utils.md
│   └── services.md
└── assets/            # Diagrams and images
    └── architecture.svg
```

### HTML Output Structure

```
docs/
├── index.html         # Main page
├── modules/           # Module pages
│   ├── core.html
│   ├── utils.html
│   └── services.html
├── assets/           # Styles and scripts
│   ├── style.css
│   └── script.js
└── search/           # Search functionality
    └── index.json
```

### JSON Output Structure

```json
{
  "modules": [...],
  "functions": [...],
  "classes": [...],
  "types": [...],
  "metadata": {
    "title": "API Documentation",
    "version": "1.0.0",
    "generated": "2024-01-01T00:00:00Z"
  }
}
```

## Troubleshooting

### Large Codebases

```bash
# Document in chunks
lazybob docs ./src/core -o ./docs/core
lazybob docs ./src/utils -o ./docs/utils
lazybob docs ./src/services -o ./docs/services
```

### Missing Documentation

```bash
# Include private members to see all code
lazybob docs ./src --private
```

### Slow Generation

```bash
# Exclude examples and diagrams
lazybob docs ./src --no-examples