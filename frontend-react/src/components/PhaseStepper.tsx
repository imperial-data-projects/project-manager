import type { Project, Templates, PhaseStatus } from '@/types'
import { getPhases } from '@/lib/progress'

const domainBg: Record<string, string> = {
  ocean: 'bg-domain-ocean',
  indigo: 'bg-domain-indigo',
  amethyst: 'bg-domain-amethyst',
  rose: 'bg-domain-rose',
  umber: 'bg-domain-umber',
  slate: 'bg-domain-slate',
}

export function PhaseStepper({ project, templates }: { project: Project; templates: Templates }) {
  const phases = getPhases(project, templates)
  const domain = templates.domains[project.domain]
  const bgClass = domainBg[domain.color] ?? 'bg-muted-foreground'

  return (
    <div className="flex items-center gap-1">
      {phases.map((phase) => {
        const status: PhaseStatus = project.phases?.[phase.id] ?? 'pending'
        let className = 'h-1.5 flex-1 rounded-full '
        if (status === 'complete') {
          className += bgClass
        } else if (status === 'in-progress') {
          className += bgClass + ' opacity-50'
        } else {
          className += 'bg-muted'
        }
        return <div key={phase.id} className={className} />
      })}
    </div>
  )
}

/** Expanded detail view with phase labels and icons */
export function PhaseStepperDetail({ project, templates }: { project: Project; templates: Templates }) {
  const phases = getPhases(project, templates)

  return (
    <div className="flex flex-col gap-2">
      {phases.map((phase) => {
        const status: PhaseStatus = project.phases?.[phase.id] ?? 'pending'
        return (
          <div key={phase.id} className="flex items-center gap-3 text-sm">
            <PhaseIcon status={status} />
            <span className={status === 'pending' ? 'text-muted-foreground' : status === 'in-progress' ? 'font-semibold' : ''}>
              {phase.stakeholderLabel}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function PhaseIcon({ status }: { status: PhaseStatus }) {
  const base = 'flex size-5.5 items-center justify-center rounded-full text-[11px] flex-shrink-0'
  if (status === 'complete') {
    return <div className={`${base} bg-success-bg text-success-base`}>&#10003;</div>
  }
  if (status === 'in-progress') {
    return <div className={`${base} bg-info-bg text-info-base`}>&#9679;</div>
  }
  return <div className={`${base} bg-muted text-muted-foreground`}>&#8226;</div>
}
