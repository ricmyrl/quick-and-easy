import { useEffect, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { Sidebar } from './components/Sidebar'
import { TaskDialog } from './components/TaskDialog'
import { TaskList } from './components/TaskList'
import { TaskSummary } from './components/TaskSummary'
import { Topbar } from './components/Topbar'
import { useTaskStore } from './stores/taskStore'
import { formatLongDate, getViewHeading } from './utils/tasks'
import './App.css'

function App() {
  const searchInput = useRef(null)
  const view = useTaskStore((state) => state.view)
  const dialogTaskId = useTaskStore((state) => state.dialogTaskId)
  const openCreateDialog = useTaskStore((state) => state.openCreateDialog)
  const [todayLabel] = useState(() => formatLongDate(new Date()))
  const heading = getViewHeading(view)

  useEffect(() => {
    const handleShortcut = (event) => {
      const store = useTaskStore.getState()
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchInput.current?.focus()
      } else if (event.key === 'Escape') {
        store.closeDialog()
      } else if (event.key.toLowerCase() === 'n' && !event.metaKey && !event.ctrlKey && !event.altKey && !['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) {
        store.openCreateDialog()
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-area">
        <Topbar searchInput={searchInput} />
        <section className="content-area">
          <div className="page-intro">
            <div className="intro-copy"><div className="eyebrow">{todayLabel}</div><h1>{heading}<span className="heading-period">.</span></h1><p>{view === 'today' ? 'A clear plan makes a calmer day.' : view === 'completed' ? 'A little progress adds up.' : 'Keep your next steps in view.'}</p></div>
            <button className="primary-button" onClick={openCreateDialog}><Plus size={17} /> Add task</button>
          </div>
          <TaskSummary />
          <TaskList />
        </section>
      </main>
      {dialogTaskId && <TaskDialog key={dialogTaskId} taskId={dialogTaskId} />}
    </div>
  )
}

export default App