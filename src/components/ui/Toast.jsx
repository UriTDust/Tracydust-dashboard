import { CheckCircle, XCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export function Toast() {
  const { toast } = useApp()

  if (!toast) return null

  const isError = toast.type === 'error'

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        background: isError ? '#FEF2F2' : '#ECFDF5',
        border: `1px solid ${isError ? '#FECACA' : '#6EE7B7'}`,
        color: isError ? '#991B1B' : '#065F46',
        borderRadius: 10,
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 14,
        fontWeight: 500,
        zIndex: 9999,
        animation: 'slideUp 0.2s ease',
      }}
    >
      {isError
        ? <XCircle size={16} />
        : <CheckCircle size={16} />
      }
      {toast.message}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
      `}</style>
    </div>
  )
}
