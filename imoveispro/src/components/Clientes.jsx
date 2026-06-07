import React, { useState } from 'react'
import { Plus, Trash2, ShieldCheck, ChevronLeft, User } from 'lucide-react'
import { Card, Btn, Input, Select, FormGrid, FullCol, Badge, Empty, Modal, toast } from './UI'
import { createCliente, deleteCliente } from '../lib/supabase'

function ClienteRow({ c, onDelete }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
      borderBottom: '1px solid var(--border)', transition: 'background 0.12s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
      onMouseLeave={e => e.currentTarget.style.background = ''}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 99, flexShrink: 0,
        background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'DM Serif Display, serif', fontSize: 16, color: 'var(--accent)',
      }}>
        {c.nome?.charAt(0).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{c.nome}</div>
        <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 1 }}>CPF: {c.cpf} · {c.email}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <Badge color="gray">{c.interesse}</Badge>
        <Badge color="green"><ShieldCheck size={11} /> LGPD</Badge>
        <button onClick={() => onDelete(c)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-3)', padding: 4, borderRadius: 6,
          transition: 'color 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  )
}

export default function Clientes({ clientes, setClientes }) {
  const [view, setView] = useState('list')
  const [saving, setSaving] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [lgpdChecked, setLgpdChecked] = useState(false)
  const [form, setForm] = useState({ nome: '', cpf: '', email: '', telefone: '', interesse: 'Apartamento residencial' })

  async function handleSave() {
    if (!form.nome || !form.cpf) { toast('Preencha nome e CPF.', 'error'); return }
    if (!lgpdChecked) { toast('O consentimento LGPD é obrigatório.', 'error'); return }
    setSaving(true)
    try {
      const created = await createCliente({ ...form, consentimento_lgpd: true })
      setClientes(prev => [created, ...prev])
      toast('Cliente cadastrado!')
      setView('list')
      setForm({ nome: '', cpf: '', email: '', telefone: '', interesse: 'Apartamento residencial' })
      setLgpdChecked(false)
    } catch (e) {
      toast(e.message, 'error')
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!deleteModal) return
    try {
      await deleteCliente(deleteModal.id)
      setClientes(prev => prev.filter(c => c.id !== deleteModal.id))
      toast('Cliente removido.')
    } catch (e) {
      toast(e.message, 'error')
    }
    setDeleteModal(null)
  }

  if (view === 'form') return (
    <div className="animate-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14 }}>
          <ChevronLeft size={16} /> Voltar
        </button>
        <h1 style={{ fontSize: 24 }}>Novo cliente</h1>
      </div>

      {/* LGPD banner */}
      <div style={{
        background: 'var(--blue-light)', border: '1px solid #BFDBFE',
        borderRadius: 'var(--radius)', padding: '14px 18px', marginBottom: 20,
        display: 'flex', gap: 12, alignItems: 'flex-start',
      }}>
        <ShieldCheck size={18} style={{ color: 'var(--blue)', flexShrink: 0, marginTop: 1 }} />
        <div>
          <p style={{ fontSize: 13, color: '#1E40AF', fontWeight: 600, marginBottom: 2 }}>Conformidade com a LGPD — Lei nº 13.709/2018</p>
          <p style={{ fontSize: 12, color: '#1E40AF', lineHeight: 1.6 }}>
            Os dados coletados são usados exclusivamente para intermediação imobiliária. O titular pode solicitar acesso, correção ou exclusão de seus dados a qualquer momento.
          </p>
        </div>
      </div>

      <Card style={{ overflow: 'visible' }}>
        <div style={{ padding: 24 }}>
          <FormGrid>
            <Input label="Nome completo" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} placeholder="Nome do cliente" />
            <Input label="CPF" value={form.cpf} onChange={e => setForm(f => ({ ...f, cpf: e.target.value }))} placeholder="000.000.000-00" />
            <Input label="E-mail" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@exemplo.com" />
            <Input label="Telefone / WhatsApp" value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} placeholder="(27) 99999-0000" />
            <FullCol>
              <Select label="Interesse de compra" value={form.interesse} onChange={e => setForm(f => ({ ...f, interesse: e.target.value }))}>
                <option>Apartamento residencial</option>
                <option>Casa residencial</option>
                <option>Terreno</option>
                <option>Imóvel comercial</option>
              </Select>
            </FullCol>
            <FullCol>
              <label style={{
                display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer',
                background: lgpdChecked ? 'var(--accent-light)' : 'var(--surface2)',
                borderRadius: 'var(--radius)', padding: '14px 16px',
                border: `1px solid ${lgpdChecked ? 'var(--accent)' : 'var(--border-med)'}`,
                transition: 'all 0.2s',
              }}>
                <input
                  type="checkbox" checked={lgpdChecked}
                  onChange={e => setLgpdChecked(e.target.checked)}
                  style={{ marginTop: 2, accentColor: 'var(--accent)', width: 16, height: 16, flexShrink: 0 }}
                />
                <span style={{ fontSize: 13, color: lgpdChecked ? 'var(--accent-text)' : 'var(--text-2)', lineHeight: 1.6 }}>
                  <strong>Consentimento obrigatório:</strong> O cliente declara ter lido e concordado com a Política de Privacidade e autoriza o uso de seus dados pessoais para fins de intermediação imobiliária, conforme a LGPD.
                </span>
              </label>
            </FullCol>
          </FormGrid>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <Btn onClick={() => setView('list')}>Cancelar</Btn>
            <Btn variant="primary" loading={saving} onClick={handleSave}>
              <ShieldCheck size={15} /> Salvar com consentimento
            </Btn>
          </div>
        </div>
      </Card>
    </div>
  )

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28 }}>Clientes</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 3 }}>{clientes.length} cliente{clientes.length !== 1 ? 's' : ''} com consentimento LGPD</p>
        </div>
        <Btn variant="primary" onClick={() => setView('form')}><Plus size={16} /> Novo cliente</Btn>
      </div>

      <Card style={{ overflow: 'hidden', padding: 0 }}>
        {clientes.length === 0 ? (
          <Empty icon="👥" title="Nenhum cliente cadastrado" subtitle="Clique em 'Novo cliente' para começar" />
        ) : (
          clientes.map(c => <ClienteRow key={c.id} c={c} onDelete={setDeleteModal} />)
        )}
      </Card>

      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Remover cliente" width={420}>
        <p style={{ color: 'var(--text-2)', marginBottom: 6 }}>Deseja remover <strong>{deleteModal?.nome}</strong> do cadastro?</p>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 20 }}>Conforme a LGPD, todos os dados pessoais deste cliente serão excluídos permanentemente.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Btn onClick={() => setDeleteModal(null)}>Cancelar</Btn>
          <Btn variant="danger" onClick={handleDelete}>Remover e excluir dados</Btn>
        </div>
      </Modal>
    </div>
  )
}
