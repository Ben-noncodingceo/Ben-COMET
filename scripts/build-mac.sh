#!/bin/bash

# Ben-COMET Build Script for macOS

echo "🚀 Building Ben-COMET for macOS..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building client..."
npm run build:client

echo "🔨 Building server..."
npm run build:server

echo "📦 Creating macOS DMG..."
npm run build:electron

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 DMG file location: dist/*.dmg"
    ls -lh dist/*.dmg
else
    echo "❌ Build failed!"
    exit 1
fi
