# Instruções e Regras Permanentes para Agentes de IA

**Projeto**: `salon-manager-frontend`  
**Escopo**: Desenvolvimento, Manutenção e Evolução da Interface  
**Documentos de Referência Obrigatórios**:

1. [Constitution do Projeto](.specify/memory/constitution.md) (Princípios Arquiteturais e Governança Spec Kit)
2. [Design System Oficial](DESIGN.md) (Guia Visual, Cores, Tipografia e Acessibilidade)

---

## 1. Diretrizes Mandatórias de Frontend

Qualquer agente de IA que atue neste repositório criando, modificando ou revisando telas, páginas, componentes ou estilos DEVE seguir rigorosamente este fluxo de trabalho:

### 1. Consulta Prévia Obrigatória ao DESIGN.md

- **Antes de escrever qualquer linha de código de interface**, o agente DEVE consultar o arquivo [`DESIGN.md`](DESIGN.md).
- Todo novo componente, botão, campo de entrada, modal ou tabela deve reutilizar estritamente os tokens de cores, espaçamentos, raios de borda e regras tipográficas definidos no `DESIGN.md`.

### 2. Uso das Skills Especializadas de Design

- **`design-taste-frontend`**:
  - Deve ser ativada e lida sempre que a tarefa envolver design visual, criação de novas páginas, redesenho de telas ou ajustes substanciais de layout.
  - Objetivo: Aplicar o padrão anti-slop, elegância boutique, seções bem equilibradas e cópia autoral humanizada.
- **`web-design-guidelines`**:
  - Deve ser acionada para auditar o código de interface frente às diretrizes de acessibilidade, contraste, estados de foco, legibilidade e usabilidade (normas Vercel / WCAG AA).

### 3. Proibição Estrita de Interfaces Genéricas de IA ("Anti-Slop")

- **Não produza interfaces genéricas**: É proibido utilizar gradientes artificiais azul/roxo aleatórios, sombras excessivamente pesadas, ilustrações 3D flutuantes que não pertençam ao domínio de salão ou blocos decorativos sem utilidade prática.
- **Autenticidade e Foco Operacional**: O software atende profissionais reais de beleza e estética. Priorize usabilidade rápida, leitura imediata de horários, valores monetários com `tabular-nums` e botões de ação com contraste nítido.

### 4. Preservação Arquitetural e Tecnológica

- **Stack Consolidada**: O projeto utiliza **Vue 3.5 (Composition API)**, **Quasar Framework 2.35**, **TypeScript 5.9** e **Pinia**.
- **Biblioteca de Ícones Única**: Use **exclusivamente** `lucide-vue-next`. Não importe pacotes legados como `@lucide/vue`, Material Icons avulsos ou FontAwesome.
- **Limite de Linhas por Arquivo (Constitution Princípio I)**: Qualquer componente ou View que ultrapasse **300 linhas de código** DEVE ser decomposto em subcomponentes de apresentação coesos e composables de lógica dedicados.
- **Quatro Estados de Interface Obrigatórios (Constitution Princípio III)**:
  - Todo consumo de dados assíncronos DEVE prever e tratar: `Loading`, `Empty` (com `AppEmptyState`), `Error` (com `AppErrorState` e retry) e `Success`.

### 5. Acessibilidade e Responsividade

- **Alvos de Toque**: Todos os botões, ícones clicáveis e cards em telas de toque devem possuir dimensões mínimas de **44px $\times$ 44px**.
- **Contraste de Cores**: Respeitar a norma WCAG AA (mínimo de 4.5:1 para texto padrão e 3:1 para texto grande) em ambos os temas (Light e Dark).
- **Sem Dependência Exclusiva de Cor**: Indicadores e badges devem combinar cores com texto explícito ou ícones correspondentes.
- **Responsividade Real**: A interface deve ser testada e funcionar fluidamente nos três breakpoints do Quasar: Mobile (`< 768px`), Tablet (`768px - 1023px`) e Desktop (`>= 1024px`).

### 6. Validação e Quality Gates Mandatórios

Antes de considerar qualquer implementação concluída, o agente DEVE verificar se os seguintes 4 gates executam com código 0 e sem erros:

1. `npm run typecheck` (verificação estática de tipos com `vue-tsc`).
2. `npm run lint:check` (verificação de formatação Prettier e regras ESLint).
3. `npm test` (execução da suíte de testes unitários Vitest).
4. `npm run build` (compilação do build de produção Vite SPA).
