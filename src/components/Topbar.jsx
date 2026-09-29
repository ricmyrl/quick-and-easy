import { FolderKanban, Search } from 'lucide-react'
import { useTaskStore } from '../stores/taskStore'
import { getViewHeading } from '../utils/tasks'

export function Topbar({ searchInput }) {
  const view = useTaskStore((state) => state.view)
  const query = useTaskStore((state) => state.query)
  const setQuery = useTaskStore((state) => state.setQuery)
  const heading = getViewHeading(view)

  return (
    <header className="topbar">
      <div className="breadcrumb"><FolderKanban size={15} /><span>My workspace</span><span className="breadcrumb-slash">/</span><strong>{heading}</strong></div>
      <label className="search-box">
        <Search size={17} />
        <input ref={searchInput} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks" aria-label="Search tasks" />
        <kbd>Ctrl K</kbd>
      </label>
    </header>
  )
}