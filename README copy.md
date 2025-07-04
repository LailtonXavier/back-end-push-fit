## Creating API Nest

## Configuração
- add no packege.json: "prisma": {
    "schema": "src/infra/database/prisma/schema.prisma"
  }
..

..
## Criar um Dado no bando
- criar o `schema`
- npx prisma migrate dev --name add-user-model
- npx prisma generate

## rodar migrate

- pnpm prisma generate

## apagar banco
- pnpm prisma migrate reset --force