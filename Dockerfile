FROM ghcr.io/sethforprivacy/simple-monerod:v0.18.4.2@sha256:4ddb2eef5b367639a106f449c47992709a55953e30ea269788cdd736ca45a98b

# ARG MONERO_USER="monero"
USER "${MONERO_USER}"

RUN apk add --no-cache curl
