import type { Project, Templates, ProjectGroup } from '@/types'
import { useUiStore } from '@/stores/ui-store'
import { ProjectCard } from './ProjectCard'

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
            <CompletedCard key={project.id} project={project} templates={templates} groups={groups} />
          ))}
        </div>
      )}
    </section>
  )
}

function CompletedCard({ project, templates, groups }: { project: Project; templates: Templates; groups: ProjectGroup[] }) {
  return (
    <div className="opacity-70 hover:opacity-85 transition-opacity">
      <ProjectCard project={project} templates={templates} groups={groups} />
    </div>
  )
}
