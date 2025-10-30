# Asset Caching Checklist

Use these guidelines when deploying `passport.et` behind your VPS + Cloudflare stack.

## Origin server (Nginx example)

```
location ~* \.(?:js|css|webp|avif|png|jpg|svg|woff2)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
    try_files $uri =404;
}

location / {
    add_header Cache-Control "public, max-age=300";
}

location = /sw.js {
    add_header Cache-Control "no-cache";
}
```

## Cloudflare

- Cache level: **Cache Everything** for `/assets/*` and `/media/*`.
- Edge cache TTL: **1 year** for hashed assets.
- Bypass cache for `/api/*` and dynamic HTML routes.
- Enable Brotli compression and Polish/WebP (lossless).

## Verification

After deploy, run:

```
curl -I https://passport.et/assets/index-<hash>.js
curl -I https://passport.et/media/landing/hero-card-1-768w.avif
```

Expect `Cache-Control: public, max-age=31536000, immutable` and `cf-cache-status: HIT` on repeat requests.
