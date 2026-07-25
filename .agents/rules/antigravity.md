---
trigger: always_on
---

# ANTIGRAVITY.md — Fonte Oficial de Conhecimento do AgendaMax

> [!IMPORTANT]
> **REGRAS PARA AGENTES DE IA / DESENVOLVEDORES:**
> 1. Sempre leia este arquivo (`ANTIGRAVITY.md`) antes de iniciar qualquer tarefa no projeto.
> 2. Sempre atualize este arquivo ao finalizar qualquer alteração relevante.
> 3. Nunca deixe informações desatualizadas. O arquivo deve refletir exatamente o estado real do código e da arquitetura.
> 4. Não remova informações importantes sem substituí-las por versões atualizadas.
> 5. Mantenha as seções de **Changelog** e **Próxima tarefa recomendada** sempre atualizadas.

---

## 1. Visão Geral

* **Nome do projeto:** AgendaMax
* **Objetivo:** Sistema SaaS completo de agendamento, gestão de clientes, funcionários, serviços, financeiro e relatórios, projetado para salões de beleza, barbearias, clínicas de estética e prestadores de serviços em geral.
* **Descrição do Sistema:** O AgendaMax oferece uma solução moderna e responsiva para gestão empresarial. Possui suporte multi-tenant (empresas isoladas), autenticação baseada em JWT com cookies HTTP-only, agendamento de serviços em visão de lista e calendário, relatórios estatísticos e gestão financeira (entradas/saídas). Também conta com modo de demonstração/mock em fallback quando o banco de dados não está conectado.
* **Público-alvo:** Proprietários de estabelecimentos, administradores, recepcionistas e profissionais de serviços.
* **Principais Funcionalidades:**
  - **Landing Page / Public Front:** Apresentação comercial do sistema com recursos, planos e CTA de cadastro.
  - **Autenticação & Multi-tenancy:** Login, cadastro de empresa/admin, recuperação de senha, sessão JWT segura em cookies HTTP-only (`agendamax_token`).
  - **Dashboard:** Métricas resumidas (faturamento, agendamentos do dia, novos clientes, taxa de ocupação), gráficos estatísticos e próximos agendamentos.
  - **Agenda / Calendário:** Visualização por dia, semana e mês dos agendamentos, status (Agendado, Confirmado, Concluído, Cancelado), busca por cliente/serviço/status e novo agendamento com cálculo automático de horário final.
  - **Gestão de Clientes:** CRUD de clientes com histórico de visitas, contatos e observações.
  - **Gestão de Funcionários:** Cadastro de membros da equipe com horários de expediente (`workStart`, `workEnd`), cargos, telefone e e-mail.
  - **Gestão de Serviços:** Cadastro de serviços com categoria, preço e duração em minutos.
  - **Módulo Financeiro:** Controle de fluxo de caixa (receitas e despesas), gráficos de receitas vs despesas, totalizadores e registro de transações.
  - **Relatórios:** Dashboards analíticos de desempenho financeiro, atendimentos por profissional, serviços mais vendidos e retenção.
  - **Configurações:** Edição de dados da empresa (nome, slug, telefone, e-mail, logo).
  - **Integração WhatsApp:** Disparo de lembretes e confirmações formatadas para WhatsApp Web/API.

---

## 2. Arquitetura

### Tecnologias e Frameworks
* **Core / Framework Web:** Next.js 14 (App Router, Server & Client Components) com React 18 e TypeScript.
* **Estilização:** Tailwind CSS 3, PostCSS, Autoprefixer, Lucide React (ícones), `clsx` e `tailwind-merge` para utilitários de classe.
* **Animações:** Framer Motion (`framer-motion`).
* **Gerenciamento de Estado:** Zustand (`zustand`) com sincronização de API e fallback de estado reativo local via `src/lib/store.ts`.
* **Banco de Dados:** PostgreSQL.
* **ORM:** Prisma ORM 5 (`@prisma/client`, `prisma`).
* **Autenticação & Segurança:** `jose` (JWT assinado), `bcryptjs` (hash de senhas), Cookies HTTP-only via Middleware do Next.js.
* **Manipulação de Datas:** `date-fns` v3.

