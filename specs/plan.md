# Plano de Arquitetura e Implementação — Salon Manager Frontend
**Documento:** `/speckit.plan`  
**Versão:** 1.0.0  
**Data:** 2026-11-09  
**Status:** Proposto para Aprovação  
**Repositório:** `salon-manager-frontend`  
**Backend Vinculado:** `salon-manager-backend` (`http://localhost:8080`)

---

## 1. Visão Geral do Plano

O objetivo deste plano é estruturar a implementação completa do **Salon Manager Frontend**, garantindo:
- Aderência estrita à Constituição ([`specs/constitution.md`](file:///home/debhg/Projetos/salon-manager-frontend/specs/constitution.md)).
- Fidelidade total ao contrato da API REST do backend ([`docs/frontend-integration-contract.md`](file:///home/debhg/Projetos/salon-manager-backend/docs/frontend-integration-contract.md)).
- Implementação incremental por camadas com portões de qualidade (Lint, Typecheck, Testes).

---

## 2. Mapa de Dependências do Projeto

```
┌────────────────────────────────────────────────────────┐
│                   quasar.config.ts                     │
│  - vueRouterMode: 'history'                            │
│  - plugins: ['Notify', 'Dialog', 'Loading']           │
│  - extras: ['roboto-font']                             │
│  - scss: app.scss, quasar.variables.scss               │
└───────────────────────────┬────────────────────────────┘
                            │
       ┌────────────────────┴────────────────────┐
       ▼                                         ▼
┌──────────────┐                         ┌──────────────┐
│  src/boot/   │                         │  src/css/    │
│  - axios.ts  │                         │  - tokens    │
│  - pinia.ts  │                         │  - light/dark│
│  - icons.ts  │                         │  - utilities │
└──────┬───────┘                         └──────────────┘
       │
       ▼
┌────────────────────────────────────────────────────────┐
│                      src/types/                        │
│  api.ts, auth.ts, appointment.ts, client.ts, etc.     │
└───────────────────────────┬────────────────────────────┘
                            │
       ┌────────────────────┴────────────────────┐
       ▼                                         ▼
┌──────────────┐                         ┌──────────────┐
│src/services/ │                         │ src/stores/  │
│(Axios calls) │                         │ (auth, theme)│
└──────┬───────┘                         └───────┬──────┘
       │                                         │
       └────────────────────┬────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                   src/composables/                     │
│  useFeedback, useFormatters, useTablePagination, etc.  │
└───────────────────────────┬────────────────────────────┘
                            │
       ┌────────────────────┴────────────────────┐
       ▼                                         ▼
┌──────────────┐                         ┌──────────────┐
│src/components│                         │ src/layouts/ │
│- AppStatCard │                         │ - MainLayout │
│- AppDataTable│                         │ - AuthLayout │
│- AppDialog   │                         └───────┬──────┘
└──────┬───────┘                                 │
       │                                         │
       └────────────────────┬────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                      src/pages/                        │
│  Login, Dashboard, Agenda, Clientes, Funcionários,     │
│  Serviços, Financeiro, Comissões, Fechamento, Config   │
└────────────────────────────────────────────────────────┘
```

---

## 3. Estratégia de Configuração Base do Quasar

### 3.1 Ajustes no `quasar.config.ts`:
1. **Modo de Navegação:**
   ```typescript
   vueRouterMode: 'history', // Migrado de 'hash' para URLs limpas
   ```
2. **Plugins Oficiais do Quasar:**
   ```typescript
   framework: {
     plugins: ['Notify', 'Dialog', 'Loading', 'LoadingBar', 'LocalStorage'],
     config: {
       notify: { position: 'top-right', timeout: 3500 },
       loading: { delay: 150 }
     }
   }
   ```
3. **Pacotes NPM a Adicionar:**
   - `pinia` (`^2.2.0`): Gerenciamento de estado global reativo.
   - `axios` (`^1.7.0`): Cliente HTTP.
   - `lucide-vue-next` (`^0.460.0`): Ícones modernos.
   - `apexcharts` (`^4.0.0`) + `vue3-apexcharts` (`^1.5.0`): Gráficos interativos.
   - `date-fns` (`^4.1.0`): Manipulação de datas em pt-BR.

---

## 4. Engenharia de Design Tokens & SCSS

### 4.1 Variáveis Principais (`src/css/quasar.variables.scss`):
```scss
$primary   : #7B3F61; // Vinho Nobre
$secondary : #C59B6D; // Champagne Ouro
$accent    : #9E7B9B; // Lavanda Suave

$dark      : #121316; // Fundo Dark Mode
$dark-page : #0D0E11; // Fundo da página Dark Mode

$positive  : #2A9D8F; // Sucesso / Receita
$negative  : #E76F51; // Alerta / Despesa
$info      : #457B9D; // Informativo
$warning   : #E9C46A; // Atenção / Pendente
```

### 4.2 Camada de Estilo (`src/css/app.scss`):
- Definição de bordas sutis (`border-radius: 10px` para cards, `8px` para inputs/botões).
- Classes utilitárias: `.text-currency`, `.bg-surface`, `.table-card`, `.stat-card-gradient`.
- Suporte automático para transições de transição Light/Dark sem oscilações bruscas de cor.

---

## 5. Design das Stores Pinia

### 5.1 `useAuthStore` (`src/stores/auth.ts`)
- **Estado:**
  - `user`: `UserSession | null`
  - `accessToken`: `string | null`
  - `refreshToken`: `string | null`
  - `isAuthenticated`: `computed(() => !!accessToken)`
  - `userRole`: `computed(() => user?.role)`
- **Ações:**
  - `login(credentials: LoginRequest): Promise<void>`
  - `setTokens(accessToken: string, refreshToken: string): void`
  - `refreshTokenAction(): Promise<boolean>`
  - `logout(): void`
  - `hasRole(requiredRoles: string[]): boolean`

### 5.2 `useThemeStore` (`src/stores/theme.ts`)
- **Estado:**
  - `isDark`: `boolean` (inicializado pelo Quasar `$q.dark.isActive` ou `LocalStorage`)
  - `leftDrawerOpen`: `boolean` (drawer lateral do desktop)
  - `miniState`: `boolean` (modo compacto da sidebar)
- **Ações:**
  - `toggleDark(): void`
  - `toggleDrawer(): void`

---

## 6. Arquitetura da Camada de Serviços (Services)

Instância centralizada do Axios em `src/services/api.ts` com:
1. `baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'`
2. Request Interceptor: Injeta `Authorization: Bearer <accessToken>`.
3. Response Interceptor:
   - Gerencia renovação silenciosa com fila de requisições pendentes durante o refresh de token.
   - Normaliza erros HTTP em objetos padronizados com suporte a `invalidParams` da RFC 7807.

### Módulos de Serviço:
- `authService.ts`: `/api/auth` (login, refresh, registro de admin).
- `employeeService.ts`: `/api/v1/employees` (CRUD, busca, ativação/desativação).
- `clientService.ts`: `/api/v1/clients` (CRUD, busca textual, histórico).
- `serviceService.ts`: `/api/v1/services` (CRUD de serviços, preços, comissões).
- `appointmentService.ts`: `/api/v1/appointments` (grade, slots livres, transição de status).
- `financialService.ts`: `/api/v1/financial` (transações, receitas, despesas, resumo).
- `commissionService.ts`: `/api/v1/commissions` (extrato, resumo financeiro).
- `closingService.ts`: `/api/v1/closings` (cálculo simulado, fechamento atômico, histórico, reabertura).
- `dashboardService.ts`: `/api/v1/dashboard` (KPIs, gráficos de serviços e colaboradores líderes).

---

## 7. Componentes Reutilizáveis (Design System)

| Componente | Localização | Propósito |
|---|---|---|
| `AppStatCard` | `src/components/widgets/AppStatCard.vue` | Card de KPI com valor, ícone Lucide, badge percentual e skeleton |
| `AppDataTable` | `src/components/widgets/AppDataTable.vue` | Tabela Quasar padronizada conectada à paginação do Spring Data |
| `AppSearchInput`| `src/components/widgets/AppSearchInput.vue`| Input com debounce e ícone de lupa |
| `AppDateFilter` | `src/components/widgets/AppDateFilter.vue` | Seletor de período rápido (Mês, 30 dias, Customizado) |
| `AppStatusBadge`| `src/components/common/AppStatusBadge.vue` | Badge colorido com label legível para enums do sistema |
| `AppConfirmDialog`| `src/components/dialogs/AppConfirmDialog.vue`| Modal para confirmação de ações destrutivas |
| `AppFormDialog` | `src/components/dialogs/AppFormDialog.vue` | Modal padrão de formulário com ações salvar/cancelar |
| `AppEmptyState` | `src/components/common/AppEmptyState.vue` | Ilustração/ícone e texto de lista vazia |
| `AppLoading`    | `src/components/common/AppLoading.vue`    | Spinner temático e mensagem de carregamento |
| `AppHeader`     | `src/components/navigation/AppHeader.vue` | Toolbar superior com toggle de tema, usuário e notificações |
| `AppSidebar`    | `src/components/navigation/AppSidebar.vue`| Menu lateral responsivo com ícones Lucide e indicador de rota ativa |

---

## 8. Mapeamento das Telas e Navegação (Routes)

```typescript
routes: [
  {
    path: '/login',
    component: () => import('layouts/AuthLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/LoginView.vue') }],
    meta: { public: true }
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'dashboard', component: () => import('pages/dashboard/DashboardView.vue') },
      { path: 'agenda', name: 'agenda', component: () => import('pages/appointments/AgendaView.vue') },
      { path: 'clientes', name: 'clients', component: () => import('pages/clients/ClientsListView.vue'), meta: { roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_RECEPTIONIST'] } },
      { path: 'funcionarios', name: 'employees', component: () => import('pages/employees/EmployeesListView.vue'), meta: { roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] } },
      { path: 'servicos', name: 'services', component: () => import('pages/services/ServicesListView.vue'), meta: { roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] } },
      { path: 'financeiro', name: 'financial', component: () => import('pages/financial/FinancialTransactionsView.vue'), meta: { roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] } },
      { path: 'comissoes', name: 'commissions', component: () => import('pages/commissions/CommissionsView.vue'), meta: { roles: ['ROLE_ADMIN', 'ROLE_MANAGER', 'ROLE_PROFESSIONAL'] } },
      { path: 'fechamento', name: 'closings', component: () => import('pages/closings/MonthlyClosingView.vue'), meta: { roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] } },
      { path: 'configuracoes', name: 'settings', component: () => import('pages/settings/SettingsView.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]
```

---

## 9. Fases de Execução Incremental

O desenvolvimento será organizado em fases incrementais coesas:

- **Fase 1: Fundação & Setup** (Configuração do Quasar, dependências, tokens SCSS, tipos DTOs, Axios e Stores Pinia).
- **Fase 2: Layouts, Navegação & Autenticação** (AuthLayout, MainLayout com Sidebar responsiva, tela de Login e Navigation Guards).
- **Fase 3: Componentes do Design System** (AppStatCard, AppDataTable, AppFormDialog, AppConfirmDialog, AppStatusBadge).
- **Fase 4: Módulos Operacionais** (Clientes, Funcionários, Serviços e Agenda com grade nativa diária/semanal).
- **Fase 5: Módulos Financeiros & Dashboard** (Financeiro, Comissões, Fechamento Mensal e Dashboard analítico com ApexCharts).
- **Fase 6: Configurações, Refinamento & Testes** (Tema Dark/Light persistido, validações finais, lint e verificação de tipagem).

---

## 10. Conclusão do Plano e Próxima Etapa

Este plano fornece o mapa estrutural completo para o desenvolvimento do frontend do **Salon Manager**. A próxima etapa é a definição das tarefas operacionais granulares (**`/speckit.tasks`**).
