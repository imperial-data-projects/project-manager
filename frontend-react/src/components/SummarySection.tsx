import type { Project, Templates } from '@/types'
import { StatusChip } from './StatusChip'

interface SummarySectionProps {
  projects: Project[]
  templates: Templates
}

export function SummarySection({ projects }: SummarySectionProps) {
  const active = projects.filter((p) => p.status === 'active')
  const inProgress = active.filter((p) => !p.statusChip && p.currentPhase !== null)
  const completed = projects.filter((p) => p.status === 'complete')

  // Attention items: projects with a statusChip (awaiting, blocked, not-started excluded)
  const attentionItems = active.filter(
    (p) => p.statusChip && p.statusChip.type !== 'not-started'
  )

  return (
    <div className="mb-10">
      {/* Stat cards */}
      <div className="mb-4 grid grid-cols-4 gap-4 max-md:grid-cols-2">
        <StatCard value={active.length} label="Active Projects" variant="active" />
        <StatCard value={inProgress.length} label="In Progress" variant="progress" />
        <StatCard value={attentionItems.length} label="Awaiting Action" variant="attention" />
        <StatCard value={completed.length} label="Completed, In Maintenance" variant="done" />
      </div>

      {/* Attention row */}
      {attentionItems.length > 0 && (
        <div className="rounded-xl border border-border bg-card px-6 py-4">
          <div className="flex flex-col gap-2.5">
            {attentionItems.map((p) => (
              <div key={p.id} className="flex items-center gap-2.5 text-sm font-medium">
                <span>{p.name}</span>
                {p.statusChip && <StatusChip chip={p.statusChip} />}
                {p.statusChip?.reason && (
                  <span className="text-muted-foreground font-normal">{p.statusChip.reason}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

type Variant = 'active' | 'progress' | 'attention' | 'done'

const variantColors: Record<Variant, string> = {
  active: 'text-foreground',
  progress: 'text-info-base',
  attention: 'text-warning-base',
  done: 'text-success-base',
}

function StatCard({ value, label, variant }: { value: number; label: string; variant: Variant }) {
  return (
    <div className="rounded-xl border border-border bg-card px-6 py-5">
      <div className={`text-4xl font-bold leading-none tracking-tight ${variantColors[variant]}`}>
        {value}
      </div>
      <div className="mt-1 text-sm text-muted-foreground font-medium">{label}</div>
    </div>
  )
}
