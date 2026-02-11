import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Copy,
  Check,
  Code2,
  Layout,
  Save,
  Trash2,
  Download,
  Terminal,
  Palette,
  FolderOpen,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  RotateCcw,
  Search,
  Share2,
  Heart,
  History,
  Settings,
  RefreshCw,
  ChevronDown,
  MoreHorizontal,
  Paintbrush,
} from 'lucide-react'
import { toast } from 'sonner'
import { Navigation } from '@/components/home/Navigation'
import { defaultTemplates, iconMap } from '@/data/codeTemplates'
import { Footer } from '@/components/home/Footer'

// ============================================
// 类型定义
// ============================================
interface CodeTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: string
  preview?: string
  code: {
    html: string
    css: string
    js: string
  }
}

interface SavedSnippet {
  id: string
  name: string
  code: {
    html: string
    css: string
    js: string
  }
  createdAt: number
  isFavorite?: boolean
}

interface EditorSettings {
  fontSize: number
  wordWrap: 'on' | 'off' | 'wordWrapColumn' | 'bounded'
  minimap: boolean
  lineNumbers: 'on' | 'off' | 'relative' | 'interval'
  tabSize: number
}

type DeviceType = 'desktop' | 'tablet' | 'mobile'
type ViewMode = 'split' | 'preview' | 'editor'

