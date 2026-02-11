## CSS 动画工具箱复刻计划

### 目标
将 Vue3 版本的 CSS 动画工具箱按照 React 版本 1:1 复刻，包含所有动画效果、分类筛选、配置面板和交互功能。

### 差异对比

**React 版本特性：**
- 6大动画分类（入场、强调、手势、过渡、微交互、3D）
- 左侧分类导航栏
- 搜索功能
- 动画配置面板（Duration、Delay、Stagger、Easing）
- 浮动底部配置栏
- 代码生成和复制功能
- 8个展示组件（CardEntrance、ButtonEmphasis、ModalTransition、ListStagger、GestureDrag、MicroInteraction、Flip3D、Loader）
- 分类颜色标识
- 选中动画高亮

**Vue 版本当前问题：**
- 只有6个简单动画
- 无分类系统
- 无配置面板
- 无代码生成功能
- 无展示组件

### 详细任务清单

#### 1. 创建动画数据和类型

**data/animations.ts**
- [ ] AnimationCategory 类型定义
- [ ] animationCategories 分类数据
- [ ] animationParameters 参数配置
- [ ] AnimationItem 接口
- [ ] animations 动画列表

#### 2. 创建展示组件

**components/tools/showcases/**
- [ ] CardEntranceShowcase.vue - 卡片入场动画
- [ ] ButtonEmphasisShowcase.vue - 按钮强调动画
- [ ] ModalTransitionShowcase.vue - 模态框过渡
- [ ] ListStaggerShowcase.vue - 列表交错动画
- [ ] GestureDragShowcase.vue - 手势拖拽
- [ ] MicroInteractionShowcase.vue - 微交互
- [ ] Flip3DShowcase.vue - 3D翻转
- [ ] LoaderShowcase.vue - 加载状态

#### 3. 重写 CSSAnimationView 页面

**views/CSSAnimationView.vue**
- [ ] 返回按钮
- [ ] 渐变标题 Animation Gallery
- [ ] 左侧分类侧边栏（6个分类+全部）
- [ ] 搜索框
- [ ] 动画卡片网格
- [ ] 分类颜色徽章
- [ ] 选中动画高亮
- [ ] 浮动配置面板（Duration、Delay、Stagger、Easing）
- [ ] 代码生成和复制
- [ ] 空状态处理

#### 4. 更新路由（如需）

### 文件变更清单

```
src/
├── data/
│   └── animations.ts                    # 新建
├── components/tools/showcases/
│   ├── CardEntranceShowcase.vue         # 新建
│   ├── ButtonEmphasisShowcase.vue       # 新建
│   ├── ModalTransitionShowcase.vue      # 新建
│   ├── ListStaggerShowcase.vue          # 新建
│   ├── GestureDragShowcase.vue          # 新建
│   ├── MicroInteractionShowcase.vue     # 新建
│   ├── Flip3DShowcase.vue               # 新建
│   └── LoaderShowcase.vue               # 新建
└── views/
    └── CSSAnimationView.vue             # 重写
```

### 依赖检查
- 确认 @vueuse/motion 或其他动画库可用
- 或使用原生 CSS/GSAP

### 预计工作量
- 开发时间: 2-3 小时
- 测试验证: 20 分钟

### 完成标准
- [ ] TypeScript 检查通过
- [ ] 浏览器控制台无错误
- [ ] 终端无错误
- [ ] 所有动画正常展示
- [ ] 配置面板功能正常
- [ ] 代码复制功能正常