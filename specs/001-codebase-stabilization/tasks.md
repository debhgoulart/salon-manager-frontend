---
description: 'Task list for Codebase Stabilization & Quality Baseline implementation'
---

# Tasks: Codebase Stabilization & Quality Baseline

**Input**: Design documents from `/specs/001-codebase-stabilization/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md  
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Exact file paths included in every task description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, tooling configuration, and dependency cleanup

- [x] T001 Update package scripts in package.json to add `--check` flag to Prettier in `lint:check` and add `"test": "vitest run"` script
- [x] T002 [P] Remove redundant dependency `@lucide/vue` from package.json and verify exclusive usage of `lucide-vue-next`
- [x] T003 [P] Configure Vitest test runner with happy-dom in vitest.config.ts supporting Quasar/Vite path aliases (`src/*`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core reusable composables and converters that user stories depend on

**⚠️ CRITICAL**: Must complete before user story refactorings begin

- [x] T004 Implement shared pagination composable in src/composables/usePaginationTable.ts conforming to specs/001-codebase-stabilization/contracts/usePaginationTable.contract.ts handling 1-based Quasar page mapping to 0-based Spring Data `page: PaginationState.page - 1` and `size: rowsPerPage`
- [x] T005 [P] Implement timezone-safe appointment datetime converter in src/composables/useFormatters.ts converting local date (`YYYY-MM-DD`) and time (`HH:mm`) via `new Date(`${date}T${time}:00`).toISOString()` conforming to specs/001-codebase-stabilization/contracts/appointmentTime.contract.ts

**Checkpoint**: Core composables ready; user story implementations can proceed independently

---

## Phase 3: User Story 1 - Validação Confiável de Qualidade e Formatação (Priority: P1) 🎯 MVP

**Goal**: Deliver a reliable, fast, and silent code quality check command that only reports violations and terminates with standard exit codes

**Independent Test**: Run `npm run lint:check` in the terminal; it must complete in < 10s with exit code 0 and emit no full file dumps to stdout

### Implementation for User Story 1

- [x] T006 [US1] Validate formatting verification script execution via `npm run lint:check` ensuring clean output without stdout dumping
- [x] T007 [US1] Run code formatting fix pass via `npm run lint` across all project files in src/ to guarantee 100% Prettier and ESLint compliance

**Checkpoint**: User Story 1 complete and independently testable

---

## Phase 4: User Story 2 - Blindagem de Segurança no Acesso e Autenticação (Priority: P1)

**Goal**: Ensure the login form initializes with empty fields, eliminating accidental or unauthorized access with hardcoded credentials in shared salon terminals

**Independent Test**: Load `/login` in a fresh browser session; email and password inputs must start empty (`''`), and empty submission must trigger required validation errors

### Implementation for User Story 2

- [x] T008 [US2] Sanitize initial form reactive state in src/pages/auth/LoginView.vue initializing `email = ref('')` and `password = ref('')` per OperatorLoginState constraints
- [x] T009 [US2] Verify inline form validation rules in src/pages/auth/LoginView.vue to block submission when fields are empty and display descriptive pt-BR alerts

**Checkpoint**: User Stories 1 AND 2 complete and independently testable

---

## Phase 5: User Story 3 - Integridade de Fuso Horário nos Agendamentos da Agenda (Priority: P1)

**Goal**: Ensure appointment start times are captured and transmitted preserving the operator's local salon timezone, eliminating the 3-hour shift caused by forging UTC `Z`

**Independent Test**: Create an appointment at 14:00 local time; the ISO string sent must reflect true local-to-UTC conversion, and the agenda grid must display the card at 14:00

### Implementation for User Story 3

- [x] T010 [US3] Refactor `handleCreateAppointment` in src/pages/appointments/AgendaView.vue to build `isoStartTime` using the timezone-safe converter (`new Date(`${form.date}T${form.time}:00`).toISOString()`) instead of `${form.date}T${form.time}:00Z`
- [x] T011 [US3] Verify appointment time slot rendering in src/pages/appointments/AgendaView.vue ensuring `getAppointmentsForHour` and `getAppointmentsForDayAndHour` match the user's local hour without timezone distortion

**Checkpoint**: User Stories 1, 2 AND 3 complete and independently testable

---

## Phase 6: User Story 4 - Suíte de Testes Automatizados para Funções Críticas (Priority: P2)

**Goal**: Introduce automated unit testing covering monetary/document formatters and role-based route guards to fulfill Constitution Principle V

**Independent Test**: Run `npm test`; Vitest must discover and pass 100% of the unit tests in < 5s

### Implementation for User Story 4

- [x] T012 [P] [US4] Implement unit tests for monetary BRL, CPF, phone, percent, minutes, and date formatters in tests/unit/composables/useFormatters.spec.ts
- [x] T013 [P] [US4] Implement unit tests for route navigation guards and role-based access control (RBAC) in tests/unit/router/guards.spec.ts
- [x] T014 [US4] Execute full test suite via `npm test` and verify 100% green pass status across all unit test suites

**Checkpoint**: Automated test suite operational and guarding core application utilities

---

## Phase 7: User Story 5 - Unificação e Consistência de Ícones da Interface (Priority: P2)

**Goal**: Consolidate the icon ecosystem exclusively around `lucide-vue-next`, removing package ambiguity and reducing dependencies

**Independent Test**: Verify package manifests and run `npm run typecheck` to confirm zero unresolved icon imports across all views and components

### Implementation for User Story 5

- [x] T015 [US5] Audit all icon import statements in src/components/ and src/pages/ to confirm exclusive import from `lucide-vue-next`
- [x] T016 [US5] Run `npm run typecheck` and `npm run build` to verify that all icon bindings compile without errors after removing `@lucide/vue`

**Checkpoint**: Icon library clean and unified across the entire project

---

## Phase 8: User Story 6 - Padronização de Tabelas de Listagem com Composable Compartilhado (Priority: P3)

**Goal**: Reduce repetitive boilerplate across operational listings by adopting the shared `usePaginationTable` composable in Clients, Employees, and Services

**Independent Test**: Navigate across Clients, Employees, and Services listings; pagination, search debouncing, and loading states must operate identically without regressions

### Implementation for User Story 6

- [x] T017 [P] [US6] Implement unit test for pagination composable in tests/unit/composables/usePaginationTable.spec.ts verifying pagination 1-based to 0-based mapping, debounced search, and reload
- [x] T018 [US6] Refactor src/pages/clients/ClientsListView.vue to use `usePaginationTable` for server-side pagination, search handling, and table loading state
- [x] T019 [US6] Refactor src/pages/employees/EmployeesListView.vue to use `usePaginationTable` preserving the active/inactive status filter toggle
- [x] T020 [US6] Refactor src/pages/services/ServicesListView.vue to use `usePaginationTable` preserving duration chips, price formatting, and CRUD modal triggers

**Checkpoint**: All 6 user stories implemented and independently verifiable

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Comprehensive end-to-end verification and Constitution compliance check

- [x] T021 [P] Execute end-to-end validation scenarios documented in specs/001-codebase-stabilization/quickstart.md
- [x] T022 Execute all Constitution quality gates: `npm run typecheck`, `npm run lint:check`, `npm test`, and `npm run build` ensuring zero errors and clean build output

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS User Stories 3 and 6
- **User Stories (Phase 3+)**:
  - **US1 (Lint/Format)**: Depends on Phase 1 (T001)
  - **US2 (Login Security)**: Can start after Phase 1 - No dependencies on other stories
  - **US3 (Timezone)**: Depends on Phase 2 (T005 converter helper)
  - **US4 (Vitest Tests)**: Depends on Phase 1 (T003 vitest setup)
  - **US5 (Icon Cleanup)**: Depends on Phase 1 (T002)
  - **US6 (usePaginationTable)**: Depends on Phase 2 (T004 composable)
- **Polish (Phase 9)**: Depends on completion of all user stories

### Parallel Opportunities

- T002 and T003 can execute in parallel during Phase 1
- T004 and T005 can execute in parallel during Phase 2
- Once Phase 2 is complete, US1, US2, and US4 can be worked on concurrently
- Tests T012 and T013 can execute in parallel during Phase 6
- Refactoring tasks T018, T019, and T020 can be performed incrementally per view

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Execute Phase 1: Setup (`package.json`, `vitest.config.ts`)
2. Execute Phase 3: User Story 1 (`lint:check` fix and formatting pass)
3. **STOP and VALIDATE**: Verify lint completes cleanly in < 10s

### Incremental Delivery Sequence

1. **Increment 1 (MVP - Tooling Baseline)**: Phase 1 + Phase 3 (US1) → Clean linting established
2. **Increment 2 (Security & Integrity)**: Phase 4 (US2) + Phase 5 (US3) → Login hygiene + timezone fix
3. **Increment 3 (Automated Quality Suite)**: Phase 6 (US4) + Phase 7 (US5) → Vitest tests passing + icons unified
4. **Increment 4 (Architecture Refactoring)**: Phase 2 + Phase 8 (US6) → `usePaginationTable` adopted across listings
5. **Increment 5 (Final Gate)**: Phase 9 → All validation scenarios and build pass
