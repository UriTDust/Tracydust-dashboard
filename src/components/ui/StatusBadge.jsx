const STATUS_CONFIG = {
  in_progress: {
    label: 'In progress',
    bg: '#FEF9EC',
    color: '#B45309',
    border: '#FCD34D',
  },
  not_started: {
    label: 'Not started',
    bg: '#F0F0F5',
    color: '#1A1A2E',
    border: '#C7C7DC',
  },
  done: {
    label: 'Done',
    bg: '#ECFDF5',
    color: '#065F46',
    border: '#6EE7B7',
  },
}

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.not_started
  return (
    <span
      style={{
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.border}`,
        borderRadius: '6px',
        padding: '3px 10px',
        fontSize: '12px',
        fontWeight: 500,
        fontFamily: 'DM Sans, sans-serif',
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.label}
    </span>
  )
}
