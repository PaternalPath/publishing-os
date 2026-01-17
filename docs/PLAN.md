# Publishing OS - Fortune-500 Upgrade Plan

**Created:** 2026-01-17
**Status:** In Progress
**Target:** Production-ready, Vercel-deployable, local-first Publishing Operations Dashboard

## Current State Assessment

### Framework & Versions
- **Next.js:** 16.1.1 (App Router)
- **React:** 19.2.3
- **TypeScript:** 5.x (strict mode enabled)
- **Node.js:** No version pinned (needs fix)
- **Package Manager:** npm

### Existing Scripts Status
| Script | Exists | Works | Notes |
|--------|--------|-------|-------|
| `dev` | ✓ | ✓ | Runs next dev |
| `build` | ✓ | ✓ | Runs next build |
| `start` | ✓ | ✓ | Runs next start |
| `lint` | ✓ | ✓ | ESLint with Next.js config |
| `typecheck` | ✗ | ✗ | **MISSING - needs to be added** |
| `test` | ✗ | ✗ | **MISSING - needs to be added** |

### Current Data/Storage Approach
- **Storage:** localStorage (key: `publishing-os-data`)
- **State Management:** React Context (`AppStateProvider`)
- **Validation:** Zod schemas present but not fully integrated
- **Persistence:** Auto-save on state changes via useEffect
- **Export:** JSON export implemented
- **Import:** **NOT IMPLEMENTED - needs to be added**
- **Schema Versioning:** **NOT IMPLEMENTED - needs to be added**

### Current Data Model
**Existing Types (src/types/index.ts):**
- `Project` - Main project entity
- `Metadata` - Book metadata (title, author, ISBN, etc.)
- `ChecklistItem` - Publishing tasks (KDP/IngramSpark)
- `Asset` - File references (cover/interior)
- `Activity` - Activity log entries
- `AppState` - Root state container

**Gap Analysis:**
- Current model is KDP/IngramSpark-focused
- Needs adaptation for general "publishing stages" model
- Missing: Task entity (separate from checklist)
- Missing: Milestone/Stage progression tracking
- Missing: Calendar/timeline data structures

### Current UI Features
**Implemented:**
- ✓ Project dashboard with status filters
- ✓ Project detail pages
- ✓ Metadata editing
- ✓ Checklist management (KDP/IngramSpark focus)
- ✓ Asset tracking (placeholder only)
- ✓ Activity log
- ✓ JSON export
- ✓ Demo data with 5 sample projects
- ✓ Toast notifications
- ✓ Modal dialogs
- ✓ Empty states
- ✓ Navigation with mobile menu

**Missing/Needs Enhancement:**
- ✗ Import JSON functionality
- ✗ Workflow board (stage columns)
- ✗ Calendar/timeline view
- ✗ Task management (separate from platform checklists)
- ✗ Due date tracking and overdue indicators
- ✗ "Load demo project" button (currently auto-loads all 5)
- ✗ Undo functionality
- ✗ Confirmation dialogs for destructive actions
- ✗ Keyboard navigation
- ✗ Focus state improvements

### Known Issues

#### Critical (Blocking Acceptance Criteria)
1. **No typecheck script** - Required for CI
2. **No test framework** - Required for acceptance criteria
3. **No test suite** - Must have unit + E2E tests
4. **No CI/CD** - GitHub Actions workflow missing
5. **No import functionality** - Can export but not import JSON
6. **No Node version pinning** - Vercel needs engine or .nvmrc
7. **No .env.example** - Should exist even if empty

#### High Priority (UX/Functionality)
8. **Data model mismatch** - Current model is platform-specific (KDP/IngramSpark) vs. requirement for stage-based workflow (Draft → Edit → Cover → Format → Publish → Marketing)
9. **No workflow board** - Core requirement for stage visualization
10. **No calendar view** - Required for 2-minute demo
11. **No task entity** - Checklist items aren't the same as tasks with due dates
12. **No schema versioning** - localStorage breaking changes will lose user data
13. **No load demo button** - Should be explicit action, not auto-load
14. **Mobile responsiveness gaps** - Needs audit and fixes
15. **Accessibility gaps** - Missing keyboard nav, focus states need polish

