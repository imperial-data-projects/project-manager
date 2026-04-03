import projectsData from '../../data/projects.json'
import templatesData from '../../data/templates.json'
import type { ProjectsData, Templates } from '@/types'
import { SummarySection } from '@/components/SummarySection'
import { CategorySection } from '@/components/CategorySection'
import { CompletedSection } from '@/components/CompletedSection'
import { ThemeToggle } from '@/components/ThemeToggle'

const projects = projectsData as unknown as ProjectsData
const templates = templatesData as unknown as Templates

const active = projects.projects.filter((p) => p.status === 'active')
const completed = projects.projects.filter((p) => p.status === 'complete')

const applications = active.filter((p) => p.category === 'application')
const powerbi = active.filter((p) => p.category === 'powerbi')
const vendsys = active.filter((p) => p.category === 'vendsys')

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeToggle />
      <div className="mx-auto max-w-[1200px] px-6 py-8">
        <header className="mb-8">
          <h1 className="text-[28px] font-semibold tracking-tight">Project Portfolio</h1>
          <p className="text-[15px] text-muted-foreground">Data & Development Team</p>
        </header>

        <SummarySection projects={projects.projects} templates={templates} />

        {applications.length > 0 && (
          <CategorySection
            title="Applications"
            projects={applications}
            templates={templates}
            groups={projects.groups}
          />
        )}

        {powerbi.length > 0 && (
          <CategorySection
            title="Power BI Dashboards"
            projects={powerbi}
            templates={templates}
            groups={projects.groups}
          />
        )}

        {vendsys.length > 0 && (
          <CategorySection
            title="Vendsys Transition"
            projects={vendsys}
            templates={templates}
            groups={projects.groups}
          />
        )}

        <CompletedSection
          projects={completed}
          templates={templates}
          groups={projects.groups}
        />
      </div>
    </div>
  )
}
