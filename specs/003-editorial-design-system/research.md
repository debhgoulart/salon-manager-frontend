# Research & Architectural Decisions: Reconfiguração Editorial Fashion do Design System

**Feature**: `003-editorial-design-system`  
**Date**: 2026-11-14  
**Status**: Completed

---

## 1. Seleção da Paleta de Cores e Identidade Fashion

### Contexto

O usuário selecionou a direção estética **Editorial High-Contrast & Fashion** (preto e branco de alto impacto, tipografia marcante estilo revista de moda e acento vibrante). O objetivo é posicionar o Salon Manager como uma ferramenta visualmente contemporânea, inspirada em publicações de moda de vanguarda (Vogue, Dazed) e plataformas de software com design de ponta (Linear, Raycast), distanciando-se de interfaces corporativas genéricas.

### Decisões Arquiteturais

1. **Base Monocromática de Alta Precisão**:
   - **Light Mode**: Fundo em Branco Puro (`#FFFFFF`) e superfícies secundárias em Off-White / Gelo (`#FAFAFA` e `#F4F4F5`). Textos e elementos primários em Preto Ônix (`#09090B`).
   - **Dark Mode**: Fundo em Preto Ônix Profundo (`#09090B`) e superfícies em Cinza Carvão Nobre (`#121214` e `#18181B`). Textos em Branco Titânio (`#F4F4F5`) e secundários em Cinza Neutro (`#A1A1AA`).
2. **Acento Vibrante Editorial: Carmim Fashion (`#E11D48`)**:
   - Um vermelho carmim de passarela / alta costura que evoca o universo estético (esmaltes, batom, desfiles de moda) sem sobrecarregar a tela. Utilizado em botões de ação principal, seletores ativos, badges de destaque e gráficos executivos.
3. **Bordas Estruturais Geométricas**:
   - Substituição de sombras pesadas por bordas ultrafinas de `1px solid #E4E4E7` (light) e `1px solid #27272A` (dark). Isso confere o acabamento lapidado característico do design editorial de ponta.

### Justificativa

- Garante máximo contraste e legibilidade imediata em ambientes de salão iluminados ou com luz baixa.
- Diferenciação visual absoluta frente a softwares tradicionais de salão (frequentemente carregados de degradês e roxos saturados).
- 100% aderente às diretrizes da `design-taste-frontend` (seções equilibradas, cópia autoral, ausência de clichês visuais).

---

## 2. Tipografia Editorial e Ajustes de Métrica

### Contexto

A tipografia de revista de moda se caracteriza por contrastes intencionais de escala: títulos expressivos e números monumentais em contraste com legendas pequenas e precisas.

### Decisões Arquiteturais

- **Família Oficial**: _Plus Jakarta Sans_ mantida para máxima legibilidade de tela e performance de renderização.
- **Tracking / Letter-Spacing**:
  - Títulos (`h4`, `h5`): `letter-spacing: -0.025em` para sensação editorial compacta e assertiva.
  - Legendas / Rótulos (`caption`): `letter-spacing: 0.04em` com `text-transform: uppercase` onde indicado para metadados de luxo.
  - Indicadores Numéricos: `tabular-nums` com peso 700 para leitura vertical impecável em painéis financeiros e tabelas de comissão.

---

## 3. Adaptação de Componentes e Quatro Estados de Interface

### Decisões Arquiteturais

- **`AppStatCard.vue`**: Redesenhado com fundo minimalista, borda nítida de 1px, número em tamanho monumental e badge de tendência discreto.
- **`AppStatusBadge.vue`**: Redesenhado com estética de etiqueta editorial: cantos arredondados sutis (4px a 6px), borda de 1px e texto de alta legibilidade.
- **`AppEmptyState.vue` e `AppErrorState.vue`**: Ícones Lucide minimalistas com tipografia editorial e botões de contraste preto/branco/carmim.
- **`LoginView.vue`**: Dividido com coluna editorial imponente, logotipo sofisticado e campos limpos sem distrações.
- **`AppHeader.vue` e `AppSidebar.vue`**: Navegação com perfil esbelto, linhas limpas e contraste sofisticado.
