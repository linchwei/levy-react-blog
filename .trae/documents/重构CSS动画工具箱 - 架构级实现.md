## 架构目标
打造一个专业级的 CSS 动画工具箱，引入业界顶级动画库，每个动画都有独特的展示效果

## 技术栈
- **Framer Motion** - React 动画库，用于组件动画
- **GSAP** - GreenSock 动画平台，用于复杂时间轴动画
- **@react-spring/web** - 物理弹簧动画
- **Lucide React** - 图标库

## 核心架构

### 1. 动画数据层重构
- `src/data/animations/` - 动画定义目录
  - `framer-motion.ts` - Framer Motion 动画配置
  - `gsap.ts` - GSAP 动画配置
  - `categories.ts` - 分类定义

### 2. 展示组件层
每个动画类型有独特的展示组件：
- `AnimationShowcaseCard.tsx` - 卡片入场动画展示
- `AnimationShowcaseButton.tsx` - 按钮交互动画展示
- `AnimationShowcaseModal.tsx` - 模态框动画展示
- `AnimationShowcaseList.tsx` - 列表项动画展示
- `AnimationShowcaseLoader.tsx` - 加载动画展示
- `AnimationShowcase3D.tsx` - 3D 效果展示

### 3. 交互控制面板
- 参数调节：duration, delay, easing, stagger
- 实时预览：滑块控制，即时反馈
- 代码生成器：支持多种格式输出

### 4. 页面重构
- `CSSAnimationPage.tsx` - 完全重写
  - 左侧：分类导航
  - 中间：动画网格展示
  - 右侧：参数控制面板
  - 底部：代码预览区

### 5. 动画效果示例（30+种）

**入场动画**
- Fade In - 卡片淡入
- Slide In Left/Right/Up/Down - 侧边栏滑入
- Scale In - 按钮缩放进入
- Flip In - 卡片翻转进入
- Rotate In - 图标旋转进入
- Bounce In - 弹窗弹跳进入

**强调动画**
- Pulse - 状态点脉冲
- Shake - 输入框错误摇晃
- Tada - 通知徽章惊喜效果
- Swing - 挂饰摆动
- Wobble - 果冻效果
- Heartbeat - 点赞心跳

**手势动画**
- Drag - 卡片拖拽
- Swipe - 列表项滑动
- Pinch - 图片缩放
- Pan - 画布平移

**页面过渡**
- Page Transition - 路由切换
- Modal Transition - 模态框
- Drawer Transition - 抽屉
- Toast Transition - 通知

**微交互**
- Button Hover - 按钮悬停
- Input Focus - 输入框聚焦
- Switch Toggle - 开关切换
- Checkbox Check - 勾选动画

**3D 效果**
- Card Flip - 卡片翻转
- 3D Rotate - 3D 旋转
- Perspective - 透视效果
- Cube Rotate - 立方体旋转

## 新增/修改文件
1. `src/data/animations/categories.ts` - 动画分类定义
2. `src/data/animations/framer-motion.ts` - Framer Motion 动画
3. `src/data/animations/gsap.ts` - GSAP 动画
4. `src/components/tools/showcases/` - 展示组件目录
5. `src/components/tools/AnimationControlPanel.tsx` - 控制面板
6. `src/components/tools/CodeGenerator.tsx` - 代码生成器
7. `src/pages/CSSAnimationPage.tsx` - 页面完全重写

## 依赖安装
```bash
npm install gsap @gsap/react framer-motion @react-spring/web
```