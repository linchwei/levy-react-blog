## 修改计划

### 目标
将代码游乐场从支持React代码改为支持Vue3代码

### 需要修改的文件

#### 1. `/src/data/codeTemplates.ts`
- 将9个模板从React代码改为Vue3代码
- HTML部分改为Vue模板语法
- JS部分改为Vue3 Composition API

#### 2. `/src/views/CodePlaygroundView.vue`
- 修改预览生成逻辑，使用Vue3运行时替代React
- iframe中使用Vue3 CDN + Vue3编译器
- 支持Vue单文件组件风格

### Vue3预览实现方案
使用iframe + srcDoc，加载：
- Vue3 Global Build (vue.global.js)
- Tailwind CSS
- 用户代码编译为Vue组件

### 模板转换示例
**React版本：**
```jsx
const [count, setCount] = useState(0);
return <button onClick={() => setCount(c => c + 1)}>{count}</button>
```

**Vue3版本：**
```vue
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>
<template>
  <button @click="count++">{{ count }}</button>
</template>
```

### 实现步骤
1. 修改模板数据为Vue3代码
2. 修改预览生成函数支持Vue3
3. 测试验证所有模板正常工作

请确认后我将开始修改。