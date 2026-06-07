import React from 'react'
import { Building2, Users, FileText, TrendingUp } from 'lucide-react'
import { Card, Badge, fmt, statusBadge } from './UI'

function Metric({ icon: Icon, label, value, sub, color }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '20px 22px',
      display: 'flex', flexDirection: 'column', gap: 12,
      boxShadow: 'var(--shadow)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>{label}</span>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} color={color} />
        </div>
      </div>
      <div>
        <div style={{ fontSize: 30, fontFamily: 'DM Serif Display, serif' }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 3 }}>{sub}</div>}
      </div>
    </div>
  )
}

export default function Dashboard({ imoveis, clientes, contratos, setPage }) {
  const disponiveis = imoveis.filter(i => i.status === 'disponivel').length
  const valorTotal = imoveis.reduce((s, i) => s + Number(i.valor || 0), 0)

  return (
    <div className="animate-in">
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: 'var(--text-2)', fontSize: 14 }}>Visão geral do seu portfólio</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
        <Metric icon={Building2} label="Imóveis cadastrados" value={imoveis.length} sub={`${disponiveis} disponíveis`} color="#1A6B4A" />
        <Metric icon={TrendingUp} label="Valor do portfólio" value={valorTotal > 0 ? 'R$ ' + (valorTotal / 1e6).toFixed(1) + 'M' : '—'} sub="soma dos imóveis" color="#1D4ED8" />
        <Metric icon={Users} label="Clientes" value={clientes.length} sub="com consentimento LGPD" color="#B45309" />
        <Metric icon={FileText} label="Contratos gerados" value={contratos.length} sub="histórico total" color="#7C3AED" />
      </div>

      {/* Recent listings */}
      <Card>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 17 }}>Imóveis recentes</h2>
          <button onClick={() => setPage('imoveis')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>Ver todos →</button>
        </div>
        {imoveis.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-3)', fontSize: 14 }}>Nenhum imóvel cadastrado ainda.</div>
        ) : (
          <div>
            {imoveis.slice(0, 5).map((im, i) => (
              <div key={im.id} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
                borderBottom: i < Math.min(imoveis.length, 5) - 1 ? '1px solid var(--border)' : 'none',
              }}>
                {/* Thumbnail */}
                <div style={{
                  width: 52, height: 52, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
                  background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {im.foto_principal ? (
                    <img src={im.foto_principal} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Building2 size={20} color="var(--text-3)" />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {im.categoria} — {im.endereco?.split(',')[0]}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>
                    {im.tipo === 'comercial' ? 'Comercial' : 'Residencial'} · {im.area ? im.area + ' m²' : ''}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{fmt(im.valor)}</div>
                  <div style={{ marginTop: 4 }}>{statusBadge(im.status)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}
