# syntax=docker/dockerfile:1

FROM node:24-alpine AS test

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY src ./src
COPY tests ./tests
COPY jest.config.js eslint.config.js ./

RUN npm run lint
RUN npm test
RUN npm run test:coverage


FROM node:24-alpine AS production

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev --ignore-scripts \
    && npm cache clean --force

COPY --from=test --chown=node:node /app/src ./src

USER node

EXPOSE 3000

CMD ["node", "src/server.js"]