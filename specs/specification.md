# Especificação Funcional e Técnica — Salon Manager Frontend
**Documento:** `/speckit.specify`  
**Versão:** 1.0.0  
**Data:** 2026-11-09  
**Status:** Proposto para Aprovação  
**Repositório:** `salon-manager-frontend`  
**Backend Vinculado:** `salon-manager-backend` (`http://localhost:8080`)

---

## 1. Visão Geral e Objetivos do Sistema

O **Salon Manager Frontend** é uma aplicação web Single Page Application (SPA) construída com **Vue 3, Quasar Framework v2 e TypeScript**, proporcionando uma experiência de gestão ágil, elegante e profissional para salões de beleza, barbearias e clínicas estéticas.

### 1.1 Premissas Fundamentais
1. **Frontend Desacoplado:** Toda lógica de negócio definitiva, regras financeiras, cálculos de comissões e concorrência residem exclusivamente na API Spring Boot.
2. **Histórico Limpo de URLs:** Roteamento com `vueRouterMode: 'history'` (HTML5 History API) com fallback adequado.
3. **Identidade Visual Premium:** Cores institucionais **Vinho Nobre (`#7B3F61`)** e **Champagne Dourado (`#C59B6D`)**, com suporte completo a Modo Claro e Modo Escuro persistido.
4. **Resiliência e Feedback Imediato:** Mapeamento integral da **RFC 7807** (`ProblemDetails`) com validação nos formulários Quasar e diálogo de confirmação para ações destrutivas.

---

## 2. Perfis de Acesso e Matriz de Autorização (RBAC)

O sistema respeita os quatro papéis emitidos pelo JWT do backend:

| Papel | Descrição | Telas e Recursos Permitidos |
|---|---|---|
| **`ROLE_ADMIN`** | Administrador Geral | Acesso irrestrito a todos os módulos, configurações, fechamento contábil e auditoria. |
| **`ROLE_MANAGER`** | Gerente Operacional | Dashboard, Agenda, Clientes, Funcionários, Serviços, Financeiro, Comissões e Fechamento. |
| **`ROLE_RECEPTIONIST`** | Recepcionista | Dashboard (visão operacional), Agenda completa e Gestão de Clientes. |
| **`ROLE_PROFESSIONAL`** | Profissional / Cabeleireiro | Agenda própria e Extrato pessoal de comissões. |

---

## 3. Especificação Detalhada por Módulo

---

### Módulo 1: Autenticação & Gestão de Sessão (`/login`)
- **Objetivo:** Garantir acesso seguro via JWT com renovação automática de credenciais.
- **Interface e Elementos:**
  - Card centralizado estilizado em `AuthLayout.vue`.
  - Campos: E-mail (`QInput` com validação de formato) e Senha (`QInput` com toggle de visibilidade).
  - Botão de submissão com estado de carregamento (`:loading`).
  - Alerta de erro inline em caso de credenciais incorretas (status 401).
- **Regras Técnicas e Integração:**
  - Endpoint de Login: `POST /api/auth/login` (`{ email, password }`).
  - Armazena `accessToken` (2h) e `refreshToken` (7d) na store Pinia `useAuthStore` e persiste no `localStorage` sob chave segura.
  - Interceptor HTTP renova o token automaticamente ao detectar 401 através de `POST /api/auth/refresh`. Se o refresh falhar, o usuário é deslogado e encaminhado a `/login`.
  - Navigation Guard bloqueia rotas autenticadas e redireciona usuários logados caso tentem acessar `/login`.

---

