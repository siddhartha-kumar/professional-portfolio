#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────
# Deploy script — runs locally, ships the latest build to the server.
#
#   Usage: bash scripts/deploy.sh deploy@your-server-ip
#
# Strategy:
#   1. Build locally (next build).
#   2. Tar the build artifacts (.next, public, package.json, lockfile, next.config).
#   3. SCP to /var/www/portfolio/releases/<timestamp>/.
#   4. SSH: install --omit=dev, atomically symlink 'current' to new release, pm2 reload.
#   5. Keep last 3 releases for instant rollback.
# ──────────────────────────────────────────────────────────────────
set -euo pipefail

REMOTE="${1:-}"
APP_DIR="/var/www/portfolio"
RELEASES_DIR="${APP_DIR}/releases"
KEEP_RELEASES=3
PM2_NAME="siddhartha-portfolio"

if [ -z "${REMOTE}" ]; then
  echo "Usage: $0 user@host"
  exit 1
fi

TIMESTAMP="$(date -u +%Y%m%d_%H%M%S)"
RELEASE_PATH="${RELEASES_DIR}/${TIMESTAMP}"
TMP_TAR="/tmp/portfolio-${TIMESTAMP}.tar.gz"

log() { echo -e "\033[1;36m[deploy]\033[0m $*"; }

# ─── 1. Local build ─────────────────────────────────────────────────
log "Running local production build…"
npm run build

# ─── 2. Package artifacts ───────────────────────────────────────────
log "Creating release tarball…"
tar --exclude='node_modules' --exclude='.git' --exclude='.next/cache' \
  -czf "${TMP_TAR}" \
  .next public package.json package-lock.json next.config.ts \
  ecosystem.config.js src

# ─── 3. Ship it ─────────────────────────────────────────────────────
log "Uploading to ${REMOTE}…"
ssh "${REMOTE}" "mkdir -p ${RELEASE_PATH}"
scp "${TMP_TAR}" "${REMOTE}:${RELEASE_PATH}/release.tar.gz"

# ─── 4. Remote install + activate ───────────────────────────────────
log "Installing & activating on remote…"
ssh "${REMOTE}" bash -se <<EOF
set -euo pipefail
cd "${RELEASE_PATH}"
tar -xzf release.tar.gz
rm release.tar.gz
npm ci --omit=dev --no-audit --no-fund

# Atomic symlink swap
ln -sfn "${RELEASE_PATH}" "${APP_DIR}/current"

# Restart PM2 (or start if first deploy)
if pm2 describe "${PM2_NAME}" >/dev/null 2>&1; then
  pm2 reload "${PM2_NAME}" --update-env
else
  pm2 start "${APP_DIR}/current/ecosystem.config.js" --env production
  pm2 save
fi

# Keep last N releases
cd "${RELEASES_DIR}"
ls -1t | tail -n +$((${KEEP_RELEASES} + 1)) | xargs -r rm -rf
EOF

rm -f "${TMP_TAR}"
log "✓ Deploy complete: ${TIMESTAMP}"
log "  Verify: curl -I https://siddharthakumar.dev"
