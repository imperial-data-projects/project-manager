import type { DomainId, Templates } from '@/types'

const domainBg: Record<string, string> = {
  ocean: 'bg-domain-ocean',
  indigo: 'bg-domain-indigo',
  amethyst: 'bg-domain-amethyst',
  rose: 'bg-domain-rose',
  umber: 'bg-domain-umber',
  slate: 'bg-domain-slate',
}

interface ProgressBarProps {
  completed: number
  total: number
  domainId: DomainId
  templates: Templates
  isComplete?: boolean
}

export function ProgressBar({ completed, total, domainId, templates, isComplete }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  const domain = templates.domains[domainId]
  const bgClass = isComplete ? 'bg-success-base' : (domainBg[domain.color] ?? 'bg-muted-foreground')

  return (
    <div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${bgClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[13px] text-muted-foreground">
        <span>{completed} of {total} tasks</span>
        <span>{pct}%</span>
      </div>
    </div>
  )
}
