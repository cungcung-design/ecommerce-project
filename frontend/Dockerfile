FROM node:24-alpine AS build

ARG VITE_API_URL=/api

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:alpine

ENV BACKEND_HOST=backend
ENV NGINX_RESOLVER=127.0.0.11

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
