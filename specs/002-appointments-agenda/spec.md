# Feature Specification: Motor de Agendamentos e Agenda Visual

**Feature Branch**: `002-appointments-agenda`

**Created**: 2026-11-14

**Status**: Draft

**Input**: User description: "Motor de Agendamentos e Agenda Visual (gestão de horários diários/semanais, bloqueios e transições de status do agendamento)"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Visualização e Navegação da Grade de Horários (Diária e Semanal) (Priority: P1) 🎯 MVP

Como recepcionista ou gerente do salão de beleza,
quero visualizar a grade de atendimentos organizada por horários tanto em visão diária detalhada quanto em visão semanal compacta,
para que eu possa identificar rapidamente a ocupação dos profissionais e planejar o atendimento aos clientes do dia e da semana.

**Why this priority**: É a espinha dorsal de toda a operação diária do salão. Sem a visualização clara da grade e a capacidade de filtrar por profissional e alternar datas, a recepção não consegue operar a rotina do estabelecimento.

**Independent Test**: Pode ser testado navegando para `/agenda`, alternando o modo entre "Dia" e "Semana", trocando de colaborador no filtro e avançando/retrocedendo datas; a grade deve renderizar os horários das 08:00 às 20:00 com os cards posicionados nos horários corretos.

**Acceptance Scenarios**:

1. **Given** que o operador acessa a tela de Agenda (`/agenda`), **When** a página carrega, **Then** o sistema exibe por padrão a data de hoje na visão diária com o filtro "Todos os Profissionais", apresentando os blocos de horários das 08:00 às 20:00 e seus respectivos agendamentos.
2. **Given** que o operador está na visão diária, **When** ele clica no alternador "Semana", **Then** a interface reconstrói a grade exibindo 7 colunas (segunda a domingo ou semana corrente), destacando visualmente o dia atual (`is-today`) com os cards de agendamento em formato mini.
3. **Given** que o operador seleciona um profissional específico no seletor de colaboradores, **When** o filtro é alterado, **Then** a requisição à API é disparada com o parâmetro `employeeId` e a grade passa a exibir somente os agendamentos atribuídos àquele colaborador.
4. **Given** que a requisição de busca de agendamentos falha por instabilidade de rede ou erro na API, **When** a resposta de erro é recebida, **Then** a grade substitui o esqueleto de carregamento pelo componente `AppErrorState` informando o problema e disponibilizando o botão "Tentar Novamente".
5. **Given** que para a data selecionada não há agendamentos cadastrados, **When** a busca retorna lista vazia, **Then** o sistema exibe o componente `AppEmptyState` com mensagem amigável e botão de ação primária "Novo Agendamento".

---

### User Story 2 - Agendamento Rápido com Consulta Reativa de Slots Disponíveis (Priority: P1)

Como recepcionista,
quero clicar em um horário vago na grade da agenda e abrir um modal simplificado de criação de agendamento que consulte dinamicamente os horários realmente livres do profissional,
para que eu possa agendar atendimentos de forma ágil, sem risco de choque de horários ou erros de preenchimento.

**Why this priority**: A marcação de novos procedimentos é a ação de escrita mais frequente da recepção. A consulta reativa de slots garante integridade operacional antes mesmo da submissão à API.

**Independent Test**: Pode ser testado clicando em qualquer slot livre da grade (ex: 10:00 da quarta-feira); o modal deve abrir com data e hora pré-selecionadas, e ao escolher cliente, colaborador e serviço, a lista de horários deve exibir os slots disponíveis retornados pelo backend.

**Acceptance Scenarios**:

1. **Given** que o operador clica em um slot vago na grade (ex: 14:00 do dia 15/11), **When** o modal "Novo Agendamento" abre, **Then** os campos de Data e Horário de Início já vêm pré-preenchidos com a data e hora correspondentes ao slot clicado.
2. **Given** que o operador abre o modal em branco pelo botão superior "Novo Agendamento", **When** ele seleciona um profissional, um serviço e uma data, **Then** o sistema consulta imediatamente o endpoint `/api/v1/appointments/available-slots` exibindo um indicador de carregamento no campo de horários e populando o dropdown apenas com os slots livres.
3. **Given** que o operador busca um cliente no campo de seleção, **When** ele digita 3 ou mais caracteres no campo com busca debounced, **Then** a lista de clientes cadastrados é filtrada dinamicamente com nome e telefone.
4. **Given** que o operador preenche todos os campos obrigatórios e clica em "Agendar Atendimento", **When** o formulário é submetido, **Then** a data e hora local são convertidas com segurança para ISO 8601 UTC através de `toUtcIsoString`, o registro é criado na API, uma notificação de sucesso em pt-BR é emitida e o card do novo agendamento aparece imediatamente na grade.
5. **Given** que o slot selecionado acabou de ser ocupado concorrentemente por outro operador, **When** o backend rejeita com status 409 (Conflict), **Then** o sistema exibe um alerta descritivo de conflito, mantém os dados no formulário e recarrega os slots disponíveis.

