import React, { useState, useRef } from 'react'
import { Plus, Trash2, Upload, X, Building2, Home, ChevronLeft, ImagePlus } from 'lucide-react'
import { Card, Btn, Input, Select, Textarea, FormGrid, FullCol, Badge, Empty, fmt, statusBadge, toast, Modal } from './UI'
import { createImovel, updateImovel, deleteImovel, uploadFoto } from '../lib/supabase'

const CATS_RESIDENCIAL = ['Apartamento', 'Casa', 'Terreno', 'Cobertura', 'Kitnet']
const CATS_COMERCIAL = ['Sala comercial', 'Galpão', 'Loja', 'Prédio', 'Terreno comercial']

function ImovelCard({ im, onEdit, onDelete }) {
  return (
    <div className="animate-in" style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow)',
      transition: 'box-shadow 0.2s, transform 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      {/* Photo */}
      <div style={{ height: 180, background: 'var(--surface2)', position: 'relative', overflow: 'hidden' }}>
        {im.foto_principal ? (
          <img src={im.foto_principal} alt={im.categoria} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text-3)' }}>
            <Building2 size={36} style={{ opacity: 0.3 }} />
            <span style={{ fontSize: 12 }}>Sem foto</span>
          </div>
        )}
        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          {statusBadge(im.status)}
        </div>
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <Badge color={im.tipo === 'comercial' ? 'blue' : 'gray'}>
            {im.tipo === 'comercial' ? <Building2 size={11} /> : <Home size={11} />}
            {im.tipo === 'comercial' ? 'Comercial' : 'Residencial'}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '16px 18px' }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{im.categoria}</div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 10, lineHeight: 1.4 }}>{im.endereco}</div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
          {im.area && <span style={{ fontSize: 12, color: 'var(--text-2)' }}>📐 {im.area} m²</span>}
          {im.quartos > 0 && <span style={{ fontSize: 12, color: 'var(--text-2)' }}>🛏 {im.quartos} quartos</span>}
          {im.vagas > 0 && <span style={{ fontSize: 12, color: 'var(--text-2)' }}>🚗 {im.vagas} vagas</span>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, color: 'var(--accent)' }}>{fmt(im.valor)}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn size="sm" onClick={() => onEdit(im)}>Editar</Btn>
            <Btn size="sm" variant="danger" onClick={() => onDelete(im)}><Trash2 size={13} /></Btn>
          </div>
        </div>
      </div>
    </div>
  )
}

