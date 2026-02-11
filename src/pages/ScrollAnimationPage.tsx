import { useState, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import {
  MousePointer2,
  Copy,
  Check,
  RefreshCw,
  Code2,
  Eye,
  Settings2,
  Layers,
  MoveVertical,
  Type,
  Image,
  Box,
  ArrowUpDown,
  Gauge,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Navigation } from '@/components/home/Navigation'

// 动画元素类型
interface AnimationElement {
  id: string
  type: 'text' | 'image' | 'box'
  content: string
  styles: {
    backgroundColor: string
    color: string
    fontSize: number
    padding: number
    borderRadius: number
  }
  animation: {
    startY: number
    endY: number
    startOpacity: number
    endOpacity: number
    startScale: number
    endScale: number
    startRotate: number
    endRotate: number
    parallaxSpeed: number
  }
}

// 预设模板
interface ScrollTemplate {
  id: string
  name: string
  description: string
  elements: AnimationElement[]
}

const defaultTemplates: ScrollTemplate[] = [
  {
    id: 'fade-up',
    name: '淡入上浮',
    description: '元素从下方淡入并上浮',
    elements: [
      {
        id: '1',
        type: 'box',
        content: '',
        styles: {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          fontSize: 16,
          padding: 40,
          borderRadius: 12,
        },
        animation: {
          startY: 100,
          endY: 0,
          startOpacity: 0,
          endOpacity: 1,
          startScale: 0.8,
          endScale: 1,
          startRotate: 0,
          endRotate: 0,
          parallaxSpeed: 0,
        },
      },
    ],
  },
  {
    id: 'scale-rotate',
    name: '缩放旋转',
    description: '元素缩放并旋转出现',
    elements: [
      {
        id: '1',
        type: 'box',
        content: '',
        styles: {
          backgroundColor: '#8b5cf6',
          color: '#ffffff',
          fontSize: 16,
          padding: 40,
          borderRadius: 12,
        },
        animation: {
          startY: 0,
          endY: 0,
          startOpacity: 0,
          endOpacity: 1,
          startScale: 0.5,
          endScale: 1,
          startRotate: -180,
          endRotate: 0,
          parallaxSpeed: 0,
        },
      },
    ],
  },
  {
    id: 'parallax-layers',
    name: '视差层叠',
    description: '多层视差滚动效果',
    elements: [
      {
        id: '1',
        type: 'box',
        content: '背景层',
        styles: {
          backgroundColor: '#ef4444',
          color: '#ffffff',
          fontSize: 14,
          padding: 60,
          borderRadius: 16,
        },
        animation: {
          startY: 0,
          endY: 0,
          startOpacity: 1,
          endOpacity: 1,
          startScale: 1,
          endScale: 1,
          startRotate: 0,
          endRotate: 0,
          parallaxSpeed: 0.3,
        },
      },
      {
        id: '2',
        type: 'box',
        content: '中层',
        styles: {
          backgroundColor: '#f59e0b',
          color: '#ffffff',
          fontSize: 14,
          padding: 40,
          borderRadius: 12,
        },
        animation: {
          startY: 50,
          endY: -50,
          startOpacity: 1,
          endOpacity: 1,
          startScale: 1,
          endScale: 1,
          startRotate: 0,
          endRotate: 0,
          parallaxSpeed: 0.6,
        },
      },
      {
        id: '3',
        type: 'box',
        content: '前景层',
        styles: {
          backgroundColor: '#10b981',
          color: '#ffffff',
          fontSize: 14,
          padding: 20,
          borderRadius: 8,
        },
        animation: {
          startY: 100,
          endY: -100,
          startOpacity: 1,
          endOpacity: 1,
          startScale: 1,
          endScale: 1,
          startRotate: 0,
          endRotate: 0,
          parallaxSpeed: 1,
        },
      },
    ],
  },
  {
    id: 'text-reveal',
    name: '文字逐行显示',
    description: '文字逐行从下方浮现',
    elements: [
      {
        id: '1',
        type: 'text',
        content: '第一行文字',
        styles: {
          backgroundColor: 'transparent',
          color: '#1f2937',
          fontSize: 32,
          padding: 10,
          borderRadius: 0,
        },
        animation: {
          startY: 50,
          endY: 0,
          startOpacity: 0,
          endOpacity: 1,
          startScale: 1,
          endScale: 1,
          startRotate: 0,
          endRotate: 0,
          parallaxSpeed: 0,
        },
      },
      {
        id: '2',
        type: 'text',
        content: '第二行文字',
        styles: {
          backgroundColor: 'transparent',
          color: '#4b5563',
          fontSize: 24,
          padding: 10,
          borderRadius: 0,
        },
        animation: {
          startY: 50,
          endY: 0,
          startOpacity: 0,
          endOpacity: 1,
          startScale: 1,
          endScale: 1,
          startRotate: 0,
          endRotate: 0,
          parallaxSpeed: 0,
        },
      },
      {
        id: '3',
        type: 'text',
        content: '第三行文字',
        styles: {
          backgroundColor: 'transparent',
          color: '#6b7280',
          fontSize: 18,
          padding: 10,
          borderRadius: 0,
        },
        animation: {
          startY: 50,
          endY: 0,
          startOpacity: 0,
          endOpacity: 1,
          startScale: 1,
          endScale: 1,
          startRotate: 0,
          endRotate: 0,
          parallaxSpeed: 0,
        },
      },
    ],
  },
  {
    id: 'horizontal-slide',
    name: '水平滑入',
    description: '元素从左右两侧滑入',
    elements: [
      {
        id: '1',
        type: 'box',
        content: '左侧滑入',
        styles: {
          backgroundColor: '#ec4899',
          color: '#ffffff',
          fontSize: 16,
          padding: 30,
          borderRadius: 8,
        },
        animation: {
          startY: 0,
          endY: 0,
          startOpacity: 0,
          endOpacity: 1,
          startScale: 1,
          endScale: 1,
          startRotate: 0,
          endRotate: 0,
          parallaxSpeed: -0.5,
        },
      },
      {
        id: '2',
        type: 'box',
        content: '右侧滑入',
        styles: {
          backgroundColor: '#6366f1',
          color: '#ffffff',
          fontSize: 16,
          padding: 30,
          borderRadius: 8,
        },
        animation: {
          startY: 0,
          endY: 0,
          startOpacity: 0,
          endOpacity: 1,
          startScale: 1,
          endScale: 1,
          startRotate: 0,
          endRotate: 0,
          parallaxSpeed: 0.5,
        },
      },
    ],
  },
]

// 生成代码
const generateFramerCode = (
  elements: AnimationElement[],
  config: { smoothScroll: boolean; scrollRange: number }
) => {
  return `import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export function ScrollAnimationComponent() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  return (
    <div ref={containerRef} className="h-[${config.scrollRange}vh] relative">
      ${elements
        .map((el, i) => {
          const { animation } = el
          return `
      {/* Element ${i + 1} */}
      <motion.div
        style={{
          y: useTransform(scrollYProgress, [0, 1], [${animation.startY}, ${animation.endY}]),
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [${animation.startOpacity}, ${(animation.startOpacity + animation.endOpacity) / 2}, ${animation.endOpacity}]),
          scale: useTransform(scrollYProgress, [0, 1], [${animation.startScale}, ${animation.endScale}]),
          rotate: useTransform(scrollYProgress, [0, 1], [${animation.startRotate}, ${animation.endRotate}])
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div style={{
          backgroundColor: '${el.styles.backgroundColor}',
          color: '${el.styles.color}',
          fontSize: ${el.styles.fontSize},
          padding: ${el.styles.padding},
          borderRadius: ${el.styles.borderRadius}
        }}>
          ${el.type === 'text' ? el.content : 'Content'}
        </div>
      </motion.div>`
        })
        .join('')}
    </div>
  )
}`
}

const generateCSSCode = (
  _elements: AnimationElement[],
  config: { smoothScroll: boolean; scrollRange: number }
) => {
  return `@keyframes scrollAnimation {
  from {
    transform: translateY(100px) scale(0.8) rotate(0deg);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1) rotate(0deg);
    opacity: 1;
  }
}

.scroll-container {
  height: ${config.scrollRange}vh;
  position: relative;
  overflow-y: scroll;
  scroll-behavior: ${config.smoothScroll ? 'smooth' : 'auto'};
}

.animated-element {
  animation: scrollAnimation linear;
  animation-timeline: view();
  animation-range: entry 0% cover 50%;
}`
}

export function ScrollAnimationPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<ScrollTemplate>(
    defaultTemplates[0]
  )
  const [elements, setElements] = useState<AnimationElement[]>(
    defaultTemplates[0].elements
  )
  const [selectedElementId, setSelectedElementId] = useState<string>(
    defaultTemplates[0].elements[0]?.id || ''
  )
  const [config, setConfig] = useState({
    smoothScroll: true,
    scrollRange: 200,
    springStiffness: 100,
    springDamping: 30,
  })
  const [copied, setCopied] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)

  // const containerRef = useRef<HTMLDivElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: previewContainerRef,
    offset: ['start end', 'end start'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: config.springStiffness,
    damping: config.springDamping,
  })

  // 选择模板
  const handleTemplateSelect = (template: ScrollTemplate) => {
    setSelectedTemplate(template)
    setElements(template.elements)
    setSelectedElementId(template.elements[0]?.id || '')
    setPreviewKey(prev => prev + 1)
    toast.success(`已选择模板: ${template.name}`)
  }

  // 更新元素
  const updateElement = (id: string, updates: Partial<AnimationElement>) => {
    setElements(prev =>
      prev.map(el => (el.id === id ? { ...el, ...updates } : el))
    )
  }

  // 更新元素动画
  const updateElementAnimation = (
    id: string,
    animationUpdates: Partial<AnimationElement['animation']>
  ) => {
    setElements(prev =>
      prev.map(el =>
        el.id === id
          ? { ...el, animation: { ...el.animation, ...animationUpdates } }
          : el
      )
    )
  }

  // 更新元素样式
  const updateElementStyles = (
    id: string,
    styleUpdates: Partial<AnimationElement['styles']>
  ) => {
    setElements(prev =>
      prev.map(el =>
        el.id === id ? { ...el, styles: { ...el.styles, ...styleUpdates } } : el
      )
    )
  }

  // 添加新元素
  const addElement = () => {
    const newElement: AnimationElement = {
      id: Date.now().toString(),
      type: 'box',
      content: '新元素',
      styles: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        fontSize: 16,
        padding: 20,
        borderRadius: 8,
      },
      animation: {
        startY: 100,
        endY: 0,
        startOpacity: 0,
        endOpacity: 1,
        startScale: 0.8,
        endScale: 1,
        startRotate: 0,
        endRotate: 0,
        parallaxSpeed: 0,
      },
    }
    setElements(prev => [...prev, newElement])
    setSelectedElementId(newElement.id)
  }

  // 删除元素
  const deleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id))
    if (selectedElementId === id) {
      setSelectedElementId(elements.find(el => el.id !== id)?.id || '')
    }
  }

  // 复制代码
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success('代码已复制到剪贴板')
    setTimeout(() => setCopied(false), 2000)
  }

  // 重播预览
  const handleReplay = () => {
    setPreviewKey(prev => prev + 1)
    if (previewContainerRef.current) {
      previewContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const selectedElement = elements.find(el => el.id === selectedElementId)

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-4">
              <MousePointer2 className="w-4 h-4" />
              滚动交互
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              滚动触发动画设计器
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              可视化配置滚动触发动画，支持视差效果和进度驱动动画
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Panel - Templates & Elements */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3 space-y-6"
            >
              {/* Templates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    预设模板
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {defaultTemplates.map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        selectedTemplate.id === template.id
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-border hover:border-indigo-300'
                      }`}
                    >
                      <p className="font-medium text-sm">{template.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {template.description}
                      </p>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Elements List */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Box className="w-4 h-4 text-purple-500" />
                    动画元素
                  </CardTitle>
                  <Button size="sm" variant="outline" onClick={addElement}>
                    + 添加
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2">
                  {elements.map((element, index) => (
                    <div
                      key={element.id}
                      onClick={() => setSelectedElementId(element.id)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-between ${
                        selectedElementId === element.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-border hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {element.type === 'text' && (
                          <Type className="w-4 h-4" />
                        )}
                        {element.type === 'box' && <Box className="w-4 h-4" />}
                        {element.type === 'image' && (
                          <Image className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">
                          {element.type === 'text'
                            ? element.content.slice(0, 10)
                            : `元素 ${index + 1}`}
                        </span>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={e => {
                          e.stopPropagation()
                          deleteElement(element.id)
                        }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Center Panel - Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-5 space-y-6"
            >
              {/* Preview Container */}
              <Card className="overflow-hidden">
                <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50 flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Eye className="w-4 h-4 text-green-500" />
                    实时预览
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={handleReplay}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Scroll Area */}
                  <div
                    ref={previewContainerRef}
                    className="h-96 overflow-y-auto relative"
                    style={{
                      scrollBehavior: config.smoothScroll ? 'smooth' : 'auto',
                    }}
                  >
                    {/* Top spacer */}
                    <div className="h-32" />

                    {/* Animation Area */}
                    <div
                      className="relative flex items-center justify-center"
                      style={{ height: `${config.scrollRange * 2}px` }}
                    >
                      {/* Progress indicator */}
                      <div className="absolute left-4 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          className="w-full bg-indigo-500 rounded-full"
                          style={{
                            height: '100%',
                            scaleY: smoothProgress,
                            transformOrigin: 'top',
                          }}
                        />
                      </div>

                      {/* Animated Elements */}
                      {elements.map((element, index) => (
                        <PreviewElement
                          key={`${element.id}-${previewKey}`}
                          element={element}
                          index={index}
                          smoothProgress={smoothProgress}
                        />
                      ))}

                      {/* Scroll hint */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground flex items-center gap-1">
                        <ArrowUpDown className="w-3 h-3" />
                        滚动查看动画
                      </div>
                    </div>

                    {/* Bottom spacer */}
                    <div className="h-32" />
                  </div>
                </CardContent>
              </Card>

              {/* Code Output */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Code2 className="w-4 h-4 text-orange-500" />
                    生成的代码
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="framer">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="framer">Framer Motion</TabsTrigger>
                      <TabsTrigger value="css">CSS</TabsTrigger>
                    </TabsList>

                    <TabsContent value="framer" className="mt-4">
                      <div className="relative">
                        <ScrollArea className="h-48 rounded-md bg-slate-950">
                          <pre className="p-4 text-sm text-slate-50 font-mono whitespace-pre-wrap">
                            {generateFramerCode(elements, config)}
                          </pre>
                        </ScrollArea>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            handleCopyCode(generateFramerCode(elements, config))
                          }
                        >
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="css" className="mt-4">
                      <div className="relative">
                        <ScrollArea className="h-48 rounded-md bg-slate-950">
                          <pre className="p-4 text-sm text-slate-50 font-mono whitespace-pre-wrap">
                            {generateCSSCode(elements, config)}
                          </pre>
                        </ScrollArea>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-2 right-2"
                          onClick={() =>
                            handleCopyCode(generateCSSCode(elements, config))
                          }
                        >
                          {copied ? (
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
            </motion.div>

            {/* Right Panel - Configuration */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-4 space-y-6"
            >
              {selectedElement ? (
                <>
                  {/* Element Properties */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Settings2 className="w-4 h-4 text-blue-500" />
                        元素属性
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Content */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">内容</label>
                        <Input
                          value={selectedElement.content}
                          onChange={e =>
                            updateElement(selectedElement.id, {
                              content: e.target.value,
                            })
                          }
                          placeholder="输入内容..."
                        />
                      </div>

                      {/* Type */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">类型</label>
                        <div className="flex gap-2">
                          {(['text', 'box', 'image'] as const).map(type => (
                            <button
                              key={type}
                              onClick={() =>
                                updateElement(selectedElement.id, { type })
                              }
                              className={`flex-1 p-2 rounded-lg border-2 transition-all capitalize ${
                                selectedElement.type === type
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-border hover:border-blue-300'
                              }`}
                            >
                              {type === 'text' && (
                                <Type className="w-4 h-4 mx-auto" />
                              )}
                              {type === 'box' && (
                                <Box className="w-4 h-4 mx-auto" />
                              )}
                              {type === 'image' && (
                                <Image className="w-4 h-4 mx-auto" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Colors */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">背景色</label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={selectedElement.styles.backgroundColor}
                              onChange={e =>
                                updateElementStyles(selectedElement.id, {
                                  backgroundColor: e.target.value,
                                })
                              }
                              className="w-10 h-10 p-1"
                            />
                            <Input
                              value={selectedElement.styles.backgroundColor}
                              onChange={e =>
                                updateElementStyles(selectedElement.id, {
                                  backgroundColor: e.target.value,
                                })
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            文字颜色
                          </label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={selectedElement.styles.color}
                              onChange={e =>
                                updateElementStyles(selectedElement.id, {
                                  color: e.target.value,
                                })
                              }
                              className="w-10 h-10 p-1"
                            />
                            <Input
                              value={selectedElement.styles.color}
                              onChange={e =>
                                updateElementStyles(selectedElement.id, {
                                  color: e.target.value,
                                })
                              }
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Size & Spacing */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className="text-sm font-medium">
                              字体大小
                            </label>
                            <span className="text-sm text-muted-foreground">
                              {selectedElement.styles.fontSize}px
                            </span>
                          </div>
                          <Slider
                            value={[selectedElement.styles.fontSize]}
                            onValueChange={([value]) =>
                              updateElementStyles(selectedElement.id, {
                                fontSize: value,
                              })
                            }
                            min={12}
                            max={48}
                            step={2}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className="text-sm font-medium">
                              内边距
                            </label>
                            <span className="text-sm text-muted-foreground">
                              {selectedElement.styles.padding}px
                            </span>
                          </div>
                          <Slider
                            value={[selectedElement.styles.padding]}
                            onValueChange={([value]) =>
                              updateElementStyles(selectedElement.id, {
                                padding: value,
                              })
                            }
                            min={0}
                            max={60}
                            step={4}
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <label className="text-sm font-medium">圆角</label>
                            <span className="text-sm text-muted-foreground">
                              {selectedElement.styles.borderRadius}px
                            </span>
                          </div>
                          <Slider
                            value={[selectedElement.styles.borderRadius]}
                            onValueChange={([value]) =>
                              updateElementStyles(selectedElement.id, {
                                borderRadius: value,
                              })
                            }
                            min={0}
                            max={24}
                            step={2}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Animation Properties */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <MoveVertical className="w-4 h-4 text-purple-500" />
                        动画属性
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Y Position */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">
                            Y轴位移 (开始 → 结束)
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={selectedElement.animation.startY}
                            onChange={e =>
                              updateElementAnimation(selectedElement.id, {
                                startY: Number(e.target.value),
                              })
                            }
                            className="flex-1"
                            placeholder="开始"
                          />
                          <ArrowUpDown className="w-4 h-4 self-center text-muted-foreground" />
                          <Input
                            type="number"
                            value={selectedElement.animation.endY}
                            onChange={e =>
                              updateElementAnimation(selectedElement.id, {
                                endY: Number(e.target.value),
                              })
                            }
                            className="flex-1"
                            placeholder="结束"
                          />
                        </div>
                      </div>

                      {/* Opacity */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">透明度</label>
                          <span className="text-sm text-muted-foreground">
                            {selectedElement.animation.startOpacity} →{' '}
                            {selectedElement.animation.endOpacity}
                          </span>
                        </div>
                        <Slider
                          value={[
                            selectedElement.animation.startOpacity,
                            selectedElement.animation.endOpacity,
                          ]}
                          onValueChange={([start, end]) => {
                            updateElementAnimation(selectedElement.id, {
                              startOpacity: start,
                              endOpacity: end,
                            })
                          }}
                          min={0}
                          max={1}
                          step={0.1}
                        />
                      </div>

                      {/* Scale */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">缩放</label>
                          <span className="text-sm text-muted-foreground">
                            {selectedElement.animation.startScale} →{' '}
                            {selectedElement.animation.endScale}
                          </span>
                        </div>
                        <Slider
                          value={[
                            selectedElement.animation.startScale,
                            selectedElement.animation.endScale,
                          ]}
                          onValueChange={([start, end]) => {
                            updateElementAnimation(selectedElement.id, {
                              startScale: start,
                              endScale: end,
                            })
                          }}
                          min={0.1}
                          max={2}
                          step={0.1}
                        />
                      </div>

                      {/* Rotate */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">旋转</label>
                          <span className="text-sm text-muted-foreground">
                            {selectedElement.animation.startRotate}° →{' '}
                            {selectedElement.animation.endRotate}°
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={selectedElement.animation.startRotate}
                            onChange={e =>
                              updateElementAnimation(selectedElement.id, {
                                startRotate: Number(e.target.value),
                              })
                            }
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={selectedElement.animation.endRotate}
                            onChange={e =>
                              updateElementAnimation(selectedElement.id, {
                                endRotate: Number(e.target.value),
                              })
                            }
                            className="flex-1"
                          />
                        </div>
                      </div>

                      {/* Parallax Speed */}
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <label className="text-sm font-medium">
                            视差速度
                          </label>
                          <span className="text-sm text-muted-foreground">
                            {selectedElement.animation.parallaxSpeed}x
                          </span>
                        </div>
                        <Slider
                          value={[selectedElement.animation.parallaxSpeed]}
                          onValueChange={([value]) =>
                            updateElementAnimation(selectedElement.id, {
                              parallaxSpeed: value,
                            })
                          }
                          min={-2}
                          max={2}
                          step={0.1}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="p-8 text-center text-muted-foreground">
                  选择一个元素进行编辑
                </Card>
              )}

              {/* Global Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Gauge className="w-4 h-4 text-green-500" />
                    全局设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">平滑滚动</label>
                    <Switch
                      checked={config.smoothScroll}
                      onCheckedChange={checked =>
                        setConfig(prev => ({ ...prev, smoothScroll: checked }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">滚动范围</label>
                      <span className="text-sm text-muted-foreground">
                        {config.scrollRange}vh
                      </span>
                    </div>
                    <Slider
                      value={[config.scrollRange]}
                      onValueChange={([value]) =>
                        setConfig(prev => ({ ...prev, scrollRange: value }))
                      }
                      min={100}
                      max={500}
                      step={50}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">弹簧刚度</label>
                      <span className="text-sm text-muted-foreground">
                        {config.springStiffness}
                      </span>
                    </div>
                    <Slider
                      value={[config.springStiffness]}
                      onValueChange={([value]) =>
                        setConfig(prev => ({ ...prev, springStiffness: value }))
                      }
                      min={50}
                      max={300}
                      step={10}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">弹簧阻尼</label>
                      <span className="text-sm text-muted-foreground">
                        {config.springDamping}
                      </span>
                    </div>
                    <Slider
                      value={[config.springDamping]}
                      onValueChange={([value]) =>
                        setConfig(prev => ({ ...prev, springDamping: value }))
                      }
                      min={10}
                      max={100}
                      step={5}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 grid sm:grid-cols-3 gap-6"
          >
            <Card className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <MousePointer2 className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold mb-2">滚动驱动</h3>
              <p className="text-sm text-muted-foreground">
                基于滚动位置的精确动画控制
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Layers className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">视差效果</h3>
              <p className="text-sm text-muted-foreground">
                多层视差滚动，创造深度感
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Code2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">代码生成</h3>
              <p className="text-sm text-muted-foreground">
                自动生成 Framer Motion 代码
              </p>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

// 预览元素组件 - 必须在组件外部定义以避免 Hook 顺序问题
interface PreviewElementProps {
  element: AnimationElement
  index: number
  smoothProgress: ReturnType<typeof useSpring>
}

function PreviewElement({
  element,
  index,
  smoothProgress,
}: PreviewElementProps) {
  const { animation, styles, type, content } = element

  // 计算变换值
  const y = useTransform(
    smoothProgress,
    [0, 1],
    [animation.startY, animation.endY]
  )

  const opacity = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [
      animation.startOpacity,
      (animation.startOpacity + animation.endOpacity) / 2,
      animation.endOpacity,
    ]
  )

  const scale = useTransform(
    smoothProgress,
    [0, 1],
    [animation.startScale, animation.endScale]
  )

  const rotate = useTransform(
    smoothProgress,
    [0, 1],
    [animation.startRotate, animation.endRotate]
  )

  // 视差效果
  const parallaxY = useTransform(
    smoothProgress,
    [0, 1],
    [0, animation.parallaxSpeed * 200]
  )

  return (
    <motion.div
      style={{
        y: animation.parallaxSpeed !== 0 ? parallaxY : y,
        opacity,
        scale,
        rotate,
        zIndex: index,
      }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div
        style={{
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          fontSize: styles.fontSize,
          padding: styles.padding,
          borderRadius: styles.borderRadius,
          minWidth: type === 'box' ? 100 : 'auto',
          minHeight: type === 'box' ? 100 : 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }}
      >
        {type === 'text' ? content : type === 'box' ? content || 'Box' : '📷'}
      </div>
    </motion.div>
  )
}
