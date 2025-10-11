# GitHub Actions Deployment Guide

Automated deployment workflow for the Passport frontend with zero-downtime strategy.

## Overview

The deployment workflow automatically deploys your frontend when you push to the `main` or `master` branch. It uses a zero-downtime strategy by:

1. Building the new frontend image
2. Scaling to 2 instances (old + new)
3. Waiting for the new instance to be healthy
4. Removing the old instance
5. Keeping only the new instance running

## Required Secrets

Add these secrets in your GitHub repository:
**Settings → Secrets and variables → Actions → New repository secret**

### Required Secrets

| Secret Name      | Description             | Example                               |
| ---------------- | ----------------------- | ------------------------------------- |
| `DEPLOY_HOST`    | Server IP or hostname   | `159.69.107.45` or `passport.et`      |
| `DEPLOY_USER`    | SSH username            | `negus`                               |
| `DEPLOY_SSH_KEY` | Private SSH key content | Full content of your private key file |
| `DEPLOY_PORT`    | SSH port (optional)     | `22` (default)                        |

### Optional Secrets

| Secret Name   | Description     | Default |
| ------------- | --------------- | ------- |
| `DEPLOY_PORT` | Custom SSH port | `22`    |

## Setup SSH Key for GitHub Actions

### 1. Generate SSH Key (if you don't have one)

On your **local machine**:

```bash
# Generate a new SSH key for GitHub Actions
ssh-keygen -t ed25519 -C "github-actions-passport-frontend" -f ~/.ssh/passport-deploy

# This creates two files:
# - ~/.ssh/passport-deploy (private key)
# - ~/.ssh/passport-deploy.pub (public key)
```

### 2. Add Public Key to Server

Copy the public key to your server:

```bash
# Option A: Using ssh-copy-id
ssh-copy-id -i ~/.ssh/passport-deploy.pub negus@159.69.107.45

# Option B: Manual copy
cat ~/.ssh/passport-deploy.pub
# Then on server:
# nano ~/.ssh/authorized_keys
# Paste the public key on a new line
```

### 3. Test SSH Connection

```bash
# Test that the key works
ssh -i ~/.ssh/passport-deploy negus@159.69.107.45

# If successful, you should be logged in without password
```

### 4. Add Private Key to GitHub Secrets

```bash
# Copy private key content
cat ~/.ssh/passport-deploy

# Copy the ENTIRE output including:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ... key content ...
# -----END OPENSSH PRIVATE KEY-----
```

Then add to GitHub:

1. Go to your repository on GitHub
2. **Settings → Secrets and variables → Actions**
3. Click **New repository secret**
4. Name: `DEPLOY_SSH_KEY`
5. Paste the entire private key content
6. Click **Add secret**

### 5. Add Other Secrets

Add the remaining secrets:

```
DEPLOY_HOST: 159.69.107.45
DEPLOY_USER: negus
DEPLOY_PORT: 22 (optional)
```

## Deployment Workflow

The workflow is triggered on:

- **Push to main/master**: Automatic deployment
- **Manual trigger**: Via GitHub Actions UI

### Workflow Steps

1. **Checkout code**: Gets latest code from repository
2. **Pull latest code on server**: Updates code on server
3. **Build new image**: Builds fresh Docker image with latest code
4. **Zero-downtime deployment**:
   - Scales to 2 frontend instances
   - Waits for new instance to be healthy (15 seconds)
   - Scales back to 1 (removes old, keeps new)
5. **Cleanup**: Removes unused images
6. **Status check**: Displays deployment status

### Deployment Timeline

```
Old Container Running
         ↓
Build New Image (30-60s)
         ↓
Start New Container Alongside Old (0s)
         ↓
Wait for Health Check (15s)
         ↓
Remove Old Container (5s)
         ↓
New Container Serving Traffic
```

**Total downtime**: ~0 seconds (both containers run simultaneously)

## Manual Deployment

You can trigger deployment manually:

1. Go to **Actions** tab in GitHub
2. Select **Zero Downtime Deployment to VPS**
3. Click **Run workflow**
4. Select branch (main/master)
5. Click **Run workflow**

## Monitor Deployment

### Via GitHub UI

1. Go to **Actions** tab
2. Click on the latest workflow run
3. Click on the **Deploy Frontend to Server** job
4. Expand **Deploy to VPS** to see logs

### Via Server

SSH into your server and watch logs:

```bash
# Watch deployment logs
cd /opt/passport/passport-frontend
docker compose logs -f passport-frontend

# Check service status
docker compose ps

# View system resources
docker stats
```

## Troubleshooting

### Deployment Fails at SSH Connection

**Error**: `Permission denied (publickey)`

**Solution**:

```bash
# Verify SSH key is correct
cat ~/.ssh/passport-deploy.pub

# Check server authorized_keys
ssh negus@159.69.107.45
cat ~/.ssh/authorized_keys | grep passport-deploy

# Ensure correct permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### Deployment Fails at Git Pull

**Error**: `error: Your local changes would be overwritten`

**Solution**: The workflow uses `git reset --hard` to force update. If this fails:

```bash
# SSH into server
ssh negus@159.69.107.45
cd /opt/passport/passport-frontend

