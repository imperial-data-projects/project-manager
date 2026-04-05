import type { Project, Templates, ProjectGroup, HandoffStatus, LockdownStatus } from '@/types'
import {
  getLockdownDates, formatShortDate, getTheirCourtCount,
  isReadyForLockdown, hasVendsysProgress, deriveWorkstreamStatus,
  formatDeadline, formatUpdated, getGroupName,
} from '@/lib/progress'
import { useUiStore } from '@/stores/ui-store'
import { DomainBadge } from './DomainBadge'

const accentBorder: Record<string, string> = {
  ocean: 'bg-domain-ocean',
  indigo: 'bg-domain-indigo',
  amethyst: 'bg-domain-amethyst',
  rose: 'bg-domain-rose',
  umber: 'bg-domain-umber',
  slate: 'bg-domain-slate',
}

interface VendsysCardProps {
  project: Project
  templates: Templates
  groups: ProjectGroup[]
}

export function VendsysCard({ project, templates, groups }: VendsysCardProps) {
  const expanded = useUiStore((s) => s.expandedProject === project.id)
  const toggle = useUiStore((s) => s.toggleProject)
  const domain = templates.domains[project.domain]
  const accent = accentBorder[domain.color] ?? 'bg-muted-foreground'
  const groupName = getGroupName(project, groups)
  const transitionDate = project.transitionDate
  const wsTemplates = templates.lifecycles.vendsys.workstreams
  const lockdownTemplates = templates.lifecycles.vendsys.lockdown
  const lockdownDates = transitionDate ? getLockdownDates(transitionDate, templates) : null

  const theirCourt = getTheirCourtCount(project, templates)
  const readyForLockdown = isReadyForLockdown(project, templates)
  const anyProgress = hasVendsysProgress(project)

  const subtitle = [
    groupName ?? 'Vendsys Transition',
    transitionDate ? `Transition: ${formatDeadline(transitionDate)}` : null,
  ].filter(Boolean).join(' \u00B7 ')

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-muted-foreground"
      onClick={() => toggle(project.id)}
    >
      <div className={`h-[3px] w-full ${accent}`} />
      <div className="px-5 py-4">
        {/* Header */}
        <div className="mb-1 flex items-start justify-between gap-3">
          <span className="text-base font-semibold">{project.name}</span>
          <DomainBadge domainId={project.domain} templates={templates} />
        </div>
        <div className="mb-3.5 text-[13px] text-muted-foreground">{subtitle}</div>

        {/* Workstream bars */}
        <div className="flex flex-col gap-1.5">
          {wsTemplates.map((ws) => {
            const data = project.workstreams?.[ws.id]
            const status = ws.recurring
              ? (data?.lastAudit ? 'in-progress' : 'pending')
              : deriveWorkstreamStatus(data?.tasks)
            return (
              <WorkstreamBar
                key={ws.id}
                label={ws.label}
                status={status}
                taskCount={ws.tasks.length}
                completeCount={data?.tasks ? Object.values(data.tasks).filter(s => s === 'complete').length : 0}
                isRecurring={ws.recurring}
                lastAudit={data?.lastAudit}
              />
            )
          })}
        </div>

        {/* Court summary + lockdown readiness */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            {theirCourt > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-bg px-2.5 py-0.5 text-[11px] font-semibold text-warning-text">
                <span className="size-1.5 rounded-full bg-warning-base" />
                {theirCourt} with branch
              </span>
            )}
            {readyForLockdown && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-2.5 py-0.5 text-[11px] font-semibold text-success-text">
                <span className="size-1.5 rounded-full bg-success-base" />
                Ready for lockdown
              </span>
            )}
            {!anyProgress && !readyForLockdown && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                Not started
              </span>
            )}
          </div>
          {project.updated && (
            <span className="text-muted-foreground">Updated {formatUpdated(project.updated)}</span>
          )}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-border px-5 py-4">
          {/* Workstream detail */}
          <div className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
            Workstreams
          </div>
          <div className="flex flex-col gap-4">
            {wsTemplates.map((ws) => {
              const data = project.workstreams?.[ws.id]
              if (ws.recurring) {
                return (
                  <OnhandMonitoringDetail
                    key={ws.id}
                    label={ws.label}
                    data={data}
                  />
                )
              }
              return (
                <WorkstreamDetail
                  key={ws.id}
                  label={ws.label}
                  tasks={ws.tasks}
                  taskData={data?.tasks ?? {}}
                  status={deriveWorkstreamStatus(data?.tasks)}
                />
              )
            })}
          </div>

          {/* Lockdown timeline */}
          <div className="mt-5 mb-2 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
            Lockdown Sequence
          </div>
          <div className="flex flex-col gap-2">
            {lockdownTemplates.map((milestone) => (
              <LockdownMilestone
                key={milestone.id}
                label={milestone.label}
                date={lockdownDates?.[milestone.id] ?? null}
                status={project.lockdown?.[milestone.id] ?? 'pending'}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function WorkstreamBar({
  label, status, taskCount, completeCount, isRecurring, lastAudit,
}: {
  label: string
  status: string
  taskCount: number
  completeCount: number
  isRecurring?: boolean
  lastAudit?: string | null
}) {
  const pct = isRecurring
    ? (status === 'in-progress' ? 50 : 0)
    : (taskCount > 0 ? Math.round((completeCount / taskCount) * 100) : 0)

  let barClass = 'bg-muted-foreground'
  if (status === 'clean') barClass = 'bg-success-base'
  else if (status === 'in-progress') barClass = 'bg-info-base'

  return (
    <div className="flex items-center gap-3">
      <span className="w-20 text-[12px] text-muted-foreground truncate shrink-0">{label}</span>
      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] duration-300 ${barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-7 text-right text-[11px] text-muted-foreground shrink-0">
        {isRecurring ? (lastAudit ? formatShortDate(lastAudit) : '\u2014') : `${completeCount}/${taskCount}`}
      </span>
    </div>
  )
}

function WorkstreamDetail({
  label, tasks, taskData, status,
}: {
  label: string
  tasks: { id: string; label: string; owner: 'me' | 'them' }[]
  taskData: Record<string, HandoffStatus>
  status: string
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-sm font-medium">{label}</span>
        {status === 'clean' && (
          <span className="text-[11px] text-success-base font-semibold">Clean</span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {tasks.map((task) => {
          const handoff = taskData[task.id] ?? 'pending'
          return (
            <div key={task.id} className="flex items-center gap-2.5 text-sm">
              <HandoffIcon status={handoff} />
              <span className={handoff === 'pending' ? 'text-muted-foreground' : ''}>
                {task.label}
              </span>
              <HandoffBadge status={handoff} owner={task.owner} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function OnhandMonitoringDetail({
  label, data,
}: {
  label: string
  data?: { lastAudit?: string | null }
}) {
  const lastAudit = data?.lastAudit
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-[11px] text-muted-foreground italic">Recurring</span>
      </div>
      <div className="text-sm text-muted-foreground">
        {lastAudit
          ? `Last audit: ${formatShortDate(lastAudit)}`
          : 'No audits yet'}
      </div>
    </div>
  )
}

function HandoffIcon({ status }: { status: HandoffStatus }) {
  const base = 'flex size-4.5 items-center justify-center rounded-full text-[10px] flex-shrink-0'
  if (status === 'complete') return <div className={`${base} bg-success-bg text-success-base`}>&#10003;</div>
  if (status === 'submitted') return <div className={`${base} bg-warning-bg text-warning-base`}>&#9679;</div>
  return <div className={`${base} bg-muted text-muted-foreground`}>&#8226;</div>
}

function HandoffBadge({ status }: { status: HandoffStatus; owner: 'me' | 'them' }) {
  if (status === 'submitted') {
    return (
      <span className="ml-auto text-[11px] text-warning-base font-medium whitespace-nowrap">
        With branch
      </span>
    )
  }
  return null
}

function LockdownMilestone({
  label, date, status,
}: {
  label: string
  date: string | null
  status: LockdownStatus
}) {
  const base = 'flex size-5.5 items-center justify-center rounded-full text-[11px] flex-shrink-0'
  let icon: React.ReactNode
  if (status === 'complete') {
    icon = <div className={`${base} bg-success-bg text-success-base`}>&#10003;</div>
  } else if (status === 'in-progress') {
    icon = <div className={`${base} bg-info-bg text-info-base`}>&#9679;</div>
  } else {
    icon = <div className={`${base} bg-muted text-muted-foreground`}>&#8226;</div>
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      {icon}
      <span className={status === 'pending' ? 'text-muted-foreground' : status === 'in-progress' ? 'font-semibold' : ''}>
        {label}
      </span>
      {date && (
        <span className="ml-auto text-[12px] text-muted-foreground">
          {formatShortDate(date)}
        </span>
      )}
    </div>
  )
}
