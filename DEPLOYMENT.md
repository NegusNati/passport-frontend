# Deployment Guide

Complete guide for deploying the Passport frontend with Docker, Nginx Proxy Manager, and Umami Analytics.

## Architecture Overview

```
Internet
   ↓
Nginx Proxy Manager (ports 80/443)
   ↓
├── passport-frontend (React SPA on Nginx)
└── umami (Analytics on port 3000)
       ↓
    umami-db (PostgreSQL)
```

- **Nginx Proxy Manager**: Handles reverse proxy, SSL certificates (Let's Encrypt), and routing
- **Passport Frontend**: Static React app served by Nginx
- **Umami Analytics**: Self-hosted analytics with PostgreSQL backend

## Prerequisites

### Server Requirements
- Ubuntu 22.04 LTS (or similar)
- 2GB+ RAM, 20GB+ storage
- Public IP with DNS A records pointing to your server
- Ports 80, 443, 22 open in firewall

### Required Domains
Configure DNS A records for:
- `passport.et` → Your server IP (frontend)
- `api.passport.et` → Your backend server IP
- `analytics.passport.et` → Your server IP (Umami dashboard)

### Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Add your user to docker group (replace 'deploy' with your username)
sudo usermod -aG docker deploy

# Log out and back in for group changes to take effect

# Verify installation
docker --version
docker compose version
```

## Initial Server Setup

### 1. Create Project Structure

```bash
# Create base directory
sudo mkdir -p /opt/passport
sudo chown -R $USER:$USER /opt/passport
cd /opt/passport

# Clone repository
git clone git@github.com:yourusername/passport-frontend.git
# OR with HTTPS:
# git clone https://github.com/yourusername/passport-frontend.git

# Create data directories
mkdir -p data/npm/data data/npm/letsencrypt data/umami-db
```

### 2. Configure Environment Variables

```bash
# Navigate into the repository
cd passport-frontend

# Copy environment template
cp .env.example .env

# Generate secure secrets
openssl rand -hex 32  # For UMAMI_APP_SECRET
openssl rand -hex 16  # For UMAMI_HASH_SALT

# Edit .env file
nano .env
```

Update `.env` with your values:

```env
# Frontend build variables
VITE_API_BASE_URL=https://api.passport.et
VITE_SITE_URL=https://passport.et
VITE_SITE_NAME=Passport

# Umami database
POSTGRES_DB=umami
POSTGRES_USER=umami
POSTGRES_PASSWORD=your-strong-password-here

# Umami app secrets (use your generated values)
UMAMI_APP_SECRET=your-64-char-hex-here
UMAMI_HASH_SALT=your-32-char-hex-here

# Umami database URL (must match password above)
DATABASE_URL=postgresql://umami:your-strong-password-here@umami-db:5432/umami
```

### 3. Initial Deployment

```bash
# Make sure you're in the passport-frontend directory
cd /opt/passport/passport-frontend

# Verify .env exists in this directory
ls -la .env

# Start all services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

## Nginx Proxy Manager Configuration

### 1. Access Admin UI

Open `http://your-server-ip:81` in your browser.

**Default credentials:**
- Email: `admin@example.com`
- Password: `changeme`

**⚠️ Change these immediately after first login!**

### 2. Configure SSL Certificates

1. Go to **SSL Certificates** → **Add SSL Certificate**
2. Select **Let's Encrypt**
3. Add your domains:
   - `passport.et`
   - `analytics.passport.et`
4. Enable **Use a DNS Challenge** if using wildcard certs (optional)
5. Agree to Let's Encrypt Terms
6. Click **Save**

### 3. Create Proxy Hosts

#### Frontend Proxy Host

1. Go to **Hosts** → **Proxy Hosts** → **Add Proxy Host**
2. Configure:
   - **Domain Names:** `passport.et`, `www.passport.et`
   - **Scheme:** `http`
   - **Forward Hostname/IP:** `passport-frontend`
   - **Forward Port:** `80`
   - **Cache Assets:** ✓ Enabled
   - **Block Common Exploits:** ✓ Enabled
   - **Websockets Support:** ✓ Enabled
3. **SSL Tab:**
   - **SSL Certificate:** Select your certificate
   - **Force SSL:** ✓ Enabled
   - **HTTP/2 Support:** ✓ Enabled
   - **HSTS Enabled:** ✓ Enabled
4. Click **Save**

#### Umami Analytics Proxy Host

1. Add another Proxy Host
2. Configure:
   - **Domain Names:** `analytics.passport.et`
   - **Scheme:** `http`
   - **Forward Hostname/IP:** `umami`
   - **Forward Port:** `3000`
   - **Block Common Exploits:** ✓ Enabled
   - **Websockets Support:** ✓ Enabled
3. **SSL Tab:**
   - **SSL Certificate:** Select your certificate
   - **Force SSL:** ✓ Enabled
   - **HTTP/2 Support:** ✓ Enabled
4. Click **Save**

## Umami Analytics Setup

### 1. Initial Setup

1. Open `https://analytics.passport.et`
2. Login with default credentials:
   - Username: `admin`
   - Password: `umami`
3. **⚠️ Change password immediately!**

### 2. Add Website

1. Go to **Settings** → **Websites** → **Add Website**
2. Configure:
   - **Name:** Passport
   - **Domain:** `passport.et`
   - **Enable Share URL:** Optional
3. Click **Save**
4. Copy the **Tracking Code**

### 3. Integrate with Frontend

Add the tracking script to your `index.html`:

```html
<!-- Umami Analytics -->
<script
  defer
  src="https://analytics.passport.et/script.js"
  data-website-id="your-website-id"
></script>
```

Or use environment variable in a component:

```tsx
// src/shared/components/Analytics.tsx
import { useEffect } from 'react'

export function Analytics() {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://analytics.passport.et/script.js'
    script.setAttribute('data-website-id', 'your-website-id')
    script.defer = true
    document.head.appendChild(script)
  }, [])
  return null
}
```

## GitHub Actions CI/CD

### 1. Setup Repository Secrets

Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**

Add these secrets:

- `DEPLOY_HOST`: Your server IP or hostname
- `DEPLOY_USER`: SSH user (e.g., `deploy`)
- `DEPLOY_SSH_KEY`: Private SSH key content
- `DEPLOY_PORT`: SSH port (default: `22`)

### 2. Generate SSH Key (if needed)

On your local machine:

```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/deploy_key

# Copy public key to server
ssh-copy-id -i ~/.ssh/deploy_key.pub deploy@your-server-ip

# Copy private key content for GitHub secret
cat ~/.ssh/deploy_key
```

### 3. Test Deployment

Push to `main` or `master` branch:

```bash
git add .
git commit -m "feat: add deployment configuration"
git push origin main
```

GitHub Actions will automatically:
1. Pull latest code on server
2. Rebuild frontend container
3. Restart services with zero downtime

## Manual Operations

### View Logs

```bash
cd /opt/passport/passport-frontend

# All services
docker compose logs -f

# Specific service
docker compose logs -f passport-frontend
docker compose logs -f umami
docker compose logs -f nginx-proxy-manager
```

### Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart passport-frontend
```

### Update Services

```bash
cd /opt/passport/passport-frontend

# Pull latest code and images
git pull
docker compose pull

# Rebuild frontend
docker compose build passport-frontend

# Restart
docker compose up -d
```

### Stop/Start Services

```bash
# Stop all
docker compose down

# Start all
docker compose up -d

# Stop specific service
docker compose stop passport-frontend
docker compose start passport-frontend
```

## Backup & Restore

### Backup Script

Create `/opt/passport/backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/opt/backups/passport"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

# Backup volumes
docker run --rm \
  -v /opt/passport/data/npm:/data \
  -v "$BACKUP_DIR:/backup" \
  alpine tar czf "/backup/npm_${DATE}.tar.gz" /data

docker run --rm \
  -v /opt/passport/data/umami-db:/data \
  -v "$BACKUP_DIR:/backup" \
  alpine tar czf "/backup/umami-db_${DATE}.tar.gz" /data

echo "Backup completed: $BACKUP_DIR"
```

Make it executable and schedule with cron:

```bash
chmod +x /opt/passport/backup.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add line:
0 2 * * * /opt/passport/backup.sh
```

### Restore from Backup

```bash
# Stop services
docker compose down

# Restore data
tar xzf /opt/backups/passport/npm_20240101_020000.tar.gz -C /opt/passport/data/npm
tar xzf /opt/backups/passport/umami-db_20240101_020000.tar.gz -C /opt/passport/data/umami-db

# Start services
docker compose up -d
```

## Monitoring

### Check Service Health

```bash
# All services status
docker compose ps

# Service health
docker inspect passport-frontend | grep -A 10 Health
docker inspect umami | grep -A 10 Health
```

### Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df
```

## Troubleshooting

### Frontend Not Loading

```bash
# Check container logs
docker compose logs passport-frontend

# Rebuild without cache
docker compose build --no-cache passport-frontend
docker compose up -d passport-frontend
```

### SSL Certificate Issues

1. Check DNS records point to correct IP
2. Verify ports 80/443 are open
3. Check Nginx Proxy Manager logs:
   ```bash
   docker compose logs nginx-proxy-manager
   ```

### Umami Database Connection Issues

```bash
# Check database is running
docker compose ps umami-db

# Check database logs
docker compose logs umami-db

# Verify DATABASE_URL in .env matches credentials
```

### Permission Issues

```bash
# Fix data directory permissions
sudo chown -R $USER:$USER /opt/passport/data
```

## Security Best Practices

1. **Change default passwords** immediately after deployment
2. **Enable UFW firewall:**
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```
3. **Regular updates:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   docker compose pull
   docker compose up -d
   ```
4. **Monitor logs** regularly for suspicious activity
5. **Setup automated backups** (see Backup section)
6. **Use strong passwords** for all services
7. **Keep SSH keys secure** and rotate regularly

## Maintenance

### Monthly Tasks
- [ ] Review logs for errors
- [ ] Check SSL certificate expiry (NPM auto-renews)
- [ ] Update Docker images
- [ ] Verify backups are working
- [ ] Review analytics for anomalies

### Quarterly Tasks
- [ ] Security audit
- [ ] Rotate SSH keys
- [ ] Review and update dependencies
- [ ] Load testing

## Resources

- [Nginx Proxy Manager Docs](https://nginxproxymanager.com/guide/)
- [Umami Documentation](https://umami.is/docs)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Let's Encrypt](https://letsencrypt.org/)

## Support

For issues with:
- **Frontend:** Check repository issues
- **Nginx Proxy Manager:** https://github.com/NginxProxyManager/nginx-proxy-manager
- **Umami:** https://github.com/umami-software/umami
