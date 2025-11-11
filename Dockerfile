FROM ghcr.io/sethforprivacy/simple-monerod:v0.18.4.3@sha256:7f4fd04d1c35299e57c1719fad23a0d058691a21304649b6986afd3b8ef7a090

# ARG MONERO_USER="monero"
USER "${MONERO_USER}"

RUN apk add --no-cache curl
