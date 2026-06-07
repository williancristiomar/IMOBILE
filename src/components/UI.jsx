import React from 'react'
import { Loader2 } from 'lucide-react'

const s = {
  // Buttons
  btn: (variant = 'default', size = 'md') => ({
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontFamily: 'inherit', fontWeight: 500, cursor: 'pointer',
    border: 'none', borderRadius: 10, transition: 'all 0.15s',
    fontSize: size === 'sm' ? 13 : size === 'lg' ? 16 : 14,
    padding: size === 'sm' ? '6px 14px' : size === 'lg' ? '12px 24px' : '9px 18px',
    ...(variant === 'primary' ? {
      background: 'var(--accent)', color: '#fff',
    } : variant === 'ghost' ? {
      background: 'transparent', color: 'var(--text-2)',
      border: '1px solid var(--border)',
    } : variant === 'danger' ? {
      background: 'var(--red-light)', color: 'var(--red)',
    } : {
      background: 'var(--surface)', color: 'var(--text)',
      border: '1px solid var(--border-med)',
      boxShadow: 'var(--shadow)',
    }),
  }),
}

export function Btn({ variant, size, loading, children, style, ...props }) {
  return (
    <button style={{ ...s.btn(variant, size), opacity: loading ? 0.7 : 1, ...style }} {...props}>
      {loading ? <Loader2 size={14} className="animate-spin" /> : children}
    </button>
  )
}

export function Input({ label, error, style, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</label>}
      <input style={{
        padding: '10px 14px', borderRadius: 10, border: `1px solid ${error ? 'var(--red)' : 'var(--border-med)'}`,
        background: 'var(--surface)', color: 'var(--text)', fontSize: 14, outline: 'none',
        transition: 'border 0.15s', width: '100%', ...style
      }} {...props} />
      {error && <span style={{ fontSize: 12, color: 'var(--red)' }}>{error}</span>}
    </div>
  )
}

export function Select({ label, children, style, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</label>}
      <select style={{
        padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-med)',
        background: 'var(--surface)', color: 'var(--text)', fontSize: 14, outline: 'none',
        appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6B72' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 36,
        width: '100%', cursor: 'pointer', ...style
      }} {...props}>
        {children}
      </select>
    </div>
  )
}

export function Textarea({ label, style, ...props }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{label}</label>}
      <textarea style={{
        padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border-med)',
        background: 'var(--surface)', color: 'var(--text)', fontSize: 14, outline: 'none',
        resize: 'vertical', minHeight: 90, width: '100%', lineHeight: 1.6, ...style
      }} {...props} />
    </div>
  )
}

export function Card({ children, style, ...props }) {
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)', boxShadow: 'var(--shadow)',
      overflow: 'hidden', ...style
    }} {...props}>
      {children}
    </div>
  )
}

export function Badge({ color = 'green', children }) {
  const map = {
    green: { bg: 'var(--accent-light)', color: 'var(--accent-text)' },
    amber: { bg: 'var(--amber-light)', color: 'var(--amber)' },
    red: { bg: 'var(--red-light)', color: 'var(--red)' },
    blue: { bg: 'var(--blue-light)', color: 'var(--blue)' },
    gray: { bg: 'var(--surface2)', color: 'var(--text-2)' },
  }
  const c = map[color] || map.gray
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600,
      background: c.bg, color: c.color,
    }}>
      {children}
    </span>
  )
}

export function Spinner({ size = 20 }) {
  return <Loader2 size={size} className="animate-spin" style={{ color: 'var(--accent)' }} />
}

export function Empty({ icon, title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-3)' }}>
      <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>{icon}</div>
      <p style={{ fontWeight: 600, color: 'var(--text-2)', marginBottom: 4 }}>{title}</p>
      <p style={{ fontSize: 13 }}>{subtitle}</p>
    </div>
  )
}

export function Modal({ open, onClose, title, children, width = 560 }) {
  if (!open) return null
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16,
    }}>
      <div onClick={e => e.stopPropagation()} className="animate-in" style={{
        background: 'var(--surface)', borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: width,
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 20 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 22, lineHeight: 1, padding: 4 }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  )
}

export function FormGrid({ children, cols = 2 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>
      {children}
    </div>
  )
}

export function FullCol({ children }) {
  return <div style={{ gridColumn: '1 / -1' }}>{children}</div>
}

export function toast(msg, type = 'success') {
  const el = document.createElement('div')
  el.innerText = msg
  Object.assign(el.style, {
    position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
    background: type === 'error' ? '#DC2626' : '#1A6B4A',
    color: '#fff', padding: '12px 20px', borderRadius: 12,
    fontSize: 14, fontWeight: 500, boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    animation: 'fadeIn 0.2s ease',
    fontFamily: 'DM Sans, sans-serif',
  })
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 3000)
}

export function fmt(v) {
  return 'R$ ' + Number(v).toLocaleString('pt-BR')
}

export function statusBadge(s) {
  if (s === 'disponivel') return <Badge color="green">Disponível</Badge>
  if (s === 'negociacao') return <Badge color="amber">Em negociação</Badge>
  return <Badge color="blue">Vendido</Badge>
}
