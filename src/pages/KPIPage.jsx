import { useState } from 'react'
import { FileText, TrendingUp, CheckCircle } from 'lucide-react'
import { useKPIs, useProdKPIs, useFinKPIs } from '../hooks/useSheets'

// ─── Inline editable number ──────────────────────────────────────────────────
function EditableNumber({ value, onSave, suffix = '', compact = false }) {
  const [editing, setEditing] = useState(false)
  const [draft,   setDraft]   = useState('')
  const open = () => { setDraft(String(value)); setEditing(true) }
  const save = () => { onSave(parseFloat(draft) || 0); setEditing(false) }
  const size = compact ? 15 : 28
  if (editing) {
    return (
      <input autoFocus value={draft} onChange={e => setDraft(e.target.value)} onBlur={save} onKeyDown={e => e.key === 'Enter' && save()}
        style={{ width: compact ? 70 : 90, border: '1px solid var(--td-burgundy)', borderRadius: 4, padding: compact ? '2px 6px' : '3px 8px', fontSize: size, fontWeight: 700, fontFamily: 'DM Sans, sans-serif', color: 'var(--td-burgundy)', background: 'var(--td-white)', outline: 'none' }} />
    )
  }
  return (
    <span onClick={open} title="Click para editar"
      style={{ fontSize: size, fontWeight: 700, color: 'var(--td-burgundy)', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' }}>
      {value}{suffix}
    </span>
  )
}

// ─── Inline editable text ─────────────────────────────────────────────────────
function EditableText({ value, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft,   setDraft]   = useState('')
  const open = () => { setDraft(value); setEditing(true) }
  const save = () => { onSave(draft); setEditing(false) }
  if (editing) {
    return (
      <input autoFocus value={draft} onChange={e => setDraft(e.target.value)} onBlur={save} onKeyDown={e => e.key === 'Enter' && save()}
        style={{ width: 100, border: '1px solid var(--td-burgundy)', borderRadius: 4, padding: '3px 8px', fontSize: 28, fontWeight: 700, fontFamily: 'DM Sans, sans-serif', color: 'var(--td-burgundy)', background: 'var(--td-white)', outline: 'none' }} />
    )
  }
  return (
    <span onClick={open} title="Click para editar"
      style={{ fontSize: 28, fontWeight: 700, color: 'var(--td-burgundy)', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' }}>
      {value}
    </span>
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────
function ProgressBar({ value, max, color = 'var(--td-burgundy)' }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0
  return (
    <div>
      <div style={{ background: 'var(--td-border)', borderRadius: 4, height: 6, overflow: 'hidden', marginBottom: 4 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.3s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--td-text-muted)' }}>
        <span>{value} / {max}</span>
        <span>{Math.round(pct)}%</span>
      </div>
    </div>
  )
}

// ─── Editable objective ───────────────────────────────────────────────────────
function EditableObjective({ value, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft,   setDraft]   = useState('')
  const open = () => { setDraft(String(value)); setEditing(true) }
  const save = () => { onSave(parseFloat(draft) || 0); setEditing(false) }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--td-text-muted)', marginTop: 5 }}>
      <span>Objetivo:</span>
      {editing ? (
        <input autoFocus value={draft} onChange={e => setDraft(e.target.value)} onBlur={save} onKeyDown={e => e.key === 'Enter' && save()}
          style={{ width: 55, border: '1px solid var(--td-burgundy)', borderRadius: 3, padding: '1px 5px', fontSize: 11, outline: 'none', fontFamily: 'DM Sans, sans-serif' }} />
      ) : (
        <span onClick={open} style={{ cursor: 'pointer', textDecoration: 'underline dotted', color: 'var(--td-burgundy)', fontWeight: 600 }} title="Click para editar objetivo">
          {value}
        </span>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function KPIPage() {
  const { kpis,     update: updateKPI  } = useKPIs()
  const { prodKPIs, update: updateProd } = useProdKPIs()
  const { finKPIs,  update: updateFin  } = useFinKPIs()

  const facturacionPct  = finKPIs.objetivo_facturacion > 0
    ? Math.min(100, (finKPIs.facturacion_acumulada / finKPIs.objetivo_facturacion) * 100) : 0
  const beneficioSemana = finKPIs.facturacion_semana - finKPIs.gastos_semana
  const utilizadoPct    = finKPIs.gastos_previstos > 0
    ? Math.round((finKPIs.gastos_semana / finKPIs.gastos_previstos) * 100) : 0
  const faltan          = finKPIs.objetivo_facturacion - finKPIs.facturacion_acumulada

  // IG KPI (id '2')
  const igKpi      = kpis.find(k => k.id === '2')
  const igValue    = parseFloat(igKpi?.value) || 0
  const igObjetivo = parseFloat(igKpi?.ig_objetivo) || 450

  return (
    <div style={{ padding: '28px 36px', maxWidth: 1000, margin: '0 auto' }}>

      {/* ── 1. KPI's (Producción) ─────────────────────────────────────────── */}
      <section style={{ marginBottom: 36 }}>
        <SectionTitle icon={<TrendingUp size={18} color="var(--td-burgundy)" />} title="KPI's" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>

          {/* LP'S HECHAS */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={labelSm}>LP'S HECHAS</div>
              <FileText size={15} color="var(--td-text-muted)" />
            </div>
            <EditableNumber value={prodKPIs.lps_hechas} onSave={v => updateProd('lps_hechas', v)} />
            <div style={{ marginTop: 12 }}>
              <ProgressBar value={prodKPIs.lps_hechas} max={prodKPIs.lps_objetivo} />
              <EditableObjective value={prodKPIs.lps_objetivo} onSave={v => updateProd('lps_objetivo', v)} />
            </div>
          </div>

          {/* LPS EN DESARROLLO */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={labelSm}>LPS EN DESARROLLO</div>
              <TrendingUp size={15} color="var(--td-text-muted)" />
            </div>
            <EditableNumber value={prodKPIs.lps_desarrollo} onSave={v => updateProd('lps_desarrollo', v)} />
          </div>

          {/* OBV's TOTALES */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={labelSm}>OBV's TOTALES</div>
              <CheckCircle size={15} color="var(--td-text-muted)" />
            </div>
            <EditableNumber value={prodKPIs.obv_totales} onSave={v => updateProd('obv_totales', v)} />
            <div style={{ marginTop: 12 }}>
              <ProgressBar value={prodKPIs.obv_totales} max={prodKPIs.obv_objetivo} />
              <EditableObjective value={prodKPIs.obv_objetivo} onSave={v => updateProd('obv_objetivo', v)} />
            </div>
          </div>

          {/* OBV's SEMANALES */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={labelSm}>OBV's SEMANALES</div>
              <span style={pctBadge}>
                {prodKPIs.obv_semanales_objetivo > 0
                  ? Math.round((prodKPIs.obv_semanales / prodKPIs.obv_semanales_objetivo) * 100) : 0}%
              </span>
            </div>
            <EditableNumber value={prodKPIs.obv_semanales} onSave={v => updateProd('obv_semanales', v)} />
            <div style={{ fontSize: 12, color: 'var(--td-text-muted)', marginTop: 4 }}>
              {prodKPIs.obv_semanales} / {prodKPIs.obv_semanales_objetivo}
            </div>
            <EditableObjective value={prodKPIs.obv_semanales_objetivo} onSave={v => updateProd('obv_semanales_objetivo', v)} />
          </div>
        </div>
      </section>

      {/* ── 2. Financiero ─────────────────────────────────────────────────── */}
      <section style={{ marginBottom: 36 }}>
        <SectionTitle icon="$" title="Financiero" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>

          <div style={card}>
            <div style={labelSm}>FACTURACIÓN ACUMULADA</div>
            <EditableNumber value={finKPIs.facturacion_acumulada} onSave={v => updateFin('facturacion_acumulada', v)} suffix=" €" />
          </div>

          <div style={card}>
            <div style={labelSm}>FACTURACIÓN ESTA SEMANA</div>
            <EditableNumber value={finKPIs.facturacion_semana} onSave={v => updateFin('facturacion_semana', v)} suffix=" €" />
          </div>

          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={labelSm}>OBJETIVO DE FACTURACIÓN</div>
              <span style={{ ...pctBadge, background: facturacionPct >= 100 ? '#ECFDF5' : '#F0F0F5', color: facturacionPct >= 100 ? '#065F46' : '#1A1A2E', borderColor: facturacionPct >= 100 ? '#6EE7B7' : '#C7C7DC' }}>
                {Math.round(facturacionPct)}%
              </span>
            </div>
            <ProgressBar value={finKPIs.facturacion_acumulada} max={finKPIs.objetivo_facturacion} color="var(--td-gold)" />
            <div style={{ fontSize: 12, color: faltan > 0 ? '#B45309' : '#065F46', marginTop: 6 }}>
              {faltan > 0 ? `Faltan ${faltan} €` : '¡Objetivo alcanzado!'}
            </div>
            <EditableObjective value={finKPIs.objetivo_facturacion} onSave={v => updateFin('objetivo_facturacion', v)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div style={card}>
            <div style={labelSm}>BENEFICIO ESTA SEMANA</div>
            <span style={{ fontSize: 28, fontWeight: 700, color: beneficioSemana >= 0 ? 'var(--td-burgundy)' : '#DC2626', fontFamily: 'DM Sans, sans-serif' }}>
              {beneficioSemana} €
            </span>
            <div style={{ fontSize: 11, color: 'var(--td-text-muted)', marginTop: 5 }}>
              Facturación semana − Gastos semana
            </div>
          </div>

          <div style={card}>
            <div style={labelSm}>BENEFICIO ACUMULADO</div>
            <EditableNumber value={finKPIs.beneficio_acumulado} onSave={v => updateFin('beneficio_acumulado', v)} suffix=" €" />
          </div>

          <div style={card}>
            <div style={{ ...labelSm, marginBottom: 12 }}>CONTROL DE GASTOS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Row label="Esta semana">
                <EditableNumber value={finKPIs.gastos_semana}    onSave={v => updateFin('gastos_semana', v)}    suffix=" €" compact />
              </Row>
              <Row label="Previstos prx. semana">
                <EditableNumber value={finKPIs.gastos_previstos} onSave={v => updateFin('gastos_previstos', v)} suffix=" €" compact />
              </Row>
              <Row label="Utilizado">
                <span style={{ fontSize: 15, fontWeight: 700, color: utilizadoPct > 100 ? '#DC2626' : 'var(--td-text-primary)', fontFamily: 'DM Sans, sans-serif' }}>
                  {utilizadoPct} %
                </span>
              </Row>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Resumen General ────────────────────────────────────────────── */}
      <section>
        <SectionTitle icon="✦" title="Resumen General" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>

          {/* Ventas semanales en pares de botas */}
          {kpis.filter(k => k.id !== '2').map(kpi => (
            <div key={kpi.id} style={card}>
              <div style={labelSm}>{kpi.category}</div>
              <div style={{ fontSize: 13, color: 'var(--td-text-muted)', marginBottom: 10 }}>{kpi.label}</div>
              <EditableText value={kpi.value} onSave={v => updateKPI(kpi.id, v)} />
            </div>
          ))}

          {/* Seguidores IG con barra de progreso */}
          {igKpi && (
            <div style={card}>
              <div style={labelSm}>{igKpi.category}</div>
              <div style={{ fontSize: 13, color: 'var(--td-text-muted)', marginBottom: 10 }}>{igKpi.label}</div>
              <EditableNumber
                value={igValue}
                onSave={v => updateKPI(igKpi.id, String(v))}
              />
              <div style={{ marginTop: 12 }}>
                <ProgressBar value={igValue} max={igObjetivo} color="var(--td-gold)" />
                <EditableObjective
                  value={igObjetivo}
                  onSave={v => updateKPI(igKpi.id, igKpi.value, v)}
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function SectionTitle({ icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
      {typeof icon === 'string'
        ? <span style={{ fontSize: 18, color: 'var(--td-burgundy)' }}>{icon}</span>
        : icon}
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 22, color: 'var(--td-text-primary)' }}>
        {title}
      </h2>
    </div>
  )
}

function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 12, color: 'var(--td-text-muted)' }}>{label}</span>
      {children}
    </div>
  )
}

const card    = { background: 'var(--td-white)', border: '1px solid var(--td-border)', borderRadius: 12, padding: '16px 18px' }
const labelSm = { fontSize: 10, fontWeight: 600, color: 'var(--td-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }
const pctBadge = { background: '#F0F0F5', color: '#1A1A2E', border: '1px solid #C7C7DC', borderRadius: 10, padding: '2px 8px', fontSize: 11, fontWeight: 600 }
