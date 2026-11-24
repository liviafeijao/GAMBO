# GAMBO

Plataforma criativa construída com TanStack Start, React, Supabase e Cloudflare/Nitro.

## Desenvolvimento local

```sh
bun install
cp .env.example .env
bun run dev
```

Configure no `.env`:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `GEMINI_API_KEY` (server only; required for IA Director)
- `GEMINI_MODEL` (optional; default `gemini-2.5-flash`, subject to availability for your Google AI account)

Use somente a chave publicável do Supabase no frontend. Nunca adicione `service_role`, secret keys, senhas ou tokens administrativos ao repositório.
`GEMINI_API_KEY` is consumed only by the authenticated server function. Never expose it through a `VITE_` variable. The IA Director's conversations and saved ideas are stored in the current browser; they are not persisted to Supabase.

## Arquitetura

- `src/routes`: páginas e roteamento por arquivos.
- `src/modules`: telas da aplicação.
- `src/components/shared`: shell, navegação e componentes compartilhados.
- `src/contexts`: sessão e autenticação.
- `src/viewmodels`: estado e contratos de interface.
- `src/data/repositories`: persistência Supabase de projetos e referências.
- `src/lib`: cliente Supabase e Storage.
- `src/integrations/supabase`: integração Lovable/TanStack SSR.
- `drizzle`: artefatos auto-gerados; não recria nem altera o banco existente.
- `supabase/config.toml`: configuração local Supabase.

## Dados e segurança

A aplicação usa `profiles`, `workspaces`, `projects`, `collections` e `creative_references` existentes. Projetos e referências são isolados por `workspace_id`; operações do frontend dependem das políticas RLS configuradas no projeto Supabase.

O bucket `gambo-assets` recebe imagens privadas de projetos e referências. Arquivos são validados por tipo e tamanho (máximo de 8 MB) e exibidos por URLs assinadas.

## Autenticação

O login usa persistência de sessão no navegador, atualização automática de token e sincronização do perfil/workspace. Cadastro, login, logout, confirmação de e-mail e recuperação de senha estão preparados.

## Testes e build

```sh
bun test
bun run lint
bun run build
```

O build gera o output TanStack/Nitro compatível com Cloudflare. Consulte `CONFIGURACAO_EXTERNA.md` para pendências que exigem credenciais ou configuração no painel.
