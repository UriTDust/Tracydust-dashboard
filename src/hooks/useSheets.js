import { useApp } from '../context/AppContext'

export function useTasks() {
  const { tasks, setTasks, filteredTasks, showToast } = useApp()

  const create = (data) => {
    const newTask = { ...data, id: crypto.randomUUID() }
    setTasks(prev => [...prev, newTask])
    showToast('Tarea creada')
  }

  const update = (id, data) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))
    showToast('Tarea actualizada')
  }

  const remove = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    showToast('Tarea eliminada')
  }

  return { tasks, filteredTasks, create, update, remove }
}

export function useCollaborators() {
  const { collaborators, setCollaborators, workload, showToast } = useApp()

  const create = (data) => {
    const newCollab = { ...data, id: crypto.randomUUID() }
    setCollaborators(prev => [...prev, newCollab])
    showToast('Colaborador añadido')
  }

  return { collaborators, workload, create }
}

export function useKPIs() {
  const { kpis, setKpis, showToast } = useApp()

  const update = (id, value) => {
    setKpis(prev =>
      prev.map(k => k.id === id ? { ...k, value, updated_at: new Date().toISOString() } : k)
    )
    showToast('KPI actualizado')
  }

  return { kpis, update }
}