// ============================================
// 主组件
// ============================================
export function CodePlaygroundPage() {
  // 状态定义
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html')
  const [code, setCode] = useState(defaultTemplates[0].code)
  // const [isFullscreen, setIsFullscreen] = useState(false)
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop')
  const [zoom, setZoom] = useState(100)
  const [savedSnippets, setSavedSnippets] = useState<SavedSnippet[]>([])
  const [snippetName, setSnippetName] = useState('')
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [copied, setCopied] = useState(false)
  const [consoleLogs, setConsoleLogs] = useState<
    { type: string; message: string; timestamp: number }[]
  >([])
  const [showConsole, setShowConsole] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<CodeTemplate>(
    defaultTemplates[0] as CodeTemplate
  )
  // const [error, setError] = useState<Error | null>(null)
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark')
  const [autoPreview, setAutoPreview] = useState(true)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [showSettings, setShowSettings] = useState(false)
  const [editorSettings, setEditorSettings] = useState<EditorSettings>({
    fontSize: 14,
    wordWrap: 'on',
    minimap: false,
    lineNumbers: 'on',
    tabSize: 2,
  })
  // const [isLoading, setIsLoading] = useState(false)
  const [previewKey, setPreviewKey] = useState(0)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  // const fileInputRef = useRef<HTMLInputElement>(null)

  // 从 localStorage 加载保存的代码片段
  useEffect(() => {
    const saved = localStorage.getItem('code-snippets')
    if (saved) {
      try {
        setSavedSnippets(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load snippets:', e)
      }
    }
  }, [])

  // 保存代码片段到 localStorage
  useEffect(() => {
    localStorage.setItem('code-snippets', JSON.stringify(savedSnippets))
  }, [savedSnippets])

  // 监听代码变化
  useEffect(() => {
    setHasUnsavedChanges(true)
  }, [code])

  // 生成预览内容
  const generatePreviewContent = () => {
    return `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Preview</title>
                <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
                <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
                <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                  ${code.css}
                </style>
              </head>
              <body>
                <div id="root"></div>
                <script type="text/babel">
                  const { useState, useEffect, useCallback, useMemo, useRef } = React;
                  
                  function App() {
                    ${code.js}
                    
                    return (
                      <>
                        ${code.html}
                      </>
                    );
                  }
                  
                  const root = ReactDOM.createRoot(document.getElementById('root'));
                  root.render(<App />);
                </script>
              </body>
            </html>
    `.trim()
  }

  // 刷新预览
  const refreshPreview = () => {
    setPreviewKey(prev => prev + 1)
  }

  // 处理代码变化
  const handleCodeChange = (
    value: string | undefined,
    type: 'html' | 'css' | 'js'
  ) => {
    setCode(prev => ({
      ...prev,
      [type]: value || '',
    }))
    setHasUnsavedChanges(true)
    if (autoPreview) {
      refreshPreview()
    }
  }

  // 复制代码
  const copyCode = async () => {
    const fullCode = `<!-- HTML -->\n${code.html}\n\n/* CSS */\n${code.css}\n\n// JavaScript\n${code.js}`
    await navigator.clipboard.writeText(fullCode)
    setCopied(true)
    toast.success('代码已复制到剪贴板')
    setTimeout(() => setCopied(false), 2000)
  }

  // 下载代码
  const downloadCode = () => {
    const fullCode = `<!DOCTYPE html>
                      <html>
                      <head>
                        <meta charset="UTF-8">
                        <title>Code Playground Export</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                      ${code.css}
                        </style>
                      </head>
                      <body>
                      ${code.html}
                      <script>
                      ${code.js}
                      </script>
                      </body>
                      </html>`
    const blob = new Blob([fullCode], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'playground-export.html'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('代码已下载')
  }

  // 保存代码片段
  const saveSnippet = () => {
    if (!snippetName.trim()) {
      toast.error('请输入片段名称')
      return
    }
    const newSnippet: SavedSnippet = {
      id: Date.now().toString(),
      name: snippetName,
      code: { ...code },
      createdAt: Date.now(),
    }
    setSavedSnippets(prev => [newSnippet, ...prev])
    setSnippetName('')
    setShowSaveDialog(false)
    setHasUnsavedChanges(false)
    toast.success('代码片段已保存')
  }

  // 加载代码片段
  const loadSnippet = (snippet: SavedSnippet) => {
    setCode(snippet.code)
    setHasUnsavedChanges(false)
    refreshPreview()
    toast.success(`已加载: ${snippet.name}`)
  }

  // 删除代码片段
  const deleteSnippet = (id: string) => {
    setSavedSnippets(prev => prev.filter(s => s.id !== id))
    toast.success('代码片段已删除')
  }

  // 切换收藏
  const toggleFavorite = (id: string) => {
    setSavedSnippets(prev =>
      prev.map(s => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s))
    )
  }

  // 重置代码
  const resetCode = () => {
    setCode(selectedTemplate.code)
    setHasUnsavedChanges(false)
    refreshPreview()
    toast.success('代码已重置')
  }

  // 格式化代码
  const formatCode = () => {
    // 简单的格式化实现
    const formattedHtml = code.html.replace(/>\s*</g, '>\n<').trim()
    const formattedCss = code.css
      .replace(/;/g, ';\n')
      .replace(/{/g, ' {\n')
      .replace(/}/g, '\n}')
      .trim()
    const formattedJs = code.js.replace(/;/g, ';\n').trim()

    setCode({
      html: formattedHtml,
      css: formattedCss,
      js: formattedJs,
    })
    toast.success('代码已格式化')
  }

  // 分享代码
  const shareCode = () => {
    const codeData = btoa(JSON.stringify(code))
    const shareUrl = `${window.location.origin}${window.location.pathname}?code=${codeData}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('分享链接已复制到剪贴板')
  }

  // 加载模板
  const loadTemplate = (template: CodeTemplate) => {
    setSelectedTemplate(template)
    setCode(template.code)
    setHasUnsavedChanges(false)
    refreshPreview()
    toast.success(`已加载模板: ${template.name}`)
  }

  // 分类列表
  const categories = [
    '全部',
    ...Array.from(new Set(defaultTemplates.map(t => t.category))),
  ]

  // 过滤模板
  const filteredTemplates = defaultTemplates.filter(template => {
    const matchesSearch = template.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === '全部' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // 获取图标组件
  const getIconComponent = (iconName: string) => {
    const IconComponent = iconMap[iconName]
    return IconComponent ? (
      <IconComponent className="w-4 h-4" />
    ) : (
      <Code2 className="w-4 h-4" />
    )
  }

  // 设备尺寸
  const deviceSizes = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navigation />
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        {/* 头部 */}
        <motion.div
          className="max-w-400 mx-auto mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                代码游乐场
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                实时编写、预览和分享你的代码
              </p>
            </div>

            {/* 工具栏 */}
            <div className="flex flex-wrap items-center gap-2">
              {/* 视图模式切换 */}
              <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={viewMode === 'editor' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('editor')}
                        className="h-8"
                      >
                        <Code2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>编辑器模式</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={viewMode === 'split' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('split')}
                        className="h-8"
                      >
                        <Layout className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>分屏模式</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={viewMode === 'preview' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('preview')}
                        className="h-8"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>预览模式</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Separator orientation="vertical" className="h-8" />

              {/* 设备切换 */}
              <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={deviceType === 'desktop' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setDeviceType('desktop')}
                        className="h-8"
                      >
                        <Monitor className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>桌面视图</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={deviceType === 'tablet' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setDeviceType('tablet')}
                        className="h-8"
                      >
                        <Tablet className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>平板视图</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={deviceType === 'mobile' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setDeviceType('mobile')}
                        className="h-8"
                      >
                        <Smartphone className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>手机视图</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Separator orientation="vertical" className="h-8" />

              {/* 操作按钮 */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={refreshPreview}
                      className="h-8"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>刷新预览</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyCode}
                      className="h-8"
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>复制代码</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={formatCode}>
                    <Paintbrush className="w-4 h-4 mr-2" />
                    格式化代码
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={resetCode}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    重置代码
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={downloadCode}>
                    <Download className="w-4 h-4 mr-2" />
                    下载代码
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={shareCode}>
                    <Share2 className="w-4 h-4 mr-2" />
                    分享代码
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowSaveDialog(true)}>
                    <Save className="w-4 h-4 mr-2" />
                    保存片段
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSettings(true)}>
                    <Settings className="w-4 h-4 mr-2" />
                    编辑器设置
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>

        {/* 主内容区 */}
        <div className="max-w-400 mx-auto">
          <div
            className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}
          >
            {/* 编辑器区域 */}
            {(viewMode === 'editor' || viewMode === 'split') && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* 模板选择器 */}
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      选择模板
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            placeholder="搜索模板..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                        <Select
                          value={selectedCategory}
                          onValueChange={setSelectedCategory}
                        >
                          <SelectTrigger className="w-35">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <ScrollArea className="h-30">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {filteredTemplates.map(template => (
                            <motion.button
                              key={template.id}
                              onClick={() =>
                                loadTemplate(template as CodeTemplate)
                              }
                              className={`p-3 rounded-lg border text-left transition-all ${
                                selectedTemplate.id === template.id
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                {getIconComponent(template.icon as string)}
                                <span className="font-medium text-sm truncate">
                                  {template.name}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 truncate">
                                {template.description}
                              </p>
                            </motion.button>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>

                {/* 代码编辑器 */}
                <Card className="border-slate-200 dark:border-slate-700 overflow-hidden">
                  <Tabs
                    value={activeTab}
                    onValueChange={v =>
                      setActiveTab(v as 'html' | 'css' | 'js')
                    }
                  >
                    <CardHeader className="pb-0">
                      <div className="flex items-center justify-between">
                        <TabsList>
                          <TabsTrigger value="html" className="gap-2">
                            <Code2 className="w-4 h-4" />
                            HTML
                          </TabsTrigger>
                          <TabsTrigger value="css" className="gap-2">
                            <Palette className="w-4 h-4" />
                            CSS
                          </TabsTrigger>
                          <TabsTrigger value="js" className="gap-2">
                            <Terminal className="w-4 h-4" />
                            JavaScript
                          </TabsTrigger>
                        </TabsList>

                        <div className="flex items-center gap-2">
                          <Switch
                            checked={autoPreview}
                            onCheckedChange={setAutoPreview}
                            id="auto-preview"
                          />
                          <Label
                            htmlFor="auto-preview"
                            className="text-sm cursor-pointer"
                          >
                            自动预览
                          </Label>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-0">
                      <TabsContent value="html" className="mt-0">
                        <Editor
                          height="400px"
                          language="html"
                          value={code.html}
                          onChange={v => handleCodeChange(v, 'html')}
                          theme={editorTheme}
                          options={{
                            minimap: { enabled: editorSettings.minimap },
                            fontSize: editorSettings.fontSize,
                            wordWrap: editorSettings.wordWrap,
                            lineNumbers: editorSettings.lineNumbers,
                            tabSize: editorSettings.tabSize,
                            automaticLayout: true,
                          }}
                        />
                      </TabsContent>

                      <TabsContent value="css" className="mt-0">
                        <Editor
                          height="400px"
                          language="css"
                          value={code.css}
                          onChange={v => handleCodeChange(v, 'css')}
                          theme={editorTheme}
                          options={{
                            minimap: { enabled: editorSettings.minimap },
                            fontSize: editorSettings.fontSize,
                            wordWrap: editorSettings.wordWrap,
                            lineNumbers: editorSettings.lineNumbers,
                            tabSize: editorSettings.tabSize,
                            automaticLayout: true,
                          }}
                        />
                      </TabsContent>

                      <TabsContent value="js" className="mt-0">
                        <Editor
                          height="400px"
                          language="javascript"
                          value={code.js}
                          onChange={v => handleCodeChange(v, 'js')}
                          theme={editorTheme}
                          options={{
                            minimap: { enabled: editorSettings.minimap },
                            fontSize: editorSettings.fontSize,
                            wordWrap: editorSettings.wordWrap,
                            lineNumbers: editorSettings.lineNumbers,
                            tabSize: editorSettings.tabSize,
                            automaticLayout: true,
                          }}
                        />
                      </TabsContent>
                    </CardContent>
                  </Tabs>
                </Card>

                {/* 已保存的片段 */}
                {savedSnippets.length > 0 && (
                  <Card className="border-slate-200 dark:border-slate-700">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <History className="w-4 h-4" />
                        已保存的片段
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-37.5">
                        <div className="space-y-2">
                          {savedSnippets.map(snippet => (
                            <div
                              key={snippet.id}
                              className="flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                              <button
                                onClick={() => loadSnippet(snippet)}
                                className="flex-1 text-left"
                              >
                                <span className="font-medium text-sm">
                                  {snippet.name}
                                </span>
                                <span className="text-xs text-slate-500 ml-2">
                                  {new Date(
                                    snippet.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </button>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleFavorite(snippet.id)}
                                >
                                  <Heart
                                    className={`w-4 h-4 ${snippet.isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                                  />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteSnippet(snippet.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {/* 预览区域 */}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        实时预览
                        {hasUnsavedChanges && (
                          <span className="text-xs text-amber-500">
                            (未保存)
                          </span>
                        )}
                      </CardTitle>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">{zoom}%</span>
                        <Slider
                          value={[zoom]}
                          onValueChange={v => setZoom(v[0])}
                          min={50}
                          max={150}
                          step={10}
                          className="w-24"
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 overflow-auto">
                      <div
                        className="mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300"
                        style={{
                          width: deviceSizes[deviceType],
                          maxWidth: '100%',
                          transform: `scale(${zoom / 100})`,
                          transformOrigin: 'top center',
                        }}
                      >
                        <iframe
                          ref={iframeRef}
                          key={previewKey}
                          srcDoc={generatePreviewContent()}
                          className="w-full min-h-125 border-0"
                          sandbox="allow-scripts allow-same-origin"
                          title="preview"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 控制台 */}
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle
                        className="text-sm font-medium flex items-center gap-2 cursor-pointer"
                        onClick={() => setShowConsole(!showConsole)}
                      >
                        <Terminal className="w-4 h-4" />
                        控制台
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${showConsole ? 'rotate-180' : ''}`}
                        />
                      </CardTitle>

                      {consoleLogs.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setConsoleLogs([])}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>

                  <AnimatePresence>
                    {showConsole && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <CardContent>
                          <ScrollArea className="h-37.5 bg-slate-950 rounded-lg p-3">
                            {consoleLogs.length === 0 ? (
                              <p className="text-slate-500 text-sm">
                                暂无日志输出...
                              </p>
                            ) : (
                              <div className="space-y-1">
                                {consoleLogs.map((log, i) => (
                                  <div key={i} className="text-sm font-mono">
                                    <span className="text-slate-500 text-xs">
                                      {new Date(
                                        log.timestamp
                                      ).toLocaleTimeString()}
                                    </span>
                                    <span
                                      className={`ml-2 ${
                                        log.type === 'error'
                                          ? 'text-red-400'
                                          : log.type === 'warn'
                                            ? 'text-yellow-400'
                                            : 'text-green-400'
                                      }`}
                                    >
                                      {log.message}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </ScrollArea>
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      {/* 保存片段对话框 */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>保存代码片段</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="snippet-name">片段名称</Label>
              <Input
                id="snippet-name"
                value={snippetName}
                onChange={e => setSnippetName(e.target.value)}
                placeholder="输入片段名称..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowSaveDialog(false)}
              >
                取消
              </Button>
              <Button onClick={saveSnippet}>
                <Save className="w-4 h-4 mr-2" />
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* 设置对话框 */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>编辑器设置</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label>字体大小: {editorSettings.fontSize}px</Label>
              <Slider
                value={[editorSettings.fontSize]}
                onValueChange={v =>
                  setEditorSettings(prev => ({ ...prev, fontSize: v[0] }))
                }
                min={10}
                max={24}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Tab 大小</Label>
              <Select
                value={String(editorSettings.tabSize)}
                onValueChange={v =>
                  setEditorSettings(prev => ({ ...prev, tabSize: Number(v) }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 空格</SelectItem>
                  <SelectItem value="4">4 空格</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>显示缩略图</Label>
              <Switch
                checked={editorSettings.minimap}
                onCheckedChange={v =>
                  setEditorSettings(prev => ({ ...prev, minimap: v }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>自动换行</Label>
              <Switch
                checked={editorSettings.wordWrap === 'on'}
                onCheckedChange={v =>
                  setEditorSettings(prev => ({
                    ...prev,
                    wordWrap: v ? 'on' : 'off',
                  }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>深色主题</Label>
              <Switch
                checked={editorTheme === 'vs-dark'}
                onCheckedChange={v => setEditorTheme(v ? 'vs-dark' : 'light')}
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setShowSettings(false)}>完成</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
