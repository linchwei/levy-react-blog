将 Vue 项目的 Scene3DBuilderView.vue 完全重写，一比一复刻 React 版本的 Scene3DBuilderPage.tsx，实现 99% UI 还原度。

## React 版本功能分析

### 1. 3D 渲染核心
- 使用 @react-three/fiber 和 @react-three/drei
- 支持 Box、Sphere、Cylinder、Cone、Torus 五种 3D 几何体
- 真实 3D 场景，支持旋转、缩放、平移
- 网格地面 (Grid)
- 阴影效果
- 多光源照明

### 2. UI 布局结构
- 顶部 Header：标题 + Save/Load/Clear 按钮
- 左侧边栏：添加对象按钮网格 + 场景对象列表
- 中间：3D Canvas 画布
- 右侧边栏：属性面板（Transform/Material Tabs）
- 底部：Grid/Shadows 开关

### 3. 功能特性
- 添加/删除/复制 3D 对象
- 选择对象高亮显示
- Transform 模式：Translate/Rotate/Scale
- 实时调整 Position/Rotation/Scale (X/Y/Z)
- 颜色选择和预设
- 场景保存/加载 (JSON)
- 背景色设置
- 对象可见性切换

### 4. 技术栈转换
| React | Vue |
|-------|-----|
| @react-three/fiber | @tresjs/core |
| @react-three/drei | @tresjs/cientos |
| framer-motion | @vueuse/motion 或原生 transition |
| lucide-react | lucide-vue-next |
| sonner toast | 已实现的 useToast |
| shadcn/ui | 已有的 UI 组件 |

## 实施步骤

1. **安装依赖**
   - @tresjs/core - Vue 的 Three.js 集成
   - @tresjs/cientos - 辅助组件
   - three - Three.js 核心

2. **创建类型定义**
   - ObjectType: 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus'
   - SceneObject 接口
   - SceneState 接口

3. **创建 3D 场景组件**
   - SceneObject3D - 单个 3D 对象渲染
   - Scene - 完整场景容器

4. **重写主页面**
   - 完全复刻 React 版本的 UI 结构
   - 使用 Vue 组合式 API
   - 保持相同的交互逻辑

5. **自测验证**
   - 语法检查
   - 页面渲染
   - 控制台无错误
   - 终端无错误
   - 功能测试

请确认此方案后，我将开始实施。