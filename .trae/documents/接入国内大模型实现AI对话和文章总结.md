## 目标
在文章详情页接入国内免费大模型，实现：
1. AI对话功能 - 悬浮聊天窗口，可针对文章内容问答
2. 文章总结功能 - 一键生成摘要和关键要点

## 推荐方案
使用 **DeepSeek API**（500万Token/天免费额度）
- 国产最强开源模型
- OpenAI兼容格式，易于集成
- 推理能力强，适合技术文章

## 新增文件
1. `.env.local` - API Key配置
2. `src/services/aiService.ts` - 大模型API封装
3. `src/services/summaryService.ts` - 文章总结服务
4. `src/components/ai/AIChatWidget.tsx` - AI对话悬浮组件
5. `src/components/ai/ArticleSummary.tsx` - 文章总结组件
6. `src/components/ai/ChatMessage.tsx` - 聊天消息组件
7. `src/hooks/useAIChat.ts` - AI对话Hook
8. `src/hooks/useArticleSummary.ts` - 文章总结Hook

## 修改文件
- `src/pages/BlogDetailPage.tsx` - 集成AI组件到侧边栏

## 功能特性
- 流式响应，实时显示AI回复
- 多轮对话上下文保持
- 一键生成文章摘要（3-5个要点）
- 对话历史本地存储
- 加载状态骨架屏