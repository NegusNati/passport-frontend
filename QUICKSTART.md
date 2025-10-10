# Quick Start Guide

Fast-track deployment guide for the Passport frontend.

## Server Setup (5 minutes)

### 1. Install Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Log out and back in
```

### 2. Clone & Setup

```bash
# Create directory structure
sudo mkdir -p /opt/passport
sudo chown -R $USER:$USER /opt/passport
cd /opt/passport

# Clone repository
git clone git@github.com:negusnati/passport-frontend.git
# OR: git clone https://github.com/negusnati/passport-frontend.git

# Create data directories
mkdir -p data/npm/data data/npm/letsencrypt data/umami-db
```

### 3. Configure Environment

```bash
# Navigate into repository
cd passport-frontend

# Copy template
cp .env.example .env

# Generate secrets
openssl rand -hex 32  # UMAMI_APP_SECRET
openssl rand -hex 16  # UMAMI_HASH_SALT

# Edit .env with your values
nano .env
```

Required variables in `.env`:
```env
VITE_API_BASE_URL=https://api.passport.et
VITE_SITE_URL=https://passport.et
VITE_SITE_NAME=Passport
POSTGRES_PASSWORD=your-strong-password-here
UMAMI_APP_SECRET=paste-64-char-hex-here
UMAMI_HASH_SALT=paste-32-char-hex-here
DATABASE_URL=postgresql://umami:your-strong-password-here@umami-db:5432/umami
```

### 4. Deploy

```bash
cd /opt/passport/passport-frontend
docker compose up -d
```

### 5. Check Status

```bash
docker compose ps
docker compose logs -f
```

## Post-Deployment Configuration

### Configure Nginx Proxy Manager

1. Open `http://YOUR_SERVER_IP:81`
2. Login: `admin@example.com` / `changeme`
3. **Change password immediately!**
4. Add SSL Certificate (Let's Encrypt):
   - Domains: `passport.et`, `analytics.passport.et`
5. Create Proxy Host for Frontend:
   - Domain: `passport.et`
   - Forward to: `passport-frontend:80`
   - Enable SSL, Force SSL, HTTP/2
6. Create Proxy Host for Analytics:
   - Domain: `analytics.passport.et`
   - Forward to: `umami:3000`
   - Enable SSL, Force SSL, HTTP/2

### Configure Umami Analytics

1. Open `https://analytics.passport.et`
2. Login: `admin` / `umami`
3. **Change password immediately!**
4. Add website: Name=Passport, Domain=passport.et
5. Copy tracking code

## Directory Structure

```
/opt/passport/
├── data/                         # Persistent data
│   ├── npm/                      # Nginx Proxy Manager data
│   └── umami-db/                 # Umami PostgreSQL data
└── passport-frontend/            # Git repository
    ├── .env                      # Environment variables (keep secure!)
    ├── docker-compose.yml        # Orchestration config
    ├── Dockerfile               # Frontend build
    ├── .env.example             # Template
    └── src/                     # Source code
```

## Common Commands

```bash
# Always run from /opt/passport/passport-frontend
cd /opt/passport/passport-frontend

# View logs
docker compose logs -f
docker compose logs -f passport-frontend

# Restart services
docker compose restart
docker compose restart passport-frontend

# Update deployment
git pull
docker compose pull
docker compose build passport-frontend
docker compose up -d

# Stop everything
docker compose down

# Start everything
docker compose up -d
```

## GitHub Actions Auto-Deploy

Add these secrets to your GitHub repository:

- `DEPLOY_HOST`: Your server IP
- `DEPLOY_USER`: SSH username (e.g., `negus`)
- `DEPLOY_SSH_KEY`: Private SSH key content
- `DEPLOY_PORT`: `22` (or your SSH port)

After setup, every push to `main` automatically deploys!

## Troubleshooting

### Services won't start
```bash
# Check logs
docker compose logs

# Verify .env file exists in passport-frontend directory
ls -la /opt/passport/passport-frontend/.env

# Check data directory permissions
ls -la /opt/passport/data/
```

### Frontend build fails
```bash
# Rebuild without cache
docker compose build --no-cache passport-frontend
docker compose up -d passport-frontend
```

### Can't access on port 81
```bash
# Check firewall
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 81/tcp
sudo ufw allow 443/tcp
```

## Need More Details?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive documentation.
