---
description: 'Task list for Motor de Agendamentos e Agenda Visual implementation'
---

# Tasks: Motor de Agendamentos e Agenda Visual

**Input**: Design documents from `/specs/002-appointments-agenda/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md  
**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Exact file paths included in every task description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Directory scaffolding, type definitions, and component contracts

- [x] T001 Create component and composable subdirectories at src/pages/appointments/components/ and src/pages/appointments/composables/
- [x] T002 [P] Extend appointment interfaces in src/types/appointment.ts with AgendaNavigationState and AppointmentFormData conforming to specs/002-appointments-agenda/data-model.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core reusable composables that user story components depend on

**⚠️ CRITICAL**: Must complete before user story component development begins

- [x] T003 Implement date navigation and mode composable in src/pages/appointments/composables/useAgendaNavigation.ts conforming to specs/002-appointments-agenda/contracts/agendaComposables.contract.ts handling day/week switching, daily steps, weekly interval generation, and 'Hoje' reset
- [x] T004 [P] Implement reactive slots lookup composable in src/pages/appointments/composables/useAppointmentSlots.ts conforming to specs/002-appointments-agenda/contracts/agendaComposables.contract.ts consuming /api/v1/appointments/available-slots with debounced triggers and slot options mapping
- [x] T005 Implement appointment state and transitions composable in src/pages/appointments/composables/useAppointmentState.ts conforming to specs/002-appointments-agenda/contracts/agendaComposables.contract.ts handling appointment listing with employee filter, grouping by hour/day, status transitions, loading, and error retry state

**Checkpoint**: Core composables ready; user story component implementations can proceed independently

---

## Phase 3: User Story 1 - Visualização e Navegação da Grade de Horários (Diária e Semanal) (Priority: P1) 🎯 MVP

**Goal**: Render and navigate the daily and weekly appointment schedule grids with employee filter, date navigation, and full 4-state UI handling

**Independent Test**: Navigate to `/agenda`, switch day/week view, filter by employee, click date arrows, and verify schedule rendering (08:00–20:00) with loading, empty, and error retry states

### Tests for User Story 1

- [x] T006 [P] [US1] Implement unit tests for useAgendaNavigation in tests/unit/appointments/useAgendaNavigation.spec.ts covering daily date step, weekly interval calculation, and today reset

### Implementation for User Story 1

- [x] T007 [P] [US1] Implement topbar header in src/pages/appointments/components/AgendaHeader.vue conforming to specs/002-appointments-agenda/contracts/appointmentComponents.contract.ts with day/week toggle, employee selector, and new appointment trigger
- [x] T008 [P] [US1] Implement date navigator in src/pages/appointments/components/AgendaDateNav.vue conforming to specs/002-appointments-agenda/contracts/appointmentComponents.contract.ts with previous/next controls, today button, q-date popup calendar, and status color legend
- [x] T009 [P] [US1] Implement visual card in src/pages/appointments/components/AppointmentCard.vue conforming to specs/002-appointments-agenda/contracts/appointmentComponents.contract.ts with client name, service, employee, time range, price, and status badge
- [x] T010 [US1] Implement daily schedule grid in src/pages/appointments/components/AgendaDayGrid.vue conforming to specs/002-appointments-agenda/contracts/appointmentComponents.contract.ts with 08:00 to 20:00 time rows, slot click event, and appointment cards
- [x] T011 [US1] Implement weekly schedule grid in src/pages/appointments/components/AgendaWeekGrid.vue conforming to specs/002-appointments-agenda/contracts/appointmentComponents.contract.ts with 7-day columns header with is-today highlight, hourly rows, and mini appointment cards
- [x] T012 [US1] Assemble subcomponents in src/pages/appointments/AgendaView.vue with useAgendaNavigation and useAppointmentState incorporating AppLoading, AppEmptyState, and AppErrorState fulfilling Constitution Principle III

**Checkpoint**: User Story 1 operational and independently testable as MVP

---

## Phase 4: User Story 2 - Agendamento Rápido com Consulta Reativa de Slots Disponíveis (Priority: P1)

**Goal**: Rapid appointment creation triggered from grid slots with reactive available slots lookup, client debounced search, and timezone-safe submission

**Independent Test**: Click a free slot in the grid; modal opens with date/time preselected, client search works, available slots load for chosen employee/service, and submission creates card on the grid

### Tests for User Story 2

- [x] T013 [P] [US2] Implement unit tests for useAppointmentSlots in tests/unit/appointments/useAppointmentSlots.spec.ts verifying reactive slot fetching, loading flag, and invalidation upon employee/date change

### Implementation for User Story 2

- [x] T014 [US2] Implement appointment creation modal in src/pages/appointments/components/AppointmentCreateDialog.vue conforming to specs/002-appointments-agenda/contracts/appointmentComponents.contract.ts with client search, employee/service selects, available slots dropdown, and inline pt-BR validation
- [x] T015 [US2] Connect slot click events from AgendaDayGrid and AgendaWeekGrid in src/pages/appointments/AgendaView.vue to open AppointmentCreateDialog with pre-filled date and time, executing toUtcIsoString on submission

**Checkpoint**: User Stories 1 AND 2 complete and independently testable

---

## Phase 5: User Story 3 - Ciclo de Vida e Transições de Status do Atendimento (Priority: P1)

**Goal**: Modal detail view with validated status transitions (AGENDADO → CONFIRMADO → EM_ATENDIMENTO → CONCLUIDO, cancelation, and no-show) with instant semantic badge updates

**Independent Test**: Click any appointment card on the grid; action dialog opens with status buttons; trigger transition and verify PATCH request and card color update

### Tests for User Story 3

- [x] T016 [P] [US3] Implement unit tests for status transition rules in tests/unit/appointments/appointmentTransitions.spec.ts verifying allowed next states and invalid transition rejections

### Implementation for User Story 3

- [x] T017 [US3] Implement status action modal in src/pages/appointments/components/AppointmentActionDialog.vue conforming to specs/002-appointments-agenda/contracts/appointmentComponents.contract.ts with contextual transition buttons, cancellation dropdown, and confirmation triggers
- [x] T018 [US3] Connect appointment card click events in src/pages/appointments/AgendaView.vue to open AppointmentActionDialog, executing status change via useAppointmentState with success feedback

**Checkpoint**: User Stories 1, 2 AND 3 complete and independently testable

---

## Phase 6: User Story 4 - Bloqueio de Horários e Indisponibilidade de Profissionais (Priority: P2)

**Goal**: Display and register schedule blocks (lunch breaks, days off) visually on the grid, preventing appointment creation in blocked periods

**Independent Test**: Create or view a schedule block; grid renders striped gray area and slot picker excludes the blocked period

### Implementation for User Story 4

- [x] T019 [US4] Enhance AppointmentCard.vue and grid styling in src/pages/appointments/components/AppointmentCard.vue to render blocked intervals with striped gray styling, lock icon, and reason label
- [x] T020 [US4] Add schedule block creation trigger and form fields in src/pages/appointments/components/AppointmentCreateDialog.vue supporting interval reservation with notes: "BLOQUEIO: [Motivo]"

**Checkpoint**: User Stories 1 through 4 operational

---

## Phase 7: User Story 5 - Decomposição Modular da Agenda e Responsividade Boutique (Priority: P2)

**Goal**: Ensure complete modularization of AgendaView.vue (< 180 lines) adhering to Constitution Principle I, with mobile/tablet responsive touch targets (≥ 44px)

**Independent Test**: Audit line counts across src/pages/appointments/ to confirm zero files exceeding 300 lines; verify responsive rendering in mobile viewport (< 768px)

### Implementation for User Story 5

- [x] T021 [US5] Audit line counts of src/pages/appointments/AgendaView.vue and all subcomponents in src/pages/appointments/components/ verifying strict compliance with the < 300 lines limit per Constitution Principle I
- [x] T022 [US5] Refine responsive CSS in src/css/app.scss and component styles for mobile touch targets (≥ 44px) and smooth horizontal scrolling on weekly view

**Checkpoint**: All 5 user stories implemented and conforming to modularity limits

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Comprehensive end-to-end verification and Constitution compliance check

- [x] T023 [P] Execute all test suites via `npm test` verifying 100% green pass status for new and existing tests
- [x] T024 Execute all Constitution quality gates: `npm run typecheck`, `npm run lint:check`, and `npm run build` verifying zero errors and clean build output

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**:
  - **US1 (MVP Grid)**: Depends on Phase 2 (T003, T005)
  - **US2 (Quick Create & Slots)**: Depends on Phase 2 (T004) and Phase 3 (grid click events)
  - **US3 (Status Transitions)**: Depends on Phase 2 (T005) and Phase 3 (card click events)
  - **US4 (Blocks)**: Depends on US2 and US3
  - **US5 (Modularity Audit & Mobile)**: Depends on completion of US1-US4
- **Polish (Phase 8)**: Depends on completion of all user stories

### Parallel Opportunities

- Within Phase 1: T002 can run in parallel with T001
- Within Phase 2: T004 can run in parallel with T003
- Within Phase 3: T006, T007, T008, and T009 can all be implemented in parallel
- Within Phase 4: T013 test can be implemented in parallel with T014
- Within Phase 5: T016 test can run in parallel with T017
- Within Phase 8: T023 can run in parallel with review preparation

---

## Parallel Example: User Story 1

```bash
# Implement presentational components in parallel:
Task: "Implement topbar header in src/pages/appointments/components/AgendaHeader.vue"
Task: "Implement date navigator in src/pages/appointments/components/AgendaDateNav.vue"
Task: "Implement visual card in src/pages/appointments/components/AppointmentCard.vue"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (scaffolding and types)
2. Complete Phase 2: Foundational (composables `useAgendaNavigation`, `useAppointmentSlots`, `useAppointmentState`)
3. Complete Phase 3: User Story 1 (`AgendaHeader`, `AgendaDateNav`, `AgendaDayGrid`, `AgendaWeekGrid`, `AgendaView.vue`)
4. **STOP and VALIDATE**: Test navigation, filtering, and schedule display independently

### Incremental Delivery

1. Setup + Foundational ready
2. Add User Story 1 $\rightarrow$ Schedule view MVP operational
3. Add User Story 2 $\rightarrow$ Rapid appointment booking with available slots
4. Add User Story 3 $\rightarrow$ Operational status lifecycle transitions
5. Add User Story 4 $\rightarrow$ Schedule block management
6. Add User Story 5 $\rightarrow$ Modularity line audit and mobile touch refinement
7. Polish $\rightarrow$ 100% green on all 4 Constitution Quality Gates
