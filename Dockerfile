FROM node:25-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM base AS dev
CMD ["npm", "run", "dev"]

FROM base AS builder
COPY . .
RUN npm run build

FROM node:25-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]