# Nest Api Generator

Utilize o VSCode, já está configurado com sugestão de extensões e debug.

### Tecnologias

* Node/Typescript
* NestJs (Framework)
* Docker
* Objection (ORM) / Knex (Query builder e migrations)
* Mailgun (envio de email)
* AWS (envio de email/s3)
* JWT (tokens)
* Bcrypt (criptografia para senhas)
* Sentry.io (log de erros)
* Pug (templates de email)

### Iniciando um novo projeto

```bash
# install docker https://docs.docker.com/install

git clone git@github.com:thejoaov/api-nest-knex-ts.git
# ou crie um repositório utilizando o botão de template 😁 

yarn install # ou npm install

node ./init.js

[sudo] docker-componse up
# levantará o docker com o banco de dados e a aplicação.
# Ele aplicará as migrations/seeds do banco e depois dará watch nos arquivos
# e iniciará o node com a api
```

### Para mais informações, veja:
1. [Arquitetura](./docs/ARQUITETURA.md)
2. [Desenvolvimento](./docs/DESENVOLVIMENTO.md)
3. [Produção](./docs/PRODUÇÃO.md)
4. [Testes](./docs/TESTES.md)

