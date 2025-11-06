# 📦 v0.1.1 Release 说明

## 🎯 重要更新

这是一个**紧急 Bug 修复版本**，解决了 v0.1.0 中 macOS DMG 文件的关键问题。

## 🐛 已修复的问题

### 主要问题：DMG 无可运行的 .app 文件

**症状：**
- 下载 v0.1.0 DMG 后
- 双击挂载 DMG
- 没有看到 Ben-COMET.app 文件
- 或者 .app 文件无法运行

**根本原因：**
1. electron-builder 配置引用了不存在的图标文件（icon.icns）
2. 构建时因图标缺失导致打包不完整
3. hardenedRuntime 配置导致签名问题

**修复措施：**
- ✅ 移除了对不存在图标文件的引用
- ✅ 简化 macOS 构建配置
- ✅ 添加自动图标生成功能
- ✅ 禁用 hardenedRuntime（避免签名问题）
- ✅ 增强构建脚本的错误检查

## ✨ 新增功能

### 1. 自动图标生成

如果 `build/icon.png` 不存在，构建脚本会自动：
- 检测 ImageMagick 是否安装
- 创建渐变色背景的占位图标
- 或使用 Electron 默认图标

### 2. 改进的构建脚本

**build-mac.sh 改进：**
```bash
# 自动创建图标
# 更详细的错误检查
# 显示构建产物位置
# 独立的步骤验证
```

**新增 test-build.sh：**
```bash
# 快速本地测试（只生成 .app）
# 不创建 DMG，加快测试速度
# 适用于开发阶段验证
```

### 3. 详细的修复文档

**FIX_DMG_ISSUE.md** 包含：
- 问题分析
- 修复详情
- 测试方法
- 故障排除
- 构建检查清单

## 📥 下载和安装

### macOS 用户

1. **下载**
   ```
   Ben-COMET-0.1.1.dmg (或 -arm64.dmg 用于 Apple Silicon)
   ```

2. **安装**
   - 双击 DMG 文件挂载
   - 看到 Ben-COMET.app 应用图标
   - 拖动到 Applications 文件夹
   - 从应用程序或 Launchpad 启动

3. **首次打开**
   - 如遇安全提示：右键点击 → 打开 → 点击"打开"
   - 或在终端执行：`xattr -cr /Applications/Ben-COMET.app`

### Windows 用户

```
Ben-COMET-Setup-0.1.1.exe
```

### Linux 用户

```
Ben-COMET-0.1.1.AppImage
ben-comet_0.1.1_amd64.deb
```

## 🧪 验证安装

### 检查 .app 是否存在

```bash
# 挂载 DMG
hdiutil attach Ben-COMET-0.1.1.dmg

# 列出内容
ls -la /Volumes/Ben-COMET*/

# 应该看到：
# - Ben-COMET.app （应用文件）
# - Applications （快捷方式）

# 卸载
hdiutil detach /Volumes/Ben-COMET*
```

### 测试运行

```bash
# 方式 1：通过 Finder
# 双击 Ben-COMET.app

# 方式 2：通过命令行
open /Applications/Ben-COMET.app

# 检查是否启动成功
ps aux | grep Ben-COMET
```

## 🔧 开发者信息

### 本地构建

```bash
# 完整构建
git clone https://github.com/Ben-noncodingceo/Ben-COMET.git
cd Ben-COMET
git checkout v0.1.1
./scripts/build-mac.sh

# 快速测试
./scripts/test-build.sh
open dist/mac/Ben-COMET.app
```

### 构建配置变更

**package.json：**
```json
{
  "build": {
    "mac": {
      "target": ["dmg"],
      "type": "distribution",
      "hardenedRuntime": false,  // 修改：禁用
      "gatekeeperAssess": false
      // "icon": "build/icon.icns"  // 移除：避免引用不存在的文件
    }
  }
}
```

**GitHub Actions：**
- 新增：自动创建占位图标步骤
- 使用 ImageMagick 生成渐变图标
- 后备：使用 Electron 默认图标

## 📊 测试覆盖

### 已测试场景

- ✅ DMG 可以正常挂载
- ✅ 包含 Ben-COMET.app 文件
- ✅ .app 可以拖动到 Applications
- ✅ 应用可以正常启动
- ✅ 前端界面正确显示
- ✅ 后端服务正常运行
- ✅ 价格监控功能正常
- ✅ 预警系统正常

### 测试平台

- macOS 13 Ventura (Intel)
- macOS 14 Sonoma (Apple Silicon)

## 🔄 从 v0.1.0 升级

如果你已经安装了 v0.1.0：

1. **卸载旧版本**
   ```bash
   rm -rf /Applications/Ben-COMET.app
   ```

2. **下载并安装 v0.1.1**
   - 按照上面的安装步骤操作

3. **数据迁移**
   - 应用数据在 `~/Library/Application Support/Ben-COMET/`
   - 新版本会自动使用现有数据

## ❓ 常见问题

### Q: 还是看不到 .app 文件？

**A:** 请确保：
1. 下载的是 v0.1.1（不是 v0.1.0）
2. DMG 文件完整下载（检查文件大小）
3. 使用最新的 GitHub Release

### Q: "应用已损坏"提示？

**A:** 这是 macOS Gatekeeper 的安全检查：
```bash
sudo xattr -cr /Applications/Ben-COMET.app
```

### Q: 应用闪退？

**A:** 检查控制台日志：
```bash
# 查看崩溃日志
Console.app → 用户报告 → Ben-COMET

# 或终端启动查看错误
/Applications/Ben-COMET.app/Contents/MacOS/Ben-COMET
```

### Q: 如何验证版本？

**A:** 打开应用后：
- 菜单栏 → Ben-COMET → About Ben-COMET
- 应该显示 "Version 0.1.1"

## 📝 更新日志

### [0.1.1] - 2024-11-06

#### Fixed
- macOS DMG 包含可运行的 .app 文件
- 移除对不存在图标文件的引用
- 修复 electron-builder 配置问题
- 禁用 hardenedRuntime 避免签名冲突

#### Added
- 自动图标生成功能
- 快速测试构建脚本 (test-build.sh)
- 详细的修复文档 (FIX_DMG_ISSUE.md)
- 增强的错误检查和日志

#### Changed
- 简化 macOS 构建配置
- 改进构建脚本
- 更新 GitHub Actions 工作流

## 🙏 致谢

感谢报告 v0.1.0 问题的用户！你们的反馈帮助我们快速定位并修复了这个关键问题。

## 📞 支持

- **问题反馈**: https://github.com/Ben-noncodingceo/Ben-COMET/issues
- **讨论**: https://github.com/Ben-noncodingceo/Ben-COMET/discussions
- **文档**: https://github.com/Ben-noncodingceo/Ben-COMET/blob/master/README.md

## 🔜 下一步

v0.2.0 计划：
- 自定义应用图标
- 应用签名和公证
- 自动更新功能
- 更多资产类型支持

---

**重要提示**: 如果你从 v0.1.0 下载的 DMG 有问题，请删除并重新下载 v0.1.1。

**发布日期**: 2024-11-06
**状态**: ✅ 稳定版
