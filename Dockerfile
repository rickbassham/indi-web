FROM node:lts-alpine3.12 as clientbuild

RUN mkdir /web
WORKDIR /web
COPY web/package.json /web
RUN npm install

WORKDIR /web
COPY web/ /web
RUN npm run build

FROM node:lts-alpine3.12

RUN mkdir /server

WORKDIR /server
COPY server/package.json /server
RUN npm install

COPY --from=clientbuild /web/dist/ /server/static

WORKDIR /server
COPY server/ /server

CMD [ "index.js" ]
