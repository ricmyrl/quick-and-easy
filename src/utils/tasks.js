export const LEGACY_TASKS_KEY = 'daymark.tasks.v1'
export const TASKS_STORAGE_KEY = 'daymark.tasks.v2'

export const getDateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

export const createEmptyTaskForm = () => ({
  title: '',
  description: '',
  date: getDateKey(new Date()),
  time: '09:00',
  priority: 'Medium',
  category: 'Work',
})

export const formatLongDate = (date) => new Intl.DateTimeFormat('en', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
}).format(date)

export const formatTaskDate = (date) => {
  const today = getDateKey(new Date())
  if (date === today) return 'Today'
  if (date === getDateOffset(1)) return 'Tomorrow'
  const [year, month, day] = date.split('-')
  const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(month) - 1]
  return `${monthName} ${Number(day)}, ${year}`
}

export const formatTaskTime = (time) => {
  const [hour, minute] = time.split(':').map(Number)
  return `${hour % 12 || 12}:${String(minute).padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`
}

export const getViewHeading = (view) => {
  if (view === 'today') return 'Today'
  if (view === 'upcoming') return 'Upcoming'
  if (view === 'completed') return 'Completed'
  if (view === 'Work' || view === 'Personal') return view
  return 'All tasks'
}

export const getTasksForView = (tasks, view, query) => {
  const today = getDateKey(new Date())
  const normalizedQuery = query.trim().toLowerCase()

  return tasks
    .filter((task) => {
      if (view === 'today') return task.date === today
      if (view === 'upcoming') return !task.completed && task.date > today
      if (view === 'completed') return task.completed
      if (view === 'Work' || view === 'Personal') return task.category === view
      return view === 'all' || !task.completed
    })
    .filter((task) => !normalizedQuery || `${task.title} ${task.description} ${task.category}`.toLowerCase().includes(normalizedQuery))
    .sort((first, second) => `${first.date} ${first.time}`.localeCompare(`${second.date} ${second.time}`))
}