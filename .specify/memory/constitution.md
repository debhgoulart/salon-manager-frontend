<!--
Sync Impact Report:
- Version change: 0.0.0 (template inicial) → 1.0.0 (ratificação oficial)
- List of modified principles:
  - Criação inicial dos princípios a partir da auditoria técnica do salon-manager-frontend
- Added sections:
  - Core Principles:
    - I. Modularidade por Domínio e Separação Estrita de Responsabilidades
    - II. Comunicação HTTP Padronizada e Contratos Rígidos com Spring Boot
    - III. Design System Boutique, Estados Completos de Interface e Acessibilidade (NON-NEGOTIABLE)
    - IV. Gerenciamento de Estado Previsível com Pinia e Blindagem de Segurança
    - V. Qualidade de Código, Validação e Gates de Testabilidade
  - Diretrizes de Integração com Backend Spring Boot e Segurança
  - Metodologia de Desenvolvimento e Governança Spec Kit
  - Governance
- Removed sections:
  - Nenhum (substituição dos placeholders do scaffold)
- Follow-up TODOs:
  - Configuração de framework de testes automatizados (Vitest / Vue Test Utils)
  - Correção do script "lint:check" no package.json (adicionar flag --check ao prettier)
  - Desacoplamento do componente monolítico AgendaView.vue em subcomponentes e composables
-->

# Salon Manager Frontend Constitution

## Core Principles

### I. Modularidade por Domínio e Separação Estrita de Responsabilidades

A arquitetura da aplicação MUST respeitar uma separação rígida de camadas e organizar o código por domínio funcional (agendamentos, clientes, colaboradores, serviços, financeiro, fechamento contábil).

- A camada de apresentação (Vue Components / Pages) MUST NOT conter chamadas HTTP diretas, cálculos complexos de regras financeiras ou mutações manuais de estado global.
- O código MUST ser segregado nas seguintes camadas bem definidas:
  1. **Apresentação (`views`, `components`):** Responsável estritamente pela renderização visual, bindings reativos e eventos de interação do usuário.
  2. **Orquestração de Interface (`composables`):** Centraliza a lógica de UI, controle de modais, debounces, formatação e orquestração de paginação/filtros.
  3. **Estado Global (`stores`):** Utilizada apenas para dados verdadeiramente compartilhados entre módulos ou sessões globais (autenticação, preferências de tema e usuário logado).
  4. **Comunicação de Dados (`services`):** Encapsula chamadas HTTP com Axios, tratamento de parâmetros de rota e respostas do servidor.
  5. **Contratos e Tipagem (`types`):** Interfaces e enums TypeScript estritos espelhando 1:1 os DTOs e contratos da API.
- Componentes de visualização (`Views`) que excedam 300 linhas de código MUST ser decompostos em subcomponentes de apresentação coesos e composables de lógica dedicados.

### II. Comunicação HTTP Padronizada e Contratos Rígidos com Spring Boot

Toda e qualquer comunicação de rede MUST transitar exclusivamente através da instância centralizada do cliente HTTP (`src/services/api.ts`) e dos serviços especializados em `src/services/`.

- É expressamente proibido invocar `axios.get/post/put/delete` diretamente de dentro de componentes Vue, páginas ou stores.
- Os modelos de dados MUST manter compatibilidade estrita com os padrões do backend Java Spring Boot:
  - Listagens paginadas MUST utilizar a interface genérica `PageResponse<T>`.
  - Falhas e exceções MUST ser tratadas aderindo ao padrão RFC 7807 / RFC 9457 (`ProblemDetails`), com extração e exibição apropriada de `detail`, `title` e lista de `invalidParams`.
- O interceptor HTTP centralizado é responsável por injetar tokens JWT (`Bearer`), orquestrar renovação transparente via _refresh token_ e encerrar a sessão caso a renovação falhe.
- É expressamente proibido capturar erros de requisições com blocos `catch { }` vazios ou que silenciem falhas sem feedback visual explícito ao operador do sistema.
- Regras de negócio pertencem ao backend Spring Boot (ex: apuração de comissões, travamento de competência contábil encerrada `ClosedPeriodException`, validação de disponibilidade e choque de horários). O frontend MUST consumir e refletir as validações da API, sem tentar duplicar ou reinventar regras de negócio do servidor.

### III. Design System Boutique, Estados Completos de Interface e Acessibilidade (NON-NEGOTIABLE)

