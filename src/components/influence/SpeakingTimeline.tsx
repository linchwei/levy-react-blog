import { Mic, Users, Calendar } from 'lucide-react'

interface SpeakingEvent {
  date: string
  title: string
  event: string
  type: '演讲' | '分享' | '工作坊'
  audience?: number
  description?: string
}

const speakingEvents: SpeakingEvent[] = [
  {
    date: '2024-03-15',
    title: 'React 19 新特性解析',
    event: '前端技术沙龙',
    type: '演讲',
    audience: 120,
    description: '深入讲解 React 19 的并发特性、Server Components 等新功能',
  },
  {
    date: '2024-01-20',
    title: '前端性能优化最佳实践',
    event: '技术分享会',
    type: '分享',
    audience: 80,
    description: '分享实际项目中的性能优化经验和工具使用',
  },
  {
    date: '2023-11-10',
    title: 'TypeScript 高级类型体操',
    event: '开发者大会',
    type: '工作坊',
    audience: 50,
    description: '通过实际案例学习 TypeScript 高级类型系统',
  },
]

function TimelineItem({ event, index }: { event: SpeakingEvent; index: number }) {
  const typeColors: Record<string, string> = {
    '演讲': 'bg-purple-500/10 text-purple-500',
    '分享': 'bg-blue-500/10 text-blue-500',
    '工作坊': 'bg-green-500/10 text-green-500',
  }

  return (
    <div className="relative flex gap-6 pb-8 last:pb-0">
      {/* Timeline line */}
      {index < speakingEvents.length - 1 && (
        <div className="absolute left-5 top-10 bottom-0 w-px bg-border" />
      )}
      
      {/* Icon */}
      <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center">
        <Mic className="w-5 h-5 text-purple-500" />
      </div>
      
      {/* Content */}
      <div className="flex-1 bg-card rounded-xl p-5 border border-border">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[event.type]}`}>
            {event.type}
          </span>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {event.date}
          </span>
          {event.audience && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {event.audience} 人
            </span>
          )}
        </div>
        
        <h4 className="font-semibold text-foreground mb-1">{event.title}</h4>
        <p className="text-sm text-muted-foreground mb-2">{event.event}</p>
        {event.description && (
          <p className="text-sm text-muted-foreground">{event.description}</p>
        )}
      </div>
    </div>
  )
}

export function SpeakingTimeline() {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-6">技术演讲 & 分享</h3>
      <div className="space-y-0">
        {speakingEvents.map((event, index) => (
          <TimelineItem key={index} event={event} index={index} />
        ))}
      </div>
    </div>
  )
}
