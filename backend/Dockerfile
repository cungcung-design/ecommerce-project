FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ecommerce_db"

RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "start"]