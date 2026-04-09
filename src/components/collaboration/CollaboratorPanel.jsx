import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { useApp } from '../../context/AppContext'
import { useCollaborators } from '../../hooks/useSheets'

export function CollaboratorPanel() {
  const { activeUser, setActiveUser } = useApp()
  const { workload, create } = useCollaborators()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', location: '', role: '', color_hex: '#6B0F1A' })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const initials = form.name.slice(0, 2).toUpperCase()
    await create({ ...form, avatar_initials: initials })
    setForm({ name: '', location: '', role: '', color_hex: '#6B0F1A' })
    setShowForm(false)
    setSaving(false)
  }

  return (
    <section style={{ padding: '16px 20px 20px' }}>
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
        Collaborators
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {workload.map(c => {
          const isActive = activeUser === c.name
          return (
            <button
              key={c.id}
              onClick={() => setActiveUser(isActive ? null : c.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 8,
                border: `1px solid ${isActive ? 'var(--td-burgundy)' : 'var(--td-border)'}`,
                background: isActive ? 'var(--td-cream)' : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.12s',
                width: '100%',
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = 'var(--td-cream-soft)'
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = 'transparent'
              }}
            >
              <Avatar
                initials={c.avatar_initials || c.name.slice(0, 2).toUpperCase()}
                color={c.color_hex || '#6B0F1A'}
                size={32}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--td-text-primary)' }}>
                  {c.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--td-text-muted)', marginTop: 1 }}>
                  {c.location} · {c.role}
                </div>
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: c.taskCount > 0 ? 'var(--td-burgundy)' : 'var(--td-text-muted)',
                  background: c.taskCount > 0 ? '#F9E8EA' : 'var(--td-cream)',
                  borderRadius: 10,
                  padding: '2px 7px',
                  flexShrink: 0,
                }}
              >
                {c.taskCount}
              </span>
            </button>
          )
        })}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { key: 'name', placeholder: 'Nombre *', required: true },
            { key: 'location', placeholder: 'Ciudad' },
            { key: 'role', placeholder: 'Rol' },
          ].map(({ key, placeholder, required }) => (
            <input
              key={key}
              required={required}
              placeholder={placeholder}
              value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              style={inputStyle}
            />
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ fontSize: 12, color: 'var(--td-text-muted)' }}>Color:</label>
            <input
              type="color"
              value={form.color_hex}
              onChange={e => setForm(f => ({ ...f, color_hex: e.target.value }))}
              style={{ width: 32, height: 28, border: 'none', cursor: 'pointer', borderRadius: 4 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={saving} style={btnPrimaryStyle}>
              {saving ? 'Guardando...' : 'Añadir'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} style={btnSecondaryStyle}>
              <X size={14} />
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          style={{
            marginTop: 10,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            padding: '7px',
            borderRadius: 8,
            border: '1px dashed var(--td-border)',
            background: 'transparent',
            color: 'var(--td-text-muted)',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          <Plus size={13} /> Colaborador
        </button>
      )}
    </section>
  )
}

const inputStyle = {
  width: '100%',
  padding: '6px 10px',
  border: '1px solid var(--td-border)',
  borderRadius: 6,
  fontSize: 13,
  fontFamily: 'DM Sans, sans-serif',
  outline: 'none',
  background: 'var(--td-white)',
}

const btnPrimaryStyle = {
  flex: 1,
  padding: '6px',
  background: 'var(--td-burgundy)',
  color: 'var(--td-white)',
  border: 'none',
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
}

const btnSecondaryStyle = {
  padding: '6px 10px',
  background: 'var(--td-cream)',
  color: 'var(--td-text-muted)',
  border: '1px solid var(--td-border)',
  borderRadius: 6,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
}
