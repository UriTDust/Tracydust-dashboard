import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext()

const DEFAULT_COLLABORATORS = [
  { id: '1', name: 'Rosa', location: 'Madrid',     role: 'Product / Suppliers',  color_hex: '#6B0F1A', avatar_initials: 'RO' },
  { id: '2', name: 'Uri',  location: 'Barcelona',  role: 'Branding / Marketing', color_hex: '#C9A96E', avatar_initials: 'UR' },
]

const DEFAULT_KPIS = [
  { id: '1', category: 'Product Development', label: 'Designs',      value: '2/5',    updated_at: '' },
  { id: '2', category: 'Marketing Growth',    label: 'IG followers', value: '0 → 450',updated_at: '' },
  { id: '3', category: 'Business',            label: 'CAC target',   value: '€25',    updated_at: '' },
]

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function AppProvider({ children }) {
  const [tasks,         setTasksRaw]         = useState(() => load('td_tasks', []))
  const [collaborators, setCollaboratorsRaw] = useState(() => load('td_collaborators', DEFAULT_COLLABORATORS))
  const [kpis,          setKpisRaw]          = useState(() => load('td_kpis', DEFAULT_KPIS))
  const [activeUser,  setActiveUser]  = useState(null)
  const [activePhase, setActivePhase] = useState(null)
  const [toast, setToast] = useState(null)

  // Persist on every change
  const setTasks = (v) => { const next = typeof v === 'function' ? v(tasks) : v; setTasksRaw(next); save('td_tasks', next) }
  const setCollaborators = (v) => { const next = typeof v === 'function' ? v(collaborators) : v; setCollaboratorsRaw(next); save('td_collaborators', next) }
  const setKpis = (v) => { const next = typeof v === 'function' ? v(kpis) : v; setKpisRaw(next); save('td_kpis', next) }

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const filteredTasks = tasks.filter(t => {
    if (activeUser  && t.owner !== activeUser)  return false
    if (activePhase && t.phase !== activePhase) return false
    return true
  })

  const workload = collaborators.map(c => ({
    ...c,
    taskCount: tasks.filter(t => t.owner === c.name && t.status !== 'done').length,
  }))

  return (
    <AppContext.Provider value={{
      tasks, setTasks, filteredTasks,
      collaborators, setCollaborators, workload,
      kpis, setKpis,
      activeUser, setActiveUser,
      activePhase, setActivePhase,
      loading: false,
      toast,
      showToast,
      fetchAll: () => {},
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
