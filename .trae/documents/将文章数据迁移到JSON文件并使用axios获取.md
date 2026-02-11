## 计划概述
将硬编码在 blogStore.ts 中的数据迁移到独立的 JSON 文件中，使用 axios 模拟从服务端获取数据。

## 实施步骤

### 1. 创建 JSON 数据文件
在 public 目录下创建以下文件：
- `posts.json` - 存放20篇文章数据
- `projects.json` - 存放项目数据
- `skills.json` - 存放技能数据
- `timeline.json` - 存放时间线数据

### 2. 修改 blogStore.ts
- 添加 axios 导入
- 添加异步获取数据的方法
- 添加 loading 和 error 状态
- 修改 store 初始化逻辑，从 JSON 文件加载数据
- 保持原有接口和方法不变

### 3. 添加加载状态处理
- 在组件中显示 loading 状态
- 添加错误处理和重试机制
- 数据获取完成后再渲染内容

### 4. 确保数据格式兼容
- JSON 中的日期需要序列化为字符串，使用时再转换
- 保持原有数据结构和类型定义

## 技术方案
- 使用 axios 进行 HTTP 请求
- 使用 Promise.all 并行获取多个 JSON 文件
- 添加适当的错误处理和 loading 状态
- 保持向后兼容，原有功能不受影响

请确认后我将开始实施。