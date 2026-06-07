import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Imoveis from './components/Imoveis'
import Clientes from './components/Clientes'
import Contratos from './components/Contratos'
import { Spinner } from './components/UI'
import { getImoveis, getClientes, getContratos } from './lib/supabase'

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY

function ConfigWarning() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', padding: 24,
    }}>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 20, padding: 40, maxWidth: 520, textAlign: 'center',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⚙️</div>
        <h2 style={{ fontSize: 22, marginBottom: 12, fontFamily: 'DM Serif Display, serif' }}>Configure as variáveis de ambiente</h2>
        <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 20 }}>
          Para conectar ao Supabase, crie um arquivo <code style={{ background: 'var(--surface2)', padding: '2px 6px', borderRadius: 4 }}>.env</code> na raiz do projeto com:
        </p>
        <pre style={{
          background: 'var(--surface2)', borderRadius: 12, padding: 16, fontSize: 12,
          textAlign: 'left', lineHeight: 2, color: 'var(--text)',
        }}>
{`REACT_APP_SUPABASE_URL=https://xxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=seu_anon_key`}
        </pre>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 16 }}>
          Encontre esses valores em <strong>supabase.com → seu projeto → Settings → API</strong>
        </p>
      </div>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [imoveis, setImoveis] = useState([])
  const [clientes, setClientes] = useState([])
  const [contratos, setContratos] = useState([])
  const [loading, setLoading] = useState(true)

  const configured = SUPABASE_URL && SUPABASE_KEY &&
    SUPABASE_URL !== 'undefined' && SUPABASE_KEY !== 'undefined'

  useEffect(() => {
    if (!configured) { setLoading(false); return }
    Promise.all([getImoveis(), getClientes(), getContratos()])
      .then(([im, cl, co]) => { setImoveis(im); setClientes(cl); setContratos(co) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (!configured) return <ConfigWarning />

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar page={page} setPage={setPage} open={sidebarOpen} setOpen={setSidebarOpen} />
      <main style={{ flex: 1, padding: '32px 36px', overflowY: 'auto', minWidth: 0 }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <Spinner size={32} />
          </div>
        ) : (
          <>
            {page === 'dashboard' && <Dashboard imoveis={imoveis} clientes={clientes} contratos={contratos} setPage={setPage} />}
            {page === 'imoveis' && <Imoveis imoveis={imoveis} setImoveis={setImoveis} />}
            {page === 'clientes' && <Clientes clientes={clientes} setClientes={setClientes} />}
            {page === 'contratos' && <Contratos imoveis={imoveis} clientes={clientes} contratos={contratos} setContratos={setContratos} />}
          </>
        )}
      </main>
    </div>
  )
}
