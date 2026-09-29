import { useState } from 'react'
import {
  ArrowDownWideNarrow,
  CalendarDays,
  Check,
  CheckCheck,
  HardDrive,
  Inbox,
  Plus,
  Sparkles,
} from 'lucide-react'
import { useTaskStore } from '../stores/taskStore'
import { getDateKey } from '../utils/tasks'

export function Sidebar() {
  const tasks = useTaskStore((state) => state.tasks)
  const view = useTaskStore((state) => state.view)
  const setView = useTaskStore((state) => state.setView)
  const openCreateDialog = useTaskStore((state) => state.openCreateDialog)
  const [todayKey] = useState(() => getDateKey(new Date()))
  const todayCount = tasks.filter((task) => task.date === todayKey && !task.completed).length
  const completedCount = tasks.filter((task) => task.completed).length
  const workCount = tasks.filter((task) => task.category === 'Work' && !task.completed).length
  const personalCount = tasks.filter((task) => task.category === 'Personal' && !task.completed).length

  return (
    <aside className="sidebar">
      <a className="brand" href="#today" onClick={(event) => { event.preventDefault(); setView('today') }}>
        <span className="brand-mark"><CheckCheck size={19} strokeWidth={2.4} /></span>
        <span>daymark<span className="brand-period">.</span></span>
      </a>
      <button className="add-task-button" onClick={openCreateDialog}><Plus size={17} /> New task <span className="shortcut">N</span></button>
      <div className="nav-section-label">Workspace</div>
      <nav className="primary-nav" aria-label="Task views">
        <button className={view === 'today' ? 'nav-item active' : 'nav-item'} onClick={() => setView('today')}><CalendarDays size={18} /><span>Today</span><span className="nav-count">{todayCount}</span></button>
        <button className={view === 'upcoming' ? 'nav-item active' : 'nav-item'} onClick={() => setView('upcoming')}><ArrowDownWideNarrow size={18} /><span>Upcoming</span></button>
        <button className="nav-item mobile-add" onClick={openCreateDialog}><Plus size={18} /><span>Add</span></button>
        <button className={view === 'all' ? 'nav-item active' : 'nav-item'} onClick={() => setView('all')}><Inbox size={18} /><span>All tasks</span></button>
        <button className={view === 'completed' ? 'nav-item active' : 'nav-item'} onClick={() => setView('completed')}><Check size={18} /><span>Completed</span><span className="nav-count">{completedCount}</span></button>
      </nav>
      <div className="nav-section-label projects-label">Lists</div>
      <button className={`list-nav-item${view === 'Work' ? ' active' : ''}`} onClick={() => setView('Work')}><span className="list-dot work-dot" /><span>Work</span><span className="list-total">{workCount}</span></button>
      <button className={`list-nav-item${view === 'Personal' ? ' active' : ''}`} onClick={() => setView('Personal')}><span className="list-dot personal-dot" /><span>Personal</span><span className="list-total">{personalCount}</span></button>
      <div className="sidebar-bottom">
        <div className="focus-note"><Sparkles size={16} /><span>Make room for<br /><strong>what matters.</strong></span></div>
        <div className="user-profile"><div className="avatar"><HardDrive size={15} /></div><div className="user-meta"><strong>Local workspace</strong><span>Saved in this browser</span></div></div>
      </div>
    </aside>
  )
}