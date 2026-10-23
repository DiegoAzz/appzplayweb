# Contenedor Node.js Ultraligero para AppzPlay (Landing Page + CMS Dashboard)
FROM node:20-alpine

WORKDIR /app

# Copiar todos los archivos del proyecto
COPY . .

# Variables de entorno
ENV PORT=80
ENV NODE_ENV=production
ENV ADMIN_PASSWORD=appzplay2026

# Puerto 80 expuesto para Coolify / Traefik
EXPOSE 80

# Arranca el servidor nativo Node.js sin dependencias externas
CMD ["node", "server.js"]
