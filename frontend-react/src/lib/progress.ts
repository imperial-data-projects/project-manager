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
  if (deadline.includes('Q')) return deadline.replace('-', ' ')
  const parts = deadline.split('-')
  if (parts.length === 3) {
    const [year, month, day] = parts
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const name = monthNames[parseInt(month!, 10) - 1]
    return name ? `${name} ${parseInt(day!, 10)}, ${year}` : deadline
  }
  const [year, month] = parts
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
    const aDate = a.transitionDate ?? a.deadline
    const bDate = b.transitionDate ?? b.deadline
    if (!aDate && !bDate) return 0
    if (!aDate) return 1
    if (!bDate) return -1
    return aDate.localeCompare(bDate)
  })
}

// --- Vendsys helpers ---

/** Get workstream progress summary for a vendsys branch */
export function getVendsysWorkstreamProgress(project: Project, templates: Templates) {
  if (!project.workstreams) return { clean: 0, total: 0 }
  const wsTemplates = templates.lifecycles.vendsys.workstreams
  const total = wsTemplates.length
  const clean = wsTemplates.filter(ws => {
    const data = project.workstreams![ws.id]
    return data?.status === 'clean'
  }).length
  return { clean, total }
}

/** Get lockdown progress for a vendsys branch */
export function getVendsysLockdownProgress(project: Project, templates: Templates) {
  if (!project.lockdown) return { completed: 0, total: 0 }
  const milestones = templates.lifecycles.vendsys.lockdown
  const total = milestones.length
  const completed = milestones.filter(m => project.lockdown![m.id] === 'complete').length
  return { completed, total }
}

/** Compute lockdown milestone dates from transition date */
export function getLockdownDates(transitionDate: string, templates: Templates): Record<string, string> {
  const base = new Date(transitionDate + 'T00:00:00')
  const dates: Record<string, string> = {}
  for (const milestone of templates.lifecycles.vendsys.lockdown) {
    const d = new Date(base)
    d.setDate(d.getDate() + milestone.offset)
    dates[milestone.id] = d.toISOString().slice(0, 10)
  }
  return dates
}

/** Format a date string as "Mon DD" */
export function formatShortDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  if (!year || !month || !day) return dateStr
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${monthNames[month - 1]} ${day}`
}

/** Count how many workstream tasks are in "their court" */
export function getTheirCourtCount(project: Project, templates: Templates): number {
  if (!project.workstreams) return 0
  let count = 0
  for (const ws of templates.lifecycles.vendsys.workstreams) {
    const data = project.workstreams[ws.id]
    if (!data?.tasks) continue
    for (const task of ws.tasks) {
      if (data.tasks[task.id] === 'submitted') count++
    }
  }
  return count
}

/** Count how many workstream tasks are in "my court" */
export function getMyCourtCount(project: Project, templates: Templates): number {
  if (!project.workstreams) return 0
  let count = 0
  for (const ws of templates.lifecycles.vendsys.workstreams) {
    const data = project.workstreams[ws.id]
    if (!data?.tasks) continue
    for (const task of ws.tasks) {
      const s = data.tasks[task.id]
      if (s === 'preparing' || s === 'verifying') count++
    }
  }
  return count
}

/** Check if all workstreams are clean (ready for lockdown) */
export function isReadyForLockdown(project: Project, templates: Templates): boolean {
  if (!project.workstreams) return false
  return templates.lifecycles.vendsys.workstreams.every(ws => {
    const data = project.workstreams![ws.id]
    return data?.status === 'clean'
  })
}
