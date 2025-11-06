# Ben-COMET 金融监控系统

一个强大的金融产品价格监控系统，支持股票、ETF和数字货币的实时监控、价格预警和概率分析。

## 📥 下载桌面应用

**最新版本**: [点击下载](https://github.com/Ben-noncodingceo/Ben-COMET/releases/latest)

支持平台：
- 🍎 **macOS** (Intel & Apple Silicon) - [下载 DMG](https://github.com/Ben-noncodingceo/Ben-COMET/releases/latest)
- 🪟 **Windows** (64-bit) - [下载安装包](https://github.com/Ben-noncodingceo/Ben-COMET/releases/latest)
- 🐧 **Linux** (AppImage, deb) - [下载](https://github.com/Ben-noncodingceo/Ben-COMET/releases/latest)

详细安装说明请查看 [DOWNLOAD.md](DOWNLOAD.md)

---

## 功能特性

### 核心功能
- **多资产监控** - 支持股票、ETF、数字货币实时价格追踪
- **智能预警** - 价格到达目标时自动发送邮件提醒
- **概率分析** - 基于蒙特卡洛模拟，计算资产半年内涨30%以上的概率
- **历史数据** - 完整的价格历史记录和趋势分析

### 技术特点
- **实时监控** - 每5分钟自动检查价格变化
- **定时任务** - 使用 node-cron 进行定时价格检查
- **数据可视化** - 现代化的Web界面展示
- **RESTful API** - 完整的后端API接口

## 技术栈

### 后端
- **Node.js + Express** - Web服务器
- **TypeScript** - 类型安全的开发体验
- **PostgreSQL** - 数据持久化存储
- **node-cron** - 定时任务调度
- **nodemailer** - 邮件通知服务
- **axios** - HTTP请求客户端

### 前端
- **React 18** - 现代化的UI框架
- **TypeScript** - 类型安全
- **Vite** - 快速的构建工具
- **TailwindCSS** - 实用优先的CSS框架

### 数据源
- **Alpha Vantage API** - 股票和ETF数据
- **CoinGecko API** - 加密货币数据

### 桌面应用
- **Electron** - 跨平台桌面应用框架
- **内置服务器** - 无需单独安装数据库和后端
- **自动更新** - 应用内自动检查更新

## 快速开始

### 选项 1：使用桌面应用（推荐）

1. 从 [Releases 页面](https://github.com/Ben-noncodingceo/Ben-COMET/releases/latest) 下载对应平台的安装包
2. 安装并启动应用
3. 配置 API 密钥和邮件设置
4. 开始使用！

详细安装说明：[DOWNLOAD.md](DOWNLOAD.md)

### 选项 2：从源码运行（开发者）

**前置要求：**
- Node.js 18+
- PostgreSQL 15+ (可选 - 使用 Docker)
- npm 或 yarn

**步骤：**

#### 1. 克隆项目
```bash
git clone https://github.com/Ben-noncodingceo/Ben-COMET.git
cd Ben-COMET
```

#### 2. 安装依赖
```bash
npm install
```

#### 3. 启动数据库
使用 Docker Compose:
```bash
docker-compose up -d
```

或手动启动 PostgreSQL 并创建数据库:
```bash
createdb financial_monitor
psql financial_monitor < server/src/database/schema.sql
```

#### 4. 配置环境变量
复制并配置服务器环境变量:
```bash
cp server/.env.example server/.env
```

编辑 `server/.env` 文件，填入你的配置:
```env
# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=financial_monitor
DB_USER=postgres
DB_PASSWORD=your_password

# 邮件配置 (使用 Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password  # 需要生成应用专用密码
EMAIL_FROM=Financial Monitor <your_email@gmail.com>

# API密钥
ALPHA_VANTAGE_API_KEY=your_key_here
```

#### 5. 启动应用
开发模式（同时启动前后端）:
```bash
npm run dev
```

或分别启动:
```bash
# 终端 1 - 启动后端
npm run dev:server

# 终端 2 - 启动前端
npm run dev:client
```

#### 6. 访问应用
- **前端**: http://localhost:3000
- **后端API**: http://localhost:3001
- **API文档**: http://localhost:3001/

## API 文档

### 资产管理

#### 获取所有资产
```http
GET /api/assets
```

#### 获取资产当前价格
```http
GET /api/assets/:id/price
```

#### 获取资产概率分析
```http
GET /api/assets/:id/probability?targetIncrease=0.30
```

#### 获取资产价格历史
```http
GET /api/assets/:id/history?days=30
```

#### 创建新资产
```http
POST /api/assets
Content-Type: application/json

{
  "symbol": "TSLA",
  "name": "Tesla Inc.",
  "type": "STOCK"
}
```

### 预警管理

#### 获取所有预警
```http
GET /api/alerts?email=user@example.com&active=true
```

#### 创建新预警
```http
POST /api/alerts
Content-Type: application/json

{
  "asset_id": 1,
  "user_email": "user@example.com",
  "condition": "ABOVE",
  "target_price": 150.00
}
```

#### 更新预警
```http
PUT /api/alerts/:id
Content-Type: application/json

{
  "is_active": false
}
```

#### 删除预警
```http
DELETE /api/alerts/:id
```

### 监控服务

#### 获取监控状态
```http
GET /api/monitor/status
```

#### 手动触发价格检查
```http
POST /api/monitor/check
```

#### 检查特定资产
```http
POST /api/monitor/check/:assetId
```

### 概率分析

#### 获取所有资产概率
```http
GET /api/probability?targetIncrease=0.30
```

#### 强制重新计算概率
```http
POST /api/probability/:assetId/calculate
Content-Type: application/json

{
  "targetIncrease": 0.30
}
```

## 概率计算原理

系统使用**蒙特卡洛模拟**和**几何布朗运动**模型来计算资产价格上涨概率：

1. **历史数据分析** - 获取过去180天的价格数据
2. **计算波动率** - 基于历史收益率计算年化波动率
3. **蒙特卡洛模拟** - 运行10,000次价格路径模拟
4. **概率估算** - 统计达到目标价格的模拟次数占比

公式：
```
日收益率 = (今日价格 - 昨日价格) / 昨日价格
年化波动率 = 标准差(日收益率) × √252
未来价格 = 当前价格 × exp(μΔt + σ√Δt × Z)
```

其中：
- μ = 年化收益率
- σ = 年化波动率
- Δt = 时间间隔（天数/252）
- Z = 标准正态分布随机数

## 邮件配置

### Gmail 配置步骤

1. 登录 Google 账户
2. 启用两步验证
3. 生成应用专用密码：
   - 访问：https://myaccount.google.com/apppasswords
   - 选择"邮件"和"其他设备"
   - 生成密码并复制到 `.env` 文件的 `EMAIL_PASSWORD` 字段

### 其他邮件服务商

配置相应的 SMTP 设置：
```env
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASSWORD=your_password
```

## 数据库模型

### assets (资产表)
```sql
id              SERIAL PRIMARY KEY
symbol          VARCHAR(20) UNIQUE    -- 资产代码
name            VARCHAR(255)          -- 资产名称
type            VARCHAR(20)           -- STOCK, ETF, CRYPTO
created_at      TIMESTAMP
```

### price_history (价格历史表)
```sql
id              SERIAL PRIMARY KEY
asset_id        INTEGER               -- 关联资产
price           DECIMAL(20, 8)        -- 价格
timestamp       TIMESTAMP             -- 记录时间
```

### alerts (预警表)
```sql
id              SERIAL PRIMARY KEY
asset_id        INTEGER               -- 关联资产
user_email      VARCHAR(255)          -- 用户邮箱
condition       VARCHAR(10)           -- ABOVE, BELOW
target_price    DECIMAL(20, 8)        -- 目标价格
is_active       BOOLEAN               -- 是否活跃
triggered_at    TIMESTAMP             -- 触发时间
created_at      TIMESTAMP
```

### probability_cache (概率缓存表)
```sql
id                      SERIAL PRIMARY KEY
asset_id                INTEGER           -- 关联资产
target_increase         DECIMAL(5, 4)     -- 目标涨幅
probability             DECIMAL(5, 4)     -- 概率
historical_volatility   DECIMAL(10, 8)    -- 历史波动率
calculated_at           TIMESTAMP         -- 计算时间
```

## 项目结构

```
Ben-COMET/
├── client/                 # 前端应用
│   ├── src/
│   │   ├── components/     # React组件
│   │   ├── types.ts        # TypeScript类型定义
│   │   ├── api.ts          # API客户端
│   │   ├── App.tsx         # 主应用组件
│   │   └── main.tsx        # 应用入口
│   ├── package.json
│   └── vite.config.ts
│
├── server/                 # 后端服务
│   ├── src/
│   │   ├── database/       # 数据库相关
│   │   │   ├── db.ts       # 数据库连接
│   │   │   └── schema.sql  # 数据库模式
│   │   ├── routes/         # API路由
│   │   │   ├── assets.ts
│   │   │   ├── alerts.ts
│   │   │   ├── monitor.ts
│   │   │   └── probability.ts
│   │   ├── services/       # 业务逻辑
│   │   │   ├── priceService.ts
│   │   │   ├── emailService.ts
│   │   │   ├── monitorService.ts
│   │   │   └── probabilityService.ts
│   │   ├── types/          # TypeScript类型
│   │   └── index.ts        # 服务器入口
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml      # Docker配置
├── package.json            # 根项目配置
└── README.md               # 项目文档
```

## 构建桌面应用

### macOS

```bash
# 构建 DMG 安装包（支持 Intel 和 Apple Silicon）
npm run build:client
npm run build:server
npm run build:electron

# 或使用快捷脚本
chmod +x scripts/build-mac.sh
./scripts/build-mac.sh

# DMG 文件将生成在 dist/ 目录
```

### Windows

```bash
# 构建 Windows 安装包
npm run build:client
npm run build:server
electron-builder --win
```

### Linux

```bash
# 构建 AppImage 和 deb 包
npm run build:client
npm run build:server
electron-builder --linux
```

### 构建所有平台

```bash
# 一次性构建所有平台（需要在对应系统上运行）
npm run build:all
```

## 生产部署（Web 版）

### 1. 构建项目
```bash
npm run build
```

### 2. 设置环境变量
确保生产环境的 `.env` 配置正确

### 3. 启动服务
```bash
npm start
```

### 4. 使用 PM2 (推荐)
```bash
npm install -g pm2
pm2 start server/dist/index.js --name ben-comet
pm2 save
pm2 startup
```

## API 限制和最佳实践

### Alpha Vantage
- 免费层：每分钟5次请求，每天500次
- 建议：使用缓存，设置合理的检查间隔

### CoinGecko
- 免费层：每分钟50次请求
- 建议：批量请求，避免频繁调用

## 常见问题

### Q: 邮件发送失败
A: 检查邮箱配置，确保使用应用专用密码，而非账户密码

### Q: 价格更新不及时
A: 检查 `.env` 中的 `PRICE_CHECK_INTERVAL` 设置

### Q: 数据库连接失败
A: 确保 PostgreSQL 运行且连接信息正确

### Q: API 限制错误
A: 减少请求频率或升级到付费API计划

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 许可证

MIT License

## 联系方式

- **作者**: Ben (CEO of Center of Mass Educational Tech)
- **GitHub**: https://github.com/Ben-noncodingceo/Ben-COMET

## 致谢

- Alpha Vantage - 提供股票和ETF数据
- CoinGecko - 提供加密货币数据
- 所有开源贡献者

---

**注意**: 本系统仅供教育和参考用途，不构成投资建议。投资有风险，请谨慎决策。
