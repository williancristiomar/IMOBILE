-- ============================================================
--  ImoveisPRO — Schema Supabase
--  Execute este SQL no Supabase > SQL Editor
-- ============================================================

-- Imóveis
create table if not exists imoveis (
  id            uuid primary key default gen_random_uuid(),
  tipo          text not null default 'residencial',
  categoria     text not null,
  endereco      text not null,
  area          numeric,
  valor         numeric not null,
  quartos       integer,
  vagas         integer,
  status        text not null default 'disponivel',
  descricao     text,
  foto_principal text,
  fotos         text[] default '{}',
  created_at    timestamptz default now()
);

-- Clientes (LGPD-compliant)
create table if not exists clientes (
  id                  uuid primary key default gen_random_uuid(),
  nome                text not null,
  cpf                 text not null,
  email               text,
  telefone            text,
  interesse           text,
  consentimento_lgpd  boolean not null default false,
  data_consentimento  timestamptz default now(),
  created_at          timestamptz default now()
);

-- Contratos
create table if not exists contratos (
  id               uuid primary key default gen_random_uuid(),
  imovel_id        uuid references imoveis(id) on delete set null,
  cliente_id       uuid references clientes(id) on delete set null,
  imovel_endereco  text,
  comprador_nome   text,
  valor            numeric,
  forma_pagamento  text,
  corretor         text,
  data_assinatura  date,
  texto            text,
  created_at       timestamptz default now()
);

-- ============================================================
--  Storage bucket para fotos
-- ============================================================
-- No painel do Supabase: Storage > New bucket > "imoveis-fotos" > Public

-- Row Level Security (RLS) — desativado para MVP
-- Para produção com auth, habilite e configure policies por usuário.
alter table imoveis  disable row level security;
alter table clientes disable row level security;
alter table contratos disable row level security;
