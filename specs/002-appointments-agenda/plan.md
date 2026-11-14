# Implementation Plan: Motor de Agendamentos e Agenda Visual

**Branch**: `002-appointments-agenda` | **Date**: 2026-11-14 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-appointments-agenda/spec.md`

## Summary

Implementação da grade visual de agendamentos diária e semanal do salão de beleza, com navegação por datas, consulta reativa de slots disponíveis (`/api/v1/appointments/available-slots`), criação ágil de agendamentos e orquestração do ciclo de vida dos atendimentos (`AGENDADO` $\rightarrow$ `CONFIRMADO` $\rightarrow$ `EM_ATENDIMENTO` $\rightarrow$ `CONCLUIDO`, além de cancelamento e ausência).

A abordagem técnica contempla a decomposição modular do componente monolítico `AgendaView.vue` (907 linhas) em 7 subcomponentes coesos e 3 composables dedicados, garantindo que nenhum arquivo Vue ultrapasse o limite mandatório de 300 linhas fixado pelo Princípio I da Constitution do projeto, além de assegurar os 4 estados obrigatórios de interface (Loading, Empty, Error e Success) e blindagem de fuso horário.

---

## Technical Context

**Language/Version**: TypeScript 5.9 / Vue 3.5 (Composition API com `<script setup>`)  
**Primary Dependencies**: Quasar Framework v2.35 (Vite plugin), Lucide Icons (`lucide-vue-next`), Axios centralizado  
**Storage**: N/A (Consumo de API REST Spring Boot via `apiClient`)  
**Testing**: Vitest v5.1 + `@vue/test-utils` + `happy-dom`  
**Target Platform**: Navegadores Web Desktop, Tablet e Mobile (Chrome, Firefox, Safari, Edge)  
**Project Type**: Single Page Application (SPA) frontend  
**Performance Goals**: Tempo de renderização inicial da grade $< 1,5$s; consulta reativa de slots $< 800$ms; transição de status visual instantânea ($< 300$ms pós-resposta)  
**Constraints**: Breakpoints Quasar responsivos (Desktop $\ge 1024$px, Tablet $768$px–$1023$px, Mobile $< 768$px); alvos de toque mínimos de 44px; fuso horário de referência `America/Sao_Paulo` (UTC-3) sem distorção na conversão de início de agendamento  
**Scale/Scope**: Grade operacional com régua horária de 08:00 às 20:00 (13 faixas horárias diárias $\times$ 7 dias semanais); dezenas de colaboradores e procedimentos simultâneos

---

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Princípio da Constitution                 | Requisito da Feature                                                                                     | Avaliação                                                                        |  Status  |
| :---------------------------------------- | :------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------- | :------: |
| **I. Modularidade e Limite de Linhas**    | Decompor `AgendaView.vue` (907 linhas) em subcomponentes de apresentação e composables $< 300$ linhas    | Cada novo subcomponente e composable terá entre 70 e 220 linhas                  | **PASS** |
| **II. Comunicação HTTP e Erros RFC 7807** | Consumir `/api/v1/appointments` exclusivamente via `appointmentService` e tratar erros com `useFeedback` | Interceptação centralizada com suporte a conflitos de concorrência (HTTP 409)    | **PASS** |
| **III. Quatro Estados de Interface**      | Implementar Loading, Empty, Error e Success em todas as visões da agenda                                 | `<AppEmptyState>`, `<AppErrorState>`, spinners Quasar e grade semântica completa | **PASS** |
| **IV. Fuso Horário e RBAC**               | Usar `toUtcIsoString` para envio de horários e validar rotas da agenda por permissão de acesso           | Blindagem contra acréscimo manual de sufixo `Z` e manipulação segura de datas    | **PASS** |
| **V. Quality Gates Mandatórios**          | Executar `npm test`, `npm run typecheck`, `npm run lint:check` e `npm run build`                         | 100% dos testes e verificações estáticas executando com código 0                 | **PASS** |

---

## Project Structure

### Documentation (this feature)

```text
specs/002-appointments-agenda/
├── spec.md                  # Especificação funcional refinada
├── plan.md                  # Este plano de implementação técnica
├── research.md              # Pesquisa técnica e decisões arquiteturais (Phase 0)
├── data-model.md            # Modelo de dados, entidades e máquina de estados (Phase 1)
├── contracts/               # Contratos TypeScript de props, emits e composables (Phase 1)
│   ├── appointmentComponents.contract.ts
│   └── agendaComposables.contract.ts
├── quickstart.md            # Guia de validação ponta a ponta (Phase 1)
└── checklists/
    └── requirements.md      # Checklist de validação de qualidade dos requisitos (16/16 PASS)
```

### Source Code (repository root)

```text
src/
├── pages/
│   └── appointments/
│       ├── AgendaView.vue                     # View orquestradora principal (< 180 linhas)
│       ├── components/
│       │   ├── AgendaHeader.vue               # Topbar: Dia/Semana, filtro de profissional, botão Novo
│       │   ├── AgendaDateNav.vue              # Navegador de datas: <, >, Hoje, popup de calendário, legenda
│       │   ├── AgendaDayGrid.vue              # Grade diária: régua 08:00–20:00 e área de slots
│       │   ├── AgendaWeekGrid.vue             # Grade semanal: cabeçalho de 7 dias e colunas por dia
│       │   ├── AppointmentCard.vue            # Card do agendamento (completo e mini)
│       │   ├── AppointmentActionDialog.vue    # Modal de detalhes e transição de status
│       │   └── AppointmentCreateDialog.vue    # Modal de criação com consulta reativa de slots
│       └── composables/
│           ├── useAgendaNavigation.ts         # Orquestração de datas, viewMode e dias da semana
│           ├── useAppointmentSlots.ts         # Consulta reativa de slots disponíveis (/available-slots)
│           └── useAppointmentState.ts         # Busca de agendamentos, agrupamento por hora e status
├── services/
│   └── appointmentService.ts                  # Comunicação com a API REST Spring Boot
├── types/
│   └── appointment.ts                         # Tipagem estrita de AppointmentResponse, TimeSlot, etc.
└── composables/
    └── useFormatters.ts                       # Conversores toUtcIsoString, formatCurrency, etc.

tests/
└── unit/
    └── appointments/
        ├── useAgendaNavigation.spec.ts        # Testes de navegação diária/semanal e atalhos
        ├── useAppointmentSlots.spec.ts        # Testes de busca e invalidação de slots livres
        └── appointmentTransitions.spec.ts     # Testes da máquina de estados e regras de transição
```

**Structure Decision**: Adoção de arquitetura modular orientada a domínio dentro de `src/pages/appointments/`. Os subcomponentes de apresentação residem em `components/`, a lógica reativa reside em `composables/` dedicados e os testes automatizados ficam espelhados em `tests/unit/appointments/`.

---

## Complexity Tracking

_Nenhuma violação identificada frente à Constitution do projeto. Todas as diretrizes arquiteturais foram integralmente respeitadas._
