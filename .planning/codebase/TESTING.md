# Testing Patterns

**Analysis Date:** 2026-04-17

## Test Framework

**Status:**
- No test framework currently configured
- No test files found in codebase (zero `.test.*` or `.spec.*` files)
- ESLint handles code quality; no automated test suite

**Available Dependencies:**
- TypeScript strict compilation catches many errors at build time
- ESLint v9 with React, hooks, and refresh plugins
- Build validation via `npm run build` (TypeScript + Vite)

**Lint Command:**
```bash
npm run lint                # Run ESLint checks
npm run build               # Compile TypeScript + bundle with Vite
npm run dev                 # Development server with HMR
```

## Why No Tests

This codebase is a **static, data-driven dashboard** with:
- No user input or form validation
- No API calls or side effects
- No authentication logic
- No complex state mutations

All data mutations happen via external sources (Claude commits `data/projects.json` directly). The UI is a pure projection of JSON data.

## Testing Strategy (Recommended)

If testing is ever needed:

**Type Checking:**
- TypeScript strict mode (`strict: true`) prevents most runtime errors
- Type system validates discriminated unions, ensures exhaustive pattern matches

**Component Validation:**
- Props interfaces enforce data shapes
- ESLint catches unused props, unreachable code, missing keys in lists
- Visual regression testing could catch Tailwind layout breakage

**Data Integrity:**
- JSON schema validation at build time (JSON files imported as typed constants)
- Helper functions in `lib/progress.ts` could benefit from unit tests if business logic grows

## Code Quality Tools

**Linting:**
- ESLint flat config (`eslint.config.js`) configured with:
  - `@eslint/js` recommended rules
  - `typescript-eslint` recommended rules
  - `eslint-plugin-react-hooks` recommended rules
  - `eslint-plugin-react-refresh` vite plugin rules

**TypeScript Compilation:**
- `tsc -b` performs incremental build check
- Strict mode enabled; catches null/undefined issues, unused variables
- `noUncheckedIndexedAccess` prevents array/object access bugs

**Build Tool:**
- Vite performs bundle validation and dead code elimination
- `emptyOutDir: true` ensures clean output

## Pattern Examples from Codebase

**Type-Safe Discriminated Unions (de facto "tests"):**
```typescript
// HandoffStatus enforces valid states
export type HandoffStatus = 'pending' | 'submitted' | 'complete'

// Component can safely pattern-match
function HandoffIcon({ status }: { status: HandoffStatus }) {
  if (status === 'complete') return <CheckMark />
  if (status === 'submitted') return <Pending />
  return <Idle />
  // TypeScript ensures exhaustive match; compiler error if new status added
}
```

**Type-Safe Array Operations:**
```typescript
// noUncheckedIndexedAccess prevents undefined bugs
const [year, month, day] = dateStr.split('-').map(Number)
if (!year || !month || !day) return dateStr  // Guard required by ESLint
const monthNames = ['Jan', 'Feb', 'Mar', ...]
const name = monthNames[month - 1]  // Checked; could be undefined
return name ? `${name} ${year}` : dateStr  // Explicit fallback
```

**Selector Patterns (Zustand):**
```typescript
// Type-safe store access
const expanded = useUiStore((s) => s.expandedProject === project.id)
const toggle = useUiStore((s) => s.toggleProject)
// Selector memoization prevents unnecessary re-renders (Zustand handles this)
```

## Validation Without Tests

**At Build Time:**
1. TypeScript compilation with strict settings
2. ESLint full codebase check
3. Vite bundling and minification

**At Runtime:**
1. Zustand store constraints (state shape is fixed)
2. React component prop validation (TypeScript)
3. Tailwind class validation (Vite plugin validates class names)

## Pre-Build Checklist

```bash
npm run lint                    # Ensure no ESLint violations
tsc -b                          # Type check all files
npm run build                   # Full build + bundle
# Verify no errors in output
```

## Future Testing Considerations

**If this grows:**

**Unit Tests for `lib/progress.ts`:**
- Helper functions are pure (no side effects)
- Test date formatting: `formatDeadline()`, `formatUpdated()`, `formatShortDate()`
- Test status derivation: `deriveWorkstreamStatus()`, `getPhaseProgress()`
- Test progress calculations: `getVendsysWorkstreamProgress()`, `getVendsysLockdownProgress()`

**Integration Tests for Components:**
- Verify Zustand store toggle behavior (expand/collapse project)
- Verify filtered lists render correct card types (ProjectCard vs VendsysCard)
- Verify domain colors map correctly to accent borders

**Snapshot Tests:**
- Not recommended unless layout changes frequently (currently stable)

**Visual Regression Testing:**
- Playwright or Chromatic for Tailwind breakpoints and theme toggle
- Verify dark mode swaps correct CSS classes
- Verify grid layout responsive behavior

**Recommended Framework (if added):**
- `vitest` for unit tests (compatible with existing TypeScript setup)
- `@testing-library/react` for component rendering tests
- `@testing-library/user-event` for interaction tests (toggle, expand)
- No E2E framework needed (no navigation, no routing)

---

*Testing analysis: 2026-04-17*