#### Medium Priority (Quality)
16. **No confirmation dialogs** - Delete actions have no safeguards
17. **No undo** - One-way destructive actions
18. **README needs screenshots** - Has description but no visuals
19. **No Prettier config** - Code formatting not standardized
20. **Activity log unlimited** - Should prune to 100 as per ARCHITECTURE.md

#### Low Priority (Nice to Have)
21. **No dark mode** - Not required but mentioned in architecture
22. **No real file uploads** - Placeholder only (acceptable for demo)

## Implementation Plan

### Task Breakdown (8 Major Tasks)

#### **Task 1: Standardize Scripts & Tooling**
**Goal:** All required scripts exist and work on clean machine

**Subtasks:**
1. Add `typecheck` script to package.json (`tsc --noEmit`)
2. Install Vitest for unit testing
3. Install Playwright for E2E testing
4. Add `test` script for Vitest
5. Add `test:e2e` script for Playwright
6. Create `.nvmrc` with Node 20
7. Add `engines.node` to package.json (>=20)
8. Create `.env.example` (empty with comment)
9. Add Prettier config if missing
10. Verify all scripts work: `npm ci && npm run lint && npm run typecheck && npm test && npm run build`

**Files to Create/Modify:**
- `package.json` (add scripts, engines, devDependencies)
- `.nvmrc` (new file)
- `.env.example` (new file)
- `vitest.config.ts` (new file)
- `playwright.config.ts` (new file)

---

#### **Task 2: Data Model Alignment**
**Goal:** Adapt data model to match requirements (stage-based workflow, tasks, schema versioning)

**Subtasks:**
1. Define new types in `src/types/index.ts`:
   - `Stage` type: `'draft' | 'edit' | 'cover' | 'format' | 'publish' | 'marketing'`
   - `Task` interface (separate from ChecklistItem)
   - `Project` update: replace `status` with `stage`
   - Add schema version to AppState
2. Create Zod schemas for validation in `src/lib/schemas.ts`:
   - `ProjectSchema`
   - `TaskSchema`
   - `AppStateSchema`
   - `ImportDataSchema`
3. Add schema versioning utilities in `src/lib/storage.ts`:
   - `SCHEMA_VERSION` constant
   - `migrateData()` function
   - Version check on load
4. Update seed data to use new model
5. Update storage functions to validate with Zod

**Files to Create/Modify:**
- `src/types/index.ts` (update existing types)
- `src/lib/schemas.ts` (new file)
- `src/lib/storage.ts` (add versioning)
- `src/lib/seed-data.ts` (update to new model)

---

#### **Task 3: Storage + Import/Export**
**Goal:** Bulletproof persistence with import, export, validation

**Subtasks:**
1. Implement `importStateFromJSON()` in storage.ts
2. Add file upload handler in UI
3. Validate imported JSON with Zod schema
4. Show clear error messages for invalid imports
5. Add "Load demo project" button (single demo project, not auto-load all)
6. Create `fixtures/demo-project.json` for explicit demo load
7. Add export format documentation in README
8. Test import of exported files (round-trip)

**Files to Create/Modify:**
- `src/lib/storage.ts` (add import function)
- `fixtures/demo-project.json` (new file)
- `src/components/import-export.tsx` (new component)
- `src/app/settings/page.tsx` (integrate import UI)

---

#### **Task 4: Core UI - Workflow Board**
**Goal:** Stage-based workflow visualization (Draft → Edit → Cover → Format → Publish → Marketing)

**Subtasks:**
1. Create workflow board component (`src/components/workflow-board.tsx`)
2. Display projects grouped by stage in columns
3. Add "Move to next stage" button (simple, accessible)
4. Optional: Drag-and-drop with `@dnd-kit/core` (only if lightweight)
5. Show project count per stage
6. Add filters: search, stage selection
7. Mobile: Stack stages vertically or horizontal scroll

