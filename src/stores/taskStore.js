import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { isTaskScheduleInFuture, LEGACY_TASKS_KEY, TASKS_STORAGE_KEY } from '../utils/tasks'

const DEMO_TASK_IDS = new Set(['task-1', 'task-2', 'task-3', 'task-4', 'task-5'])

const removeDemoTasks = (tasks) => Array.isArray(tasks)
  ? tasks.filter((task) => !DEMO_TASK_IDS.has(task.id))
  : []

const readLegacyTasks = () => {
  try {
    const savedTasks = localStorage.getItem(LEGACY_TASKS_KEY)
    if (!savedTasks) return []

    const legacyTasks = JSON.parse(savedTasks)
    const tasks = removeDemoTasks(legacyTasks)
    if (Array.isArray(legacyTasks) && tasks.length !== legacyTasks.length) {
      localStorage.setItem(LEGACY_TASKS_KEY, JSON.stringify(tasks))
    }
    return tasks
  } catch {
    return []
  }
}

export const useTaskStore = create(persist(
  (set, get) => ({
    tasks: readLegacyTasks(),
    view: 'today',
    query: '',
    dialogTaskId: null,
    setView: (view) => set({ view }),
    setQuery: (query) => set({ query }),
    openCreateDialog: () => set({ dialogTaskId: 'new' }),
    openEditDialog: (taskId) => set({ dialogTaskId: taskId }),
    closeDialog: () => set({ dialogTaskId: null }),
    saveTask: (form) => {
      const { dialogTaskId, tasks } = get()
      const title = form.title.trim()
      const existingTask = tasks.find((task) => task.id === dialogTaskId)
      const preservesExistingSchedule = existingTask && form.date === existingTask.date && form.time === existingTask.time
      if (!title || (!preservesExistingSchedule && !isTaskScheduleInFuture(form.date, form.time))) return

      if (dialogTaskId === 'new') {
        set({ tasks: [...tasks, { ...form, title, id: crypto.randomUUID(), completed: false }], dialogTaskId: null })
        return
      }

      set({
        tasks: tasks.map((task) => task.id === dialogTaskId ? { ...task, ...form, title } : task),
        dialogTaskId: null,
      })
    },
    toggleTask: (taskId) => set((state) => ({
      tasks: state.tasks.map((task) => task.id === taskId ? { ...task, completed: !task.completed } : task),
    })),
    deleteTask: (taskId) => set((state) => ({ tasks: state.tasks.filter((task) => task.id !== taskId) })),
  }),
  {
    name: TASKS_STORAGE_KEY,
    storage: createJSONStorage(() => localStorage),
    version: 1,
    migrate: (persistedState) => ({
      ...persistedState,
      tasks: removeDemoTasks(persistedState?.tasks),
    }),
    partialize: (state) => ({ tasks: state.tasks }),
    merge: (persistedState, currentState) => ({ ...currentState, ...persistedState }),
  },
))