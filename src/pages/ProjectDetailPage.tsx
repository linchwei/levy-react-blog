import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExternalLink, Github, ArrowLeft, Users, Clock, Star, GitFork } from 'lucide-react'
import { Navigation } from '@/components/home/Navigation'
import { Footer } from '@/components/home/Footer'
import { ArchitectureDiagram } from '@/components/projects/ArchitectureDiagram'
import { MetricCard } from '@/components/projects/MetricCard'
import { ChallengeCard } from '@/components/projects/ChallengeCard'
import type { ProjectDetail } from '@/types/project'

const categoryLabels: Record<string, string> = {
  frontend: '前端',
  backend: '后端',
  devops: 'DevOps',
  ai: 'AI/ML',
  engineering: '工程化',
}

const categoryColors: Record<string, string> = {
  frontend: 'bg-blue-500/20 text-blue-500',
  backend: 'bg-green-500/20 text-green-500',
  devops: 'bg-orange-500/20 text-orange-500',
  ai: 'bg-purple-500/20 text-purple-500',
  engineering: 'bg-pink-500/20 text-pink-500',
}

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/'
    fetch(`${baseUrl}projects.json`)
      .then((res) => res.json())
      .then((data: ProjectDetail[]) => {
        const found = data.find((p) => p.slug === slug)
        setProject(found || null)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to load project:', error)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">项目未找到</h1>
          <Link to="/projects" className="text-purple-500 hover:text-purple-600">
            返回项目列表
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Back Link */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回项目列表
            </Link>
          </motion.div>

          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="aspect-video rounded-2xl overflow-hidden">
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  查看 Demo
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  查看源码
                </a>
              )}
            </div>

            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {project.title}
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl">{project.summary}</p>
            </div>

            {/* Project Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>团队规模: {project.teamSize} 人</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>项目周期: {project.duration}</span>
              </div>
              {project.stars !== undefined && (
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{project.stars} stars</span>
                </div>
              )}
              {project.forks !== undefined && (
                <div className="flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-blue-500" />
                  <span>{project.forks} forks</span>
                </div>
              )}
            </div>

            {/* My Role */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">我的角色</h3>
              <p className="text-lg text-foreground">{project.myRole}</p>
            </div>
          </motion.section>

          {/* Description */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">项目介绍</h2>
            <p className="text-muted-foreground leading-relaxed">{project.description}</p>
          </motion.section>

          {/* Tech Stack */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">技术栈</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.techStack.map((stack) => (
                <div key={stack.category} className="bg-card rounded-xl p-6 border border-border">
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-sm mb-4 ${categoryColors[stack.category]}`}
                  >
                    {categoryLabels[stack.category]}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stack.items.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 bg-muted dark:bg-slate-800 rounded-lg text-sm text-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Metrics Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">量化成果</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {project.metrics.map((metric) => (
                <MetricCard key={metric.label} {...metric} />
              ))}
            </div>
          </motion.section>

          {/* Architecture Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">技术架构</h2>
            <ArchitectureDiagram diagram={project.architecture.diagram} />
            <p className="mt-4 text-muted-foreground">{project.architecture.description}</p>
          </motion.section>

          {/* Contributions Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">我的贡献</h2>
            <div className="bg-card rounded-xl p-6 border border-border">
              <ul className="space-y-3">
                {project.contributions.map((contribution, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center text-sm">
                      {index + 1}
                    </span>
                    <span className="text-muted-foreground">{contribution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Challenges Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">技术难点突破</h2>
            <div className="space-y-6">
              {project.challenges.map((challenge, index) => (
                <ChallengeCard key={challenge.title} challenge={challenge} index={index} />
              ))}
            </div>
          </motion.section>

          {/* Gallery Section */}
          {project.gallery.length > 1 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">项目截图</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.gallery.slice(1).map((image, index) => (
                  <div key={index} className="rounded-xl overflow-hidden">
                    <img
                      src={image}
                      alt={`${project.title} - ${index + 2}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
