import { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext()

const DEFAULT_COLLABORATORS = [
  { id: '1', name: 'Rosa', location: 'Madrid',    role: 'Product / Suppliers',  color_hex: '#6B0F1A', avatar_initials: 'RO' },
  { id: '2', name: 'Uri',  location: 'Barcelona', role: 'Branding / Marketing', color_hex: '#C9A96E', avatar_initials: 'UR' },
]

const DEFAULT_KPIS = [
  { id: '1', category: 'Product Development', label: 'Designs',      value: '2/5',     updated_at: '' },
  { id: '2', category: 'Marketing Growth',    label: 'IG followers', value: '0 → 450', updated_at: '' },
  { id: '3', category: 'Business',            label: 'CAC target',   value: '€25',     updated_at: '' },
]

const DEFAULT_PROD_KPIS = {
  lps_hechas: 0,
  lps_objetivo: 10,
  lps_desarrollo: 5,
  obv_totales: 17,
  obv_objetivo: 30,
  obv_semanales: 0,
  obv_semanales_objetivo: 5,
}

const DEFAULT_FIN_KPIS = {
  facturacion_acumulada: 0,
  facturacion_semana: 0,
  objetivo_facturacion: 20,
  gastos_semana: 0,
  gastos_previstos: 0,
  beneficio_acumulado: 0,
}

const DEFAULT_CONTACTS = [
  { id: '1', name: 'María López',  company: 'Textiles ibéricos', email: 'maria@textilesibericos.com', phone: '+34 612 345 678', role: 'Proveedor',      status: 'Activo',  notes: 'Proveedor de algodón orgánico en Oporto' },
  { id: '2', name: 'Luca Bianchi', company: 'Estudio Forma',     email: 'luca@studioforma.it',        phone: '+39 333 456 789', role: 'Socio de diseño', status: 'Activo',  notes: 'Colaboración en el diseño de patrones' },
  { id: '3', name: 'Ana Ferreira', company: 'Telas de Oporto',   email: 'ana@portofabrics.pt',        phone: '+351 912 345 678',role: 'Proveedor',      status: 'Dirigir', notes: 'Lino y tejidos sostenibles' },
  { id: '4', name: 'PLOMO 1',      company: '',                  email: '',                           phone: '622 877 007',     role: '',               status: 'Dirigir', notes: 'Lead que ha dejado su número de teléfono opcionalmente' },
  { id: '5', name: 'PLOMO 2',      company: '',                  email: '',                           phone: '699 14 33 52',    role: '',               status: 'Dirigir', notes: 'Lead interesado en compra encuesta' },
  { id: '6', name: 'PLOMO 3',      company: '',                  email: '',                           phone: '618 21 28 05',    role: '',               status: 'Dirigir', notes: 'Encuesta de plomo' },
  { id: '7', name: 'PLOMO 4',      company: '',                  email: '',                           phone: '614 60 46 90',    role: '',               status: 'Dirigir', notes: 'Encuesta' },
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
  const [activeTab, setActiveTab] = useState('panel')

  const [tasks,         setTasksRaw]         = useState(() => load('td_tasks',         []))
  const [collaborators, setCollaboratorsRaw] = useState(() => load('td_collaborators', DEFAULT_COLLABORATORS))
  const [kpis,          setKpisRaw]          = useState(() => load('td_kpis',          DEFAULT_KPIS))
  const [prodKPIs,      setProdKPIsRaw]      = useState(() => load('td_prod_kpis',     DEFAULT_PROD_KPIS))
  const [finKPIs,       setFinKPIsRaw]       = useState(() => load('td_fin_kpis',      DEFAULT_FIN_KPIS))
  const [contacts,      setContactsRaw]      = useState(() => load('td_contacts',      DEFAULT_CONTACTS))

  const [activeUser,  setActiveUser]  = useState(null)
  const [activePhase, setActivePhase] = useState(null)
  const [toast,       setToast]       = useState(null)

  const setTasks         = (v) => { const n = typeof v === 'function' ? v(tasks)         : v; setTasksRaw(n);         save('td_tasks',         n) }
  const setCollaborators = (v) => { const n = typeof v === 'function' ? v(collaborators) : v; setCollaboratorsRaw(n); save('td_collaborators', n) }
  const setKpis          = (v) => { const n = typeof v === 'function' ? v(kpis)          : v; setKpisRaw(n);          save('td_kpis',          n) }
  const setProdKPIs      = (v) => { const n = typeof v === 'function' ? v(prodKPIs)      : v; setProdKPIsRaw(n);      save('td_prod_kpis',     n) }
  const setFinKPIs       = (v) => { const n = typeof v === 'function' ? v(finKPIs)       : v; setFinKPIsRaw(n);       save('td_fin_kpis',      n) }
  const setContacts      = (v) => { const n = typeof v === 'function' ? v(contacts)      : v; setContactsRaw(n);      save('td_contacts',      n) }

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
      activeTab, setActiveTab,
      tasks, setTasks, filteredTasks,
      collaborators, setCollaborators, workload,
      kpis, setKpis,
      prodKPIs, setProdKPIs,
      finKPIs,  setFinKPIs,
      contacts, setContacts,
      activeUser,  setActiveUser,
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
