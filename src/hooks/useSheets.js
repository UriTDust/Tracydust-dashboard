import { useApp } from '../context/AppContext'

export function useTasks() {
  const { tasks, setTasks, filteredTasks, showToast } = useApp()

  const create = (data) => {
    setTasks(prev => [...prev, { ...data, id: crypto.randomUUID() }])
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
    setCollaborators(prev => [...prev, { ...data, id: crypto.randomUUID() }])
    showToast('Colaborador añadido')
  }

  return { collaborators, workload, create }
}

export function useKPIs() {
  const { kpis, setKpis, showToast } = useApp()

  const update = (id, value) => {
    setKpis(prev => prev.map(k => k.id === id ? { ...k, value, updated_at: new Date().toISOString() } : k))
    showToast('KPI actualizado')
  }

  return { kpis, update }
}

export function useProdKPIs() {
  const { prodKPIs, setProdKPIs, showToast } = useApp()

  const update = (key, value) => {
    setProdKPIs(prev => ({ ...prev, [key]: value }))
    showToast('KPI actualizado')
  }

  return { prodKPIs, update }
}

export function useFinKPIs() {
  const { finKPIs, setFinKPIs, showToast } = useApp()

  const update = (key, value) => {
    setFinKPIs(prev => ({ ...prev, [key]: value }))
    showToast('Datos actualizados')
  }

  return { finKPIs, update }
}

export function useContacts() {
  const { contacts, setContacts, showToast } = useApp()

  const create = (data) => {
    setContacts(prev => [...prev, { ...data, id: crypto.randomUUID() }])
    showToast('Contacto añadido')
  }
  const update = (id, data) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
    showToast('Contacto actualizado')
  }
  const remove = (id) => {
    setContacts(prev => prev.filter(c => c.id !== id))
    showToast('Contacto eliminado')
  }

  return { contacts, create, update, remove }
}
