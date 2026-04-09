import { Pencil, Trash2 } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { StatusBadge } from '../ui/StatusBadge'
import { useApp } from '../../context/AppContext'
import { useTasks } from '../../hooks/useSheets'

export function TasksTable({ onEditTask }) {
  const { collaborators, filteredTasks } = useApp()
  const { remove } = useTasks()

  const sorted = [...filteredTasks].sort((a, b) => {
    if (!a.deadline) return 1
    if (!b.deadline) return -1
    return a.deadline.localeCompare(b.deadline)
  })

  const getCollab = (name) => collaborators.find(c => c.name === name)

  const handleDelete = async (task) => {
    if (!window.confirm(`¿Eliminar la tarea "${task.title}"?`)) return
    await remove(task.id)
  }

  return (
    <section style={{ padding: '4px 24px 24px' }}>
      <h2
        style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontWeight: 600,
          fontSize: 18,
          color: 'var(--td-text-primary)',
          marginBottom: 14,
        }}
      >
        Tasks
      </h2>
      <div
        style={{
          background: 'var(--td-white)',
          borderRadius: 12,
          border: '1px solid var(--td-border)',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--td-cream-soft)' }}>
              {['Tarea', 'Owner', 'Deadline', 'Estado', 'Fase', ''].map((h, i) => (
                <th
                  key={i}
                  style={{
                    padding: '10px 14px',
                    textAlign: 'left',
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'var(--td-text-muted)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid var(--td-border)',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: '32px',
                    textAlign: 'center',
                    color: 'var(--td-text-muted)',
                    fontSize: 13,
                  }}
                >
                  No hay tareas que mostrar
                </td>
              </tr>
            )}
            {sorted.map((task, i) => {
              const collab = getCollab(task.owner)
              const isEven = i % 2 === 0
              return (
                <tr
                  key={task.id}
                  style={{
                    background: isEven ? 'var(--td-white)' : 'var(--td-cream-soft)',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F5EDE5'}
                  onMouseLeave={e => e.currentTarget.style.background = isEven ? 'var(--td-white)' : 'var(--td-cream-soft)'}
                >
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 500, fontSize: 13, color: 'var(--td-text-primary)' }}>
                      {task.title}
                    </div>
                    {task.notes && (
                      <div
                        style={{
                          fontSize: 11,
                          color: 'var(--td-text-muted)',
                          marginTop: 2,
                          maxWidth: 260,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {task.notes}
                      </div>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      {collab ? (
                        <>
                          <Avatar
                            initials={collab.avatar_initials || collab.name.slice(0, 2).toUpperCase()}
                            color={collab.color_hex || '#6B0F1A'}
                            size={26}
                          />
                          <span style={{ fontSize: 13 }}>{task.owner}</span>
                        </>
                      ) : (
                        <span style={{ fontSize: 13, color: 'var(--td-text-muted)' }}>
                          {task.owner || '—'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ ...tdStyle, fontSize: 12, color: 'var(--td-text-muted)' }}>
                    {task.deadline || '—'}
                  </td>
                  <td style={tdStyle}>
                    <StatusBadge status={task.status} />
                  </td>
                  <td style={{ ...tdStyle, fontSize: 12, color: 'var(--td-text-muted)' }}>
                    {task.phase || '—'}
                  </td>
                  <td style={{ ...tdStyle, width: 80 }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        onClick={() => onEditTask(task)}
                        title="Editar"
                        style={iconBtnStyle}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(task)}
                        title="Eliminar"
                        style={{ ...iconBtnStyle, color: '#DC2626' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

const tdStyle = {
  padding: '10px 14px',
  borderBottom: '1px solid var(--td-border)',
  verticalAlign: 'middle',
}

const iconBtnStyle = {
  padding: '5px',
  border: '1px solid var(--td-border)',
  borderRadius: 6,
  background: 'transparent',
  color: 'var(--td-text-muted)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.1s',
}
