import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'
import {
  Github,
  Star,
  GitFork,
  Terminal,
  Cpu,
  Globe,
  Layers,
  Zap,
  Code2,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import type { ProjectListItem } from '@/types/project'

// Background decoration with code rain effect
function BackgroundDecoration() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute top-40 right-10 w-80 h-80 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 left-1/3 w-72 h-72 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
    </div>
  )
}

// Blinking cursor component
function BlinkingCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
      className="inline-block w-2 h-5 bg-purple-500 ml-1"
    />
  )
}

// Tech tag with icon
function TechTag({ label, color }: { label: string; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    purple:
      'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    green:
      'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    orange:
      'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
  }

  return (
    <motion.span
      whileHover={{ scale: 1.05, y: -2 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border ${colorClasses[color] || colorClasses.blue}`}
    >
      <Code2 className="w-3.5 h-3.5" />
      {label}
    </motion.span>
  )
}

// Project type badge
function ProjectTypeBadge({ type }: { type: string }) {
  const typeConfig: Record<
    string,
    { icon: React.ElementType; label: string; color: string }
  > = {
    AI: { icon: Sparkles, label: 'AI Project', color: 'purple' },
    Frontend: { icon: Layers, label: 'Frontend', color: 'blue' },
    Backend: { icon: Cpu, label: 'Backend', color: 'green' },
    FullStack: { icon: Globe, label: 'Full Stack', color: 'orange' },
    Tool: { icon: Terminal, label: 'DevTool', color: 'pink' },
  }

  const config = typeConfig[type] || typeConfig.FullStack
  return <TechTag label={config.label} color={config.color} />
}

// Project card component
function ProjectCard({
  project,
  index,
}: {
  project: ProjectListItem
  index: number
}) {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  // Determine project type based on tags
  const getProjectType = () => {
    const tags = project.tags.map((t: string) => t.toLowerCase())
    if (
      tags.some(
        (t: string) => t.includes('ai') || t.includes('ml') || t.includes('llm')
      )
    )
      return 'AI'
    if (
      tags.some(
        (t: string) =>
          t.includes('react') || t.includes('vue') || t.includes('frontend')
      )
    )
      return 'Frontend'
    if (
      tags.some(
        (t: string) =>
          t.includes('node') || t.includes('python') || t.includes('backend')
      )
    )
      return 'Backend'
    if (tags.some((t: string) => t.includes('cli') || t.includes('tool')))
      return 'Tool'
    return 'FullStack'
  }

  const projectType = getProjectType()

  const handleCardClick = () => {
    navigate(`/projects/${project.slug}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      className="group relative cursor-pointer"
    >
      <div className="relative bg-card rounded-xl border border-border overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
        {/* Project Image */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

          {/* Floating Stats */}
          <div className="absolute top-4 right-4 flex gap-3">
            {project.stars !== undefined && project.stars > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm"
              >
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{project.stars}</span>
              </motion.div>
            )}
            {project.forks !== undefined && project.forks > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm"
              >
                <GitFork className="w-4 h-4 text-blue-400" />
                <span>{project.forks}</span>
              </motion.div>
            )}
          </div>

          {/* Project Type Badge */}
          <div className="absolute top-4 left-4">
            <ProjectTypeBadge type={projectType} />
          </div>

          {/* Hover Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-purple-500/10 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: isHovered ? 1 : 0.8,
                opacity: isHovered ? 1 : 0,
              }}
              className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-full font-medium"
            >
              <span>查看详情</span>
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title with code style */}
          <h3 className="font-mono text-xl font-bold mb-2 group-hover:text-purple-500 transition-colors">
            <span className="text-slate-400">&quot;</span>
            {project.title}
            <span className="text-slate-400">&quot;</span>
            {isHovered && <BlinkingCursor />}
          </h3>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {project.summary}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.slice(0, 4).map((tag: string) => {
              const getTagColor = (tagName: string): string => {
                const tagColors: Record<string, string> = {
                  React: 'blue',
                  TypeScript: 'blue',
                  Vue: 'green',
                  Node: 'green',
                  Python: 'cyan',
                  AI: 'purple',
                  LLM: 'purple',
                  CSS: 'pink',
                  Tailwind: 'cyan',
                }
                return tagColors[tagName] || 'blue'
              }
              return <TechTag key={tag} label={tag} color={getTagColor(tag)} />
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors font-mono text-sm"
              >
                <Github className="w-4 h-4" />
                <span>git clone</span>
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors font-mono text-sm"
              >
                <Zap className="w-4 h-4" />
                <span>npm run dev</span>
              </a>
            )}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
      </div>
    </motion.div>
  )
}

export function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/'
    fetch(`${baseUrl}projects.json`)
      .then(res => res.json())
      .then(data => {
        // 转换数据格式以兼容现有组件
        const formattedProjects: ProjectListItem[] = data.map(
          (item: {
            id: string
            slug: string
            title: string
            summary: string
            description: string
            coverImage: string
            tags: string[]
            demoUrl?: string
            repoUrl?: string
            featured: boolean
            stars?: number
            forks?: number
          }) => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            summary: item.summary,
            description: item.description,
            image: item.coverImage,
            tags: item.tags,
            demoUrl: item.demoUrl,
            repoUrl: item.repoUrl,
            featured: item.featured,
            stars: item.stars,
            forks: item.forks,
          })
        )
        setProjects(formattedProjects)
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to load projects:', error)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <BackgroundDecoration />
      <Navigation />

      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header - Terminal Style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            {/* Terminal Window */}
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-xl">
              {/* Title Bar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-muted-foreground font-mono">
                    levy@projects: ~/portfolio
                  </span>
                </div>
                <div className="w-16" />
              </div>

              {/* Terminal Content */}
              <div className="p-8">
                <div className="font-mono text-sm space-y-3">
                  <div className="text-muted-foreground">
                    <span className="text-green-500">➜</span>
                    <span className="text-blue-500"> ~</span>
                    <span className="text-foreground"> ls -la projects/</span>
                  </div>
                  <div className="text-muted-foreground">
                    total {projects.length}
                  </div>

                  <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl sm:text-5xl font-bold text-foreground pt-6"
                  >
                    <span className="text-purple-500">const</span>{' '}
                    <span className="text-yellow-500">projects</span>{' '}
                    <span className="text-muted-foreground">=</span>{' '}
                    <span className="text-foreground">[</span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-muted-foreground text-lg max-w-2xl pt-4 font-sans"
                  >
                    {'// 精选个人项目与开源贡献，展示技术实力与创新思维'}
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Projects Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-muted-foreground">加载中...</div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </motion.div>
          )}

          {/* Footer Code */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 font-mono text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <span className="text-foreground">]</span>
              <span className="text-muted-foreground">;</span>
              <span className="text-green-500 ml-4">➜</span>
              <span className="text-blue-500"> ~</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-2 h-5 bg-purple-500"
              />
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
