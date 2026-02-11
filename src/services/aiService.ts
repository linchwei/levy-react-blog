/**
 * AI 服务层 - 封装大模型 API 调用
 * 支持 DeepSeek、智谱GLM、通义千问等国内大模型
 * 自动降级策略：DeepSeek -> 智谱GLM -> 通义千问
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatOptions {
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  stream?: boolean
  onStream?: (chunk: string) => void
}

export interface ChatResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

// 提供商类型
type Provider = 'deepseek' | 'zhipu' | 'qwen'

// API 配置
const CONFIG = {
  deepseek: {
    key: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
    url: import.meta.env.VITE_DEEPSEEK_API_URL || 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
  },
  zhipu: {
    key: import.meta.env.VITE_ZHIPU_API_KEY || '',
    url: 'https://open.bigmodel.cn/api/paas/v4',
    model: 'glm-4-flash',
  },
  qwen: {
    key: import.meta.env.VITE_QWEN_API_KEY || '',
    url: 'https://dashscope.aliyuncs.com/api/v1',
    model: 'qwen-turbo',
  },
}

/**
 * 获取可用的提供商列表（按优先级排序）
 */
function getAvailableProviders(): Provider[] {
  const providers: Provider[] = []
  
  if (CONFIG.deepseek.key && CONFIG.deepseek.key !== 'your_deepseek_api_key_here') {
    providers.push('deepseek')
  }
  if (CONFIG.zhipu.key && CONFIG.zhipu.key !== 'your_zhipu_api_key_here') {
    providers.push('zhipu')
  }
  if (CONFIG.qwen.key && CONFIG.qwen.key !== 'your_qwen_api_key_here') {
    providers.push('qwen')
  }
  
  return providers
}

/**
 * 构建请求头
 */
function buildHeaders(provider: Provider): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  switch (provider) {
    case 'deepseek':
      headers['Authorization'] = `Bearer ${CONFIG.deepseek.key}`
      break
    case 'zhipu':
      headers['Authorization'] = `Bearer ${CONFIG.zhipu.key}`
      break
    case 'qwen':
      headers['Authorization'] = `Bearer ${CONFIG.qwen.key}`
      break
  }
  
  return headers
}

/**
 * 构建请求体
 */
function buildBody(provider: Provider, options: ChatOptions): object {
  const { messages, temperature = 0.7, maxTokens = 2000 } = options
  
  switch (provider) {
    case 'deepseek':
      return {
        model: CONFIG.deepseek.model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: options.stream,
      }
    case 'zhipu':
      return {
        model: CONFIG.zhipu.model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: options.stream,
      }
    case 'qwen':
      return {
        model: CONFIG.qwen.model,
        input: {
          messages,
        },
        parameters: {
          temperature,
          max_tokens: maxTokens,
          result_format: 'message',
        },
      }
    default:
      throw new Error(`未知的提供商: ${provider}`)
  }
}

/**
 * 解析响应
 */
function parseResponse(provider: Provider, data: any): ChatResponse {
  switch (provider) {
    case 'deepseek':
    case 'zhipu':
      return {
        content: data.choices[0]?.message?.content || '',
        usage: data.usage ? {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens,
        } : undefined,
      }
    case 'qwen':
      return {
        content: data.output?.choices[0]?.message?.content || '',
        usage: data.usage ? {
          promptTokens: data.usage.input_tokens,
          completionTokens: data.usage.output_tokens,
          totalTokens: data.usage.total_tokens,
        } : undefined,
      }
    default:
      throw new Error(`未知的提供商: ${provider}`)
  }
}

/**
 * 解析流式响应
 */
function parseStreamChunk(provider: Provider, data: any): string | null {
  switch (provider) {
    case 'deepseek':
    case 'zhipu':
      return data.choices[0]?.delta?.content || null
    case 'qwen':
      return data.output?.choices[0]?.message?.content || null
    default:
      return null
  }
}

/**
 * 非流式聊天请求（带自动降级）
 */
