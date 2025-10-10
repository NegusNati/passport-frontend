# ============================================
# Stage 1: Build the application
# ============================================
FROM node:20-alpine AS builder

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package manifests
COPY package.json pnpm-lock.yaml ./

# Install dependencies with frozen lockfile for reproducibility
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build arguments for environment variables (baked into the bundle at build time)
ARG VITE_API_BASE_URL=https://api.passport.et
ARG VITE_SITE_URL=https://passport.et
ARG VITE_SITE_NAME=Passport
ARG VITE_HORIZON_URL

# Make build args available to Vite
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_SITE_URL=$VITE_SITE_URL
ENV VITE_SITE_NAME=$VITE_SITE_NAME
ENV VITE_HORIZON_URL=$VITE_HORIZON_URL

# Build the application
RUN pnpm build

# ============================================
# Stage 2: Serve with Nginx
# ============================================
FROM nginx:1.27-alpine

# Copy custom nginx configuration
COPY docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Expose port 80 (TLS handled by Nginx Proxy Manager)
EXPOSE 80

# Start nginx (foreground mode for Docker)
CMD ["nginx", "-g", "daemon off;"]
