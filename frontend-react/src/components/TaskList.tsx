import type { Task } from '@/types'

function TaskIcon({ status }: { status: string }) {
  const base = 'flex size-4.5 items-center justify-center rounded-full text-[10px] flex-shrink-0'
  if (status === 'complete') {
    return <div className={`${base} bg-success-bg text-success-base`}>&#10003;</div>
  }
  if (status === 'in-progress') {
    return <div className={`${base} bg-info-bg text-info-base`}>&#9679;</div>
  }
  if (status === 'blocked') {
    return <div className={`${base} bg-error-bg text-error-base`}>&#10005;</div>
  }
  return <div className={`${base} bg-muted text-muted-foreground`}>&#8226;</div>
}

export function TaskList({ tasks, title }: { tasks: Task[]; title: string }) {
  if (tasks.length === 0) return null

  return (
    <div className="mt-3">
      <div className="mb-2 text-[13px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      {tasks.map((task) => (
        <div key={task.id}>
          <div className="flex items-center gap-2.5 py-1.5 text-sm">
            <TaskIcon status={task.status} />
            <span className={task.status === 'pending' ? 'text-muted-foreground' : ''}>
              {task.name}
            </span>
          </div>
          {task.subtasks?.map((sub) => (
            <div key={sub.id} className="flex items-center gap-2.5 py-1 pl-7 text-sm">
              <TaskIcon status={sub.status} />
              <span className={sub.status === 'pending' ? 'text-muted-foreground' : ''}>
                {sub.name}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
