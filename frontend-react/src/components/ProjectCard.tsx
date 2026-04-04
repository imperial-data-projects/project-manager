import type { Project, Templates, ProjectGroup } from '@/types'
import { getPhaseProgress, getCurrentPhaseTasks, formatDeadline, formatUpdated, getGroupName, getPhaseLabel } from '@/lib/progress'
import { useUiStore } from '@/stores/ui-store'
import { DomainBadge } from './DomainBadge'
import { StatusChip } from './StatusChip'
import { PhaseStepper, PhaseStepperDetail } from './PhaseStepper'

const accentBorder: Record<string, string> = {
  ocean: 'bg-domain-ocean',
  indigo: 'bg-domain-indigo',
  amethyst: 'bg-domain-amethyst',
  rose: 'bg-domain-rose',
  umber: 'bg-domain-umber',
  slate: 'bg-domain-slate',
}

interface ProjectCardProps {
  project: Project
  templates: Templates
  groups: ProjectGroup[]
}

export function ProjectCard({ project, templates, groups }: ProjectCardProps) {
  const expanded = useUiStore((s) => s.expandedProject === project.id)
  const toggle = useUiStore((s) => s.toggleProject)
  const domain = templates.domains[project.domain]
  const accent = accentBorder[domain.color] ?? 'bg-muted-foreground'
  const groupName = getGroupName(project, groups)
  const deadline = formatDeadline(project.deadline)

  const categoryLabel = project.category === 'powerbi'
    ? 'Standalone Dashboard'
    : project.category === 'auto-report'
      ? 'Auto Generated Report'
      : 'Standalone Application'

  const subtitle = [
    groupName ?? categoryLabel,
    deadline ? `Target: ${deadline}` : null,
  ].filter(Boolean).join(' \u00B7 ')

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-muted-foreground"
      onClick={() => toggle(project.id)}
    >
      <div className={`h-[3px] w-full ${accent}`} />
      <div className="px-5 py-4">
        <div className="mb-1 flex items-start justify-between gap-3">
          <span className="text-base font-semibold">{project.name}</span>
          <DomainBadge domainId={project.domain} templates={templates} />
        </div>
        <div className="mb-3.5 text-[13px] text-muted-foreground">{subtitle}</div>

        <LifecycleProgress project={project} templates={templates} />

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {project.statusChip ? (
              <StatusChip chip={project.statusChip} />
            ) : (
              <CardTaskSummary project={project} />
            )}
          </span>
          {project.updated && <span>Updated {formatUpdated(project.updated)}</span>}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border px-5 py-4">
          <PhaseStepperDetail project={project} templates={templates} />
        </div>
      )}
    </div>
  )
}

function LifecycleProgress({ project, templates }: { project: Project; templates: Templates }) {
  const { completed, total } = getPhaseProgress(project, templates)
  const currentLabel = project.currentPhase
    ? getPhaseLabel(project.currentPhase, project, templates)
    : null

  return (
    <>
      <PhaseStepper project={project} templates={templates} />
      <div className="mt-1.5 flex items-center justify-between">
        <span className={`text-sm font-medium ${!currentLabel ? 'text-muted-foreground' : ''}`}>
          {currentLabel ?? 'Not yet started'}
        </span>
        <span className="text-[13px] text-muted-foreground">
          Phase {completed} of {total}
        </span>
      </div>
    </>
  )
}

function CardTaskSummary({ project }: { project: Project }) {
  const phaseTasks = getCurrentPhaseTasks(project)
  if (phaseTasks.length === 0) return null
  const done = phaseTasks.filter((t) => t.status === 'complete').length
  return <span className="text-[13px]">{done} of {phaseTasks.length} tasks in phase</span>
}