---

### User Story 3 - Ciclo de Vida e Transições de Status do Atendimento (Priority: P1)

Como profissional ou recepcionista,
quero acompanhar e alterar o estado de um agendamento através de etapas explícitas (`AGENDADO` → `CONFIRMADO` → `EM_ATENDIMENTO` → `CONCLUIDO`, ou cancelamento/ausência),
para que a equipe do salão saiba exatamente em qual estágio do fluxo operacional cada cliente se encontra.

**Why this priority**: O controle de status sincroniza a recepção, os cabeleireiros/manicures e a etapa posterior de faturamento/comissões, sendo indispensável para o fechamento diário do salão.

**Independent Test**: Clicar em um card de agendamento na grade abre o modal de detalhes com o status atual e o botão contextual correspondente à próxima transição válida; acionar a transição envia o PATCH de status para `/api/v1/appointments/{id}/status` e atualiza a cor do card na grade.

**Acceptance Scenarios**:

1. **Given** que existe um agendamento no estado `AGENDADO`, **When** o operador clica no card, **Then** o modal de detalhes exibe o botão primário "Confirmar Horário" e o menu de opções secundárias com "Cancelar Agendamento" e "Marcar Não Compareceu".
2. **Given** que um agendamento está `CONFIRMADO` e o cliente chega ao salão, **When** o operador aciona "Iniciar Atendimento", **Then** a requisição `PATCH /status` com payload `{ status: 'EM_ATENDIMENTO' }` é enviada e o card assume a cor de destaque operacional (âmbar/aviso) na grade.
3. **Given** que o profissional finaliza o procedimento com o cliente em atendimento, **When** o operador aciona "Concluir Atendimento", **Then** o status transiciona para `CONCLUIDO`, o card assume a cor verde de sucesso e o registro fica apto para cobrança/comissão.
4. **Given** que o cliente avisa previamente que não poderá comparecer, **When** o operador seleciona "Cancelar Agendamento", **Then** o sistema solicita confirmação, executa a transição para `CANCELADO` e atualiza o badge de status na grade.

---

### User Story 4 - Bloqueio de Horários e Indisponibilidade de Profissionais (Priority: P2)

Como gerente ou profissional do salão,
quero poder registrar bloqueios de horários na agenda de um colaborador (ex: intervalo de almoço, folga, treinamento ou compromisso pessoal),
para que o sistema impeça novos agendamentos naquele período e informe visualmente à recepção que o profissional não está disponível.

**Why this priority**: Garante a gestão realista do tempo da equipe, evitando sobrecargas de trabalho ou agendamentos em horários em que o profissional não estará presente no estabelecimento.

**Independent Test**: Registrar um bloqueio de horário para um colaborador entre 12:00 e 13:30; a grade deve exibir a faixa correspondente como hachurada/bloqueada e o seletor de horários de novos agendamentos não deve listar horários dentro desse intervalo.

**Acceptance Scenarios**:

1. **Given** que o operador precisa bloquear a agenda de um profissional em um intervalo do dia, **When** ele aciona a opção "Novo Bloqueio de Horário", **Then** o sistema solicita o profissional, a data, o horário de início, o horário de término e o motivo do bloqueio (ex: "Almoço", "Treinamento").
2. **Given** que um período possui bloqueio ativo, **When** a grade daquele profissional é renderizada, **Then** as células de horário abrangidas pelo bloqueio exibem estilo visual diferenciado (faixa cinza/hachurada com rótulo "Bloqueado: [Motivo]").
3. **Given** que um período está bloqueado, **When** o operador tenta agendar um serviço para aquele colaborador no horário bloqueado, **Then** a consulta de `available-slots` suprime os horários conflitantes e a interface impede a seleção.

