# Quickstart & Validation Guide: Codebase Stabilization & Quality Baseline

**Feature**: `001-codebase-stabilization`  
**Date**: 2026-11-14

Este guia apresenta o roteiro prático e determinístico para validar ponta a ponta as melhorias de qualidade, segurança e infraestrutura da feature.

---

## 1. Pré-requisitos

- **Node.js**: Versão `>= 20` (recomendado v22 ou v24)
- **NPM**: Gerenciador padrão
- **Repositório**: Branch `001-codebase-stabilization`

---

## 2. Cenários de Validação

### Cenário 1: Validação do Script de Checagem de Formatação e Lint

**Objetivo**: Garantir que o comando `npm run lint:check` verifique o código silenciosamente e termine com sucesso sem despejar centenas de milhares de linhas no terminal.

**Comando**:

```bash
npm run lint:check
```

**Resultado Esperado**:

- O comando executa em menos de 10 segundos.
- Nenhuma linha de código ou arquivo completo é impressa no `stdout`.
- O terminal exibe apenas mensagens de status das ferramentas e finaliza com código `0`.

---

### Cenário 2: Verificação de Dependências Unificadas de Ícones

**Objetivo**: Confirmar que a dependência redundante `@lucide/vue` foi removida e que apenas `lucide-vue-next` permanece.

**Comando**:

```bash
npm ls @lucide/vue lucide-vue-next
```

**Resultado Esperado**:

- `@lucide/vue` não é encontrado (`empty` / não instalado).
- `lucide-vue-next` está listado como dependência direta ativa.
- `npm run build` conclui sem erros de resolução de ícones.

---

### Cenário 3: Validação da Higienização da Tela de Login

**Objetivo**: Comprovar que o formulário de login inicia com os campos limpos, prevenindo submissões acidentais com credenciais padrão.

**Passos**:

1. Iniciar o servidor de desenvolvimento: `npm run dev` (ou `quasar dev`).
2. Abrir o navegador em `http://localhost:9000/#/login`.
3. Inspecionar visualmente os inputs de E-mail e Senha.

**Resultado Esperado**:

- Os inputs de **E-mail** e **Senha** estão completamente vazios.
- Clicar no botão "Entrar no Sistema" dispara as validações em linha exigindo o preenchimento de ambos os campos.

---

### Cenário 4: Execução da Suíte de Testes Automatizados (Vitest)

**Objetivo**: Validar a execução dos testes unitários cobrindo formatadores e guardas de rota.

**Comando**:

```bash
npm test
```

**Resultado Esperado**:

- A suíte do Vitest executa todos os arquivos de teste (`*.spec.ts`).
- 100% dos testes passam com status verde (`PASS`).
- Os testes cobrem:
  - `useFormatters`: formatação de moeda BRL, CPF, telefone e datas.
  - `guards`: redirecionamento de usuários deslogados para `/login` e bloqueio de rotas protegidas por papéis (RBAC).
  - `usePaginationTable`: cálculo de índices e sincronização com `PageResponse`.

---

### Cenário 5: Verificação de Conversão de Fuso Horário de Agendamento

**Objetivo**: Assegurar que agendamentos criados com horários locais não sofram distorção de fuso horário.

**Passos**:

1. Na Agenda (`/agenda`), abrir o modal "Novo Agendamento".
2. Preencher a data e horário (ex: `14:00`).
3. Inspecionar o payload gerado para a chamada de criação.

**Resultado Esperado**:

- O timestamp enviado converte o horário local do salão para o UTC equivalente via objeto `Date` real (`.toISOString()`), de modo que, ao ser lido de volta pelo navegador, exiba exatamente `14:00` no fuso da unidade.
