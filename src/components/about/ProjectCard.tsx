import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Github, Star, GitFork } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  tags: string[]
  github?: string
  demo?: string
  stats: {
    stars: number
    forks: number
  }
  highlights: string[]
}

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-card/50 to-card border-border/50 hover:border-primary/50 transition-all duration-300 group">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-64 md:h-auto overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex gap-4 text-white/90 text-sm">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {project.stats.stars.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="w-4 h-4" />
                  {project.stats.forks.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-6 flex flex-col">
            <div className="flex flex-wrap gap-2 mb-3">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>

            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {project.description}
            </p>

            <p className="text-sm text-muted-foreground/80 mb-4 flex-grow">
              {project.longDescription}
            </p>

            {/* Highlights */}
            <div className="space-y-2 mb-4">
              {project.highlights.map((highlight, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{highlight}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              {project.github && (
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    源码
                  </a>
                </Button>
              )}
              {project.demo && (
                <Button size="sm" className="flex-1" asChild>
                  <a href={project.demo} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    演示
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  )
}
