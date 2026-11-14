# Quickstart & Validation Guide: Motor de Agendamentos e Agenda Visual

**Feature**: `002-appointments-agenda`  
**Date**: 2026-11-14

Este guia detalha o roteiro determinístico para validação ponta a ponta da agenda de atendimentos, suas grades visuais e ciclo de vida de status.

---

## 1. Pré-requisitos

- Servidor frontend em execução: `npm run dev` (ou `quasar dev` na porta `9000`).
- Usuário autenticado no sistema (ex: operador/recepcionista com acesso à rota `/agenda`).
- Profissionais, clientes e serviços previamente cadastrados no sistema.

---

## 2. Cenários de Validação

### Cenário 1: Navegação na Grade Diária e Semanal

**Objetivo**: Comprovar a alternância fluida entre visão diária e semanal, navegação por datas e integridade da régua de horários (08:00 às 20:00).

**Passos**:

1. Acessar `/agenda`.
2. Verificar que a grade inicial exibe o dia de hoje com a lista de horários de 08:00 a 20:00.
3. Clicar no botão `>` (próximo dia) e `<` (dia anterior).
4. Clicar no botão de atalho `Hoje` e confirmar que a data retorna imediatamente para o dia atual.
5. Clicar no alternador `Semana`:
   - A grade deve renderizar 7 colunas (segunda a domingo).
   - A coluna correspondente ao dia atual deve conter a classe e destaque visual `is-today`.

**Resultado Esperado**:

- Ambas as visões carregam em $< 1,5$ segundos sem travamentos.
- Nenhum card de agendamento sofre deslocamento de horário.

---

### Cenário 2: Filtragem por Colaborador

**Objetivo**: Validar o isolamento de agendamentos por profissional na grade.

**Passos**:

1. Na barra superior da agenda, abrir o dropdown `Profissional`.
2. Selecionar um profissional específico (ex: "Carlos Cabeleireiro").
3. Inspecionar a grade da agenda.

**Resultado Esperado**:

- Apenas os agendamentos atribuídos ao colaborador selecionado são exibidos.
- Se o colaborador não tiver agendamentos na data, o componente `<AppEmptyState>` é renderizado com mensagem apropriada.
- Retornar para "Todos os Profissionais" restaura a visão consolidada de toda a equipe.

---

### Cenário 3: Consulta Reativa de Slots e Novo Agendamento

**Objetivo**: Validar o modal de criação ágil e a busca reativa de horários disponíveis.

**Passos**:

1. Na grade diária, clicar no slot das 15:00.
2. Observar a abertura do modal `Novo Agendamento` com Data e Horário (15:00) pré-preenchidos.
3. Digitar o nome de um cliente no campo com busca debounced e selecionar o cliente retornado.
4. Selecionar um profissional e um serviço (ex: "Corte Masculino - 45 min").
5. Verificar o campo "Horário de Início": o dropdown exibe os slots livres retornados pelo backend.
6. Clicar em "Agendar Atendimento".

**Resultado Esperado**:

- Notificação de sucesso exibida no canto superior da tela.
- O card do agendamento é renderizado imediatamente na grade às 15:00 com o badge de status `AGENDADO`.

---

### Cenário 4: Transição de Status do Atendimento

**Objetivo**: Testar o ciclo de vida completo do atendimento na interface.

**Passos**:

1. Clicar no card de agendamento criado no Cenário 3.
2. O modal de detalhes abre exibindo as informações do serviço e o botão primário "Confirmar Horário".
3. Clicar em "Confirmar Horário" $\rightarrow$ O badge do card passa para `CONFIRMADO` (cor primária / vinho).
4. Abrir novamente o card e clicar em "Iniciar Atendimento" $\rightarrow$ O status transiciona para `EM_ATENDIMENTO` (cor âmbar).
5. Abrir novamente o card e clicar em "Concluir Atendimento" $\rightarrow$ O status transiciona para `CONCLUIDO` (cor verde).

**Resultado Esperado**:

- Cada clique emite requisição `PATCH /api/v1/appointments/{id}/status` com atualização visual imediata.
- A grade reflete a cor correta do status sem necessidade de recarregar a página inteira.

---

### Cenário 5: Auditoria de Modularidade e Quality Gates

**Objetivo**: Garantir que nenhum arquivo Vue ultrapassa 300 linhas (Princípio I) e que os 4 quality gates estão verdes.

**Comandos**:

```bash
# 1. Contagem de linhas dos arquivos em src/pages/appointments/
wc -l src/pages/appointments/*.vue src/pages/appointments/components/*.vue

# 2. Testes automatizados Vitest
npm test

# 3. Tipagem TypeScript estrita
npm run typecheck

# 4. Checagem de Lint e Formatação
npm run lint:check

# 5. Build de Produção
npm run build
```

**Resultado Esperado**:

- Todos os arquivos Vue possuem $< 300$ linhas de código.
- Todos os comandos executam com código de saída `0` sem erros.
