import { useMemo } from 'react'
import { ArrowDownWideNarrow, CheckCheck, ListTodo, Plus } from 'lucide-react'
import { useTaskStore } from '../stores/taskStore'
import { getTasksForView, getViewHeading } from '../utils/tasks'
import { TaskRow } from './TaskRow'

export function TaskList() {
  const tasks = useTaskStore((state) => state.tasks)
  const view = useTaskStore((state) => state.view)
  const query = useTaskStore((state) => state.query)
  const openCreateDialog = useTaskStore((state) => state.openCreateDialog)
  const heading = getViewHeading(view)
  const visibleTasks = useMemo(() => getTasksForView(tasks, view, query), [tasks, view, query])

  return (
    <>
      <div className="task-toolbar">
        <div className="task-view-title"><ListTodo size={18} /><h2>{view === 'today' ? 'Your schedule' : `${heading} tasks`}</h2><span className="task-total">{visibleTasks.length}</span></div>
        <button className="sort-button" type="button" aria-label="Tasks sorted by scheduled time"><ArrowDownWideNarrow size={15} /><span>Schedule</span></button>
      </div>
      {visibleTasks.length ? (
        <div className="task-list">{visibleTasks.map((task) => <TaskRow key={task.id} task={task} />)}</div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon"><CheckCheck size={23} /></span>
          <h3>{query ? 'No matching tasks' : view === 'today' ? 'Your day is clear' : 'Nothing here yet'}</h3>
          <p>{query ? 'Try another search or clear your query.' : 'Add a task and give your day a little direction.'}</p>
          {!query && <button className="text-button" onClick={openCreateDialog}><Plus size={15} /> Create a task</button>}
        </div>
      )}
      <div className="list-footer"><span><span className="footer-dot" /> All changes saved</span><span>{visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'}</span></div>
    </>
  )
}