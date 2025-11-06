# 🚀 快速开始指南

## 方法 1：使用预编译应用（最简单）

### macOS 用户

1. **下载应用**
   - 访问 [Releases 页面](https://github.com/Ben-noncodingceo/Ben-COMET/releases/latest)
   - 下载 `Ben-COMET-{version}.dmg`

2. **安装**
   - 双击 DMG 文件
   - 拖动 Ben-COMET 到 Applications 文件夹
   - 打开应用（如遇安全提示，右键点击 → 打开）

3. **配置（首次运行）**
   - 获取 Alpha Vantage API 密钥：https://www.alphavantage.co/support/#api-key
   - 配置邮件（Gmail 需要应用专用密码）
   - 开始使用！

### Windows 用户

1. **下载**：`Ben-COMET-Setup-{version}.exe`
2. **安装**：双击运行安装向导
3. **配置**：同上
4. **开始使用**

### Linux 用户

```bash
# AppImage
wget [release-url]/Ben-COMET-{version}.AppImage
chmod +x Ben-COMET-{version}.AppImage
./Ben-COMET-{version}.AppImage

# 或 deb 包
sudo dpkg -i ben-comet_{version}_amd64.deb
```

## 方法 2：从源码构建 macOS 应用

### 前提条件
- macOS 10.13+
- Node.js 18+
- Xcode Command Line Tools

### 步骤

```bash
# 1. 克隆仓库
git clone https://github.com/Ben-noncodingceo/Ben-COMET.git
cd Ben-COMET

# 2. 安装依赖
npm install

# 3. 构建（自动化脚本）
chmod +x scripts/build-mac.sh
./scripts/build-mac.sh

# 4. 查找 DMG
ls -lh dist/*.dmg
```

### 手动构建步骤

```bash
# 构建前端
cd client
npm install
npm run build
cd ..

# 构建后端
cd server
npm install
npm run build
cd ..

# 构建 Electron 应用
npm install
npm run build:electron

# DMG 文件在 dist/ 目录
```

## 方法 3：开发模式运行

适合开发者和想要自定义的用户。

### 前提条件
- Node.js 18+
- PostgreSQL 15+ 或 Docker

### 步骤

```bash
# 1. 克隆仓库
git clone https://github.com/Ben-noncodingceo/Ben-COMET.git
cd Ben-COMET

# 2. 安装依赖
npm install

# 3. 启动数据库（使用 Docker）
docker-compose up -d

# 或使用开发脚本
chmod +x scripts/dev.sh
./scripts/dev.sh

# 4. 配置环境变量
cp server/.env.example server/.env
# 编辑 server/.env 填入配置

# 5. 启动开发服务器
npm run dev

# 6. 访问应用
# 浏览器打开: http://localhost:3000
```

## 首次配置

### 1. 获取 Alpha Vantage API 密钥

免费获取：
1. 访问 https://www.alphavantage.co/support/#api-key
2. 填写表单（姓名、邮箱、组织）
3. 复制 API 密钥
4. 在应用设置中填入

### 2. 配置邮件通知（Gmail）

1. 登录 Google 账户
2. 启用两步验证
3. 生成应用专用密码：
   - 访问 https://myaccount.google.com/apppasswords
   - 选择"邮件"和"其他设备"
   - 复制生成的密码
4. 在应用设置中配置：
   - SMTP 主机：`smtp.gmail.com`
   - 端口：`587`
   - 用户名：你的 Gmail 地址
   - 密码：刚生成的应用专用密码

### 3. 开始使用

配置完成后：
1. 查看预设资产（AAPL、GOOGL、BTC 等）
2. 点击"刷新价格"获取最新数据
3. 点击"设置预警"创建价格提醒
4. 查看"概率分析"了解涨幅可能性

## 常用功能

### 创建价格预警

1. 选择资产
2. 点击"设置预警"
3. 输入：
   - 邮箱地址
   - 条件（高于/低于）
   - 目标价格
4. 保存

触发后会自动发送邮件通知！

### 查看概率分析

每个资产卡片显示：
- 当前价格
- 半年涨30%的概率
- 历史波动率

基于180天历史数据和10,000次蒙特卡洛模拟计算。

### 添加新资产

使用 API 或数据库直接添加：

```bash
# 使用 curl
curl -X POST http://localhost:3001/api/assets \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "TSLA",
    "name": "Tesla Inc.",
    "type": "STOCK"
  }'
```

## 故障排除

### macOS："无法打开，因为来自身份不明的开发者"

```bash
# 解决方法
xattr -cr /Applications/Ben-COMET.app
```

或：右键点击 → 打开 → 点击"打开"

### Windows：SmartScreen 警告

点击"更多信息" → "仍要运行"

### 邮件发送失败

- 检查是否使用应用专用密码（不是账户密码）
- 确认 Gmail 两步验证已启用
- 检查网络连接

### 应用无法启动

- 检查系统要求
- 查看日志：
  - macOS: `~/Library/Logs/Ben-COMET/`
  - Windows: `%APPDATA%\Ben-COMET\logs\`
  - Linux: `~/.config/Ben-COMET/logs/`

## 更多帮助

- **完整文档**：[README.md](README.md)
- **下载指南**：[DOWNLOAD.md](DOWNLOAD.md)
- **问题反馈**：[GitHub Issues](https://github.com/Ben-noncodingceo/Ben-COMET/issues)
- **功能讨论**：[GitHub Discussions](https://github.com/Ben-noncodingceo/Ben-COMET/discussions)

## 系统要求

### 桌面应用

- **macOS**: 10.13+ (Intel & Apple Silicon)
- **Windows**: Windows 10+ (64-bit)
- **Linux**: Ubuntu 20.04+ / Debian 10+

### Web 版（自行部署）

- Node.js 18+
- PostgreSQL 15+
- 2GB+ RAM
- 现代浏览器

## 下一步

- 探索所有功能
- 自定义监控的资产
- 设置多个价格预警
- 查看概率分析做决策参考

---

**注意**：本系统仅供教育和参考，不构成投资建议。投资有风险，请谨慎决策。
