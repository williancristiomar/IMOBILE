import React from 'react'
import { LayoutDashboard, Building2, Users, FileText, Menu, X } from 'lucide-react'

const nav = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'imoveis',   label: 'Imóveis',   Icon: Building2 },
  { id: 'clientes',  label: 'Clientes',  Icon: Users },
  { id: 'contratos', label: 'Contratos', Icon: FileText },
]

export default function Sidebar({ page, setPage, open, setOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div onClick={() => setOpen(false)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40,
          display: 'none',
        }} className="mobile-overlay" />
      )}

      <aside style={{
        width: 230, minWidth: 230, height: '100vh', position: 'sticky', top: 0,
        background: '#111312', display: 'flex', flexDirection: 'column',
        padding: '0 0 24px', zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Building2 size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 17, color: '#fff', lineHeight: 1.1 }}>ImoveisPRO</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>para corretores</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {nav.map(({ id, label, Icon }) => {
            const active = page === id
            return (
              <button key={id} onClick={() => { setPage(id); setOpen(false) }} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: active ? 600 : 400,
                transition: 'all 0.15s', textAlign: 'left', width: '100%',
                background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.45)',
              }}>
                <Icon size={17} />
                {label}
                {active && <div style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: 99, background: 'var(--accent)' }} />}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '0 16px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px 14px',
          }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
              Dados protegidos<br />conforme a LGPD
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
