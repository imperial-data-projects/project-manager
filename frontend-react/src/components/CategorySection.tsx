import type { Project, Templates, ProjectGroup } from '@/types'
import { sortByDeadline } from '@/lib/progress'
import { ProjectCard } from './ProjectCard'

interface CategorySectionProps {
  title: string
  projects: Project[]
  templates: Templates
  groups: ProjectGroup[]
}

export function CategorySection({ title, projects, templates, groups }: CategorySectionProps) {
  const sorted = sortByDeadline(projects)
  const countLabel = title === 'Vendsys Transition'
    ? `${sorted.length} branches`
    : `${sorted.length} projects`

  return (
    <section className="mb-10">
      <div className="mb-4 flex items-baseline gap-3 border-b border-border pb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <span className="text-sm text-muted-foreground">{countLabel}</span>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 min-[1800px]:grid-cols-4">
        {sorted.map((project) => (
          <ProjectCard key={project.id} project={project} templates={templates} groups={groups} />
        ))}
      </div>
    </section>
  )
}
