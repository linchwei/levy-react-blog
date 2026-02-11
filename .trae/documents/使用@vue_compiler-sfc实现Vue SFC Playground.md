## 问题分析

Vue版本实时预览不工作的原因是：
1. **没有使用SFC编译器** - 浏览器无法直接解析 `<script setup>` 和模板语法
2. **需要编译步骤** - Vue SFC需要编译成JavaScript才能在浏览器运行

## 解决方案

使用 **@vue/compiler-sfc** 浏览器版本在iframe中编译SFC代码。

### 实现步骤

1. **修改预览生成逻辑** - 加载 `@vue/compiler-sfc` CDN
2. **在iframe中编译SFC** - 使用 `compileScript` 和 `compileTemplate`
3. **执行编译后的代码** - 使用 `createApp` 挂载组件

### 需要修改的文件

**`/src/views/CodePlaygroundView.vue`**
- 修改 `generatePreviewContent` 函数
- 加载 `@vue/compiler-sfc` CDN
- 实现SFC编译逻辑
- 支持完整的 `<script setup>` 语法

### 预览生成逻辑

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://unpkg.com/@vue/compiler-sfc@3/dist/compiler-sfc.esm-browser.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="app"></div>
    <script type="module">
      // 1. 解析SFC
      // 2. 使用 compiler-sfc 编译
      // 3. 创建组件并挂载
    </script>
  </body>
</html>
```

请确认后我将开始实现。