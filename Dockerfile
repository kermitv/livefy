FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html
COPY index.html styles.css main.js ./
COPY src ./src
COPY docs ./docs

EXPOSE 80
