# Configuração externa pendente

Este documento não contém valores secretos.

## Supabase

Configure no ambiente local e no provedor de deploy:

- `VITE_SUPABASE_URL`: URL pública do projeto.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: chave publicável do projeto.

No painel do Supabase/preview:

- Confirme as redirect URLs de login e recuperação de senha.
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
