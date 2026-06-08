# Project Manager

## Overview
Read-only stakeholder dashboard showing project progress. No auth, no backend, no database.
Eric manages all data through Claude Code from any repo. Deployed via GitHub Pages.

## Project Assistant
- Cross-repo update/query instructions: global CLAUDE.md § Project Manager
- Templates: `data/templates.json` — phase descriptions, effort estimates, wait types
- New projects added only from this repo; cross-repo handles status updates and queries

## Stack
- React 19 + TypeScript (strict) + Vite + Tailwind CSS v4
- `@imperial/ui` for design tokens, theme, shared components
- `@imperial/hooks` for cn utility, theme store
- Zustand 5 for UI state
- No backend, no React Router
- Data imported as JSON at build time

## Deployment
- GitHub Pages via GitHub Actions
- Build: `cd frontend-react && npm ci && npm run build`
- Output: `frontend-react/dist/`
- Base path: `/project-manager/`

## Domain (Design System)
- No app-level domain accent; each project card uses its own domain color
- Dark mode default, light mode toggle

## Shared Packages
- `@imperial/ui@1.3.0`
- `@imperial/hooks@0.2.0`

## Version Context
- `1.0.0` = initial release of project dashboard

## Planned: Workflow Integration Upgrade

### Why
The Imperial Workflow System (`/imp-new-project`, `/imp-plan-phase`, phase transitions) now creates and updates tracker entries automatically. The tracker was built for manual updates via conversation — it works, but the data model assumes fixed lifecycle templates per category. Workflow integration produces variable phase counts and names per project, matched against a canonical store (`data/phase-names.json`). The tracker needs to support this without breaking existing projects.

### Schema Change: phases
Current: `"phases": { "interview": "complete", "backend": "pending" }` — unordered object, display labels resolved at render time via `templates.json` lifecycle lookup.

New: `"phases": [ { "id": "interview", "label": "Stakeholder Interview", "status": "complete" }, ... ]` — ordered array, each phase carries its own label. No template lookup. Variable length per project.

### Migration
Expand every existing project's phases object into the new array format using its category's lifecycle from `templates.json` as the id→label+order mapping. One-time data transform. Verify every project renders identically after migration.

### templates.json
Remove `lifecycles` section. Keep `domains` (frontend needs domain colors). Lifecycle templates are fully replaced by per-project phase arrays and the canonical name store.

### phase-names.json
Change from bare strings to objects: `{ "name": "interview", "label": "Stakeholder Interview" }`. Workflow proposes labels alongside IDs when creating tracker phases. Novel names get user-approved labels appended automatically.

### Frontend
Read phases as array, render in array order, use embedded `label` for display. No lifecycle template lookup. Handle both old format (object) and new format (array) during migration period if needed, or migrate data first and ship frontend second.

### CLAUDE.md Updates (global + project)
- Standard project creation path: workflow (`/imp-new-project` auto-creates entry with phases from roadmap)
- Manual path: conversation where user provides phase names and labels explicitly
- Cross-repo updates: unchanged (any repo can update status via Claude)
- `templates.json` lifecycles: deprecated, removed after migration

### Task Breakdown
1. Migrate `projects.json` — expand all existing project phases to array format using template data
2. Update `phase-names.json` — change from bare strings to `{ name, label }` objects
3. Update frontend — read phases as array, render with embedded labels, remove lifecycle lookup
4. Remove `lifecycles` from `templates.json`
5. Update global CLAUDE.md § Project Manager to reflect new schema and workflow-first creation
6. Update this CLAUDE.md to reflect new data model
