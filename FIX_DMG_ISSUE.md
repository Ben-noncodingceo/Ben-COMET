# 修复 macOS DMG 问题指南

## 问题描述

下载的 DMG 文件解压后，没有可运行的 .app 文件。

## 原因分析

主要原因：
1. ❌ 缺少应用图标文件（icon.icns）
2. ❌ electron-builder 配置引用了不存在的文件
3. ❌ 构建时文件打包不完整

## 已修复的内容

### 1. 更新 package.json 配置

**修复点：**
- ✅ 移除了对不存在图标文件的引用
- ✅ 简化了 macOS 构建配置
- ✅ 添加了 `extraResources` 确保正确打包
- ✅ 禁用了 `hardenedRuntime`（避免签名问题）

**新配置特点：**
```json
{
  "mac": {
    "target": ["dmg"],
    "type": "distribution",
    "hardenedRuntime": false,
    "gatekeeperAssess": false
  }
}
```

### 2. 更新 GitHub Actions 工作流

**新增步骤：**
- ✅ 自动创建占位图标（如果不存在）
- ✅ 使用 ImageMagick 生成渐变图标
- ✅ 后备方案：无图标时使用 Electron 默认图标

### 3. 更新构建脚本

**build-mac.sh 改进：**
- ✅ 自动检测并创建图标
- ✅ 更详细的错误检查
- ✅ 显示 .app 文件位置

**新增 test-build.sh：**
- ✅ 快速本地测试构建
- ✅ 只生成 .app（不创建 DMG）
- ✅ 用于验证打包是否正确

## 测试构建

### 方法 1：完整构建（推荐）

```bash
cd Ben-COMET

# 运行构建脚本
chmod +x scripts/build-mac.sh
./scripts/build-mac.sh

# 检查输出
ls -lh dist/*.dmg
ls -lh dist/mac/*.app
```

### 方法 2：快速测试

```bash
cd Ben-COMET

# 运行测试脚本（仅生成 .app，不打包 DMG）
chmod +x scripts/test-build.sh
./scripts/test-build.sh

# 测试应用
open dist/mac/Ben-COMET.app
```

### 方法 3：手动步骤

```bash
# 1. 安装依赖
npm install

# 2. 创建占位图标（可选）
mkdir -p build
# 如果有 ImageMagick：
convert -size 512x512 gradient:'#667eea-#764ba2' build/icon.png

# 3. 构建前后端
npm run build:client
npm run build:server

# 4. 打包 Electron 应用
npm run build:electron

# 5. 验证结果
ls -la dist/
```

## 验证 DMG 内容

### 挂载 DMG 检查

```bash
# 挂载 DMG
hdiutil attach dist/Ben-COMET-0.1.0.dmg

# 检查内容
ls -la /Volumes/Ben-COMET*

# 应该看到 Ben-COMET.app 文件
# 卸载
hdiutil detach /Volumes/Ben-COMET*
```

### 检查 .app 结构

```bash
# 查看 .app 内部结构
ls -la "dist/mac/Ben-COMET.app/Contents/"

# 应该包含：
# - MacOS/Ben-COMET （可执行文件）
# - Resources/ （资源文件）
# - Info.plist （应用信息）
```

## 重新发布

### 更新版本号

```bash
# 编辑 package.json，更新版本
# "version": "0.1.0" → "0.1.1"

# 同时更新 client/package.json 和 server/package.json
```

### 创建新的 Release

```bash
# 提交修复
git add .
git commit -m "fix: resolve DMG .app packaging issue"
git push origin master

# 创建新标签
git tag -a v0.1.1 -m "v0.1.1 - Fix DMG packaging issue"
git push origin v0.1.1
```

## 常见问题

### Q1: DMG 下载后双击无反应

**原因：** DMG 文件本身损坏或不完整

**解决：**
```bash
# 验证 DMG
hdiutil verify dist/Ben-COMET-0.1.0.dmg

# 重新构建
rm -rf dist/
./scripts/build-mac.sh
```

### Q2: 提示"应用已损坏"

**原因：** macOS Gatekeeper 安全检查

**解决：**
```bash
# 移除隔离属性
xattr -cr /Applications/Ben-COMET.app

# 或者右键 → 打开
```

### Q3: 无法启动服务器

**原因：** 服务器文件未正确打包

**解决：**
1. 检查 `server/dist/` 目录是否存在
2. 确保 `npm run build:server` 成功
3. 查看 electron/main.js 中的路径配置

### Q4: 前端页面空白

**原因：** 客户端文件未正确打包

**解决：**
1. 检查 `client/dist/` 目录是否存在
2. 确保 `npm run build:client` 成功
3. 打开开发者工具查看错误

## 构建要求

### 系统要求

- macOS 10.13+
- Node.js 18+
- npm 或 yarn
- Xcode Command Line Tools（用于代码签名）

### 可选工具

- **ImageMagick**：用于生成图标
  ```bash
  brew install imagemagick
  ```

## 下次发布检查清单

发布前确保：

- [ ] 所有 package.json 版本号已更新
- [ ] 前端构建成功（client/dist/ 存在）
- [ ] 后端构建成功（server/dist/ 存在）
- [ ] 本地测试构建成功
- [ ] DMG 可以挂载并看到 .app
- [ ] .app 可以正常打开和运行
- [ ] 提交所有代码更改
- [ ] 创建并推送新标签
- [ ] GitHub Actions 构建成功
- [ ] Release 页面有正确的文件

## 自动化检查脚本

```bash
#!/bin/bash
# verify-build.sh - 验证构建结果

echo "🔍 Verifying build..."

errors=0

# 检查 DMG
if [ ! -f "dist/*.dmg" ]; then
    echo "❌ No DMG file found"
    ((errors++))
fi

# 检查 .app
if [ ! -d "dist/mac/Ben-COMET.app" ]; then
    echo "❌ No .app found"
    ((errors++))
fi

# 检查可执行文件
if [ ! -f "dist/mac/Ben-COMET.app/Contents/MacOS/Ben-COMET" ]; then
    echo "❌ Executable not found"
    ((errors++))
fi

# 检查资源
if [ ! -d "dist/mac/Ben-COMET.app/Contents/Resources" ]; then
    echo "❌ Resources not found"
    ((errors++))
fi

if [ $errors -eq 0 ]; then
    echo "✅ Build verification passed!"
else
    echo "❌ Build verification failed with $errors error(s)"
    exit 1
fi
```

## 参考资料

- [electron-builder 文档](https://www.electron.build/)
- [macOS 代码签名指南](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [DMG 规范](https://en.wikipedia.org/wiki/Apple_Disk_Image)

---

**更新日期**: 2024-11-06
**状态**: ✅ 已修复
