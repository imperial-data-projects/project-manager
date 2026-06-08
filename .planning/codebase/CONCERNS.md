# Codebase Concerns

**Analysis Date:** 2026-04-17

## Data Integrity Issues

**Missing Domain on "Account Business Review" Project:**
- Issue: Project `account-business-review` has empty `domain: ""` field (line 600 in `data/projects.json`)
- Files: `data/projects.json`, `frontend-react/src/components/DomainBadge.tsx`
- Impact: DomainBadge component will attempt to access `templates.domains[""]` and fail; renders with undefined domain styles
- Fix approach: Assign a valid domain value from the domain list (operations, customer-svc, merchandising, logistics, accounting, executive) or filter out projects with missing domains during rendering

**Planned Project Status Missing Phase Data:**
- Issue: Project `account-business-review` has `status: "planned"` with empty `phases: {}` and `currentPhase: null` (lines 605-607)
- Files: `data/projects.json`
- Impact: Rendering logic in `CategorySection` filters only `active` and `complete` projects, so planned projects don't display. If status changes to `active`, rendering would break when accessing phase templates
- Fix approach: When transitioning a project from planned to active, populate the `phases` object with correct phase keys matching the template lifecycle and set `currentPhase` to the first phase ID

**Missing Updated Timestamps:**
- Issue: Multiple projects have `updated: ""` (empty string):
  - `par-analysis` (line 178)
  - `route-manager` (line 228)
  - `financial-reporting` (line 255)
  - `account-manager` (line 281)
  - `fundamentals-dashboard` (line 593)
- Files: `data/projects.json`, `frontend-react/src/components/ProjectCard.tsx` (line 65), `frontend-react/src/components/VendsysCard.tsx` (line 101)
- Impact: Empty string renders as falsy but not null; `formatUpdated` function (lib/progress.ts:65) will attempt to split and parse empty string, returning the original empty string
- Fix approach: Set `updated` to today's date (`2026-04-17`) for all projects

**Unknown Phase Status "planned" Not in Type Union:**
- Issue: Project `account-business-review` uses `status: "planned"` but type definition (types/index.ts:119) only allows `'active' | 'complete'`
- Files: `data/projects.json`, `frontend-react/src/types/index.ts`
- Impact: TypeScript strict mode will report type mismatch; runtime filters in App.tsx (line 12-13) won't capture planned projects
- Fix approach: Either remove the planned project from data, or add 'planned' to Project.status union type and handle it in rendering logic (likely hide from main sections, show only in a "planned" section)

## Type Safety & Validation Gaps

**Unsafe Type Assertion on Data Load:**
- Issue: App.tsx (lines 9-10) uses `as unknown as` double assertion to bypass TypeScript validation
- Files: `frontend-react/src/App.tsx`
- Impact: Projects and templates data are not validated at load time; silent failures if JSON structure doesn't match type definitions
- Fix approach: Add runtime schema validation (e.g., Zod) on data import, or create typed data loaders that validate required fields

**Missing Fallback for Null Domain Color:**
- Issue: `ProjectCard.tsx` (line 27) and `VendsysCard.tsx` (line 29) both use `?? 'bg-muted-foreground'` fallback for missing domain colors
- Files: `frontend-react/src/components/ProjectCard.tsx`, `frontend-react/src/components/VendsysCard.tsx`
- Impact: Gracefully handles unknown colors but masks data errors; a project with invalid domain ID will render with muted foreground instead of failing visibly
- Fix approach: Instead of fallback, validate domain existence when rendering or throw error for invalid domain IDs

**Unvalidated Progress Calculation:**
- Issue: `getPhaseProgress` (progress.ts:10-15) filters phases by checking `project.phases?.[p.id]`, but doesn't validate that phase IDs in phases object match template phase IDs
- Files: `frontend-react/src/lib/progress.ts`, templates may differ from actual phase keys used in projects
- Impact: Mismatched phase IDs between templates and projects would result in incorrect progress counts
- Fix approach: Add assertion that all phase IDs in projects match template phase IDs during validation

## Missing Error Handling

**No Render Boundary for Component Errors:**
- Issue: Components render without error boundaries; a single component error (e.g., undefined template lookup) crashes entire dashboard
- Files: `frontend-react/src/App.tsx`, all component files
- Impact: Site becomes unusable if any single project or template has invalid data structure
- Fix approach: Add React Error Boundary wrapper around CategorySection and CompletedSection; provide fallback UI with error details

**Unsafe Template Lookups:**
- Issue: Multiple components call `templates.domains[domainId]` or `templates.lifecycles[category]` without checking if key exists
- Files: `frontend-react/src/lib/progress.ts` (line 26), `frontend-react/src/components/ProjectCard.tsx` (line 26), `frontend-react/src/components/PhaseStepper.tsx` (line 15)
- Impact: If project has invalid domainId or category, component throws undefined error
- Fix approach: Validate all domainId and category values at data load time; throw descriptive error if invalid

## Data Consistency Issues

**Inconsistent Phase Naming Between Templates and Projects:**
- Issue: Template phase IDs use lowercase kebab-case (interview, workflow, wireframe, mockups, backend, frontend, dev-release, testing, production), but no validation ensures projects use identical keys
- Files: `data/templates.json`, `data/projects.json`
- Impact: If a project uses phase ID "interview-session" instead of "interview", getPhaseProgress counts will be wrong
- Fix approach: Add linting step in build process to validate all phase keys against template definitions

