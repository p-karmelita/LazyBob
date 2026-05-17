#!/bin/bash

# LazyBob Dashboard Startup Script

echo "🚀 Starting LazyBob Dashboard..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✓ Please configure your .env file with Bob API credentials"
    echo ""
fi

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✓ Build successful"
echo ""

# Start the server
echo "🌐 Starting dashboard server on http://localhost:3000"
echo "Press Ctrl+C to stop"
echo ""

node dist/server/index.js

# Made with Bob
