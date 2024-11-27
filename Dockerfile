FROM node:18-alpine AS development

WORKDIR /usr/src/techchallenge-app/checkout-microservice

COPY package*.json ./

RUN yarn install --ignore-scripts

COPY src ./src

COPY tsconfig.json ./
COPY nest-cli.json ./

RUN yarn run build


FROM node:18-alpine AS production

RUN addgroup -S nonroot \
    && adduser -S nonroot -G nonroot

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/techchallenge-app/checkout-microservice

COPY package*.json ./

RUN yarn install --production --ignore-scripts

COPY --from=development /usr/src/techchallenge-app/checkout-microservice/dist ./dist

USER nonroot

CMD [ "yarn", "run", "start:prod" ]