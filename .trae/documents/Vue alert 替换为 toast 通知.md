将 Vue 项目中的所有 `alert()` 调用替换为右上角的 toast 通知，与 React 版本保持一致。

## 需要修改的文件
共 7 个文件，22 处 alert() 调用：

1. **ScrollAnimationView.vue** - 2 处
   - 模板选择提示
   - 代码复制提示

2. **SVGAnimationView.vue** - 3 处
   - 预设选择提示
   - 代码复制提示
   - SVG 下载提示

3. **CodePlaygroundView.vue** - 11 处
   - 代码复制、下载、保存、加载、删除等提示

4. **codeTemplates.ts** - 1 处
   - alert message

5. **AIAnimationView.vue** - 4 处
   - 输入验证、生成成功/失败、复制提示

6. **BlogDetailView.vue** - 1 处
   - 链接复制提示

7. **Footer.vue** - 1 处
   - 订阅成功提示

## 实现方案

由于 Vue 项目目前没有 toast 库，我有两个选择：

**方案 A：使用 Vue 3 原生自定义 Toast 组件**
- 创建一个全局 Toast 组件（类似 React 的 sonner）
- 使用 Vue 的 Teleport 渲染到 body
- 从右上角滑入显示
- 支持 success/error/info 类型
- 3秒后自动消失

**方案 B：集成第三方库**
- 如 vue-toastification 或 vue3-toastify
- 但需要额外安装依赖

我建议使用 **方案 A**，创建一个轻量级的自定义 Toast 组件，这样：
1. 无需额外依赖
2. 样式与项目现有设计系统一致
3. 可以完全复刻 React 版本的交互体验

## 具体实施步骤

1. 创建 `Toast.vue` 组件
2. 创建 `useToast.ts` composable
3. 在 App.vue 中挂载 Toast 容器
4. 逐个替换所有 alert() 调用

请确认此方案后，我将开始实施。