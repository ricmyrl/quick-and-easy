import { Check, Circle, Clock3, Trash2 } from 'lucide-react'
import { useTaskStore } from '../stores/taskStore'
import { formatTaskDate, formatTaskTime } from '../utils/tasks'

export function TaskRow({ task }) {
  const openEditDialog = useTaskStore((state) => state.openEditDialog)
  const toggleTask = useTaskStore((state) => state.toggleTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)

  return (
    <article className={`task-row${task.completed ? ' is-complete' : ''}`}>
      <button className="task-check" onClick={() => toggleTask(task.id)} aria-label={task.completed ? `Mark ${task.title} incomplete` : `Complete ${task.title}`}>
        {task.completed ? <span className="checked-icon"><Check size={13} strokeWidth={3} /></span> : <Circle size={20} strokeWidth={1.7} />}
      </button>
      <button className="task-main" onClick={() => openEditDialog(task.id)}>
        <span className="task-title">{task.title}</span>
        {task.description && <span className="task-description">{task.description}</span>}
        <span className="task-meta"><span className={`category-tag ${task.category.toLowerCase()}`}><i />{task.category}</span><span className={`priority-tag ${task.priority.toLowerCase()}`}>{task.priority}</span></span>
      </button>
      <div className="task-schedule"><span className="task-date">{formatTaskDate(task.date)}</span><span className="task-time"><Clock3 size={13} />{formatTaskTime(task.time)}</span></div>
      <div className="task-actions">
        <button className="icon-button edit-task" onClick={() => openEditDialog(task.id)} aria-label={`Edit ${task.title}`} title="Edit task"><span>Edit</span></button>
        <button className="icon-button delete-task" onClick={() => deleteTask(task.id)} aria-label={`Delete ${task.title}`} title="Delete task"><Trash2 size={15} /></button>
      </div>
    </article>
  )
}