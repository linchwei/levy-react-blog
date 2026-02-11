/**
 * 文章总结服务
 */
import { chat, getSummarySystemPrompt } from './aiService'

export interface ArticleSummary {
  /** 一句话概括 */
  overview: string
  /** 关键要点 */
  keyPoints: string[]
  /** 适合读者水平 */
  targetAudience: string
  /** 阅读时长估计 */
  readingTime: string
}

/**
 * 解析 AI 返回的总结文本
 */
function parseSummary(content: string): ArticleSummary {
  const lines = content.split('\n').filter(line => line.trim())

  let overview = ''
  const keyPoints: string[] = []
  let targetAudience = ''
  let readingTime = ''

  let inKeyPoints = false

  for (const line of lines) {
    const trimmedLine = line.trim()

    // 检测概览（通常是第一段或包含"概括"、"总结"的行）
    if (
      !overview &&
      (trimmedLine.includes('概括') ||
        trimmedLine.includes('总结') ||
        lines.indexOf(line) === 0)
    ) {
      overview = trimmedLine.replace(/^[^：:]+[：:]\s*/, '').trim()
      continue
    }

    // 检测关键要点部分
    if (
      trimmedLine.includes('关键') ||
      trimmedLine.includes('要点') ||
      trimmedLine.includes('核心')
    ) {
      inKeyPoints = true
      continue
    }

    // 收集关键要点（以 - 或数字开头的行）
    if (
      inKeyPoints &&
      (trimmedLine.startsWith('-') ||
        trimmedLine.startsWith('•') ||
        /^\d+[.、]/.test(trimmedLine))
    ) {
      const point = trimmedLine.replace(/^[-•\d.、\s]+/, '').trim()
      if (point && keyPoints.length < 5) {
        keyPoints.push(point)
      }
      continue
    }

    // 检测适合读者
    if (
      trimmedLine.includes('读者') ||
      trimmedLine.includes('适合') ||
      trimmedLine.includes('水平')
    ) {
      targetAudience = trimmedLine.replace(/^[^：:]+[：:]\s*/, '').trim()
      inKeyPoints = false
      continue
    }

    // 检测阅读时长
    if (
      trimmedLine.includes('阅读') ||
      trimmedLine.includes('时长') ||
      trimmedLine.includes('时间')
    ) {
      readingTime = trimmedLine.replace(/^[^：:]+[：:]\s*/, '').trim()
      continue
    }
  }

  // 如果没有解析出概览，使用第一行非空内容
  if (!overview && lines.length > 0) {
    overview = lines[0].replace(/^[^：:]+[：:]\s*/, '').trim()
  }

  // 如果没有解析出适合读者，使用默认值
  if (!targetAudience) {
    targetAudience = '对本文主题感兴趣的开发者'
  }

  // 如果没有解析出阅读时长，使用默认值
  if (!readingTime) {
    readingTime = '建议仔细阅读'
  }

  return {
    overview,
    keyPoints: keyPoints.length > 0 ? keyPoints : ['文章包含详细的技术内容'],
    targetAudience,
    readingTime,
  }
}

/**
 * 生成文章总结
 */
export async function generateSummary(
  articleTitle: string,
  articleContent: string
): Promise<ArticleSummary> {
  const systemPrompt = getSummarySystemPrompt()

  // 截取文章前3000字符作为分析内容
  const contentToAnalyze = articleContent.slice(0, 3000)

  const userPrompt = `请对以下技术文章进行总结：

文章标题：${articleTitle}

文章内容：
${contentToAnalyze}

请按照系统提示的格式输出总结。`

  try {
    const response = await chat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3,
      maxTokens: 1000,
    })

    return parseSummary(response.content)
  } catch (error) {
    console.error('生成文章总结失败:', error)
    throw error
  }
}

/**
 * 生成文章标签建议
 */
export async function generateTagSuggestions(
  articleTitle: string,
  articleContent: string,
  existingTags: string[]
): Promise<string[]> {
  const prompt = `基于以下文章标题和内容，请推荐 3-5 个相关的技术标签。

文章标题：${articleTitle}

文章内容概要：
${articleContent.slice(0, 1500)}

已有标签：${existingTags.join(', ')}

要求：
1. 每个标签简洁，不超过10个字符
2. 标签应该是技术领域相关的关键词
3. 避免与已有标签重复
4. 只输出标签列表，用逗号分隔

输出格式示例：React, TypeScript, 性能优化`

  try {
    const response = await chat({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      maxTokens: 100,
    })

    const tags = response.content
      .split(/[,，、]/)
      .map(tag => tag.trim())
      .filter(tag => tag && tag.length <= 10)
      .slice(0, 5)

    return tags
  } catch (error) {
    console.error('生成标签建议失败:', error)
    return []
  }
}

/**
 * 生成相关问题
 */
export async function generateRelatedQuestions(
  articleTitle: string,
  articleContent: string
): Promise<string[]> {
  const prompt = `基于以下文章，请生成 3 个读者可能会问的相关问题。

文章标题：${articleTitle}

文章内容概要：
${articleContent.slice(0, 1500)}

要求：
1. 问题应该与文章主题紧密相关
2. 问题要有一定的深度，不是简单的"是什么"
3. 每个问题一行，不要编号
4. 只输出问题，不要其他内容`

  try {
    const response = await chat({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      maxTokens: 200,
    })

    const questions = response.content
      .split('\n')
      .map(q => q.trim())
      .filter(q => q && q.endsWith('?'))
      .slice(0, 3)

    return questions
  } catch (error) {
    console.error('生成相关问题失败:', error)
    return []
  }
}
