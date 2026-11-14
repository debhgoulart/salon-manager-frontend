# Phase 0: Technical Research & Decisions

**Feature**: `001-codebase-stabilization`  
**Date**: 2026-11-14

## Research Item 1: Prettier Validation Script Configuration

- **Decision**: Adicionar a flag `--check` à invocação do Prettier no script `lint:check` em `package.json`.
- **Contexto**: Atualmente, `npm run lint:check` executa `prettier "**/*.{...}" --ignore-path .gitignore && eslint ...`. Sem `--check` ou `-w`, o Prettier processa todos os arquivos correspondentes e escreve o código formatado no `stdout`, gerando mais de 100 mil linhas de log no terminal e mascarando eventuais falhas.
- **Rationale**: A flag `--check` faz com que o Prettier funcione como linter: apenas lista os arquivos que não estão formatados de acordo com as regras e retorna código de saída `1` se houver violações, ou código `0` silencioso se todos estiverem em conformidade.
- **Alternativas consideradas**:
  - _Usar apenas `eslint` com plugin do prettier_: Rejeitado porque o Prettier cobre arquivos não-JS/TS (SCSS, JSON, HTML, Markdown) que o ESLint não inspeciona diretamente.

---

## Research Item 2: Unificação da Dependência de Ícones (Lucide)

- **Decision**: Remover a dependência `@lucide/vue` do `package.json` e manter exclusivamente `lucide-vue-next` como fonte oficial de ícones.
- **Contexto**: A auditoria detectou que tanto `@lucide/vue` (^1.70.0) quanto `lucide-vue-next` (^1.0.0) constavam em `dependencies`. Todos os componentes e páginas da aplicação (`AppHeader.vue`, `AppSidebar.vue`, `AppEmptyState.vue`, etc.) já importam exclusivamente de `lucide-vue-next`.
- **Rationale**: A presença de `@lucide/vue` é 100% redundante e desnecessária. A remoção reduz o tamanho de `node_modules`, simplifica a resolução de pacotes e previne imports acidentais da biblioteca duplicada.
- **Alternativas consideradas**:
  - _Migrar tudo para `@lucide/vue`_: Desnecessário e com maior risco de refatoração, pois todo o código existente já importa de `lucide-vue-next`.

---

## Research Item 3: Higienização de Credenciais no Formulário de Login

- **Decision**: Inicializar os estados reativos `email` e `password` em `LoginView.vue` com strings vazias (`ref('')`), exibindo textos de ajuda (placeholder e dica) para ambiente de desenvolvimento.
- **Contexto**: `LoginView.vue` inicializava com `email = ref('admin@salonmanager.com')` e `password = ref('admin@123456')`. O Princípio IV da Constitution proíbe expressamente credenciais hardcoded pré-carregadas em formulários de produção.
- **Rationale**: Impede que acessos administrativos fiquem abertos por padrão caso a aplicação seja acessada em computadores de recepção compartilhados.
- **Alternativas consideradas**:
  - _Preencher automaticamente apenas se `import.meta.env.DEV` for verdadeiro_: Rejeitado para os campos de formulário, pois pode induzir submissão acidental. A dica textual informativa no rodapé é suficiente para desenvolvimento local.

---

## Research Item 4: Correção de Timezone na Criação de Agendamentos

- **Decision**: Converter o par `date` e `time` em um objeto `Date` local e emitir o timestamp ISO real (`dateObj.toISOString()`), ou formatar com o offset local, em vez de concatenar artificialmente a letra `Z`.
- **Contexto**: Em `AgendaView.vue` (linha 623), o código construía:
  ```ts
  const isoStartTime = `${form.date}T${form.time}:00Z`;
  ```
  Isso forçava o sufixo `Z` (Zulu / UTC) em um horário que o operador escolheu no seu fuso horário local (ex: 09:00 no Brasil, UTC-3). Quando a API Spring Boot recebe `09:00:00Z` e o navegador posteriormente renderiza através de `new Date(app.startTime)`, o horário era convertido para `06:00` local, gerando um deslocamento de 3 horas.
- **Rationale**: Criar a data localmente (`new Date(`${form.date}T${form.time}:00`)`) e utilizar `.toISOString()` garante que 09:00 BRT seja enviado como `12:00:00.000Z`. Ao ser lido de volta pelo navegador, `new Date('...T12:00:00.000Z')` resultará exatamente nas 09:00 do fuso local.
- **Alternativas consideradas**:
  - _Enviar sem fuso (LocalDateTime puro: `YYYY-MM-DDTHH:mm:ss`)_: Depende de alteração de contrato no backend. Como o contrato `AppointmentCreateRequest` especifica `ISO 8601 UTC` (`2026-11-10T14:30:00Z`), a conversão correta de local para UTC via `Date` é a solução padrão e não quebra contratos.

---

## Research Item 5: Ferramenta e Configuração de Testes Automatizados

- **Decision**: Adotar **Vitest** (^3.x ou compatível) + `@vue/test-utils` + `happy-dom` como ferramenta oficial de testes unitários e de integração de componentes.
- **Contexto**: O projeto não possui nenhuma dependência ou script de teste instalado no `package.json`. A Constitution (Princípio V) exige suíte de testes cobrindo formatadores, guards e composables.
- **Rationale**:
  - O Vitest utiliza a mesma configuração do Vite do Quasar (`quasar.config.ts` / `vite`), compartilhando resolução de módulos, aliases e compilação TypeScript instantânea.
  - `happy-dom` é até 3x mais rápido que `jsdom` para emular o DOM do navegador em testes de componentes Vue.
  - Script padronizado: `"test": "vitest run"`, `"test:watch": "vitest"`.
- **Alternativas consideradas**:
  - _Jest_: Mais lento e requer configuração pesada de Babel/ts-jest paralela ao Vite.
  - _Cypress Component Testing_: Mais pesado para testes unitários simples de funções e composables.

---

## Research Item 6: Arquitetura do Composable Compartilhado `usePaginationTable`

- **Decision**: Criar `src/composables/usePaginationTable.ts` para orquestrar o estado da `QTable` do Quasar em listagens paginadas no servidor.
- **Contexto**: As páginas de Clientes, Funcionários e Serviços repetem ~60 linhas idênticas de boilerplate:
  - Definição do objeto `pagination` com `page`, `rowsPerPage`, `rowsNumber`.
  - Handler `onRequest(props)` disparado pelo Quasar ao mudar página ou ordenar.
  - Flags de `loading`, `searchQuery` debounced e funções de recarregamento (`reload()`).
- **Rationale**: Centraliza a sincronização entre a convenção de paginação 1-based do Quasar e a convenção 0-based do Spring Data (`PageResponse`), eliminando repetição e viabilizando testes unitários dedicados.
- **Alternativas consideradas**:
  - _Criar um componente genérico `<AppDataTable>`_: Prematuro neste momento, pois forçaria uma refatoração em massa das colunas e templates de customização de cada tabela. O composable reaproveita os componentes `QTable` existentes sem impacto visual.
