FROM node:25-alpine AS base
RUN apk add --no-cache \
    python3 \
    py3-pip \
    make \
    g++ \
    linux-headers \
    pkgconfig \
    openssl-dev
WORKDIR /app
COPY package*.json ./

FROM base AS deps
RUN npm install

FROM deps AS dev
RUN apk add --no-cache openssl-dev
CMD ["npm", "run", "dev"]

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:25-alpine AS prod
WORKDIR /app
RUN apk add --no-cache openssl
RUN chown node:node /app
USER node
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
ENV NODE_ENV=production
EXPOSE 3000
EXPOSE 10000-10100/udp
EXPOSE 10000-10100/tcp
CMD ["node", "dist/server.js"]