# syntax=docker/dockerfile:1

FROM --platform=${BUILDPLATFORM} node:26-alpine AS build
ARG BUILDPLATFORM
WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,id=echo-bot-npm-${BUILDPLATFORM},target=/root/.npm,sharing=locked \
    npm ci --ignore-scripts

COPY . ./
RUN npm run build

# Install native production dependencies on the target platform, not the builder.
FROM node:26-alpine AS production-dependencies
ARG TARGETPLATFORM
WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,id=echo-bot-npm-${TARGETPLATFORM},target=/root/.npm,sharing=locked \
    npm ci --omit=dev --ignore-scripts

FROM node:26-alpine AS final
ENV NODE_ENV=production
WORKDIR /app

COPY --chown=node:node package.json ./
COPY --from=production-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist

RUN mkdir -p /app/logs && chown node:node /app/logs
USER node

CMD [ "node", "dist/main.js" ]
