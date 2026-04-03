# Project Manager

## Overview
Read-only stakeholder dashboard showing project progress. No auth, no backend, no database.
Eric manages all data through Claude Code from any repo. Deployed via GitHub Pages.

## Project Assistant
- Data: `C:\Users\Eric Work\Git\project-manager\data\`
- Read `projects.json` + `templates.json` to understand project state
- Templates contain phase descriptions, effort estimates, and wait types
- When asked "what should I work on": filter to actionable tasks (waitType: null), sort by priority > deadline proximity > phase progress (closer to done = higher value), match effort estimates against available time
- When asked "what's next on X": show current phase, its description, pending tasks in that phase, and what the next phase will be after current completes
- When asked to update: read, modify, write `projects.json`. Keep `updated` date current.
- Priority levels: critical, high, medium, low
- Task statuses: complete, in-progress, pending, blocked
- Phase statuses: complete, in-progress, pending, skipped

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
