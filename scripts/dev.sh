#!/bin/bash

# Development startup script for macOS

echo "🚀 Starting Ben-COMET in development mode..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start PostgreSQL with Docker if not running
if ! docker ps | grep -q ben-comet-db; then
    echo "🐳 Starting PostgreSQL database..."
    docker-compose up -d
    echo "⏳ Waiting for database to be ready..."
    sleep 5
fi

# Start the development server
echo "🌐 Starting development servers..."
npm run dev
