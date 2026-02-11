import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Activity,
  Zap,
  Timer,
  Gauge,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Cpu,
  MemoryStick,
  Monitor,
  BarChart3,
  Eye,
  LayoutGrid,
} from 'lucide-react'
import { Navigation } from '@/components/home/Navigation'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts'

// 性能指标类型
interface PerformanceMetrics {
  fps: number
  fcp: number | null
  lcp: number | null
  fid: number | null
  cls: number | null
  ttfb: number | null
  memory: {
    used: number
    total: number
    limit: number
  } | null
  domNodes: number
  resources: number
}

// FPS 历史数据点
interface FPSDataPoint {
  time: number
  fps: number
}

// 性能建议
interface PerformanceSuggestion {
  id: string
  title: string
  description: string
  severity: 'high' | 'medium' | 'low'
  metric: string
}

export function PerformanceDashboardPage() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    memory: null,
    domNodes: 0,
    resources: 0,
  })

  const [fpsHistory, setFpsHistory] = useState<FPSDataPoint[]>([])
  const [isMonitoring, setIsMonitoring] = useState(true)
  const [suggestions, setSuggestions] = useState<PerformanceSuggestion[]>([])
  const [activeTab, setActiveTab] = useState('overview')

  const fpsRef = useRef(0)
  const frameCountRef = useRef(0)
  const lastTimeRef = useRef(performance.now())
  const animationFrameRef = useRef<number>(0)

  // FPS 监控
  const measureFPS = useCallback(() => {
    const now = performance.now()
    frameCountRef.current++

    if (now >= lastTimeRef.current + 1000) {
      const fps = Math.round(
        (frameCountRef.current * 1000) / (now - lastTimeRef.current)
      )
      fpsRef.current = Math.min(fps, 60)

      setFpsHistory(prev => {
        const newData = [...prev, { time: Date.now(), fps: fpsRef.current }]
        // 只保留最近 60 秒的数据
        return newData.slice(-60)
      })

      setMetrics(prev => ({ ...prev, fps: fpsRef.current }))

      frameCountRef.current = 0
      lastTimeRef.current = now
    }

    if (isMonitoring) {
      animationFrameRef.current = requestAnimationFrame(measureFPS)
    }
  }, [isMonitoring])

  // 启动 FPS 监控
  useEffect(() => {
    if (isMonitoring) {
      animationFrameRef.current = requestAnimationFrame(measureFPS)
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isMonitoring, measureFPS])

  // 收集 Core Web Vitals
  useEffect(() => {
    // FCP (First Contentful Paint)
    const observeFCP = () => {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries()
        const fcp = entries.find(
          entry => entry.name === 'first-contentful-paint'
        )
        if (fcp) {
          setMetrics(prev => ({ ...prev, fcp: fcp.startTime }))
        }
      })
      observer.observe({ entryTypes: ['paint'] })
      return () => observer.disconnect()
    }

    // LCP (Largest Contentful Paint)
    const observeLCP = () => {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
          startTime: number
        }
        if (lastEntry) {
          setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }))
        }
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
      return () => observer.disconnect()
    }

    // FID (First Input Delay)
    const observeFID = () => {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries()
        const firstEntry = entries[0] as PerformanceEntry & {
          processingStart: number
          startTime: number
        }
        if (firstEntry) {
          const fid = firstEntry.processingStart - firstEntry.startTime
          setMetrics(prev => ({ ...prev, fid }))
        }
      })
      observer.observe({ entryTypes: ['first-input'] })
      return () => observer.disconnect()
    }

    // CLS (Cumulative Layout Shift)
    const observeCLS = () => {
      let clsValue = 0
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries()
        entries.forEach(entry => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
          }
        })
        setMetrics(prev => ({ ...prev, cls: clsValue }))
      })
      observer.observe({ entryTypes: ['layout-shift'] })
      return () => observer.disconnect()
    }

    // TTFB (Time to First Byte)
    const measureTTFB = () => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming
      if (navigation) {
        setMetrics(prev => ({ ...prev, ttfb: navigation.responseStart }))
      }
    }

    // 内存使用
    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        setMetrics(prev => ({
          ...prev,
          memory: {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit,
          },
        }))
      }
    }

    // DOM 节点数
    const countDOMNodes = () => {
      setMetrics(prev => ({
        ...prev,
        domNodes: document.getElementsByTagName('*').length,
      }))
    }

    // 资源数量
    const countResources = () => {
      setMetrics(prev => ({
        ...prev,
        resources: performance.getEntriesByType('resource').length,
      }))
    }

    // 执行所有测量
    const cleanupFCP = observeFCP()
    const cleanupLCP = observeLCP()
    const cleanupFID = observeFID()
    const cleanupCLS = observeCLS()
    measureTTFB()
    measureMemory()
    countDOMNodes()
    countResources()

    // 定时更新内存和 DOM 节点数
    const interval = setInterval(() => {
      measureMemory()
      countDOMNodes()
      countResources()
    }, 5000)

    return () => {
      cleanupFCP()
      cleanupLCP()
      cleanupFID()
      cleanupCLS()
      clearInterval(interval)
    }
  }, [])

  // 生成性能建议
  useEffect(() => {
    const newSuggestions: PerformanceSuggestion[] = []

    if (metrics.fcp && metrics.fcp > 1800) {
      newSuggestions.push({
        id: 'fcp',
        title: 'FCP 较慢',
        description:
          '首次内容绘制时间超过 1.8s，建议优化关键渲染路径，减少阻塞资源',
        severity: metrics.fcp > 3000 ? 'high' : 'medium',
        metric: 'FCP',
      })
    }

    if (metrics.lcp && metrics.lcp > 2500) {
      newSuggestions.push({
        id: 'lcp',
        title: 'LCP 需要优化',
        description:
          '最大内容绘制时间超过 2.5s，建议优化图片加载、使用 CDN 或预加载关键资源',
        severity: metrics.lcp > 4000 ? 'high' : 'medium',
        metric: 'LCP',
      })
    }

    if (metrics.fid && metrics.fid > 100) {
      newSuggestions.push({
        id: 'fid',
        title: 'FID 延迟较高',
        description: '首次输入延迟超过 100ms，建议减少主线程工作，拆分长任务',
        severity: metrics.fid > 300 ? 'high' : 'medium',
        metric: 'FID',
      })
    }

    if (metrics.cls && metrics.cls > 0.1) {
      newSuggestions.push({
        id: 'cls',
        title: 'CLS 布局偏移',
        description:
          '累积布局偏移超过 0.1，建议为图片和视频预留空间，避免动态插入内容',
        severity: metrics.cls > 0.25 ? 'high' : 'medium',
        metric: 'CLS',
      })
    }

    if (metrics.fps < 30) {
      newSuggestions.push({
        id: 'fps',
        title: 'FPS 过低',
        description:
          '帧率低于 30fps，建议减少动画复杂度，使用 transform 和 opacity 进行动画',
        severity: metrics.fps < 15 ? 'high' : 'medium',
        metric: 'FPS',
      })
    }

    if (metrics.memory && metrics.memory.used > metrics.memory.limit * 0.8) {
      newSuggestions.push({
        id: 'memory',
        title: '内存使用率高',
        description:
          '内存使用超过限制的 80%，建议检查内存泄漏，及时释放不需要的资源',
        severity: 'high',
        metric: 'Memory',
      })
    }

    if (metrics.domNodes > 1500) {
      newSuggestions.push({
        id: 'dom',
        title: 'DOM 节点过多',
        description: `DOM 节点数达到 ${metrics.domNodes}，建议减少不必要的嵌套，使用虚拟列表优化长列表`,
        severity: metrics.domNodes > 3000 ? 'high' : 'medium',
        metric: 'DOM',
      })
    }

    setSuggestions(newSuggestions)
  }, [metrics])

  // 格式化时间
  const formatTime = (ms: number | null) => {
    if (ms === null) return '-'
    if (ms < 1000) return `${Math.round(ms)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  // 格式化字节
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // 获取评分颜色
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 50) return 'text-yellow-500'
    return 'text-red-500'
  }

  // 计算综合评分
  const calculateOverallScore = () => {
    let score = 100

    if (metrics.fcp) {
      if (metrics.fcp > 3000) score -= 20
      else if (metrics.fcp > 1800) score -= 10
    }

    if (metrics.lcp) {
      if (metrics.lcp > 4000) score -= 20
      else if (metrics.lcp > 2500) score -= 10
    }

    if (metrics.fid) {
      if (metrics.fid > 300) score -= 15
      else if (metrics.fid > 100) score -= 5
    }

    if (metrics.cls) {
      if (metrics.cls > 0.25) score -= 15
      else if (metrics.cls > 0.1) score -= 5
    }

    if (metrics.fps < 30) score -= 15
    if (metrics.fps < 15) score -= 10

    return Math.max(0, score)
  }

  const overallScore = calculateOverallScore()

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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
              <Activity className="w-4 h-4" />
              性能监控
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
              性能分析仪表盘
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              实时监控网页性能指标，分析 Core Web Vitals，获取优化建议
            </p>
          </motion.div>

          {/* Overall Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-slate-200 dark:text-slate-700"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - overallScore / 100)}`}
                          className={`${getScoreColor(overallScore)} transition-all duration-1000`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className={`text-3xl font-bold ${getScoreColor(overallScore)}`}
                        >
                          {overallScore}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-2">综合性能评分</h2>
                      <p className="text-muted-foreground">
                        {overallScore >= 90
                          ? '性能优秀！继续保持'
                          : overallScore >= 50
                            ? '性能良好，仍有优化空间'
                            : '需要优化，查看下方建议'}
                      </p>
                      <div className="flex items-center gap-4 mt-4">
                        <Button
                          variant={isMonitoring ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setIsMonitoring(!isMonitoring)}
                        >
                          {isMonitoring ? (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              监控中
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              继续监控
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <Gauge className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                      <p className="text-sm text-muted-foreground">当前 FPS</p>
                      <p
                        className={`text-2xl font-bold ${metrics.fps >= 50 ? 'text-green-500' : metrics.fps >= 30 ? 'text-yellow-500' : 'text-red-500'}`}
                      >
                        {metrics.fps}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <LayoutGrid className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                      <p className="text-sm text-muted-foreground">DOM 节点</p>
                      <p className="text-2xl font-bold">{metrics.domNodes}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Panel - Core Web Vitals */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    概览
                  </TabsTrigger>
                  <TabsTrigger value="fps">
                    <Activity className="w-4 h-4 mr-2" />
                    FPS 监控
                  </TabsTrigger>
                  <TabsTrigger value="resources">
                    <Cpu className="w-4 h-4 mr-2" />
                    资源
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Core Web Vitals */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        Core Web Vitals
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          FCP
                        </p>
                        <p
                          className={`text-xl font-bold ${
                            !metrics.fcp
                              ? 'text-slate-400'
                              : metrics.fcp <= 1800
                                ? 'text-green-500'
                                : metrics.fcp <= 3000
                                  ? 'text-yellow-500'
                                  : 'text-red-500'
                          }`}
                        >
                          {formatTime(metrics.fcp)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          首次内容绘制
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          LCP
                        </p>
                        <p
                          className={`text-xl font-bold ${
                            !metrics.lcp
                              ? 'text-slate-400'
                              : metrics.lcp <= 2500
                                ? 'text-green-500'
                                : metrics.lcp <= 4000
                                  ? 'text-yellow-500'
                                  : 'text-red-500'
                          }`}
                        >
                          {formatTime(metrics.lcp)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          最大内容绘制
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          FID
                        </p>
                        <p
                          className={`text-xl font-bold ${
                            !metrics.fid
                              ? 'text-slate-400'
                              : metrics.fid <= 100
                                ? 'text-green-500'
                                : metrics.fid <= 300
                                  ? 'text-yellow-500'
                                  : 'text-red-500'
                          }`}
                        >
                          {metrics.fid ? `${Math.round(metrics.fid)}ms` : '-'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          首次输入延迟
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          CLS
                        </p>
                        <p
                          className={`text-xl font-bold ${
                            !metrics.cls
                              ? 'text-slate-400'
                              : metrics.cls <= 0.1
                                ? 'text-green-500'
                                : metrics.cls <= 0.25
                                  ? 'text-yellow-500'
                                  : 'text-red-500'
                          }`}
                        >
                          {metrics.cls ? metrics.cls.toFixed(3) : '-'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          累积布局偏移
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Timing Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Timer className="w-4 h-4 text-blue-500" />
                        时间指标
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <span className="text-sm">
                          TTFB (Time to First Byte)
                        </span>
                        <span className="font-mono font-medium">
                          {formatTime(metrics.ttfb)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="fps">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Activity className="w-4 h-4 text-green-500" />
                        FPS 实时监控
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-75">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={fpsHistory}>
                            <defs>
                              <linearGradient
                                id="fpsGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="#22c55e"
                                  stopOpacity={0.3}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="#22c55e"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              className="stroke-slate-200 dark:stroke-slate-700"
                            />
                            <XAxis
                              dataKey="time"
                              tickFormatter={time =>
                                new Date(time).toLocaleTimeString('zh-CN', {
                                  minute: '2-digit',
                                  second: '2-digit',
                                })
                              }
                              className="text-xs text-slate-500"
                            />
                            <YAxis
                              domain={[0, 60]}
                              className="text-xs text-slate-500"
                            />
                            <Tooltip
                              labelFormatter={label =>
                                new Date(label).toLocaleTimeString('zh-CN')
                              }
                              formatter={(value: number | undefined) => [
                                value !== undefined ? `${value} FPS` : '-',
                                '帧率',
                              ]}
                            />
                            <Area
                              type="monotone"
                              dataKey="fps"
                              stroke="#22c55e"
                              fillOpacity={1}
                              fill="url(#fpsGradient)"
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="resources">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <MemoryStick className="w-4 h-4 text-purple-500" />
                        内存使用
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {metrics.memory ? (
                        <>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>已使用</span>
                              <span>{formatBytes(metrics.memory.used)}</span>
                            </div>
                            <Progress
                              value={
                                (metrics.memory.used / metrics.memory.limit) *
                                100
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>总计</span>
                              <span>{formatBytes(metrics.memory.total)}</span>
                            </div>
                            <Progress
                              value={
                                (metrics.memory.total / metrics.memory.limit) *
                                100
                              }
                              className="bg-blue-100"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>限制</span>
                              <span>{formatBytes(metrics.memory.limit)}</span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          当前浏览器不支持内存 API
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Monitor className="w-4 h-4 text-cyan-500" />
                        资源加载
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <span className="text-sm">已加载资源数</span>
                        <span className="text-2xl font-bold">
                          {metrics.resources}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* Right Panel - Suggestions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    优化建议
                    {suggestions.length > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {suggestions.length}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {suggestions.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
                      <p className="text-muted-foreground">
                        暂无优化建议
                        <br />
                        性能表现良好！
                      </p>
                    </div>
                  ) : (
                    suggestions.map((suggestion, index) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border-l-4 ${
                          suggestion.severity === 'high'
                            ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                            : suggestion.severity === 'medium'
                              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <AlertTriangle
                            className={`w-5 h-5 shrink-0 ${
                              suggestion.severity === 'high'
                                ? 'text-red-500'
                                : suggestion.severity === 'medium'
                                  ? 'text-yellow-500'
                                  : 'text-blue-500'
                            }`}
                          />
                          <div>
                            <h4 className="font-medium text-sm mb-1">
                              {suggestion.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {suggestion.description}
                            </p>
                            <Badge variant="outline" className="mt-2 text-xs">
                              {suggestion.metric}
                            </Badge>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Legend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">指标说明</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-muted-foreground">优秀</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-muted-foreground">需要改进</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-muted-foreground">较差</span>
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
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">实时监控</h3>
              <p className="text-sm text-muted-foreground">
                FPS 实时追踪，及时发现性能问题
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Gauge className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Core Web Vitals</h3>
              <p className="text-sm text-muted-foreground">
                Google 核心性能指标监测
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">优化建议</h3>
              <p className="text-sm text-muted-foreground">
                智能分析并给出优化方案
              </p>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
