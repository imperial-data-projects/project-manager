import type { Project, Task, Templates, PhaseTemplate, Lifecycle } from '@/types'

function getLifecycle(project: Project, templates: Templates): Lifecycle {
  if (project.category === 'auto-report') return templates.lifecycles['auto-report']
  if (project.category === 'powerbi') return templates.lifecycles.powerbi
  return templates.lifecycles.application
}

/** Count completed phases for a lifecycle project */
export function getPhaseProgress(project: Project, templates: Templates) {
  if (!project.phases) return { completed: 0, total: 0 }
  const lifecycle = getLifecycle(project, templates)
  const total = lifecycle.phases.length
  const completed = lifecycle.phases.filter(p => project.phases?.[p.id] === 'complete').length
  return { completed, total }
}

/** Count completed tasks */
export function getTaskProgress(tasks: Task[]) {
  const total = tasks.length
  const completed = tasks.filter(t => t.status === 'complete').length
  return { completed, total }
}

/** Get current phase template for a lifecycle project */
export function getCurrentPhaseTemplate(project: Project, templates: Templates): PhaseTemplate | null {
  if (!project.currentPhase || !project.phases) return null
  const lifecycle = getLifecycle(project, templates)
  return lifecycle.phases.find(p => p.id === project.currentPhase) ?? null
}

/** Get tasks for the current phase */
export function getCurrentPhaseTasks(project: Project): Task[] {
  if (!project.currentPhase) return []
  return project.tasks.filter(t => t.phase === project.currentPhase)
}

/** Get the stakeholder label for a phase id */
export function getPhaseLabel(phaseId: string, project: Project, templates: Templates): string {
  const lifecycle = getLifecycle(project, templates)
  const phase = lifecycle.phases.find(p => p.id === phaseId)
  return phase?.stakeholderLabel ?? phaseId
}

/** Get all phases for a lifecycle project */
export function getPhases(project: Project, templates: Templates): PhaseTemplate[] {
  if (project.category === 'vendsys') return []
  const lifecycle = getLifecycle(project, templates)
  return lifecycle.phases
}

/** Format a deadline for display */
export function formatDeadline(deadline: string | null): string | null {
  if (!deadline) return null
  // Handle quarter format like "2026-Q3"
  if (deadline.includes('Q')) return deadline.replace('-', ' ')
  // Handle month format like "2026-04"
  const [year, month] = deadline.split('-')
  if (!month || !year) return deadline
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthIdx = parseInt(month, 10) - 1
  const name = monthNames[monthIdx]
  return name ? `${name} ${year}` : deadline
}

/** Format an updated date for display */
export function formatUpdated(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  if (!year || !month || !day) return dateStr
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const name = monthNames[month - 1]
  return `${name} ${day}`
}

/** Get the group name for a project */
export function getGroupName(project: Project, groups: { id: string; name: string }[]): string | null {
  if (!project.parent) return null
  const group = groups.find(g => g.id === project.parent)
  return group?.name ?? null
}

/** Sort projects by deadline ascending (null/no deadline last) */
export function sortByDeadline(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    if (!a.deadline && !b.deadline) return 0
    if (!a.deadline) return 1
    if (!b.deadline) return -1
    return a.deadline.localeCompare(b.deadline)
  })
}
