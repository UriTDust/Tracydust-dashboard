import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const ROLES   = ['Proveedor', 'Socio de diseño', 'Fabricante', 'Distribuidor', 'Prensa', 'Hombre de influencia', 'Inversor', 'Otro']
const ESTADOS = ['Dirigir', 'Activo', 'Inactivo']
const EMPTY   = { name: '', company: '', email: '', phone: '', role: '', status: 'Dirigir', notes: '' }

export function ContactModal({ mode, contact, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    setForm(mode === 'edit' && contact ? { ...EMPTY, ...contact } : EMPTY)
  }, [mode, contact])

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
    onClose()
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        style={{
          background: 'var(--td-white)',
          borderRadius: 16,
          width: '100%',
          maxWidth: 520,
          padding: 28,
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'slideUp 0.2s ease',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, fontSize: 20, color: 'var(--td-text-primary)' }}>
            {mode === 'edit' ? 'Editar contacto' : 'Nuevo contacto'}
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'var(--td-cream)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--td-text-muted)' }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="NOMBRE *">
            <input required placeholder="Nombre completo" value={form.name} onChange={set('name')} style={inputStyle} />
          </Field>

          <Field label="COMPAÑÍA">
            <input placeholder="Empresa o marca" value={form.company} onChange={set('company')} style={inputStyle} />
          </Field>

          <Field label="CORREO ELECTRÓNICO">
            <input type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={set('email')} style={inputStyle} />
          </Field>

          <Field label="TELÉFONO">
            <input placeholder="+34 600 000 000" value={form.phone} onChange={set('phone')} style={inputStyle} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="ROLE">
              <select value={form.role} onChange={set('role')} style={inputStyle}>
                <option value="">Seleccionar rol...</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="ESTADO">
              <select value={form.status} onChange={set('status')} style={inputStyle}>
                {ESTADOS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <Field label="NOTAS">
            <textarea rows={3} placeholder="Notas adicionales..." value={form.notes} onChange={set('notes')} style={{ ...inputStyle, resize: 'vertical' }} />
          </Field>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose} style={btnCancel}>Cancelar</button>
            <button type="submit" style={btnSave}>
              {mode === 'edit' ? 'Guardar cambios' : 'Agregar contacto'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
      `}</style>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--td-text-muted)', letterSpacing: '0.06em', marginBottom: 5 }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '9px 12px',
  border: '1px solid var(--td-border)',
  borderRadius: 8,
  fontSize: 13,
  fontFamily: 'DM Sans, sans-serif',
  color: 'var(--td-text-primary)',
  background: 'var(--td-white)',
  outline: 'none',
}

const btnCancel = {
  padding: '9px 20px',
  border: '1px solid var(--td-border)',
  borderRadius: 8,
  background: 'var(--td-white)',
  color: 'var(--td-text-muted)',
  fontSize: 13,
  fontFamily: 'DM Sans, sans-serif',
  cursor: 'pointer',
}

const btnSave = {
  padding: '9px 24px',
  border: 'none',
  borderRadius: 8,
  background: 'var(--td-burgundy)',
  color: 'var(--td-white)',
  fontSize: 13,
  fontWeight: 500,
  fontFamily: 'DM Sans, sans-serif',
  cursor: 'pointer',
}
