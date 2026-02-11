import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  animationCategories,
  animationParameters,
  type AnimationCategory,
} from '@/data/animations'
import {
  CardEntranceShowcase,
  ButtonEmphasisShowcase,
  ModalTransitionShowcase,
  ListStaggerShowcase,
  GestureDragShowcase,
  MicroInteractionShowcase,
  Flip3DShowcase,
  LoaderShowcase,
} from '@/components/tools/showcases'
import {
  ArrowLeft,
  Play,
  Clock,
  Zap,
  Palette,
  Layers,
  Code2,
  Copy,
  Check,
} from 'lucide-react'

interface AnimationItem {
  id: string
  name: string
  description: string
  category: AnimationCategory
  component: React.ComponentType<any>
  componentProps?: Record<string, any>
}

const animations: AnimationItem[] = [
  // Entrance
  {
    id: 'fade-in',
    name: 'Fade In',
    description: '淡入效果',
    category: 'entrance',
    component: CardEntranceShowcase,
    componentProps: { animationType: 'fade' },
  },
  {
    id: 'slide-in',
    name: 'Slide In',
    description: '滑入效果',
    category: 'entrance',
    component: CardEntranceShowcase,
    componentProps: { animationType: 'slide' },
  },
  {
    id: 'scale-in',
    name: 'Scale In',
    description: '缩放进入',
    category: 'entrance',
    component: CardEntranceShowcase,
    componentProps: { animationType: 'scale' },
  },
  {
    id: 'flip-in',
    name: 'Flip In',
    description: '翻转进入',
    category: 'entrance',
    component: CardEntranceShowcase,
    componentProps: { animationType: 'flip' },
  },
  {
    id: 'rotate-in',
    name: 'Rotate In',
    description: '旋转进入',
    category: 'entrance',
    component: CardEntranceShowcase,
    componentProps: { animationType: 'rotate' },
  },

  // Emphasis
  {
    id: 'pulse',
    name: 'Pulse',
    description: '脉冲效果',
    category: 'emphasis',
    component: ButtonEmphasisShowcase,
    componentProps: { animationType: 'pulse' },
  },
  {
    id: 'shake',
    name: 'Shake',
    description: '摇晃效果',
    category: 'emphasis',
    component: ButtonEmphasisShowcase,
    componentProps: { animationType: 'shake' },
  },
  {
    id: 'bounce',
    name: 'Bounce',
    description: '弹跳效果',
    category: 'emphasis',
    component: ButtonEmphasisShowcase,
    componentProps: { animationType: 'bounce' },
  },
  {
    id: 'tada',
    name: 'Tada',
    description: '惊喜效果',
    category: 'emphasis',
    component: ButtonEmphasisShowcase,
    componentProps: { animationType: 'tada' },
  },
  {
    id: 'heartbeat',
    name: 'Heartbeat',
    description: '心跳效果',
    category: 'emphasis',
    component: ButtonEmphasisShowcase,
    componentProps: { animationType: 'heartbeat' },
  },
  {
    id: 'glow',
    name: 'Glow',
    description: '发光效果',
    category: 'emphasis',
    component: ButtonEmphasisShowcase,
    componentProps: { animationType: 'glow' },
  },

  // Gesture
  {
    id: 'drag',
    name: 'Drag & Swipe',
    description: '拖拽滑动',
    category: 'gesture',
    component: GestureDragShowcase,
  },

  // Transition
  {
    id: 'modal',
    name: 'Modal Transition',
    description: '模态框过渡',
    category: 'transition',
    component: ModalTransitionShowcase,
  },
  {
    id: 'list',
    name: 'List Stagger',
    description: '列表交错动画',
    category: 'transition',
    component: ListStaggerShowcase,
  },

  // Micro
  {
    id: 'micro',
    name: 'Micro Interactions',
    description: '微交互集合',
    category: 'micro',
    component: MicroInteractionShowcase,
  },
  {
    id: 'loader',
    name: 'Loading States',
    description: '加载状态',
    category: 'micro',
    component: LoaderShowcase,
  },

  // 3D
  {
    id: 'flip-3d',
    name: '3D Flip Card',
    description: '3D 卡片翻转',
    category: '3d',
    component: Flip3DShowcase,
  },
]

