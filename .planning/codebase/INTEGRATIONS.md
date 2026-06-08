# External Integrations

**Analysis Date:** 2026-04-17

## APIs & External Services

**Not detected** - This is a read-only stakeholder dashboard with no backend API calls, external service integrations, or SDK dependencies.

## Data Storage

**Databases:**
- None - Not applicable. Application uses static JSON data files.

**File Storage:**
- GitHub Pages static hosting - Final deployment via GitHub Pages at base path `/project-manager/`

**Client-Side Storage:**
- localStorage - Theme preference storage
  - Key: `imperial-theme`
  - Values: `'dark'` or `'light'`
  - Scope: Persistent user preference for dark/light mode toggle

**Caching:**
- Browser caching via GitHub Pages HTTP headers (standard static file caching)

## Authentication & Identity

**Auth Provider:**
- None - Application is public, read-only, no user authentication required

## Monitoring & Observability

**Error Tracking:**
- None - Not integrated

**Logs:**
- Browser console only (development debugging)

## CI/CD & Deployment

**Hosting:**
- GitHub Pages
  - Repository: `ImperialDataDevOps/project-manager`
  - Deployment trigger: Pushes to `main` branch or manual workflow dispatch
  - Base path: `/project-manager/`
  - URL: `https://ImperialDataDevOps.github.io/project-manager/`

**CI Pipeline:**
- GitHub Actions workflow: `.github/workflows/deploy.yml`
  - Trigger: Push to `main` branch or manual workflow dispatch
  - Runner: `ubuntu-latest`
  - Node.js version: 22
  - npm cache: `frontend-react/package-lock.json`
  - Build steps:
    1. Checkout code
    2. Setup Node.js 22 with npm cache
    3. Install dependencies: `npm ci` in `frontend-react/`
    4. Build: `npm run build` in `frontend-react/`
    5. Upload artifact: `frontend-react/dist/`
    6. Deploy to GitHub Pages
  - Permissions: `contents:read`, `pages:write`, `id-token:write`
  - Concurrency: Single deployment at a time (cancel in-progress)

## Environment Configuration

**No runtime environment variables** - Application is entirely static.

**No secrets required** - No API keys, credentials, or authentication tokens needed.

## Webhooks & Callbacks

**Incoming:**
- None - Not applicable

**Outgoing:**
- None - Not applicable

## Data Import/Export

**Input Data:**
- `data/projects.json` - Project portfolio data (updated via Claude from any repository)
- `data/templates.json` - Phase templates and effort estimates

**Output Data:**
- None - Dashboard is read-only, no data export or API output

---

*Integration audit: 2026-04-17*
