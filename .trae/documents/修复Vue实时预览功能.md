## 问题分析

Vue版本实时预览不工作，原因如下：

### 问题1: `<script setup>` 语法不兼容
- 模板使用了 `<script setup>` 语法糖
- 但预览生成时直接将代码嵌入setup()函数，导致语法错误
- `<script setup>` 需要编译器转换，不能直接在浏览器运行

### 问题2: 转义符问题
- 模板中的 `<\/script>` 在字符串中可能有问题

## 解决方案

### 方案: 改用传统Composition API语法
不使用 `<script setup>`，改用：
```javascript
export default {
  setup() {
    // 代码在这里
    return { ... }
  }
}
```

### 需要修改的文件

1. **`/src/data/codeTemplates.ts`**
   - 将所有模板的 `<script setup>` 改为传统 `<script>` 语法
   - 使用 `export default { setup() {} }` 格式

2. **`/src/views/CodePlaygroundView.vue`**
   - 修改 `parseSFC` 函数，支持 `<script>` 标签（不带setup）
   - 修改预览生成逻辑，直接使用script内容作为组件选项

### 实现步骤
1. 修改所有模板为传统Composition API格式
2. 修改预览生成逻辑
3. 测试验证

请确认后我将开始修复。