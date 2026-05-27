# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=24.15.0

FROM node:${NODE_VERSION}-bookworm-slim AS base

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*

FROM base AS deps

ENV NODE_ENV=development

COPY package*.json ./
RUN npm ci

FROM deps AS build

COPY nest-cli.json prisma.config.ts tsconfig*.json ./
COPY prisma ./prisma
COPY env.helper.ts ./
COPY src ./src

ENV POSTGRES_USER=postgres \
  POSTGRES_PASSWORD=postgres \
  POSTGRES_HOST=db \
  POSTGRES_DB=taro

RUN npx prisma generate
RUN npm run build

FROM deps AS prod-deps

ENV NODE_ENV=production

RUN npm prune --omit=dev \
  && npm cache clean --force

FROM base AS runtime

ENV NODE_ENV=production \
  PORT=3000

COPY --from=prod-deps --chown=node:node /app/package*.json ./
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/generated ./generated

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD node -e "const http=require('http');const port=process.env.PORT||3000;const req=http.get({host:'127.0.0.1',port,path:'/health',timeout:2500},res=>process.exit(res.statusCode===200?0:1));req.on('error',()=>process.exit(1));req.on('timeout',()=>{req.destroy();process.exit(1);});"

CMD ["node", "dist/src/main.js"]
