import { useState, useMemo } from 'react'
import { Plus, Pencil, Trash2, Mail, Phone, Search } from 'lucide-react'
import { Avatar } from '../components/ui/Avatar'
import { useContacts } from '../hooks/useSheets'
import { ContactModal } from '../components/crm/ContactModal'

const STATUS_CFG = {
  Activo:   { bg: '#ECFDF5', color: '#065F46', border: '#6EE7B7' },
  Inactivo: { bg: '#F0F0F5', color: '#6B7280', border: '#C7C7DC' },
  Dirigir:  { bg: '#FEF9EC', color: '#B45309', border: '#FCD34D' },
}

const ROLE_BG = {
  'Proveedor':           '#EDE9FE',
  'Socio de diseño':     '#F0FDF4',
  'Fabricante':          '#FEF3C7',
  'Distribuidor':        '#EFF6FF',
  'Prensa':              '#FDF2F8',
  'Hombre de influencia':'#FFF7ED',
  'Inversor':            '#F0FDF4',
  'Otro':                '#F3F4F6',
}

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.Inactivo
  return (
    <span style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap' }}>
      {status}
    </span>
  )
}

function RoleBadge({ role }) {
  if (!role) return <span style={{ color: 'var(--td-text-muted)', fontSize: 12 }}>—</span>
  return (
    <span style={{ background: ROLE_BG[role] || '#F5F0E8', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 500, color: 'var(--td-text-primary)', whiteSpace: 'nowrap' }}>
      {role}
    </span>
  )
}

