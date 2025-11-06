# 📥 下载和安装 Ben-COMET

Ben-COMET 提供了易于安装的桌面应用程序，支持 macOS、Windows 和 Linux。

## 🍎 macOS 安装

### 方式一：下载预编译版本（推荐）

1. 访问 [Releases 页面](https://github.com/Ben-noncodingceo/Ben-COMET/releases)
2. 下载最新版本的 **Ben-COMET-{version}.dmg** 文件
3. 双击 DMG 文件
4. 将 Ben-COMET 图标拖拽到 Applications 文件夹
5. 从启动台或应用程序文件夹打开 Ben-COMET

**系统要求：**
- macOS 10.13 (High Sierra) 或更高版本
- Intel 或 Apple Silicon (M1/M2) 芯片

### 方式二：从源码编译

```bash
# 克隆仓库
git clone https://github.com/Ben-noncodingceo/Ben-COMET.git
cd Ben-COMET

# 安装依赖
npm install

# 构建客户端和服务器
npm run build:client
npm run build:server

# 创建 DMG 安装包
npm run build:electron

# DMG 文件将生成在 dist/ 目录中
```

或使用提供的构建脚本：

```bash
chmod +x scripts/build-mac.sh
./scripts/build-mac.sh
```

## 🪟 Windows 安装

### 下载预编译版本

1. 访问 [Releases 页面](https://github.com/Ben-noncodingceo/Ben-COMET/releases)
2. 下载最新版本的 **Ben-COMET-Setup-{version}.exe** 文件
3. 双击运行安装程序
4. 按照安装向导完成安装
5. 从开始菜单启动 Ben-COMET

**系统要求：**
- Windows 10 或更高版本
- 64位系统

## 🐧 Linux 安装

### AppImage（推荐）

```bash
# 下载 AppImage
wget https://github.com/Ben-noncodingceo/Ben-COMET/releases/latest/download/Ben-COMET-{version}.AppImage

# 添加执行权限
chmod +x Ben-COMET-{version}.AppImage

# 运行应用
./Ben-COMET-{version}.AppImage
```

### Debian/Ubuntu (.deb)

```bash
# 下载 deb 包
wget https://github.com/Ben-noncodingceo/Ben-COMET/releases/latest/download/ben-comet_{version}_amd64.deb

# 安装
sudo dpkg -i ben-comet_{version}_amd64.deb

# 修复依赖（如果需要）
sudo apt-get install -f
```

**系统要求：**
- Ubuntu 20.04 或更高版本
- Debian 10 或更高版本

## 🚀 首次运行配置

### 1. 配置环境变量

首次启动应用后，需要配置以下内容：

**数据库配置**（可选 - 应用会使用内置的轻量级数据库）

如果想使用 PostgreSQL：
- 打开应用设置
- 填入数据库连接信息

**邮件配置**（用于价格预警）

使用 Gmail：
1. 登录 Google 账户
2. 启用两步验证
3. 生成应用专用密码：https://myaccount.google.com/apppasswords
4. 在应用设置中填入：
   - SMTP 主机：smtp.gmail.com
   - 端口：587
   - 邮箱：your_email@gmail.com
   - 密码：生成的应用专用密码

**API 密钥配置**

获取免费 Alpha Vantage API 密钥：
1. 访问：https://www.alphavantage.co/support/#api-key
2. 填写表单获取免费密钥
3. 在应用设置中填入 API 密钥

### 2. 开始使用

配置完成后，你可以：
- 查看预设的资产（AAPL, GOOGL, MSFT, BTC, ETH 等）
- 刷新价格查看实时数据
- 设置价格预警
- 查看概率分析（半年涨30%的可能性）

## 📱 应用功能

### 资产监控
- 实时查看股票、ETF、加密货币价格
- 支持手动刷新和自动更新（每5分钟）
- 查看价格历史趋势

### 价格预警
- 设置价格高于/低于目标值的预警
- 触发时自动发送邮件通知
- 管理和查看预警历史

### 概率分析
- 基于蒙特卡洛模拟
- 计算资产半年内涨30%以上的概率
- 显示历史波动率

## 🔧 故障排除

### macOS："无法打开应用，因为它来自身份不明的开发者"

**解决方法：**
```bash
# 方法 1：通过设置打开
右键点击应用 → 打开 → 点击"打开"

# 方法 2：使用终端
xattr -cr /Applications/Ben-COMET.app
```

### Windows：SmartScreen 警告

1. 点击"更多信息"
2. 点击"仍要运行"

### Linux：AppImage 无法运行

```bash
# 确保安装了 FUSE
sudo apt-get install fuse libfuse2
```

### 应用无法连接到服务器

1. 检查防火墙设置（确保允许应用访问网络）
2. 检查端口 3001 是否被占用
3. 重启应用

### 邮件通知不工作

1. 检查邮箱配置是否正确
2. 确保使用应用专用密码（不是账户密码）
3. 检查网络连接

## 🆙 更新应用

### macOS/Windows
应用会自动检查更新。当有新版本时，会提示你下载安装。

### 手动更新
访问 [Releases 页面](https://github.com/Ben-noncodingceo/Ben-COMET/releases) 下载最新版本。

## 📞 获取帮助

- **问题反馈**：https://github.com/Ben-noncodingceo/Ben-COMET/issues
- **功能建议**：https://github.com/Ben-noncodingceo/Ben-COMET/discussions
- **文档**：https://github.com/Ben-noncodingceo/Ben-COMET/blob/main/README.md

## 🔒 隐私和安全

- 所有数据存储在本地
- API 密钥加密存储
- 不收集任何个人信息
- 开源代码，可审计

## 📄 许可证

MIT License - 详见 LICENSE 文件

---

**注意**：本应用仅供教育和参考用途，不构成投资建议。投资有风险，请谨慎决策。
