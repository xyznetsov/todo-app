# Этап сборки приложения
FROM nginx:alpine AS builder

# Копируем статические файлы
COPY index.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY clock.css /usr/share/nginx/html/
COPY main.js /usr/share/nginx/html/
COPY images/ /usr/share/nginx/html/images/

# Финальный этап
FROM nginx:alpine

# Копируем статические файлы из этапа сборки
COPY --from=builder /usr/share/nginx/html /usr/share/nginx/html

# Копируем нашу конфигурацию nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Создаем необходимые директории и настраиваем права
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /etc/nginx/nginx.conf && \
    chmod -R 755 /usr/share/nginx/html

# Создаем директорию для временных файлов
RUN mkdir -p /tmp/nginx && \
    chown -R nginx:nginx /tmp/nginx && \
    chmod -R 755 /tmp/nginx

# Меняем пользователя на nginx
USER nginx

# Определяем healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Открываем порт
EXPOSE 8080

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]