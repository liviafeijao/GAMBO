-- GAMBO complementary migration
-- Creates public commercial plans and a demonstrative project/task structure.
-- Additive only: it does not recreate or remove existing GAMBO tables.

create table if not exists public.pricing_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  monthly_price numeric(12,2) not null default 0,
  annual_price numeric(12,2) not null default 0,
  currency char(3) not null default 'BRL',
  features jsonb not null default '[]'::jsonb,
  limits jsonb not null default '{}'::jsonb,
  included_users integer not null default 1,
  is_free boolean not null default false,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.pricing_plans enable row level security;

drop policy if exists "pricing_plans_public_read_active" on public.pricing_plans;
create policy "pricing_plans_public_read_active"
  on public.pricing_plans
  for select
  to anon, authenticated
  using (is_active = true);

insert into public.pricing_plans (
  name, slug, description, monthly_price, annual_price, currency,
  features, limits, included_users, is_free, is_featured, is_active, display_order
) values
  (
    'GAMBO Starter', 'gambo-starter',
    'Organização essencial para profissionais criativos independentes.',
    0, 0, 'BRL',
    '["Até 3 projetos ativos","Acervo criativo básico","1 workspace pessoal","Suporte da central de ajuda"]'::jsonb,
    '{"projects":3,"members":1,"ai_requests":20,"storage_mb":500}'::jsonb,
    1, true, false, true, 10
  ),
  (
    'GAMBO Pro', 'gambo-pro',
    'Recursos avançados de criação, automação e inteligência para equipes pequenas.',
    49.90, 499.00, 'BRL',
    '["Até 30 projetos ativos","AI Director","Automações essenciais","Colaboração em equipe","Acervo ampliado"]'::jsonb,
    '{"projects":30,"members":5,"ai_requests":500,"storage_mb":10000}'::jsonb,
    5, false, true, true, 20
  ),
  (
    'GAMBO Studio', 'gambo-studio',
    'Capacidade completa para estúdios e agências com fluxos de trabalho sofisticados.',
    149.90, 1499.00, 'BRL',
    '["Projetos ilimitados","Gestão completa de equipe","Automações avançadas","IA ampliada","Suporte prioritário"]'::jsonb,
    '{"projects":-1,"members":25,"ai_requests":2500,"storage_mb":100000}'::jsonb,
    25, false, false, true, 30
  )
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  monthly_price = excluded.monthly_price,
  annual_price = excluded.annual_price,
  currency = excluded.currency,
  features = excluded.features,
  limits = excluded.limits,
  included_users = excluded.included_users,
  is_free = excluded.is_free,
  is_featured = excluded.is_featured,
  is_active = excluded.is_active,
  display_order = excluded.display_order,
  updated_at = now();

-- Additive demonstration metadata to the existing projects table.
do $$
begin
  if to_regclass('public.projects') is not null then
    alter table public.projects add column if not exists is_demo boolean not null default false;
    alter table public.projects add column if not exists priority text;
    alter table public.projects add column if not exists start_date date;
    alter table public.projects add column if not exists briefing jsonb;
  end if;
end $$;

-- Demo tasks complement the existing project model without replacing it.
create table if not exists public.project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  workspace_id uuid,
  name text not null,
  description text not null default '',
  stage text not null default 'Planejamento',
  status text not null default 'Planejamento',
  priority text not null default 'Média',
  assignee_name text,
  due_date date,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.project_tasks enable row level security;

drop policy if exists "project_tasks_demo_public_read" on public.project_tasks;
create policy "project_tasks_demo_public_read"
  on public.project_tasks
  for select
  to anon, authenticated
  using (is_demo = true);

-- Demo projects are explicitly readable because they contain only fictional academic data.
do $$
begin
  if to_regclass('public.projects') is not null then
    execute 'drop policy if exists "projects_public_read_demo" on public.projects';
    execute 'create policy "projects_public_read_demo" on public.projects for select to anon, authenticated using (is_demo = true)';
  end;
end $$;

-- Seed an isolated demonstration project only in a workspace owned by no real user.
-- If the existing schema cannot support such a workspace, no real account or real project is changed.
do $$
declare
  demo_workspace_id uuid := '00000000-0000-4000-8000-000000000001';
  demo_project_id uuid := '00000000-0000-4000-8000-000000000002';
  has_owner boolean;
