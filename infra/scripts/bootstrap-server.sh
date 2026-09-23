#!/usr/bin/env bash
# EpiVerse — préparation d'un serveur neuf (Ubuntu 22.04 / 24.04 ou Debian 12). À lancer une seule fois.
#
# Usage : sudo bash bootstrap-server.sh "<clé publique SSH de déploiement>"
#
# Installe Docker Engine (dépôt officiel Docker), crée l'utilisateur « deploy », ferme tous les ports
# sauf SSH, HTTP et HTTPS, active les mises à jour de sécurité automatiques et prépare /opt/epiverse.
set -euo pipefail

[ "$(id -u)" -eq 0 ] || { echo "À lancer en root : sudo bash $0 \"<clé publique>\"" >&2; exit 1; }
DEPLOY_PUBKEY="${1:-}"
DEPLOY_USER="${DEPLOY_USER:-deploy}"
BASE_DIR="${EPIVERSE_BASE_DIR:-/opt/epiverse}"

# shellcheck source=/dev/null
. /etc/os-release
case "$ID" in ubuntu|debian) ;; *) echo "Système non prévu : $ID (Ubuntu ou Debian attendu)" >&2; exit 1 ;; esac

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl gnupg ufw unattended-upgrades openssl

if ! command -v docker >/dev/null 2>&1; then
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL "https://download.docker.com/linux/$ID/gpg" -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/$ID $VERSION_CODENAME stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi
systemctl enable --now docker

if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" "$DEPLOY_USER"
fi
usermod -aG docker "$DEPLOY_USER"

if [ -n "$DEPLOY_PUBKEY" ]; then
  SSH_DIR="/home/$DEPLOY_USER/.ssh"
  install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$SSH_DIR"
  touch "$SSH_DIR/authorized_keys"
  grep -qxF "$DEPLOY_PUBKEY" "$SSH_DIR/authorized_keys" || echo "$DEPLOY_PUBKEY" >> "$SSH_DIR/authorized_keys"
  chown "$DEPLOY_USER:$DEPLOY_USER" "$SSH_DIR/authorized_keys"
  chmod 600 "$SSH_DIR/authorized_keys"
fi

# Pare-feu : Docker contourne ufw pour les ports publiés, d'où la règle du projet :
# seul le reverse proxy publie des ports (80/443), jamais PostgreSQL ni Redis.
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 443/udp
ufw --force enable

dpkg-reconfigure -f noninteractive unattended-upgrades

install -d -m 750 -o "$DEPLOY_USER" -g "$DEPLOY_USER" \
  "$BASE_DIR" "$BASE_DIR/edge" "$BASE_DIR/staging" "$BASE_DIR/production" "$BASE_DIR/scripts"
install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "$BASE_DIR/backups"
docker network inspect epiverse-edge >/dev/null 2>&1 || docker network create epiverse-edge >/dev/null

cat <<EOF

Serveur prêt.
  - Docker : $(docker --version)
  - Utilisateur de déploiement : $DEPLOY_USER (groupe docker)
  - Dossiers : $BASE_DIR/{edge,staging,production,scripts,backups}
  - Pare-feu : SSH, 80, 443 uniquement

Suite : infra/README.md, section « Mettre en service le staging ».
EOF
