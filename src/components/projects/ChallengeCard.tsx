import { Lightbulb, Wrench } from 'lucide-react'
import type { ChallengeCardProps } from '@/types/project'

export function ChallengeCard({ challenge, index, className }: ChallengeCardProps) {
  return (
    <div className={`bg-card rounded-xl p-6 border border-border ${className || ''}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
          <span className="text-purple-500 font-bold">{index + 1}</span>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-foreground mb-2">
              {challenge.title}
            </h4>
            <p className="text-muted-foreground flex items-start gap-2">
              <Lightbulb className="w-4 h-4 mt-1 flex-shrink-0" />
              {challenge.description}
            </p>
          </div>

          <div className="bg-muted/50 dark:bg-slate-900/50 rounded-lg p-4">
            <p className="text-sm flex items-start gap-2">
              <Wrench className="w-4 h-4 mt-1 text-blue-500 flex-shrink-0" />
              <span>
                <span className="text-blue-500 font-medium">解决方案：</span>
                <span className="text-foreground">{challenge.solution}</span>
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {challenge.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
