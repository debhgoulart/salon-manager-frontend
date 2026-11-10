# Análise Crítica e Verificação Pré-Implementação — Salon Manager Frontend
**Documento:** `/speckit.analyze`  
**Versão:** 1.0.0  
**Data:** 2026-11-09  
**Status:** Proposto para Aprovação  
**Repositório:** `salon-manager-frontend`  
**Backend Vinculado:** `salon-manager-backend` (`http://localhost:8080`)

---

## 1. Objetivo da Análise

A etapa **`/speckit.analyze`** realiza a auditoria técnica de consistência entre a especificação, o plano, a lista de tarefas e o contrato real do backend, antecipando gargalos, riscos de concorrência e divergências de tipagem antes do início da implementação do código.

---

## 2. Auditoria de Contrato com o Backend

### 2.1 Verificação de Endpoints e Métodos HTTP
| Módulo Backend | Endpoints Contratados | Mapeamento no Frontend | Status | Observações |
|---|---|---|---|---|
| **Auth** | `POST /api/auth/login`<br>`POST /api/auth/refresh` | `authService.login`<br>`authService.refresh` | ✅ Consistente | Suporte a auto-refresh via interceptor Axios. |
| **Employees** | `GET /api/v1/employees`<br>`POST /api/v1/employees`<br>`PUT /api/v1/employees/{id}`<br>`DELETE /api/v1/employees/{id}`<br>`PATCH /api/v1/employees/{id}/activate` | `employeeService.*` | ✅ Consistente | Respeita paginação `PageResponse` e soft-delete. |
| **Clients** | `GET /api/v1/clients`<br>`POST /api/v1/clients`<br>`PUT /api/v1/clients/{id}`<br>`DELETE /api/v1/clients/{id}`<br>`GET /api/v1/clients/{id}/appointments` | `clientService.*` | ✅ Consistente | Busca textual pelo parâmetro `query`. |
| **Services** | `GET /api/v1/services`<br>`POST /api/v1/services`<br>`PUT /api/v1/services/{id}`<br>`DELETE /api/v1/services/{id}` | `serviceService.*` | ✅ Consistente | Suporte ao campo opcional `customCommissionRate`. |
| **Appointments** | `GET /api/v1/appointments`<br>`POST /api/v1/appointments`<br>`PATCH /api/v1/appointments/{id}/status`<br>`GET /api/v1/appointments/available-slots` | `appointmentService.*` | ✅ Consistente | Consulta reativa de slots antes de agendar para mitigar 409 Conflict. |
| **Commissions** | `GET /api/v1/commissions`<br>`GET /api/v1/commissions/summary` | `commissionService.*` | ✅ Consistente | Valores exclusivamente oriundos do backend. |
| **Financial** | `GET /api/v1/financial/transactions`<br>`POST /api/v1/financial/transactions`<br>`GET /api/v1/financial/summary` | `financialService.*` | ✅ Consistente | Tratamento do erro `ClosedPeriodException` (HTTP 409). |
| **Closings** | `GET /api/v1/closings`<br>`GET /api/v1/closings/calculate`<br>`POST /api/v1/closings/close`<br>`POST /api/v1/closings/{id}/reopen` | `closingService.*` | ✅ Consistente | Exigência de confirmação no `/close` e notas de auditoria no `/reopen`. |
| **Dashboard** | `GET /api/v1/dashboard/overview`<br>`GET /api/v1/dashboard/top-services`<br>`GET /api/v1/dashboard/top-employees`<br>`GET /api/v1/dashboard/upcoming-appointments` | `dashboardService.*` | ✅ Consistente | Parâmetros de data no formato ISO 8601 UTC. |

---

## 3. Análise de Riscos e Estratégias de Mitigação

### 3.1 Risco 1: Race Condition na Renovação de Token JWT (401 Simultâneos)
- **Problema:** Quando múltiplas requisições paralelas (ex.: Dashboard carregando 4 cards simultâneos) recebem status `401 Unauthorized`, múltiplas chamadas concorrentes ao endpoint `/api/auth/refresh` podem ocorrer, invalidando o refresh token.
- **Mitigação:** Implementação de uma fila de espera (*request subscriber queue*) com flag `isRefreshing` no interceptor Axios. Apenas a primeira requisição dispara o refresh; as demais aguardam a resolução da Promise com o novo token antes de reprocessar.

### 3.2 Risco 2: Conflito de Horários de Agendamento (HTTP 409)
- **Problema:** Dois operadores agendando simultaneamente o mesmo profissional no mesmo slot de tempo.
- **Mitigação:** 
  1. Uso do endpoint `/api/v1/appointments/available-slots` para bloquear horários já ocupados visualmente.
  2. Captura específica do erro HTTP 409 com RFC 7807 (`title: "Conflito de Horário"`), exibindo diálogo informativo amigável e oferecendo opção de recarregar a grade de horários.

### 3.3 Risco 3: Tentativa de Lançamento em Mês Contábil Fechado (HTTP 409)
- **Problema:** Operador tentando lançar despesa ou receita retroativa em mês com status `CLOSED`.
- **Mitigação:** Captura do erro `ClosedPeriodException` retornado pela API, exibindo banner explicativo com alerta de que a operação exige reabertura contábil por um Administrador.

### 3.4 Risco 4: Formatação e Precisão Monetária
- **Problema:** Erros de arredondamento de float em JavaScript ao manipular valores monetários.
- **Mitigação:** O frontend nunca recalcula totais ou juros; apenas exibe os números fornecidos pela API utilizando `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`. Nos formulários de entrada, valores numéricos são manipulados em centavos inteiros ou strings com máscara monetária antes de enviar o `number` para a API.

---

## 4. Auditoria de Configuração Quasar & Vite

- **Modo History (`vueRouterMode: 'history'`):** No Quasar CLI com Vite, o servidor de desenvolvimento (`quasar dev`) lida nativamente com o fallback de history API. Para produção (servidor Nginx / Spring estático), é necessário garantir o fallback para `index.html`.
- **Plugins Quasar Ativos:** O projeto inicial não possui os plugins Quasar habilitados em `quasar.config.ts`. É mandatório registrar `['Notify', 'Dialog', 'Loading', 'LoadingBar', 'LocalStorage']`.
- **CSS Preprocessor:** O projeto já possui suporte a SCSS (`quasar.variables.scss` e `app.scss`).

---

## 5. Veredito de Prontidão (Readiness Verdict)

| Critério de Avaliação | Status | Avaliação |
|---|---|---|
| **Alinhamento com a Constituição** | ✅ Aprovado | 100% aderente a regras de negócio no backend e UI Quasar pura. |
| **Contrato da API Backend** | ✅ Aprovado | Totalmente coberto por DTOs e endpoints mapeados. |
| **Resolução de Ambiguidade de UX** | ✅ Aprovado | Decisões ratificadas na etapa Clarify. |
| **Plano Arquitetural & Tarefas** | ✅ Aprovado | Fases graduais bem delimitadas com critérios de aceite objetivos. |
| **Mitigação de Riscos Técnicos** | ✅ Aprovado | Soluções concebidas para fila de token, 409 e precisão monetária. |

**Veredito:** **GO (Apto para Implementação)**.

---

## 6. Próximo Passo do Spec Kit

Com a aprovação da etapa de análise, passamos para a última e definitiva fase: **`/speckit.implement`** (execução prática incremental de cada fase descrita em `specs/tasks.md`).
