import type { Project, Templates, ProjectGroup } from '@/types'
import { useUiStore } from '@/stores/ui-store'
import { formatUpdated, getGroupName } from '@/lib/progress'
import { DomainBadge } from './DomainBadge'
import { ProjectCard } from './ProjectCard'

const accentBorder: Record<string, string> = {
  ocean: 'bg-domain-ocean',
  indigo: 'bg-domain-indigo',
  amethyst: 'bg-domain-amethyst',
  rose: 'bg-domain-rose',
  umber: 'bg-domain-umber',
  slate: 'bg-domain-slate',
}

interface CompletedSectionProps {
  projects: Project[]
  templates: Templates
  groups: ProjectGroup[]
}

export function CompletedSection({ projects, templates, groups }: CompletedSectionProps) {
  const showCompleted = useUiStore((s) => s.showCompleted)
  const toggleCompleted = useUiStore((s) => s.toggleCompleted)

  if (projects.length === 0) return null

  return (
    <section className="mt-12 border-t border-border pt-6">
      <button
        className="flex items-center gap-2.5 text-[15px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        onClick={toggleCompleted}
      >
        <span
          className="inline-block text-xs transition-transform duration-200"
          style={{ transform: showCompleted ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          &#9654;
        </span>
        Completed Projects
        <span className="rounded-full bg-success-bg px-2 py-0.5 text-xs font-semibold text-success-text">
          {projects.length}
        </span>
      </button>

      {showCompleted && (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 min-[1800px]:grid-cols-4">
          {projects.map((project) => (
            <div key={project.id} className="opacity-70 hover:opacity-85 transition-opacity">
              {project.category === 'vendsys' ? (
                <CompletedVendsysCard project={project} templates={templates} groups={groups} />
              ) : (
                <ProjectCard project={project} templates={templates} groups={groups} />
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function CompletedVendsysCard({
  project, templates, groups,
}: {
  project: Project
  templates: Templates
  groups: ProjectGroup[]
}) {
  const domain = templates.domains[project.domain]
  const accent = accentBorder[domain.color] ?? 'bg-muted-foreground'
  const groupName = getGroupName(project, groups)

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className={`h-[3px] w-full ${accent}`} />
      <div className="px-5 py-4">
        <div className="mb-1 flex items-start justify-between gap-3">
          <span className="text-base font-semibold">{project.name}</span>
          <DomainBadge domainId={project.domain} templates={templates} />
        </div>
        <div className="mb-3 text-[13px] text-muted-foreground">
          {groupName ?? 'Vendsys Transition'}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-2.5 py-0.5 text-[11px] font-semibold text-success-text">
            <span className="size-1.5 rounded-full bg-success-base" />
            Transitioned
          </span>
          {project.completedDate && <span>{formatUpdated(project.completedDate)}</span>}
        </div>
      </div>
    </div>
  )
}
