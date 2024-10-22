FROM node:12.16.0-alpine

LABEL org.opencontainers.image.source https://github.com/rtang03/auth-server

ENV TIME_ZONE=Asia/Hong_Kong \
    ENV_NAME=production \
    NODE_ENV=production \
    NODE_CONFIG_ENV=production

RUN mkdir /home/app/ \
   && chown -R node:node /home/app/

COPY --chown=node:node ./build/ /home/app/

COPY ./build/entrypoint.sh /usr/local/bin/

RUN apk add --no-cache postgresql-client \
  && apk add --no-cache --virtual .build-deps python make g++ tzdata \
  && cp /usr/share/zoneinfo/Asia/Hong_Kong /etc/localtime \
  && echo "Asia/Hong_Kong" > /etc/timezone \
  && cd /home/app \
  && npm install --production  \
  && apk del .build-deps

USER node

WORKDIR /home/app/

ENTRYPOINT [ "entrypoint.sh" ]

EXPOSE 8080
