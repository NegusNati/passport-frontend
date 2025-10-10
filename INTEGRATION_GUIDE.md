# Integration Guide: Backend + Frontend + NPM

Guide to integrate the Passport frontend with your existing Laravel backend using Nginx Proxy Manager.

## Current Setup

You have:
- **Laravel backend** running on port 80/443 (laraveldockerprod)
- **Passport frontend** trying to start with NPM on port 80/443 (conflict!)

## Solution: NPM as Central Reverse Proxy

Let Nginx Proxy Manager handle ALL external traffic (80/443) and route to both services.

```
Internet (80/443)
      ↓
Nginx Proxy Manager
      ↓
├── api.passport.et → Laravel Backend (internal)
├── passport.et → Frontend (internal)
└── analytics.passport.et → Umami (internal)
```

## Step-by-Step Integration

### 1. Stop All Services

```bash
# Stop frontend (if running)
cd /opt/passport/passport-frontend
docker compose down

# Stop backend
cd /path/to/your/laravel/directory  # wherever your backend is
docker compose down
```

### 2. Start Frontend First (NPM will claim ports 80/443)

```bash
cd /opt/passport/passport-frontend
docker compose up -d

# Verify NPM is running on ports 80/443/81
docker compose ps
```

### 3. Modify Backend Docker Compose

Edit your Laravel backend's `docker-compose.yml`:

```yaml
networks:
  laravel:
    driver: bridge
  # Connect to NPM's network
  passport-web:
    external: true
    name: passport-frontend_web

services:
  app:
    build:
      context: ./dockerfiles
      dockerfile: nginx.dockerfile
      args:
        - UID=${UID:-1000}
        - GID=${GID:-1000}
    # COMMENT OUT port mappings - NPM handles external access
    # ports:
    #   - "80:80"
    #   - "443:443"
    volumes:
      - ./src:/var/www/html:delegated
      - ./certificates:/etc/nginx/ssl:ro
    depends_on:
      - php
      - mysql
      - redis
    networks:
      - laravel
      - passport-web  # Add this line
    # Add a container name for easy reference
    container_name: laravel-nginx

  # ... rest of your services unchanged
```

### 4. Start Backend

```bash
cd /path/to/your/laravel/directory
docker compose up -d

# Verify backend is running (no port 80/443 exposed)
docker compose ps
```

You should see the backend nginx with NO port mappings, just connected to networks.

### 5. Configure Nginx Proxy Manager

Open `http://YOUR_SERVER_IP:81`

**Login:** `admin@example.com` / `changeme`

**⚠️ Change password immediately!**

#### A. Add SSL Certificates

1. Go to **SSL Certificates** → **Add SSL Certificate**
2. Select **Let's Encrypt**
3. Add domains:
   - `api.passport.et`
   - `passport.et`
   - `analytics.passport.et`
4. Enter your email
5. Agree to Terms of Service
6. Click **Save**

#### B. Create Proxy Host for Backend API

1. Go to **Hosts** → **Proxy Hosts** → **Add Proxy Host**
2. **Details Tab:**
   - **Domain Names:** `api.passport.et`
   - **Scheme:** `http`
   - **Forward Hostname/IP:** `laravel-nginx` (or your backend container name)
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

#### C. Create Proxy Host for Frontend

1. Add another Proxy Host
2. **Details Tab:**
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

#### D. Create Proxy Host for Umami Analytics

1. Add another Proxy Host
2. **Details Tab:**
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

### 6. Verify Everything Works

```bash
# Check all containers are running
docker ps

# Test backend API (should redirect to HTTPS)
curl -I http://api.passport.et

# Test frontend (should redirect to HTTPS)
curl -I http://passport.et

# Test analytics (should redirect to HTTPS)
curl -I http://analytics.passport.et
```

## Alternative: Minimal Change Solution

If you don't want to modify your backend setup, use **different ports** for NPM:

### Edit Frontend's docker-compose.yml

```yaml
nginx-proxy-manager:
  image: jc21/nginx-proxy-manager:latest
  container_name: nginx-proxy-manager
  restart: unless-stopped
  ports:
    - '8080:80'    # NPM HTTP on 8080
    - '8443:443'   # NPM HTTPS on 8443
    - '81:81'      # Admin UI
  # ... rest unchanged
```

Then access:
- **NPM Admin:** `http://SERVER_IP:81`
- **Frontend:** `http://SERVER_IP:8080` or `https://SERVER_IP:8443`
- **Backend:** `http://SERVER_IP:80` (as before)

But you'd need to point DNS to different ports, which is not ideal for production.

## Recommended Setup

**Use the first approach** - let NPM handle all external traffic on 80/443:

```
External Traffic (80/443) → NPM
                             ├─→ api.passport.et → Laravel Backend
                             ├─→ passport.et → Frontend
                             └─→ analytics.passport.et → Umami

All traffic uses proper SSL/TLS from Let's Encrypt
```

## Troubleshooting

### Backend not accessible through NPM

```bash
# Check if backend container is on passport-web network
docker network inspect passport-frontend_web

# Should show your laravel-nginx container
```

### DNS not resolving

```bash
# Check DNS records
nslookup api.passport.et
nslookup passport.et
nslookup analytics.passport.et

# All should point to your server IP
```

### SSL certificate issues

1. Verify DNS points to server
2. Ensure ports 80/443 are accessible (not blocked by firewall)
3. Check NPM logs: `docker logs nginx-proxy-manager`

## Network Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Internet (80/443)                         │
└────────────────────────────┬────────────────────────────────┘
                             │
                   ┌─────────▼──────────┐
                   │ Nginx Proxy Manager│
                   │  (Let's Encrypt)   │
                   └────┬──────┬────┬───┘
                        │      │    │
         ┌──────────────┘      │    └──────────────┐
         │                     │                   │
┌────────▼─────────┐  ┌────────▼────────┐  ┌──────▼────────┐
│ Laravel Backend  │  │ React Frontend  │  │ Umami         │
│ (internal:80)    │  │ (internal:80)   │  │ (internal:3000│
│                  │  │                 │  │               │
│ ┌──────┐        │  │                 │  │ ┌───────────┐ │
│ │MySQL │        │  │                 │  │ │PostgreSQL │ │
│ └──────┘        │  │                 │  │ └───────────┘ │
│ ┌──────┐        │  │                 │  │               │
│ │Redis │        │  │                 │  │               │
│ └──────┘        │  │                 │  │               │
└──────────────────┘  └─────────────────┘  └───────────────┘
```

## Files to Update

1. **Backend:** `docker-compose.yml` - add network, remove port mappings
2. **Frontend:** Already configured correctly
3. **NPM:** Configure via web UI at port 81

Once configured, everything will be accessible via HTTPS with automatic certificate renewal!
