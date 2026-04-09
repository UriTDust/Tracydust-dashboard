import { useState } from 'react'
import { AppProvider } from './context/AppContext'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { TimelineBoard } from './components/timeline/TimelineBoard'
import { TasksTable } from './components/tasks/TasksTable'
import { TaskModal } from './components/tasks/TaskModal'
import { Toast } from './components/ui/Toast'
import { LoadingSpinner } from './components/ui/LoadingSpinner'
import { useApp } from './context/AppContext'

function Dashboard() {
  const { loading } = useApp()
  const [modal, setModal] = useState(null) // null | { mode: 'create' | 'edit', task?: {} }

  const openCreate = () => setModal({ mode: 'create' })
  const openEdit = (task) => setModal({ mode: 'edit', task })
  const closeModal = () => setModal(null)

  if (loading) {
    return (
      <div style={{ height: '100vh' }}>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header onAddTask={openCreate} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            background: 'var(--td-bg-app)',
          }}
        >
          <TimelineBoard onEditTask={openEdit} />
          <div style={{ height: 1, background: 'var(--td-border)', margin: '0 24px' }} />
          <TasksTable onEditTask={openEdit} />
        </main>
      </div>

      {modal && (
        <TaskModal
          mode={modal.mode}
          task={modal.task}
          onClose={closeModal}
        />
      )}

      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  )
}
