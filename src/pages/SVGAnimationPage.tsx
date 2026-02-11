import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Switch } from '@/components/ui/switch'
import {
  PenTool,
  Copy,
  Check,
  RefreshCw,
  Download,
  Code2,
  Eye,
  Settings2,
  Shapes,
  Palette,
  Sparkles,
  Zap,
  Layers,
} from 'lucide-react'
import { toast } from 'sonner'
import { Navigation } from '@/components/home/Navigation'

// 预设 SVG 路径
interface SVGPreset {
  id: string
  name: string
  category: string
  path: string
  viewBox: string
  description: string
}

const svgPresets: SVGPreset[] = [
  {
    id: 'heart',
    name: '心形',
    category: '形状',
    description: '经典的心形图案',
    viewBox: '0 0 100 100',
    path: 'M50 85 C50 85, 20 60, 20 40 C20 25, 30 15, 42 15 C48 15, 50 20, 50 20 C50 20, 52 15, 58 15 C70 15, 80 25, 80 40 C80 60, 50 85, 50 85 Z',
  },
  {
    id: 'star',
    name: '五角星',
    category: '形状',
    description: '标准的五角星',
    viewBox: '0 0 100 100',
    path: 'M50 5 L63 35 L95 35 L70 55 L80 85 L50 65 L20 85 L30 55 L5 35 L37 35 Z',
  },
  {
    id: 'check',
    name: '对勾',
    category: '图标',
    description: '确认标记',
    viewBox: '0 0 100 100',
    path: 'M20 50 L40 70 L80 30',
  },
  {
    id: 'arrow',
    name: '箭头',
    category: '图标',
    description: '向右箭头',
    viewBox: '0 0 100 100',
    path: 'M20 50 L70 50 M55 35 L70 50 L55 65',
  },
  {
    id: 'infinity',
    name: '无限符号',
    category: '形状',
    description: '数学无限符号',
    viewBox: '0 0 100 100',
    path: 'M30 50 C30 35, 10 35, 10 50 C10 65, 30 65, 30 50 C30 35, 50 35, 50 50 C50 65, 70 65, 70 50 C70 35, 50 35, 50 50 C50 65, 70 65, 70 50 C70 35, 90 35, 90 50 C90 65, 70 65, 70 50',
  },
  {
    id: 'spiral',
    name: '螺旋',
    category: '装饰',
    description: '阿基米德螺旋',
    viewBox: '0 0 100 100',
    path: 'M50 50 m0 0 a5 5 0 1 0 0 10 a10 10 0 1 0 0 -20 a15 15 0 1 0 0 30 a20 20 0 1 0 0 -40 a25 25 0 1 0 0 50',
  },
  {
    id: 'wave',
    name: '波浪',
    category: '装饰',
    description: '正弦波浪线',
    viewBox: '0 0 100 100',
    path: 'M0 50 Q25 25, 50 50 T100 50',
  },
  {
    id: 'cloud',
    name: '云朵',
    category: '自然',
    description: '卡通云朵',
    viewBox: '0 0 100 100',
    path: 'M25 60 Q15 60, 15 50 Q15 35, 30 35 Q35 20, 50 20 Q65 20, 70 35 Q85 35, 85 50 Q85 60, 75 60 Z',
  },
  {
    id: 'lightning',
    name: '闪电',
    category: '自然',
    description: '闪电符号',
    viewBox: '0 0 100 100',
    path: 'M55 5 L35 45 L50 45 L40 95 L65 50 L50 50 L60 5 Z',
  },
  {
    id: 'location',
    name: '定位标记',
    category: '图标',
    description: '地图定位图标',
    viewBox: '0 0 100 100',
    path: 'M50 15 C35 15, 25 30, 25 45 C25 60, 50 85, 50 85 C50 85, 75 60, 75 45 C75 30, 65 15, 50 15 Z M50 55 C42 55, 35 48, 35 40 C35 32, 42 25, 50 25 C58 25, 65 32, 65 40 C65 48, 58 55, 50 55 Z',
  },
  {
    id: 'chat',
    name: '对话气泡',
    category: '图标',
    description: '聊天消息图标',
    viewBox: '0 0 100 100',
    path: 'M80 20 L20 20 C15 20, 10 25, 10 30 L10 60 C10 65, 15 70, 20 70 L35 70 L35 85 L50 70 L80 70 C85 70, 90 65, 90 60 L90 30 C90 25, 85 20, 80 20 Z',
  },
  {
    id: 'music',
    name: '音符',
    category: '娱乐',
    description: '音乐符号',
    viewBox: '0 0 100 100',
    path: 'M35 75 L35 30 L70 20 L70 65 C70 70, 65 75, 60 75 C55 75, 50 70, 50 65 C50 60, 55 55, 60 55 C62 55, 64 56, 65 57 L65 28 L40 35 L40 75 C40 80, 35 85, 30 85 C25 85, 20 80, 20 75 C20 70, 25 65, 30 65 C32 65, 34 66, 35 67 Z',
  },
]

