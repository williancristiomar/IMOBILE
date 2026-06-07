import React, { useState } from 'react'
import { FileText, Download, Plus } from 'lucide-react'
import { Card, Btn, Input, Select, FormGrid, FullCol, Badge, Empty, toast, fmt } from './UI'
import { createContrato } from '../lib/supabase'

function valorExt(v) {
  const n = Number(v)
  if (n >= 1000000) return (n / 1000000).toFixed(2).replace('.', ',') + ' milhões de reais'
  if (n >= 1000) return (n / 1000).toFixed(0) + ' mil reais'
  return n + ' reais'
}

function gerarTexto(d) {
  const saldo = Number(d.valor) - Number(d.entrada || 0)
  return `
CONTRATO PARTICULAR DE COMPRA E VENDA DE IMÓVEL

As partes abaixo qualificadas, de comum acordo, têm entre si celebrado o presente Contrato Particular de Compra e Venda de Imóvel, que se regerá pelas cláusulas e condições seguintes:

VENDEDOR: ${d.vendedor_nome}, portador do CPF nº ${d.vendedor_cpf}, doravante denominado VENDEDOR.

COMPRADOR: ${d.comprador_nome}, portador do CPF nº ${d.comprador_cpf}, doravante denominado COMPRADOR.

Cláusula 1ª – Do Objeto
O VENDEDOR declara ser legítimo proprietário do imóvel situado à ${d.imovel_endereco}, com área total de ${d.imovel_area ? d.imovel_area + ' m²' : 'a ser especificada'}, livre e desembaraçado de quaisquer ônus, dívidas ou gravames.

Cláusula 2ª – Do Preço e Condições de Pagamento
O preço total da presente compra e venda é de R$ ${Number(d.valor).toLocaleString('pt-BR')} (${valorExt(d.valor)}), sendo pago da seguinte forma:
— Entrada: R$ ${Number(d.entrada || 0).toLocaleString('pt-BR')}, na data da assinatura deste instrumento;
— Saldo: R$ ${saldo.toLocaleString('pt-BR')}, mediante ${d.forma_pagamento}.

Cláusula 3ª – Da Entrega do Imóvel
O VENDEDOR se compromete a entregar o imóvel no prazo de 30 (trinta) dias após a quitação integral do preço, em perfeito estado de conservação e livre de ocupantes.

Cláusula 4ª – Das Responsabilidades
Os tributos, taxas e demais encargos incidentes sobre o imóvel até a data da entrega são de responsabilidade do VENDEDOR. A partir da efetiva posse, tornam-se de responsabilidade do COMPRADOR.

Cláusula 5ª – Das Benfeitorias
Quaisquer benfeitorias realizadas no imóvel pelo COMPRADOR, após a efetiva posse, incorporar-se-ão ao mesmo, sem direito a indenização por qualquer das partes.

Cláusula 6ª – Da Intermediação
A intermediação deste negócio foi realizada pelo(a) corretor(a) ${d.corretor}, regularmente inscrito(a) no CRECI.

Cláusula 7ª – Do Foro
As partes elegem o foro da comarca de Vitória – ES para dirimir quaisquer dúvidas oriundas deste contrato, renunciando a qualquer outro, por mais privilegiado que seja.

Por estarem assim justos e contratados, assinam o presente instrumento em 2 (duas) vias de igual teor, na data de ${d.data_assinatura}.


_________________________________________
${d.vendedor_nome}
VENDEDOR — CPF ${d.vendedor_cpf}


_________________________________________
${d.comprador_nome}
COMPRADOR — CPF ${d.comprador_cpf}


_________________________________________
Testemunha 1 — CPF: ___________________


_________________________________________
Testemunha 2 — CPF: ___________________
  `.trim()
}

