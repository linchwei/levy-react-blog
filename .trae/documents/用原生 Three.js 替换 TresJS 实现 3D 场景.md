## 问题分析
TresJS 持续出现 useTresContext 错误，页面空白。多次尝试修复（配置 isCustomElement、异步导入、降级版本、重构组件结构）均失败。

## 解决方案
**完全移除 TresJS，使用原生 Three.js 实现 3D 场景**

### 原因
1. TresJS 的 Vue 抽象层存在上下文传递问题
2. 原生 Three.js 稳定可靠，有完整控制权
3. 无需依赖 Vue-specific 的 3D 封装

### 实施步骤

**1. 移除 TresJS 依赖**
- 卸载 @tresjs/core 和 @tresjs/cientos
- 保留 three.js（已安装）

**2. 重写 Scene3DBuilderView.vue**
- 移除所有 TresJS 组件（TresCanvas, TresMesh 等）
- 创建原生 canvas 元素
- 在 onMounted 中初始化 Three.js：
  - Scene, PerspectiveCamera, WebGLRenderer
  - AmbientLight, DirectionalLight, PointLight
  - GridHelper
  - OrbitControls（from three/examples/jsm/controls/OrbitControls）
- 为每种对象类型创建 Mesh（Box, Sphere, Cylinder, Cone, Torus）
- 实现 Raycaster 处理点击选择
- 添加动画循环 requestAnimationFrame
- 处理窗口 resize

**3. 对象管理**
- watch 监听 scene.objects 变化
- 动态添加/移除/更新 Mesh
- 选中对象高亮效果

**4. 验证清单**
- [ ] 所有 5 种对象类型正确渲染
- [ ] 相机控制（旋转/缩放/平移）正常工作
- [ ] 点击选择对象正常工作
- [ ] Grid 显示/隐藏正常
- [ ] Shadows 正常工作
- [ ] 无控制台错误

### 预期结果
3D 场景完全正常工作，无错误，功能完整。