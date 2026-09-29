import { useTaskStore } from '../stores/taskStore'

export function TaskSummary() {
  const tasks = useTaskStore((state) => state.tasks)
  const openCount = tasks.filter((task) => !task.completed).length
  const completedCount = tasks.length - openCount
  const progress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0

  return (
    <section className="summary-strip" aria-label="Task summary">
      <div className="summary-block"><span className="summary-label">To do</span><strong>{openCount.toString().padStart(2, '0')}</strong><span className="summary-caption">tasks remaining</span></div>
      <div className="summary-divider" />
      <div className="summary-block"><span className="summary-label">Completed</span><strong>{completedCount.toString().padStart(2, '0')}</strong><span className="summary-caption">nice work so far</span></div>
      <div className="summary-progress">
        <div className="progress-copy"><span>Overall progress</span><strong>{progress}%</strong></div>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
      </div>
    </section>
  )
}