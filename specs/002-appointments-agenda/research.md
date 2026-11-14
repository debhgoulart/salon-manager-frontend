# Research & Architectural Decisions: Motor de Agendamentos e Agenda Visual

**Feature**: `002-appointments-agenda`  
**Date**: 2026-11-14  
**Status**: Completed

---

## 1. Decomposição Modular da Agenda (Constitution Principle I)

### Contexto

O componente atual `src/pages/appointments/AgendaView.vue` atingiu 907 linhas de código, acumulando orquestração de rotas, navegação de calendário diário/semanal, renderização das grades horárias, formulário reativo de agendamento com busca de slots e diálogo de transições de status. A Constitution do projeto proíbe Views com mais de 300 linhas (Princípio I) e estipula explicitamente o desacoplamento do `AgendaView.vue` como item de follow-up obrigatório.

### Decisão

Decompor o módulo em componentes visuais especializados em `src/pages/appointments/components/` e composables de lógica dedicados em `src/pages/appointments/composables/`:

```text
src/pages/appointments/
├── AgendaView.vue                    # Orquestrador central (< 180 linhas)
├── components/
│   ├── AgendaHeader.vue              # Barra de topo: alternador Dia/Semana, seletor de profissional, botão Novo
│   ├── AgendaDateNav.vue             # Navegação de data: anterior/próxima, Hoje, popup q-date, legenda
│   ├── AgendaDayGrid.vue             # Grade diária: régua 08:00–20:00, slots e cards de agendamento
│   ├── AgendaWeekGrid.vue            # Grade semanal: cabeçalho de 7 dias, colunas por dia e mini-cards
│   ├── AppointmentCard.vue           # Card do agendamento: cliente, serviço, profissional, horário, valor, badge
│   ├── AppointmentActionDialog.vue   # Modal de detalhes e transição de status (Confirmar, Iniciar, Concluir, Cancelar)
│   └── AppointmentCreateDialog.vue   # Modal de criação: busca de cliente, filtros de colaborador/serviço e slots livres
└── composables/
    ├── useAgendaNavigation.ts        # Gerenciamento de viewMode, data selecionada, range de dias da semana
    ├── useAppointmentSlots.ts        # Consulta reativa de slots livres (/api/v1/appointments/available-slots)
    └── useAppointmentState.ts        # Busca de agendamentos, mapeamento por hora/dia e atualização de status
```

### Justificativa

- Cada componente atinge entre 70 e 220 linhas, atendendo estritamente ao teto de 300 linhas.
- A lógica de negócio e orquestração de dados fica desacoplada da renderização de templates.
- Facilita a criação de testes unitários isolados com `@vue/test-utils` para cada subcomponente e composable.

### Alternativas Consideradas

- **Manter em componente único com `<style scoped>` extraído:** Rejeitado porque a complexidade de manutenção do template e das dezenas de `ref` e `computed` continuaria acoplada em um arquivo monolítico de mais de 700 linhas.
- **Usar biblioteca externa de calendário (FullCalendar, Vue-Cal, etc.):** Rejeitado porque a Constitution exige independência de dependências pesadas, consistência com o Design System Quasar (Vinho Nobre / Champagne Dourado) e os componentes nativos do Quasar já atendem perfeitamente à grade customizada.

---

## 2. Consulta Reativa de Slots Disponíveis (`available-slots`)

### Contexto

Para evitar choque de horários e agendamentos inválidos, a escolha do horário de início no modal de agendamento não deve ser um campo de texto livre nem uma lista estática. O backend Spring Boot expõe `/api/v1/appointments/available-slots?employeeId={id}&date={date}&serviceId={serviceId}` que calcula os intervalos livres com base na duração do procedimento e na agenda do colaborador.

### Decisão

Encapsular a consulta no composable `useAppointmentSlots`:

- Disparar a busca sempre que a tríade (`employeeId`, `date`, `serviceId`) estiver preenchida.
- Ativar estado de carregamento inline (`loadingSlots = true`) no dropdown `q-select` durante a requisição.
- Se a data ou colaborador mudar com um horário previamente selecionado, invalidar o horário anterior se ele não estiver presente nos novos slots disponíveis.
- Mapear a resposta `TimeSlot[]` para opções de `q-select` com label formatado (`HH:mm - HH:mm (Disponível)`).

