# GAMBO
## Documentação Oficial do Produto e do Sistema

**Versão:** 1.0 — Base documental inicial  
**Data:** 19 de novembro de 2026  
**Categoria:** Plataforma de tecnologia criativa  
**Posicionamento:** Uma plataforma para estúdios e agências criativas.

---

# 1. APRESENTAÇÃO DO PROJETO

## 1.1. O que é o GAMBO?

O GAMBO é uma plataforma digital desenvolvida para estúdios criativos, agências de publicidade, profissionais de fotografia, designers, videomakers e equipes de criação.

Seu objetivo é centralizar ferramentas, processos e recursos de inteligência artificial em um ambiente integrado, permitindo que profissionais organizem projetos, desenvolvam ideias, construam direções criativas e automatizem atividades.

A plataforma combina organização de projetos, ferramentas de criação, inteligência artificial, gerenciamento de referências e automação de processos.

O GAMBO não pretende substituir a criatividade humana. Sua proposta é utilizar a tecnologia para ampliar as possibilidades criativas e reduzir tarefas operacionais.

## 1.2. Problema identificado

Equipes criativas frequentemente trabalham com ferramentas isoladas, informações distribuídas em diferentes plataformas e processos manuais.

Entre os principais problemas estão:

- Falta de centralização das informações dos projetos.
- Dificuldade para organizar referências e materiais criativos.
- Tempo gasto na elaboração e adaptação de prompts.
- Ausência de padronização nos processos de criação.
- Repetição de tarefas operacionais.
- Dificuldade de integrar ferramentas de inteligência artificial ao fluxo de trabalho.
- Falta de histórico organizado das decisões criativas.

## 1.3. Solução proposta

O GAMBO reúne esses recursos em um ambiente único, com módulos especializados e possibilidade de integração entre eles.

A plataforma busca oferecer uma experiência que conecte planejamento, criação, inteligência artificial e organização.

## 1.4. Público-alvo

- Estúdios de fotografia.
- Agências de publicidade.
- Estúdios de design.
- Produtoras audiovisuais.
- Designers independentes.
- Fotógrafos.
- Videomakers.
- Diretores de arte.
- Equipes de marketing e comunicação.

## 1.5. Objetivos

### Objetivo geral

Desenvolver uma plataforma de tecnologia criativa capaz de integrar ferramentas de organização, inteligência artificial e automação para otimizar os processos de trabalho de estúdios e agências criativas.

### Objetivos específicos

1. Centralizar projetos e informações criativas.
2. Facilitar a construção de briefings e direções de arte.
3. Disponibilizar ferramentas especializadas para criação de prompts.
4. Organizar referências visuais.
5. Integrar serviços de inteligência artificial.
6. Automatizar processos recorrentes.
7. Permitir o armazenamento e a recuperação de informações.
8. Oferecer uma estrutura preparada para evolução comercial.

---

# 2. IDENTIDADE E DIRETRIZES DO PRODUTO

## 2.1. Identidade

**Nome:** GAMBO

**Assinatura institucional:** Creative Intelligence Platform.

**Posicionamento:** Uma plataforma para estúdios e agências criativas.

**Conceito de marca:** Tecnologia evolui. Criatividade permanece.

## 2.2. Diretrizes visuais

A identidade visual deve transmitir tecnologia, sofisticação e criatividade.

Diretrizes:

- Interface moderna e organizada.
- Tons escuros, neutros, areia, creme e cobre.
- Hierarquia tipográfica bem definida.
- Elementos visuais discretos.
- Componentes consistentes.
- Navegação intuitiva.
- Ausência de elementos decorativos excessivos.

A identidade deve evitar a estética genérica de ferramentas de IA, como excesso de neon, gradientes chamativos e elementos futuristas sem função.

## 2.3. Princípios de experiência

1. Simplicidade sem perda de funcionalidade.
2. Organização das informações.
3. Integração entre ferramentas.
4. Preservação da identidade das ferramentas incorporadas.
5. Transparência sobre o funcionamento da inteligência artificial.
6. Segurança e privacidade dos dados.