**Files to Create/Modify:**
- `src/components/workflow-board.tsx` (new component)
- `src/app/dashboard/page.tsx` (integrate board)
- `src/lib/use-app-state.tsx` (add moveToStage action)

---

#### **Task 5: Core UI - Tasks & Calendar**
**Goal:** Task management with due dates, overdue tracking, calendar/timeline view

**Subtasks:**
1. Create task management components:
   - `src/components/task-list.tsx`
   - `src/components/task-form.tsx`
   - `src/components/task-filters.tsx`
2. Add task CRUD actions to state management
3. Implement due date field with date picker
4. Add overdue indicator (visual badge)
5. Add filters: overdue, due this week, by status, by tag
6. Create simple calendar view OR timeline view:
   - Calendar: Month grid with due date dots
   - Timeline: Gantt-like horizontal bars (simpler)
   - Choose ONE based on simplicity
7. Mobile-friendly task list

**Files to Create/Modify:**
- `src/components/task-list.tsx` (new)
- `src/components/task-form.tsx` (new)
- `src/components/task-filters.tsx` (new)
- `src/components/calendar-view.tsx` OR `timeline-view.tsx` (new)
- `src/app/projects/[id]/page.tsx` (add tasks tab)
- `src/lib/use-app-state.tsx` (add task actions)

---

#### **Task 6: Reliability Features**
**Goal:** Undo, confirmations, activity log pruning

**Subtasks:**
1. Add confirmation dialogs for:
   - Delete project
   - Delete task
   - Clear all data
   - Import (overwrites existing)
2. Implement simple undo (last action only):
   - Store last state snapshot
   - Add "Undo" button/toast action
   - Limited to delete operations
3. Add activity log pruning (keep last 100 entries)
4. Add loading states for import/export
5. Add error boundaries for graceful error handling

**Files to Create/Modify:**
- `src/components/confirm-dialog.tsx` (new)
- `src/lib/use-undo.tsx` (new hook)
- `src/lib/use-app-state.tsx` (integrate undo)
- `src/components/error-boundary.tsx` (new)
- `src/app/layout.tsx` (wrap with error boundary)

---

#### **Task 7: Tests**
**Goal:** Meaningful unit and E2E tests to verify acceptance criteria

**Unit Tests (Vitest):**
1. Zod schema validation tests (`src/lib/schemas.test.ts`)
2. Storage read/write tests (`src/lib/storage.test.ts`)
3. Import/export tests (round-trip)
4. Schema migration tests
5. Task filters tests (overdue, due this week)
6. Stage transition validation

**E2E Tests (Playwright):**
1. App loads without errors
2. Load demo project button works
3. Create project + add task flow
4. Export JSON download
5. Import JSON (upload demo file)
6. Stage progression
7. Task filtering (overdue)

**Files to Create:**
- `src/lib/schemas.test.ts`
- `src/lib/storage.test.ts`
- `tests/e2e/app.spec.ts`
- `tests/e2e/import-export.spec.ts`

---

#### **Task 8: CI, Docs, Final Polish**
**Goal:** GitHub Actions CI, README with screenshots, final verification

**Subtasks:**
1. Create `.github/workflows/ci.yml`:
   - Trigger: push, pull_request
   - Steps: npm ci, lint, typecheck, test, build
2. Update README.md:
   - Add 1-2 sentence pitch at top
   - Add screenshot/GIF above the fold (take screenshot of app)
   - Update quickstart with new scripts
   - Add "Load demo project" instructions
   - Add import/export format notes
   - Add privacy note
   - Add Vercel deploy instructions
3. Verify docs/ARCHITECTURE.md is up to date (1 page max)
4. Final accessibility audit:
   - Labels on all inputs
   - Focus states visible
   - Keyboard navigation works
   - ARIA labels where needed
