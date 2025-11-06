# 📦 创建 v0.1.0 Test Release 指南

## 当前状态

✅ 代码已准备好
✅ 版本号已更新为 0.1.0
✅ Git 标签 v0.1.0 已创建
⚠️ 需要手动推送以触发自动构建

## 手动完成发布步骤

### 1. 切换到 master 分支并合并

```bash
cd Ben-COMET
git checkout master
git pull origin master

# 合并功能分支
git merge claude/financial-price-monitor-011CUrAD1y4RgTiB4btYpDLe

# 推送到 master
git push origin master
```

### 2. 创建并推送标签

```bash
# 创建标签
git tag -a v0.1.0 -m "v0.1.0 - Test Release

This is a test release of Ben-COMET Financial Monitor.

Features:
- Real-time monitoring of stocks, ETFs, and cryptocurrencies
- Price alert system with email notifications
- Probability analysis (30% increase in 6 months)
- Desktop applications for macOS, Windows, and Linux

See DOWNLOAD.md for installation instructions."

# 推送标签（这会触发 GitHub Actions 自动构建）
git push origin v0.1.0
```

### 3. 等待自动构建

推送标签后，GitHub Actions 会自动：
1. 在 macOS、Windows、Linux 上构建应用
2. 创建 GitHub Release
3. 上传所有安装包

你可以在这里查看构建进度：
```
https://github.com/Ben-noncodingceo/Ben-COMET/actions
```

### 4. 验证 Release

构建完成后（约 15-30 分钟），检查：
```
https://github.com/Ben-noncodingceo/Ben-COMET/releases
```

应该能看到 v0.1.0 release，包含：
- ✅ Ben-COMET-0.1.0.dmg (macOS)
- ✅ Ben-COMET-0.1.0-arm64.dmg (macOS Apple Silicon)
- ✅ Ben-COMET-Setup-0.1.0.exe (Windows)
- ✅ Ben-COMET-0.1.0.AppImage (Linux)
- ✅ ben-comet_0.1.0_amd64.deb (Linux)

## 方法 2：使用 GitHub 网页界面创建 Release

如果推送标签失败，也可以直接在 GitHub 网页上创建：

### 步骤

1. **访问 Releases 页面**
   ```
   https://github.com/Ben-noncodingceo/Ben-COMET/releases/new
   ```

2. **填写 Release 信息**
   - Tag: `v0.1.0`
   - Target: `master` 分支
   - Title: `v0.1.0 - Test Release`
   - Description:
   ```markdown
   ## 🎉 v0.1.0 - Test Release

   这是 Ben-COMET 金融监控系统的第一个测试版本。

   ### ✨ 功能特性

   - **多资产监控** - 实时追踪股票、ETF、数字货币价格
   - **智能预警** - 价格到达目标时自动发送邮件提醒
   - **概率分析** - 基于蒙特卡洛模拟，计算半年内涨30%以上的概率
   - **跨平台桌面应用** - 支持 macOS、Windows、Linux

   ### 📥 下载

   #### macOS
   - **Intel Mac**: 下载 `Ben-COMET-0.1.0.dmg`
   - **Apple Silicon (M1/M2)**: 下载 `Ben-COMET-0.1.0-arm64.dmg`

   #### Windows
   - 下载 `Ben-COMET-Setup-0.1.0.exe`

   #### Linux
   - **AppImage**: 下载 `Ben-COMET-0.1.0.AppImage`
   - **Debian/Ubuntu**: 下载 `ben-comet_0.1.0_amd64.deb`

   ### 📝 安装说明

   详见 [DOWNLOAD.md](https://github.com/Ben-noncodingceo/Ben-COMET/blob/master/DOWNLOAD.md)

   ### 🚀 快速开始

   详见 [QUICK_START.md](https://github.com/Ben-noncodingceo/Ben-COMET/blob/master/QUICK_START.md)

   ### ⚠️ 注意事项

   - 这是测试版本，可能存在未知问题
   - 首次运行需配置 API 密钥和邮件设置
   - 请在 [Issues](https://github.com/Ben-noncodingceo/Ben-COMET/issues) 反馈问题

   ### 🔧 技术栈

   - 前端: React + TypeScript + TailwindCSS
   - 后端: Node.js + Express + PostgreSQL
   - 桌面: Electron
   - 数据: Alpha Vantage + CoinGecko

   ---

   **免责声明**: 本系统仅供教育和参考，不构成投资建议。
   ```

3. **标记为预发布**
   - ✅ 勾选 "This is a pre-release"
   - 用于测试目的

4. **手动触发构建**（如果需要）

   如果选择手动上传文件，需要先本地构建：

   ```bash
   # 构建所有平台（需要在对应系统上运行）
   npm run build:client
   npm run build:server

   # macOS
   npm run build:electron

   # Windows
   electron-builder --win

   # Linux
   electron-builder --linux
   ```

   然后上传 `dist/` 目录下的文件。

5. **发布**
   - 点击 "Publish release"

## 验证安装包

发布后，测试安装：

### macOS
```bash
# 下载并安装
# 如遇安全提示：
xattr -cr /Applications/Ben-COMET.app
```

### Windows
- 双击安装
- 如遇 SmartScreen 警告，点击"更多信息" → "仍要运行"

### Linux
```bash
# AppImage
chmod +x Ben-COMET-0.1.0.AppImage
./Ben-COMET-0.1.0.AppImage

# deb
sudo dpkg -i ben-comet_0.1.0_amd64.deb
```

## 故障排除

### 如果 GitHub Actions 失败

1. 检查 Actions 日志：`https://github.com/Ben-noncodingceo/Ben-COMET/actions`
2. 常见问题：
   - 缺少图标文件（icon.icns, icon.ico, icon.png）
   - 依赖安装失败
   - 构建超时

### 临时解决方案

如果自动构建失败，可以：
1. 先发布源码版本
2. 稍后手动构建并上传二进制文件
3. 或修复问题后重新创建 tag

## 成功标志

✅ Release 页面显示 v0.1.0
✅ 所有平台安装包已上传
✅ 下载链接可用
✅ 至少在一个平台测试安装成功

---

## 快速命令速查

```bash
# 完整流程
git checkout master
git pull origin master
git merge claude/financial-price-monitor-011CUrAD1y4RgTiB4btYpDLe
git push origin master
git tag -a v0.1.0 -m "v0.1.0 - Test Release"
git push origin v0.1.0

# 查看构建状态
# 访问: https://github.com/Ben-noncodingceo/Ben-COMET/actions

# 查看 Release
# 访问: https://github.com/Ben-noncodingceo/Ben-COMET/releases
```
