import { TimelineCard } from './TimelineCard'
import { useApp } from '../../context/AppContext'

const COLUMNS = [
  { key: 'now',  label: 'Now',  color: '#FEF3C7' },
  { key: 'next', label: 'Next', color: '#EDE9FE' },
  { key: 'later',label: 'Later',color: '#F0FDF4' },
]

export function TimelineBoard({ onEditTask }) {
  const { filteredTasks } = useApp()

  return (
    <section style={{ padding: '20px 24px 16px' }}>
      <h2
        style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontWeight: 600,
          fontSize: 18,
          color: 'var(--td-text-primary)',
          marginBottom: 14,
        }}
      >
        Timeline
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {COLUMNS.map(col => {
          const colTasks = filteredTasks.filter(t => t.timeline_col === col.key)
          return (
            <div key={col.key}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    fontFamily: 'Cormorant Garamond, serif',
                    fontWeight: 600,
                    fontSize: 15,
                    color: 'var(--td-text-primary)',
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: col.key === 'now' ? '#F59E0B' : col.key === 'next' ? '#8B5CF6' : '#10B981',
                    }}
                  />
                  {col.label}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    color: 'var(--td-text-muted)',
                    background: 'var(--td-cream)',
                    borderRadius: 10,
                    padding: '2px 8px',
                  }}
                >
                  {colTasks.length}
                </span>
              </div>

              <div
                style={{
                  background: col.color,
                  borderRadius: 10,
                  padding: '10px 8px',
                  minHeight: 80,
                }}
              >
                {colTasks.length === 0 ? (
                  <p
                    style={{
                      textAlign: 'center',
                      color: 'var(--td-text-muted)',
                      fontSize: 12,
                      padding: '16px 0',
                    }}
                  >
                    Sin tareas
                  </p>
                ) : (
                  colTasks.map(task => (
                    <TimelineCard
                      key={task.id}
                      task={task}
                      onClick={() => onEditTask(task)}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