5. Mobile responsiveness check
6. Clean empty states, loading states, error states
7. Run full acceptance criteria checklist

**Files to Create/Modify:**
- `.github/workflows/ci.yml` (new)
- `README.md` (major update)
- `docs/ARCHITECTURE.md` (update for new model)
- Various components (accessibility fixes)

---

## Acceptance Criteria Checklist

### 1. Clean Machine Verification
- [ ] `npm ci` succeeds
- [ ] `npm run lint` succeeds
- [ ] `npm run typecheck` succeeds
- [ ] `npm test` succeeds (unit + E2E)
- [ ] `npm run build` succeeds

### 2. Vercel Readiness
- [ ] Deploy succeeds with no environment variables
- [ ] No secrets required
- [ ] No external API calls
- [ ] App functions fully client-side

### 3. MVP Demoable in Under 2 Minutes
- [ ] Create/manage "Publishing Projects"
- [ ] Track stages: Draft → Edit → Cover → Format → Publish → Marketing
- [ ] Task list with due dates, owners (optional), status
- [ ] Calendar OR timeline view (simple)
- [ ] Import/export projects as JSON
- [ ] "Load demo project" button with sample data

### 4. UX Quality
- [ ] Clean empty states (no projects, no tasks)
- [ ] Loading states (import, export)
- [ ] Error states (import validation errors)
- [ ] Mobile-friendly layout (all pages)
- [ ] Accessible controls:
  - [ ] Labels on inputs
  - [ ] Focus states visible
  - [ ] Keyboard navigation works
  - [ ] Buttons have clear names

### 5. Repo Maturity
- [ ] README with screenshots/GIF above fold
- [ ] docs/architecture.md updated (1 page max)
- [ ] GitHub Actions CI (lint + typecheck + test + build)
- [ ] .env.example exists (empty/optional)
- [ ] .nvmrc or engines.node set
- [ ] Prettier config

## Technical Debt & Future Work

**Not in Scope for This Upgrade:**
1. Real file uploads (current placeholder approach is acceptable)
2. Multi-device sync (localStorage is sufficient)
3. Dark mode (nice to have, not required)
4. Advanced drag-and-drop (simple move buttons are fine)
5. Pagination (current dataset size is small)
6. Backend/API (explicitly local-first)
7. Authentication (demo mode only)
8. Analytics/monitoring (privacy-first approach)

**Known Limitations:**
- localStorage ~5-10MB limit
- Single browser tab (no real-time sync)
- No undo for most actions (only critical deletes)
- Activity log capped at 100 entries

## Dependencies to Add

**Testing:**
- `vitest` - Unit testing
- `@vitest/ui` - Test UI
- `@testing-library/react` - React testing utilities
- `@testing-library/user-event` - User interaction testing
- `@playwright/test` - E2E testing
- `jsdom` - DOM environment for Vitest

**Validation:**
- Already have `zod` - just need to integrate fully

**Optional:**
- `@dnd-kit/core` - Drag and drop (only if workflow board needs it)
- Consider: Keep it simple with buttons instead

**Total new dependencies: ~6-7 packages**

## Success Metrics

**Must Pass:**
1. All 5 acceptance criteria sections ✓
2. Zero build errors
3. Zero lint errors
4. Zero type errors
5. All tests passing
6. CI passing on GitHub
7. Vercel deploy successful (no env vars)

**Quality Indicators:**
- Code coverage >60% for critical paths
- Lighthouse score >90 (accessibility, best practices)
- README is clear and welcoming
- Demo flow takes <2 minutes

## Timeline Estimate

**Not providing timeline per instructions** - work is broken into 8 concrete tasks that can be completed sequentially.

## Notes

- Current app is already well-structured with good foundations
- Main work is adapting KDP/IngramSpark model to stage-based workflow
- Testing infrastructure is the biggest gap
- UI quality is already high, needs minor enhancements
- Documentation is excellent, just needs updating for new model
