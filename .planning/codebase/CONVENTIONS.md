# Coding Conventions

**Analysis Date:** 2026-04-17

## Naming Patterns

**Files:**
- React components: PascalCase with `.tsx` extension (e.g., `ProjectCard.tsx`, `ThemeToggle.tsx`)
- Utilities and helpers: camelCase with `.ts` extension (e.g., `ui-store.ts`, `progress.ts`)
- Type definitions: Single `index.ts` file in `types/` directory

**Functions:**
- Regular functions: camelCase (e.g., `getPhaseProgress`, `formatDeadline`, `deriveWorkstreamStatus`)
- React components (exported): PascalCase (e.g., `ProjectCard`, `SummarySection`)
- Internal/helper components: PascalCase with descriptive names (e.g., `LifecycleProgress`, `CardTaskSummary`, `WorkstreamBar`)

**Variables:**
- Constants: camelCase (e.g., `accentBorder`, `badgeStyles`, `variantColors`)
- DOM elements and state: camelCase (e.g., `isDark`, `expanded`, `showCompleted`)
- Type discriminators: camelCase (e.g., `status`, `type`, `phase`)

**Types:**
- Interface names: PascalCase with suffix context (e.g., `ProjectCardProps`, `SummarySectionProps`, `StatusChipType`)
- Type aliases: PascalCase (e.g., `DomainColor`, `DomainId`, `PhaseStatus`, `HandoffStatus`, `LockdownStatus`)
- Discriminated union types with explicit type fields: `type: 'awaiting' | 'blocked' | 'not-started'`

## Code Style

**Formatting:**
- Enforced by ESLint flat config v9
- TypeScript strict mode enabled
- Tab-based indentation; 2-space style inferred from codebase

**Linting:**
- ESLint v9 with flat config (`eslint.config.js`)
- Extends: `@eslint/js` recommended + `typescript-eslint` recommended + `react-hooks` recommended + `react-refresh` vite plugin
- Linted files: `**/*.{ts,tsx}`
- Ignored: `dist/` directory

**TypeScript:**
- Strict mode enabled: `strict: true`
- Unused locals and parameters flagged: `noUnusedLocals`, `noUnusedParameters`
- No fallthrough cases: `noFallthroughCasesInSwitch`
- Checked array/object indexing: `noUncheckedIndexedAccess`
- JSX: `react-jsx` (new JSX transform, no React import needed)
- Target: ES2022
- Module resolution: bundler

## Import Organization

**Order:**
1. External packages (React, third-party libraries)
2. Type imports (prefixed with `type` keyword)
3. Internal absolute imports (using `@/` alias)
4. Relative component/file imports (same-level or subdirectory)

**Example from `ProjectCard.tsx`:**
```typescript
import type { Project, Templates, ProjectGroup } from '@/types'
import { getPhaseProgress, getCurrentPhaseTasks, formatDeadline, formatUpdated, getGroupName, getPhaseLabel } from '@/lib/progress'
import { useUiStore } from '@/stores/ui-store'
import { DomainBadge } from './DomainBadge'
import { StatusChip } from './StatusChip'
import { PhaseStepper, PhaseStepperDetail } from './PhaseStepper'
```

**Path Aliases:**
- `@/*` → `./src/*` — Used consistently for internal imports, never relative paths from src/

## Error Handling

**Patterns:**
- No error boundaries or error handling in view layer (simple static dashboard with no user input)
- Null coalescing with fallbacks (e.g., `domain.color ?? 'bg-muted-foreground'`)
- Safe optional access with nullish checks (e.g., `project.phases?.[phase.id] ?? 'pending'`)
- Type-safe discriminated unions prevent invalid state (e.g., `HandoffStatus` type prevents invalid task states)

**Data Validation:**
- Type system enforces valid data shapes (strict TypeScript)
- No runtime validation library needed (JSON schema validated at source)
- Fallback values for missing template data

## Logging

**Framework:** No logging library used
- Console output only for development/debugging (none visible in current codebase)
- Data-driven UI eliminates need for log inspection

## Comments

**When to Comment:**
- Minimal inline comments; code is self-documenting
- Comments on complex logic (e.g., vendsys workstream derivation logic in `progress.ts`)
- JSDoc-style comments for exported functions explaining intent

**Example from `progress.ts`:**
```typescript
/** Count completed phases for a lifecycle project */
export function getPhaseProgress(project: Project, templates: Templates) { ... }

/** Derive workstream status from its tasks */
export function deriveWorkstreamStatus(tasks: Record<string, HandoffStatus> | undefined): 'clean' | 'in-progress' | 'pending' { ... }
```

**No JSDoc tags** (@param, @returns) used; TypeScript type annotations are sufficient

## Function Design

**Size:** 
- Most functions are 5-20 lines; largest helpers are 10-30 lines
- Complex logic broken into sub-functions within components (e.g., `LifecycleProgress`, `CardTaskSummary` in `ProjectCard.tsx`)

**Parameters:**
- Destructured props from interface types (e.g., `{ project, templates, groups }`)
- No rest parameters or optional chaining without type guards
- Type-first: always define `Props` interface before component definition

**Return Values:**
- Functions return typed data or React elements
- No implicit `undefined` returns; explicit null checks
- Components return JSX.Element
- Utilities return specific types (string, number, object, array)

## Module Design

**Exports:**
- Named exports for all components and utilities
- Single default export only in `App.tsx` (entry point)
- Example pattern from `PhaseStepper.tsx`:
```typescript
export function PhaseStepper({ project, templates }: { project: Project; templates: Templates }) { ... }
export function PhaseStepperDetail({ project, templates }: { project: Project; templates: Templates }) { ... }
```

**Barrel Files:**
- No barrel files used; components imported directly by file name
- Keeps import paths explicit and tree-shaking compatible

**Store Pattern (Zustand):**
- Single store file: `ui-store.ts`
- Store methods and state defined inline in `create()` callback
- Selector pattern: `useUiStore((s) => s.expandedProject)`
- No middleware; state updates via direct `set()` calls

## Tailwind CSS Conventions

**Pattern:**
- Inline className strings with full Tailwind directives
- No `cn()` utility (simple dashboard, no complex conditional classes)
- Design tokens from `@imperial/ui` included in build (Tailwind v4 integration via vite plugin)
- Domain-specific color classes: `bg-domain-{color}`, `text-domain-{color}`
- Feedback color classes: `bg-success-bg`, `text-success-base`, `bg-warning-bg`, `text-warning-base`, `bg-error-bg`, `text-error-text`, `bg-info-bg`, `text-info-base`

**Example:**
```typescript
className={`text-base font-semibold ${accentBorder[domain.color] ?? 'bg-muted-foreground'}`}
```

## Style Mapping Patterns

**Discriminated Union Colors:**
Components maintain `Record<Type, string>` maps for conditional styling:

```typescript
// Status chips
const styles: Record<StatusChipType['type'], string> = {
  awaiting: 'bg-warning-bg text-warning-text',
  blocked: 'bg-error-bg text-error-text',
  'not-started': 'bg-muted text-muted-foreground',
}

// Domain accent borders
const accentBorder: Record<string, string> = {
  ocean: 'bg-domain-ocean',
  indigo: 'bg-domain-indigo',
  // ...
}
```

- Keys match discriminator values from types (e.g., `HandoffStatus`)
- Fallback provided with `??` operator when key lookup may be unsafe

---

*Convention analysis: 2026-04-17*