### Módulo 2: Painel Administrativo / Dashboard (`/`)
- **Objetivo:** Fornecer visão executiva consolidada em tempo real sobre desempenho financeiro e operacional.
- **Interface e Elementos:**
  - Filtro superior de período (`AppDateFilter`: Mês Atual, Últimos 30 dias, Período Customizado).
  - 4 Cards de Métricas (`AppStatCard`):
    1. **Faturamento Total** (R$): Somatório das receitas do período.
    2. **Despesas Operacionais** (R$): Somatório das saídas financeiras.
    3. **Comissões Previstas/Pagas** (R$): Total devido aos colaboradores.
    4. **Resultado Líquido** (R$): Faturamento menos despesas e comissões, com cor dinâmica (verde se positivo, coral se negativo).
  - 4 Contadores Rápidos: Agendamentos concluídos, cancelados, clientes ativos e colaboradores em atividade.
  - Gráficos Interativos (ApexCharts):
    - *Tendência Financeira:* Gráfico de área/linha comparando Receitas vs. Despesas ao longo do tempo.
    - *Ranking de Serviços:* Gráfico de barras horizontais com os 5 serviços mais demandados e rentáveis.
  - Seções de Acompanhamento:
    - Ranking dos profissionais de maior faturamento (`top-employees`).
    - Lista rápida dos próximos atendimentos da agenda (`upcoming-appointments`).
- **Endpoints Consumidos:**
  - `GET /api/v1/dashboard/overview?startDate=&endDate=`
  - `GET /api/v1/dashboard/top-services?startDate=&endDate=&limit=5`
  - `GET /api/v1/dashboard/top-employees?startDate=&endDate=&limit=5`
  - `GET /api/v1/dashboard/upcoming-appointments?limit=5`

---

### Módulo 3: Agenda & Motor de Horários (`/agenda`)
- **Objetivo:** Gerenciar horários de atendimento, prevenir sobreposições e conduzir o ciclo de vida dos atendimentos.
- **Interface e Elementos:**
  - Visualização em modos: **Visão Diária** e **Visão Semanal**.
  - Barra de navegação com seletor de data (`QDate` popup) e botões de avanço/retrocesso ("Hoje", "Anterior", "Próximo").
  - Filtro por Profissional (`QSelect` com lista de funcionários ativos ou "Todos").
  - Grade horária com indicação visual de status por cor:
    - `AGENDADO`: Azul Petróleo (`#457B9D`)
    - `CONFIRMADO`: Vinho Suave (`#7B3F61`)
    - `EM_ATENDIMENTO`: Ouro Queimado (`#E9C46A`)
    - `CONCLUIDO`: Verde Esmeralda (`#2A9D8F`)
    - `CANCELADO`: Cinza/Coral Riscado (`#E76F51`)
    - `NAO_COMPARECEU`: Roxo Escuro
  - Modal de Criação/Edição de Agendamento (`AppFormDialog`):
    - Seleção de Cliente com busca integrada.
    - Seleção de Serviço (com exibição automática do preço e duração).
    - Seleção de Funcionário.
    - Seleção de Data e Horário com consulta reativa de slots vagos.
    - Campo de Observações.
- **Regras Técnicas e Integração:**
  - Antes de confirmar um novo horário, o frontend consulta `GET /api/v1/appointments/available-slots?employeeId=&date=&serviceId=` para listar apenas horários livres.
  - Criação: `POST /api/v1/appointments` (`AppointmentCreateRequest`).
  - Transições de Estado:
    - `PATCH /api/v1/appointments/{id}/status` com `{ "status": AppointmentStatus }`.
  - Tratamento de Conflito: Resposta 409 (`AppointmentCollisionException`) exibe mensagem explícita alertando sobre ocupação simultânea.

---

### Módulo 4: Gestão de Clientes (`/clientes`)
- **Objetivo:** Cadastrar, buscar e manter o histórico de relacionamento com os clientes.
- **Interface e Elementos:**
  - Tabela responsiva com paginação servidor (`AppDataTable`): Nome, E-mail, Telefone, CPF, Status e Ações.
  - Barra de ferramentas com busca textual debounced (`AppSearchInput`) por nome, telefone ou CPF.
  - Modal de Cadastro/Edição (`ClientFormDialog`):
    - Validação de CPF (máscara `###.###.###-##` e validação de dígitos).
    - Validação de Telefone (máscara `(##) #####-####`).
    - Campo de observações e histórico de alergias/preferências.
  - Gaveta/Modal de Detalhes do Cliente:
    - Ficha de dados cadastrais.
    - Histórico paginado dos serviços já realizados e agendamentos anteriores.
  - Ação de Inativação / Reativação com `AppConfirmDialog`.
