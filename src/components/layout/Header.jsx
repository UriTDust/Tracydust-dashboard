import { Plus, LayoutDashboard, BarChart2, Users } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { useApp } from '../../context/AppContext'

const TABS = [
  { id: 'panel', label: 'Panel',                                    Icon: LayoutDashboard },
  { id: 'kpis',  label: 'Indicadores clave de rendimiento (KPI)',   Icon: BarChart2 },
  { id: 'crm',   label: 'CRM',                                      Icon: Users },
]

export function Header({ onAddTask }) {
  const { collaborators, activeUser, setActiveUser, activeTab, setActiveTab } = useApp()

  return (
    <header
      style={{
        background: 'var(--td-white)',
        borderBottom: '1px solid var(--td-border)',
        padding: '0 24px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <polygon
            points="11,2 13.8,8.2 20.5,9 15.7,13.6 17.1,20.2 11,17 4.9,20.2 6.3,13.6 1.5,9 8.2,8.2"
            fill="var(--td-burgundy)"
          />
        </svg>
        <span
          style={{
            fontFamily: 'Playfair Display, serif',
            fontWeight: 700,
            fontSize: 20,
            color: 'var(--td-burgundy)',
          }}
        >
          Tracy Dust
        </span>
      </div>

      <div style={{ width: 1, height: 28, background: 'var(--td-border)', flexShrink: 0 }} />

      {/* Tabs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        {TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 8,
                border: 'none',
                background: isActive ? 'var(--td-burgundy)' : 'transparent',
                color: isActive ? 'var(--td-white)' : 'var(--td-text-muted)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--td-cream-soft)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon size={14} />
              {label}
            </button>
          )
        })}
      </nav>

      {/* User pills + action button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        {collaborators.map(c => {
          const isActive = activeUser === c.name
          return (
            <button
              key={c.id}
              onClick={() => setActiveUser(isActive ? null : c.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '5px 12px 5px 7px',
                borderRadius: 20,
                border: `1px solid ${isActive ? 'var(--td-burgundy)' : 'var(--td-border)'}`,
                background: isActive ? 'var(--td-burgundy)' : 'var(--td-white)',
                color: isActive ? 'var(--td-white)' : 'var(--td-text-primary)',
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              <Avatar
                initials={c.avatar_initials || c.name.slice(0, 2).toUpperCase()}
                color={isActive ? 'rgba(255,255,255,0.3)' : c.color_hex || '#6B0F1A'}
                size={24}
              />
              <span>{c.name}</span>
              {c.location && (
                <span style={{ opacity: 0.65, fontSize: 11 }}>({c.location})</span>
              )}
            </button>
          )
        })}

        {activeTab === 'panel' && (
          <button
            onClick={onAddTask}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 16px',
              borderRadius: 8,
              border: 'none',
              background: 'var(--td-burgundy)',
              color: 'var(--td-white)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              fontFamily: 'DM Sans, sans-serif',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--td-burgundy-light)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--td-burgundy)'}
          >
            <Plus size={15} />
            Tarea
          </button>
        )}
      </div>
    </header>
  )
}