### Estrutura de Pastas
```
agendamax/
├── .env.example
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── prisma/
│   └── schema.prisma          # Schema do banco PostgreSQL (Empresa, Usuário, Cliente, Staff, Serviço, Agendamento, Transação)
├── src/
│   ├── middleware.ts          # Middleware do Next.js protegendo rotas privadas e verificando JWT em cookies
│   ├── app/
│   │   ├── layout.tsx         # Root layout (ToastProvider, meta tags)
│   │   ├── page.tsx           # Landing Page principal do AgendaMax
│   │   ├── globals.css        # Estilos globais e componentes de utilidade Tailwind
│   │   ├── login/             # Página de login
│   │   ├── cadastrar/         # Página de cadastro de empresa/usuário admin
│   │   ├── recuperar-senha/   # Página de recuperação de senha
│   │   ├── dashboard/         # Dashboard principal com estatísticas e gráficos
│   │   ├── agenda/            # Gestão de agendamentos (lista e modal)
│   │   ├── clientes/          # Cadastro e listagem de clientes
│   │   ├── funcionarios/      # Gestão da equipe e expedientes
│   │   ├── servicos/          # Catálogo de serviços, durações e preços
│   │   ├── financeiro/        # Fluxo de caixa (entradas e saídas)
│   │   ├── relatorios/        # Visão analítica e métricas de desempenho
│   │   ├── configuracoes/     # Configurações da empresa
│   │   └── api/               # API Routes do Next.js
│   │       ├── agendamentos/   # REST API para agendamentos
│   │       ├── auth/          # endpoints login, register, me, logout
│   │       ├── clientes/      # REST API para clientes
│   │       ├── company/       # GET/PUT dados da empresa
│   │       ├── financeiro/    # REST API para transações financeiras
│   │       ├── funcionarios/  # REST API para membros do staff
│   │       ├── seed/          # Endpoint de populamento inicial de dados
│   │       └── servicos/      # REST API para serviços
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx     # Cabeçalho com perfil, seletores e modais
│   │   │   └── Sidebar.tsx    # Menu lateral de navegação e atalhos rápidos
│   │   └── ui/
│   │       ├── Badge.tsx      # Componente de tag/status colorido
│   │       ├── Modal.tsx      # Componente genérico de modal com animação Framer Motion
│   │       └── ToastManager.tsx # Sistema de notificações Toast
│   └── lib/
│       ├── auth.ts            # Funções auxiliares JWT (`verifyAuth`, `signToken`, `hashPassword`, `comparePasswords`)
│       ├── mock-data.ts       # Dados mock para demonstração / fallback offline
│       ├── prisma.ts          # Instância do PrismaClient
│       ├── store.ts           # Estado global Zustand (sync API + fallback mock)
│       ├── types.ts           # Interfaces TypeScript do domínio
│       ├── useToast.ts        # Hook global de mensagens Toast
│       └── whatsapp.ts        # Gerador de links de confirmação e lembretes para WhatsApp
```

---

## 3. Funcionalidades

| Funcionalidade | Localização | Descrição | Dependências | Status |
| :--- | :--- | :--- | :--- | :---: |
| **Landing Page** | `src/app/page.tsx` | Página inicial com apresentação comercial, lista de recursos, planos de preço e call to action | Lucide React, Framer Motion | ✅ Completa |
| **Autenticação (Login/Register/Logout)** | `src/app/login/page.tsx`, `src/app/cadastrar/page.tsx`, `src/app/api/auth/*` | Autenticação multi-tenant com hash de senha `bcryptjs` e cookie JWT seguro via Middleware | `jose`, `bcryptjs`, Prisma / Zustand | ✅ Completa |
| **Dashboard** | `src/app/dashboard/page.tsx` | Indicadores de desempenho (faturamento, ocupação, atendimentos), gráficos e lista de agendamentos de hoje | Zustand, `framer-motion` | ✅ Completa |
| **Agenda & Agendamentos** | `src/app/agenda/page.tsx`, `src/app/api/agendamentos/*` | Filtros por data/status, busca por cliente/serviço, criação com cálculo automático de horário final e integração WhatsApp | Zustand, `whatsapp.ts`, Modal UI | ✅ Completa |
| **Gestão de Clientes** | `src/app/clientes/page.tsx`, `src/app/api/clientes/*` | Cadastro, edição, remoção e listagem de clientes com contatos e histórico | Zustand, Modal UI | ✅ Completa |
| **Gestão de Funcionários** | `src/app/funcionarios/page.tsx`, `src/app/api/funcionarios/*` | Cadastro e edição da equipe, cargos, contatos e definição de expediente | Zustand, Modal UI | ✅ Completa |
| **Gestão de Serviços** | `src/app/servicos/page.tsx`, `src/app/api/servicos/*` | Cadastro de serviços com preços, categorias e tempo estimado de execução | Zustand, Modal UI | ✅ Completa |
| **Módulo Financeiro** | `src/app/financeiro/page.tsx`, `src/app/api/financeiro/*` | Fluxo de caixa com entradas e saídas, cálculo de lucro líquido e gráficos explicativos | Zustand, Modal UI | ✅ Completa |
| **Relatórios Analytics** | `src/app/relatorios/page.tsx` | Relatório de receita mensal, faturamento por colaborador, serviços populares e métricas de desempenho | Zustand, Framer Motion | ✅ Completa |
| **Configurações da Empresa** | `src/app/configuracoes/page.tsx`, `src/app/api/company/*` | Edição dos dados cadastrais da empresa (nome, slug, e-mail, telefone, avatar/logo) | Zustand, `Header.tsx` | ✅ Completa |
| **Integração WhatsApp** | `src/lib/whatsapp.ts` | Criação dinâmica de URLs com mensagem pré-formatada para agendamentos e confirmações | `whatsapp.ts`, Lucide React | ✅ Completa |

