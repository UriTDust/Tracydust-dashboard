import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { useTasks } from '../../hooks/useSheets'

const PHASES = [
  'Diagnosis',
  'Vision and objectives',
  'Product development',
  'Supplier sourcing',
  'Prototype',
  'Branding',
  'Marketing pre-launch',
  'Production',
  'Launch',
]

const EMPTY_FORM = {
  title: '',
  owner: '',
  deadline: '',
  status: 'not_started',
  timeline_col: 'now',
  phase: '',
  notes: '',
}

export function TaskModal({ mode, task, onClose }) {
  const { collaborators } = useApp()
  const { create, update } = useTasks()
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (mode === 'edit' && task) {
      setForm({
        title: task.title || '',
        owner: task.owner || '',
        deadline: task.deadline || '',
        status: task.status || 'not_started',
        timeline_col: task.timeline_col || 'now',
        phase: task.phase || '',
        notes: task.notes || '',
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [mode, task])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (mode === 'edit') {
        await update(task.id, form)
      } else {
        const id = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()
        await create({ ...form, id })
      }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.15s ease',
      }}
    >
      <div
        style={{
          background: 'var(--td-white)',
          borderRadius: '16px 16px 0 0',
          width: '100%',
          maxWidth: 600,
          padding: '28px 28px 32px',
          animation: 'slideUp 0.2s ease',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 600,
              fontSize: 20,
              color: 'var(--td-text-primary)',
            }}
          >
            {mode === 'edit' ? 'Editar tarea' : 'Nueva tarea'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'var(--td-cream)',
              border: 'none',
              borderRadius: 8,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--td-text-muted)',
            }}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Título *">
            <input
              required
              placeholder="Nombre de la tarea"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              style={inputStyle}
            />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Owner">
              <select
                value={form.owner}
                onChange={e => setForm(f => ({ ...f, owner: e.target.value }))}
                style={inputStyle}
              >
                <option value="">— Sin asignar —</option>
                {collaborators.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Deadline">
              <input
                type="date"
                value={form.deadline}
                onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                style={inputStyle}
              />
            </Field>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <Field label="Estado">
              <select
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                style={inputStyle}
              >
                <option value="not_started">Not started</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </Field>

            <Field label="Timeline">
              <select
                value={form.timeline_col}
                onChange={e => setForm(f => ({ ...f, timeline_col: e.target.value }))}
                style={inputStyle}
              >
                <option value="now">Now</option>
                <option value="next">Next</option>
                <option value="later">Later</option>
              </select>
            </Field>

            <Field label="Fase">
              <select
                value={form.phase}
                onChange={e => setForm(f => ({ ...f, phase: e.target.value }))}
                style={inputStyle}
              >
                <option value="">— Sin fase —</option>
                {PHASES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Notas">
            <textarea
              rows={3}
              placeholder="Notas adicionales..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </Field>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
            <button type="button" onClick={onClose} style={btnCancelStyle}>
              Cancelar
            </button>
            <button type="submit" disabled={saving} style={btnSaveStyle}>
              {saving ? 'Guardando...' : mode === 'edit' ? 'Guardar cambios' : 'Crear tarea'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--td-text-muted)',
          marginBottom: 5,
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid var(--td-border)',
  borderRadius: 8,
  fontSize: 13,
  fontFamily: 'DM Sans, sans-serif',
  color: 'var(--td-text-primary)',
  background: 'var(--td-white)',
  outline: 'none',
  transition: 'border-color 0.15s',
}

const btnCancelStyle = {
  padding: '9px 20px',
  border: '1px solid var(--td-border)',
  borderRadius: 8,
  background: 'var(--td-white)',
  color: 'var(--td-text-muted)',
  fontSize: 13,
  fontFamily: 'DM Sans, sans-serif',
  cursor: 'pointer',
}

const btnSaveStyle = {
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
