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
