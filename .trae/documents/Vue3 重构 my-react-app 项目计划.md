# Vue3 重构 my-react-app 项目 - 完整计划

## 一、产品原型文档 (PRD)

### 1.1 项目概述
**项目名称**: My Vue App (个人博客与技术展示平台)
**目标**: 使用 Vue3 + TypeScript + Vite 完整复刻 React 项目功能
**技术栈**: Vue 3.4 + TypeScript 5.3 + Vite 5 + Pinia + Vue Router 4 + Tailwind CSS

### 1.2 核心功能模块

#### 模块 1: 首页 (Home)
- **功能**: 网站主入口，展示个人简介、技能、最新文章
- **子功能**:
  - 导航栏 (响应式、主题切换)
  - Hero 区域 (粒子动画背景、打字机效果)
  - Bento Grid (苹果风格网格展示统计)
  - 特性展示 (Features Section)
  - 最新文章 (Latest Articles)
  - 技能展示 (Skills Section)
  - 页脚 (Footer)

#### 模块 2: 博客系统 (Blog)
- **功能**: 文章管理与展示
- **子功能**:
  - 文章列表页 (分类筛选、搜索、分页)
  - 文章详情页 (Markdown渲染、代码高亮)
  - AI 对话组件 (悬浮聊天、流式输出)
  - 文章 AI 总结
  - 阅读统计 (浏览量、点赞)

#### 模块 3: 待办事项 (Todo)
- **功能**: 任务管理
- **子功能**:
  - 待办列表 (拖拽排序、动画)
  - 添加待办 (表单验证、优先级选择)
  - 筛选器 (全部/进行中/已完成)
  - 统计面板 (完成率、优先级分布)
  - 本地存储持久化

#### 模块 4: 关于我 (About)
- **功能**: 个人详细介绍
- **子功能**:
  - 技能雷达图 (ECharts)
  - 职业时间线 (Timeline)
  - 项目展示卡片
  - 数字动画计数器

#### 模块 5: 工具箱 (Tools)
- **功能**: 开发工具集合
- **子功能**:
  - 工具列表页 (分类展示)
  - CSS 动画工具箱 (40+ 动画预览)
  - 代码游乐场 (Monaco Editor + 实时预览)
  - 3D 场景构建器 (Three.js)
  - AI 动画生成器
  - SVG 动画编辑器

#### 模块 6: AI 服务
- **功能**: 多模型 AI 集成
- **子功能**:
  - 多模型支持 (DeepSeek/智谱/通义千问)
  - 流式输出
  - 自动降级策略
  - 对话历史管理

### 1.3 技术架构

```
my-vue-app/
├── src/
│   ├── components/          # 组件
│   │   ├── ui/             # shadcn-vue 基础组件
│   │   ├── home/           # 首页组件
│   │   ├── blog/           # 博客组件
│   │   ├── todo/           # 待办组件
│   │   ├── about/          # 关于页组件
│   │   ├── ai/             # AI 组件
│   │   ├── tools/          # 工具组件
│   │   └── common/         # 通用组件
│   ├── views/              # 页面视图
│   ├── stores/             # Pinia 状态管理
│   ├── composables/        # Vue3 组合式函数
│   ├── services/           # API 服务
│   ├── router/             # 路由配置
│   ├── types/              # TypeScript 类型
│   ├── constants/          # 常量
│   ├── data/               # 静态数据
│   ├── utils/              # 工具函数
│   └── assets/             # 静态资源
├── public/                 # 公共文件
└── ...配置文件
```

### 1.4 路由规划

```typescript
const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/blog', name: 'BlogList', component: BlogListView },
  { path: '/blog/:slug', name: 'BlogDetail', component: BlogDetailView },
  { path: '/todo', name: 'Todo', component: TodoView },
  { path: '/about', name: 'About', component: AboutView },
  { path: '/projects', name: 'Projects', component: ProjectsView },
  { path: '/tools', name: 'Tools', component: ToolsView },
  { path: '/tools/css-animation', name: 'CSSAnimation', component: CSSAnimationView },
  { path: '/tools/code-playground', name: 'CodePlayground', component: CodePlaygroundView },
  { path: '/tools/3d-builder', name: 'Scene3DBuilder', component: Scene3DBuilderView },
]
```

