import { motion } from 'framer-motion'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Wrench,
  Code2,
  Palette,
  Terminal,
  Globe,
  Database,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Activity,
  Box,
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface ExternalTool {
  name: string
  description: string
  url: string
}

interface InternalTool {
  name: string
  description: string
  path: string
}

interface ToolCategory {
  category: string
  icon: React.ComponentType<{ className?: string }>
  isInternal?: boolean
  items: (ExternalTool | InternalTool)[]
}

const tools: ToolCategory[] = [
  {
    category: '开发工具',
    icon: Code2,
    items: [
      {
        name: 'VS Code',
        description: '强大的代码编辑器',
        url: 'https://code.visualstudio.com',
      },
      {
        name: 'WebStorm',
        description: 'JetBrains IDE',
        url: 'https://www.jetbrains.com/webstorm',
      },
      {
        name: 'Cursor',
        description: 'AI驱动的编辑器',
        url: 'https://cursor.sh',
      },
    ],
  },
  {
    category: 'CSS 工具箱',
    icon: Sparkles,
    isInternal: true,
    items: [
      {
        name: 'CSS 动画库',
        description: '30+ 种动画效果预览与复制',
        path: '/tools/css-animation',
      },
      {
        name: 'AI 动画生成器',
        description: '用自然语言生成动画代码',
        path: '/tools/ai-animation',
      },
      {
        name: 'SVG 动画编辑器',
        description: '可视化编辑 SVG 路径动画',
        path: '/tools/svg-animation',
      },
      {
        name: '滚动动画设计器',
        description: '可视化配置滚动触发动画',
        path: '/tools/scroll-animation',
      },
    ],
  },
  {
    category: '代码工具',
    icon: Terminal,
    isInternal: true,
    items: [
      {
        name: '代码游乐场',
        description: '在线编写 React/CSS 代码',
        path: '/tools/code-playground',
      },
    ],
  },
  {
    category: '性能工具',
    icon: Activity,
    isInternal: true,
    items: [
      {
        name: '性能分析仪表盘',
        description: '实时监控网页性能指标',
        path: '/tools/performance',
      },
    ],
  },
  {
    category: '3D 工具',
    icon: Box,
    isInternal: true,
    items: [
      {
        name: '3D 场景构建器',
        description: '可视化创建和编辑 3D 场景',
        path: '/tools/3d-builder',
      },
    ],
  },
  {
    category: '设计工具',
    icon: Palette,
    items: [
      { name: 'Figma', description: '协作设计工具', url: 'https://figma.com' },
      { name: 'Sketch', description: 'Mac设计工具', url: 'https://sketch.com' },
      {
        name: 'Framer',
        description: '原型设计工具',
        url: 'https://framer.com',
      },
    ],
  },
  {
    category: '终端工具',
    icon: Terminal,
    items: [
      { name: 'iTerm2', description: 'Mac终端', url: 'https://iterm2.com' },
      { name: 'Warp', description: '现代终端', url: 'https://warp.dev' },
      { name: 'Oh My Zsh', description: 'Zsh配置', url: 'https://ohmyz.sh' },
    ],
  },
  {
    category: '浏览器',
    icon: Globe,
    items: [
      {
        name: 'Chrome',
        description: 'Google浏览器',
        url: 'https://chrome.google.com',
      },
      { name: 'Arc', description: '现代浏览器', url: 'https://arc.net' },
      {
        name: 'Firefox',
        description: '开源浏览器',
        url: 'https://firefox.com',
      },
    ],
  },
  {
    category: '数据库',
    icon: Database,
    items: [
      {
        name: 'TablePlus',
        description: '数据库管理',
        url: 'https://tableplus.com',
      },
      {
        name: 'MongoDB Compass',
        description: 'MongoDB GUI',
        url: 'https://mongodb.com',
      },
      {
        name: 'Redis Insight',
        description: 'Redis GUI',
        url: 'https://redis.io',
      },
    ],
  },
  {
    category: '生产力',
    icon: Wrench,
    items: [
      { name: 'Notion', description: '笔记和协作', url: 'https://notion.so' },
      { name: 'Raycast', description: 'Mac启动器', url: 'https://raycast.com' },
      { name: 'Alfred', description: '效率工具', url: 'https://alfredapp.com' },
    ],
  },
]

// 类型守卫函数
// function isExternalTool(
//   tool: ExternalTool | InternalTool
// ): tool is ExternalTool {
//   return 'url' in tool
// }

function isInternalTool(
  tool: ExternalTool | InternalTool
): tool is InternalTool {
  return 'path' in tool
}

export function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                工具箱
              </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              我日常使用的开发工具和软件推荐
            </p>
          </motion.div>

          {/* Tools Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {tools.map((category, index) => {
              const CategoryIcon = category.icon
              return (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full bg-linear-to-br from-card/50 to-card border-border/50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-lg bg-linear-to-r from-purple-500 to-blue-500">
                          <CategoryIcon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold">
                          {category.category}
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {category.items.map(tool => (
                          <div
                            key={tool.name}
                            className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors group"
                          >
                            <div>
                              <p className="font-medium">{tool.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {tool.description}
                              </p>
                            </div>
                            {isInternalTool(tool) ? (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                asChild
                              >
                                <Link to={tool.path}>
                                  <ArrowRight className="w-4 h-4" />
                                </Link>
                              </Button>
                            ) : (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                asChild
                              >
                                <a
                                  href={tool.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
