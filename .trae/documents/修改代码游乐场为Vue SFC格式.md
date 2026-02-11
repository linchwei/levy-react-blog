## 修改计划

### 目标
将代码游乐场从分开的HTML/CSS/JS改为Vue单文件组件(SFC)格式

### 需要修改的文件

#### 1. `/src/data/codeTemplates.ts`
- 将模板数据改为单个`code`字段（包含完整的SFC代码）
- 9个模板全部改为SFC格式：

```vue
<template>
  <!-- HTML内容 -->
</template>

<script setup>
// Vue3 Composition API代码
</script>

<style scoped>
/* CSS样式 */
</style>
```

#### 2. `/src/views/CodePlaygroundView.vue`
- 将三栏编辑器（HTML/CSS/JS）改为单栏编辑器
- 编辑完整的SFC代码
- 修改预览逻辑，使用Vue3 SFC编译器
- 简化UI：移除Tab切换，改为单一编辑器

### SFC预览实现方案
使用iframe + Vue3 SFC编译：
1. 解析用户输入的SFC代码（提取template/script/style）
2. 使用Vue3 CDN加载编译器
3. 动态编译并渲染组件

### 实现步骤
1. 修改模板数据为SFC格式
2. 重写编辑器为单栏模式
3. 修改预览生成逻辑支持SFC
4. 测试验证所有模板正常工作

请确认后我将开始修改。