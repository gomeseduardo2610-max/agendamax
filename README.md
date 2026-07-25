# 🚀 AgendaMax

> Sistema SaaS completo de agendamento, gestão de clientes, funcionários, serviços, fluxo de caixa e relatórios analíticos para salões de beleza, barbearias, clínicas de estética e prestadores de serviços.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-5.10-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql)

---

## 💻 Sobre o Projeto

O **AgendaMax** foi construído para modernizar a gestão de estabelecimentos e prestadores de serviços. Ele oferece uma interface intuitiva, rápida e responsiva com recursos completos para o dia a dia operacional e estratégico.

### ✨ Principais Recursos

- 📅 **Agenda Interativa:** Visualização em calendário e lista, filtros por profissional/status e agendamento rápido com cálculo de tempo automático.
- 💬 **Integração WhatsApp:** Lembretes e confirmações formatadas enviadas em 1 clique para o cliente.
- 👥 **Gestão de Clientes:** Base de contatos, histórico de visitas e observações.
- 💈 **Gestão de Serviços & Equipe:** Cadastro de profissionais com jornada de trabalho e catálogo de serviços por preço/duração.
- 💰 **Fluxo de Caixa:** Controle financeiro de entradas e saídas, cálculo de lucro líquido e gráficos detalhados.
- 📊 **Relatórios & Métricas:** Desempenho por colaborador, serviços mais vendidos e ticket médio.
- 🛡️ **Autenticação & Multi-Tenancy:** Isolamento completo de empresas e autenticação JWT em cookies HTTP-only.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend / Framework:** [Next.js 14](https://nextjs.org/) (App Router), [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/), Lucide Icons
- **Animações:** [Framer Motion](https://www.framer.com/motion/)
- **Estado Global:** [Zustand](https://github.com/pmndrs/zustand)
- **Banco de Dados & ORM:** [PostgreSQL](https://www.postgresql.org/), [Prisma ORM](https://www.prisma.io/)
- **Autenticação:** JWT (`jose`), Hash de senha (`bcryptjs`), Middleware do Next.js

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (v18.x ou superior)
- npm ou yarn
- PostgreSQL (opcional - o sistema possui fallback com dados de demonstração em memória)

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/agendamax.git
   cd agendamax
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz baseado no `.env.example`:
   ```env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/agendamax?schema=public"
   JWT_SECRET="seu-segredo-super-seguro-jwt"
   ```

4. **Gerar o Prisma Client (opcional para conexão PostgreSQL):**
   ```bash
   npx prisma generate
   ```

5. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

6. **Acesse no navegador:**
   Abra [http://localhost:3000](http://localhost:3000)

---

## 📄 Documentação Técnica

Para ver os detalhes da arquitetura, schema de banco de dados, endpoints e changelog interno, consulte o arquivo **[`ANTIGRAVITY.md`](./ANTIGRAVITY.md)** na raiz do repositório.

---

## 📜 Licença

Este projeto é desenvolvido para fins comerciais e demonstrativos.