export default function Contratos({ imoveis, clientes, contratos, setContratos }) {
  const [tab, setTab] = useState('gerar')
  const [saving, setSaving] = useState(false)
  const [contratoTexto, setContratoTexto] = useState('')
  const [form, setForm] = useState({
    imovel_id: '', cliente_id: '',
    vendedor_nome: '', vendedor_cpf: '',
    valor: '', entrada: '',
    forma_pagamento: 'Financiamento bancário',
    corretor: '', data_assinatura: new Date().toISOString().split('T')[0],
  })

  const imovelSel = imoveis.find(i => i.id === form.imovel_id)
  const clienteSel = clientes.find(c => c.id === form.cliente_id)

  function handleImovelChange(id) {
    const im = imoveis.find(i => i.id === id)
    setForm(f => ({ ...f, imovel_id: id, valor: im?.valor || '' }))
  }

  function gerarPreview() {
    if (!form.imovel_id || !form.cliente_id || !form.vendedor_nome || !form.valor) {
      toast('Preencha imóvel, comprador, vendedor e valor.', 'error'); return
    }
    const d = {
      ...form,
      comprador_nome: clienteSel?.nome || '',
      comprador_cpf: clienteSel?.cpf || '',
      imovel_endereco: imovelSel?.endereco || '',
      imovel_area: imovelSel?.area || '',
      data_assinatura: new Date(form.data_assinatura + 'T12:00:00').toLocaleDateString('pt-BR'),
    }
    setContratoTexto(gerarTexto(d))
  }

  async function handleSalvar() {
    if (!contratoTexto) { gerarPreview(); return }
    setSaving(true)
    try {
      const payload = {
        imovel_id: form.imovel_id,
        cliente_id: form.cliente_id,
        imovel_endereco: imovelSel?.endereco || '',
        comprador_nome: clienteSel?.nome || '',
        valor: Number(form.valor),
        forma_pagamento: form.forma_pagamento,
        corretor: form.corretor,
        data_assinatura: form.data_assinatura,
        texto: contratoTexto,
      }
      const created = await createContrato(payload)
      setContratos(prev => [created, ...prev])
      toast('Contrato salvo no histórico!')
      setTab('historico')
    } catch (e) {
      toast(e.message, 'error')
    }
    setSaving(false)
  }

  function baixarTxt() {
    if (!contratoTexto) return
    const blob = new Blob([contratoTexto], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `contrato-${clienteSel?.nome?.split(' ')[0] || 'comprador'}-${Date.now()}.txt`
    a.click()
  }

  return (
    <div className="animate-in">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28 }}>Contratos</h1>
        <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 3 }}>Gere e gerencie contratos de compra e venda</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
        {[['gerar', 'Gerar contrato'], ['historico', 'Histórico']].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: '9px 18px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: tab === id ? 600 : 400,
            color: tab === id ? 'var(--accent)' : 'var(--text-2)',
            borderBottom: `2px solid ${tab === id ? 'var(--accent)' : 'transparent'}`,
            marginBottom: -1, transition: 'all 0.15s', fontFamily: 'inherit',
          }}>{label}</button>
        ))}
      </div>

      {tab === 'gerar' && (
        <div>
          <Card style={{ overflow: 'visible', marginBottom: 20 }}>
            <div style={{ padding: 24 }}>
              <FormGrid>
                <FullCol>
                  <Select label="Imóvel" value={form.imovel_id} onChange={e => handleImovelChange(e.target.value)}>
                    <option value="">Selecione um imóvel...</option>
                    {imoveis.filter(i => i.status !== 'vendido').map(i => (
                      <option key={i.id} value={i.id}>{i.categoria} — {i.endereco?.split(',')[0]} ({fmt(i.valor)})</option>
                    ))}
                  </Select>
                </FullCol>
                <FullCol>
                  <Select label="Comprador (cliente cadastrado)" value={form.cliente_id} onChange={e => setForm(f => ({ ...f, cliente_id: e.target.value }))}>
                    <option value="">Selecione um cliente...</option>
                    {clientes.map(c => <option key={c.id} value={c.id}>{c.nome} — CPF {c.cpf}</option>)}
                  </Select>
                </FullCol>
                <Input label="Nome do vendedor" value={form.vendedor_nome} onChange={e => setForm(f => ({ ...f, vendedor_nome: e.target.value }))} placeholder="Nome completo do vendedor" />
                <Input label="CPF do vendedor" value={form.vendedor_cpf} onChange={e => setForm(f => ({ ...f, vendedor_cpf: e.target.value }))} placeholder="000.000.000-00" />
                <Input label="Valor da venda (R$)" type="number" value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))} placeholder="Ex: 450000" />
                <Input label="Entrada (R$)" type="number" value={form.entrada} onChange={e => setForm(f => ({ ...f, entrada: e.target.value }))} placeholder="Ex: 90000" />
                <Select label="Forma de pagamento do saldo" value={form.forma_pagamento} onChange={e => setForm(f => ({ ...f, forma_pagamento: e.target.value }))}>
                  <option>Financiamento bancário</option>
                  <option>À vista</option>
                  <option>FGTS</option>
                  <option>Parcelamento direto</option>
                  <option>Misto (FGTS + financiamento)</option>
                </Select>
                <Input label="Data de assinatura" type="date" value={form.data_assinatura} onChange={e => setForm(f => ({ ...f, data_assinatura: e.target.value }))} />
                <FullCol>
                  <Input label="Corretor responsável" value={form.corretor} onChange={e => setForm(f => ({ ...f, corretor: e.target.value }))} placeholder="Nome do corretor (CRECI)" />
                </FullCol>
              </FormGrid>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
                <Btn onClick={gerarPreview}><FileText size={15} /> Gerar pré-visualização</Btn>
                {contratoTexto && <Btn variant="primary" loading={saving} onClick={handleSalvar}>Salvar no histórico</Btn>}
              </div>
            </div>
          </Card>

          {contratoTexto && (
            <Card className="animate-in">
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: 17 }}>Pré-visualização do contrato</h2>
                <Btn size="sm" onClick={baixarTxt}><Download size={14} /> Baixar .txt</Btn>
              </div>
              <div style={{ padding: 24 }}>
                <pre style={{
                  fontFamily: 'Georgia, serif', fontSize: 13, lineHeight: 1.9,
                  color: 'var(--text)', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                  background: 'var(--bg)', borderRadius: 'var(--radius)', padding: 20,
                  maxHeight: 480, overflowY: 'auto', border: '1px solid var(--border)',
                }}>
                  {contratoTexto}
                </pre>
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === 'historico' && (
        <Card style={{ overflow: 'hidden', padding: 0 }}>
          {contratos.length === 0 ? (
            <Empty icon="📄" title="Nenhum contrato gerado" subtitle="Gere o primeiro contrato na aba ao lado" />
          ) : (
            contratos.map((c, i) => (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
                borderBottom: i < contratos.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={18} style={{ color: 'var(--text-3)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{c.imovel_endereco?.split(',')[0]}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 1 }}>Comprador: {c.comprador_nome}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 600 }}>{fmt(c.valor)}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>
                    {c.data_assinatura ? new Date(c.data_assinatura).toLocaleDateString('pt-BR') : '—'}
                  </div>
                </div>
                <Badge color="green">Gerado</Badge>
              </div>
            ))
          )}
        </Card>
      )}
    </div>
  )
}