function PhotoUploader({ imovelId, fotos, setFotos, loading, setLoading }) {
  const ref = useRef()

  async function handleFiles(files) {
    setLoading(true)
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      try {
        const url = await uploadFoto(imovelId, file)
        setFotos(f => [...f, url])
      } catch (e) {
        toast('Erro ao enviar foto: ' + e.message, 'error')
      }
    }
    setLoading(false)
  }

  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', letterSpacing: '0.04em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
        Fotos do imóvel
      </label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
        {fotos.map((url, i) => (
          <div key={url} style={{ position: 'relative', aspectRatio: '1', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button onClick={() => setFotos(f => f.filter((_, j) => j !== i))} style={{
              position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)',
              border: 'none', borderRadius: 99, cursor: 'pointer', color: '#fff',
              width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <X size={12} />
            </button>
            {i === 0 && <div style={{ position: 'absolute', bottom: 4, left: 4, background: 'var(--accent)', color: '#fff', fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 99 }}>Capa</div>}
          </div>
        ))}
        <button onClick={() => ref.current?.click()} style={{
          aspectRatio: '1', borderRadius: 10, border: '2px dashed var(--border-med)',
          background: 'var(--surface2)', cursor: 'pointer', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
          color: 'var(--text-3)', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.color = 'var(--text-3)' }}
        >
          {loading ? <div className="animate-spin" style={{ fontSize: 20 }}>⏳</div> : <><ImagePlus size={20} /><span style={{ fontSize: 11 }}>Adicionar</span></>}
        </button>
      </div>
      <input ref={ref} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
    </div>
  )
}

export default function Imoveis({ imoveis, setImoveis }) {
  const [view, setView] = useState('grid') // grid | form
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [fotos, setFotos] = useState([])
  const [fotosLoading, setFotosLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [form, setForm] = useState({
    tipo: 'residencial', categoria: 'Apartamento', endereco: '',
    area: '', valor: '', quartos: '', vagas: '', status: 'disponivel', descricao: ''
  })

  function openNew() {
    setEditing(null)
    setFotos([])
    setForm({ tipo: 'residencial', categoria: 'Apartamento', endereco: '', area: '', valor: '', quartos: '', vagas: '', status: 'disponivel', descricao: '' })
    setView('form')
  }

  function openEdit(im) {
    setEditing(im)
    setFotos(im.fotos || (im.foto_principal ? [im.foto_principal] : []))
    setForm({
      tipo: im.tipo || 'residencial', categoria: im.categoria || 'Apartamento',
      endereco: im.endereco || '', area: im.area || '', valor: im.valor || '',
      quartos: im.quartos || '', vagas: im.vagas || '',
      status: im.status || 'disponivel', descricao: im.descricao || ''
    })
    setView('form')
  }

  async function handleSave() {
    if (!form.endereco || !form.valor) { toast('Preencha ao menos endereço e valor.', 'error'); return }
    setSaving(true)
    try {
      const payload = {
        ...form,
        area: form.area ? Number(form.area) : null,
        valor: Number(form.valor),
        quartos: form.quartos ? Number(form.quartos) : null,
        vagas: form.vagas ? Number(form.vagas) : null,
        foto_principal: fotos[0] || null,
        fotos: fotos,
      }
      if (editing) {
        const updated = await updateImovel(editing.id, payload)
        setImoveis(prev => prev.map(i => i.id === editing.id ? updated : i))
        toast('Imóvel atualizado!')
      } else {
        const created = await createImovel(payload)
        setImoveis(prev => [created, ...prev])
        toast('Imóvel cadastrado!')
      }
      setView('grid')
    } catch (e) {
      toast(e.message, 'error')
    }
    setSaving(false)
  }

  async function handleDelete() {
    if (!deleteModal) return
    try {
      await deleteImovel(deleteModal.id)
      setImoveis(prev => prev.filter(i => i.id !== deleteModal.id))
      toast('Imóvel removido.')
    } catch (e) {
      toast(e.message, 'error')
    }
    setDeleteModal(null)
  }

  const cats = form.tipo === 'comercial' ? CATS_COMERCIAL : CATS_RESIDENCIAL

  if (view === 'form') return (
    <div className="animate-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <button onClick={() => setView('grid')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14 }}>
          <ChevronLeft size={16} /> Voltar
        </button>
        <h1 style={{ fontSize: 24 }}>{editing ? 'Editar imóvel' : 'Novo imóvel'}</h1>
      </div>
      <Card style={{ overflow: 'visible' }}>
        <div style={{ padding: 24 }}>
          <FormGrid>
            <Select label="Tipo" value={form.tipo} onChange={e => setForm(f => ({ ...f, tipo: e.target.value, categoria: e.target.value === 'comercial' ? CATS_COMERCIAL[0] : CATS_RESIDENCIAL[0] }))}>
              <option value="residencial">Residencial</option>
              <option value="comercial">Comercial</option>
            </Select>
            <Select label="Categoria" value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}>
              {cats.map(c => <option key={c}>{c}</option>)}
            </Select>
            <FullCol>
              <Input label="Endereço completo" value={form.endereco} onChange={e => setForm(f => ({ ...f, endereco: e.target.value }))} placeholder="Rua, número, bairro, cidade – ES" />
            </FullCol>
            <Input label="Área (m²)" type="number" value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} placeholder="Ex: 120" />
            <Input label="Valor (R$)" type="number" value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))} placeholder="Ex: 450000" />
            <Input label="Quartos" type="number" value={form.quartos} onChange={e => setForm(f => ({ ...f, quartos: e.target.value }))} placeholder="0" />
            <Input label="Vagas de garagem" type="number" value={form.vagas} onChange={e => setForm(f => ({ ...f, vagas: e.target.value }))} placeholder="0" />
            <Select label="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="disponivel">Disponível</option>
              <option value="negociacao">Em negociação</option>
              <option value="vendido">Vendido</option>
            </Select>
            <FullCol>
              <Textarea label="Descrição" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Descreva os diferenciais do imóvel..." />
            </FullCol>
            <FullCol>
              <PhotoUploader
                imovelId={editing?.id || 'novo-' + Date.now()}
                fotos={fotos} setFotos={setFotos}
                loading={fotosLoading} setLoading={setFotosLoading}
              />
            </FullCol>
          </FormGrid>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <Btn onClick={() => setView('grid')}>Cancelar</Btn>
            <Btn variant="primary" loading={saving} onClick={handleSave}>Salvar imóvel</Btn>
          </div>
        </div>
      </Card>
    </div>
  )

  return (
    <div className="animate-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28 }}>Imóveis</h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 3 }}>{imoveis.length} imóvel{imoveis.length !== 1 ? 's' : ''} cadastrado{imoveis.length !== 1 ? 's' : ''}</p>
        </div>
        <Btn variant="primary" onClick={openNew}><Plus size={16} /> Novo imóvel</Btn>
      </div>

      {imoveis.length === 0 ? (
        <Card>
          <Empty icon="🏠" title="Nenhum imóvel cadastrado" subtitle="Clique em 'Novo imóvel' para começar" />
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
          {imoveis.map(im => <ImovelCard key={im.id} im={im} onEdit={openEdit} onDelete={setDeleteModal} />)}
        </div>
      )}

      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Remover imóvel" width={420}>
        <p style={{ color: 'var(--text-2)', marginBottom: 20 }}>Tem certeza que deseja remover <strong>{deleteModal?.categoria}</strong> em {deleteModal?.endereco?.split(',')[0]}? Esta ação não pode ser desfeita.</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Btn onClick={() => setDeleteModal(null)}>Cancelar</Btn>
          <Btn variant="danger" onClick={handleDelete}>Remover</Btn>
        </div>
      </Modal>
    </div>
  )
}
