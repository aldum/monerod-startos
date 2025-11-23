FROM ghcr.io/sethforprivacy/simple-monerod:v0.18.4.4@sha256:83a4a02065429d99ef30570534dda6358faa03df01d5ebb8cd8f900de79a5c77

# ARG MONERO_USER="monero"
USER "${MONERO_USER}"

RUN apk add --no-cache curl
