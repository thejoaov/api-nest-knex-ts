ARQUITETURA
===========

### Environments Docker

Ver arquivos ./env, ./env.example e ./src/settings.ts

|         ENV         | Obrigatório | Valor Padrão |                   Valor esperado                   |
| ------------------- | ----------- | ------------ | -------------------------------------------------- |
| NODE_ENV            | false       | production   | developmento / production                          |
| DNS                 | true        |              | url completa que a api esta sendo usada            |
| SENTRY_KEY          | false       |              | dns criada pelo sentry.io                          |
| UPLOAD_PROVIDER     | true        |              | local ou s3                                        |
| MAIL_PROVIDER       | true        |              | aws, mailgun ou local                              |
| MAIL_FROM           | false       |              | email                                              |
| MAIL_MAILGUN_APIKEY | false       |              | apikey do mailgun                                  |
| MAIL_MAILGUN_DOMAIN | false       |              | domain do mailgun                                  |
| AWS_ACCESSKEY       | false       |              | informações da aws para envio de email e uplaod s3 |
| AWS_SECRET          | false       |              | informações da aws para envio de email e uplaod s3 |
| AWS_REGION          | false       |              | informações da aws para envio de email e uplaod s3 |
| AWS_S3_BUCKET       | false       |              | informações da aws para uplaod s3                  |
| AWS_S3_URL          | false       |              | informações da aws para uplaod s3                  |
| DATABASE_HOST       | true        | localhost    | informações de conexão do banco                    |
| DATABASE_PORT       | true        | 3002         | informações de conexão do banco                    |
| DATABASE_DB         | true        | project      | informações de conexão do banco                    |
| DATABASE_USER       | true        | docker       | informações de conexão do banco                    |
| DATABASE_PASSWORD   | true        | 123mudar     | informações de conexão do banco                    |


### Scripts do package.json

|     Comando     |                   Descrição                    |               Quem usa                |
| --------------- | ---------------------------------------------- | ------------------------------------- |
| dev             | inicia o ts-node-dev                           | Docker dev                            |
| build           | gera os arquivos transpilados                  | Docker prod                           |
| update:packages | atualiza as dependencias do projeto            | desenvolvedor                         |
| update:base     | atualiza o projeto base                        | desenvolvedor                         |
| test:*          | roda os testes unitários                       | Docker / desenvolvedor                |
| migration:make  | cria uma nova migration do banco de dados      | desenvolvedor                         |
| seed:make       | cria um novo arquivo de seed do banco de dados | desenvolvedor                         |
| docker:release  | build e da push na nova imagem do docker       | devensolvedor                         |
| docker:build    | build a nova imagem do docker                  | script docker:release / desenvolvedor |
| docker:push     | dá push na nova imagem do docker               | script docker:release / desenvolvedor |

### Sistema de pastas

* Src: source da api
    * assets: imagens e templates de emails
    * declarations: custom typings para o Typescript.
    * filters: custom filters globais do nestjs.
    * helpers: funções genericas .
    * interfaces: interfaces gerais
    * modules
        * common
            * middlewares: middlewares do express, usados de uma maneira geral no projeto
        * database
            * models: entidades do banco de dados
            * migrations: scripts para gerar o banco, rodam apenas uma vez
                * seed: 
                    scripts para alimentar o banco, rodam todas vezes por isso é 
                    preciso verificar se já existe dado ou não
    * modules: modulos do sistema
    * [admin/content]
        * middlewares: middlewares do express especificos do modulo
        * repositories: camada responsável por acesso ao banco, nenhum lógica de negocio.
        * routes: endpoint com as routes do enpoint especificas do modulo
        * services: camada responsável pela lógica de nogocio.
        * validator: validadores especificas do modulo.
    * services: serviços gerais do projeto
    * validators: configuração e validadores gerais do projeto

### Premissas e Responsábilidades

* Serviços:
    * São responsáveis pelo negócio.
    * Devem ser ter teste unitários
    * Podem utilizar outros serviços
    * Devem ter uma única responsábilidade, focada em um segmento (ex. user) ou funcionalidade (ex. auth)
    * Utilizam os repositórios para acessar os dados do banco.
    * Recebem o dado completo e validado.
    * Se algum requisito não for suprido lance um ServiceError com os detalhes, pois isso é culpa de quem o utiliza
* Repositórios:
    * São responsáveis pelo acesso ao banco
    * Não devem conter lógica de negócio apenas lógica de banco.
    * Recebem uma transaction para manter o escopo de quem o utiliza.
    * Devem ter uma única responsábilidade, focada em uma tabela (ex. user) ou funcionalidade (ex. auth)
    * Um repositório não devem chamar outro.
* Controllers:
    * Definem quem pode acessar atráves das roles/middlewares
    * Devem validar o dado para passar para os serviços
    * Não devem conter lógica de negócio
    * Podem acessar diretamente os serviços para efetuar alguma alteração ou os respositorios para leitura.
    * Não deve tratar erros genéricos, apenas erros especificos e esperados, os genéricos devem ser passados para o próximo handle de erros (via next function)
    * Podem formatar os dados antes de retornar.
* Módulos:
    * Focados em uma área do projeto (admin, app, public e etc...)
    * Tem seus próprios serviços, repositorios, controllers e etc...
    * Não devem utilizar nada de outro modulo, a não ser dos módulo compartilhados (common, database e etc).
    * Pode até ter um estilo de autenticação e verificação diferente.

### Boas práticas e pontos a serem observados

* Toda **model** tem sua interface, pois o router pode receber uma model completa mas ela não terá o comportamento e funções da mesma.
* Os repositórios retornam a model e não a interface.
* Coloque os **ENVIRONMENTS** no settings.ts, coloque seu valor default se tiver.
* As models de banco podem conter alguma **lógica simples de comportamento**. (ex: user.checkPassword).
* Sempre trabalhe com **async await (promisses)**, evite callback.
* Mantenhas os **arquivos pequenos e focados** em uma funcionaldade.
* Nomeie as funções corretamente, **evite comentários desnecessários**.
* Evite ao máximo o **any** do Typescript pois isso tira a verificação dele.
* Use **interfaces** para definir objectos e parametros complexos. 
* Não coloque números ou strings direto no código, use **Enums**.
* Se algum **typing de um package estiver incorreto/incompleto**, utilize a pasta declarations para arrumar.