**Vendsys Workstream Task ID Mismatches:**
- Issue: Templates define workstream task IDs (products.barcode-match, accounts.address-validation, etc.), but no validation ensures project workstream tasks use matching IDs
- Files: `data/templates.json` (lines 209-255), `data/projects.json` (vendsys projects)
- Impact: If task ID in project doesn't match template, `getTheirCourtCount` (progress.ts:147-158) won't find the task and returns incorrect count
- Fix approach: Add data validation script to check workstream task IDs against template definitions before build

## Fragile Areas

**Hardcoded Domain Color Lookup Duplication:**
- Issue: Domain accent color mapping defined in three places: `ProjectCard.tsx` (line 8), `VendsysCard.tsx` (line 10), `PhaseStepper.tsx` (line 4) with identical logic
- Files: `frontend-react/src/components/ProjectCard.tsx`, `frontend-react/src/components/VendsysCard.tsx`, `frontend-react/src/components/PhaseStepper.tsx`
- Impact: Adding a new domain color requires updating three files; risk of inconsistency
- Fix approach: Extract color mapping to shared constant in `lib/progress.ts` or `types/index.ts`; import in all components

**Hardcoded Section Title Matching in CategorySection:**
- Issue: `CategorySection` (line 15) detects vendsys by checking `title === 'Vendsys Transition'` string match
- Files: `frontend-react/src/components/CategorySection.tsx`
- Impact: Changing section title in App.tsx (line 61) breaks vendsys card rendering; brittle coupling
- Fix approach: Pass a boolean flag or enum to CategorySection instead of detecting by title

**Vendsys Progress Logic Duplication:**
- Issue: Workstream status derivation appears in `progress.ts` (deriveWorkstreamStatus), App.tsx (line 16-20), and SummarySection (line 16-20) with duplicate logic
- Files: `frontend-react/src/lib/progress.ts`, `frontend-react/src/App.tsx`, `frontend-react/src/components/SummarySection.tsx`
- Impact: Three copies of identical logic are harder to maintain; changes require updates in multiple places
- Fix approach: Move workstream progress filtering to `progress.ts` as helper function (e.g., `getInProgressProjects`, `getAttentionProjects`)

## Scaling Limitations

**Inline JSON Data vs. API:**
- Issue: All project and template data loaded from static JSON files at build time
- Files: `data/projects.json`, `data/templates.json`
- Impact: Cannot update project status without rebuild and redeploy; no real-time collaboration; GitHub Pages deployment requires 5-10 min turnaround
- Improvement path: For rapid iteration on project status, consider storing JSON in a simple backend or CMS; keep templates in code as they rarely change

**No Caching Strategy:**
- Issue: Every page load fetches `projects.json` and `templates.json` from GitHub Pages CDN with no caching headers set
- Files: Vite configuration doesn't set Cache-Control headers for JSON assets
- Impact: Frequent builds and deploys cause unnecessary re-downloads; users always see latest build
- Improvement path: Add aggressive cache-busting to `dist/` assets; set long TTL for JSON with content hash in filename if data becomes dynamic

**UI State Lost on Navigation:**
- Issue: Expanded project state stored in Zustand store `expandedProject`, but store doesn't persist to localStorage
- Files: `frontend-react/src/stores/ui-store.ts`
- Impact: If user expands a project and refreshes page, expansion state is lost
- Improvement path: Add localStorage persistence to Zustand store using `persist` middleware

## Version & Build Issues

**Package Version at 0.0.0:**
- Issue: `frontend-react/package.json` (line 4) has version `"0.0.0"`
- Files: `frontend-react/package.json`
- Impact: Version bump script (mentioned in global CLAUDE.md) expects semantic versioning; this project hasn't versioned yet
- Fix approach: Initialize to `1.0.0` once first stable release occurs; start tracking CHANGELOG.md

**Missing @imperial/ui and @imperial/hooks Dependencies:**
- Issue: Project uses Tailwind CSS v4 directly but should use `@imperial/ui` for design tokens according to standards
- Files: `frontend-react/package.json`, `frontend-react/src/components/*`
- Impact: Design tokens and colors are hardcoded in components (domain colors, feedback colors) instead of centralized
- Fix approach: Add `@imperial/ui@1.7.0` dependency; import design tokens CSS; use theme store for dark/light mode toggle instead of custom implementation

## Minor Code Quality Issues

**Unused Template Parameter:**
- Issue: `SummarySection` (line 9) receives `templates` parameter but never uses it
- Files: `frontend-react/src/components/SummarySection.tsx`
- Impact: ESLint should flag unused parameter; indicates incomplete refactoring or copy-paste error
- Fix approach: Remove unused parameter from function signature and call site

**Redundant Default Domain Label:**
- Issue: `ProjectCard` (line 35) has `categoryLabel` but if `groupName` is null, falls back to this label for groupless projects (line 38)
- Files: `frontend-react/src/components/ProjectCard.tsx`
- Impact: "Standalone Application" label is not useful context; better to show project category + phase progress
- Fix approach: Show category icon or phase progress instead of generic "Standalone" label for ungrouped projects

**Inconsistent Task Icon Unicode:**
- Issue: Multiple components use inline HTML entity `&#10003;` (checkmark), `&#9679;` (circle), `&#8226;` (bullet)
- Files: `frontend-react/src/components/VendsysCard.tsx` (lines 250-252, 276, 280), `frontend-react/src/components/PhaseStepper.tsx` (lines 60, 63, 65)
- Impact: Icons are not accessible; screen readers see unicode numbers; maintenance burden
- Fix approach: Use icon library (lucide-react already imported) for all status indicators

---

*Concerns audit: 2026-04-17*
