# ChatGPT App

This repo now includes a ChatGPT app surface focused on Ethiopian passport lookup.

## What it ships

- `chatgpt/server/src/index.ts`: streamable HTTP MCP server exposed at `/mcp`
- `chatgpt/server/src/passport-api.ts`: server-side passport search and detail adapters
- `chatgpt/widget/`: dedicated React widget bundle rendered inside ChatGPT

## Tool surface

- `search_passports`: read-only search by request number, name, query, or location
- `get_passport_details`: read-only detail lookup for a selected passport id
- `render_passport_results`: render the widget from a prior search result set

## Local run

1. Build the widget bundle:

```bash
pnpm chatgpt:build
```

2. Start the MCP server:

```bash
pnpm chatgpt:serve
```

3. Confirm the local endpoints:

- Health: `http://localhost:8787/`
- MCP: `http://localhost:8787/mcp`

4. Test with MCP Inspector:

```bash
npx @modelcontextprotocol/inspector@latest --server-url http://localhost:8787/mcp --transport http
```

5. Expose the local MCP endpoint over HTTPS, for example:

```bash
ngrok http 8787
```

6. In ChatGPT, on April 16, 2026, the current docs say to enable Developer Mode under `Settings -> Apps & Connectors -> Advanced settings`, then create a new app using the tunneled HTTPS URL plus `/mcp`.

## Environment variables

- `PORT`: optional MCP server port, defaults to `8787`
- `MCP_PATH`: optional MCP path, defaults to `/mcp`
- `PASSPORT_API_BASE_URL`: optional API origin, defaults to `https://api.passport.et`
- `PASSPORT_SITE_URL`: optional public site origin, defaults to `https://passport.et`
- `CHATGPT_WIDGET_DOMAIN`: optional dedicated widget origin for submission-ready deployments

## Production deployment

The VPS deployment now includes a dedicated `passport-chatgpt-app` Docker service built from [Dockerfile.chatgpt](/Users/negusnati/Documents/dev/personal/passport/passport-frontend/Dockerfile.chatgpt).

- The GitHub Actions workflow at [.github/workflows/deploy.yml](/Users/negusnati/Documents/dev/personal/passport/passport-frontend/.github/workflows/deploy.yml) now validates the ChatGPT app build before deploy, then rebuilds and rolls out both `passport-frontend` and `passport-chatgpt-app`.
- Docker Compose exposes the MCP server internally as `passport-chatgpt-app` on port `8787`; configure Nginx Proxy Manager to route your public ChatGPT app host to that service and forward `/mcp`.
- Set `CHATGPT_WIDGET_DOMAIN` to your public ChatGPT app origin once that host exists.
- Keep `PASSPORT_API_BASE_URL` aligned with the API origin you want ChatGPT to call; the widget CSP now follows that env var instead of assuming production only.
