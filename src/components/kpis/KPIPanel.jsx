import { useKPIs, useProdKPIs, useFinKPIs } from '../../hooks/useSheets'
import { useApp } from '../../context/AppContext'

export function KPIPanel() {
  const { setActiveTab } = useApp()
  const { kpis }         = useKPIs()
  const { prodKPIs }     = useProdKPIs()
  const { finKPIs }      = useFinKPIs()

  // Seguidores IG desde kpis array (id '2')
  const igKpi       = kpis.find(k => k.id === '2')
  const igValue     = parseFloat(igKpi?.value) || 0
  const igObjetivo  = parseFloat(igKpi?.ig_objetivo) || 450
  const igPct       = igObjetivo > 0 ? Math.min(100, Math.round((igValue / igObjetivo) * 100)) : 0

  const beneficioSemana = finKPIs.facturacion_semana - finKPIs.gastos_semana

  const items = [
    { label: "LP's Hechas",      value: prodKPIs.lps_hechas,              suffix: '' },
    { label: "OBV's Totales",    value: prodKPIs.obv_totales,             suffix: '' },
    { label: 'Facturación',      value: `${finKPIs.facturacion_acumulada} €`, suffix: '' },
    { label: 'Beneficio semana', value: `${beneficioSemana} €`,           suffix: '' },
  ]

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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map(item => (
          <div
            key={item.label}
            style={{
              background: 'var(--td-cream-soft)',
              border: '1px solid var(--td-border)',
              borderRadius: 8,
              padding: '8px 12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 12, color: 'var(--td-text-muted)' }}>{item.label}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--td-burgundy)', fontFamily: 'DM Sans, sans-serif' }}>
              {item.value}{item.suffix}
            </span>
          </div>
        ))}

        {/* Seguidores IG con barra */}
        <div
          style={{
            background: 'var(--td-cream-soft)',
            border: '1px solid var(--td-border)',
            borderRadius: 8,
            padding: '8px 12px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: 'var(--td-text-muted)' }}>Seguidores IG</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--td-burgundy)', fontFamily: 'DM Sans, sans-serif' }}>
              {igValue}
            </span>
          </div>
          <div style={{ background: 'var(--td-border)', borderRadius: 3, height: 4, overflow: 'hidden' }}>
            <div style={{ width: `${igPct}%`, height: '100%', background: 'var(--td-gold)', borderRadius: 3, transition: 'width 0.3s' }} />
          </div>
          <div style={{ fontSize: 10, color: 'var(--td-text-muted)', marginTop: 3, textAlign: 'right' }}>
            {igPct}% de {igObjetivo}
          </div>
        </div>
      </div>

      <button
        onClick={() => setActiveTab('kpis')}
        style={{
          marginTop: 10,
          width: '100%',
          padding: '7px',
          background: 'transparent',
          border: 'none',
          color: 'var(--td-burgundy)',
          fontSize: 12,
          fontWeight: 500,
          cursor: 'pointer',
          textAlign: 'center',
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        Ver todos los KPIs →
      </button>
    </section>
  )
}
