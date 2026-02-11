import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Brain,
  Github,
  Code,
  Award,
  Layout,
  Rocket,
  GraduationCap,
  University,
  Briefcase,
  School,
  Code2,
  type LucideIcon,
} from 'lucide-react'

interface TimelineEvent {
  id: string
  date: string
  title: string
  company?: string
  location?: string
  description: string
  highlights: string[]
  type: 'work' | 'project' | 'award' | 'education'
  icon: string
}

interface TimelineProps {
  events: TimelineEvent[]
}

const iconMap: Record<string, LucideIcon> = {
  brain: Brain,
  github: Github,
  code: Code,
  award: Award,
  layout: Layout,
  rocket: Rocket,
  graduation: GraduationCap,
  university: University,
  briefcase: Briefcase,
  school: School,
  'code-2': Code2,
}

const typeLabels: Record<string, string> = {
  work: '工作经历',
  project: '项目成果',
  award: '荣誉奖项',
  education: '教育经历',
}

const typeColors: Record<string, string> = {
  work: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  project: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  award: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  education: 'bg-green-500/10 text-green-500 border-green-500/20',
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />

      <div className="space-y-8">
        {events.map((event, index) => {
          const Icon = iconMap[event.icon] || Code
          const isEven = index % 2 === 0

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row gap-4 md:gap-8 ${
                isEven ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-1/2 w-3 h-3 -translate-x-1/2 rounded-full bg-primary border-4 border-background z-10" />

              {/* Date - Mobile */}
              <div className="md:hidden pl-10 text-sm text-muted-foreground">
                {new Date(event.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'short',
                })}
              </div>

              {/* Content */}
              <div className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'} pl-10 md:pl-0`}>
                {/* Date - Desktop */}
                <div
                  className={`hidden md:block text-sm text-muted-foreground mb-2 ${
                    isEven ? 'md:text-right' : 'md:text-left'
                  }`}
                >
                  {new Date(event.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </div>

                <Card
                  className={`overflow-hidden bg-gradient-to-br from-card/50 to-card border-border/50 hover:border-primary/30 transition-all duration-300 ${
                    isEven ? 'md:ml-auto' : 'md:mr-auto'
                  }`}
                >
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className={`flex items-start gap-3 mb-3 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColors[event.type]}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className={`flex-1 ${isEven ? 'md:text-right' : ''}`}>
                        <Badge
                          variant="outline"
                          className={`text-xs mb-2 ${typeColors[event.type]}`}
                        >
                          {typeLabels[event.type]}
                        </Badge>
                        <h3 className="font-bold text-lg">{event.title}</h3>
                        {event.company && (
                          <p className="text-sm text-muted-foreground">
                            {event.company}
                            {event.location && ` · ${event.location}`}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Highlights */}
                    <div className={`space-y-1.5 ${isEven ? 'md:text-right' : ''}`}>
                      {event.highlights.map((highlight, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 text-sm ${
                            isEven ? 'md:flex-row-reverse md:justify-end' : ''
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block flex-1" />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
