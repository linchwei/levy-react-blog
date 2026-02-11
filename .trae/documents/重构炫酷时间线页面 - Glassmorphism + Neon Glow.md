## 重构目标

打造一个炫酷、炫技的时间线页面，采用 Glassmorphism（玻璃拟态）+ Neon Glow（霓虹发光）风格，支持完美主题切换。

## 设计方案

### 1. 视觉风格
- **Glassmorphism 玻璃拟态**：半透明毛玻璃卡片效果
- **Neon Glow 霓虹发光**：动态渐变边框和发光效果
- **3D 悬浮效果**：鼠标跟随的卡片倾斜
- **粒子背景**：动态流动的粒子网络动画

### 2. 主题系统
- **深色模式**：深蓝紫渐变背景 + 霓虹青/紫/粉发光
- **浅色模式**：柔和渐变背景 + 明亮色彩发光
- CSS 变量实现无缝切换 + 过渡动画

### 3. 炫技动画
- 视差滚动效果
- 3D 卡片悬浮（鼠标跟随倾斜）
- 时间轴节点脉冲呼吸灯
- 技能雷达图可视化
- 打字机标题效果
- 按钮磁吸效果
- 卡片展开/收起动画

### 4. 配色方案

**深色模式**：
- 背景：`from-slate-900 via-purple-900 to-slate-900`
- 霓虹青：`#00f5ff`
- 霓虹紫：`#b829f7`
- 霓虹粉：`#ff0080`

**浅色模式**：
- 背景：`from-blue-50 via-white to-purple-50`
- 明亮蓝：`#0066ff`
- 明亮紫：`#7c3aed`
- 明亮粉：`#ec4899`

### 5. 技术实现
- Framer Motion：动画编排
- CSS 3D Transforms：3D 效果
- Canvas API：粒子背景 + 雷达图
- CSS Variables：主题系统
- Intersection Observer：滚动触发

### 6. 文件修改
- 完全重写 TimelinePage.tsx
- 添加 ParticleBackground 组件
- 添加 SkillRadar 组件
- 添加 TiltCard 3D 组件
- 添加 TypeWriter 组件

请确认这个重构计划后，我将开始实施具体的代码实现。