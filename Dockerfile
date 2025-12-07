FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

RUN npx prisma generate

COPY . .

FROM node:20-alpine

WORKDIR /app

RUN mkdir -p /app/uploads/products
RUN mkdir -p /app/uploads/profiles

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app ./

EXPOSE 8080

ENTRYPOINT ["npm", "start"]
