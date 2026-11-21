# Evolução funcional do GAMBO

## Diagnóstico

O GAMBO existente tem oito páginas operacionais, projetos e referências salvos no navegador, AI Director com respostas pré-definidas e automações conceituais. As oito páginas foram verificadas sem erros de execução e os nove testes existentes passaram.

**Ao contrário da premissa do documento, este projeto não tem Lovable Cloud conectado.** Não há acesso por conta nem banco acessível para inspeção. O BMT é um espaço reservado, sem o código original. Preservar a aplicação, sua identidade e o Telegram; não criar outra plataforma.

## Etapas

### 2. Acesso, dados e AI Director
- Ativar Lovable Cloud e inspecionar a estrutura disponibilizada antes de criar tabelas.
- Implementar cadastro, entrada e saída, mantendo eventuais configurações existentes que forem encontradas.
- Salvar projetos, etapas, tarefas, briefings, checklists, entregáveis, conversas e referências por usuário.
- Oferecer transferência explícita dos projetos e referências locais para a conta, sem apagar a versão local.
- Conectar o Director à IA para interpretar solicitações e produzir briefing, objetivos, conceito, funções, recursos, cronograma, referências e entregáveis.
- Mostrar o planejamento como sugestão revisável. Criar ou alterar projetos, tarefas, etapas, briefings e status somente após confirmação; exibir o resultado efetivamente salvo.
- Permitir selecionar um projeto para acompanhar pendências, prazos, gargalos, próximos passos e relatórios.

### 3. Central de automações reais
- Criar cinco automações: estrutura de novos projetos, briefings, tarefas, conteúdo e entregas.
- Gerar planejamento, pré-produção, produção, pós-produção e entrega; evitar duplicação em reexecuções.
- Organizar briefings incompletos, tarefas por etapa e prioridade, alertas de prazo, pautas/calendários/legendas e checklists de aprovação.
- Persistir configurações, estado ativo/inativo, última execução, histórico, resultado e falhas.
- Executar as automações por ação do usuário ou evento interno real; não simular execuções ou envio de notificações externas.
- Documentar pontos de conexão para serviços externos; não conectar n8n ou publicar conteúdo em redes sem serviço autorizado.

### 4. Café Aurora
- Cadastrar a campanha fictícia completa com briefing, objetivo, público, conceito, cronograma, referências e entregáveis.
- Incluir as cinco etapas e todas as atividades solicitadas, com tarefas e estados de andamento persistidos.
- Separar visualmente a demonstração dos projetos reais, sem dados pessoais ou clientes reais.
- Permitir executar automações e consultar o Director no contexto da campanha, sem inventar histórico de execução de IA.

### 5. Central de Ajuda e Suporte
- Evoluir a página existente com pesquisa, categorias, nove tutoriais passo a passo, guias e FAQ.
- Informar a situação real do BMT e de cada integração.
- Registrar assunto, categoria, descrição e prioridade de solicitações, associados à conta autenticada; incluir anexo apenas com armazenamento privado validado.
- Permitir acompanhar Aberto, Em análise, Respondido e Resolvido, sem permitir alterações de atendimento indevidas.
- Deixar explícito que registrar uma solicitação não significa ter uma equipe externa conectada; não simular respostas.

### 6. Tutorial
- Preparar roteiro, narração em português brasileiro, storyboard e sequência de cenas de 3 a 5 minutos.
- O ambiente permite gravações reais da interface e montagem de vídeo; verificar a narração antes de prometer a produção completa.
- Se viável, produzir o vídeo com as telas finais e legendas. Caso contrário, entregar os materiais de gravação e reservar espaço na ajuda sem player vazio.

### 7. Validação
- Testar cadastro, entrada, saída, navegação, criação/edição, leitura após recarregar e isolamento entre duas contas.
- Testar uma solicitação real de IA, aprovação e execução, leitura do projeto salvo, automações e histórico.
- Testar Café Aurora, pesquisa de ajuda, envio e acompanhamento de suporte, falhas e confirmações.
- Conferir computador, tablet e celular e manter os testes de regras no repositório.

## Detalhes técnicos

- Manter TanStack Start, roteamento por arquivos, componentes existentes e tokens visuais.
- Manter separação entre domínio, contratos de repositório, viewmodels e telas; substituir o armazenamento local por persistência autenticada somente na nova fase.
- Executar lógica interna via funções de servidor; streaming de IA por endpoint com autenticação explícita. Segredos e chamadas de IA permanecem no servidor.
- Usar o gateway de IA do Lovable, com streaming, erros seguros, cancelamento explícito e correlação das solicitações.
- Validar sugestões estruturadas e autorização no servidor; confirmação explícita não substitui validação de permissões. Aplicar RLS e relacionamentos por proprietário.
- Persistir propostas e execuções com identificação única para impedir duplicação; registrar resultados reais, não apenas mudanças visuais.
- A demonstração entra com esquema e dados literais de migração e acesso controlado, nunca semeada ao carregar uma página.

## Dependências e custos

- A fase 2 depende da ativação de Lovable Cloud; solicitações de IA têm consumo cobrado conforme o plano e créditos disponíveis.
- A integração do BMT depende do código original e do crédito do criador; até lá, preservar a área reservada.
- Atendimento externo, publicação em redes e serviços externos exigem conexões próprias; não são pressupostos neste plano.

**Resultado desta etapa:** diagnóstico e plano, sem alterações na interface ou ativação de serviços antes da revisão.