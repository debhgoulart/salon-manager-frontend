# Tasks: Reconfiguração Editorial Fashion do Design System

**Input**: Design documents from `/specs/003-editorial-design-system/` (`spec.md`, `plan.md`, `research.md`, `data-model.md`, `quickstart.md`)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Includes exact file paths in descriptions

---

## Phase 1: Setup & Foundational Tokens (Blocking Prerequisites)

**Purpose**: Base infrastructure and design token definitions that MUST be complete before component and layout redesigns begin.

- [x] T001 [US1] Atualizar `DESIGN.md` com a especificação formal completa da estética Editorial High-Contrast & Fashion (cores Preto Ônix `#09090B`, Branco Titânio `#FFFFFF` / `#F4F4F5`, Carmim Fashion `#E11D48`, bordas estruturais de 1px, tipografia e regras de elevação).
- [x] T002 [US1] Atualizar `src/css/quasar.variables.scss` redefinindo `$primary` (`#09090B`), `$secondary` (`#E11D48`), `$accent` (`#71717A`), fundos e bordas estruturais.
- [x] T003 [US1] Atualizar `src/css/app.scss` com classes utilitárias de tipografia editorial (`letter-spacing`, `tabular-nums`), bordas geométricas finas e estilos de superfície de alto contraste.

**Checkpoint**: Foundation ready - Tokens globais e SCSS configurados. Teste independente: inspecionar variáveis compiladas e classes utilitárias.

---

## Phase 2: User Story 2 - Redesign Estrutural da Navegação e Layouts (Priority: P1)

**Goal**: Transformar a experiência de login e navegação global (Header, Sidebar e Layouts) na estética editorial minimalista.

**Independent Test**: Acessar `/login` e `/dashboard` no navegador e verificar alinhamento visual, contraste e responsividade.

- [x] T004 [P] [US2] Redesenhar `src/layouts/AuthLayout.vue` com moldura editorial limpa e acabamento minimalista.
- [x] T005 [US2] Redesenhar `src/pages/auth/LoginView.vue` com tipografia editorial de grande presença, inputs de alto contraste e botão de submissão de impacto.
- [x] T006 [P] [US2] Redesenhar `src/layouts/MainLayout.vue` refinando espaçamentos, estrutura perimetral de 1px e plano de fundo neutro.
- [x] T007 [P] [US2] Redesenhar `src/components/navigation/AppHeader.vue` com linha divisória fina, alternador de tema suave e perfil refinado.
- [x] T008 [US2] Redesenhar `src/components/navigation/AppSidebar.vue` com itens de menu minimalistas, destaque em preto/branco com detalhe Carmim e ícones Lucide.

**Checkpoint**: Layouts e navegação integrados e testáveis independentemente.

---

## Phase 3: User Story 3 - Redesign dos Componentes Compartilhados de Base (Priority: P1)

**Goal**: Garantir que todos os componentes de base reflitam a estética editorial, tipografia precisa e alvos de toque $\ge 44$px.

**Independent Test**: Renderizar cards de métrica, badges de status, modais e estados de tela vazia/erro em qualquer visualização.

- [x] T009 [P] [US3] Redesenhar `src/components/widgets/AppStatCard.vue` com números tabulares monumentais, bordas limpas de 1px e badges de tendência discretos.
- [x] T010 [P] [US3] Redesenhar `src/components/common/AppStatusBadge.vue` com estética de etiqueta editorial e indicadores semânticos sutis.
- [x] T011 [P] [US3] Redesenhar `src/components/common/AppEmptyState.vue` com ícones Lucide minimalistas e cópia autoral humanizada.
- [x] T012 [P] [US3] Redesenhar `src/components/common/AppErrorState.vue` com contraste nítido, alerta semântico elegante e botão de retry.
- [x] T013 [P] [US3] Redesenhar `src/components/dialogs/AppFormDialog.vue` com raio de borda de 12px, cabeçalho limpo e alvos de toque $\ge 44$px.
- [x] T014 [P] [US3] Redesenhar `src/components/dialogs/AppConfirmDialog.vue` com botões de ação de alto contraste e tipografia editorial.

**Checkpoint**: Componentes de base refinados e compatíveis com a nova identidade visual.

---

## Phase 4: User Story 4 - Aplicação Visual nas Telas Centrais (Agenda e Dashboard) (Priority: P2)

**Goal**: Aplicar a nova identidade visual nas telas operacionais centrais (Dashboard e Agenda), preservando 100% da lógica de negócio.

**Independent Test**: Navegar para `/dashboard` e `/agenda` e verificar grade horária, cards de KPI e agendamentos.

- [x] T015 [US4] Refinar `src/pages/dashboard/DashboardView.vue` alinhando a grade de cards, gráficos e tabelas à paleta editorial de alto contraste (decomposto em `DashboardChartsSection.vue` e `DashboardTablesSection.vue` com arquivos < 300 linhas).
- [x] T016 [US4] Refinar `src/pages/appointments/AgendaView.vue` e subcomponentes da agenda (`AgendaDayGrid.vue`, `AgendaWeekGrid.vue`, `AgendaDateNav.vue`, `AgendaHeader.vue`, `AppointmentCard.vue`) com linhas de tempo precisas e acentos Carmim.

**Checkpoint**: Telas de Agenda e Dashboard com experiência editorial completa.

---

## Phase 5: User Story 5 - Validação de Acessibilidade, Quality Gates & Git Push (Priority: P2)

**Goal**: Garantir conformidade com WCAG AA, ausência de regressões, aprovação nos 4 gates da Constitution e envio automático ao repositório remoto.

- [x] T017 [US5] Executar auditoria de tipos estáticos com `npm run typecheck`.
- [x] T018 [US5] Executar validação de formatação e linting com `npm run lint:check` (e corrigir com `npm run lint` se necessário).
- [x] T019 [US5] Executar suíte de testes unitários com `npm test`.
- [x] T020 [US5] Executar build de produção com `npm run build`.
- [x] T021 [US5] Realizar commit das alterações com mensagem padronizada e efetuar `git push` para o repositório remoto GitHub conforme solicitado pelo usuário.

---

## Dependencies & Execution Order

1. **Phase 1 (T001 - T003)**: Executada sequencialmente para estabelecer as fundações de design.
2. **Phase 2 (T004 - T008)**: Pode iniciar assim que a Phase 1 estiver concluída.
3. **Phase 3 (T009 - T014)**: Pode ser executada em paralelo ou em sequência à Phase 2.
4. **Phase 4 (T015 - T016)**: Executada após componentes de base e layouts estarem prontos.
5. **Phase 5 (T017 - T021)**: Validação final obrigatória de todos os gates e commit/push.
