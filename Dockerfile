FROM node:alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma
COPY . .

RUN npx prisma generate

FROM node:alpine

WORKDIR /app

RUN mkdir -p /app/uploads/


COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app ./

EXPOSE 8080


ENTRYPOINT ["npm", "start"]
