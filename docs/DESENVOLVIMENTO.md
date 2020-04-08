DESENVOLVIMENTO
===============

### Ambiente

* Node
* Yarn (pode ser alterado para npm, mas vai precisar alterar os scripts também)
* Docker com docker-compose
* Visual Studio Code (Recomendado mas não obrigatório)

### Usuário

Email: admin@admin.com.br 
Senha: senha@123

### Iniciando 

```bash
yarn install # ou npm install

node ./init.js # apenas caso não tenha iniciado o projeto ainda

docker-compose up
# levantará o docker com o banco de dados e a aplicação.
# Ele aplicará as migrations/seeds do banco e depois dará watch nos arquivos
# e iniciará o node com a api
```

Pronto, agora é só codar que ele reiniciará a aplicação com as alterações.

### Typescript

Ele auxilia muito durante o desenvolvimento, mas alguns packges não vem com suas
definitions junto, entao primerio basta instalar com o comando abaixo. 

```bash
yarn add --dev @types/lib # ou npm install --save-dev @types/lib
```

Caso não encontre basta adicionar no arquivo declarations/extra.d.ts o conteudo abaixo,
assim você poderá utilizar ela mas sem suporte a verificação de tipagem.

```ts
declare module 'lib-nova';
```

Caso você precise adicionar uma validação nova no Joi é necessário modificar o arquivo
declarations/joi.d.ts para poder utilizar ele no código.

### Git 

Antes de cada commit ele irá verificar se tem algum erro de Typescript ou do TSLint,
isso evita um commit que quebre o ambiente de outra pessoa.

Para mais informações veja a documentação do 
[husky](https://github.com/typicode/husky)

### Banco de dados e migrations

Suporte para: Postgres, MSSQL, MySQL, MariaDB, SQLite3, Oracle e Amazon Redshift.  

* Knex é responsável por montrar as queries
* Objection é um ORM, ele traz mais funcionalidades para controlar melhor as tabelas.

Para  criar uma **migration** nova basta rodar o comando: *yarn migration:make*
Para criar um **seed** basta basta rodar o comando: *yarn seed:make*

*'número-proposito.ts'* (ex. 1-user.ts), o número ser apenas para ele rodar na sequência correta.

**CUIDADO:** OS SEEDS RODAM TODA A VEZ QUE O BANCO LEVANTA, ENTÃO É IMPORTANTE VERIFICAR SE OS DADOS 
DESTE SEED JÁ FORAM COLOCADOS.

Para mais informações veja a documentação do 
[knex](https://knexjs.org/) e do 
[objection](http://vincit.github.io/objection.js/).

Os dados do banco ficam salvos na pasta **.data**, caso seja necessário, basta para o docker,
apagar essa pasta e levantar o docker novamente.