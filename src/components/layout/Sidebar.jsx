import { KPIPanel } from '../kpis/KPIPanel'
import { CollaboratorPanel } from '../collaboration/CollaboratorPanel'
import { useApp } from '../../context/AppContext'

const PHASES = [
  'Marketing',
  'Sales',
  'Finance',
  'Production',
]

export function Sidebar() {
  const { activePhase, setActivePhase } = useApp()

  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        background: 'var(--td-white)',
        borderRight: '1px solid var(--td-border)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      {/* Project Phases */}
      <section style={{ padding: '20px 0 8px' }}>
        <h3
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontWeight: 600,
            fontSize: 13,
            color: 'var(--td-text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '0 20px 10px',
          }}
        >
          Project Phases
        </h3>
        <ul style={{ listStyle: 'none' }}>
          {PHASES.map(phase => {
            const isActive = activePhase === phase
            return (
              <li key={phase}>
                <button
                  onClick={() => setActivePhase(isActive ? null : phase)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 20px',
                    background: isActive ? 'var(--td-cream)' : 'transparent',
                    borderLeft: `3px solid ${isActive ? 'var(--td-burgundy)' : 'transparent'}`,
                    border: 'none',
                    borderLeftWidth: 3,
                    borderLeftStyle: 'solid',
                    borderLeftColor: isActive ? 'var(--td-burgundy)' : 'transparent',
                    color: isActive ? 'var(--td-burgundy)' : 'var(--td-text-primary)',
                    fontWeight: isActive ? 600 : 400,
                    fontSize: 13,
                    fontFamily: 'DM Sans, sans-serif',
                    cursor: 'pointer',
                    transition: 'all 0.12s',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.background = 'var(--td-cream-soft)'
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.background = 'transparent'
                  }}
                >
                  {phase}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <div style={{ height: 1, background: 'var(--td-border)', margin: '8px 20px' }} />

      <KPIPanel />

      <div style={{ height: 1, background: 'var(--td-border)', margin: '8px 20px' }} />

      <CollaboratorPanel />
    </aside>
  )
}
