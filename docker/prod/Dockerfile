FROM node:12-alpine

WORKDIR /app
COPY . /app

RUN set -x \
    && apk add --no-cache git \
    && echo "VERSION="$(git rev-list --all --count) > .env \
    && cat .env \
    && yarn \
    && yarn test \
    && yarn build

FROM node:12-alpine

WORKDIR /app

COPY --from=0 /app/bin /app/bin
COPY --from=0 /app/package.json /app
COPY --from=0 /app/.env /app
COPY --from=0 /app/knexfile.js /app
COPY --from=0 /app/yarn.lock /app

RUN set -x \
    && yarn install --prod \
    && yarn cache clean

CMD node /app/bin/index.js