begin
  if to_regclass('public.workspaces') is not null then
    select exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'workspaces' and column_name = 'owner_id'
    ) into has_owner;

    if has_owner then
      begin
        insert into public.workspaces (id, name)
        select demo_workspace_id, 'Workspace Demonstrativo GAMBO'
        where not exists (select 1 from public.workspaces where id = demo_workspace_id)
          and (select is_nullable from information_schema.columns
               where table_schema='public' and table_name='workspaces' and column_name='owner_id') = 'YES';
      exception when others then
        -- Never attach demonstration data to a real account.
        null;
      end;
    end else
      insert into public.workspaces (id, name)
      values (demo_workspace_id, 'Workspace Demonstrativo GAMBO')
      on conflict (id) do update set name = excluded.name;
    end if;
  end if;

  if to_regclass('public.projects') is not null then
    begin
      insert into public.projects (
        id, workspace_id, name, description, client, category, status,
        created_on, deadline, cover_url, is_demo, priority, start_date, briefing
      )
      values (
        demo_project_id,
        demo_workspace_id,
        'Aurora Creative Studio — Campanha de Identidade Visual',
        'Projeto fictício acadêmico para apresentar o funcionamento integrado do GAMBO em uma campanha de identidade visual da cafeteria contemporânea Café Aurora.',
        'Café Aurora',
        'Identidade Visual e Marketing',
        'Em andamento',
        '2026-11-16',
        '2026-12-18',
        null,
        true,
        'Alta',
        '2026-11-16',
        '{"objective":"Posicionar o Café Aurora como uma marca contemporânea, acolhedora e memorável.","audience":"Adultos urbanos de 25 a 44 anos interessados em café especial, design e experiências sociais.","visual_identity":"Combinação de formas orgânicas, tipografia expressiva, tons terrosos e detalhes em cobre.","deliverables":["Manual de identidade visual","Peças para redes sociais","Cardápio","Fotografia de lançamento","Guia de aplicação"]}'::jsonb
      )
      on conflict (id) do update set
        name = excluded.name,
        description = excluded.description,
        client = excluded.client,
        category = excluded.category,
        status = excluded.status,
        created_on = excluded.created_on,
        deadline = excluded.deadline,
        is_demo = true,
        priority = excluded.priority,
        start_date = excluded.start_date,
        briefing = excluded.briefing;
    exception when others then
      -- If the remote schema differs, do not delete or modify existing records.
      raise notice 'GAMBO demo project seed skipped due to incompatible existing projects schema: %', sqlerrm;
    end;
  end;
end $$;

insert into public.project_tasks (
  id, project_id, workspace_id, name, description, stage, status, priority, assignee_name, due_date, is_demo
) values
  ('10000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000001','Briefing e descoberta','Alinhamento com a equipe fictícia sobre objetivos, público e restrições da cafeteria.','Briefing','Concluído','Alta','Lívia Feijão','2026-11-17',true),
  ('10000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000001','Pesquisa de referências','Curadoria de referências de cafeterias, embalagem, fotografia e ambientação.','Pesquisa','Concluído','Alta','Marina Rocha','2026-11-19',true),
  ('10000000-0000-4000-8000-000000000003','00000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000001','Planejamento criativo','Definir conceito, sistema visual, tom de voz e plano de produção.','Planejamento','Em andamento','Alta','Caio Lima','2026-11-24',true),
  ('10000000-0000-4000-8000-000000000004','00000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000001','Identidade visual','Desenvolver logo, paleta, tipografia e regras de aplicação.','Identidade','Em andamento','Alta','Lívia Feijão','2026-11-30',true),
  ('10000000-0000-4000-8000-000000000005','00000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000001','Produção de fotografias','Planejar e executar fotografia de produtos e ambiente.','Fotografia','Planejamento','Média','Marina Rocha','2026-12-05',true),
  ('10000000-0000-4000-8000-000000000006','00000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000001','Peças para redes sociais','Criar templates, campanhas e calendário de lançamento.','Redes sociais','Planejamento','Média','Caio Lima','2026-12-10',true),
  ('10000000-0000-4000-8000-000000000007','00000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000001','Revisão e aprovação','Apresentar conceitos e consolidar ajustes com a direção fictícia.','Revisão','Planejamento','Alta','Lívia Feijão','2026-12-15',true),
  ('10000000-0000-4000-8000-000000000008','00000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000001','Entrega final','Entregar manual, arquivos finais e kit de campanha.','Entrega','Planejamento','Alta','Lívia Feijão','2026-12-18',true)
  on conflict (id) do update set
    name = excluded.name,
    description = excluded.description,
    stage = excluded.stage,
    status = excluded.status,
    priority = excluded.priority,
    assignee_name = excluded.assignee_name,
    due_date = excluded.due_date,
    is_demo = true,
    workspace_id = excluded.workspace_id,
    updated_at = now();
