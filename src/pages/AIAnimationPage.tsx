import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sparkles,
  Play,
  Copy,
  Check,
  RefreshCw,
  Wand2,
  Code2,
  Eye,
  Settings2,
  Lightbulb,
  Zap,
  History,
  Trash2,
  Bot,
  Terminal,
} from 'lucide-react'
import { toast } from 'sonner'
import { Navigation } from '@/components/home/Navigation'
import { chatStream } from '@/services/aiService'
import { cn } from '@/lib/utils'

// Animation data interface
interface AnimationData {
  id: string
  name: string
  description: string
  framerCode: string
  cssCode: string
  defaultConfig: {
    duration: number
    delay: number
    ease: string
    [key: string]: any
  }
  createdAt: number
}

// Example prompts
const examplePrompts = [
  '一个弹跳的心形图标，带弹性效果',
  '表单验证失败时的左右摇晃提示',
  '加载时的旋转圆圈动画',
  '卡片悬浮时的3D翻转效果',
  '通知红点的脉冲发光效果',
  '列表项依次从下方滑入',
  '按钮点击时的缩放反馈',
  '文字打字机效果',
  '图片悬浮时的放大和阴影',
  '进度条填充动画',
]

// System prompt for AI
const SYSTEM_PROMPT = `你是一位专业的动画开发专家，精通 Framer Motion 和 CSS 动画。

请根据用户的描述生成动画代码，必须输出严格的 JSON 格式，不要包含任何其他文字：

{
  "name": "动画名称（简短中文）",
  "description": "动画描述（一句话）",
  "framerCode": "完整的 Framer Motion 组件代码，使用 motion.div，包含所有必要的 props 和 transition 配置",
  "cssCode": "完整的 CSS 代码，包含 @keyframes 和类名定义",
  "defaultConfig": {
    "duration": 0.5,
    "delay": 0,
    "ease": "easeOut",
    "scale": 1.2,
    "rotate": 360,
    "x": 0,
    "y": 0
  }
}

要求：
1. Framer Motion 代码必须是完整的 JSX 组件，可以直接渲染
2. 使用 Tailwind CSS 类名进行样式设置
3. 动画要有视觉吸引力，符合现代 UI 设计趋势
4. 代码要简洁高效，避免不必要的复杂性
5. 默认配置要根据动画类型合理设置

可用的缓动函数：linear, easeIn, easeOut, easeInOut, circIn, circOut, backIn, backOut, elastic, bounce`

