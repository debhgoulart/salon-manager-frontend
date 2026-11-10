# Lista de Tarefas de Implementação — Salon Manager Frontend
**Documento:** `/speckit.tasks`  
**Versão:** 1.0.0  
**Data:** 2026-11-09  
**Status:** Proposto para Aprovação  
**Repositório:** `salon-manager-frontend`  
**Backend Vinculado:** `salon-manager-backend` (`http://localhost:8080`)

---

## Legenda de Status
- `[ ]` Tarefa Pendente
- `[/]` Tarefa Em Progresso
- `[x]` Tarefa Concluída

---

## Fase 1: Fundação, Dependências & Configuração Base

- [ ] **TASK-1.1: Instalação de Dependências Base**
  - Instalar `pinia`, `axios`, `lucide-vue-next`, `apexcharts`, `vue3-apexcharts`, `date-fns`.
  - Critério de Aceite: `package.json` atualizado e `npm install` concluído sem quebras.
- [ ] **TASK-1.2: Configuração do Quasar (`quasar.config.ts`)**
  - Habilitar `vueRouterMode: 'history'`.
  - Configurar plugins Quasar: `Notify`, `Dialog`, `Loading`, `LoadingBar`, `LocalStorage`.
  - Configurar boot files (`axios`, `pinia`).
  - Critério de Aceite: Quasar compila no modo history com plugins registrados.
- [ ] **TASK-1.3: Design Tokens & Estilização SCSS**
  - Configurar paleta Vinho Nobre (`#7B3F61`), Champagne Ouro (`#C59B6D`) e semânticas em `src/css/quasar.variables.scss`.
  - Criar estilos utilitários, fontes, bordas e tema dark/light em `src/css/app.scss`.
  - Critério de Aceite: Cores e variáveis Quasar refletem o tema SaaS boutique.
- [ ] **TASK-1.4: Tipos e DTOs TypeScript (`src/types/`)**
  - Implementar interfaces para `api.ts` (`PageResponse`, `ProblemDetails`), `auth.ts`, `employee.ts`, `client.ts`, `service.ts`, `appointment.ts`, `commission.ts`, `financial.ts`, `closing.ts`, `dashboard.ts`.
  - Critério de Aceite: Tipos 100% aderentes ao contrato da API backend.
- [ ] **TASK-1.5: Cliente HTTP Centralizado (`src/services/api.ts`)**
  - Configurar instância do Axios com `VITE_API_URL`.
  - Interceptor de request com Bearer Token.
  - Interceptor de response com renovação silenciosa de token (`/api/auth/refresh`) e RFC 7807 normalizer.
  - Critério de Aceite: Teste de chamada com renovação de token simulada.
- [ ] **TASK-1.6: Stores Pinia Base**
  - Implementar `useAuthStore` com persistência em `localStorage` e métodos de login/refresh/logout.
  - Implementar `useThemeStore` com alternância do `$q.dark` e persistência.
  - Critério de Aceite: Estado de autenticação e tema persistidos e reativos.

---

## Fase 2: Layouts, Navegação & Autenticação

- [ ] **TASK-2.1: Navigation Guards & Configuração do Vue Router**
  - Estruturar rotas públicas e privadas em `src/router/routes.ts`.
  - Implementar navigation guards em `src/router/guards.ts` para validação de JWT e autorização por papéis (RBAC).
  - Critério de Aceite: Redirecionamento correto para `/login` e bloqueio de rotas não autorizadas.
- [ ] **TASK-2.2: Layout de Autenticação (`AuthLayout.vue`) e Tela de Login**
  - Desenvolver `src/layouts/AuthLayout.vue` com ambientação visual refinada.
  - Desenvolver `src/pages/auth/LoginView.vue` com campos de e-mail e senha, indicador de loading, validação e feedback de erro amigável.
  - Conectar com `authService.login()`.
  - Critério de Aceite: Login bem-sucedido direciona para Dashboard e armazena os tokens.
- [ ] **TASK-2.3: Layout Administrativo (`MainLayout.vue`)**
  - Implementar `AppHeader.vue`: toggle de sidebar, alternância Dark/Light, avatar do usuário, dados do salão e botão de logout.
  - Implementar `AppSidebar.vue`: links dos 9 módulos com ícones Lucide, estilo recolhível (mini-state) e controle de exibição por papel do usuário.
  - Critério de Aceite: Layout responsivo adaptado para desktop e mobile com menu retrátil.

---

## Fase 3: Componentes do Design System Reutilizáveis

- [ ] **TASK-3.1: Componentes de Feedback & Estados**
  - Desenvolver `AppLoading.vue` (spinner estilizado com cores do tema).
  - Desenvolver `AppEmptyState.vue` (ícone sutil, título, descrição e botão de ação).
  - Desenvolver `AppErrorState.vue` (alerta de falha de conexão e botão de tentar novamente).
  - Desenvolver `AppStatusBadge.vue` (chips com cores semânticas mapeadas para os enums).
- [ ] **TASK-3.2: Componentes de Diálogo e Tabela**
  - Desenvolver `AppConfirmDialog.vue` (modal reutilizável para confirmação de ações críticas).
  - Desenvolver `AppFormDialog.vue` (modal estruturado com slots de cabeçalho, corpo e ações).
  - Desenvolver `AppDataTable.vue` (wrapper do `QTable` sincronizado com o `PageResponse` do Spring Data).
  - Desenvolver `AppSearchInput.vue` (campo de busca com debounce de 300ms).
  - Desenvolver `AppDateFilter.vue` (seletor de período rápido e personalizado).
  - Desenvolver `AppStatCard.vue` (card de métrica com valor monetário/numérico, ícone Lucide e skeleton).
  - Critério de Aceite: Componentes exportados e testados com composables utilitários.