### Justificativa

- Impede tentativas de submissão de horários inviáveis pelo usuário antes do envio à API.
- Fornece feedback visual imediato e responsivo dentro do próprio formulário.

### Alternativas Consideradas

- **Calcular slots localmente no frontend:** Rejeitado frontalmente pelo Princípio II da Constitution ("Regras de negócio pertencem ao backend Spring Boot; validação de disponibilidade e choque de horários cabem ao servidor").

---

## 3. Resolução de Bloqueios de Horário (FR-011)

### Contexto

O requisito FR-011 solicita a representação de bloqueios de horário (intervalos de almoço, compromissos pessoais, folgas). No entanto, o backend atual não expõe um endpoint `/api/v1/time-blocks`.

### Decisão

1. **Curto Prazo (v1.0)**: Suportar a criação de bloqueios através do modelo existente de agendamentos (`AppointmentCreateRequest`), vinculando a um serviço interno com flag ou nomenclatura de bloqueio (ex: "Bloqueio / Intervalo"), preenchendo o campo `notes` com a justificativa ("BLOQUEIO: [Motivo]").
2. **Exibição na Grade**: Cards cujo agendamento possua o prefixo "BLOQUEIO" ou serviço de intervalo são estilizados com classe CSS `.appointment-blocked` (fundo hachurado cinza, sem valor monetário e sem opções de transição de cliente).
3. **Evolução Futura**: Documentar a dependência arquitetural para que o backend Spring Boot introduza a entidade de primeira classe `TimeBlock` e o endpoint `/api/v1/time-blocks`.

### Justificativa

- Permite atender à necessidade operacional imediata do salão sem forjar contratos inexistentes e sem alterar regras de negócio unilaterais no frontend (em conformidade com a Regra 7 do Spec Kit).

### Alternativas Consideradas

- **Armazenar bloqueios em LocalStorage no frontend:** Rejeitado porque outros operadores e recepcionistas não enxergariam os bloqueios, gerando graves conflitos de agenda.
- **Inventar contrato REST `/api/v1/time-blocks` não implementado no backend:** Rejeitado pelo Princípio II e Regra 7 da Constitution ("Não alterar nem inventar contratos de API").

---

## 4. Quatro Estados de Interface (Constitution Principle III)

### Decisão

Implementar explicitamente na grade e nos modais:

1. **Loading State**: Durante a busca de agendamentos, renderizar `q-spinner-tail` ou skeletons com texto explicativo "Carregando horários da agenda...".
2. **Empty State**: Se `appointments.length === 0` para a data selecionada, renderizar `<AppEmptyState>` com título "Nenhum agendamento para esta data", descrição amigável e botão primário "Novo Agendamento".
3. **Error State**: Em caso de falha de conexão ou erro 500 da API, renderizar `<AppErrorState>` com mensagem explicativa e botão "Tentar Novamente" disparando `reloadAppointments()`.
4. **Success State**: Exibição fluida da grade horária com cards coloridos semânticamente (`status-agendado`, `status-confirmado`, `status-em_atendimento`, `status-concluido`, `status-cancelado`, `status-nao_compareceu`).

### Justificativa

- Cumpre a exigência não negociável do Princípio III da Constitution.
- Garante resiliência e clareza para o operador em qualquer situação de rede.

---

## 5. Tratamento de Fuso Horário e Concorrência

### Decisão

- Utilizar `toUtcIsoString(form.date, form.time)` no momento da submissão do formulário.
- No parsing de horários para a grade: extrair hora e minuto através de `new Date(app.startTime).getHours()`, garantindo que o fuso local do operador (`America/Sao_Paulo` / UTC-3) seja preservado.
- Concorrência HTTP 409 (Conflict): O erro RFC 7807/9457 emitido pelo Spring Boot (ex: horário acabou de ser reservado por outro operador) é capturado pelo `useFeedback().handleApiError(err, 'Horário indisponível...')` e dispara imediatamente uma nova consulta de `available-slots`.
