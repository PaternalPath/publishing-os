# Test Coverage Analysis - Publishing OS

## Executive Summary

The Publishing OS codebase currently has **minimal test coverage** with only 2 test files covering approximately 7.7% of the source files. While the existing tests are well-written, there are significant gaps in coverage that present risks to code quality and maintainability.

| Metric | Current State |
|--------|---------------|
| Source Files | 26 |
| Test Files | 2 (1 unit + 1 e2e) |
| Unit Test Cases | 9 |
| E2E Test Cases | 3 |
| Coverage | ~7.7% of files |

---

## Current Test Coverage

### What's Tested

#### 1. Storage Module (`src/lib/storage.ts`) - ✅ Unit Tests
The storage module has 9 comprehensive unit tests covering:
- `loadState()` - empty localStorage, valid data, migration, JSON parse errors
- `saveState()` - version persistence
- `clearState()` - data removal
- `migrateData()` - v0 to v1 migration

**Location:** `src/lib/storage.test.ts`

#### 2. Application Navigation - ✅ E2E Tests
Basic smoke tests covering:
- App loads and redirects to dashboard
- Navigation links work (projects, exports, settings)
- Demo data displays on projects page

**Location:** `tests/e2e/app.spec.ts`

---

## Critical Test Gaps

### Priority 1: Core Business Logic (High Impact)

#### 1.1 State Management (`src/lib/use-app-state.tsx`)
**Risk Level: HIGH**

This is the central nervous system of the application with 12+ functions that manage all state mutations. Currently **0% tested**.

| Function | Purpose | Test Priority |
|----------|---------|---------------|
| `addProject()` | Create new project with activity logging | Critical |
| `updateProject()` | Update project with stage change detection | Critical |
| `deleteProject()` | Cascade delete (project + activities + tasks) | Critical |
| `addTask()` | Create task with activity logging | High |
| `updateTask()` | Update task with activity logging | High |
| `deleteTask()` | Delete task with activity logging | High |
| `updateChecklist()` | Update project checklist | Medium |
| `importData()` | Import JSON data | High |
| `resetData()` | Reset to initial state | Medium |
| `exportJSON()` | Export state to JSON file | Medium |

**Recommended Tests:**
```typescript
// Example test cases needed
- addProject should generate unique ID and timestamps
- addProject should create "created" activity
- updateProject should track stage changes
- deleteProject should remove associated tasks and activities
- addTask should associate with correct project
- importData should validate and migrate data
```

#### 1.2 Validation Schemas (`src/lib/schemas.ts`)
**Risk Level: HIGH**

11 Zod schemas validate all data entering the system. Currently **0% tested**.

| Schema | Fields | Edge Cases to Test |
|--------|--------|-------------------|
| `MetadataSchema` | title, author, keywords, etc. | Required fields, empty strings, array defaults |
| `TaskSchema` | title, status, dueDate, tags | Status enum values, optional fields |
| `ProjectSchema` | stage, metadata, checklist, assets | Nested validation, defaults |
| `ActivitySchema` | type, description, timestamp | Activity type enum |
| `AppStateSchema` | version, projects, tasks, activities | Version migration, array defaults |
| `ImportDataSchema` | Lenient version of AppState | Partial data, missing fields |

**Recommended Tests:**
```typescript
// Example test cases needed
- MetadataSchema rejects empty title
- MetadataSchema rejects empty author
- TaskSchema validates status enum values
- ProjectSchema validates nested metadata
- ImportDataSchema accepts partial data
- ImportDataSchema applies defaults for missing fields
```

### Priority 2: Component Logic (Medium-High Impact)

#### 2.1 Task List Component (`src/components/task-list.tsx`)
**Risk Level: MEDIUM-HIGH**

Complex component with filtering logic, CRUD operations, and date handling. Currently **0% tested**.

| Feature | Logic to Test |
|---------|---------------|
| Task filtering | All, todo, doing, done, overdue, this week |
| Overdue detection | `isPast()` + not done status |
| Task status toggle | todo → doing → done → todo cycle |
| Form submission | Create vs edit mode, validation |
| Filter counts | Accurate count per filter category |