---

# 3. ESCOPO FUNCIONAL

## 3.1. Início — Dashboard

O dashboard é a área principal da plataforma.

Deve apresentar:

- Visão geral do ambiente.
- Acesso aos módulos.
- Projetos recentes.
- Atividades recentes.
- Atalhos para criação de projetos.
- Acesso ao assistente GAMBO, quando habilitado.
- Notificações relevantes.

Os indicadores e atividades devem representar informações reais do sistema, não dados fictícios apresentados como informações de produção.

## 3.2. Projetos

Módulo responsável pela organização dos trabalhos criativos.

Funcionalidades previstas:

- Criar projetos.
- Consultar projetos.
- Editar informações.
- Organizar descrição e briefing.
- Definir status.
- Consultar histórico.
- Associar referências e materiais.
- Arquivar projetos.
- Excluir projetos conforme as regras de retenção.

Cada projeto deve possuir identificação própria e associação ao seu proprietário ou espaço de trabalho.

## 3.3. AI Director

O AI Director é o módulo de inteligência criativa do GAMBO.

Sua finalidade é auxiliar o profissional na construção e no desenvolvimento de conceitos visuais.

Fluxo funcional proposto:

1. Receber uma ideia ou briefing.
2. Identificar o objetivo criativo.
3. Interpretar as informações fornecidas.
4. Consultar conhecimentos disponíveis quando necessário.
5. Construir uma proposta de direção criativa.
6. Organizar recomendações.
7. Gerar instruções e prompts.
8. Permitir ajustes pelo usuário.
9. Associar o resultado ao projeto correspondente.

O AI Director deve funcionar como um assistente de direção de arte, não apenas como um campo de conversa genérico.

A implementação deve permitir ferramentas especializadas, contexto dos projetos e recuperação de conhecimento.

**Importante:** geração de imagens não deve ser considerada uma capacidade automaticamente disponível. Ela depende da integração com um serviço específico de geração visual.

## 3.4. BMT Prompt Studio

O BMT Prompt Studio é uma ferramenta independente incorporada ao GAMBO.

Sua incorporação deve preservar a identidade visual e a experiência original desenvolvida por seu criador, como homenagem.

A ferramenta tem como finalidade construir prompts fotográficos detalhados e coerentes.

### Estrutura funcional

- Produção fotográfica.
- Assunto/modelo.
- Configurações de iluminação.
- Sombras.
- Cores e materiais.
- Características visuais.
- Construção do prompt final.

### Recursos conhecidos da versão original

- Regras locais em JavaScript.
- Interface em português e inglês.
- Geração textual de prompts.
- Cópia do resultado.
- Exportação em TXT.
- Restauração de configurações.

### Regras de integração

O BMT deve continuar em uma aba própria.

A integração não deve descaracterizar sua interface.

A associação de prompts a projetos e o armazenamento no Supabase são capacidades de integração a implementar ou validar, não características presumidas da ferramenta original.

O BMT não deve ser apresentado como gerador de imagens por si só.

## 3.5. Acervo Criativo

Módulo destinado à organização de referências e repertório visual.

Funcionalidades previstas:

- Cadastro de referências.
- Nome e descrição.
- Categorias.
- Coleções.
- Tags.
- Imagens de capa.
- Consulta e organização.
- Associação de referências aos projetos.

O acervo deve permitir a construção de uma base de conhecimento visual organizada.

## 3.6. Automações

Módulo destinado à integração de processos automatizados.

A infraestrutura prevista utiliza o n8n como orquestrador de workflows.

Possibilidades:

- Recebimento de eventos.
- Processamento de informações.
- Integração com serviços externos.
- Execução de tarefas automatizadas.
- Comunicação com agentes de IA.
- Notificações.
- Registro de execuções e erros.

A interface do GAMBO deve permitir visualizar os processos disponíveis e seus estados, conforme as integrações efetivamente implementadas.

