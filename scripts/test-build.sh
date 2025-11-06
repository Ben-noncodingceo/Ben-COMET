#!/bin/bash

# 简单的本地测试构建脚本
# 用于快速测试 Electron 应用是否能正确打包

echo "🧪 Testing Electron build..."

# 1. 清理之前的构建
echo "🧹 Cleaning previous builds..."
rm -rf dist/

# 2. 确保依赖已安装
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# 3. 构建前端（简化版）
echo "🔨 Building client..."
cd client
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build
cd ..

# 4. 构建后端（简化版）
echo "🔨 Building server..."
cd server
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build
cd ..

# 5. 确保有占位图标
mkdir -p build
if [ ! -f "build/icon.png" ]; then
    echo "📸 Note: No icon found. Electron will use default icon."
fi

# 6. 打包（仅目录，不创建 DMG）
echo "📦 Packaging app (dir only)..."
npx electron-builder --mac --dir

# 7. 检查结果
if [ -d "dist/mac/Ben-COMET.app" ]; then
    echo "✅ Build successful!"
    echo "📁 App location: dist/mac/Ben-COMET.app"
    echo ""
    echo "🚀 You can test the app by running:"
    echo "   open dist/mac/Ben-COMET.app"
else
    echo "❌ Build failed - .app not found"
    exit 1
fi
