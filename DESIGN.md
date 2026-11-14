# Salon Manager — Design System & Visual Guidelines

**Versão**: 2.0.0  
**Status**: Oficial  
**Padrão Estético**: Editorial High-Contrast & Fashion  
**Público-Alvo**: Recepcionistas, gerentes, proprietários e profissionais de beleza e bem-estar de alto padrão

---

## 1. Filosofia e Identidade Visual

O **Salon Manager** adota a linguagem visual **Editorial High-Contrast & Fashion**. Inspirada nas grandes publicações de moda de vanguarda (Vogue, Harper's Bazaar, Dazed) e no design de software de alta precisão (Linear, Raycast), a interface substitui degradês corporativos genéricos por uma estética gráfica pura, contrastada e refinada.

### Pilares Fundamentais:

1. **Alto Impacto Monocromático & Carmim Fashion**: A base gráfica é construída sobre o contraste definitivo entre o **Preto Ônix** (`#09090B`) e o **Branco Puro** (`#FFFFFF`), pontuada intencionalmente pelo vibrante **Carmim Fashion** (`#E11D48`) em momentos estratégicos de ação e destaque.
2. **Bordas Estruturais Geométricas (Anti-Slop)**: Rejeitamos sombras pesadas difusas e bordas plásticas. Toda a hierarquia de profundidade é definida por linhas arquitetônicas precisas de `1px` (`#E4E4E7` no Light e `#27272A` no Dark).
3. **Tipografia de Passarela**: Títulos imponentes com tracking compacto (`-0.025em`), legendas refinadas em caixa alta espaçada (`0.04em`) e métricas numéricas tabulares (`tabular-nums`) para leitura instantânea de faturamento e agendamentos.
4. **Respeito aos Quatro Estados de Interface (NON-NEGOTIABLE)**: Toda listagem, tabela, modal ou seção assíncrona deve prever e tratar obrigatoriamente: _Carregamento_, _Vazio_ (`AppEmptyState`), _Erro com Ação_ (`AppErrorState`) e _Sucesso_.

---

## 2. Paleta de Cores e Tokens Semânticos

A paleta é orientada a contraste extremo e legibilidade impecável sob qualquer condição de luminosidade.

### 2.1. Cores Institucionais e Acento Fashion

| Token SCSS   | Valor HEX |                             Amostra                             | Finalidade                                                                                             |
| :----------- | :-------- | :-------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------- |
| `$primary`   | `#09090B` | ![#09090B](https://via.placeholder.com/15/09090B/000000?text=+) | **Preto Ônix**: Cor primária de impacto, botões principais de ação, cabeçalhos de alta presença.       |
| `$secondary` | `#E11D48` | ![#E11D48](https://via.placeholder.com/15/E11D48/000000?text=+) | **Carmim Fashion**: Acento de passarela/moda, seletores ativos, badges de alta prioridade e conversão. |
| `$accent`    | `#71717A` | ![#71717A](https://via.placeholder.com/15/71717A/000000?text=+) | **Cinza Neutro / Zinc**: Destaques terciários, divisores e ícones secundários.                         |

### 2.2. Cores Semânticas de Negócio

| Token SCSS  | Valor HEX |                             Amostra                             | Significado no Sistema                                                                          |
| :---------- | :-------- | :-------------------------------------------------------------: | :---------------------------------------------------------------------------------------------- |
| `$positive` | `#10B981` | ![#10B981](https://via.placeholder.com/15/10B981/000000?text=+) | **Sucesso**: Receitas financeiras, status `CONCLUIDO`, confirmações e saldo positivo.           |
| `$negative` | `#E11D48` | ![#E11D48](https://via.placeholder.com/15/E11D48/000000?text=+) | **Perigo / Erro**: Despesas financeiras, cancelamentos, status `CANCELADO` e ações destrutivas. |
| `$info`     | `#09090B` | ![#09090B](https://via.placeholder.com/15/09090B/000000?text=+) | **Informativo / Neutro**: Status `AGENDADO`, avisos estruturais e metadados.                    |
| `$warning`  | `#F59E0B` | ![#F59E0B](https://via.placeholder.com/15/F59E0B/000000?text=+) | **Atenção**: Status `EM_ATENDIMENTO`, pendências operacionais e alertas.                        |

### 2.3. Cores Semânticas da Grade de Agendamentos

| Status           | Cor de Destaque                    | Borda Indicadora    | Estilo Visual do Card                  |
| :--------------- | :--------------------------------- | :------------------ | :------------------------------------- |
| `AGENDADO`       | `#71717A` (Neutro Zinc)            | `3px solid #71717A` | Borda limpa, fundo neutro sutil        |
| `CONFIRMADO`     | `#09090B` (Preto / Alto Contraste) | `3px solid #09090B` | Tipografia em destaque com badge limpo |
| `EM_ATENDIMENTO` | `#F59E0B` (Âmbar Fashion)          | `3px solid #F59E0B` | Fundo suave com texto em âmbar escuro  |
| `CONCLUIDO`      | `#10B981` (Esmeralda)              | `3px solid #10B981` | Ícone de checagem e acento verde       |
| `CANCELADO`      | `#E11D48` (Carmim)                 | `3px solid #E11D48` | Fundo esmaecido com texto riscado      |
| `NAO_COMPARECEU` | `#6B7280` (Grafite)                | `3px solid #6B7280` | Card acinzentado discreto              |
| **BLOQUEIO**     | `#27272A` (Hachurado Neutro)       | `3px solid #27272A` | Fundo com textura geométrica discreta  |

### 2.4. Superfícies e Modo Escuro (Dark Mode)

| Superfície                     | Light Mode             | Dark Mode (`body.body--dark`) |
| :----------------------------- | :--------------------- | :---------------------------- |
| **Fundo da Página**            | `#FFFFFF` ou `#FAFAFA` | `#09090B`                     |
| **Fundo de Cards / Modais**    | `#FFFFFF`              | `#121214`                     |
| **Fundo de Cards Secundários** | `#F4F4F5`              | `#18181B`                     |
| **Bordas Estruturais**         | `1px solid #E4E4E7`    | `1px solid #27272A`           |
| **Texto Primário**             | `#09090B`              | `#F4F4F5`                     |
| **Texto Secundário / Legenda** | `#71717A`              | `#A1A1AA`                     |

---

## 3. Tipografia Editorial

A família tipográfica oficial exclusiva é **Plus Jakarta Sans** (Google Fonts).

### 3.1. Escala Tipográfica e Hierarquia

| Estilo / Classe  | Tamanho |      Peso       | Line-Height | Tracking / Espaçamento | Uso Recomendado                        |
| :--------------- | :-----: | :-------------: | :---------: | :--------------------: | :------------------------------------- |
| `text-display`   |  32px   | Extra-Bold(800) |    1.15     |       `-0.03em`        | Títulos Hero e aberturas de tela       |
| `text-h5`        |  24px   |   Bold (700)    |    1.25     |       `-0.025em`       | Títulos de seções principais           |
| `text-subtitle1` |  16px   | Semi-Bold (600) |    1.35     |       `-0.015em`       | Títulos de modais e cabeçalhos de card |
| `text-body1`     |  14px   |  Regular (400)  |     1.5     |         `0em`          | Texto operacional e formulários        |
| `text-caption`   |  11px   | Semi-Bold (600) |     1.4     |       `+0.04em`        | Metadados de luxo, tags e legendas     |

### 3.2. Formatação Numérica e Financeira

- Valores monetários e indicadores de performance DEVEM utilizar `font-variant-numeric: tabular-nums` e peso `700`.
- Títulos de grande escala utilizam a classe utilitária `.editorial-title` com `letter-spacing: -0.025em`.

---

## 4. Escala de Espaçamento e Alinhamento

Grade modular de **4px e 8px**:

| Token | Valor | Utilização                                                      |
| :---: | :---: | :-------------------------------------------------------------- |
| `xs`  |  4px  | Gaps entre ícones e rótulos curtos                              |
| `sm`  |  8px  | Paddings internos de inputs, espaçamento entre botões           |
| `md`  | 16px  | Espaçamento padrão entre campos de formulário e margens de card |
| `lg`  | 24px  | Espaçamento entre seções de página (`q-pa-lg`)                  |
| `xl`  | 32px  | Separação entre módulos autônomos de conteúdo                   |

---

## 5. Bordas, Elevação e Microinterações

### 5.1. Raio de Arredondamento (Border Radius)

- **Inputs, Botões e Seletores**: `8px` (`border-radius: 8px`).
- **Cards, Diálogos e Modais**: `12px` (`border-radius: 12px`).
- **Etiquetas e Badges Editoriais**: `6px` (`border-radius: 6px`).

### 5.2. Elevação e Sombras

O padrão editorial rejeita o excesso de sombras. O contorno e contraste é obtido via bordas:

```scss
// Padrão de Card Editorial
.q-card {
  border-radius: 12px;
  border: 1px solid #e4e4e7;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    border-color: #d4d4d8;
  }
}

body.body--dark .q-card {
  border: 1px solid #27272a;
  box-shadow: none;

  &:hover {
    border-color: #3f3f46;
  }
}
```

---

## 6. Componentes de Interface e Formulários

### 6.1. Biblioteca Oficial de Ícones

- Biblioteca exclusiva: **Lucide Icons** (`lucide-vue-next`).
- É proibido o uso de `@lucide/vue`, `<i class="material-icons">` ou FontAwesome.

### 6.2. Botões (`q-btn`)

- **Botão Primário**: `unelevated color="primary" no-caps` (Preto Ônix no Light / Branco Titânio no Dark).
- **Botão de Destaque Fashion**: `unelevated color="secondary" no-caps` (Carmim Fashion `#E11D48`).
- **Botão Secundário / Outline**: `outline color="primary" no-caps` com borda fina de 1px.
- **Botão Terciário**: `flat color="grey-7" no-caps`.
- **Acessibilidade**: Alvo de clique mínimo de **44px $\times$ 44px**.

### 6.3. Formulários (`q-input`, `q-select`)

- Padrão visual: `outlined`, `dense`, com `border-radius: 8px`.
- Rótulos claros com asterisco em campos obrigatórios (`Nome do Cliente *`).
- Ícones Lucide anexados no slot `#prepend`.
- Foco nítido com borda contrastada (`#09090B` no Light / `#E11D48` no Dark).

---

## 7. Os Quatro Estados Obrigatórios de Interface (NON-NEGOTIABLE)

Todo fluxo assíncrono deve apresentar:

1. **Loading State**: `q-spinner-tail color="primary"` ou `q-skeleton` contextuais.
2. **Empty State**: Componente [`AppEmptyState`](file:///home/debhg/Projetos/salon-manager-frontend/src/components/common/AppEmptyState.vue) com ícone minimalista e botão de ação primária.
3. **Error State**: Componente [`AppErrorState`](file:///home/debhg/Projetos/salon-manager-frontend/src/components/common/AppErrorState.vue) com mensagem humanizada e botão de retentativa.
4. **Success State**: Exibição estruturada dos dados com leitura fluida e contrastes WCAG AA.

---

## 8. Diretrizes de Acessibilidade (WCAG AA) e Responsividade

- **Contraste de Cores**: Relação mínima de **4.5:1** para textos normais e **3:1** para textos grandes em ambos os temas.
- **Não Depender Apenas de Cor**: Indicadores e badges combinam cores com texto explícito ou ícones.
- **Alvos de Toque (Touch Targets)**: Dimensões mínimas de **44px $\times$ 44px**.
- **Breakpoints**: Mobile (`< 768px`), Tablet (`768px - 1023px`), Desktop (`>= 1024px`).