**Recommended Tests:**
```typescript
// Example test cases needed
- filteredTasks returns all tasks when filter is 'all'
- filteredTasks returns only overdue incomplete tasks
- isOverdue correctly identifies past due tasks
- toggleTaskStatus cycles through states correctly
- handleSubmit creates new task when not editing
- handleSubmit updates existing task when editing
```

#### 2.2 Workflow Board (`src/components/workflow-board.tsx`)
**Risk Level: MEDIUM-HIGH**

Main dashboard view with project grouping and stage progression. Currently **0% tested**.

| Feature | Logic to Test |
|---------|---------------|
| Search filtering | Title, author, pen name matching |
| Stage grouping | Projects correctly grouped by stage |
| Stage progression | Move to next stage (not last) |
| Task counts | Completed/total per project |

**Recommended Tests:**
```typescript
// Example test cases needed
- filteredProjects matches by title (case insensitive)
- filteredProjects matches by author
- filteredProjects matches by pen name
- projectsByStage groups projects correctly
- handleMoveStage moves to next stage
- handleMoveStage does nothing for last stage
```

### Priority 3: E2E Coverage Gaps (Medium Impact)

The current E2E tests only cover basic navigation. Missing critical user workflows:

| Missing E2E Test | User Journey |
|------------------|--------------|
| Project CRUD | Create → Edit → Delete project |
| Task Management | Add → Complete → Delete tasks |
| Stage Transitions | Move project through all stages |
| Import/Export | Export data → Import to new session |
| Search | Search filters projects correctly |
| Data Persistence | Refresh page, data persists |

### Priority 4: UI Components (Lower Impact)

The UI primitives in `src/components/ui/` are largely presentational but could benefit from:

| Component | Test Focus |
|-----------|------------|
| `button.tsx` | Variant rendering, disabled state |
| `modal.tsx` | Open/close behavior, backdrop click |
| `input.tsx` | Focus states, validation display |
| `badge.tsx` | Stage color mapping |

---

## Recommended Test Implementation Order

### Phase 1: Foundation (Critical)
1. **Schema validation tests** - Protect data integrity
2. **State management unit tests** - Core business logic
3. **Expand E2E for CRUD operations** - User-facing validation

### Phase 2: Feature Coverage
4. **Task list component tests** - Complex UI logic
5. **Workflow board tests** - Main view functionality
6. **Import/export E2E tests** - Data portability

### Phase 3: Polish
7. **UI component tests** - Visual consistency
8. **Error handling tests** - Edge cases
9. **Accessibility tests** - a11y compliance

---

## Specific Test File Recommendations

### New Unit Test Files to Create

```
src/lib/schemas.test.ts          # Schema validation tests
src/lib/use-app-state.test.tsx   # State management tests
src/lib/seed-data.test.ts        # Seed data generation tests
src/components/task-list.test.tsx      # Task list logic tests
src/components/workflow-board.test.tsx # Workflow board tests
```

### E2E Tests to Add

```
tests/e2e/projects.spec.ts       # Project CRUD workflows
tests/e2e/tasks.spec.ts          # Task management workflows
tests/e2e/import-export.spec.ts  # Data import/export
tests/e2e/persistence.spec.ts    # localStorage persistence
```

---

## Testing Infrastructure Notes

The project already has excellent testing infrastructure in place:

- **Vitest** configured with jsdom environment
- **Playwright** configured for E2E testing
- **Testing Library** available for React component testing
- **Coverage reporting** configured (text, json, html)
- **CI pipeline** runs unit tests on every push

---

## Risk Assessment

| Area | Risk if Untested | Likelihood of Bugs |
|------|------------------|-------------------|
| State Management | HIGH - Data loss, corruption | Medium |
| Schema Validation | HIGH - Invalid data accepted | Medium |
| Task Filtering | MEDIUM - Wrong tasks shown | Low |
| Stage Progression | MEDIUM - Workflow breaks | Low |
| Import/Export | HIGH - Data portability fails | Medium |

---

## Summary

The codebase has a solid foundation but critical business logic remains untested. Priority should be given to:

1. **Schema validation** - First line of defense for data integrity
2. **State management** - All CRUD operations and side effects
3. **E2E workflows** - Real user journeys through the application

Implementing tests in this order will provide the highest ROI for test coverage investment.