## 3.7. Configurações

Área de gerenciamento das preferências e informações da conta.

Escopo previsto:

- Perfil.
- Preferências de interface.
- Idioma, quando disponível.
- Configurações de conta.
- Preferências de notificações.
- Segurança e sessão.
- Preferências relacionadas ao espaço de trabalho.

## 3.8. Ajuda e suporte

Área de orientação aos usuários.

Deve conter:

- Apresentação da plataforma.
- Manual de utilização.
- Explicação dos módulos.
- Perguntas frequentes.
- Orientações sobre erros comuns.
- Informações de contato e suporte, quando configuradas.

Também deve disponibilizar um tutorial de utilização do GAMBO.

## 3.9. Planos e preços

O GAMBO deverá possuir uma estrutura comercial configurável.

A tabela de preços deve permitir registrar:

- Nome do plano.
- Descrição.
- Preço.
- Periodicidade de cobrança.
- Limites de utilização.
- Recursos disponíveis.
- Quantidade de usuários.
- Situação do plano.
- Condições comerciais.

Os valores e os limites comerciais devem ser definidos pela administração do produto.

Não devem existir preços fictícios apresentados como preços oficiais.

A estrutura deverá permitir futuras integrações com provedores de pagamento, sem pressupor que a cobrança já esteja implementada.

---

# 4. REQUISITOS DO SISTEMA

## 4.1. Requisitos funcionais

| ID | Requisito |
|---|---|
| RF01 | Permitir autenticação de usuários. |
| RF02 | Permitir gerenciamento de perfil. |
| RF03 | Permitir criação e gerenciamento de projetos. |
| RF04 | Disponibilizar o AI Director. |
| RF05 | Permitir construção de prompts no BMT. |
| RF06 | Disponibilizar o Acervo Criativo. |
| RF07 | Permitir organização de referências. |
| RF08 | Disponibilizar a área de automações. |
| RF09 | Permitir gerenciamento de preferências. |
| RF10 | Disponibilizar ajuda e suporte. |
| RF11 | Permitir associação de recursos aos projetos. |
| RF12 | Registrar atividades relevantes. |
| RF13 | Disponibilizar estrutura de planos e preços. |
| RF14 | Controlar acesso aos dados conforme permissões. |
| RF15 | Integrar serviços externos por interfaces seguras. |

## 4.2. Requisitos não funcionais

| ID | Requisito |
|---|---|
| RNF01 | Interface responsiva. |
| RNF02 | Segurança no armazenamento dos dados. |
| RNF03 | Proteção de informações pessoais. |
| RNF04 | Controle de acesso por usuário. |
| RNF05 | Organização e manutenção do código. |
| RNF06 | Tratamento de erros. |
| RNF07 | Desempenho adequado. |
| RNF08 | Compatibilidade com navegadores modernos. |
| RNF09 | Integridade dos dados. |
| RNF10 | Facilidade de evolução e manutenção. |
| RNF11 | Registro de operações importantes. |
| RNF12 | Proteção de credenciais e segredos. |

## 4.3. Regras de negócio

- Cada usuário deve acessar somente os recursos autorizados.
- Os projetos devem manter associação com seus respectivos proprietários ou espaços de trabalho.
- As referências devem possuir identificação e organização.
- O AI Director deve utilizar somente integrações e ferramentas efetivamente configuradas.
- Falhas de serviços externos não devem comprometer a integridade dos projetos.
- A utilização de ferramentas de IA poderá estar sujeita a limites comerciais.
- Os planos devem ser configuráveis.
- A exclusão de dados deve respeitar as regras de integridade e retenção.
- A plataforma deve informar quando uma operação não for concluída.

---

# 5. ARQUITETURA TECNOLÓGICA

## 5.1. Visão geral

O GAMBO utiliza uma arquitetura modular, com aplicação frontend, serviços de backend, banco de dados e integrações externas.

### Camadas

