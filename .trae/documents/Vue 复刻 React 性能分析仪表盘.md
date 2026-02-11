## 目标
一比一复刻 React 性能分析仪表盘到 Vue 项目，UI 风格 100% 还原

## 参考文件
`/Users/lin/Desktop/levy/project/my-react-app/src/pages/PerformanceDashboardPage.tsx`

## 页面结构分析

### 1. 头部区域
- 渐变背景标题栏
- 性能监控 Badge
- 主标题：性能分析仪表盘
- 副标题说明

### 2. 综合评分卡片
- 圆形进度条显示评分 (0-100)
- 评分颜色：绿色(≥90)、黄色(≥50)、红色(<50)
- 监控状态切换按钮
- FPS 和 DOM 节点数快速统计

### 3. Tab 切换区域 (3个标签)
- **概览**: Core Web Vitals 4个指标卡片 + 时间指标
- **FPS 监控**: 实时 FPS 曲线图 (AreaChart)
- **资源**: 内存使用进度条 + 资源加载数

### 4. 右侧边栏
- 优化建议列表 (高/中/低优先级)
- 指标说明图例

### 5. 底部特性卡片
- 实时监控、Core Web Vitals、优化建议

## 技术实现方案

### 依赖安装
```bash
npm install recharts lucide-vue-next
```

### 组件映射 (React → Vue)
| React | Vue |
|-------|-----|
| motion (framer-motion) | @vueuse/motion 或 CSS transitions |
| Card/CardHeader/CardContent/CardTitle | 自定义 Card 组件 |
| Button | @/components/ui/Button.vue |
| Badge | @/components/ui/Badge.vue |
| Progress | @/components/ui/Progress.vue |
| Tabs | @/components/ui/Tabs.vue |
| AreaChart/ResponsiveContainer | recharts (支持 Vue) |
| Lucide icons | lucide-vue-next |

### 核心功能实现
1. **FPS 监控**: requestAnimationFrame 计算帧率
2. **Core Web Vitals**: PerformanceObserver API
3. **内存监控**: performance.memory API
4. **实时图表**: recharts AreaChart
5. **性能建议**: 基于指标阈值自动生成

### 颜色系统
- 背景渐变: `from-slate-50 to-slate-100` (light), `from-slate-950 to-slate-900` (dark)
- 成功: `text-green-500`, `bg-green-500`
- 警告: `text-yellow-500`, `bg-yellow-500`
- 错误: `text-red-500`, `bg-red-500`
- 主色: `text-blue-600`, `bg-blue-100`

### 自测清单
- [ ] 终端无错误
- [ ] 浏览器控制台无错误
- [ ] TypeScript 无错误 (`vue-tsc --noEmit`)
- [ ] 页面正常渲染
- [ ] FPS 监控正常工作
- [ ] Core Web Vitals 数据显示正确
- [ ] 图表正常显示
- [ ] Tab 切换正常
- [ ] 优化建议根据性能动态生成
- [ ] 响应式布局正常