O Salon Manager adota o padrão estético **SaaS Boutique Contemporâneo** (Vinho Nobre `#7B3F61`, Champagne Dourado `#C59B6D`, superfícies elegantes, tipografia _Plus Jakarta Sans_, cantos arredondados de 8px a 12px e microinterações polidas).

- **Consistência Visual de Ícones:** A biblioteca oficial exclusiva de ícones do projeto é **Lucide Icons** (`lucide-vue-next`). Não é permitido misturar aleatoriamente classes de Material Icons ou FontAwesome em novos desenvolvimentos visuais.
- **Quatro Estados de Interface Obrigatórios (NON-NEGOTIABLE):** Qualquer tela, tabela, modal ou seção que consuma dados assíncronos MUST implementar:
  1. **Loading State:** Feedback visual nítido durante o trânsito da requisição (`AppLoading`, spinners ou `q-skeleton`).
  2. **Empty State:** Exibição amigável via `AppEmptyState` quando filtros ou listagens não trouxerem dados, com orientação e botão de ação primária (ex: "Cadastrar Primeiro Item" ou "Limpar Filtros").
  3. **Error State:** Exibição explicativa via `AppErrorState` informando o ocorrido e disponibilizando botão de ação imediata ("Tentar Novamente").
  4. **Success State:** Exibição estruturada, legível e responsiva dos dados.
- **Acessibilidade e Responsividade:** Todo layout e formulário MUST funcionar fluidamente em resoluções Desktop, Tablet e Mobile (breakpoints Quasar), garantindo alvos de toque mínimos de 44px, navegação por teclado e contraste de cores conforme normas WCAG AA.
- **Suporte Nativo a Temas (Light / Dark):** Toda nova página ou componente MUST testar e suportar alternância perfeita entre tema claro e escuro, respeitando as variáveis semânticas do Quasar e as classes `body--dark`.

### IV. Gerenciamento de Estado Previsível com Pinia e Blindagem de Segurança

O estado global da aplicação deve ser previsível, coeso e blindado contra vulnerabilidades de segurança e inconsistências operacionais.

- O Pinia MUST ser reservado exclusivamente para estados globais que transcendem a vida útil de uma página individual (ex: sessão autenticada, permissões do usuário e preferências visuais). Estados específicos de telas, formulários ou paginação MUST residir em `ref`/`reactive` ou composables locais.
- Stores MUST possuir responsabilidade única: é proibido misturar controle de tema visual com controle de gavetas ou menus de layout em uma mesma store.
- **Segurança de Acesso e Credenciais:**
  - Nenhuma credencial padrão ou de teste (e-mails, senhas ou tokens) pode ser mantida hardcoded como valor inicial em estados reativos de formulários em arquivos de produção.
  - Credenciais, chaves de API secretas ou certificados NUNCA devem ser embutidos no bundle de frontend ou versionados em repositório.
  - O controle de acesso por papéis (RBAC - `ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_RECEPTIONIST`, `ROLE_PROFESSIONAL`) MUST ser validado preventivamente em rotas e menus, impedindo a exibição indevida de módulos não autorizados, sem perder de vista que o backend é a barreira definitiva de autorização.
- **Tratamento de Datas e Fusos:** O frontend MUST manipular datas e horários respeitando rigorosamente o fuso horário local da operação do salão, evitando conversões precipitadas ou inserção arbitrária de sufixos `Z` (UTC) que desloquem compromissos em fusos negativos (ex: horário de Brasília UTC-3).

### V. Qualidade de Código, Validação e Gates de Testabilidade

Todo código adicionado ou mantido no repositório MUST seguir rigorosos padrões de legibilidade, tipagem estrita e verificação contínua.

- **Tipagem Estrita com TypeScript:** O projeto opera com checagem estrita (`strict: true`). O uso de `any` ou type-casting inseguro (`as unknown as ...`) é estritamente desencorajado e exige justificativa documentada.
- **Validação de Formulários:** Todo formulário de entrada MUST validar campos obrigatórios, formatos (CPF, telefone, e-mail, moeda) e limites antes da submissão à API, exibindo mensagens de validação claras em português (pt-BR).
- **Eliminação de Código Duplicado:** Padrões recorrentes de interface (tabelas com paginação e busca, confirmações de deleção/ativação, formatação de dados) MUST ser abstraídos em composables compartilhados (`useFormatters`, `usePagination`, etc.), evitando a repetição de lógica idêntica entre múltiplos módulos.
- **Gates de Verificação Contínua (NON-NEGOTIABLE):** Antes de qualquer entrega, release ou merge de funcionalidade, é obrigatório validar:
  1. Checagem de tipos estática sem erros (`npm run typecheck`).
  2. Verificação de lint e formatação sem violações (`npm run lint:check` ou `eslint`).
  3. Compilação de build para produção concluída com êxito (`npm run build`).
  4. Testes automatizados cobrindo composables críticos, regras de formatação e fluxos centrais de negócio de interface.

