import { Calendar } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { StatusBadge } from '../ui/StatusBadge'
import { useApp } from '../../context/AppContext'

const STATUS_BORDER = {
  in_progress: '#E8A44A',
  not_started: '#1A1A2E',
  done: '#2D6A4F',
}

export function TimelineCard({ task, onClick }) {
  const { collaborators } = useApp()
  const collab = collaborators.find(c => c.name === task.owner)

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--td-white)',
        borderRadius: 10,
        borderLeft: `3px solid ${STATUS_BORDER[task.status] || '#C7C7DC'}`,
        padding: '12px 14px',
        cursor: 'pointer',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.15s, transform 0.15s',
        marginBottom: 8,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--td-text-primary)',
            lineHeight: 1.4,
            flex: 1,
            marginRight: 8,
          }}
        >
          {task.title}
        </p>
        {collab && (
          <Avatar
            initials={collab.avatar_initials || collab.name.slice(0, 2).toUpperCase()}
            color={collab.color_hex || '#6B0F1A'}
            size={26}
          />
        )}
      </div>

      <StatusBadge status={task.status} />

      {task.notes && (
        <p
          style={{
            marginTop: 6,
            fontSize: 12,
            color: 'var(--td-text-muted)',
            lineHeight: 1.4,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {task.notes}
        </p>
      )}

      {task.deadline && (
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            color: 'var(--td-text-muted)',
          }}
        >
          <Calendar size={11} />
          {task.deadline}
        </div>
      )}
    </div>
  )
}
