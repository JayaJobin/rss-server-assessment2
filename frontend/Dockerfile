# ---- deps: full install (incl. devDependencies) for building ----
FROM node:lts AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# ---- builder: compile the Next.js app ----
FROM node:lts AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- prod-deps: production-only install for the runtime image ----
FROM node:lts AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# ---- runner: minimal production image ----
FROM node:lts AS runner
ENV NODE_ENV=production
WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000
CMD ["npm", "run", "start"]