- **Endpoints Consumidos:**
  - `GET /api/v1/clients?query=&page=&size=`
  - `POST /api/v1/clients`
  - `PUT /api/v1/clients/{id}`
  - `DELETE /api/v1/clients/{id}`
  - `PATCH /api/v1/clients/{id}/activate`
  - `GET /api/v1/clients/{id}/appointments`

---

### Módulo 5: Gestão de Profissionais / Funcionários (`/funcionarios`)
- **Objetivo:** Manter a equipe de especialistas do salão e suas respectivas comissões contratuais.
- **Interface e Elementos:**
  - Tabela com colunas: Nome, Cargo/Especialidade, Contato, CPF, Taxa de Comissão Padrão (%), Status (Ativo/Inativo) e Ações.
  - Filtro por status (Todos, Ativos, Inativos).
  - Modal de Cadastro/Edição:
    - Campos obrigatórios com regras de validação.
    - Campo de percentual de comissão padrão (`defaultCommissionRate`: 0% a 100%).
  - Confirmação de desativação lógica (soft-delete).
- **Endpoints Consumidos:**
  - `GET /api/v1/employees?active=&page=&size=`
  - `POST /api/v1/employees`
  - `PUT /api/v1/employees/{id}`
  - `DELETE /api/v1/employees/{id}`
  - `PATCH /api/v1/employees/{id}/activate`

---

### Módulo 6: Catálogo de Serviços (`/servicos`)
- **Objetivo:** Gerenciar o portfólio de serviços, tempos de execução e valores praticados.
- **Interface e Elementos:**
  - Tabela/Cards com: Nome, Duração (minutos formatados, ex.: `45 min`, `1h 30min`), Preço (R$), Comissão Diferenciada (se houver) e Status.
  - Modal de Cadastro/Edição:
    - Nome do serviço.
    - Descrição detalhada.
    - Preço (`QInput` com máscara monetária BRL).
    - Duração em minutos (`QInput` numérico com step de 15 min).
    - Taxa de comissão específica opcional (`customCommissionRate`): se preenchida, sobrepõe a taxa geral do funcionário na regra do backend.
- **Endpoints Consumidos:**
  - `GET /api/v1/services?active=&page=&size=`
  - `POST /api/v1/services`
  - `PUT /api/v1/services/{id}`
  - `DELETE /api/v1/services/{id}`
  - `PATCH /api/v1/services/{id}/activate`

---

### Módulo 7: Gestão Financeira (`/financeiro`)
- **Objetivo:** Controlar o fluxo de caixa, separando receitas e despesas operacionais, com proteção de integridade contábil.
- **Interface e Elementos:**
  - Indicadores no topo: Total de Entradas, Total de Saídas e Saldo Líquido do período filtrado.
  - Abas ou seletor de tipo: Todas, Receitas (`INCOME`) e Despesas (`EXPENSE`).
  - Tabela de Lançamentos com indicação visual por tipo (ícone e badge verde para receita, vermelho para despesa).
  - Modal de Novo Lançamento:
    - Tipo: Receita ou Despesa.
    - Categoria (ex.: Produtos, Aluguel, Água/Luz, Venda de Cosmético, Manutenção).
    - Descrição.
    - Valor (R$).
    - Forma de Pagamento (`DINHEIRO`, `PIX`, `CARTAO_CREDITO`, `CARTAO_DEBITO`).
    - Data do lançamento.
