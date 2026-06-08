# Technology Stack

**Analysis Date:** 2026-04-17

## Languages

**Primary:**
- TypeScript 5.9.3 - Source code for React application and configuration files
- CSS 4 (via Tailwind CSS) - Styling and theme system

**Secondary:**
- JSON - Data files for projects and templates

## Runtime

**Environment:**
- Node.js 22 (specified in GitHub Actions workflow)

**Package Manager:**
- npm 10 (per environment configuration)
- Lockfile: `frontend-react/package-lock.json` present

## Frameworks

**Core:**
- React 19.2.0 - UI framework and component rendering
- React DOM 19.2.0 - DOM rendering for React applications

**Styling:**
- Tailwind CSS 4.2.1 - Utility-first CSS framework with `@tailwindcss/vite` v4.2.1 plugin for Vite integration

**State Management:**
- Zustand 5.0.11 - Lightweight client-side state management (UI state: expanded project, completed section visibility)

**Build/Dev:**
- Vite 7.3.1 - Build tool and dev server
- `@vitejs/plugin-react` 5.1.1 - React plugin for Vite with Fast Refresh support

**Icons:**
- `lucide-react` 0.468.0 - SVG icon library

## Key Dependencies

**Critical:**
- `react` 19.2.0 - Core React library
- `zustand` 5.0.11 - State management for UI interactions (project expansion, dark/light mode toggle)
- `tailwindcss` 4.2.1 - Styling engine

**Build/Development:**
- `typescript` 5.9.3 - Type checking (strict mode enabled)
- `eslint` 9.39.0 - Code linting
- `@eslint/js` 9.39.0 - ESLint recommended rules
- `typescript-eslint` 8.34.0 - TypeScript support in ESLint
- `eslint-plugin-react-hooks` 5.2.0 - ESLint rules for React Hooks
- `eslint-plugin-react-refresh` 0.4.20 - ESLint rules for Vite React refresh
- `@types/react` 19.2.7 - TypeScript definitions for React
- `@types/react-dom` 19.0.0 - TypeScript definitions for React DOM
- `@types/node` 25.5.2 - TypeScript definitions for Node.js APIs
- `globals` 16.1.0 - Global variable definitions for ESLint

## Configuration

**Environment:**
- No runtime environment variables required
- Theme preference stored in `localStorage` key: `imperial-theme` (values: `dark` or `light`)
- Build output directory: `frontend-react/dist/`

**Build:**
- TypeScript compilation: `tsc -b` (project references)
- Vite configuration: `vite.config.ts`
  - Base path: `/project-manager/` (GitHub Pages deployment)
  - Path alias: `@/*` → `src/*`
  - React Fast Refresh enabled
  - Tailwind CSS processing via Vite plugin

**ESLint Configuration:**
- Flat config format (ESLint 9)
- Files: `**/*.{ts,tsx}`
- Extends: recommended presets from `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- Ignores: `dist/` directory
- Browser environment globals enabled

## Platform Requirements

**Development:**
- Node.js 22
- npm 10
- Windows 11 Pro (user environment)
- Bash/Unix shell syntax

**Production:**
- Deployment: GitHub Pages via GitHub Actions
- Static file hosting - no runtime server required
- Base URL path: `/project-manager/`

## Build Output

- **Input:** `frontend-react/src/`
- **Output:** `frontend-react/dist/` (committed to repository for GitHub Pages)
- **Build steps:**
  1. TypeScript type checking: `tsc -b`
  2. Vite build: bundles React, compiles styles, optimizes assets
  3. Output served from `dist/` directory via GitHub Pages

---

*Stack analysis: 2026-04-17*
