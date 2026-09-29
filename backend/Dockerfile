FROM node:24-alpine AS deps

WORKDIR /app

COPY package*.json ./

RUN npm ci

FROM node:24-alpine AS runtime

WORKDIR /app

RUN apk add --no-cache wget openssl

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma
COPY data ./data
COPY scripts ./scripts
COPY src ./src

RUN npx prisma generate

EXPOSE 5000

CMD ["node", "src/server.js"]
