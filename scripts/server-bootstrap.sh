#!/usr/bin/env bash
# Ubuntu 24.04 / 22.04 — MMHow VPS environment check + install
# Run on the server: bash server-bootstrap.sh

set -euo pipefail

echo "==> OS"
lsb_release -a 2>/dev/null || cat /etc/os-release

echo ""
echo "==> Before install"
for cmd in git node npm docker nginx; do
  if command -v "$cmd" >/dev/null 2>&1; then
    echo "  OK  $cmd: $(command -v "$cmd")"
  else
    echo "  --  $cmd: not installed"
  fi
done

echo ""
echo "==> apt update"
sudo apt update
sudo apt upgrade -y

echo ""
echo "==> Base packages"
sudo apt install -y git curl ca-certificates gnupg ufw

echo ""
echo "==> Node.js 20 (NodeSource)"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi
echo "node: $(node -v)"
echo "npm:  $(npm -v)"

echo ""
echo "==> Docker"
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sudo sh
  sudo usermod -aG docker "$USER"
  echo "Added $USER to docker group — log out and back in for group to apply."
fi
docker --version
docker compose version

echo ""
echo "==> Nginx + Certbot"
sudo apt install -y nginx certbot python3-certbot-nginx

echo ""
echo "==> PM2 (global)"
if ! command -v pm2 >/dev/null 2>&1; then
  sudo npm install -g pm2
fi
pm2 -v

echo ""
echo "==> Firewall (UFW)"
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
echo "y" | sudo ufw enable || true
sudo ufw status

echo ""
echo "==> After install"
for cmd in git node npm docker nginx pm2; do
  command -v "$cmd" >/dev/null 2>&1 && echo "  OK  $cmd" || echo "  FAIL $cmd"
done

echo ""
echo "==> Done. Next steps:"
echo "  1. mkdir -p /var/www/mmhow && clone your repo"
echo "  2. docker compose up -d   (Postgres)"
echo "  3. configure .env, npm ci, npm run build, pm2 start"
