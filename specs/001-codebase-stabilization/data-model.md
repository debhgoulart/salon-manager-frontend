# Data Model: Codebase Stabilization & Quality Baseline

**Feature**: `001-codebase-stabilization`  
**Date**: 2026-11-14

## Entities & Interfaces

### 1. PaginationState (Estado de Paginação Quasar)

Representa o modelo de paginação bidirecional compatível com a `QTable` do Quasar Framework.

| Campo         | Tipo             | Descrição                                         | Regras de Validação               |
| ------------- | ---------------- | ------------------------------------------------- | --------------------------------- |
| `page`        | `number`         | Página atual exibida na interface (1-based index) | Inteiro positivo `>= 1`           |
| `rowsPerPage` | `number`         | Quantidade de registros por página                | Valores permitidos: 5, 10, 20, 50 |
| `rowsNumber`  | `number`         | Total geral de elementos retornados pelo backend  | Inteiro não negativo `>= 0`       |
| `sortBy`      | `string \| null` | Nome da coluna para ordenação                     | Opcional                          |
| `descending`  | `boolean`        | Direção da ordenação (ascendente / descendente)   | Padrão: `false`                   |

---

### 2. SpringPageableQuery (Parâmetros de Consulta ao Backend)

Estrutura de parâmetros enviada via query string para endpoints paginados do Spring Boot (`Pageable`).

| Campo   | Tipo                  | Descrição                                       | Mapeamento / Regras                             |
| ------- | --------------------- | ----------------------------------------------- | ----------------------------------------------- |
| `page`  | `number`              | Índice da página no Spring Data (0-based index) | Calculado como `PaginationState.page - 1`       |
| `size`  | `number`              | Tamanho da página no Spring Data                | Mapeado direto de `PaginationState.rowsPerPage` |
| `query` | `string \| undefined` | Termo de busca textual (nome, telefone, etc.)   | Sanitizado (trim), omitido se vazio             |

---

### 3. LocalAppointmentTimeInput (Entrada de Data/Hora de Agendamento)

Parâmetros de data e horário manipulados pelo operador do salão na interface antes da conversão para envio.

| Campo  | Tipo     | Formato / Exemplo               | Validação                          |
| ------ | -------- | ------------------------------- | ---------------------------------- |
| `date` | `string` | `YYYY-MM-DD` (ex: `2026-11-14`) | Data válida no calendário          |
| `time` | `string` | `HH:mm` (ex: `14:30`)           | Horário válido entre 07:00 e 22:00 |

#### Conversão para o Contrato de API:

```ts
// Entrada local no fuso do navegador do salão (ex: BRT -03:00)
const localDate = new Date(`${date}T${time}:00`);

// Saída em formato ISO 8601 UTC válido para o backend:
const startTimeUtc = localDate.toISOString();
// Exemplo: '2026-11-14T14:30:00' local em UTC-3 gera '2026-11-14T17:30:00.000Z'
```

---

### 4. OperatorLoginState (Estado do Formulário de Autenticação)

Estrutura reativa de entrada na tela de login.

| Campo          | Tipo      | Valor Inicial | Validação                             |
| -------------- | --------- | ------------- | ------------------------------------- |
| `email`        | `string`  | `''` (vazio)  | Obrigatório, formato de e-mail válido |
| `password`     | `string`  | `''` (vazio)  | Obrigatório, mínimo de 6 caracteres   |
| `showPassword` | `boolean` | `false`       | Alternador de visibilidade de senha   |
| `loading`      | `boolean` | `false`       | Bloqueia submissão concorrente        |
