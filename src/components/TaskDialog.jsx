import { useState } from 'react'
import { Check, Plus, X } from 'lucide-react'
import { useTaskStore } from '../stores/taskStore'
import { createEmptyTaskForm, getMinimumTaskDateTime, isTaskScheduleInFuture } from '../utils/tasks'

const toTaskForm = (task) => ({
  title: task.title,
  description: task.description,
  date: task.date,
  time: task.time,
  priority: task.priority,
  category: task.category,
})

export function TaskDialog({ taskId }) {
  const task = useTaskStore((state) => taskId === 'new' ? null : state.tasks.find((item) => item.id === taskId))
  const closeDialog = useTaskStore((state) => state.closeDialog)
  const saveTask = useTaskStore((state) => state.saveTask)
  const [form, setForm] = useState(() => task ? toTaskForm(task) : createEmptyTaskForm())
  const [scheduleError, setScheduleError] = useState('')
  const isNewTask = taskId === 'new'
  const minimumDateTime = getMinimumTaskDateTime()
  const preservesExistingSchedule = task && form.date === task.date && form.time === task.time

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!preservesExistingSchedule && !isTaskScheduleInFuture(form.date, form.time)) {
      setScheduleError('Choose a future date and time.')
      return
    }
    saveTask(form)
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog() }}>
      <section className="task-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading">
          <div><span className="modal-eyebrow">{isNewTask ? 'Make it happen' : 'Task details'}</span><h2 id="modal-title">{isNewTask ? 'New task' : 'Edit task'}</h2></div>
          <button className="modal-close" onClick={closeDialog} aria-label="Close dialog"><X size={19} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <label className="field-label">Task name<input className="text-input" autoFocus required maxLength={100} placeholder="What needs to get done?" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label>
          <label className="field-label">Notes <span className="optional-label">Optional</span><textarea className="text-input notes-input" rows="3" maxLength={300} placeholder="Add a little context..." value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
          <div className="form-grid">
            <label className="field-label">Date<input className="text-input" type="date" required min={task && form.date === task.date ? undefined : minimumDateTime.date} value={form.date} onChange={(event) => { setScheduleError(''); setForm({ ...form, date: event.target.value }) }} /></label>
            <label className="field-label">Time<input className="text-input" type="time" required min={!preservesExistingSchedule && form.date === minimumDateTime.date ? minimumDateTime.time : undefined} value={form.time} onChange={(event) => { setScheduleError(''); setForm({ ...form, time: event.target.value }) }} /></label>
            <label className="field-label">List<select className="text-input" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Work</option><option>Personal</option></select></label>
            <label className="field-label">Priority<select className="text-input" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value })}><option>Low</option><option>Medium</option><option>High</option></select></label>
          </div>
          {scheduleError && <p className="schedule-error" role="alert">{scheduleError}</p>}
          <div className="modal-footer">
            <button className="cancel-button" type="button" onClick={closeDialog}>Cancel</button>
            <button className="primary-button" type="submit">{isNewTask ? <><Plus size={16} /> Create task</> : <><Check size={16} /> Save changes</>}</button>
          </div>
        </form>
      </section>
    </div>
  )
}