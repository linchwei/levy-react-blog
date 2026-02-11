## 目标
创建一个功能完整的 CSS 动画工具箱页面，支持动画预览和代码复制

## 功能特性
1. **动画分类展示**：入场、强调、退出、特殊效果四大类
2. **实时预览**：悬停/点击即可查看动画效果
3. **代码复制**：一键复制 CSS 代码到剪贴板
4. **参数调节**：可调节动画时长、延迟、缓动函数
5. **搜索筛选**：支持按名称搜索和分类筛选

## 新增文件
1. `src/pages/CSSAnimationPage.tsx` - 动画工具箱主页面
2. `src/data/cssAnimations.ts` - 30+ 种动画数据定义
3. `src/components/tools/AnimationCard.tsx` - 动画卡片组件
4. `src/components/tools/AnimationPreview.tsx` - 动画预览组件
5. `src/components/tools/CodeBlock.tsx` - 代码展示组件

## 修改文件
1. `src/pages/ToolsPage.tsx` - 添加 CSS 动画工具箱入口卡片
2. `src/App.tsx` - 添加新页面路由

## 动画列表（30+种）
- 入场：fadeIn, fadeInUp/Down/Left/Right, slideIn, zoomIn, bounceIn
- 强调：pulse, shake, tada, swing, wobble, jello
- 退出：fadeOut, slideOut, zoomOut, bounceOut
- 特殊：flip, rotate, blur, glow, shimmer, float