export function CSSAnimationPage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<
    AnimationCategory | 'all'
  >('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAnimation, setSelectedAnimation] =
    useState<AnimationItem | null>(null)
  const [copied, setCopied] = useState(false)

  // Animation config
  const [config, setConfig] = useState({
    duration: 0.5,
    delay: 0,
    ease: 'easeOut',
    stagger: 0.1,
  })

  const filteredAnimations = animations.filter(anim => {
    const matchesCategory =
      selectedCategory === 'all' || anim.category === selectedCategory
    const matchesSearch =
      searchQuery === '' ||
      anim.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      anim.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const generateCode = (animation: AnimationItem) => {
    return `import { motion } from 'framer-motion'

            // ${animation.name} - ${animation.description}
            const ${animation.id.replace(/-/g, '')}Variants = {
              hidden: { 
                opacity: 0,
                // Add your initial state here
              },
              visible: { 
                opacity: 1,
                transition: {
                  duration: ${config.duration},
                  delay: ${config.delay},
                  ease: '${config.ease}',
                  staggerChildren: ${config.stagger},
                }
              }
            }

            export function AnimatedComponent() {
              return (
                <motion.div
                  variants={${animation.id.replace(/-/g, '')}Variants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Your content here */}
                </motion.div>
              )
            }`
  }

  const handleCopy = async () => {
    if (!selectedAnimation) return
    try {
      await navigator.clipboard.writeText(generateCode(selectedAnimation))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'entrance':
        return <Play className="w-4 h-4" />
      case 'emphasis':
        return <Zap className="w-4 h-4" />
      case 'gesture':
        return <Layers className="w-4 h-4" />
      case 'transition':
        return <Clock className="w-4 h-4" />
      case 'micro':
        return <Palette className="w-4 h-4" />
      case '3d':
        return <Code2 className="w-4 h-4" />
      default:
        return <Layers className="w-4 h-4" />
    }
  }

  const getCategoryColor = (categoryId: string) => {
    switch (categoryId) {
      case 'entrance':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'emphasis':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'gesture':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'transition':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'micro':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20'
      case '3d':
        return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
      default:
        return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-20">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Button
                variant="ghost"
                size="sm"
                className="mb-4"
                onClick={() => navigate('/tools')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回工具箱
              </Button>

              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 mb-4">
                  <Palette className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    CSS 动画工具箱
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                  <span className="bg-linear-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Animation
                  </span>
                  <span className="text-foreground"> Gallery</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  基于 Framer Motion 的专业动画组件库，支持实时预览和代码生成
                </p>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Sidebar - Categories */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-3"
              >
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-lg">分类</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory('all')}
                    >
                      <Layers className="w-4 h-4 mr-2" />
                      全部动画
                      <Badge variant="secondary" className="ml-auto">
                        {animations.length}
                      </Badge>
                    </Button>
                    {animationCategories.map(category => (
                      <Button
                        key={category.id}
                        variant={
                          selectedCategory === category.id ? 'default' : 'ghost'
                        }
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {getCategoryIcon(category.id)}
                        <span className="ml-2">{category.name}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {
                            animations.filter(a => a.category === category.id)
                              .length
                          }
                        </Badge>
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Main Area */}
              <div className="lg:col-span-9 space-y-6">
                {/* Search & Filter */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1">
                        <Input
                          placeholder="搜索动画..."
                          value={searchQuery}
                          onChange={e => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {config.duration}s
                          </span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                          <Zap className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground capitalize">
                            {config.ease}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Animation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredAnimations.map((animation, index) => {
                    const ShowcaseComponent = animation.component
                    return (
                      <motion.div
                        key={animation.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card
                          className={`cursor-pointer transition-all hover:shadow-lg ${
                            selectedAnimation?.id === animation.id
                              ? 'ring-2 ring-primary'
                              : ''
                          }`}
                          onClick={() => setSelectedAnimation(animation)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-base">
                                  {animation.name}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  {animation.description}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={getCategoryColor(animation.category)}
                              >
                                {
                                  animationCategories.find(
                                    c => c.id === animation.category
                                  )?.name
                                }
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="h-48 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg overflow-hidden">
                              <ShowcaseComponent
                                {...animation.componentProps}
                                config={config}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>

                {filteredAnimations.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">未找到匹配的动画</p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery('')
                        setSelectedCategory('all')
                      }}
                    >
                      清除筛选
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Config Panel - Floating */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4"
      >
        <Card className="shadow-2xl border-primary/20">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Code2 className="w-4 h-4" />
                动画配置
              </div>

              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                <div className="space-y-2">
                  <Label className="text-xs">Duration</Label>
                  <Slider
                    value={[config.duration]}
                    onValueChange={([v]) =>
                      setConfig({ ...config, duration: v })
                    }
                    min={0.1}
                    max={2}
                    step={0.1}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Delay</Label>
                  <Slider
                    value={[config.delay]}
                    onValueChange={([v]) => setConfig({ ...config, delay: v })}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Stagger</Label>
                  <Slider
                    value={[config.stagger]}
                    onValueChange={([v]) =>
                      setConfig({ ...config, stagger: v })
                    }
                    min={0}
                    max={0.5}
                    step={0.05}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Easing</Label>
                  <Select
                    value={config.ease}
                    onValueChange={v => setConfig({ ...config, ease: v })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {animationParameters
                        .find(p => p.key === 'ease')
                        ?.options?.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedAnimation && (
                <Button onClick={handleCopy} size="sm" className="shrink-0">
                  {copied ? (
                    <Check className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copied ? '已复制' : '复制代码'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Footer />
    </div>
  )
}
