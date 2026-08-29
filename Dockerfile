# Multi-stage Dockerfile para NexoTV NestJS Backend
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY backend/package*.json ./backend/
COPY database/prisma ./database/prisma/

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY packages/shared ./packages/shared
COPY backend ./backend

# Compilar shared, prisma y backend
RUN npm run build:shared
RUN npm run prisma:generate
RUN npm run build:backend

# Stage de Producción
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/database/prisma ./database/prisma

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

CMD ["node", "backend/dist/main.js"]
