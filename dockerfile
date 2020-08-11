# Install Stage
FROM node:12.18.2-alpine as service

WORKDIR /usr/src/app

COPY . .

RUN apk add --no-cache --virtual .build-deps alpine-sdk &&\
  npm ci &&\
  npm run build &&\
  npm prune --production &&\
  rm -rf ~/.npmrc &&\
  apk del .build-deps

ENV NODE_ENV production
CMD ["npm", "run", "prod"]