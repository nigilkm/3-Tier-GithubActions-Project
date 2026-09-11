FROM nginx:1.27-alpine

COPY public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# nginx:alpine already includes an unprivileged runtime path on 8080
# when using the non-root variant; keep default root image here for simplicity.
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/healthz || exit 1
