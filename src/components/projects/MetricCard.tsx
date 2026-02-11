import CountUp from 'react-countup'
import type { MetricCardProps } from '@/types/project'

export function MetricCard({ label, value, before, after, unit, className }: MetricCardProps) {
  const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0
  const hasImprovement = before && after

  return (
    <div className={`bg-card rounded-xl p-6 border border-border ${className || ''}`}>
      <p className="text-muted-foreground text-sm mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-foreground">
          <CountUp end={numericValue} duration={2} />
          {value.replace(/[0-9]/g, '')}
        </span>
        {unit && <span className="text-muted-foreground text-sm">{unit}</span>}
      </div>

      {hasImprovement && (
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Before: {before}</span>
          <span className="text-green-500">→</span>
          <span className="text-green-500 font-medium">After: {after}</span>
        </div>
      )}
    </div>
  )
}