# Check git status
git status

# Force clean
git clean -fd
git reset --hard origin/master
```

### Deployment Succeeds but Site Shows Old Version

**Causes**:

1. Browser cache
2. Cloudflare cache
3. Build didn't include new changes

**Solutions**:

```bash
# On server - rebuild without cache
cd /opt/passport/passport-frontend
docker compose build --no-cache passport-frontend
docker compose up -d passport-frontend

# Clear Cloudflare cache (if using)
# Go to Cloudflare Dashboard → Caching → Purge Everything

# Hard refresh browser: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

### Health Check Timeout

If deployment hangs at health check:

```bash
# Check container health
docker inspect passport-frontend | grep -A 10 Health

# View container logs
docker logs passport-frontend

# Manual health check
curl http://localhost/healthz
```

### Port Conflicts

**Error**: `port is already allocated`

**Solution**:

```bash
# Find process using port 80
sudo lsof -i :80

# If it's an old container, remove it
docker rm -f $(docker ps -aq --filter "publish=80")

# Restart deployment
docker compose up -d
```

## Rollback Strategy

If deployment fails and you need to rollback:

### Option 1: Rollback via GitHub

1. Find the last working commit
2. Go to **Code** tab → Click on that commit
3. Click **Browse files** → **Code** → **Create new branch**
4. Create branch named `rollback-YYYY-MM-DD`
5. Create PR to main
6. Merge PR (triggers deployment)

### Option 2: Manual Rollback on Server

```bash
# SSH into server
ssh negus@159.69.107.45
cd /opt/passport/passport-frontend

# Find previous commit
git log --oneline -10

# Reset to previous commit
git reset --hard <commit-hash>

# Rebuild and restart
docker compose build passport-frontend
docker compose up -d passport-frontend
```

### Option 3: Use Previous Image

```bash
# List available images
docker images | grep passport-frontend

# Tag old image as latest
docker tag passport-frontend-passport-frontend:<old-sha> passport-frontend-passport-frontend:latest

# Restart with old image
docker compose up -d passport-frontend
```

## Best Practices

### Before Pushing to Main

1. **Test locally**:

   ```bash
   pnpm lint
   pnpm typecheck
   pnpm build
   ```

2. **Test Docker build locally**:

   ```bash
   docker compose build passport-frontend
   docker compose up -d passport-frontend
   ```

3. **Review changes**:
   ```bash
   git diff main
   ```

### Monitoring After Deployment

Wait 2-5 minutes after deployment, then check:

```bash
# On server
docker compose ps  # All services should be "Up" and "healthy"
docker logs passport-frontend --tail 50  # Check for errors
docker stats  # Monitor resource usage

# From browser
# Visit https://passport.et
# Check browser console for errors
# Test key features
```

### Multiple Deployments Per Day

If deploying frequently:

1. Use feature branches
2. Test in staging first (if available)
3. Deploy during low-traffic periods
4. Monitor error rates in Umami Analytics
5. Keep an eye on Docker disk usage

## Deployment Checklist

Before every deployment:

- [ ] All tests pass locally
- [ ] Code linted and type-checked
- [ ] Changes tested in development
- [ ] Environment variables updated (if needed)
- [ ] Database migrations run (if needed - backend)
- [ ] Team notified of deployment
- [ ] Monitoring dashboard open
- [ ] Rollback plan ready

After deployment:

- [ ] Site loads correctly
- [ ] No console errors
- [ ] Key features working
- [ ] API calls successful
- [ ] Analytics tracking working
- [ ] Performance acceptable
- [ ] Mobile view tested

## Advanced Configuration

### Custom Build Args

If you need to pass custom build arguments:

Edit `.github/workflows/deploy.yml`:

```yaml
# In the build step
docker compose build --no-cache \
--build-arg VITE_API_BASE_URL=https://api.passport.et \
--build-arg VITE_SITE_URL=https://passport.et \
passport-frontend
```

### Deploy to Multiple Environments

Create separate workflows for staging and production:

- `.github/workflows/deploy-staging.yml` (deploys on push to `develop`)
- `.github/workflows/deploy-production.yml` (deploys on push to `main`)

Use different secrets:

- `STAGING_HOST`, `STAGING_USER`, `STAGING_KEY`
- `PRODUCTION_HOST`, `PRODUCTION_USER`, `PRODUCTION_KEY`

### Slack/Discord Notifications

Add notification step to workflow:

```yaml
- name: Notify Slack
  if: always()
  uses: slackapi/slack-github-action@v1.24.0
  with:
    payload: |
      {
        "text": "Deployment ${{ job.status }}: https://passport.et"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Security Notes

1. **Never commit secrets** to the repository
2. **Rotate SSH keys** quarterly
3. **Use least-privilege** SSH user (not root)
4. **Enable 2FA** on GitHub account
5. **Review deployment logs** for suspicious activity
6. **Keep server updated** with security patches

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [SSH Key Authentication](https://www.ssh.com/academy/ssh/key)
