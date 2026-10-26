FROM node:26.12.1-bookworm-slim AS build
WORKDIR /app
ENV ASTRO_TELEMETRY_DISABLED=1 NEXT_TELEMETRY_DISABLED=1 NODE_OPTIONS=--max-old-space-size=2048
COPY package*.json ./
RUN npm ci --ignore-scripts --no-fund && npm audit --audit-level=moderate
COPY . .
RUN npm run build
FROM caddy:2.11.7-alpine AS webserver
FROM alpine:3
RUN apk add --no-cache ca-certificates libcap
COPY --from=webserver /usr/bin/caddy /usr/bin/caddy
RUN setcap -r /usr/bin/caddy && apk del libcap
ARG SOURCE_COMMIT
ENV SOURCE_COMMIT=$SOURCE_COMMIT
LABEL org.opencontainers.image.revision=$SOURCE_COMMIT
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv
USER 1000:1000
EXPOSE 8080
HEALTHCHECK --interval=20s --timeout=3s --start-period=10s CMD wget -q -O /dev/null http://127.0.0.1:8080/_health || exit 1
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