export async function chat(options: ChatOptions): Promise<ChatResponse> {
  const providers = getAvailableProviders()
  
  if (providers.length === 0) {
    throw new Error('未配置任何 AI API Key，请在 .env.local 中配置至少一个提供商（DeepSeek、智谱GLM 或 通义千问）')
  }
  
  let lastError: Error | null = null
  
  for (const provider of providers) {
    try {
      console.log(`尝试使用 ${provider} API...`)
      
      const response = await fetch(`${CONFIG[provider].url}/chat/completions`, {
        method: 'POST',
        headers: buildHeaders(provider),
        body: JSON.stringify(buildBody(provider, { ...options, stream: false })),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error?.message || errorData.message || `HTTP ${response.status}`
        
        if (errorMessage.includes('Insufficient Balance') || 
            errorMessage.includes('余额不足') ||
            response.status === 429) {
          console.warn(`${provider} API 余额不足或限流，尝试下一个提供商...`)
          lastError = new Error(`${provider}: ${errorMessage}`)
          continue
        }
        
        throw new Error(errorMessage)
      }
      
      const data = await response.json()
      console.log(`${provider} API 调用成功`)
      return parseResponse(provider, data)
      
    } catch (error) {
      console.error(`${provider} API 调用失败:`, error)
      lastError = error instanceof Error ? error : new Error(String(error))
      continue
    }
  }
  
  throw lastError || new Error('所有 AI 提供商都不可用')
}

/**
 * 流式聊天请求（带自动降级）
 */
export async function chatStream(options: ChatOptions): Promise<void> {
  const { onStream } = options
  
  if (!onStream) {
    throw new Error('流式请求必须提供 onStream 回调函数')
  }
  
  const providers = getAvailableProviders()
  
  if (providers.length === 0) {
    throw new Error('未配置任何 AI API Key，请在 .env.local 中配置至少一个提供商（DeepSeek、智谱GLM 或 通义千问）')
  }
  
  let lastError: Error | null = null
  
  for (const provider of providers) {
    try {
      console.log(`尝试使用 ${provider} API (流式)...`)
      
      const response = await fetch(`${CONFIG[provider].url}/chat/completions`, {
        method: 'POST',
        headers: buildHeaders(provider),
        body: JSON.stringify(buildBody(provider, { ...options, stream: true })),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error?.message || errorData.message || `HTTP ${response.status}`
        
        if (errorMessage.includes('Insufficient Balance') || 
            errorMessage.includes('余额不足') ||
            response.status === 429) {
          console.warn(`${provider} API 余额不足或限流，尝试下一个提供商...`)
          lastError = new Error(`${provider}: ${errorMessage}`)
          continue
        }
        
        throw new Error(errorMessage)
      }
      
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('无法获取响应流')
      }
      
      const decoder = new TextDecoder()
      let buffer = ''
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        
        for (const line of lines) {
          if (line.trim() === '' || line.trim() === 'data: [DONE]') continue
          
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              const content = parseStreamChunk(provider, data)
              if (content) {
                onStream(content)
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
      
      console.log(`${provider} API 流式调用成功`)
      return
      
    } catch (error) {
      console.error(`${provider} API 流式调用失败:`, error)
      lastError = error instanceof Error ? error : new Error(String(error))
      continue
    }
  }
  
  throw lastError || new Error('所有 AI 提供商都不可用')
}

/**
 * 检查 API 配置是否有效
 */
export function isAIConfigured(): boolean {
  return getAvailableProviders().length > 0
}

/**
 * 获取当前使用的提供商
 */
export function getCurrentProvider(): Provider | null {
  const providers = getAvailableProviders()
  return providers.length > 0 ? providers[0] : null
}

/**
 * 获取系统提示词 - 用于文章相关的 AI 助手
 */
export function getArticleSystemPrompt(articleTitle: string, articleContent: string): string {
  return `你是 Levy 的技术博客 AI 助手，专门帮助读者理解技术文章。

当前文章标题：${articleTitle}

文章内容概要：
${articleContent.slice(0, 2000)}...

你的职责：
1. 回答读者关于这篇文章的技术问题
2. 解释文章中的复杂概念
3. 提供与文章相关的扩展知识
4. 帮助读者更好地理解和应用文章内容

回答要求：
- 使用中文回答
- 回答要简洁明了，避免过于冗长
- 如果问题与文章无关，礼貌地引导用户回到文章主题
- 对于代码相关问题，可以提供示例代码
- 如果不确定答案，诚实告知而不是编造`
}

/**
 * 获取文章总结提示词
 */
export function getSummarySystemPrompt(): string {
  return `你是一位专业的技术文章分析助手。请对给定的技术文章进行总结。

请按以下格式输出：
1. 一句话概括文章核心内容
2. 3-5 个关键要点（用简洁的 bullet points）
3. 文章适合什么水平的读者阅读

要求：
- 总结要准确、简洁
- 关键要点要覆盖文章的主要技术点
- 使用中文输出
- 不要添加与文章内容无关的信息`
}
