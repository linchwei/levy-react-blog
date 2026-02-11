## AI 动画生成器复刻计划

### 目标
将 Vue3 版本的 AI 动画生成器按照 React 版本 1:1 复刻，包含所有 UI 组件、动画效果、智能匹配和代码生成功能。

### 差异对比

**React 版本特性：**
- 渐变背景和标题
- 输入框和生成按钮
- 示例提示标签
- 8个动画预设（弹跳心形、滑入淡入、脉冲发光、错误摇晃、3D翻转、加载旋转、悬浮效果、弹出缩放）
- 智能匹配算法（关键词匹配）
- 参数微调面板（Duration、Delay、Easing）
- 实时预览区域
- 代码输出（Framer Motion + CSS 双标签页）
- 代码复制功能
- 底部特性介绍卡片

**Vue 版本当前状态：**
- 文件不存在，需要全新创建

### 详细任务清单

#### 1. 创建数据文件

**data/animationPresets.ts**
- [ ] AnimationPreset 接口
- [ ] AnimationConfig 接口
- [ ] 8个动画预设数据
- [ ] Framer Motion 代码
- [ ] CSS 代码
- [ ] 示例提示数组

#### 2. 创建 AIAnimationView 页面

**views/AIAnimationView.vue**
- [ ] 渐变标题和背景
- [ ] 输入框和生成按钮
- [ ] 示例提示标签
- [ ] 智能匹配逻辑
- [ ] 参数微调面板
- [ ] 实时预览区域
- [ ] 8个动画预览组件
- [ ] 代码输出标签页
- [ ] 代码复制功能
- [ ] 底部特性卡片

#### 3. 更新路由

**router/index.ts**
- [ ] 添加 /tools/ai-animation 路由

### 文件变更清单

```
src/
├── data/
│   └── animationPresets.ts       # 新建
├── views/
│   └── AIAnimationView.vue       # 新建
└── router/
    └── index.ts                  # 更新
```

### 预计工作量
- 开发时间: 1.5-2 小时
- 测试验证: 15 分钟

### 完成标准
- [ ] TypeScript 检查通过
- [ ] 浏览器控制台无错误
- [ ] 终端无错误
- [ ] 所有动画预设正常
- [ ] 智能匹配功能正常
- [ ] 代码生成和复制正常