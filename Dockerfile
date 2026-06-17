FROM node:24-alpine as builder

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml* package.json .npmrc* pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

FROM node:24-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 4321

CMD ["pnpm", "run", "preview", "--", "--host", "0.0.0.0"]
