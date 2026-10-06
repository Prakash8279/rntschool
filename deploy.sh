#!/bin/bash
set -e

# ==============================================================================
# RNT School Management System - One-Click Deployment Script for AWS EC2
# Supported OS: Ubuntu 20.04 / 22.04 / 24.04 LTS, Debian 11/12, Amazon Linux 2023
# ==============================================================================

echo "=========================================================="
echo "🚀 Starting RNT School Deployment on AWS EC2..."
echo "=========================================================="

# 0. Setup Swap Memory (Crucial for 1GB RAM instances like t3.micro to prevent freeze)
if ! swapon --show | grep -q "/swapfile"; then
    echo "🧠 Setting up 4GB Swap memory to prevent RAM freeze..."
    if [ ! -f /swapfile ]; then
        sudo fallocate -l 4G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=4096
        sudo chmod 600 /swapfile
        sudo mkswap /swapfile
    fi
    sudo swapon /swapfile
    grep -q "/swapfile" /etc/fstab || echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "✅ 4GB Swap memory activated!"
else
    echo "✅ Swap memory already active."
fi

# 1. Update OS packages
echo "📦 Updating system packages..."
sudo apt-get update -y || sudo yum update -y

# 2. Check and Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "🐳 Docker not found. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    sudo systemctl enable docker
    sudo systemctl start docker
    rm -f get-docker.sh
    echo "✅ Docker installed successfully!"
else
    echo "✅ Docker is already installed."
fi

# 3. Check and Install Docker Compose plugin
if ! docker compose version &> /dev/null; then
    echo "📦 Installing Docker Compose plugin..."
    sudo apt-get install -y docker-compose-plugin || sudo yum install -y docker-compose-plugin
fi

# 4. Setup .env file if missing
if [ ! -f ".env" ]; then
    echo "⚙️ Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️ NOTE: Please review and update passwords in .env for production safety!"
fi

# 5. Build and run containers
echo "🔨 Building and starting Docker containers..."
if [ -d "/etc/letsencrypt/live" ]; then
    echo "🔒 SSL certificates detected, starting with HTTPS..."
    sudo docker compose -f docker-compose.yml -f docker-compose.ssl.yml up -d --build
else
    sudo docker compose up -d --build
fi

# 6. Check container status
echo ""
echo "📊 Checking container health..."
sleep 5
sudo docker compose ps

echo ""
echo "=========================================================="
echo "🎉 Deployment Completed Successfully!"
echo "👉 Your school application is running on port 80!"
echo "👉 Access via browser: http://$(curl -s http://checkip.amazonaws.com || curl -s ifconfig.me)"
echo "=========================================================="
