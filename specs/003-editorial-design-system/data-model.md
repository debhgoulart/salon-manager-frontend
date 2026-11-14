# Data Model: Reconfiguração Editorial Fashion do Design System

**Feature**: `003-editorial-design-system`  
**Date**: 2026-11-14  
**Status**: Completed

---

## 1. Design Token Entities & Architecture

Este documento formaliza as estruturas de dados, contratos de estilo e entidades de tokens visuais que governam a estética _Editorial High-Contrast & Fashion_ no Salon Manager.

### 1.1 Color Tokens Schema (`ThemePalette`)

A aplicação suporta dois modos operacionais (`light` e `dark`), ambos baseados em contraste geométrico e acento Carmim Fashion:

```typescript
export interface ColorTokenDef {
  raw: string; // Valor hexadecimal ou HSL
  cssVar: string; // Nome da variável CSS correspondente (ex: --color-primary)
  description: string;
  wcagContrastRatio: string; // Razão de contraste mínima garantida contra fundo base
}

export interface EditorialThemePalette {
  mode: 'light' | 'dark';
  primary: ColorTokenDef; // Preto Ônix (#09090B) no Light / Titânio (#F4F4F5) no Dark
  secondary: ColorTokenDef; // Carmim Fashion (#E11D48) - constante em ambos os modos
  accent: ColorTokenDef; // Cinza Neutro Nobre (#71717A no Light / #A1A1AA no Dark)
  background: {
    page: ColorTokenDef; // #FFFFFF (Light) / #09090B (Dark)
    surface: ColorTokenDef; // #FAFAFA (Light) / #121214 (Dark)
    elevated: ColorTokenDef; // #FFFFFF (Light) / #18181B (Dark)
  };
  border: {
    subtle: ColorTokenDef; // #E4E4E7 (Light) / #27272A (Dark)
    strong: ColorTokenDef; // #D4D4D8 (Light) / #3F3F46 (Dark)
    focus: ColorTokenDef; // #09090B (Light) / #E11D48 (Dark)
  };
  text: {
    primary: ColorTokenDef; // #09090B (Light) / #F4F4F5 (Dark)
    secondary: ColorTokenDef; // #52525B (Light) / #A1A1AA (Dark)
    muted: ColorTokenDef; // #71717A (Light) / #71717A (Dark)
    inverse: ColorTokenDef; // #FFFFFF (Light) / #09090B (Dark)
  };
  semantic: {
    success: ColorTokenDef; // #10B981 (Esmeralda)
    warning: ColorTokenDef; // #F59E0B (Âmbar)
    error: ColorTokenDef; // #E11D48 (Carmim Fashion) ou #EF4444
    info: ColorTokenDef; // #09090B no Light / #38BDF8
  };
}
```

---

## 2. Typography Token Specification

Definições de escala, peso, espaçamento e variantes numéricas para o layout editorial:

```typescript
export interface TypographyToken {
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  letterSpacing: string;
  textTransform?: 'uppercase' | 'none';
  fontFeatureSettings?: string;
}

export interface EditorialTypographySystem {
  display: TypographyToken; // 32px / 1.15 / 800 / -0.03em (Títulos Hero)
  headline: TypographyToken; // 24px / 1.25 / 700 / -0.025em (Cabeçalhos de Seção)
  title: TypographyToken; // 18px / 1.3 / 600 / -0.015em (Subtítulos de Módulos)
  body: TypographyToken; // 14px / 1.5 / 400 / 0em (Texto Corrido Operacional)
  caption: TypographyToken; // 11px / 1.4 / 600 / 0.05em / uppercase (Metadados de Moda)
  kpiNumber: TypographyToken; // 28px / 1.1 / 700 / -0.02em / 'tnum' (Métricas Financeiras)
}
```

---

## 3. Component Variant Mappings

Mapeamento visual para os componentes reutilizáveis da aplicação sob a estética editorial:

### 3.1 `AppStatCard`

- **Estrutura**: Fundo de superfície plana (`surface`), borda de `1px solid border.subtle`, raio de borda `8px`.
- **Métrica**: Destaque com `kpiNumber` e `tabular-nums`.
- **Ícone**: Minimalista monocromático ou com sutil detalhe Carmim Fashion.
- **Microinteração**: Hover sutil com transição de borda para `border.strong` (`transition: border-color 0.2s ease`).

### 3.2 `AppStatusBadge`

- **Estrutura**: Borda fina de `1px`, raio de borda `6px`, padding compacto (`2px 8px`).
- **Variantes**:
  - `AGENDADO`: Fundo neutro suave com texto escuro e borda neutra.
  - `CONFIRMADO`: Borda e texto Esmeralda (`#10B981`) sobre fundo translúcido sutil.
  - `EM_ANDAMENTO`: Borda e texto Carmim Fashion (`#E11D48`) sobre fundo translúcido.
  - `CONCLUIDO`: Fundo neutro com ícone de checagem.
  - `CANCELADO`: Fundo neutro esmaecido com texto riscado ou muted.

### 3.3 `AppFormDialog` e `AppConfirmDialog`

- **Estrutura**: Superfície modal com raio de borda `12px`, borda perimetral de `1px solid border.subtle`, sem sombras blur exageradas.
- **Botões de Ação**: Botão de confirmação primário em Preto Ônix (ou Carmim Fashion para ações destrutivas/críticas), botão secundário em contorno outline neutro.
- **Acessibilidade**: Alvo de toque mínimo de `44px` de altura nos botões.

### 3.4 `AppHeader` e `AppSidebar`

- **Sidebar**: Fundo sólido (`#09090B` no dark ou `#FFFFFF` no light), largura 260px, linha divisória vertical de `1px solid border.subtle`. Links de navegação com padding de 12px, ícones Lucide de 20px, item ativo com destaque preto sólido (light) ou branco (dark) e detalhe Carmim.
- **Header**: Fundo com transparência sutil (`backdrop-filter: blur(8px)`), linha divisória horizontal inferior de `1px solid border.subtle`, botões de perfil e alternância de tema arredondados e precisos.
