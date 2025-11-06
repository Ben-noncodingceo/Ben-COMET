#!/bin/bash

# 创建一个简单的 PNG 图标
# 使用 ImageMagick 创建一个渐变图标

echo "Creating application icon..."

# 检查是否安装了 ImageMagick
if ! command -v convert &> /dev/null; then
    echo "ImageMagick not installed. Skipping icon creation."
    echo "The app will use Electron's default icon."
    exit 0
fi

# 创建 1024x1024 的图标
convert -size 1024x1024 \
    gradient:'#667eea-#764ba2' \
    -gravity center \
    -font "Helvetica-Bold" \
    -pointsize 120 \
    -fill white \
    -annotate +0-80 "Ben" \
    -pointsize 100 \
    -annotate +0+80 "COMET" \
    -pointsize 60 \
    -annotate +0+180 "📊" \
    build/icon.png

echo "Icon created at build/icon.png"

# 如果在 macOS 上，尝试创建 icns 文件
if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v iconutil &> /dev/null; then
        echo "Creating macOS icon..."
        mkdir -p build/icon.iconset

        # 生成各种尺寸
        sips -z 16 16     build/icon.png --out build/icon.iconset/icon_16x16.png
        sips -z 32 32     build/icon.png --out build/icon.iconset/icon_16x16@2x.png
        sips -z 32 32     build/icon.png --out build/icon.iconset/icon_32x32.png
        sips -z 64 64     build/icon.png --out build/icon.iconset/icon_32x32@2x.png
        sips -z 128 128   build/icon.png --out build/icon.iconset/icon_128x128.png
        sips -z 256 256   build/icon.png --out build/icon.iconset/icon_128x128@2x.png
        sips -z 256 256   build/icon.png --out build/icon.iconset/icon_256x256.png
        sips -z 512 512   build/icon.png --out build/icon.iconset/icon_256x256@2x.png
        sips -z 512 512   build/icon.png --out build/icon.iconset/icon_512x512.png
        sips -z 1024 1024 build/icon.png --out build/icon.iconset/icon_512x512@2x.png

        iconutil -c icns build/icon.iconset -o build/icon.icns
        rm -rf build/icon.iconset
        echo "macOS icon created at build/icon.icns"
    fi
fi

echo "Icon generation complete!"
