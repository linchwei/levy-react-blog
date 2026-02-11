## 首页重构计划

### 目标
将 Vue3 版本的首页完全按照 React 版本实现，包括所有动画效果、交互和视觉设计。

### 技术栈调整
1. **动画库**: 从简单 CSS 动画升级为 `@vueuse/motion` + `gsap` 实现复杂动画
2. **图标**: 补充更多 Lucide 图标
3. **组件**: 完善 shadcn-vue 组件库

### 详细任务清单

#### 1. 依赖安装
```bash
npm install gsap @gsap/vue
```

#### 2. 组件重构

**Navigation.vue**
- [ ] 添加工具下拉菜单（6个工具项）
- [ ] 实现导航项 active 状态动画（layoutId 效果用 Vue Transition）
- [ ] 移动端菜单动画
- [ ] 主题切换保持

**HeroSection.vue**
- [ ] 滚动视差效果（useScroll + useTransform）
- [ ] 动态网格背景（AnimatedGrid）
- [ ] 浮动光球效果（FloatingOrbs）
- [ ] 文字逐字显示动画（TextReveal）
- [ ] 3D 倾斜头像卡片（TiltCard）
- [ ] 打字机效果（多文本循环）
- [ ] 代码片段装饰（CodeSnippet）
- [ ] 统计数字动画（AnimatedCounter）
- [ ] 社交链接动画
- [ ] 滚动指示器动画

**BentoGrid.vue**
- [ ] Spotlight 卡片效果（鼠标跟随光晕）
- [ ] 3D Tilt 倾斜效果
- [ ] 数字增长动画（AnimatedNumber）
- [ ] 浮动粒子效果
- [ ] 工具子项展示
- [ ] 悬停箭头动画
- [ ] 进度条动画

**FeaturesSection.vue**
- [ ] 6个特性卡片（带图标、描述、统计）
- [ ] 滚动进入动画
- [ ] 悬停光效和缩放
- [ ] 底部 CTA 链接

**LatestArticles.vue**
- [ ] 文章卡片（封面图、分类标签、统计）
- [ ] 图片悬停缩放
- [ ] 交错进入动画

**SkillsSection.vue**
- [ ] 4个技能分类
- [ ] 进度条动画
- [ ] 分类颜色区分

**Footer.vue**
- [ ] 4列布局（品牌、导航、资源、订阅）
- [ ] 社交链接
- [ ] 订阅表单

#### 3. 动画工具函数
创建 `composables/useAnimations.ts`:
- useAnimatedCounter - 数字增长动画
- useScrollProgress - 滚动进度
- useMousePosition - 鼠标位置追踪

#### 4. Store 更新
- [ ] blogStore: 添加 `getFeaturedPosts` getter
- [ ] todoStore: 确保 `useTodoStats` 可用

#### 5. 类型定义更新
- [ ] 补充 Skill 类型（level 字段）
- [ ] Post 类型补充（coverImage, publishedAt, readingTime 等）

### 文件变更清单
```
src/
├── components/
│   └── home/
│       ├── Navigation.vue      # 重写
│       ├── HeroSection.vue     # 重写
│       ├── BentoGrid.vue       # 重写
│       ├── FeaturesSection.vue # 重写
│       ├── LatestArticles.vue  # 重写
│       ├── SkillsSection.vue   # 重写
│       └── Footer.vue          # 重写
├── composables/
│   └── useAnimations.ts        # 新增
├── stores/
│   ├── blog.ts                 # 更新
│   └── todo.ts                 # 更新
└── types/
    └── index.ts                # 更新
```

### 预计工作量
- 开发时间: 2-3 小时
- 测试调整: 30 分钟

### 优先级
高 - 首页是用户第一印象，需要完整复刻