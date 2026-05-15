import type { TodayBriefItem } from '@/lib/today-brief'
import { TaskCard } from '@/components/today/task-card'

export interface TaskStackProps {
  tasks: TodayBriefItem[]
}

export function TaskStack({ tasks }: TaskStackProps) {
  if (!tasks.length) return null

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--garden-text-muted)]">
        Secondary tasks
      </p>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
