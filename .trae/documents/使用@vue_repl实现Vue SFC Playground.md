## 问题分析

之前的实现使用 `@vue/compiler-sfc` 在iframe中编译，但存在各种问题。

## 解决方案

使用 Vue 官方提供的 **`@vue/repl`** 库，这是Vue SFC Playground的官方实现。

### 实现步骤

1. **安装 @vue/repl**
   ```bash
   npm install @vue/repl
   ```

2. **修改 CodePlaygroundView.vue**
   - 使用 `@vue/repl` 的 `Repl` 组件
   - 使用 `useStore` 管理代码状态
   - 配置 Monaco 编辑器

3. **简化实现**
   - 不需要手动处理iframe
   - 不需要手动编译SFC
   - `@vue/repl` 会自动处理所有编译和预览

### 代码示例

```vue
<script setup>
import { Repl, useStore } from '@vue/repl'
import Monaco from '@vue/repl/monaco-editor'

const store = useStore({
  // 初始代码
}, location.hash)
</script>

<template>
  <Repl :store="store" :editor="Monaco" />
</template>
```

请确认后我将开始实现。