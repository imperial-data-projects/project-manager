# Codebase Structure

**Analysis Date:** 2026-04-17

## Directory Layout

```
project-manager/
├── .claude/                 # Local project config
├── .github/                 # GitHub Actions workflows (for Pages deploy)
├── .planning/               # Planning documents
├── data/                    # Static data (JSON imports)
│   ├── projects.json        # Project portfolio data
│   └── templates.json       # Lifecycle phases and domain definitions
├── frontend-react/          # React application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── lib/             # Helper functions (progress, formatting)
│   │   ├── stores/          # Zustand state management
│   │   ├── types/           # TypeScript definitions
│   │   ├── main.tsx         # React root entry point
│   │   ├── App.tsx          # App component (layout + data import)
│   │   └── globals.css      # Tailwind v4 @theme variables
│   ├── vite.config.ts       # Vite build config
│   ├── tsconfig.json        # TypeScript config
│   └── package.json         # Dependencies
├── mockups/                 # Design mockups (not deployed)
└── CLAUDE.md                # Project instructions
```

## Directory Purposes

**`data/`:**
- Purpose: Static project and template data
- Contains: JSON files imported at build time
- Key files: 
  - `projects.json`: Array of active/completed projects with all metadata
  - `templates.json`: Lifecycle phase definitions per category, domain color definitions

**`frontend-react/src/`:**
- Purpose: React application source code
- Contains: Components, state, helpers, types, styles

**`frontend-react/src/components/`:**
- Purpose: React presentational components
- Contains: Card layouts, section containers, status indicators, phase visualizations
- Key files:
  - `App.tsx`: Layout root, data import, category filtering
  - `ProjectCard.tsx`: Single application/auto-report/powerbi project card with expand toggle
  - `VendsysCard.tsx`: Vendsys branch card with workstream/lockdown detail
  - `CategorySection.tsx`: Section container (Applications, Auto Reports, Power BI, Vendsys, Completed)
  - `SummarySection.tsx`: Dashboard header with stat cards and awaiting-action list
  - `CompletedSection.tsx`: Collapsible section for completed projects
  - `PhaseStepper.tsx`: Visual progress bar and expanded phase list
  - `ThemeToggle.tsx`: Light/dark mode toggle button
  - `StatusChip.tsx`: Badge component for blocking statuses
  - `DomainBadge.tsx`: Domain name + color badge
  - `ProjectCard.tsx` + `VendsysCard.tsx` both use accent color mapping

**`frontend-react/src/lib/`:**
- Purpose: Business logic and data helpers
- Contains: Progress calculations, formatting utilities
- Key files:
  - `progress.ts`: 
    - Phase progress: `getPhaseProgress()`, `getCurrentPhaseTemplate()`, `getPhases()`
    - Date formatting: `formatDeadline()`, `formatUpdated()`, `formatShortDate()`
    - Vendsys helpers: `deriveWorkstreamStatus()`, `getVendsysWorkstreamProgress()`, `getVendsysLockdownProgress()`, `getLockdownDates()`, `getTheirCourtCount()`, `isReadyForLockdown()`, `hasVendsysProgress()`
    - Utility: `getGroupName()`, `sortByDeadline()`

**`frontend-react/src/stores/`:**
- Purpose: Zustand state management
- Contains: Global UI state (expand/collapse, theme)
- Key files:
  - `ui-store.ts`: 
    - `expandedProject`: which project card is expanded (null = all collapsed)
    - `showCompleted`: whether completed section is visible
    - `toggleProject(id)`: toggle expanded state
    - `toggleCompleted()`: toggle completed visibility

**`frontend-react/src/types/`:**
- Purpose: TypeScript type definitions
- Contains: Interfaces for all data shapes
- Key files:
  - `index.ts`:
    - `Project`: Full project with phases, tasks, workstreams, lockdown
    - `Templates`: Lifecycles (application/auto-report/powerbi/vendsys), domains
    - `PhaseTemplate`: Single phase in a lifecycle
    - `VendsysWorkstreamTemplate`, `VendsysLockdownTemplate`: Vendsys-specific templates
    - `StatusChip`: Blocking/awaiting status overlay
    - `Task`, `Subtask`: Task tracking within phases
    - `ProjectGroup`: Group definition (e.g., "IDS Platform")

**`frontend-react/src/globals.css`:**
- Purpose: Tailwind v4 design tokens and theme
- Contains: CSS custom properties (--color-*) for light and dark modes
- Structure:
  - Base colors (background, foreground, card, border, muted)
  - Domain accents (ocean, indigo, amethyst, rose, umber, slate) — light and dark variants
  - Feedback colors (success, warning, error, info) — base + background + text variants
  - Dark mode overrides via `.dark` selector

## Key File Locations

