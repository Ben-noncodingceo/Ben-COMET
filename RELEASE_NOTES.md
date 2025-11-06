# 发布说明

## 如何发布新版本

### 1. 准备发布

确保所有更改已提交并推送到主分支：
```bash
git checkout main
git pull origin main
```

### 2. 更新版本号

编辑 `package.json` 中的版本号：
```json
{
  "version": "1.0.0"  // 更新为新版本，如 1.1.0
}
```

### 3. 创建版本标签

```bash
# 提交版本更新
git add package.json
git commit -m "chore: bump version to v1.0.0"
git push origin main

# 创建标签
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### 4. 自动构建

推送标签后，GitHub Actions 会自动：
- 构建 macOS DMG（Intel + Apple Silicon）
- 构建 Windows 安装包
- 构建 Linux AppImage 和 deb 包
- 创建 GitHub Release
- 上传所有构建产物

### 5. 编辑发布说明

1. 访问 https://github.com/Ben-noncodingceo/Ben-COMET/releases
2. 找到新创建的 release
3. 点击 "Edit release"
4. 添加发布说明：

```markdown
## 🎉 新功能
- 功能 1 描述
- 功能 2 描述

## 🐛 Bug 修复
- 修复 1 描述
- 修复 2 描述

## 💡 改进
- 改进 1 描述
- 改进 2 描述

## 📥 下载

### macOS
- **Intel Mac**: 下载 `Ben-COMET-x64.dmg`
- **Apple Silicon (M1/M2)**: 下载 `Ben-COMET-arm64.dmg`
- **通用版**: 下载 `Ben-COMET-universal.dmg`

### Windows
- 下载 `Ben-COMET-Setup.exe`

### Linux
- **AppImage**: 下载 `Ben-COMET.AppImage`
- **Debian/Ubuntu**: 下载 `ben-comet_amd64.deb`

## 📝 安装说明
详见 [DOWNLOAD.md](https://github.com/Ben-noncodingceo/Ben-COMET/blob/main/DOWNLOAD.md)

## 🔧 已知问题
- 问题 1
- 问题 2
```

### 6. 发布

点击 "Publish release" 按钮。

## 版本号规范

遵循 [语义化版本](https://semver.org/lang/zh-CN/)：

- **主版本号** (x.0.0): 不兼容的 API 更改
- **次版本号** (0.x.0): 向下兼容的功能性新增
- **修订号** (0.0.x): 向下兼容的问题修正

示例：
- `1.0.0` - 首次正式发布
- `1.1.0` - 添加新功能
- `1.1.1` - Bug 修复
- `2.0.0` - 重大更新，可能破坏向下兼容

## 手动构建（如果 CI 失败）

### macOS

```bash
# 在 macOS 上运行
npm install
npm run build:client
npm run build:server
npm run build:electron

# DMG 在 dist/ 目录
```

### Windows

```bash
# 在 Windows 上运行
npm install
npm run build:client
npm run build:server
electron-builder --win

# EXE 在 dist/ 目录
```

### Linux

```bash
# 在 Linux 上运行
npm install
npm run build:client
npm run build:server
electron-builder --linux

# AppImage 和 deb 在 dist/ 目录
```

## 签名和公证（macOS）

对于官方发布，需要：

1. **Apple Developer 账号**
2. **签名证书**
3. **公证配置**

添加到 `package.json`:
```json
{
  "build": {
    "mac": {
      "identity": "Developer ID Application: Your Name (XXXXXXXXXX)"
    }
  }
}
```

设置环境变量：
```bash
export APPLE_ID="your@email.com"
export APPLE_ID_PASSWORD="app-specific-password"
export APPLE_TEAM_ID="XXXXXXXXXX"
```

## 测试发布

在创建正式发布前，进行测试：

```bash
# 创建预发布标签
git tag -a v1.0.0-beta.1 -m "Beta release"
git push origin v1.0.0-beta.1

# 或手动构建并测试
npm run build:all
```

## 回滚

如果发现重大问题：

1. 删除 GitHub release
2. 删除标签：
   ```bash
   git tag -d v1.0.0
   git push origin :refs/tags/v1.0.0
   ```
3. 修复问题后重新发布

## 更新日志

保持 `CHANGELOG.md` 更新：

```markdown
# 更新日志

## [1.0.0] - 2024-01-15

### 新增
- 初始版本发布
- 股票、ETF、加密货币监控
- 价格预警邮件通知
- 概率分析引擎

### 已知问题
- 无
```

## 发布检查清单

- [ ] 所有测试通过
- [ ] 文档已更新
- [ ] 版本号已更新
- [ ] CHANGELOG 已更新
- [ ] 标签已创建并推送
- [ ] CI 构建成功
- [ ] 所有平台安装包已生成
- [ ] 在各平台测试安装
- [ ] 发布说明已编写
- [ ] Release 已发布
