# Configuração externa pendente

Este documento não contém valores secretos.

## Supabase

Configure no ambiente local em um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICAVEL
VITE_SUPABASE_PASSWORD_RESET_REDIRECT=http://localhost:8080/redefinir-senha
```

Reinicie o servidor Vite após criar ou alterar o arquivo.

No painel do Supabase/preview:

- Adicione `http://localhost:8080/redefinir-senha` às Redirect URLs permitidas.
- Para usar outra porta, defina `VITE_SUPABASE_PASSWORD_RESET_REDIRECT` no `.env` local e adicione a URL exata no Supabase.
- Confirme as redirect URLs de login e recuperação de senha.
- A entrega do e-mail depende da configuração de SMTP no projeto: o Supabase não envia para uma caixa real sem template ativo e provedor/Site URL válidos.
- Confirme o template e a confirmação de e-mail.
- Confirme as políticas RLS das tabelas `profiles`, `workspaces`, `projects`, `collections` e `creative_references`.
- Confirme o bucket privado `gambo-assets` e as políticas de Storage.
- Gere a documentação de tipos a partir do esquema remoto somente por revisão e quando necessário.

Não configure `SUPABASE_SERVICE_ROLE_KEY` no frontend. Qualquer segredo server-side deve ficar no provedor de secrets.

## GitHub

A branch `chore/consolidacao-gambo` está publicada. Criar o Pull Request por:

`https://github.com/liviafeijao/GAMBO/pull/new/chore/consolidacao-gambo`

O login do GitHub no navegador é necessário para criar o PR. Uma proteção de branch pode exigir revisão antes do merge.

## Cloudflare

Configure no ambiente de deploy as duas variáveis públicas de Supabase. Os arquivos `.output` e `.wrangler` são artefatos gerados e não devem receber valores secretos.

## Integrações futuras

- AI Director: configurar gateway Lovable ou provedor compatível no servidor e armazenar sua chave como secret.
- Automações: definir serviço de execução, agendamento e credenciais próprias.
- BMT Prompt Studio: aguardar o código original e os dados do criador.
- Planos e preços: cadastrar valores comerciais definidos pela empresa antes de ativar pagamentos.
- Notificações/Telegram: a interface já preserva o link público; atendimento, webhooks e credenciais ainda não estão conectados.

## Preços e demonstração acadêmica

A migration complementar está em `supabase/migrations/202611190001_gambo_pricing_and_demo.sql`.

Ela cria `pricing_plans` e `project_tasks`, adiciona campos complementares em `projects` e insere três planos ilustrativos e oito tarefas Aurora idempotentes.

Aplique a migration pelo SQL Editor do Supabase após revisão do esquema remoto. Não execute migrations destrutivas; os dados reais existentes não são removidos.

O projeto demonstrativo usa `is_demo = true` e não deve ser associado a uma conta real.

## Variáveis de ambiente suportadas

- `VITE_SUPABASE_URL`: URL pública do projeto (preferencial no Vite/local).
- `VITE_SUPABASE_PUBLISHABLE_KEY`: chave publicável do projeto (preferencial no Vite/local).
- `SUPABASE_URL`: fallback compatível com ambientes Lovable/SSR.
- `SUPABASE_PUBLISHABLE_KEY`: fallback compatível com ambientes Lovable/SSR.

No Lovable, configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` no ambiente publicado. Não compartilhe o `.env.local` com o Lovable: a configuração precisa ser feita no painel ou nas configurações de deploy do projeto.