**Entry Points:**
- `frontend-react/src/main.tsx`: React app initialization
- `frontend-react/src/App.tsx`: Main app component, data import, layout
- `frontend-react/index.html`: HTML root (Vite serves this)

**Configuration:**
- `frontend-react/vite.config.ts`: Build config, base path `/project-manager/`
- `frontend-react/tsconfig.json`: TypeScript strict mode, path aliases (@/)
- `frontend-react/package.json`: Dependencies (React, Tailwind, Zustand, Vite, Lucide)

**Core Logic:**
- `data/projects.json`: Project data source
- `data/templates.json`: Lifecycle and domain templates source
- `frontend-react/src/lib/progress.ts`: All business logic
- `frontend-react/src/stores/ui-store.ts`: UI state management

**Testing:**
- Not present; this is a static dashboard with no test coverage

## Naming Conventions

**Files:**
- Components: PascalCase.tsx (e.g., `ProjectCard.tsx`, `ThemeToggle.tsx`)
- Stores: kebab-case.ts (e.g., `ui-store.ts`)
- Utilities/libs: kebab-case.ts (e.g., `progress.ts`)
- Types: index.ts (single file per domain)

**Directories:**
- React components: `components/` (plural)
- Logic helpers: `lib/` (plural)
- State: `stores/` (plural)
- Types: `types/` (singular, convention; contains one index.ts)

**Functions:**
- camelCase (e.g., `getPhaseProgress`, `formatDeadline`, `deriveWorkstreamStatus`)
- Prefixes indicate intent:
  - `get*`: retrieve data (e.g., `getPhases`, `getGroupName`)
  - `format*`: convert/display format (e.g., `formatDeadline`, `formatUpdated`)
  - `derive*`: compute from other data (e.g., `deriveWorkstreamStatus`)
  - `is*`: boolean predicate (e.g., `isReadyForLockdown`)
  - `has*`: boolean check (e.g., `hasVendsysProgress`)

**Variables:**
- camelCase (e.g., `expandedProject`, `showCompleted`, `accentBorder`)
- Boolean properties prefixed with: `is`, `show`, `has`, `can`, `should` (e.g., `isVendsys`, `showCompleted`, `hasProgress`)

**Types:**
- PascalCase (e.g., `Project`, `PhaseTemplate`, `StatusChip`)
- Union types: `type PhaseStatus = 'complete' | 'in-progress' | 'pending' | 'skipped'`

## Where to Add New Code

**New Feature (Dashboard Update):**
- Primary code: `frontend-react/src/components/` (new component or modify existing)
- Helpers: `frontend-react/src/lib/progress.ts` (add calculation/formatting function)
- Data: `data/projects.json` (add/modify project or template)
- Types: `frontend-react/src/types/index.ts` (extend Project interface or add new interface if needed)

**New Component/Module:**
- Implementation: `frontend-react/src/components/{ComponentName}.tsx`
- If component is reusable section: add to `src/components/`
- If component is small utility (badge, icon): co-locate in same file as parent or in components folder if used in multiple places

**Utilities/Helpers:**
- Shared formatting or progress logic: `frontend-react/src/lib/progress.ts` (extend existing file, one responsibility per function)
- Theme utilities: keep in `globals.css` or component if scoped

**State Management:**
- UI toggles: `frontend-react/src/stores/ui-store.ts` (extend Zustand store)
- If adding new store for different domain, create `frontend-react/src/stores/{domain}-store.ts`

## Special Directories

**`data/`:**
- Purpose: Source of truth for project and template data
- Generated: No (manually maintained by Claude from cross-repo updates)
- Committed: Yes
- Ownership: Eric maintains via `/imp-map-codebase` from any repo; Claude updates via project-manager repo
- Note: Changes here require rebuild (`npm run build`) to reflect in deployment

**`frontend-dist/`:**
- Purpose: Pre-built output committed for GitHub Pages deployment
- Generated: Yes (by `npm run build`)
- Committed: Yes
- Note: Not in this repo; GitHub Pages serves from this directory after Actions build

**`mockups/`:**
- Purpose: Design artifacts and wireframes
- Generated: No (static files)
- Committed: Yes
- Note: Not deployed; reference only

**`frontend-react/dist/`:**
- Purpose: Local build output during development
- Generated: Yes (by `npm run build`)
- Committed: No (gitignored)
- Note: Use `npm run preview` to test local build before pushing

## Deployment Path

1. Update `data/projects.json` or `data/templates.json` → commit to main
2. Run `npm ci && npm run build` in `frontend-react/` → output to `frontend-dist/`
3. Commit `frontend-dist/` to main
4. Push to main
5. GitHub Actions runs build, deploys `frontend-dist/` to GitHub Pages
6. Live at `https://imperialco.github.io/project-manager/` (base path: `/project-manager/`)

---

*Structure analysis: 2026-04-17*