// 动画配置
interface AnimationConfig {
  duration: number
  delay: number
  ease: string
  strokeWidth: number
  strokeColor: string
  fillColor: string
  fillOpacity: number
  loop: boolean
  direction: 'normal' | 'reverse' | 'alternate'
}

// 动画类型
interface AnimationType {
  id: string
  name: string
  description: string
  css: (config: AnimationConfig) => string
  framer: (config: AnimationConfig, pathLength: number) => string
}

const animationTypes: AnimationType[] = [
  {
    id: 'draw',
    name: '描边绘制',
    description: '路径逐渐绘制的动画效果',
    css: config => `@keyframes draw {
                    from { stroke-dashoffset: var(--path-length); }
                    to { stroke-dashoffset: 0; }
                  }

                  .animated-path {
                    stroke-dasharray: var(--path-length);
                    stroke-dashoffset: var(--path-length);
                    animation: draw ${config.duration}s ${config.ease} ${config.delay}s ${config.loop ? 'infinite' : 'forwards'};
                    stroke: ${config.strokeColor};
                    stroke-width: ${config.strokeWidth};
                    fill: ${config.fillColor};
                    fill-opacity: ${config.fillOpacity};
                  }`,
    framer: (config, _pathLength) => `<motion.path
                                    d="${config}"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{
                                      duration: ${config.duration},
                                      ease: "${config.ease}",
                                      delay: ${config.delay},
                                      repeat: ${config.loop ? 'Infinity' : 0},
                                      repeatType: "${config.direction === 'alternate' ? 'reverse' : 'loop'}"
                                    }}
                                    stroke="${config.strokeColor}"
                                    strokeWidth={${config.strokeWidth}}
                                    fill="${config.fillColor}"
                                    fillOpacity={${config.fillOpacity}}
                                  />`,
  },
  {
    id: 'fade',
    name: '淡入淡出',
    description: '整体透明度渐变',
    css: config => `@keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                  }

                  .animated-path {
                    animation: fadeIn ${config.duration}s ${config.ease} ${config.delay}s ${config.loop ? 'infinite alternate' : 'forwards'};
                    stroke: ${config.strokeColor};
                    stroke-width: ${config.strokeWidth};
                    fill: ${config.fillColor};
                    fill-opacity: ${config.fillOpacity};
                  }`,
    framer: config => `<motion.path
                    d="${config}"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: ${config.duration},
                      ease: "${config.ease}",
                      delay: ${config.delay},
                      repeat: ${config.loop ? 'Infinity' : 0},
                      repeatType: "${config.direction === 'alternate' ? 'reverse' : 'loop'}"
                    }}
                    stroke="${config.strokeColor}"
                    strokeWidth={${config.strokeWidth}}
                    fill="${config.fillColor}"
                    fillOpacity={${config.fillOpacity}}
                  />`,
  },
  {
    id: 'scale',
    name: '缩放动画',
    description: '从中心缩放出现',
    css: config => `@keyframes scaleIn {
                    from { transform: scale(0); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                  }

                  .animated-svg {
                    animation: scaleIn ${config.duration}s ${config.ease} ${config.delay}s ${config.loop ? 'infinite alternate' : 'forwards'};
                    transform-origin: center;
                  }

                  .animated-path {
                    stroke: ${config.strokeColor};
                    stroke-width: ${config.strokeWidth};
                    fill: ${config.fillColor};
                    fill-opacity: ${config.fillOpacity};
                  }`,
    framer: config => `<motion.svg
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      duration: ${config.duration},
                      ease: "${config.ease}",
                      delay: ${config.delay},
                      repeat: ${config.loop ? 'Infinity' : 0},
                      repeatType: "${config.direction === 'alternate' ? 'reverse' : 'loop'}"
                    }}
                    >
                      <path
                        d="${config}"
                        stroke="${config.strokeColor}"
                        strokeWidth={${config.strokeWidth}}
                        fill="${config.fillColor}"
                        fillOpacity={${config.fillOpacity}}
                      />
                    </motion.svg>`,
  },
  {
    id: 'pulse',
    name: '脉冲效果',
    description: '呼吸般的脉冲动画',
    css: config => `@keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.8; }
                  }

                  .animated-svg {
                    animation: pulse ${config.duration}s ${config.ease} ${config.delay}s ${config.loop ? 'infinite' : '3'};
                    transform-origin: center;
                  }

                  .animated-path {
                    stroke: ${config.strokeColor};
                    stroke-width: ${config.strokeWidth};
                    fill: ${config.fillColor};
                    fill-opacity: ${config.fillOpacity};
                  }`,
    framer: config => `<motion.svg
                      animate={{ 
                        scale: [1, 1.05, 1],
                        opacity: [1, 0.8, 1]
                      }}
                      transition={{
                        duration: ${config.duration},
                        ease: "${config.ease}",
                        delay: ${config.delay},
                        repeat: ${config.loop ? 'Infinity' : 3}
                      }}
                    >
                      <path
                        d="${config}"
                        stroke="${config.strokeColor}"
                        strokeWidth={${config.strokeWidth}}
                        fill="${config.fillColor}"
                        fillOpacity={${config.fillOpacity}}
                      />
                    </motion.svg>`,
  },
  {
    id: 'rotate',
    name: '旋转动画',
    description: '360度旋转效果',
    css: config => `@keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }

                  .animated-svg {
                    animation: rotate ${config.duration}s linear ${config.delay}s ${config.loop ? 'infinite' : 'forwards'};
                    transform-origin: center;
                  }

                  .animated-path {
                    stroke: ${config.strokeColor};
                    stroke-width: ${config.strokeWidth};
                    fill: ${config.fillColor};
                    fill-opacity: ${config.fillOpacity};
                  }`,
    framer: config => `<motion.svg
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: ${config.duration},
                        ease: "linear",
                        delay: ${config.delay},
                        repeat: ${config.loop ? 'Infinity' : 0}
                      }}
                    >
                      <path
                        d="${config}"
                        stroke="${config.strokeColor}"
                        strokeWidth={${config.strokeWidth}}
                        fill="${config.fillColor}"
                        fillOpacity={${config.fillOpacity}}
                      />
                    </motion.svg>`,
  },
]

