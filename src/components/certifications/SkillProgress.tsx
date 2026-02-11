import { useState } from 'react'
import { BookOpen, Check } from 'lucide-react'
import { skillProgress, categoryColors, categoryLabels, type SkillProgress as SkillProgressType } from './certificationData'

export function SkillProgressList() {
  const [filter, setFilter] = useState<string>('all')

  const categories = ['all', ...new Set(skillProgress.map((s) => s.category))]

  const filteredSkills = filter === 'all'
    ? skillProgress
    : skillProgress.filter((s) => s.category === filter)

  // Group by category
  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, SkillProgressType[]>)

  return (
    <div>
      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === cat
                ? 'bg-purple-500 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat === 'all' ? '全部' : categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Skills by category */}
      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, skills]) => (
          <div key={category}>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${categoryColors[category]}`} />
              {categoryLabels[category]}
            </h4>
            <div className="space-y-3">
              {skills.map((skill) => (
                <SkillBar key={skill.name} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SkillBar({ skill }: { skill: SkillProgressType }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{skill.name}</span>
          {skill.learning && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded-full text-xs">
              <BookOpen className="w-3 h-3" />
              学习中
            </span>
          )}
          {!skill.learning && skill.level >= 80 && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full text-xs">
              <Check className="w-3 h-3" />
              精通
            </span>
          )}
        </div>
        <span className="text-sm text-muted-foreground">{skill.level}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            skill.learning
              ? 'bg-blue-500'
              : skill.level >= 80
              ? 'bg-green-500'
              : skill.level >= 60
              ? 'bg-yellow-500'
              : 'bg-gray-400'
          }`}
          style={{ width: `${skill.level}%` }}
        />
      </div>
    </div>
  )
}
