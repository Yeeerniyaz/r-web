# СТАДИЯ 1: Сборка (Build)
FROM node:18-alpine AS builder

WORKDIR /app

# Копируем package.json и ставим зависимости
COPY package*.json ./
RUN npm install

# Копируем все исходники и запускаем билд
COPY . .
RUN npm run build

# СТАДИЯ 2: Продакшн-сервер (Nginx)
FROM nginx:alpine

# Копируем собранный проект из первой стадии
COPY --from=builder /app/dist /usr/share/nginx/html

# Подменяем стандартный конфиг nginx на наш (для React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]