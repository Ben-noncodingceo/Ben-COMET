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

# Create build directory if it doesn't exist
mkdir -p build

# Create a placeholder icon if it doesn't exist
if [ ! -f "build/icon.png" ]; then
    echo "📸 Creating placeholder icon..."
    if command -v convert &> /dev/null; then
        # Use ImageMagick to create a gradient icon
        convert -size 512x512 gradient:'#667eea-#764ba2' \
            -gravity center \
            -font "Helvetica-Bold" \
            -pointsize 60 \
            -fill white \
            -annotate +0-40 "Ben" \
            -pointsize 50 \
            -annotate +0+40 "COMET" \
            build/icon.png
        echo "✅ Icon created"
    else
        echo "⚠️  ImageMagick not found, electron will use default icon"
    fi
fi

echo "🔨 Building client..."
npm run build:client

if [ $? -ne 0 ]; then
    echo "❌ Client build failed!"
    exit 1
fi

echo "🔨 Building server..."
npm run build:server

if [ $? -ne 0 ]; then
    echo "❌ Server build failed!"
    exit 1
fi

echo "📦 Creating macOS DMG..."
npm run build:electron

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo "📁 DMG file location:"
    ls -lh dist/*.dmg 2>/dev/null || echo "⚠️  No DMG files found in dist/"
    echo ""
    echo "📁 App location:"
    ls -lh dist/mac/*.app 2>/dev/null || echo "⚠️  No .app files found in dist/mac/"
else
    echo "❌ Build failed!"
    exit 1
fi