**Frontend**
- Interface do usuário.
- Navegação.
- Componentes.
- Formulários.
- Comunicação com os serviços.

**Backend e serviços**
- Autenticação.
- Regras de negócio.
- Integrações.
- Processamento.
- Operações privilegiadas.

**Persistência**
- PostgreSQL.
- Supabase.
- Supabase Storage, quando utilizado.
- Políticas de acesso.

**Inteligência artificial**
- Modelos de linguagem.
- Agentes.
- Ferramentas.
- Recuperação de conhecimento.
- Processamento de contexto.

**Automação**
- n8n.
- Webhooks.
- Integrações externas.
- Notificações.

## 5.2. Tecnologias identificadas no projeto

| Tecnologia | Responsabilidade |
|---|---|
| React | Construção da interface. |
| TypeScript | Tipagem e segurança do código. |
| Vite | Build e desenvolvimento frontend. |
| TanStack Router | Navegação e gerenciamento de rotas. |
| Supabase | Banco de dados, autenticação e serviços. |
| PostgreSQL | Banco de dados relacional. |
| n8n | Orquestração de automações. |
| Google Gemini | Serviço de inteligência artificial previsto. |
| RAG | Recuperação de conhecimento contextual. |

A versão exata de cada dependência deve ser confirmada no arquivo de dependências e no lockfile do repositório.

## 5.3. Arquitetura de integração

Fluxo conceitual:

Usuário → Interface GAMBO → Serviços da aplicação → Supabase ou serviços externos → Retorno à interface.

Para operações com inteligência artificial:

Usuário → AI Director → Camada de orquestração → Recuperação de contexto/RAG → Modelo de IA → Processamento do resultado → GAMBO.

Para automações:

Evento → Webhook/n8n → Processamento → Serviço integrado → Resultado → Registro e notificação.

Esses fluxos representam a arquitetura pretendida. A implementação efetiva deve ser conferida no código e nos workflows existentes.

---

# 6. BANCO DE DADOS E PERSISTÊNCIA

## 6.1. Tecnologia

O banco de dados utiliza PostgreSQL por meio do Supabase.

O banco existente é considerado a fonte oficial da estrutura de persistência do GAMBO.

## 6.2. Diretriz obrigatória de preservação

Nenhuma documentação ou atividade de desenvolvimento deve presumir que o banco pode ser recriado.

São obrigatórias as seguintes medidas:

- Preservar as tabelas existentes.
- Preservar os relacionamentos.
- Preservar os dados.
- Preservar as políticas RLS.
- Preservar as funções e triggers existentes.
- Preservar as configurações de autenticação.
- Evitar alterações destrutivas.
- Utilizar migrations versionadas.
- Documentar alterações de estrutura.

## 6.3. Modelo conceitual de dados

As seguintes entidades representam conceitos do produto. Não constituem uma declaração de que essas tabelas já existem no banco.

| Entidade conceitual | Finalidade |
|---|---|
| Usuários | Identidade e acesso. |
| Perfis | Informações complementares. |
| Projetos | Organização dos trabalhos. |
| Referências | Materiais do Acervo Criativo. |
| Coleções | Agrupamento de referências. |
| Prompts | Armazenamento de instruções criativas. |
| Histórico de IA | Registro de interações. |
| Automações | Configuração e identificação de processos. |
| Execuções | Histórico de workflows. |
| Planos | Estrutura comercial. |
| Assinaturas | Relacionamento comercial com usuários. |

O modelo físico definitivo deve ser produzido a partir do schema real do Supabase.

## 6.4. Segurança do banco

Todas as tabelas expostas precisam ter permissões adequadas e políticas de Row Level Security.

As políticas devem garantir que usuários não consigam acessar ou alterar dados pertencentes a outras contas sem autorização.

As operações de atualização devem validar tanto a propriedade dos registros quanto os valores resultantes.

O Storage também deve utilizar políticas específicas para controlar uploads, leituras e exclusões.

---

