# ---- deps: full install (incl. devDependencies) for building ----
FROM node:lts AS deps
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm install --build-from-source

# ---- builder: compile the Next.js app ----
FROM node:lts AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- prod-deps: production-only install for the runtime image ----
FROM node:lts AS prod-deps
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev --build-from-source

# ---- runner: minimal production image ----
FROM node:lts AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/config ./config

EXPOSE 3000
CMD ["sh", "-c", "npx sequelize-cli db:migrate && npm run start"]
