import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// ── Imóveis ──────────────────────────────────────────────────────────────────

export async function getImoveis() {
  const { data, error } = await supabase
    .from('imoveis')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createImovel(imovel) {
  const { data, error } = await supabase
    .from('imoveis')
    .insert([imovel])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateImovel(id, updates) {
  const { data, error } = await supabase
    .from('imoveis')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteImovel(id) {
  const { error } = await supabase.from('imoveis').delete().eq('id', id)
  if (error) throw error
}

// ── Fotos ────────────────────────────────────────────────────────────────────

export async function uploadFoto(imovelId, file) {
  const ext = file.name.split('.').pop()
  const path = `${imovelId}/${Date.now()}.${ext}`
  const { error } = await supabase.storage
    .from('imoveis-fotos')
    .upload(path, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from('imoveis-fotos').getPublicUrl(path)
  return data.publicUrl
}

export async function deleteFoto(url) {
  const path = url.split('/imoveis-fotos/')[1]
  if (!path) return
  await supabase.storage.from('imoveis-fotos').remove([path])
}

export async function getFotos(imovelId) {
  const { data, error } = await supabase.storage
    .from('imoveis-fotos')
    .list(imovelId, { sortBy: { column: 'created_at', order: 'asc' } })
  if (error) return []
  return data.map(f => {
    const { data: u } = supabase.storage
      .from('imoveis-fotos')
      .getPublicUrl(`${imovelId}/${f.name}`)
    return u.publicUrl
  })
}

// ── Clientes ─────────────────────────────────────────────────────────────────

export async function getClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createCliente(cliente) {
  const { data, error } = await supabase
    .from('clientes')
    .insert([cliente])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteCliente(id) {
  const { error } = await supabase.from('clientes').delete().eq('id', id)
  if (error) throw error
}

// ── Contratos ─────────────────────────────────────────────────────────────────

export async function getContratos() {
  const { data, error } = await supabase
    .from('contratos')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createContrato(contrato) {
  const { data, error } = await supabase
    .from('contratos')
    .insert([contrato])
    .select()
    .single()
  if (error) throw error
  return data
}
