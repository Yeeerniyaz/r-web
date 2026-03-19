# Используем стабильный и легковесный образ Nginx на базе Alpine
FROM nginx:stable-alpine

# Копируем кастомный конфиг Nginx для корректной работы React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем папку dist (которую ты собрал на ноуте через npm run build) 
# прямо в директорию сервера
COPY dist /usr/share/nginx/html

# Информируем Docker, что сервис слушает 80 порт
EXPOSE 80

# Запускаем Nginx в режиме foreground (чтобы контейнер не закрылся)
CMD ["nginx", "-g", "daemon off;"]