---

## 4. Fluxos do Sistema

### 1. Autenticação & Cadastro
1. O usuário acessa `/cadastrar` e cria uma empresa informando nome da empresa, slug, nome do administrador, e-mail e senha.
2. O sistema envia a requisição para `POST /api/auth/register`, cria o registro da `Company` e do `User` (Role `ADMIN`) com a senha criptografada (`bcryptjs`).
3. O token JWT é gerado e retornado em um cookie HTTP-only (`agendamax_token`).
4. O middleware valida o cookie em requisições a rotas privadas (`/dashboard`, `/agenda`, etc.).

### 2. Navegação no Dashboard & Carregamento de Dados
1. Ao acessar uma rota interna, o `Sidebar` e `Header` fornecem contexto do usuário e da empresa.
2. O `useAppStore` chama `fetchInitialData()`, consultando a API via REST endpoints (`/api/company`, `/api/agendamentos`, `/api/clientes`, `/api/funcionarios`, `/api/servicos`, `/api/financeiro`).
3. Se a API responder com erro ou o banco estiver ausente, o store ativa o fallback transparente utilizando os dados de `src/lib/mock-data.ts`.

### 3. Agendamento de Serviços
1. No menu **Agenda** (`/agenda`), o usuário pode visualizar os agendamentos do dia ou selecionar uma data no calendário.
2. Ao clicar em **"Novo Agendamento"**, abre-se o modal contendo seletores de Cliente, Serviço, Colaborador, Data, Hora de Início e Observações.
3. O horário de término é calculado automaticamente somando a duração do serviço (`durationMin`) ao horário de início.
4. O agendamento é salvo via `POST /api/agendamentos`. Ao concluir, é possível enviar lembrete direto via WhatsApp ao cliente clicando no ícone do WhatsApp.

### 4. Módulo Financeiro & Integração de Receitas
1. No menu **Financeiro** (`/financeiro`), o usuário registra entradas ou saídas manuais com valor, categoria e descrição.
2. O resumo exibe Total de Entradas, Total de Saídas e Lucro Líquido.
3. Agendamentos concluídos podem gerar lançamentos automáticos no financeiro.

---

## 5. Banco de Dados

**Provider:** PostgreSQL (configurado via Prisma ORM)

### Diagrama de Entidades / Relacionamentos
* **Company (1) -> (*) User:** Administradores e membros da conta.
* **Company (1) -> (*) Client:** Base de clientes da empresa.
* **Company (1) -> (*) Staff:** Equipe de profissionais da empresa.
* **Company (1) -> (*) Service:** Serviços ofertados pela empresa.
* **Company (1) -> (*) Appointment:** Agendamentos da empresa.
* **Company (1) -> (*) Transaction:** Lançamentos do fluxo de caixa.
* **Client (1) -> (*) Appointment:** Histórico de agendamentos do cliente.
* **Staff (1) -> (*) Appointment:** Atendimentos do profissional.
* **Service (1) -> (*) Appointment:** Serviço prestado no agendamento.

### Principais Enums
* `Role`: `ADMIN`, `STAFF`
* `AppointmentStatus`: `SCHEDULED`, `CONFIRMED`, `COMPLETED`, `CANCELLED`
* `TransactionType`: `INCOME`, `EXPENSE`

### Tabela: `Company`
* `id` (String UUID, PK)
* `name` (String)
* `slug` (String, Unique)
* `logoUrl`, `phone`, `email` (String, O