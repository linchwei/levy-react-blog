## Vue3代码游乐场复刻计划

### 目标
一比一复刻React版本的代码游乐场功能，使用Vue3 Composition API + TypeScript，UI风格保持一致。

### 技术栈
- Vue 3 Composition API + TypeScript
- Monaco Editor (使用 `@guolao/vue-monaco-editor`)
- Tailwind CSS (已有)
- Lucide Vue Next 图标 (已有)
- iframe + srcDoc 实现预览

### 需要创建/修改的文件

#### 1. 数据文件
**`/src/data/codeTemplates.ts`**
- 从React版本复用模板数据（9个预设模板）
- 适配Vue3的图标映射

#### 2. 主页面
**`/src/views/CodePlaygroundView.vue`** (完全重写)
包含以下功能模块：

**状态管理：**
- activeTab: 'html' | 'css' | 'js'
- code: { html, css, js }
- deviceType: 'desktop' | 'tablet' | 'mobile'
- zoom: number (50-150)
- viewMode: 'split' | 'preview' | 'editor'
- autoPreview: boolean
- editorTheme: 'vs-dark' | 'light'
- editorSettings: { fontSize, wordWrap, minimap, lineNumbers, tabSize }
- savedSnippets: 本地存储的代码片段
- consoleLogs: 控制台日志
- searchQuery: 模板搜索
- selectedCategory: 分类筛选

**核心功能：**
1. **Monaco Editor 代码编辑** - 支持HTML/CSS/JS三栏切换
2. **实时预览** - iframe + srcDoc，支持React运行时
3. **设备模拟器** - Desktop/Tablet/Mobile三种尺寸
4. **视图模式** - 编辑器/分屏/预览三种布局
5. **模板系统** - 9个预设模板（Hello World、计数器、动画演示等）
6. **代码片段管理** - 保存/加载/删除/收藏（localStorage）
7. **代码操作** - 复制、下载、分享、格式化、重置
8. **编辑器设置** - 字体大小、Tab大小、缩略图、主题等
9. **缩放控制** - 预览区域缩放（50%-150%）
10. **控制台** - 显示console输出

**UI布局：**
- 头部：标题 + 工具栏（视图切换、设备切换、操作按钮）
- 主内容区：响应式网格布局
  - 左侧：模板选择器 + 代码编辑器 + 已保存片段
  - 右侧：实时预览 + 控制台
- 弹窗：保存片段、编辑器设置

#### 3. 路由配置
**`/src/router/index.ts`**
- 确认 `/tools/code-playground` 路由已存在

### 实现步骤

1. **创建数据文件** - 复用React版本的codeTemplates.ts
2. **重写CodePlaygroundView.vue** - 完整实现所有功能
3. **安装依赖** - `@guolao/vue-monaco-editor`
4. **测试验证** - 确保所有功能正常运行，无TypeScript错误

### UI风格要求
- 使用Tailwind CSS，与现有项目风格一致
- 深色/浅色模式支持
- 卡片式布局，圆角设计
- 渐变标题效果
- 响应式布局

### 功能验证清单
- [ ] Monaco Editor正常显示和编辑
- [ ] 代码实时预览
- [ ] 设备尺寸切换
- [ ] 视图模式切换
- [ ] 模板加载
- [ ] 代码保存/加载/删除
- [ ] 代码复制/下载/分享
- [ ] 代码格式化
- [ ] 编辑器设置
- [ ] 缩放控制
- [ ] 控制台显示
- [ ] 无TypeScript错误
- [ ] 无控制台报错

请确认这个计划后，我将开始实施具体的代码编写。