## Diretrizes de Integração com Backend Spring Boot e Segurança

1. **Fronteira Arquitetural:** O frontend é uma camada consumidora e apresentadora. Regras de negócio contábeis, fechamentos de competência, persistência de dados e regras de comissionamento são soberanas no backend Java Spring Boot.
2. **Variáveis de Ambiente:** URLs base da API e configurações de ambiente MUST ser parametrizadas via variáveis prefixadas por `VITE_` (definidas em `.env` e documentadas no `.env.example`). Valores de produção nunca devem ser versionados no código-fonte.
3. **Resiliência a Falhas de Conexão:** A aplicação deve lidar com indisponibilidade temporária da API exibindo mensagens compreensíveis ao usuário e permitindo nova tentativa sem quebrar o estado da aplicação.
4. **Proteção contra Violação de Períodos Encerrados:** Diante de respostas com código 409 (Conflict) ou exceções do tipo `ClosedPeriodException`, o frontend MUST interceptar e informar com clareza ao usuário que o mês contábil correspondente se encontra bloqueado para edições ou lançamentos.
5. **Autenticação Segura:** O armazenamento de tokens de autenticação deve ser isolado e o tráfego deve ocorrer obrigatoriamente sob conexões seguras HTTPS em ambientes públicos.

## Metodologia de Desenvolvimento e Governança Spec Kit

O desenvolvimento e a evolução do projeto `salon-manager-frontend` passam a obedecer formalmente à metodologia do **Spec Kit**, regido pelas seguintes 8 regras mandatórias:

1. **Especificação Obrigatória:** Nenhuma funcionalidade nova ou alteração substancial deve ser implementada sem especificação prévia aprovada (`/speckit-specify`).
2. **Avaliação Prévia de Impacto:** Antes de executar qualquer reestruturação ou alteração de contratos compartilhados, deve-se planejar o impacto nos módulos existentes (`/speckit-plan`).
3. **Preservação do Legado Funcional:** Funcionalidades que já atendem aos requisitos operacionais do salão MUST ser preservadas durante refatorações.
4. **Proibição de Exclusão Injustificada:** Nenhum arquivo, rota, serviço ou tipo pode ser removido sem registro explícito da justificativa técnica.
5. **Reestruturação Incremental:** Evitar reescritas integrais ou refatorações em massa desnecessárias; priorizar melhorias contínuas, modulares e seguras.
6. **Rastreabilidade e Documentação:** Toda decisão arquitetural ou alteração de contrato de dados relevante deve ser documentada nos artefatos correspondentes.
7. **Respeito à Autonomia Backend-Frontend:** Manter independência de desenvolvimento, sem antecipar ou forjar contratos inexistentes na API Spring Boot.
8. **Fidelidade aos Requisitos:** Não inventar requisitos fictícios, campos desnecessários ou complexidades além do escopo especificado.

## Governance

A presente Constitution é a fonte de autoridade máxima e vinculativa para o projeto `salon-manager-frontend`. Todas as especificações funcionais, planos técnicos, listas de tarefas e revisões de código (PRs) MUST comprovar total conformidade com os princípios aqui ratificados.

- **Procedimento de Emenda:** Alterações nesta Constitution exigem:
  1. Justificativa formal documentando a necessidade da mudança.
  2. Análise de impacto nos módulos e componentes existentes.
  3. Atualização semântica de versão:
     - **MAJOR:** Remoção, flexibilização ou redefinição incompatível de princípios vigentes.
     - **MINOR:** Adição de novo princípio, seção arquitetural ou expansão material das diretrizes.
     - **PATCH:** Ajustes redacionais, correções tipográficas e refinamentos sem alteração de diretriz.
- **Compliance Review:** Toda nova tarefa criada no fluxo Spec Kit (`tasks.md`) e todo código submetido a revisão deve passar por gate de verificação frente a estes princípios.
- **Resolução de Conflitos:** Em caso de discrepância entre uma especificação funcional e a Constitution, a Constitution prevalece até que seja formalmente emendada.

**Version**: 1.0.0 | **Ratified**: 2026-11-13 | **Last Amended**: 2026-11-13
