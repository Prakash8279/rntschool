#!/bin/bash
set -e

DOMAIN="rntpublicschool.in"
EMAIL="prakash8279@gmail.com"

echo "=========================================================="
echo "🔒 Setting up Free SSL (HTTPS) for $DOMAIN..."
echo "=========================================================="

# 1. Install Certbot
echo "📦 Installing Certbot..."
sudo apt-get update -y
sudo apt-get install -y certbot

# 2. Stop Docker temporarily to free port 80 for SSL generation
echo "🛑 Stopping containers temporarily..."
sudo docker compose down

# 3. Generate certificate from Let's Encrypt
echo "📜 Generating SSL certificate for $DOMAIN and www.$DOMAIN..."
sudo certbot certonly --standalone \
  -d $DOMAIN -d www.$DOMAIN \
  --non-interactive --agree-tos -m $EMAIL

# 4. Use SSL Nginx config
echo "⚙️ Configuring Nginx for SSL..."
cp school_frontend/nginx-ssl.conf school_frontend/nginx.conf

# 5. Start containers with SSL
echo "🚀 Restarting containers with HTTPS on port 443..."
sudo docker compose -f docker-compose.yml -f docker-compose.ssl.yml up -d --build

# 6. Auto-renew cron (runs once a month)
(crontab -l 2>/dev/null | grep -v "certbot renew" || true; echo "0 3 1 * * certbot renew --post-hook 'docker compose restart frontend'") | crontab -

echo ""
echo "=========================================================="
echo "🎉 SSL Certificate Successfully Installed!"
echo "👉 Secure Website Live at: https://$DOMAIN"
echo "=========================================================="
