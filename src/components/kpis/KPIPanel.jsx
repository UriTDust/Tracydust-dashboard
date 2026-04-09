import { useState } from 'react'
import { useKPIs } from '../../hooks/useSheets'

export function KPIPanel() {
  const { kpis, update } = useKPIs()
  const [editing, setEditing] = useState(null) // { id, value }

  const handleBlur = async () => {
    if (!editing) return
    await update(editing.id, editing.value)
    setEditing(null)
  }

  return (
    <section style={{ padding: '16px 20px' }}>
      <h3
        style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontWeight: 600,
          fontSize: 13,
          color: 'var(--td-text-muted)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}
      >
        KPIs
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {kpis.map(kpi => (
          <div
            key={kpi.id}
            style={{
              background: 'var(--td-cream-soft)',
              border: '1px solid var(--td-border)',
              borderRadius: 8,
              padding: '10px 12px',
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: 'var(--td-text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 4,
              }}
            >
              {kpi.category}
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--td-text-muted)',
                marginBottom: 4,
              }}
            >
              {kpi.label}
            </div>
            {editing?.id === kpi.id ? (
              <input
                autoFocus
                value={editing.value}
                onChange={e => setEditing({ ...editing, value: e.target.value })}
                onBlur={handleBlur}
                onKeyDown={e => e.key === 'Enter' && handleBlur()}
                style={{
                  width: '100%',
                  border: '1px solid var(--td-burgundy)',
                  borderRadius: 4,
                  padding: '3px 6px',
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: 'DM Sans, sans-serif',
                  color: 'var(--td-burgundy)',
                  background: 'var(--td-white)',
                  outline: 'none',
                }}
              />
            ) : (
              <div
                onClick={() => setEditing({ id: kpi.id, value: kpi.value })}
                title="Click para editar"
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'var(--td-burgundy)',
                  cursor: 'pointer',
                  borderRadius: 4,
                  padding: '2px 4px',
                  margin: '-2px -4px',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--td-cream)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {kpi.value}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