function getInitials(name) {
  const parts = name.trim().split(' ')
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

function getAvatarColor(name) {
  const palette = ['#6B0F1A', '#C9A96E', '#2D6A4F', '#1A1A2E', '#8B2030', '#4A5568']
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return palette[Math.abs(hash) % palette.length]
}

export function CRMPage() {
  const { contacts, create, update, remove } = useContacts()
  const [search,     setSearch]     = useState('')
  const [roleFilter, setRoleFilter] = useState(null)
  const [modal,      setModal]      = useState(null)

  const stats = {
    dirigir:  contacts.filter(c => c.status === 'Dirigir').length,
    activo:   contacts.filter(c => c.status === 'Activo').length,
    inactivo: contacts.filter(c => c.status === 'Inactivo').length,
  }

  const allRoles = [...new Set(contacts.map(c => c.role).filter(Boolean))]

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return contacts.filter(c => {
      const matchSearch = !q
        || c.name.toLowerCase().includes(q)
        || (c.company || '').toLowerCase().includes(q)
        || (c.email   || '').toLowerCase().includes(q)
        || (c.phone   || '').includes(q)
      const matchRole = !roleFilter || c.role === roleFilter
      return matchSearch && matchRole
    })
  }, [contacts, search, roleFilter])

  const handleSave = (data) => {
    if (modal.mode === 'edit') update(modal.contact.id, data)
    else                       create(data)
  }

  const handleDelete = (contact) => {
    if (!window.confirm(`¿Eliminar el contacto "${contact.name}"?`)) return
    remove(contact.id)
  }

  return (
    <div style={{ padding: '28px 36px' }}>

      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 24, color: 'var(--td-text-primary)' }}>
            CRM — Contactos
          </h1>
          <p style={{ fontSize: 13, color: 'var(--td-text-muted)', marginTop: 3 }}>{contacts.length} contactos</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'create' })}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'var(--td-burgundy)', color: 'var(--td-white)', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}
        >
          <Plus size={15} /> Contacto
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'DIRIGIR',  value: stats.dirigir,  dot: '#F59E0B' },
          { label: 'ACTIVO',   value: stats.activo,   dot: '#10B981' },
          { label: 'INACTIVO', value: stats.inactivo, dot: '#9CA3AF' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--td-white)', border: '1px solid var(--td-border)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--td-text-muted)', letterSpacing: '0.08em', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--td-text-primary)', fontFamily: 'DM Sans, sans-serif' }}>{s.value}</div>
            </div>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.dot }} />
          </div>
        ))}
      </div>

      {/* Search + role filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--td-text-muted)', pointerEvents: 'none' }} />
          <input
            placeholder="Buscar contactos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '9px 12px 9px 34px', border: '1px solid var(--td-border)', borderRadius: 8, fontSize: 13, fontFamily: 'DM Sans, sans-serif', background: 'var(--td-white)', outline: 'none' }}
          />
        </div>
        {allRoles.map(role => (
          <button
            key={role}
            onClick={() => setRoleFilter(roleFilter === role ? null : role)}
            style={{
              padding: '7px 14px',
              borderRadius: 8,
              border: `1px solid ${roleFilter === role ? 'var(--td-burgundy)' : 'var(--td-border)'}`,
              background: roleFilter === role ? 'var(--td-burgundy)' : 'var(--td-white)',
              color: roleFilter === role ? 'var(--td-white)' : 'var(--td-text-muted)',
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'all 0.12s',
            }}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'var(--td-white)', border: '1px solid var(--td-border)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--td-cream-soft)' }}>
              {['NOMBRE', 'COMPAÑÍA', 'CONTACTO', 'ROLE', 'ESTADO', 'NOTAS', ''].map((h, i) => (
                <th key={i} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: 'var(--td-text-muted)', letterSpacing: '0.06em', borderBottom: '1px solid var(--td-border)', fontFamily: 'DM Sans, sans-serif' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: 40, textAlign: 'center', color: 'var(--td-text-muted)', fontSize: 13 }}>
                  No se encontraron contactos
                </td>
              </tr>
            )}
            {filtered.map((contact, i) => {
              const isEven = i % 2 === 0
              return (
                <tr
                  key={contact.id}
                  style={{ background: isEven ? 'var(--td-white)' : 'var(--td-cream-soft)', transition: 'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F5EDE5'}
                  onMouseLeave={e => e.currentTarget.style.background = isEven ? 'var(--td-white)' : 'var(--td-cream-soft)'}
                >
                  <td style={td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Avatar initials={getInitials(contact.name)} color={getAvatarColor(contact.name)} size={32} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--td-text-primary)' }}>{contact.name}</span>
                    </div>
                  </td>
                  <td style={td}>
                    <span style={{ fontSize: 13, color: 'var(--td-text-muted)' }}>{contact.company || '—'}</span>
                  </td>
                  <td style={td}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {contact.email && (
                        <a href={`mailto:${contact.email}`} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--td-burgundy)', textDecoration: 'none' }}>
                          <Mail size={11} /> {contact.email}
                        </a>
                      )}
                      {contact.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--td-text-muted)' }}>
                          <Phone size={11} /> {contact.phone}
                        </div>
                      )}
                      {!contact.email && !contact.phone && <span style={{ fontSize: 12, color: 'var(--td-text-muted)' }}>—</span>}
                    </div>
                  </td>
                  <td style={td}><RoleBadge role={contact.role} /></td>
                  <td style={td}><StatusBadge status={contact.status} /></td>
                  <td style={{ ...td, maxWidth: 200 }}>
                    <span style={{ fontSize: 12, color: 'var(--td-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                      {contact.notes || '—'}
                    </span>
                  </td>
                  <td style={{ ...td, width: 80 }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        onClick={() => setModal({ mode: 'edit', contact })}
                        title="Editar"
                        style={iconBtn}
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(contact)}
                        title="Eliminar"
                        style={{ ...iconBtn, color: '#DC2626' }}
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

      {modal && (
        <ContactModal
          mode={modal.mode}
          contact={modal.contact}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

const td      = { padding: '12px 16px', borderBottom: '1px solid var(--td-border)', verticalAlign: 'middle' }
const iconBtn = { padding: 5, border: '1px solid var(--td-border)', borderRadius: 6, background: 'transparent', color: 'var(--td-text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.1s' }
