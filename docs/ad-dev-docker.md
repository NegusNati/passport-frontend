# Local Ad Feature Docker Stack

This stack is for testing the dynamic advertisement feature locally across the React frontend and Laravel backend.

It runs:

- Frontend Vite dev server: http://localhost:3000
- Laravel API through Nginx: http://localhost:8080
- MariaDB dev database: localhost:33306
- Redis: localhost:36379
- Queue worker for ad impression/click jobs

The compose file lives in the frontend repo and mounts the backend repo from `../../passport.et/src`.

## First Run

```bash
cp .env.ad-dev.example .env.ad-dev
pnpm ad:dev:setup
pnpm ad:dev:up
```

The setup command installs backend Composer dependencies, runs migrations, links storage, creates permissions, creates an admin user, and seeds local ad slots plus sample creatives.

Admin login for local testing:

```text
Phone: 0911111111
Password: password
```

## Test The Ad Flow

1. Open http://localhost:3000.
2. Confirm the home ad slots render dynamic seeded creatives.
3. Log in at http://localhost:3000/login with the local admin user.
4. Open http://localhost:3000/admin/advertisements.
5. Create or edit ads with a slot code, target URL, alt text, and desktop/mobile creatives.
6. Check the public API directly:

```bash
curl 'http://localhost:8080/api/v1/advertisements/slots?codes[]=home-alerts-banner&codes[]=home-download-app'
```

## Run Backend Ad Tests

```bash
pnpm ad:dev:test:backend
```

The test runner uses the `passport_ad_test` database created by `docker/ad-dev/mysql-init/01-create-test-db.sql`.

## Stop The Stack

```bash
pnpm ad:dev:down
```

To reset all local data:

```bash
docker compose --env-file .env.ad-dev -f docker-compose.ad-dev.yml down -v
```
