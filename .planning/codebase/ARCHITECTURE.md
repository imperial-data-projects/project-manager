# Architecture

**Analysis Date:** 2026-04-17

## Pattern Overview

**Overall:** Presentational React dashboard with static data import and UI-driven state management

**Key Characteristics:**
- Zero backend; data imported at build time from JSON files
- Single-page view composition with progressive disclosure (expand/collapse)
- Domain-aware UI tokens and accent colors per project category
- Zustand for lightweight UI state (expand/collapse toggle, theme preference)
- No API calls; static site deployed to GitHub Pages

## Layers

**Presentation Layer:**
- Purpose: Render project cards, sections, and visualizations
- Location: `src/components/`
- Contains: React components for layout, cards, phase steppers, status indicators
- Depends on: Type definitions, progress helpers, UI store
- Used by: App root component

**Data & State Layer:**
- Purpose: Project data import, UI state management, progress calculations
- Location: `src/stores/ui-store.ts`, `src/lib/progress.ts`
- Contains: Zustand store for expand/collapse, helper functions for phase/workstream progress
- Depends on: Type definitions
- Used by: Components throughout app

**Type Layer:**
- Purpose: Define shape of projects, templates, domain/phase data
- Location: `src/types/index.ts`
- Contains: TypeScript interfaces for Project, Templates, Phases, Tasks, Vendsys workstreams
- Depends on: Nothing
- Used by: All layers

**Static Data Layer:**
- Purpose: Project metadata and lifecycle templates
- Location: `data/projects.json`, `data/templates.json` (imported at build time)
- Contains: Active/completed projects, phase lifecycle definitions per project type, domain definitions
- Deployed via: Vite JSON import → bundled into JS

**Styling Layer:**
- Purpose: Design tokens and theme management
- Location: `src/globals.css` (Tailwind v4 @theme block)
- Contains: Color palette (light/dark), domain accent colors, feedback tokens (success/warning/error/info)
- Depends on: Tailwind CSS v4
- Used by: Components via utility classes

## Data Flow

**Page Load:**

1. Browser requests `/project-manager/`
2. Vite dev server or GitHub Pages serves `index.html`
3. React renders App root
4. App imports `data/projects.json` and `data/templates.json` (at build time, bundled into JS)
5. App filters projects by category (application, auto-report, powerbi, vendsys)
6. UI renders SummarySection, CategorySections (one per category), CompletedSection
7. Zustand store initialized with default state (no expanded projects, completed hidden)

**User Interaction (Expand Project):**

1. Click ProjectCard or VendsysCard
2. onClick calls `useUiStore(s) => s.toggleProject(projectId)`
3. Zustand updates `expandedProject` state
4. Component re-renders with expanded detail section visible

**Theme Toggle:**

1. User clicks ThemeToggle button
2. Toggles `isDark` state in local component state
3. useEffect adds/removes `dark` class on `<html>` element
4. Stores preference in `localStorage` under `imperial-theme` key
5. CSS variables auto-swap for dark mode via `.dark { --color-X: ... }`

**State Management:**

- UI state only: which project is expanded, theme preference (light/dark), completed section visibility
- No derived state; progress calculations computed fresh from data on every render
- Zustand store persists across navigation (not applicable here; single-page app)

## Key Abstractions

**Project Lifecycle:**
- Purpose: Define phase sequence for application/auto-report/powerbi/vendsys projects
- Examples: `application` has 9 phases (interview → production); `vendsys` has workstreams + lockdown milestones
- Pattern: Templates define phases; Project instances track status per phase (pending/in-progress/complete/skipped)

**Progress Helpers:**
- Purpose: Calculate visible metrics from raw project data
- Examples: `getPhaseProgress()` counts completed phases; `deriveWorkstreamStatus()` derives "clean"/"in-progress"/"pending" from task states
- Pattern: Pure functions, side-effect free, reusable across components

**Domain:**
- Purpose: Business unit affiliation with visual color identity
- Examples: Operations (ocean blue), Merchandising (rose), Logistics (umber), etc.
- Pattern: Domain stored on Project; templates provide Domain definition with color + label; components map color to Tailwind class

**Status Chip:**
- Purpose: Surface blocking issues or awaiting conditions
- Examples: "awaiting approval", "blocked on stakeholder feedback", "not started"
- Pattern: Optional property on Project; displayed on card header and in summary dashboard

**Vendsys Workstream:**
- Purpose: Track handoff status for Vendsys transition tasks
- Examples: "systems documentation", "user training", "cutover preparation"
- Pattern: Tasks owned by "me" (internal) or "them" (branch); status: pending → submitted (handed off) → complete
- Recurring workstreams use `lastAudit` date instead of task-level completion

## Entry Points

**App Root:**
- Location: `src/App.tsx`
- Triggers: Browser loads `/project-manager/`
- Responsibilities: Import data, filter by category, render layout sections

**Main:**
- Location: `src/main.tsx`
- Triggers: Before App
- Responsibilities: Create React root, mount App to DOM

**Build:**
- Location: `vite.config.ts`
- Triggers: `npm run build`
- Responsibilities: Bundle React + Tailwind, import JSON data, output to `dist/`, set base path to `/project-manager/`

## Error Handling

**Strategy:** Graceful fallback to sensible defaults

**Patterns:**
- Missing phase template: display phase ID instead of label (getPhaseLabel)
- Missing domain: use muted gray accent color instead of colored (ProjectCard accent selector)
- Null deadline: omit from subtitle, sort to end of list
- Missing group: show category label instead (getGroupName)

## Cross-Cutting Concerns

**Formatting:** 
- Date formatting (deadline, updated, lockdown dates) centralized in `src/lib/progress.ts` (formatDeadline, formatUpdated, formatShortDate)
- Ensure stakeholder-facing dates use month-name format, lockdown milestones use "Mon DD" format

**Theming:**
- Light (default) vs dark mode toggle
- CSS variables in `src/globals.css` switch via `.dark` selector
- Preference persisted to localStorage, restored on page load

**Progress Calculation:**
- All progress metrics derived from templates + project data, no intermediate state
- Vendsys progress combines workstream status + lockdown milestones; application progress counts completed phases

**Domain Color Mapping:**
- Every colored element (accent bar, badge, progress bar) pulls domain from templates, maps domain.color to Tailwind class
- Consistent mapping in multiple places (ProjectCard, VendsysCard, DomainBadge) — consider extracting to utility if needed

---

*Architecture analysis: 2026-04-17*
