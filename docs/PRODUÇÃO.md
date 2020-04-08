PRODUÇÃO
========

**É NECESSÁRIO CRIAR UMA CONTA NO DOCKER.HUB E CONFIGURAR UM REPOSITÓRIO**

### Gerando a imagem

Para criar uma imagem de produção, altere o valor *YOUR_DOCKER_USERNAME* nos scripts `docker:build`, e `docker:push` arquivo `package.json`, na raiz do projeto, depois basta rodar:

```bash
yarn docker:release # ou npm run docker:release
```

Ele gerará a imagem e dará push no repositório do docker.hub.

### Levantando

Basta criar um arquivo docker-compose.yml no servidor e colocar as configurações e rodar:

```bash
docker-compose up -d
```

A aplicações irá iniciar, sugiro utilizar o **NGINX** para criar um proxy reverso e 
disponibilizar a api.

### Atualizando

Feito a imagem basta entrar no ambiente de produção e rodar o comando abaixo:

```bash
docker-compose pull
docker-compose up -d
```