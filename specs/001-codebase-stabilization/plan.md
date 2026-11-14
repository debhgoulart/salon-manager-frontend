# Implementation Plan: Codebase Stabilization & Quality Baseline

**Branch**: `001-codebase-stabilization` | **Date**: 2026-11-14 | **Spec**: [specs/001-codebase-stabilization/spec.md](specs/001-codebase-stabilization/spec.md)

**Input**: Feature specification from `/specs/001-codebase-stabilization/spec.md`

## Summary

Esta feature estabelece a base operacional de qualidade, segurança e testabilidade do projeto `salon-manager-frontend`. O plano compreende a correção do script de inspeção de código (`lint:check`), a unificação da biblioteca de ícones (`lucide-vue-next`), a higienização do formulário de autenticação (remoção de credenciais padrão pré-carregadas), a correção da conversão de fuso horário nos agendamentos, a introdução do framework de testes automatizados Vitest e a criação do composable compartilhado `usePaginationTable` para eliminar duplicações nas listagens.

---

## Technical Context

**Language/Version**: TypeScript 6.0 (Strict Mode: `strict: true`)  
**Primary Dependencies**: Vue.js 3.5.22, Quasar Framework 2.35.3, Vite 8.3, Pinia 4.1.0, Axios 1.21.1, `lucide-vue-next` 1.0.0  
**Storage**: Navegador (`window.localStorage` / Quasar `LocalStorage`)  
**Testing**: Vitest, `@vue/test-utils`, `happy-dom`  
**Target Platform**: Navegadores Web Modernos (Desktop, Tablet e Mobile)  
**Project Type**: Single Page Application (Quasar Vite SPA)  
**Performance Goals**: Execução de `lint:check` em menos de 10 segundos; suíte de testes unitários concluída em menos de 5 segundos; zero distorções de fuso horário em agendamentos  
**Constraints**: Conformidade absoluta com a Constitution v1.0.0 do projeto; preservação total das rotas e contratos da API Spring Boot existentes  
**Scale/Scope**: 10 módulos funcionais existentes beneficiados pela base estabilizada; 3 correções pontuais de segurança/fuso; 1 novo composable compartilhado; 1 nova suíte de testes

---

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Princípio Constitucional                            | Avaliação no Design                                                                                                                                                                                     | Status   |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **I. Modularidade e Separação por Domínio**         | A criação do composable `usePaginationTable.ts` extrai dezenas de linhas de orquestração de tabela que antes estavam acopladas nas páginas `ClientsListView`, `EmployeesListView` e `ServicesListView`. | **PASS** |
| **II. Comunicação HTTP Padronizada**                | O composable consome os serviços existentes que utilizam `apiClient` e respeitam `PageResponse<T>`, sem criar chamadas HTTP avulsas.                                                                    | **PASS** |
| **III. Design System Boutique & Ícones**            | Eliminação da dependência duplicada `@lucide/vue`, garantindo uso exclusivo e padronizado de `lucide-vue-next`.                                                                                         | **PASS** |
| **IV. Gerenciamento de Estado & Segurança**         | Remoção de credenciais hardcoded pré-carregadas em `LoginView.vue` e correção do tratamento de fuso horário UTC na Agenda.                                                                              | **PASS** |
| **V. Qualidade de Código & Gates de Testabilidade** | Correção do script `lint:check` com `--check` e criação da infraestrutura de testes automatizados com Vitest cobrindo formatadores e rotas.                                                             | **PASS** |

_Resultado do Gate_: **APROVADO**. Todos os princípios são atendidos sem necessidade de exceções de complexidade.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-codebase-stabilization/
├── spec.md                  # Especificação funcional aprovada
├── checklists/
│   └── requirements.md      # Checklist de validação de qualidade da especificação
├── plan.md                  # Este plano de implementação técnica
├── research.md              # Pesquisa técnica e decisões de arquitetura (Fase 0)
├── data-model.md            # Entidades, estados e contratos de dados (Fase 1)
├── contracts/               # Contratos formais TypeScript dos composables e conversões
│   ├── usePaginationTable.contract.ts
│   └── appointmentTime.contract.ts
└── quickstart.md            # Guia de validação e cenários de teste práticos (Fase 1)
```

### Source Code (repository root)

```text
package.json                 # Ajuste do script lint:check e dependências de testes e ícones
vitest.config.ts             # Configuração do Vitest com suporte a aliases Quasar/Vue

src/
├── composables/
│   ├── usePaginationTable.ts      # NOVO: Composable compartilhado para orquestração de tabelas paginadas
│   ├── useFormatters.ts           # Preservado (utilizado e testado pela suíte)
│   └── useFeedback.ts             # Preservado
│
├── pages/
│   ├── auth/
│   │   └── LoginView.vue          # AJUSTE: Campos de e-mail e senha inicializados vazios
│   ├── appointments/
│   │   └── AgendaView.vue         # AJUSTE: Construção do timestamp preservando fuso local
│   ├── clients/
│   │   └── ClientsListView.vue    # REFATORAÇÃO: Adoção do usePaginationTable
│   ├── employees/
│   │   └── EmployeesListView.vue  # REFATORAÇÃO: Adoção do usePaginationTable
│   └── services/
│       └── ServicesListView.vue   # REFATORAÇÃO: Adoção do usePaginationTable

tests/
├── unit/
│   ├── composables/
│   │   ├── useFormatters.spec.ts        # Testes de moeda BRL, CPF, telefone e datas
│   │   └── usePaginationTable.spec.ts   # Testes de paginação e busca
│   └── router/
│       └── guards.spec.ts               # Testes de proteção de rotas e RBAC
```

**Structure Decision**: A implementação adiciona o diretório `tests/unit/` na raiz do projeto para concentrar os testes do Vitest, cria o composable genérico em `src/composables/usePaginationTable.ts` e aplica as correções cirúrgicas nos arquivos existentes de páginas e scripts de configuração sem alterar a estrutura de diretórios do Quasar.

---

## Complexity Tracking

> **Nenhuma violação constitucional identificada.** Todas as mudanças simplificam a base de código, reduzem duplicações e aumentam a robustez do sistema.