# 7. INTELIGÊNCIA ARTIFICIAL E RAG

## 7.1. Objetivo

A inteligência artificial do GAMBO deve funcionar como uma camada de apoio aos processos criativos.

Sua finalidade não é apenas responder perguntas, mas interpretar contexto, auxiliar na organização de informações e produzir resultados úteis ao trabalho.

## 7.2. AI Director

O AI Director deverá possuir:

- Interpretação de briefings.
- Contextualização de projetos.
- Construção de direções criativas.
- Sugestões de composição.
- Recomendações de iluminação.
- Sugestões de materiais e referências.
- Construção de prompts.
- Possibilidade de utilizar ferramentas especializadas.

## 7.3. RAG — Retrieval-Augmented Generation

O RAG permite que o modelo consulte documentos e informações relevantes antes de elaborar uma resposta.

Fluxo conceitual:

1. Recebimento da solicitação.
2. Identificação do contexto.
3. Transformação da consulta em representação adequada para busca.
4. Recuperação dos documentos relevantes.
5. Seleção das informações.
6. Envio do contexto ao modelo.
7. Construção da resposta.
8. Retorno ao usuário.

A base de conhecimento poderá incluir:

- Documentação do GAMBO.
- Guias de direção de arte.
- Materiais de fotografia.
- Documentação de ferramentas.
- Padrões de produção.
- Informações dos projetos autorizados.

O acesso aos documentos deve respeitar as permissões de cada usuário.

## 7.4. Modelos de IA

O Google Gemini foi definido como uma tecnologia prevista para integração.

A aplicação deve manter a comunicação com os modelos isolada em uma camada própria, evitando dependência excessiva de um único fornecedor.

Devem ser previstos:

- Controle de erros.
- Limites de requisições.
- Controle de custos.
- Registro de consumo.
- Tempo limite de execução.
- Tratamento de indisponibilidade.
- Proteção das credenciais.

---

# 8. AUTOMAÇÕES COM N8N

## 8.1. Responsabilidade

O n8n será utilizado como ferramenta de orquestração dos processos automatizados.

Ele poderá conectar o GAMBO a serviços externos e executar tarefas que não precisam ocorrer diretamente na interface.

## 8.2. Estrutura dos workflows

Cada workflow deve possuir:

- Identificação.
- Objetivo.
- Gatilho.
- Dados de entrada.
- Etapas de processamento.
- Serviços envolvidos.
- Dados de saída.
- Tratamento de falhas.
- Registro de execução.

## 8.3. Comunicação

A comunicação poderá ocorrer por meio de webhooks e APIs.

As requisições devem validar autenticação, origem, formato dos dados e permissões.

Devem ser previstos mecanismos para evitar processamento duplicado quando a operação exigir idempotência.

## 8.4. Monitoramento

O sistema deve permitir identificar:

- Execuções concluídas.
- Execuções com falha.
- Tempo de processamento.
- Erros de integração.
- Tentativas de reprocessamento.
- Situação dos serviços.

---

# 9. SEGURANÇA, PRIVACIDADE E GOVERNANÇA

## 9.1. Autenticação

A autenticação deve utilizar o Supabase Auth, conforme a implementação existente.

A aplicação deve tratar corretamente:

- Login.
- Logout.
- Recuperação de senha.
- Sessões.
- Expiração de tokens.
- Rotas protegidas.

## 9.2. Controle de acesso

O acesso aos dados deve ser protegido por políticas de banco, e não somente por verificações na interface.

Devem ser avaliados os acessos de usuários autenticados, visitantes e serviços administrativos.

## 9.3. Proteção de credenciais

É proibido:

- Colocar chaves secretas no frontend.
- Comitar arquivos `.env` com credenciais reais.
- Expor `service_role` ou chaves secretas.
- Inserir tokens privados em prompts compartilhados.
- Registrar credenciais em logs.

As variáveis de ambiente devem ser documentadas com nomes e finalidades, nunca com valores secretos.

