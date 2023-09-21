FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json svelte.config.js ./
RUN npm install --legacy-peer-deps 
COPY . .
COPY .env ./.env

RUN npm run build

FROM node:18-alpine

USER node
WORKDIR /app

RUN rm -rf ./*
COPY --from=builder --chown=node:node /app/build ./build
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/.env ./.env

ENV HOST=0.0.0.0 PORT=5173 NODE_ENV=production

CMD ["node", "build/index.js"]