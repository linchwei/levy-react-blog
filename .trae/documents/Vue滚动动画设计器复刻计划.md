## 目标
在 Vue 版本（my-vue-app）中一比一复刻 React 版本的滚动动画设计器，确保 UI 完全一致且功能完整。

## 源文件分析
**React 版本路径**: `/Users/lin/Desktop/levy/project/my-react-app/src/pages/ScrollAnimationPage.tsx`

### 核心功能模块
1. **5种预设模板** - 淡入上浮、缩放旋转、视差层叠、文字逐行显示、水平滑入
2. **3种动画元素类型** - 文本(text)、盒子(box)、图片(image)
3. **可配置属性**:
   - 样式: 背景色、文字颜色、字体大小、内边距、圆角
   - 动画: Y轴位移(开始/结束)、透明度(开始/结束)、缩放(开始/结束)、旋转(开始/结束)、视差速度
4. **全局设置** - 平滑滚动开关、滚动范围(100-500vh)、弹簧刚度(50-300)、弹簧阻尼(10-100)
5. **代码生成** - **Vue 版本代码**（使用 Vue3 Composition API + CSS/JS 动画）
6. **实时预览** - 可滚动预览区域、进度指示器、重播功能

### UI 布局结构
- **左侧面板 (lg:col-span-3)** - 预设模板 + 动画元素列表
- **中间面板 (lg:col-span-5)** - 实时预览 + 代码输出(Tabs: Vue/CSS)
- **右侧面板 (lg:col-span-4)** - 元素属性 + 动画属性 + 全局设置

### 技术栈转换
| React | Vue |
|-------|-----|
| framer-motion (useScroll, useTransform, useSpring) | @vueuse/core (useScroll, useElementBounding) + CSS transform |
| shadcn/ui (Card, Button, Input, Slider, Tabs, Switch) | 自定义组件 |
| lucide-react | lucide-vue-next |
| sonner (toast) | alert 或自定义 toast |

## 代码生成（Vue版本）

### 1. Vue 代码生成
```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScroll, useElementBounding } from '@vueuse/core'

const containerRef = ref<HTMLElement>()
const { y, arrivedState } = useScroll(containerRef)
const { top, height } = useElementBounding(containerRef)

// 计算滚动进度 0-1
const progress = computed(() => {
  if (!height.value) return 0
  return Math.max(0, Math.min(1, -top.value / height.value))
})

// 动画计算
const elementStyle = computed(() => {
  const p = progress.value
  return {
    transform: `translateY(${startY + (endY - startY) * p}px) 
                scale(${startScale + (endScale - startScale) * p})
                rotate(${startRotate + (endRotate - startRotate) * p}deg)`,
    opacity: startOpacity + (endOpacity - startOpacity) * p
  }
})
</script>
```

### 2. CSS 代码生成（使用 scroll-timeline）
```css
@keyframes scrollAnimation {
  from {
    transform: translateY(100px) scale(0.8) rotate(0deg);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1) rotate(0deg);
    opacity: 1;
  }
}

.animated-element {
  animation: scrollAnimation linear;
  animation-timeline: view();
  animation-range: entry 0% cover 50%;
}
```

## 实现步骤

### 1. 创建类型定义
- `src/types/scrollAnimation.ts` - AnimationElement, ScrollTemplate 接口

### 2. 创建数据文件
- `src/data/scrollTemplates.ts` - 5种预设模板数据

### 3. 创建视图组件
- `src/views/ScrollAnimationView.vue` - 主页面组件

### 4. 添加路由
- 在 `src/router/index.ts` 中添加 `/tools/scroll-animation` 路由

### 5. 实现核心功能
- 使用 Vue 的 ref/reactive 管理状态
- 使用 @vueuse/core 的 useScroll/useElementBounding 实现滚动监听
- 使用 CSS transform 实现动画效果
- 实现 Vue 版本的代码生成功能

## 样式系统
- 使用 Tailwind CSS（已配置）
- 颜色方案: slate (背景), indigo/purple (主题色)
- 渐变背景: `bg-gradient-to-br from-slate-50 to-slate-100`
- 圆角: `rounded-lg`, `rounded-xl`
- 阴影: `shadow-sm`

## 关键实现细节
1. **滚动监听** - 使用 @vueuse/core 的 useScroll
2. **动画计算** - 根据 scroll progress 计算 transform 值
3. **弹簧效果** - 使用 lerp 插值模拟弹簧效果
4. **代码生成** - 生成 Vue3 Composition API 代码和 CSS scroll-timeline 代码
5. **响应式** - 保持 lg:grid-cols-12 布局

## 预计文件输出
- `src/views/ScrollAnimationView.vue` (主文件，约 1200+ 行)
- `src/data/scrollTemplates.ts` (数据文件)
- `src/types/scrollAnimation.ts` (类型定义)
- 路由更新

## 验收标准
- [ ] 终端无报错
- [ ] 控制台无错误
- [ ] 页面正常显示
- [ ] TypeScript 无错误
- [ ] UI 与 React 版本一致
- [ ] 代码生成输出 Vue 版本代码
- [ ] 所有功能正常工作

请确认此计划后，我将开始执行复刻工作。