---

### User Story 5 - Decomposição Modular da Agenda e Responsividade Boutique (Priority: P2)

Como desenvolvedor e mantenedor do sistema,
quero que o componente monolítico `AgendaView.vue` (atualmente com 907 linhas) seja decomposto em subcomponentes de apresentação coesos e composables dedicados,
para atender ao Princípio I da Constitution (< 300 linhas por arquivo Vue) e assegurar ótima experiência em tablets e celulares da recepção.

**Why this priority**: A Constitution exige formalmente que Views com mais de 300 linhas sejam decompostas (Princípio I e Follow-up TODO #3). Isso facilita manutenibilidade, testes isolados e evolução contínua sem risco de regressão.

**Independent Test**: Avaliar a árvore de componentes da pasta `src/pages/appointments/` e verificar que nenhum arquivo ultrapassa 300 linhas de código, mantendo 100% da fidelidade visual e funcional nos breakpoints Desktop, Tablet e Mobile.

**Acceptance Scenarios**:

1. **Given** a estrutura de arquivos da feature, **When** auditada por contagem de linhas, **Then** `AgendaView.vue` atua puramente como orquestrador de alto nível com menos de 200 linhas, delegando a apresentação para `AgendaHeader.vue`, `AgendaDayGrid.vue`, `AgendaWeekGrid.vue`, `AppointmentCard.vue` e os modais de diálogo.
2. **Given** a lógica de estado reativo e chamadas à API da agenda, **When** inspecionada, **Then** a orquestração reside em composables reutilizáveis (`useAgendaNavigation`, `useAppointmentSlots`, `useAppointmentActions`).
3. **Given** o acesso via dispositivo móvel ou tablet (largura < 768px), **When** a agenda é visualizada, **Then** os touch targets dos cards e botões possuem no mínimo 44px de altura/largura, com rolagem horizontal fluida na grade semanal.

---

### Edge Cases

- **Concorrência de Agendamento Simultâneo**: Dois operadores tentam agendar o mesmo horário com o mesmo profissional. O backend rejeita a segunda requisição com código 409 (Conflict). O frontend deve interceptar o erro RFC 7807/9457 via `useFeedback`, exibir uma mensagem orientativa e disparar a atualização imediata dos slots livres.
- **Fuso Horário Local x UTC**: A máquina do operador pode estar configurada em fuso horário com ou sem horário de verão. A conversão de data/hora deve utilizar o helper `toUtcIsoString` implementado na estabilização, sem manipular strings puras com acréscimo manual de sufixo `Z`.
- **Serviço com Duração Estendida**: O cliente escolhe um serviço de 120 minutos às 19:00 e o salão encerra o expediente às 20:00. O backend deve calcular os `availableSlots` considerando a duração total necessária e o horário de fechamento, e o frontend deve honrar exclusivamente os slots retornados como válidos.
- **Transição de Status Inválida**: O operador tenta forçar uma transição não permitida (ex: de `CONCLUIDO` para `AGENDADO`). A interface deve omitir botões de transição inválidos e, caso ocorra rejeição pela API, exibir mensagem de erro amigável.
- **Falha Parcial na Consulta de Slots**: A consulta de slots disponíveis falha ou demora excessivamente. O dropdown de horários deve exibir estado de loading inline e, em caso de erro, permitir retentativa rápida sem perder o profissional ou serviço já selecionados.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: O sistema MUST fornecer visualização em grade com alternância dinâmica entre modo diário (`day`) e semanal (`week`).
- **FR-002**: O sistema MUST permitir filtragem por profissional individual ou exibição consolidada de toda a equipe na grade.
- **FR-003**: O sistema MUST permitir a navegação entre datas através de controles de dia anterior/próximo, atalho direto "Hoje" e seletor modal de calendário (`q-date`).
- **FR-004**: O sistema MUST consultar dinamicamente os horários livres através do endpoint `/api/v1/appointments/available-slots` a cada alteração de profissional, serviço ou data no formulário de agendamento.
- **FR-005**: O sistema MUST permitir o preenchimento de agendamentos com busca debounced de clientes por nome e telefone.
- **FR-006**: O sistema MUST gerenciar o ciclo de vida dos agendamentos através de transições de status (`AGENDADO`, `CONFIRMADO`, `EM_ATENDIMENTO`, `CONCLUIDO`, `CANCELADO`, `NAO_COMPARECEU`).
- **FR-007**: O sistema MUST validar formulários de agendamento em linha com mensagens em português (pt-BR) antes da submissão à API.
- **FR-008**: O sistema MUST tratar erros e exceções utilizando o padrão RFC 7807/9457 via `useFeedback`, com tratamento especial para conflitos (HTTP 409).
- **FR-009**: O sistema MUST implementar obrigatoriamente os 4 estados de interface do Princípio III da Constitution: _Loading State_ (spinners / skeletons), _Empty State_ (`AppEmptyState`), _Error State_ (`AppErrorState` com retry) e _Success State_.
- **FR-010**: O sistema MUST decompor componentes Vue que excedam 300 linhas de código em subcomponentes coesos e composables especializados, atendendo ao Princípio I da Constitution.
- **FR-011**: O sistema MUST manter suporte a bloqueios de horário na grade para sinalizar intervalos ou folgas dos profissionais.  
  _[NEEDS CLARIFICATION: Confirmar se o backend já dispõe de endpoint `/api/v1/time-blocks` dedicado ou se o bloqueio deve ser registrado provisoriamente como um agendamento interno vinculado a um serviço de 'Bloqueio / Intervalo'?]_

### Key Entities _(include if feature involves data)_

- **Appointment (`AppointmentResponse` / `AppointmentCreateRequest`)**:
  - `id`: Identificador único do agendamento (UUID string).
  - `employeeId` / `employeeName`: Identificador e nome do profissional executor.
  - `clientId` / `clientName`: Identificador e nome do cliente atendido.
  - `serviceId` / `serviceName`: Identificador e nome do procedimento contratado.
  - `startTime`: Horário de início em formato ISO 8601 UTC.
  - `endTime`: Horário de término estimado calculado em função da duração do serviço.
  - `price`: Valor financeiro contratado do serviço (R$).
  - `status`: Estado atual do ciclo de vida (`AGENDADO`, `CONFIRMADO`, `EM_ATENDIMENTO`, `CONCLUIDO`, `CANCELADO`, `NAO_COMPARECEU`).
  - `notes`: Observações adicionais e preferências do cliente.
- **TimeSlot (`TimeSlot`)**:
  - `startTime`: Horário de início do bloco (`HH:mm`).
  - `endTime`: Horário de término do bloco (`HH:mm`).
  - `available`: Flag booleano indicando se o slot está livre para alocação.
- **TimeBlock**:
  - `id`: Identificador único do bloqueio.
  - `employeeId`: Identificador do colaborador associado.
  - `startTime`: Timestamp de início do bloqueio.
  - `endTime`: Timestamp de término do bloqueio.
  - `reason`: Justificativa do bloqueio (ex: "Almoço", "Consulta Médica", "Folga").

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: O tempo de renderização e carregamento inicial da grade da agenda não deve ultrapassar 1,5 segundos em conexões padrão.
- **SC-002**: A consulta reativa de slots disponíveis deve retornar e atualizar as opções do formulário em menos de 800 milissegundos após a escolha do serviço/data.
- **SC-003**: 100% de conformidade com o Princípio I da Constitution: nenhum arquivo Vue do módulo de agendamentos deve ultrapassar o teto de 300 linhas de código.
- **SC-004**: Zero regressões de fuso horário: 100% dos agendamentos salvos às $H$ horas locais devem ser renderizados exatamente na linha das $H$ horas na grade do operador.
- **SC-005**: 100% dos quatro Quality Gates da Constitution aprovados: `npm run typecheck`, `npm run lint:check`, `npm test` e `npm run build` executando com código 0 e sem avisos impeditivos.

## Assumptions

- O backend Spring Boot já fornece e sustenta os endpoints `/api/v1/appointments`, `/api/v1/appointments/{id}/status` e `/api/v1/appointments/available-slots`.
- O salão de beleza opera em horário padrão das 08:00 às 20:00 de segunda a sábado (com suporte a domingos quando houver eventos agendados).
- Os cadastros de Clientes, Profissionais e Serviços estão ativos e populados pelos respectivos serviços (`clientService`, `employeeService`, `serviceService`).
- O fuso horário de operação padrão de referência é o Horário Oficial de Brasília (`America/Sao_Paulo` / UTC-3).
