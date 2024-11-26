FROM node:18-alpine AS development

WORKDIR /usr/src/techchallenge-app/checkout-microservice

COPY package*.json ./

RUN yarn install

COPY src ./src

COPY tsconfig.json ./
COPY nest-cli.json ./

RUN yarn run build


FROM node:18-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/techchallenge-app/checkout-microservice

COPY package*.json ./

RUN yarn install --production

COPY --from=development /usr/src/techchallenge-app/checkout-microservice/dist ./dist

CMD [ "yarn", "run", "start:prod" ]