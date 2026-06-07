# ImoveisPRO 🏠

Sistema de gestão para corretores de imóveis — React + Supabase.

## Funcionalidades

- **Imóveis** — cadastro residencial e comercial com fotos (upload para Supabase Storage)
- **Clientes** — cadastro com consentimento LGPD (Lei nº 13.709/2018)
- **Contratos** — geração de contrato de compra e venda com pré-visualização e download
- **Dashboard** — visão geral do portfólio

---

## Como publicar (passo a passo)

### 1. Configure o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita
2. Crie um novo projeto
3. Vá em **SQL Editor** e execute o conteúdo do arquivo `supabase_schema.sql`
4. Vá em **Storage** → **New bucket** → nome: `imoveis-fotos` → marque **Public** → Create
5. Vá em **Settings** → **API** e copie:
   - `Project URL`
   - `anon public` key

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```
REACT_APP_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGci...seu_anon_key
```

### 3. Teste localmente (opcional)

```bash
npm install
npm start
```

### 4. Publique no Vercel

1. Faça push do projeto para o GitHub
2. Acesse [vercel.com](https://vercel.com) → **New Project** → importe o repositório
3. Em **Environment Variables**, adicione:
   - `REACT_APP_SUPABASE_URL` → URL do seu projeto Supabase
   - `REACT_APP_SUPABASE_ANON_KEY` → sua anon key
4. Clique em **Deploy**

Pronto! O sistema estará online em `https://seu-projeto.vercel.app`

---

## Estrutura do projeto

```
imoveispro/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── UI.jsx          # Design system compartilhado
│   │   ├── Sidebar.jsx     # Navegação lateral
│   │   ├── Dashboard.jsx   # Página inicial
│   │   ├── Imoveis.jsx     # Cadastro de imóveis + fotos
│   │   ├── Clientes.jsx    # Cadastro de clientes (LGPD)
│   │   └── Contratos.jsx   # Gerador de contratos
│   ├── lib/
│   │   └── supabase.js     # Cliente e helpers do Supabase
│   ├── App.js
│   ├── index.js
│   └── index.css
├── supabase_schema.sql     # Execute no Supabase SQL Editor
├── .env                    # Suas chaves (não commitar!)
└── package.json
```

## Segurança e LGPD

- O campo `consentimento_lgpd` é obrigatório para salvar um cliente
- O modal de remoção de cliente informa sobre a exclusão dos dados pessoais
- Para produção, habilite o RLS (Row Level Security) no Supabase e configure autenticação por corretor

## Próximas evoluções sugeridas

- [ ] Login por corretor (Supabase Auth)
- [ ] Múltiplas fotos por imóvel com galeria
- [ ] Exportação de contrato em PDF/DOCX
- [ ] Matching automático cliente × imóvel
- [ ] Notificações por WhatsApp/e-mail