## 9.4. LGPD

O GAMBO deverá observar os princípios da Lei Geral de Proteção de Dados Pessoais.

A documentação de produção deverá contemplar:

- Finalidade do tratamento.
- Necessidade de coleta.
- Transparência.
- Controle de acesso.
- Retenção.
- Exclusão de dados.
- Direitos dos titulares.
- Segurança da informação.

A definição de bases legais e políticas de privacidade deverá ser validada juridicamente.

---

# 10. MANUAL DO USUÁRIO

## 10.1. Primeiros passos

1. Acessar a plataforma.
2. Realizar login.
3. Conferir o dashboard.
4. Acessar Projetos.
5. Criar um projeto.
6. Explorar as ferramentas disponíveis.

## 10.2. Criando um projeto

1. Acessar Projetos.
2. Selecionar Novo Projeto.
3. Informar o nome.
4. Preencher a descrição.
5. Registrar o briefing.
6. Salvar.
7. Acessar o projeto para continuar o trabalho.

## 10.3. Utilizando o AI Director

1. Acessar AI Director.
2. Informar a ideia ou briefing.
3. Fornecer o contexto necessário.
4. Solicitar uma direção criativa.
5. Analisar a resposta.
6. Ajustar as instruções.
7. Salvar ou associar o resultado ao projeto, caso esse recurso esteja habilitado.

## 10.4. Utilizando o BMT Prompt Studio

1. Acessar BMT Prompt Studio.
2. Selecionar as configurações de produção fotográfica.
3. Definir o assunto ou modelo.
4. Configurar iluminação e características visuais.
5. Conferir o prompt produzido.
6. Copiar ou exportar o resultado.

## 10.5. Utilizando o Acervo Criativo

1. Acessar Acervo Criativo.
2. Criar ou selecionar uma coleção.
3. Adicionar uma referência.
4. Preencher nome e descrição.
5. Selecionar categoria.
6. Adicionar tags.
7. Salvar.

## 10.6. Utilizando Automações

1. Acessar Automações.
2. Consultar os processos disponíveis.
3. Selecionar o processo desejado.
4. Conferir os parâmetros.
5. Executar, quando autorizado.
6. Consultar o resultado.

Os procedimentos definitivos devem ser atualizados conforme os recursos disponíveis na interface de produção.

---

# 11. TESTES E QUALIDADE

## 11.1. Testes funcionais

Validar:

- Cadastro e autenticação.
- Criação de projetos.
- Edição e consulta.
- Exclusão e arquivamento.
- Associação de referências.
- Funcionamento do BMT.
- Funcionamento do AI Director.
- Integrações.
- Configurações.
- Ajuda e suporte.

## 11.2. Testes de integração

Verificar:

- Comunicação frontend e Supabase.
- Persistência de dados.
- Autenticação.
- Comunicação com Gemini.
- Integração com n8n.
- Webhooks.
- Tratamento de erros.
- Armazenamento de arquivos.

## 11.3. Testes de segurança

Verificar:

- Isolamento de usuários.
- Políticas RLS.
- Acesso indevido a registros.
- Proteção de credenciais.
- Permissões de Storage.
- Proteção de endpoints.
- Validação de dados de entrada.

## 11.4. Critérios de qualidade

O sistema deverá passar por:

- Verificação de tipos.
- Lint.
- Testes automatizados.
- Build de produção.
- Testes de navegação.
- Testes de persistência.
- Testes de autorização.

Uma funcionalidade somente deve ser considerada concluída quando estiver implementada, integrada e testada.

---

# 12. DEPLOY E MANUTENÇÃO

## 12.1. Ambientes

A arquitetura deverá diferenciar:

- Desenvolvimento.
- Preview/homologação.
- Produção.

As configurações de cada ambiente devem ser independentes.

## 12.2. Processo de publicação

