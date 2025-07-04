# Push Fit - API NestJS - Clean Architecture

Esta é uma API desenvolvida com NestJS seguindo os princípios de Clean Architecture e utilizando diversas tecnologias modernas.

## 🚀 Começando

### Pré-requisitos

- Node.js (versão 18 ou superior)
- Docker (para o banco de dados PostgreSQL)
- pnpm (gerenciador de pacotes)

### Configuração do Ambiente de Desenvolvimento

1. **Banco de dados PostgreSQL com Docker**:

   ```bash
   docker-compose up -d
   ```

   Este comando irá criar e iniciar um container PostgreSQL.

2. **Instalar dependências**:

   ```bash
   pnpm install
   ```

3. **Configurar variáveis de ambiente**:

   Crie um arquivo `.env` na raiz do projeto baseado no `.env.example` e configure as variáveis necessárias.

4. **Executar migrações do banco de dados**:

  ```bash
   pnpm prisma migrate dev
   ```

5. **Iniciar a aplicação**:

   ```bash
   pnpm start:dev
   ```

   A API estará disponível em: [http://localhost:3000](http://localhost:3000)

## 🛠 Tecnologias Utilizadas

- **Autenticação**:
  - `@nestjs/jwt` (^11.0.0)
  - `passport-jwt` (^4.0.1)
  - `jsonwebtoken` (^9.0.2)
  - `bcrypt` (^6.0.0) para hash de senhas

- **Configuração**:
  - `dotenv` (^17.0.0) para gerenciamento de variáveis de ambiente

- **Validação**:
  - `zod` (^3.25.67) para validação de schemas

## 🏛 Arquitetura

A aplicação segue os princípios de **Clean Architecture**, com as seguintes camadas principais:

1. **Domain**: Contém as entidades e regras de negócio centrais
2. **Application**: Casos de uso e interfaces de repositórios
3. **Infrastructure**: Implementações concretas (banco de dados, autenticação, etc.)
4. **Presentation**: Controladores e DTOs

## 📌 Rotas Principais

(Aqui você pode listar algumas rotas principais da sua API ou referenciar o arquivo de rotas/swagger se tiver documentação)

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo LICENSE para mais detalhes.

---

Desenvolvido com ❤️ por Lailton Xavier