const easeOptions = [
  { value: 'linear', label: 'Linear' },
  { value: 'ease', label: 'Ease' },
  { value: 'ease-in', label: 'Ease In' },
  { value: 'ease-out', label: 'Ease Out' },
  { value: 'ease-in-out', label: 'Ease In Out' },
]

export function SVGAnimationPage() {
  const [selectedPreset, setSelectedPreset] = useState<SVGPreset>(svgPresets[0])
  const [customPath, setCustomPath] = useState('')
  const [activePath, setActivePath] = useState(svgPresets[0].path)
  const [viewBox, setViewBox] = useState(svgPresets[0].viewBox)
  const [animationType, setAnimationType] = useState<AnimationType>(
    animationTypes[0]
  )
  const [config, setConfig] = useState<AnimationConfig>({
    duration: 2,
    delay: 0,
    ease: 'ease-in-out',
    strokeWidth: 2,
    strokeColor: '#3b82f6',
    fillColor: 'transparent',
    fillOpacity: 0,
    loop: true,
    direction: 'normal',
  })
  const [previewKey, setPreviewKey] = useState(0)
  const [copied, setCopied] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [pathLength, setPathLength] = useState(0)
  const pathRef = useRef<SVGPathElement>(null)
  const [activeTab, setActiveTab] = useState('presets')

  // 计算路径长度
  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength()
      setPathLength(length)
    }
  }, [activePath, viewBox])

  // 处理预设选择
  const handlePresetSelect = (preset: SVGPreset) => {
    setSelectedPreset(preset)
    setActivePath(preset.path)
    setViewBox(preset.viewBox)
    setPreviewKey(prev => prev + 1)
    toast.success(`已选择: ${preset.name}`)
  }

  // 处理自定义路径
  const handleCustomPathChange = (value: string) => {
    setCustomPath(value)
    setActivePath(value)
    setActiveTab('custom')
    setPreviewKey(prev => prev + 1)
  }

  // 重播动画
  const handleReplay = () => {
    setPreviewKey(prev => prev + 1)
    setIsPlaying(true)
  }

  // 复制代码
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success('代码已复制到剪贴板')
    setTimeout(() => setCopied(false), 2000)
  }

  // 下载 SVG
  const handleDownloadSVG = () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="200" height="200">
  <path d="${activePath}" stroke="${config.strokeColor}" stroke-width="${config.strokeWidth}" fill="${config.fillColor}" fill-opacity="${config.fillOpacity}"/>
