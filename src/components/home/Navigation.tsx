import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
  Sparkles,
  Terminal,
  Palette,
  MousePointer2,
  PenTool,
  Activity,
} from 'lucide-react'

const navItems = [
  { label: '首页', href: '/' },
  { label: '文章', href: '/blog' },
  { label: '项目', href: '/projects' },
  { label: '待办', href: '/todo' },
  { label: '时间线', href: '/timeline' },
  { label: '仪表盘', href: '/dashboard' },
  { label: '影响力', href: '/influence' },
  { label: '认证', href: '/certifications' },
  { label: '画廊', href: '/gallery' },
  { label: '简历', href: '/resume' },
  { label: '关于', href: '/about' },
]

const toolItems = [
  {
    name: 'CSS 动画库',
    path: '/tools/css-animation',
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
  },
  {
    name: 'AI 动画生成器',
    path: '/tools/ai-animation',
    icon: Sparkles,
    color: 'from-violet-500 to-purple-500',
  },
  {
    name: 'SVG 动画编辑器',
    path: '/tools/svg-animation',
    icon: PenTool,
    color: 'from-pink-500 to-purple-500',
  },
  {
    name: '滚动动画设计器',
    path: '/tools/scroll-animation',
    icon: MousePointer2,
    color: 'from-indigo-500 to-purple-500',
  },
  {
    name: '代码游乐场',
    path: '/tools/code-playground',
    icon: Terminal,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    name: '性能工具',
    path: '/tools/performance',
    icon: Activity,
    color: 'from-orange-500 to-red-500',
  },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [isToolsOpen, setIsToolsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
              >
                MyBlog
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => (
                <Link key={item.href} to={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`relative ${
                      location.pathname === item.href
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {location.pathname === item.href && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-accent rounded-md"
                        transition={{
                          type: 'spring',
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Button>
                </Link>
              ))}

              {/* Tools Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsToolsOpen(true)}
                onMouseLeave={() => setIsToolsOpen(false)}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={`relative flex items-center gap-1 ${
                    location.pathname.startsWith('/tools')
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {location.pathname.startsWith('/tools') && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-accent rounded-md"
                      transition={{
                        type: 'spring',
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1">
                    工具
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${isToolsOpen ? 'rotate-180' : ''}`}
                    />
                  </span>
                </Button>

                <AnimatePresence>
                  {isToolsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 z-50"
                    >
                      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-2 space-y-1">
                          {toolItems.map(tool => (
                            <Link
                              key={tool.path}
                              to={tool.path}
                              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group"
                            >
                              <div
                                className={`w-8 h-8 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                              >
                                <tool.icon className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                                {tool.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                        <div className="p-2 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                          <Link
                            to="/tools"
                            className="flex items-center justify-center gap-2 p-2 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                          >
                            <span>查看全部工具</span>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Theme Toggle & Mobile Menu */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hidden md:flex"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-background/95 backdrop-blur-xl border-b border-border md:hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${
                      location.pathname === item.href
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}

              {/* Mobile Tools Section */}
              <div className="pt-4 border-t border-border">
                <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  开发工具
                </p>
                {toolItems.map(tool => (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-3 ${
                        location.pathname === tool.path
                          ? 'bg-accent text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded bg-linear-to-r ${tool.color} flex items-center justify-center`}
                      >
                        <tool.icon className="w-3 h-3 text-white" />
                      </div>
                      {tool.name}
                    </Button>
                  </Link>
                ))}
                <Link to="/tools" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground"
                  >
                    查看全部工具
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
