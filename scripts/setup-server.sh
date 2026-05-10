#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────
# Oracle Cloud (Ubuntu 22.04 / 24.04) — One-shot server bootstrap.
# Run once on a fresh VM as a sudo-capable user (e.g. ubuntu).
#
#   curl -fsSL https://your-host/setup-server.sh | bash
# OR
#   bash setup-server.sh
# ──────────────────────────────────────────────────────────────────
set -euo pipefail

DOMAIN="${DOMAIN:-siddharthakumar.dev}"
NODE_VERSION="20"
APP_USER="${APP_USER:-deploy}"
APP_DIR="/var/www/portfolio"
LOG_DIR="/var/log/portfolio"

log() { echo -e "\033[1;36m[setup]\033[0m $*"; }
warn() { echo -e "\033[1;33m[warn]\033[0m $*"; }

# ─── 1. System update ───────────────────────────────────────────────
log "Updating apt cache and packages…"
sudo apt-get update -y
sudo apt-get upgrade -y

# ─── 2. Install base packages ───────────────────────────────────────
log "Installing base packages: curl, git, ufw, fail2ban, build-essential…"
sudo apt-get install -y \
  curl ca-certificates gnupg git ufw fail2ban \
  build-essential nginx unattended-upgrades \
  certbot python3-certbot-nginx

# ─── 3. Create dedicated deploy user ────────────────────────────────
if ! id "${APP_USER}" >/dev/null 2>&1; then
  log "Creating user '${APP_USER}'…"
  sudo adduser --disabled-password --gecos "" "${APP_USER}"
  sudo usermod -aG sudo "${APP_USER}"
  if [ -d "/home/ubuntu/.ssh" ]; then
    sudo mkdir -p "/home/${APP_USER}/.ssh"
    sudo cp /home/ubuntu/.ssh/authorized_keys "/home/${APP_USER}/.ssh/"
    sudo chown -R "${APP_USER}:${APP_USER}" "/home/${APP_USER}/.ssh"
    sudo chmod 700 "/home/${APP_USER}/.ssh"
    sudo chmod 600 "/home/${APP_USER}/.ssh/authorized_keys"
  fi
else
  log "User '${APP_USER}' already exists. Skipping."
fi

# ─── 4. Install Node.js (NodeSource) ────────────────────────────────
if ! command -v node >/dev/null 2>&1 || [ "$(node -v | cut -c2- | cut -d. -f1)" -lt "${NODE_VERSION}" ]; then
  log "Installing Node.js ${NODE_VERSION}.x via NodeSource…"
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_VERSION}.x" | sudo -E bash -
  sudo apt-get install -y nodejs
else
  log "Node.js $(node -v) already installed."
fi

# ─── 5. Install PM2 globally ────────────────────────────────────────
if ! command -v pm2 >/dev/null 2>&1; then
  log "Installing PM2 globally…"
  sudo npm install -g pm2
fi

# ─── 6. Configure firewall (UFW) ────────────────────────────────────
log "Configuring UFW firewall (allow SSH, HTTP, HTTPS)…"
sudo ufw --force reset >/dev/null
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# ─── 7. Open Oracle iptables (IMPORTANT for OCI A1 Always Free) ─────
log "Opening iptables for HTTP (80) and HTTPS (443) — Oracle Cloud requirement…"
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save 2>/dev/null || sudo apt-get install -y iptables-persistent && sudo netfilter-persistent save

# ─── 8. Harden SSH ──────────────────────────────────────────────────
log "Hardening SSH config (disable password auth, disable root login)…"
sudo sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo sed -i 's/^#*ChallengeResponseAuthentication.*/ChallengeResponseAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# ─── 9. Enable fail2ban ─────────────────────────────────────────────
log "Enabling fail2ban for SSH brute-force protection…"
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# ─── 10. Enable automatic security updates ──────────────────────────
log "Enabling unattended security upgrades…"
sudo dpkg-reconfigure -f noninteractive unattended-upgrades

# ─── 11. Create app directory structure ─────────────────────────────
log "Creating app directories: ${APP_DIR}, ${LOG_DIR}…"
sudo mkdir -p "${APP_DIR}/releases" "${APP_DIR}/shared" "${LOG_DIR}"
sudo chown -R "${APP_USER}:${APP_USER}" "${APP_DIR}" "${LOG_DIR}"

# ─── 12. Configure nginx ────────────────────────────────────────────
log "Removing default nginx site & ensuring nginx is enabled…"
sudo rm -f /etc/nginx/sites-enabled/default
sudo systemctl enable nginx
sudo systemctl restart nginx

cat <<EOF

╭───────────────────────────────────────────────────────────────╮
│  ✓ Server bootstrap complete.                                 │
╰───────────────────────────────────────────────────────────────╯

Next steps:
  1. Copy nginx config:
       sudo cp scripts/nginx.conf /etc/nginx/sites-available/portfolio
       sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
       sudo nginx -t && sudo systemctl reload nginx

  2. Deploy the app (from your local machine):
       bash scripts/deploy.sh ${APP_USER}@<your-server-ip>

  3. Get SSL certificate (once DNS is pointing to this server):
       sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}

  4. Enable PM2 boot persistence:
       pm2 startup systemd
       pm2 save

EOF