---

## Fase 4: Módulos Operacionais

- [ ] **TASK-4.1: Módulo Clientes (`/clientes`)**
  - Criar `clientService.ts` com métodos de listagem, busca, criação, edição, ativação/desativação e histórico.
  - Desenvolver `ClientsListView.vue` com busca instantânea e paginação.
  - Desenvolver `ClientFormDialog.vue` com máscaras de CPF e telefone.
  - Desenvolver diálogo/drawer de histórico de agendamentos do cliente.
  - Critério de Aceite: CRUD completo integrado ao backend ou mock funcional.
- [ ] **TASK-4.2: Módulo Funcionários (`/funcionarios`)**
  - Criar `employeeService.ts`.
  - Desenvolver `EmployeesListView.vue` com filtros por status e exibição da taxa de comissão padrão.
  - Desenvolver formulário de cadastro/edição de profissional com validações.
  - Ação de desativação lógica com confirmação.
  - Critério de Aceite: Gestão de colaboradores funcional e validada.
- [ ] **TASK-4.3: Módulo Serviços (`/servicos`)**
  - Criar `serviceService.ts`.
  - Desenvolver `ServicesListView.vue` com cards/tabela de serviços, duração formatada e preço.
  - Desenvolver formulário com campos de nome, preço, duração e taxa de comissão específica.
  - Critério de Aceite: Catálogo de serviços funcional com formatação de moeda e tempo.
- [ ] **TASK-4.4: Módulo Agenda (`/agenda`)**
  - Criar `appointmentService.ts` (listagem, consulta de slots disponíveis, criação, alteração de status e cancelamento).
  - Desenvolver grade nativa Quasar com visão Diária e Semanal (`DailyScheduleGrid` e `WeeklyScheduleGrid`).
  - Desenvolver `AppointmentFormDialog.vue` com seleção de cliente, serviço, profissional e horários vagos validados.
  - Implementar transição de status visual (`AGENDADO` ➔ `CONFIRMADO` ➔ `EM_ATENDIMENTO` ➔ `CONCLUIDO` / `CANCELADO`).
  - Tratamento de erro 409 para choque de horário.
  - Critério de Aceite: Visualização fluida dos horários e agendamento sem conflitos.

---

## Fase 5: Módulos Financeiros & Dashboard

- [ ] **TASK-5.1: Módulo Financeiro (`/financeiro`)**
  - Criar `financialService.ts` (transações, resumo de receitas/despesas, novo lançamento).
  - Desenvolver `FinancialTransactionsView.vue` com abas (Todas, Receitas, Despesas) e cards de totais.
  - Desenvolver modal de novo lançamento financeiro com bloqueio visual para meses já encerrados.
  - Critério de Aceite: Controle de fluxo de caixa com filtros e validação de período fechado.
- [ ] **TASK-5.2: Módulo Comissões (`/comissoes`)**
  - Criar `commissionService.ts`.
  - Desenvolver `CommissionsView.vue` com filtros por profissional, período e status de pagamento (`PENDING`, `PAID`).
  - Cards de resumo de comissões pendentes e pagas.
  - Critério de Aceite: Extrato detalhado e fiel aos valores retornados pelo backend.
- [ ] **TASK-5.3: Módulo Fechamento Mensal (`/fechamento`)**
  - Criar `closingService.ts` (cálculo de prévia `/calculate`, fechamento atômico `/close`, histórico, reabertura `/reopen`).
  - Desenvolver `MonthlyClosingView.vue` com seletor de competência (Mês/Ano).
  - Exibir demonstrativo simulado com tabela discriminada por funcionário.
  - Diálogo de confirmação para efetivar o fechamento.
  - Funcionalidade de reabertura com preenchimento obrigatório de notas de auditoria.
  - Critério de Aceite: Ciclo completo de fechamento contábil testado com integridade.
- [ ] **TASK-5.4: Painel Dashboard (`/`)**
  - Criar `dashboardService.ts`.
  - Desenvolver `DashboardView.vue` com os 4 cards de KPIs principais (`AppStatCard`), contadores rápidos e seletor de período.
  - Integrar gráficos ApexCharts (tendência receitas vs. despesas e top serviços).
  - Listas rápidas de profissionais líderes e próximos atendimentos da agenda.
  - Critério de Aceite: Dashboard consolidado e reativo às datas selecionadas.

---

## Fase 6: Configurações, Documentação & Portões de Qualidade

- [ ] **TASK-6.1: Módulo Configurações (`/configuracoes`)**
  - Desenvolver `SettingsView.vue` com dados do salão, perfil do usuário, alternância Dark/Light e healthcheck do backend (`actuator/health`).
- [ ] **TASK-6.2: Qualidade, Lint e Checagem de Tipos**
  - Executar `npm run lint:check` e corrigir inconsistências de estilo.
  - Executar `npm run typecheck` (`vue-tsc --noEmit`) assegurando 0 erros.
- [ ] **TASK-6.3: Documentação Final (`README.md`)**
  - Atualizar `README.md` com arquitetura, tecnologias, instruções de execução local, configuração de `.env`, credenciais de teste e screenshots.
