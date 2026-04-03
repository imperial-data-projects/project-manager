// Phase template definition
export interface PhaseTemplate {
  id: string
  label: string
  stakeholderLabel: string
  order: number
  description: string
  effortRange: string
  waitType: 'scheduling' | 'approval' | 'feedback' | null
}

// Lifecycle definition
export interface Lifecycle {
  label: string
  phases: PhaseTemplate[]
}

// Vendsys default task template
export interface VendsysTaskTemplate {
  name: string
  effortRange: string
  description: string
}

// Vendsys lifecycle
export interface VendsysLifecycle {
  label: string
  defaultTasks: VendsysTaskTemplate[]
}

// Domain definition
export interface Domain {
  label: string
  color: DomainColor
}

export type DomainColor = 'ocean' | 'indigo' | 'amethyst' | 'rose' | 'umber' | 'slate'

export type DomainId = 'operations' | 'customer-svc' | 'merchandising' | 'logistics' | 'accounting' | 'executive'

// Templates root
export interface Templates {
  lifecycles: {
    application: Lifecycle
    powerbi: Lifecycle
    vendsys: VendsysLifecycle
  }
  domains: Record<DomainId, Domain>
}

// Status chip on a project
export interface StatusChip {
  type: 'awaiting' | 'blocked' | 'not-started'
  label: string
  reason?: string
}

// Task (with optional subtasks)
export interface Task {
  id: string
  name: string
  phase?: string
  status: 'complete' | 'in-progress' | 'pending' | 'blocked'
  effortRange?: string
  subtasks?: Subtask[]
}

export interface Subtask {
  id: string
  name: string
  status: 'complete' | 'in-progress' | 'pending' | 'blocked'
}

export type PhaseStatus = 'complete' | 'in-progress' | 'pending' | 'skipped'

export type ProjectCategory = 'application' | 'powerbi' | 'vendsys'

// Project
export interface Project {
  id: string
  name: string
  category: ProjectCategory
  domain: DomainId
  parent: string | null
  stakeholder: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  deadline: string | null
  status: 'active' | 'complete'
  completedDate?: string
  currentPhase?: string | null
  statusChip?: StatusChip
  phases?: Record<string, PhaseStatus>
  tasks: Task[]
  updated: string
  notes: string
}

// Project group (e.g., IDS platform, Vendsys Transition)
export interface ProjectGroup {
  id: string
  name: string
  category: ProjectCategory
}

// Projects root
export interface ProjectsData {
  projects: Project[]
  groups: ProjectGroup[]
}
