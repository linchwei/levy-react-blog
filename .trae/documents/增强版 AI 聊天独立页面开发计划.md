# 增强版 AI 聊天独立页面开发计划

## 需求分析
将现有的抽屉式 AI 聊天改为独立页面，支持主题切换、SSE 流式响应、Markdown 解析和复制功能。

## 开发任务清单

### 1. 产品原型设计
- [ ] 创建 AIChatPage 独立页面组件
- [ ] 设计三栏布局：侧边栏（历史会话）+ 主聊天区 + 设置面板
- [ ] 添加路由 `/ai-chat` 到 App.tsx
- [ ] 在导航栏添加 AI 聊天入口

### 2. 主题切换功能
- [ ] 创建主题上下文和 Provider
- [ ] 支持亮色/暗色/跟随系统三种模式
- [ ] 主题持久化到 localStorage
- [ ] 设计主题切换 UI（按钮/下拉菜单）

### 3. SSE 流式响应
- [ ] 复用现有的 chatStream 服务
- [ ] 实现打字机效果的消息显示
- [ ] 添加加载状态和停止生成按钮
- [ ] 错误处理和重试机制

### 4. Markdown 解析与复制
- [ ] 集成 react-markdown + remark-gfm
- [ ] 代码块语法高亮（react-syntax-highlighter）
- [ ] 添加代码复制按钮（一键复制）
- [ ] 支持 Markdown 表格、列表、链接等
- [ ] 添加"复制完整回复"功能

### 5. UI 设计
- [ ] 现代化聊天界面（类似 ChatGPT/Claude）
- [ ] 消息气泡设计（用户/AI 区分）
- [ ] 输入框自动增高
- [ ] 滚动到底部按钮
- [ ] 空状态引导界面
- [ ] 响应式布局（移动端适配）

### 6. 数据持久化
- [ ] 聊天记录本地存储
- [ ] 会话管理（新建/删除/重命名）
- [ ] 消息历史分页加载
- [ ] 导出对话为 Markdown

### 7. 单元测试
- [ ] AIChatPage 组件测试
- [ ] 主题切换逻辑测试
- [ ] Markdown 渲染测试
- [ ] 代码复制功能测试
- [ ] SSE 流式处理测试
- [ ] 本地存储操作测试
- [ ] 所有测试必须通过，覆盖率 > 80%

## 技术方案

### 文件结构
```
src/
├── pages/
│   └── AIChatPage.tsx           # 主页面
├── components/ai/
│   ├── AIChatContainer.tsx      # 聊天容器
│   ├── ChatSidebar.tsx          # 侧边栏（历史会话）
│   ├── ChatMessage.tsx          # 消息组件（增强版）
│   ├── ChatInput.tsx            # 输入组件
│   ├── CodeBlock.tsx            # 代码块组件（带复制）
│   ├── ThemeToggle.tsx          # 主题切换
│   └── EmptyState.tsx           # 空状态
├── hooks/
│   ├── useAIChat.ts             # 复用现有
│   └── useTheme.ts              # 主题管理
├── services/
│   └── aiService.ts             # 复用现有
└── __tests__/
    └── ai/
        ├── AIChatPage.test.tsx
        ├── ChatMessage.test.tsx
        └── CodeBlock.test.tsx
```

### 依赖检查
项目已安装：
- ✅ react-markdown
- ✅ lucide-react（图标）
- ✅ framer-motion（动画）

需要安装：
- remark-gfm（GitHub Flavored Markdown）
- react-syntax-highlighter（代码高亮）
- @types/react-syntax-highlighter

### UI 设计规范
- 采用 Bento Grid 风格布局
- 支持玻璃拟态效果
- 消息气泡圆角 12px
- 代码块圆角 8px，带复制按钮悬浮显示
- 主题色：跟随系统或手动切换

### 测试策略
- 使用 Vitest + React Testing Library
- 模拟 SSE 流式响应
- 测试 Markdown 渲染和代码复制
- 测试主题切换和持久化
- 所有测试必须通过，无 TypeScript 错误

## 验收标准
1. ✅ 独立页面可正常访问 `/ai-chat`
2. ✅ 主题切换功能正常，持久化保存
3. ✅ SSE 流式响应流畅，支持停止生成
4. ✅ Markdown 正确解析，代码可复制
5. ✅ UI 美观，响应式布局正常
6. ✅ 所有单元测试通过，无错误
7. ✅ TypeScript 无错误，构建成功

请确认此计划后，我将开始实施开发。