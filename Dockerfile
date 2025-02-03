# Etapa 1: Construcción de la aplicación React
FROM node:18 AS build

# Definir directorio de trabajo en el contenedor
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package.json package-lock.json ./
RUN npm install

# Copiar el resto del código y construir la aplicación
COPY . .
RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:stable-alpine

# Copiar la build de React al directorio de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exponer el puerto 80 para el servidor web
EXPOSE 80

# Ejecutar Nginx en modo foreground
CMD ["nginx", "-g", "daemon off;"]