export function AIAnimationPage() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [streamContent, setStreamContent] = useState('')
  const [currentAnimation, setCurrentAnimation] =
    useState<AnimationData | null>(null)
  const [config, setConfig] = useState<{
    duration: number
    delay: number
    ease: string
    [key: string]: any
  }>({
    duration: 0.5,
    delay: 0,
    ease: 'easeOut',
  })
  const [previewKey, setPreviewKey] = useState(0)
  const [copied, setCopied] = useState<'framer' | 'css' | null>(null)
  const [history, setHistory] = useState<AnimationData[]>(() => {
    const saved = localStorage.getItem('ai-animation-history')
    return saved ? JSON.parse(saved) : []
  })
  const [isDark, setIsDark] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Theme detection
  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark')
      setIsDark(isDarkMode)
    }
    checkTheme()

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          checkTheme()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [])

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('ai-animation-history', JSON.stringify(history))
  }, [history])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('请输入动画描述')
      return
    }

    setIsGenerating(true)
    setStreamContent('')
    setError(null)
    setCurrentAnimation(null)

    try {
      let fullResponse = ''

      await chatStream({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        stream: true,
        onStream: chunk => {
          fullResponse += chunk
          setStreamContent(fullResponse)
        },
      })

      // Parse JSON response
      try {
        // Extract JSON from response (handle markdown code blocks)
        const jsonMatch = fullResponse.match(/```json\n?([\s\S]*?)\n?```/) ||
          fullResponse.match(/```\n?([\s\S]*?)\n?```/) || [null, fullResponse]

        const jsonStr = jsonMatch[1] || fullResponse
        const cleanedJson = jsonStr.replace(/^[^{]*/, '').replace(/[^}]*$/, '')

        const animationData: AnimationData = {
          ...JSON.parse(cleanedJson),
          id: Date.now().toString(),
          createdAt: Date.now(),
        }

        setCurrentAnimation(animationData)
        setConfig(animationData.defaultConfig)
        setPreviewKey(prev => prev + 1)

        // Add to history
        setHistory(prev => [animationData, ...prev].slice(0, 20))

        toast.success('动画生成成功！')
      } catch (parseError) {
        console.error('Parse error:', parseError)
        setError('无法解析 AI 返回的数据，请重试')
        toast.error('解析失败，请重试')
      }
    } catch (err) {
      console.error('Generation error:', err)
      setError('生成失败，请检查网络连接或 API 配置')
      toast.error('生成失败')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyCode = (type: 'framer' | 'css') => {
    const code =
      type === 'framer'
        ? currentAnimation?.framerCode
        : currentAnimation?.cssCode
    if (code) {
      navigator.clipboard.writeText(code)
      setCopied(type)
      toast.success(`${type === 'framer' ? 'Framer Motion' : 'CSS'} 代码已复制`)
      setTimeout(() => setCopied(null), 2000)
    }
  }

  const handleReplay = () => {
    setPreviewKey(prev => prev + 1)
  }

  const loadFromHistory = (animation: AnimationData) => {
    setCurrentAnimation(animation)
    setConfig(animation.defaultConfig)
    setPreviewKey(prev => prev + 1)
    toast.success(`已加载：${animation.name}`)
  }

  const deleteFromHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setHistory(prev => prev.filter(a => a.id !== id))
    toast.success('已删除')
  }

  const clearHistory = () => {
    setHistory([])
    toast.success('历史记录已清空')
  }

  // Render preview based on current animation
  const renderPreview = () => {
    if (!currentAnimation) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Wand2 className="w-16 h-16 mb-4 opacity-50" />
          <p>输入描述，让 AI 为你生成动画</p>
        </div>
      )
    }

    const key = `${currentAnimation.id}-${previewKey}`

    // Parse framer code to extract animation props
    const framerCode = currentAnimation.framerCode

    // Extract common patterns
    const hasScale = framerCode.includes('scale:')
    const hasRotate = framerCode.includes('rotate:')
    const hasX = framerCode.includes('x:') && !framerCode.includes('boxShadow')
    const hasY = framerCode.includes('y:') && !framerCode.includes('opacity')
    const hasOpacity = framerCode.includes('opacity:')
    const hasBoxShadow = framerCode.includes('boxShadow:')
    const isInfinite =
      framerCode.includes('repeat: Infinity') ||
      framerCode.includes('repeat:Infinity')

    // Build animation props
    const animate: any = {}
    const transition: any = {
      duration: config.duration,
      delay: config.delay,
      ease: config.ease,
    }

    if (isInfinite) {
      transition.repeat = Infinity
    }

    // Detect animation type and build props
    if (hasScale && !hasRotate) {
      // Scale animation (bounce, pop)
      animate.scale = [1, config.scale || 1.3, 0.9, 1.05, 1]
      transition.times = [0, 0.2, 0.4, 0.6, 1]
    } else if (hasRotate) {
      // Rotate animation (spinner)
      animate.rotate = config.rotate || 360
      if (isInfinite) {
        transition.ease = 'linear'
      }
    } else if (hasX && !hasY) {
      // Horizontal shake
      animate.x = [0, -10, 10, -10, 10, 0]
    } else if (hasY && hasOpacity) {
      // Slide fade in
      animate.y = [config.y || 30, 0]
      animate.opacity = [0, 1]
    } else if (hasBoxShadow) {
      // Pulse glow
      animate.boxShadow = [
        '0 0 0 0 rgba(59, 130, 246, 0.4)',
        '0 0 0 20px rgba(59, 130, 246, 0)',
      ]
      animate.scale = [1, 1.05, 1]
    } else if (hasY && isInfinite) {
      // Float
      animate.y = [-(config.y || 10), config.y || 10, -(config.y || 10)]
    }

    // Determine content based on animation type
    let content = '✨'
    let className = 'text-6xl cursor-pointer select-none'
    let style: any = {}

    if (
      currentAnimation.name.includes('心') ||
      currentAnimation.name.includes('heart')
    ) {
      content = '❤️'
    } else if (
      currentAnimation.name.includes('加载') ||
      currentAnimation.name.includes('loading') ||
      currentAnimation.name.includes('旋转')
    ) {
      content = ''
      className =
        'w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full cursor-pointer'
    } else if (
      currentAnimation.name.includes('卡片') ||
      currentAnimation.name.includes('card')
    ) {
      content = '卡片'
      className =
        'w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-xl flex items-center justify-center text-white font-bold cursor-pointer'
    } else if (
      currentAnimation.name.includes('按钮') ||
      currentAnimation.name.includes('button')
    ) {
      content = '点击我'
      className =
        'bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full shadow-lg cursor-pointer font-bold'
    } else if (
      currentAnimation.name.includes('通知') ||
      currentAnimation.name.includes('红点')
    ) {
      content = ''
      className = 'w-6 h-6 bg-blue-500 rounded-full cursor-pointer'
    } else if (
      currentAnimation.name.includes('错误') ||
      currentAnimation.name.includes('shake')
    ) {
      content = '⚠️ 错误提示'
      className =
        'bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-lg cursor-pointer font-medium'
    }

    return (
      <motion.div
        key={key}
        className={className}
        style={style}
        animate={animate}
        transition={transition}
        onClick={handleReplay}
        whileHover={!isInfinite ? { scale: 1.05 } : undefined}
        whileTap={!isInfinite ? { scale: 0.95 } : undefined}
      >
        {content}
      </motion.div>
    )
  }

  return (
    <div
      className={cn(
        'min-h-screen transition-colors duration-500',
        isDark
          ? 'bg-slate-950'
          : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
      )}
    >
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 border',
                isDark
                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                  : 'bg-purple-500/10 border-purple-500/30 text-purple-600'
              )}
            >
              <Bot className="w-4 h-4" />
              DeepSeek AI 驱动
            </div>
            <h1
              className={cn(
                'text-4xl sm:text-5xl font-bold mb-4',
                isDark
                  ? 'bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400'
                  : 'bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600'
              )}
            >
              AI 动画生成器
            </h1>
            <p
              className={cn(
                'text-lg max-w-2xl mx-auto',
                isDark ? 'text-slate-400' : 'text-slate-600'
              )}
            >
              用自然语言描述你想要的动画效果，DeepSeek AI
              将为你生成专业的动画代码
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Panel - Input & History */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Input Card */}
              <Card
                className={cn(
                  'border backdrop-blur-xl',
                  isDark
                    ? 'bg-white/5 border-white/10'
                    : 'bg-white/80 border-white/50'
                )}
              >
                <CardHeader>
                  <CardTitle
                    className={cn(
                      'flex items-center gap-2',
                      isDark ? 'text-white' : 'text-slate-900'
                    )}
                  >
                    <Wand2 className="w-5 h-5 text-purple-500" />
                    描述你的动画
                  </CardTitle>
                  <CardDescription
                    className={isDark ? 'text-slate-400' : 'text-slate-600'}
                  >
                    用简单的语言描述你想要的动画效果
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="例如：一个弹跳的心形图标"
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                      className={cn(
                        'flex-1',
                        isDark
                          ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500'
                          : 'bg-white border-slate-200 text-slate-900'
                      )}
                    />
                    <Button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className={cn(
                        'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
                        isGenerating && 'opacity-70'
                      )}
                    >
                      {isGenerating ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          生成
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Example Prompts */}
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={cn(
                        'text-sm flex items-center gap-1',
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      )}
                    >
                      <Lightbulb className="w-3 h-3" />
                      试试：
                    </span>
                    {examplePrompts.slice(0, 5).map(example => (
                      <button
                        key={example}
                        onClick={() => setPrompt(example)}
                        className={cn(
                          'text-xs px-2 py-1 rounded-full transition-colors',
                          isDark
                            ? 'bg-white/5 hover:bg-white/10 text-slate-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        )}
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* History */}
              {history.length > 0 && (
                <Card
                  className={cn(
                    'border backdrop-blur-xl',
                    isDark
                      ? 'bg-white/5 border-white/10'
                      : 'bg-white/80 border-white/50'
                  )}
                >
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle
                      className={cn(
                        'flex items-center gap-2 text-base',
                        isDark ? 'text-white' : 'text-slate-900'
                      )}
                    >
                      <History className="w-4 h-4" />
                      历史记录
                    </CardTitle>
                    <button
                      onClick={clearHistory}
                      className={cn(
                        'p-1.5 rounded-lg transition-colors',
                        isDark
                          ? 'hover:bg-white/10 text-slate-400'
                          : 'hover:bg-slate-100 text-slate-500'
                      )}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-48">
                      <div className="space-y-2">
                        {history.map(animation => (
                          <motion.div
                            key={animation.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={cn(
                              'p-3 rounded-lg cursor-pointer transition-all group relative',
                              isDark
                                ? 'bg-white/5 hover:bg-white/10 border border-white/5'
                                : 'bg-slate-50 hover:bg-slate-100 border border-slate-100'
                            )}
                            onClick={() => loadFromHistory(animation)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <p
                                  className={cn(
                                    'font-medium text-sm truncate',
                                    isDark ? 'text-white' : 'text-slate-900'
                                  )}
                                >
                                  {animation.name}
                                </p>
                                <p
                                  className={cn(
                                    'text-xs truncate',
                                    isDark ? 'text-slate-500' : 'text-slate-500'
                                  )}
                                >
                                  {animation.description}
                                </p>
                              </div>
                              <button
                                onClick={e =>
                                  deleteFromHistory(animation.id, e)
                                }
                                className={cn(
                                  'p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity',
                                  isDark
                                    ? 'hover:bg-white/10 text-slate-400'
                                    : 'hover:bg-slate-200 text-slate-500'
                                )}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Center & Right Panel - Preview & Code */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Preview Card */}
              <Card
                className={cn(
                  'overflow-hidden border backdrop-blur-xl',
                  isDark
                    ? 'bg-white/5 border-white/10'
                    : 'bg-white/80 border-white/50'
                )}
              >
                <CardHeader
                  className={cn(
                    'border-b flex flex-row items-center justify-between',
                    isDark
                      ? 'border-white/10 bg-white/5'
                      : 'border-slate-200 bg-slate-50/50'
                  )}
                >
                  <CardTitle
                    className={cn(
                      'flex items-center gap-2',
                      isDark ? 'text-white' : 'text-slate-900'
                    )}
                  >
                    <Eye className="w-5 h-5 text-green-500" />
                    实时预览
                    {currentAnimation && (
                      <Badge variant="secondary" className="ml-2">
                        {currentAnimation.name}
                      </Badge>
                    )}
                  </CardTitle>
                  {currentAnimation && (
                    <Button variant="ghost" size="sm" onClick={handleReplay}>
                      <Play className="w-4 h-4 mr-1" />
                      重播
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="p-0">
                  <div
                    className={cn(
                      'h-64 flex items-center justify-center',
                      isDark
                        ? 'bg-gradient-to-br from-slate-900 to-slate-800'
                        : 'bg-gradient-to-br from-slate-100 to-slate-200'
                    )}
                  >
                    {renderPreview()}
                  </div>
                </CardContent>
              </Card>

              {/* Streaming Output */}
              <AnimatePresence>
                {isGenerating && streamContent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn(
                      'rounded-xl p-4 border backdrop-blur-xl',
                      isDark
                        ? 'bg-white/5 border-white/10'
                        : 'bg-white/80 border-white/50'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Terminal className="w-4 h-4 text-purple-500" />
                      <span
                        className={cn(
                          'text-sm font-medium',
                          isDark ? 'text-white' : 'text-slate-900'
                        )}
                      >
                        AI 正在生成代码...
                      </span>
                    </div>
                    <pre
                      className={cn(
                        'text-xs overflow-x-auto p-3 rounded-lg',
                        isDark
                          ? 'bg-slate-950 text-slate-300'
                          : 'bg-slate-100 text-slate-700'
                      )}
                    >
                      {streamContent.slice(-500)}...
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl p-4 border border-red-500/30 bg-red-500/10 text-red-400"
                >
                  {error}
                </motion.div>
              )}

              {/* Animation Controls */}
              {currentAnimation && (
                <Card
                  className={cn(
                    'border backdrop-blur-xl',
                    isDark
                      ? 'bg-white/5 border-white/10'
                      : 'bg-white/80 border-white/50'
                  )}
                >
                  <CardHeader>
                    <CardTitle
                      className={cn(
                        'flex items-center gap-2',
                        isDark ? 'text-white' : 'text-slate-900'
                      )}
                    >
                      <Settings2 className="w-5 h-5 text-blue-500" />
                      参数微调
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Duration */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label
                          className={cn(
                            'text-sm font-medium',
                            isDark ? 'text-white' : 'text-slate-900'
                          )}
                        >
                          持续时间
                        </label>
                        <span
                          className={cn(
                            'text-sm',
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          )}
                        >
                          {config.duration}s
                        </span>
                      </div>
                      <Slider
                        value={[config.duration]}
                        onValueChange={([value]) => {
                          setConfig(prev => ({ ...prev, duration: value }))
                          handleReplay()
                        }}
                        min={0.1}
                        max={3}
                        step={0.1}
                      />
                    </div>

                    {/* Delay */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label
                          className={cn(
                            'text-sm font-medium',
                            isDark ? 'text-white' : 'text-slate-900'
                          )}
                        >
                          延迟
                        </label>
                        <span
                          className={cn(
                            'text-sm',
                            isDark ? 'text-slate-400' : 'text-slate-600'
                          )}
                        >
                          {config.delay}s
                        </span>
                      </div>
                      <Slider
                        value={[config.delay]}
                        onValueChange={([value]) => {
                          setConfig(prev => ({ ...prev, delay: value }))
                          handleReplay()
                        }}
                        min={0}
                        max={2}
                        step={0.1}
                      />
                    </div>

                    {/* Easing */}
                    <div className="space-y-2">
                      <label
                        className={cn(
                          'text-sm font-medium',
                          isDark ? 'text-white' : 'text-slate-900'
                        )}
                      >
                        缓动函数
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'linear',
                          'easeIn',
                          'easeOut',
                          'easeInOut',
                          'circIn',
                          'circOut',
                          'backIn',
                          'backOut',
                          'elastic',
                          'bounce',
                        ].map(ease => (
                          <button
                            key={ease}
                            onClick={() => {
                              setConfig(prev => ({ ...prev, ease }))
                              handleReplay()
                            }}
                            className={cn(
                              'px-3 py-1 text-xs rounded-full transition-colors',
                              config.ease === ease
                                ? 'bg-blue-500 text-white'
                                : isDark
                                  ? 'bg-white/5 text-slate-300 hover:bg-white/10'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            )}
                          >
                            {ease}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Code Output */}
              {currentAnimation && (
                <Card
                  className={cn(
                    'border backdrop-blur-xl',
                    isDark
                      ? 'bg-white/5 border-white/10'
                      : 'bg-white/80 border-white/50'
                  )}
                >
                  <CardHeader>
                    <CardTitle
                      className={cn(
                        'flex items-center gap-2',
                        isDark ? 'text-white' : 'text-slate-900'
                      )}
                    >
                      <Code2 className="w-5 h-5 text-orange-500" />
                      生成的代码
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="framer" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="framer">Framer Motion</TabsTrigger>
                        <TabsTrigger value="css">CSS</TabsTrigger>
                      </TabsList>

                      <TabsContent value="framer" className="mt-4">
                        <div className="relative">
                          <ScrollArea className="h-64 rounded-md bg-slate-950">
                            <pre className="p-4 text-sm text-slate-50 font-mono whitespace-pre-wrap">
                              {currentAnimation.framerCode}
                            </pre>
                          </ScrollArea>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="absolute top-2 right-2"
                            onClick={() => handleCopyCode('framer')}
                          >
                            {copied === 'framer' ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="css" className="mt-4">
                        <div className="relative">
                          <ScrollArea className="h-64 rounded-md bg-slate-950">
                            <pre className="p-4 text-sm text-slate-50 font-mono whitespace-pre-wrap">
                              {currentAnimation.cssCode}
                            </pre>
                          </ScrollArea>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="absolute top-2 right-2"
                            onClick={() => handleCopyCode('css')}
                          >
                            {copied === 'css' ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16 grid sm:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Sparkles,
                title: 'DeepSeek AI 驱动',
                desc: '基于 DeepSeek 大模型，智能理解你的需求',
                color: 'purple',
              },
              {
                icon: Code2,
                title: '双格式输出',
                desc: '同时生成 Framer Motion 和 CSS 两种代码格式',
                color: 'blue',
              },
              {
                icon: Zap,
                title: '实时预览',
                desc: '即时预览动画效果，支持参数微调',
                color: 'green',
              },
            ].map(feature => (
              <Card
                key={feature.title}
                className={cn(
                  'text-center p-6 border backdrop-blur-xl',
                  isDark
                    ? 'bg-white/5 border-white/10'
                    : 'bg-white/80 border-white/50'
                )}
              >
                <div
                  className={cn(
                    'w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center',
                    isDark
                      ? `bg-${feature.color}-500/20`
                      : `bg-${feature.color}-100`
                  )}
                >
                  <feature.icon
                    className={cn(
                      'w-6 h-6',
                      isDark
                        ? `text-${feature.color}-400`
                        : `text-${feature.color}-600`
                    )}
                  />
                </div>
                <h3
                  className={cn(
                    'font-semibold mb-2',
                    isDark ? 'text-white' : 'text-slate-900'
                  )}
                >
                  {feature.title}
                </h3>
                <p
                  className={cn(
                    'text-sm',
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  )}
                >
                  {feature.desc}
                </p>
              </Card>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