1. Atualizar a branch de desenvolvimento.
2. Executar verificações.
3. Rodar os testes.
4. Revisar as alterações.
5. Criar commit.
6. Abrir pull request.
7. Executar validações de integração.
8. Realizar merge conforme o fluxo definido.
9. Publicar.
10. Verificar o ambiente.

## 12.3. Manutenção

Devem ser documentados:

- Dependências.
- Atualizações.
- Migrations.
- Logs.
- Erros.
- Integrações.
- Procedimentos de recuperação.
- Alterações de arquitetura.

---

# 13. MODELO COMERCIAL E EVOLUÇÃO

## 13.1. Estrutura de planos

O GAMBO deverá permitir planos comerciais configuráveis, com diferenças de recursos e limites de utilização.

A estrutura de preços deverá ser independente das regras internas de cada módulo.

## 13.2. Controle de consumo

Deverão ser considerados:

- Requisições de IA.
- Tokens consumidos.
- Execuções de automação.
- Armazenamento.
- Limites por usuário ou equipe.
- Custos por fornecedor.

## 13.3. Evolução comercial

Possibilidades futuras:

- Planos individuais.
- Planos para equipes.
- Espaços de trabalho compartilhados.
- Administração de membros.
- Permissões por função.
- Cobrança recorrente.
- Relatórios de utilização.

Esses recursos dependem de decisões comerciais e implementação específica.

---

# 14. ROADMAP

## Fase 1 — Fundação
- Estrutura da aplicação.
- Identidade visual.
- Navegação.
- Autenticação.
- Integração com Supabase.

## Fase 2 — Ferramentas criativas
- Projetos.
- AI Director.
- BMT Prompt Studio.
- Acervo Criativo.

## Fase 3 — Inteligência e automação
- Integração com Gemini.
- Agentes e ferramentas.
- RAG.
- Workflows n8n.
- Notificações.

## Fase 4 — Produto comercial
- Planos e preços.
- Controle de utilização.
- Gestão de equipes.
- Integração de pagamentos.

## Fase 5 — Qualidade e expansão
- Testes completos.
- Segurança.
- Monitoramento.
- Otimização.
- Documentação de produção.

O roadmap representa uma organização de evolução. Não declara que todos os itens já estejam concluídos.

---

# 15. GLOSSÁRIO

| Termo | Definição |
|---|---|
| AI Director | Assistente de direção criativa com IA. |
| API | Interface de comunicação entre sistemas. |
| Backend | Camada responsável pelo processamento e regras de negócio. |
| Frontend | Interface visual da aplicação. |
| Gemini | Família de modelos de inteligência artificial do Google. |
| n8n | Plataforma de automação de workflows. |
| RAG | Técnica que recupera informações externas para contextualizar respostas de IA. |
| Supabase | Plataforma de backend baseada em PostgreSQL. |
| PostgreSQL | Sistema de gerenciamento de banco de dados relacional. |
| RLS | Controle de acesso a registros no banco de dados. |
| Webhook | Mecanismo de comunicação acionado por eventos. |
| Workflow | Sequência estruturada de etapas automatizadas. |
| Prompt | Instrução enviada a um modelo de inteligência artificial. |
| Token | Unidade utilizada no processamento de modelos de linguagem. |
| Migration | Arquivo versionado que registra alterações no banco de dados. |

---

# 16. CONTROLE DOCUMENTAL

**Produto:** GAMBO  
**Documento:** Documentação Oficial do Produto e do Sistema  
**Versão:** 1.0 — Base documental inicial  
**Última atualização:** 19/11/2026

## Diretriz de atualização

Toda alteração relevante no produto deverá ser acompanhada da atualização da documentação correspondente.

Devem ser registrados:

- O que foi alterado.
- Qual módulo foi afetado.
- Qual decisão técnica foi tomada.
- Quais integrações foram modificadas.
- Quais testes foram executados.
- Quais limitações permanecem.

A documentação deve acompanhar a implementação real, evitando descrever funcionalidades inexistentes como concluídas.

---

**GAMBO — Tecnologia evolui. Criatividade permanece.**