### 1.5 状态管理设计

#### Pinia Store 结构

```typescript
// stores/blog.ts
export const useBlogStore = defineStore('blog', {
  state: () => ({
    posts: [],
    projects: [],
    skills: [],
    selectedCategory: 'all',
    searchQuery: '',
  }),
  getters: {
    filteredPosts: (state) => { ... },
    getPostBySlug: (state) => (slug) => { ... },
  },
  actions: {
    async fetchData() { ... },
    incrementViews(slug) { ... },
  },
})

// stores/todo.ts
export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [],
    filter: 'all',
  }),
  getters: {
    filteredTodos: (state) => { ... },
    stats: (state) => { ... },
  },
  actions: {
    addTodo(todo) { ... },
    toggleTodo(id) { ... },
    deleteTodo(id) { ... },
  },
})
```

### 1.6 组件映射 (React → Vue)

| React 组件 | Vue 组件 | 说明 |
|------------|----------|------|
| useState | ref/reactive | 响应式状态 |
| useEffect | onMounted/onUnmounted/watch | 生命周期 |
| useCallback | 无需转换 | Vue 自动缓存 |
| useMemo | computed | 计算属性 |
| React.memo | defineComponent + 优化 | 组件缓存 |
| Framer Motion | @vueuse/motion / GSAP | 动画库 |
| Zustand | Pinia | 状态管理 |
| React Router | Vue Router | 路由 |

---

## 二、实现步骤

### 阶段 1: 项目初始化 (1-2 小时)
1. 创建 Vue3 + Vite 项目
2. 安装依赖 (Pinia, Vue Router, Tailwind, shadcn-vue)
3. 配置开发环境 (ESLint, Prettier, TypeScript)
4. 搭建基础目录结构
5. 配置路由和状态管理

### 阶段 2: 基础组件开发 (3-4 小时)
1. 安装并配置 shadcn-vue UI 组件库
2. 创建通用组件 (AnimatedCard, LoadingSpinner)
3. 创建布局组件 (Navigation, Footer)
4. 实现主题切换功能

### 阶段 3: 首页开发 (2-3 小时)
1. HeroSection 组件 (粒子动画)
2. BentoGrid 组件
3. FeaturesSection 组件
4. LatestArticles 组件
5. SkillsSection 组件

### 阶段 4: 博客系统 (3-4 小时)
1. Blog Store (Pinia)
2. 博客列表页
3. 博客详情页 (Markdown)
4. AI 对话组件
5. 文章总结功能

### 阶段 5: 待办事项 (2-3 小时)
1. Todo Store (Pinia + persist)
2. TodoList 组件 (拖拽排序)
3. AddTodo 组件
4. TodoStats 组件

### 阶段 6: 关于页 (2 小时)
1. 技能雷达图 (ECharts)
2. 时间线组件
3. 项目卡片

### 阶段 7: 工具箱 (4-5 小时)
1. 工具列表页
2. CSS 动画工具箱
3. 代码游乐场 (Monaco)
4. 3D 场景构建器

### 阶段 8: AI 服务 (2 小时)
1. AI Service 封装
2. useAIChat composable
3. 流式输出处理

### 阶段 9: 优化与测试 (2 小时)
1. 性能优化
2. 响应式适配
3. 类型检查
4. 构建测试

---

## 三、技术选型对比

| 功能 | React 版本 | Vue3 版本 |
|------|-----------|-----------|
| 状态管理 | Zustand | Pinia |
| 路由 | React Router v7 | Vue Router 4 |
| UI 组件 | shadcn/ui | shadcn-vue |
| 动画 | Framer Motion | @vueuse/motion + GSAP |
| 表单 | React Hook Form | vee-validate |
| 图表 | Recharts | ECharts |
| 拖拽 | @dnd-kit | vue-draggable-plus |
| 代码编辑 | Monaco Editor | Monaco Editor |
| 3D | React Three Fiber | TresJS |

---

## 四、预期成果

- ✅ 功能完整的 Vue3 个人博客平台
- ✅ 与 React 版本一致的用户体验
- ✅ TypeScript 类型安全
- ✅ 响应式设计
- ✅ 深色/浅色主题
- ✅ 性能优化
- ✅ 完整的文档

---

**请确认此计划后，我将开始逐步实施。**