# 贡献指南

感谢你考虑为 Ben-COMET 做出贡献！

## 🤝 如何贡献

### 报告 Bug

1. 检查 [Issues](https://github.com/Ben-noncodingceo/Ben-COMET/issues) 确保问题未被报告
2. 创建新 Issue，包含：
   - 详细的问题描述
   - 复现步骤
   - 期望行为
   - 实际行为
   - 系统信息（操作系统、版本等）
   - 截图（如适用）

### 功能建议

1. 在 [Discussions](https://github.com/Ben-noncodingceo/Ben-COMET/discussions) 中提出新想法
2. 描述功能的用例和价值
3. 等待社区反馈

### 提交代码

1. **Fork 项目**
   ```bash
   git clone https://github.com/your-username/Ben-COMET.git
   cd Ben-COMET
   ```

2. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

3. **设置开发环境**
   ```bash
   npm install
   docker-compose up -d
   cp server/.env.example server/.env
   # 编辑 .env 文件配置
   npm run dev
   ```

4. **编写代码**
   - 遵循现有代码风格
   - 添加适当的注释
   - 确保代码通过 linting
   - 编写测试（如适用）

5. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   # 或
   git commit -m "fix: resolve issue #123"
   ```

   提交信息格式：
   - `feat:` 新功能
   - `fix:` Bug 修复
   - `docs:` 文档更新
   - `style:` 代码格式调整
   - `refactor:` 代码重构
   - `test:` 添加测试
   - `chore:` 构建/工具更新

6. **推送到 GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **创建 Pull Request**
   - 访问你的 fork 仓库
   - 点击 "New Pull Request"
   - 填写 PR 模板
   - 等待审核

## 📝 代码规范

### TypeScript/JavaScript

- 使用 TypeScript 编写新代码
- 遵循现有的代码结构
- 使用有意义的变量和函数名
- 添加必要的类型定义

### React 组件

- 使用函数组件和 Hooks
- 保持组件小而专注
- Props 使用 TypeScript 接口定义
- 遵循 React 最佳实践

### 样式

- 使用 TailwindCSS 实用类
- 避免内联样式（除非必要）
- 保持响应式设计

### 后端 API

- RESTful 设计原则
- 适当的错误处理
- 输入验证
- 添加必要的日志

## 🧪 测试

虽然目前项目测试覆盖有限，我们鼓励：

- 手动测试所有更改
- 添加单元测试（当实现测试框架后）
- 确保不破坏现有功能

## 📚 文档

更新文档如果你的 PR：

- 添加新功能
- 更改 API
- 修改配置选项
- 改变用户交互流程

需要更新的文档：
- `README.md` - 主要文档
- `DOWNLOAD.md` - 下载和安装说明
- API 文档（如适用）
- 代码注释

## 🔍 代码审查

PR 将被审查：

- 代码质量
- 功能正确性
- 性能影响
- 安全性
- 文档完整性

请耐心等待审查，并积极回应反馈。

## 🎯 优先领域

我们特别欢迎以下方面的贡献：

### 高优先级
- 单元测试和集成测试
- 性能优化
- 错误处理改进
- 用户体验提升
- 文档完善

### 新功能想法
- 更多资产类型支持
- 高级图表和可视化
- 价格预测算法改进
- 移动应用
- 数据导出功能
- 多语言支持

### 技术改进
- 代码重构
- TypeScript 类型完善
- 数据库迁移系统
- 日志系统
- 配置管理

## ❓ 需要帮助？

如果你不确定如何开始，可以：

1. 查看标记为 "good first issue" 的 Issues
2. 在 Discussions 中提问
3. 联系项目维护者

## 📜 行为准则

- 尊重所有贡献者
- 保持建设性的讨论
- 欢迎新手
- 专注于项目改进

## 📄 许可证

通过贡献，你同意你的贡献将在 MIT 许可证下发布。

---

再次感谢你的贡献！🎉