</svg>`
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `svg-animation-${Date.now()}.svg`
    link.click()
    URL.revokeObjectURL(url)
    toast.success('SVG 已下载')
  }

  // 生成 CSS 代码
  const generateCSS = () => {
    return animationType
      .css(config)
      .replace('var(--path-length)', pathLength.toString())
  }

  // 生成 Framer Motion 代码
  const generateFramer = () => {
    return animationType.framer(config, pathLength)
  }

  // 渲染预览动画
  const renderPreview = () => {
    const key = `${animationType.id}-${previewKey}`

    switch (animationType.id) {
      case 'draw':
        return (
          <motion.svg
            key={key}
            viewBox={viewBox}
            className="w-full h-full"
            initial="hidden"
            animate={isPlaying ? 'visible' : 'hidden'}
          >
            <motion.path
              d={activePath}
              ref={pathRef}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: {
                  duration: config.duration,
                  ease: config.ease as any,
                  delay: config.delay,
                  repeat: config.loop ? Infinity : 0,
                  repeatType:
                    config.direction === 'alternate' ? 'reverse' : 'loop',
                },
                opacity: { duration: 0.1 },
              }}
              stroke={config.strokeColor}
              strokeWidth={config.strokeWidth}
              fill={config.fillColor}
              fillOpacity={config.fillOpacity}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )
      case 'fade':
        return (
          <motion.svg key={key} viewBox={viewBox} className="w-full h-full">
            <motion.path
              d={activePath}
              ref={pathRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: isPlaying ? 1 : 0 }}
              transition={{
                duration: config.duration,
                ease: config.ease as any,
                delay: config.delay,
                repeat: config.loop ? Infinity : 0,
                repeatType:
                  config.direction === 'alternate' ? 'reverse' : 'loop',
              }}
              stroke={config.strokeColor}
              strokeWidth={config.strokeWidth}
              fill={config.fillColor}
              fillOpacity={config.fillOpacity}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )
      case 'scale':
        return (
          <motion.svg
            key={key}
            viewBox={viewBox}
            className="w-full h-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={
              isPlaying ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
            }
            transition={{
              duration: config.duration,
              ease: config.ease as any,
              delay: config.delay,
              repeat: config.loop ? Infinity : 0,
              repeatType: config.direction === 'alternate' ? 'reverse' : 'loop',
            }}
            style={{ transformOrigin: 'center' }}
          >
            <path
              d={activePath}
              ref={pathRef}
              stroke={config.strokeColor}
              strokeWidth={config.strokeWidth}
              fill={config.fillColor}
              fillOpacity={config.fillOpacity}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )
      case 'pulse':
        return (
          <motion.svg
            key={key}
            viewBox={viewBox}
            className="w-full h-full"
            animate={
              isPlaying
                ? {
                    scale: [1, 1.05, 1],
                    opacity: [1, 0.8, 1],
                  }
                : {}
            }
            transition={{
              duration: config.duration,
              ease: config.ease as any,
              delay: config.delay,
              repeat: config.loop ? Infinity : 3,
            }}
            style={{ transformOrigin: 'center' }}
          >
            <path
              d={activePath}
              ref={pathRef}
              stroke={config.strokeColor}
              strokeWidth={config.strokeWidth}
              fill={config.fillColor}
              fillOpacity={config.fillOpacity}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )
      case 'rotate':
        return (
          <motion.svg
            key={key}
            viewBox={viewBox}
            className="w-full h-full"
            animate={isPlaying ? { rotate: 360 } : {}}
            transition={{
              duration: config.duration,
              ease: 'linear',
              delay: config.delay,
              repeat: config.loop ? Infinity : 0,
            }}
            style={{ transformOrigin: 'center' }}
          >
            <path
              d={activePath}
              ref={pathRef}
              stroke={config.strokeColor}
              strokeWidth={config.strokeWidth}
              fill={config.fillColor}
              fillOpacity={config.fillOpacity}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )
      default:
        return null
    }
  }

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 text-sm font-medium mb-4">
              <PenTool className="w-4 h-4" />
              SVG 动画
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
              SVG 路径动画编辑器
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              可视化编辑 SVG 路径，生成专业的描边动画和变形效果
            </p>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Panel - Path Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-4 space-y-6"
            >
              {/* Path Selection Tabs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shapes className="w-5 h-5 text-pink-500" />
                    选择路径
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="presets">
                        <Layers className="w-4 h-4 mr-2" />
                        预设库
                      </TabsTrigger>
                      <TabsTrigger value="custom">
                        <Code2 className="w-4 h-4 mr-2" />
                        自定义
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="presets" className="mt-4">
                      <ScrollArea className="h-64">
                        <div className="grid grid-cols-2 gap-2">
                          {svgPresets.map(preset => (
                            <button
                              key={preset.id}
                              onClick={() => handlePresetSelect(preset)}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${
                                selectedPreset.id === preset.id
                                  ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                                  : 'border-border hover:border-pink-300'
                              }`}
                            >
                              <svg
                                viewBox={preset.viewBox}
                                className="w-8 h-8 mb-2 mx-auto"
                              >
                                <path
                                  d={preset.path}
                                  stroke="currentColor"
                                  fill="none"
                                  strokeWidth="2"
                                />
                              </svg>
                              <p className="text-xs font-medium text-center">
                                {preset.name}
                              </p>
                            </button>
                          ))}
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="custom" className="mt-4">
                      <Textarea
                        placeholder="输入 SVG path 数据..."
                        value={customPath}
                        onChange={e => handleCustomPathChange(e.target.value)}
                        className="min-h-50 font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        支持 SVG path 命令: M, L, H, V, C, S, Q, T, A, Z
                      </p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Animation Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    动画类型
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {animationTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setAnimationType(type)
                          handleReplay()
                        }}
                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                          animationType.id === type.id
                            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                            : 'border-border hover:border-yellow-300'
                        }`}
                      >
                        <p className="font-medium">{type.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {type.description}
                        </p>
                      </button>
                    ))}
                  </div>
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
              {/* Preview Card */}
              <Card className="overflow-hidden">
                <CardHeader className="border-b bg-slate-50/50 dark:bg-slate-900/50 flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-green-500" />
                    实时预览
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? '暂停' : '播放'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleReplay}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-80 flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative">
                    <div className="w-64 h-64">{renderPreview()}</div>
                    {/* Hidden path for length calculation */}
                    <svg className="absolute opacity-0 pointer-events-none">
                      <path ref={pathRef} d={activePath} />
                    </svg>
                  </div>
                </CardContent>
              </Card>

              {/* Code Output */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-orange-500" />
                    生成的代码
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="css">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="css">CSS</TabsTrigger>
                      <TabsTrigger value="framer">Framer Motion</TabsTrigger>
                    </TabsList>

                    <TabsContent value="css" className="mt-4">
                      <div className="relative">
                        <ScrollArea className="h-48 rounded-md bg-slate-950">
                          <pre className="p-4 text-sm text-slate-50 font-mono whitespace-pre-wrap">
                            {generateCSS()}
                          </pre>
                        </ScrollArea>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-2 right-2"
                          onClick={() => handleCopyCode(generateCSS())}
                        >
                          {copied ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="framer" className="mt-4">
                      <div className="relative">
                        <ScrollArea className="h-48 rounded-md bg-slate-950">
                          <pre className="p-4 text-sm text-slate-50 font-mono whitespace-pre-wrap">
                            {generateFramer()}
                          </pre>
                        </ScrollArea>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-2 right-2"
                          onClick={() => handleCopyCode(generateFramer())}
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
              className="lg:col-span-3 space-y-6"
            >
              {/* Style Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-500" />
                    样式设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stroke Color */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">描边颜色</label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={config.strokeColor}
                        onChange={e =>
                          setConfig(prev => ({
                            ...prev,
                            strokeColor: e.target.value,
                          }))
                        }
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={config.strokeColor}
                        onChange={e =>
                          setConfig(prev => ({
                            ...prev,
                            strokeColor: e.target.value,
                          }))
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Fill Color */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">填充颜色</label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={
                          config.fillColor === 'transparent'
                            ? '#ffffff'
                            : config.fillColor
                        }
                        onChange={e =>
                          setConfig(prev => ({
                            ...prev,
                            fillColor: e.target.value,
                          }))
                        }
                        className="w-12 h-10 p-1"
                      />
                      <select
                        value={config.fillColor}
                        onChange={e =>
                          setConfig(prev => ({
                            ...prev,
                            fillColor: e.target.value,
                          }))
                        }
                        className="flex-1 h-10 px-3 rounded-md border border-input bg-background"
                      >
                        <option value="transparent">透明</option>
                        <option value="#3b82f6">蓝色</option>
                        <option value="#ef4444">红色</option>
                        <option value="#10b981">绿色</option>
                        <option value="#f59e0b">黄色</option>
                        <option value="#8b5cf6">紫色</option>
                        <option value="#ec4899">粉色</option>
                        <option value="#6366f1">靛蓝</option>
                      </select>
                    </div>
                  </div>

                  {/* Stroke Width */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">描边宽度</label>
                      <span className="text-sm text-muted-foreground">
                        {config.strokeWidth}px
                      </span>
                    </div>
                    <Slider
                      value={[config.strokeWidth]}
                      onValueChange={([value]) =>
                        setConfig(prev => ({ ...prev, strokeWidth: value }))
                      }
                      min={0.5}
                      max={10}
                      step={0.5}
                    />
                  </div>

                  {/* Fill Opacity */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">填充透明度</label>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(config.fillOpacity * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[config.fillOpacity]}
                      onValueChange={([value]) =>
                        setConfig(prev => ({ ...prev, fillOpacity: value }))
                      }
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Animation Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-blue-500" />
                    动画设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Duration */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">持续时间</label>
                      <span className="text-sm text-muted-foreground">
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
                      max={5}
                      step={0.1}
                    />
                  </div>

                  {/* Delay */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium">延迟</label>
                      <span className="text-sm text-muted-foreground">
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
                    <label className="text-sm font-medium">缓动函数</label>
                    <select
                      value={config.ease}
                      onChange={e => {
                        setConfig(prev => ({ ...prev, ease: e.target.value }))
                        handleReplay()
                      }}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    >
                      {easeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Loop */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">循环播放</label>
                    <Switch
                      checked={config.loop}
                      onCheckedChange={checked => {
                        setConfig(prev => ({ ...prev, loop: checked }))
                        handleReplay()
                      }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 space-y-2">
                    <Button
                      onClick={handleDownloadSVG}
                      variant="outline"
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      下载 SVG
                    </Button>
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
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <PenTool className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold mb-2">可视化编辑</h3>
              <p className="text-sm text-muted-foreground">
                12+ 预设 SVG 路径，支持自定义路径输入
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">5 种动画效果</h3>
              <p className="text-sm text-muted-foreground">
                描边绘制、淡入淡出、缩放、脉冲、旋转
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Code2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">代码导出</h3>
              <p className="text-sm text-muted-foreground">
                生成 CSS 和 Framer Motion 两种代码格式
              </p>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