- **Regras Técnicas e Integração:**
  - Criação: `POST /api/v1/financial/transactions`.
  - Resumo: `GET /api/v1/financial/summary?startDate=&endDate=`.
  - Proteção de Mês Fechado: Se o backend retornar `409 Conflict` (`ClosedPeriodException`), o frontend impede a edição/inserção e exibe banner informando que o período contábil do lançamento já se encontra encerrado.

---

### Módulo 8: Extrato de Comissões (`/comissoes`)
- **Objetivo:** Fornecer transparência no repasse aos profissionais, com extrato detalhado de atendimentos e percentuais.
- **Interface e Elementos:**
  - Filtros: Seleção de Profissional, Período de datas e Status (`PENDING` ou `PAID`).
  - Cards de Resumo: Total de Comissões Pendentes, Total Pago e Quantidade de Atendimentos comissionados.
  - Tabela com colunas: Profissional, Data/Horário, Serviço Prestado, Valor do Serviço, Taxa Aplicada (%), Valor da Comissão e Status de Pagamento.
- **Endpoints Consumidos:**
  - `GET /api/v1/commissions?employeeId=&status=&startDate=&endDate=&page=&size=`
  - `GET /api/v1/commissions/summary?startDate=&endDate=`

---

### Módulo 9: Fechamento Contábil Mensal (`/fechamento`)
- **Objetivo:** Consolidar e travar o faturamento, despesas e comissões de um determinado mês de competência com auditoria.
- **Interface e Elementos:**
  - Seletor de Competência (Mês e Ano).
  - Painel de Simulação/Prévia (`/calculate`):
    - Apresenta faturamento bruto apurado, despesas somadas, total de comissões calculadas e resultado final do salão.
    - Tabela por Colaborador: Atendimentos realizados, volume financeiro gerado e total de comissão devido.
  - Botão de Ação "Efetuar Fechamento Mensal" com diálogo de confirmação solene e campo opcional de notas (`notes`).
  - Histórico de Fechamentos Anteriores com badge de status (`OPEN`, `CLOSED`, `REOPENED`).
  - Ação de Reabertura (`/reopen`): Disponível para Administradores, exigindo obrigatoriamente preenchimento de justificativa de auditoria (`auditNotes`).
- **Endpoints Consumidos:**
  - `GET /api/v1/closings?year=&status=`
  - `GET /api/v1/closings/{id}`
  - `GET /api/v1/closings/calculate?year=&month=`
  - `POST /api/v1/closings/close` (`{ year, month, notes }`)
  - `POST /api/v1/closings/{id}/reopen` (`{ auditNotes }`)

---

### Módulo 10: Configurações & Preferências (`/configuracoes`)
- **Objetivo:** Personalização de preferências visuais e dados cadastrais.
- **Interface e Elementos:**
  - Card de Perfil do Usuário autenticado (Nome, E-mail, Papel).
  - Alternância de Tema: Botão de alternância Modo Claro / Modo Escuro com persistência imediata.
  - Preferências de exibição da agenda (intervalo de visualização: 15 min, 30 min, 60 min).
  - Informações de versão e status da conexão com a API backend (`/actuator/health`).

---

## 4. Padrões de Qualidade e Critérios de Aceite

1. **Navegação & Roteamento:** Todas as URLs devem ser limpas (`history mode`), sem recarregamento de página.
2. **Responsividade:** O layout deve colapsar o drawer lateral em telas `< 1024px` e disponibilizar gaveta com swipe/touch em dispositivos móveis.
3. **Formatação de Moeda:** Toda exibição monetária deve seguir a máscara brasileira `R$ 0,00`.
4. **Resguardo de Erros:** Qualquer falha na API deve emitir notificação flutuante com cor e ícone semânticos (`QNotify`) ou destacar o campo do formulário com a mensagem de `invalidParams`.

---

## 5. Próximo Passo do Spec Kit

Com a aprovação deste documento de especificação funcional, prosseguiremos para a etapa **`/speckit.clarify`** (esclarecimento de pontos de refinamento) ou diretamente para **`/speckit.plan`** (plano de implementação detalhado e arquitetura de componentes).
