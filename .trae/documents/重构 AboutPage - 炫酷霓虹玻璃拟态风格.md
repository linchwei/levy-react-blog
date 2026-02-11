## 重构目标

将 AboutPage 重构为炫酷、炫技的风格，参考 TimelinePage 的玻璃拟态 + 霓虹发光设计，支持完美主题切换。

## 设计方案

### 1. 视觉风格
- **Glassmorphism 玻璃拟态**：半透明毛玻璃卡片效果
- **Neon Glow 霓虹发光**：动态渐变边框和发光效果
- **粒子背景**：复用 TimelinePage 的粒子背景组件
- **3D 悬浮效果**：鼠标跟随的卡片倾斜

### 2. 主题系统
- **深色模式**：深蓝紫渐变背景 + 霓虹青/紫/粉发光
- **浅色模式**：柔和渐变背景 + 明亮色彩发光
- CSS 变量实现无缝切换 + 过渡动画

### 3. 炫技动画效果
- **Hero 区域**：打字机效果标题 + 霓虹发光徽章
- **统计卡片**：3D 倾斜卡片 + 发光效果 + 数字滚动动画
- **身份卡片**：悬浮发光 + 图标动画
- **技能区域**：雷达图 + 进度条动画
- **项目卡片**：3D 倾斜 + 悬停展开详情
- **时间轴**：脉冲节点 + 渐变连线
- **兴趣卡片**：网格布局 + 悬停发光

### 4. 配色方案

**深色模式**：
- 背景：`from-slate-950 via-purple-950/30 to-slate-950`
- 霓虹青：`#00f5ff`
- 霓虹紫：`#b829f7`
- 霓虹粉：`#ff0080`

**浅色模式**：
- 背景：`from-blue-50 via-white to-purple-50`
- 明亮蓝：`#0066ff`
- 明亮紫：`#7c3aed`
- 明亮粉：`#ec4899`

### 5. 技术实现
- 复用 TimelinePage 的组件：ParticleBackground, TiltCard, TypeWriter
- Framer Motion：动画编排
- CSS 3D Transforms：3D 效果
- 主题监听：MutationObserver

### 6. 文件修改
- 完全重写 AboutPage.tsx
- 添加 TiltCard 组件到 about 目录
- 添加 TypeWriter 组件到 about 目录
- 更新 SkillRadarChart 支持双主题

请确认这个重构计划后，我将开始实施具体的代码实现。