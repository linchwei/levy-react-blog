## 目标
在 Vue 版本（my-vue-app）中一比一复刻 React 版本的 SVG 动画编辑器，确保 UI 完全一致且功能完整。

## 源文件分析
**React 版本路径**: `/Users/lin/Desktop/levy/project/my-react-app/src/pages/SVGAnimationPage.tsx`

### 核心功能模块
1. **12+ SVG 预设路径** - 心形、五角星、对勾、箭头、无限符号、螺旋、波浪、云朵、闪电、定位标记、对话气泡、音符
2. **5 种动画效果** - 描边绘制(draw)、淡入淡出(fade)、缩放动画(scale)、脉冲效果(pulse)、旋转动画(rotate)
3. **可视化编辑面板** - 描边颜色/宽度、填充颜色/透明度
4. **动画配置** - 持续时间、延迟、缓动函数、循环播放
5. **代码导出** - CSS 和 Framer Motion 两种格式
6. **SVG 下载功能**

### UI 布局结构
- **左侧面板 (lg:col-span-4)** - 路径选择(Tabs: 预设库/自定义) + 动画类型选择
- **中间面板 (lg:col-span-5)** - 实时预览 + 生成的代码(Tabs: CSS/Framer Motion)
- **右侧面板 (lg:col-span-3)** - 样式设置 + 动画设置

### 技术栈转换
| React | Vue |
|-------|-----|
| framer-motion | @vueuse/motion 或原生 CSS animation |
| shadcn/ui (Card, Button, Input, Slider, Tabs, Switch) | 自定义组件或 shadcn-vue |
| lucide-react | lucide-vue-next |
| sonner (toast) | 自定义 toast 或 vue-sonner |

## 实现步骤

### 1. 创建数据文件
- `src/data/svgPresets.ts` - SVG 预设路径数据
- 包含 12 个预设的 id, name, category, path, viewBox, description

### 2. 创建类型定义
- `src/types/svgAnimation.ts` - AnimationConfig, AnimationType, SVGPreset 接口

### 3. 创建视图组件
- `src/views/SVGAnimationView.vue` - 主页面组件

### 4. 组件拆分（可选）
- `src/components/svg-animation/PreviewPanel.vue` - 预览面板
- `src/components/svg-animation/PathSelector.vue` - 路径选择器
- `src/components/svg-animation/AnimationTypes.vue` - 动画类型选择
- `src/components/svg-animation/StyleConfig.vue` - 样式配置
- `src/components/svg-animation/AnimationConfig.vue` - 动画配置
- `src/components/svg-animation/CodeOutput.vue` - 代码输出

### 5. 添加路由
- 在 `src/router/index.ts` 中添加 `/tools/svg-animation` 路由

### 6. 安装依赖
```bash
npm install lucide-vue-next
# 可选: npm install @vueuse/motion
```

## 样式系统
- 使用 Tailwind CSS（已配置）
- 颜色方案: slate (背景), pink/purple (主题色), green/yellow/blue/orange (图标)
- 渐变背景: `bg-gradient-to-br from-slate-50 to-slate-100`
- 圆角: `rounded-lg`, `rounded-full`
- 阴影: `shadow-xl`

## 关键实现细节
1. **路径长度计算** - 使用 SVGPathElement.getTotalLength()
2. **动画实现** - Vue 使用 CSS animation 或 @vueuse/motion
3. **代码生成** - 复用 React 版本的 generateCSS 和 generateFramer 逻辑
4. **响应式** - 保持 lg:grid-cols-12 布局

## 预计文件输出
- `src/views/SVGAnimationView.vue` (主文件，约 1100+ 行)
- `src/data/svgPresets.ts` (数据文件)
- `src/types/svgAnimation.ts` (类型定义)
- 路由更新

请确认此计划后，我将开始执行复刻工作。