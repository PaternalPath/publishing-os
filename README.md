# Publishing OS

> **A local-first publishing workflow manager for indie authors** — Track your projects from draft to marketing with zero setup required.

[![CI Status](https://github.com/yourusername/publishing-os/workflows/CI/badge.svg)](https://github.com/yourusername/publishing-os/actions)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/publishing-os)

**[📸 Screenshots](#screenshots)** | **[Try the Demo](#quick-start)** | **[Deploy to Vercel](#deployment)**

## What is Publishing OS?

Publishing OS is a **production-ready, Fortune-500 quality** publishing workflow manager built for indie authors. Manage your book projects through a visual stage-based pipeline, track tasks with due dates, and keep everything organized—all running locally in your browser with zero external dependencies.

### Key Features

- **📊 Visual Workflow Board** — See all projects at a glance in a Kanban-style board with 6 stages: Draft → Edit → Cover → Format → Publish → Marketing
- **✅ Task Management** — Create tasks with due dates, owners, and tags. Filter by status, overdue items, or this week's tasks
- **📦 Import/Export** — Full data portability with JSON export/import. Back up your data or share between devices
- **🎯 One-Click Demo** — Load a complete sample project to explore features instantly
- **🔒 100% Local-First** — No servers, no signup, no data collection. Everything stays in your browser
- **⚡ Zero Configuration** — Works out of the box on Vercel with no environment variables needed

## Screenshots

> **Note:** Add screenshots here showing the workflow board, task management, and import/export features.

```
📸 Coming soon: Screenshots of the workflow dashboard, task management, and project details
```

## Quick Start

### Try it in under 60 seconds

```bash
# 1. Install dependencies
npm ci

# 2. Start development server
npm run dev

# 3. Open http://localhost:3000
# 4. Click "Settings" and then "Load Demo Project"
```

### Load the Demo Project

1. Navigate to **Settings** in the sidebar
2. Click **"Load Demo Project"** button
3. Explore a complete publishing project with:
   - Sample project in Edit stage
   - 4 tasks (done, doing, todo) with due dates
   - Activity history showing stage changes
   - Full metadata and notes

## Core Functionality

### Stage-Based Workflow

Projects move through **6 clearly-defined stages**:

1. **Draft** — Writing and ideation
2. **Edit** — Developmental and copy editing
3. **Cover** — Cover design and approval
4. **Format** — Interior formatting and layout
5. **Publish** — Upload and distribution
6. **Marketing** — Launch and promotion

Move projects between stages with one click. The workflow board shows all projects across all stages simultaneously.

### Task Management

**Create tasks** with:
- Title and description
- Status: To Do, Doing, Done
- Due dates with overdue detection
- Owner/assignee field
- Custom tags

**Filter tasks** by:
- Status (todo/doing/done)
- Overdue items (automatic detection)
- Due this week
- View all tasks across all filters

**Task features:**
- Visual indicators for overdue and due-soon tasks
- One-click status progression
- Edit inline with pre-filled forms
- Delete with confirmation

### Import & Export

**Export** your data:
- Download complete state as JSON
- Includes all projects, tasks, and activities
- Timestamped filenames

**Import** saved data:
- Upload previously exported JSON
- Automatic validation with clear error messages
- Migration support for older data formats
- Warning before overwriting existing data

**Data Portability:**
- Standard JSON format
- Schema version tracking
- Future-proof with automatic migrations

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Validation:** Zod schemas
- **Storage:** localStorage (client-side)
- **Testing:** Vitest (unit) + Playwright (E2E)
- **Icons:** Lucide React

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript compiler
npm test             # Run unit tests
npm run test:e2e     # Run E2E tests with Playwright
```

### Requirements

- **Node.js** >= 20.0.0 (see `.nvmrc`)
- **npm** (package manager)

All required scripts verified to work on a clean machine.

## Deployment

### Deploy on Vercel (Recommended)

Publishing OS is optimized for Vercel deployment:

1. **Import your repository** in Vercel
2. **No environment variables required** — Just click deploy
3. **Done!** — Your publishing dashboard is live

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/publishing-os)

**Vercel Configuration:**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm ci`
- **Environment Variables:** None needed

### Deploy Elsewhere

Build the production bundle:

```bash
npm ci
npm run build
npm start
```

The app runs on port 3000 by default. All data is stored client-side in localStorage—no server configuration needed.

## Project Structure

```
publishing-os/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── dashboard/       # Workflow board view
│   │   ├── projects/        # Project list and detail
│   │   ├── exports/         # Export utilities
│   │   └── settings/        # Import/export/demo management
│   ├── components/          # React components
│   │   ├── ui/              # Reusable UI primitives
│   │   ├── workflow-board.tsx
│   │   ├── task-list.tsx
│   │   └── import-export.tsx
│   ├── lib/                 # Core utilities
│   │   ├── storage.ts       # localStorage + migration
│   │   ├── schemas.ts       # Zod validation schemas
│   │   ├── seed-data.ts     # Demo data generation
│   │   └── use-app-state.tsx # Global state management
│   └── types/               # TypeScript definitions
├── fixtures/                # Demo data fixtures
│   └── demo-project.json
├── tests/
│   └── e2e/                 # Playwright E2E tests
├── docs/                    # Documentation
│   ├── PLAN.md              # Implementation plan
│   └── ARCHITECTURE.md      # Technical architecture
└── .github/
    └── workflows/
        └── ci.yml           # GitHub Actions CI
```

## Import/Export Format

### Export Format

```json
{
  "version": 1,
  "projects": [...],
  "tasks": [...],
  "activities": [...],
  "exportedAt": "2026-01-17T00:00:00.000Z",
  "appVersion": "0.1.0"
}
```

### Schema Versioning

Publishing OS uses **schema versioning** to ensure your data is never lost:

- **Version 1:** Current schema with stage-based workflow
- **Version 0:** Legacy status-based model (auto-migrates to v1)

Imports automatically detect and migrate older formats. Your exported data will always work with future versions.

## Privacy & Data

**Publishing OS is privacy-first:**

- ✅ **No server** — All data stored in browser localStorage
- ✅ **No tracking** — No analytics, telemetry, or cookies
- ✅ **No accounts** — No authentication or user data collection
- ✅ **Browser-only** — Data never leaves your device
- ✅ **Fully portable** — Export anytime, import anywhere

**Limitations:**

- Data is browser-specific (not synced across devices)
- localStorage limit: ~5-10MB (sufficient for 100s of projects)
- Data cleared if browser data/cache is cleared

**Backup Recommendation:** Export your data regularly to safeguard against browser data loss.

## Browser Compatibility

Publishing OS works in all modern browsers:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Any browser with localStorage support

## Testing

Publishing OS has comprehensive test coverage:

### Unit Tests (Vitest)

```bash
npm test
```

Tests include:
- Zod schema validation
- Storage read/write operations
- Data migration (v0 → v1)
- Import/export round-trip

### E2E Tests (Playwright)

```bash
npm run test:e2e
```

Tests include:
- App loads without errors
- Navigation works correctly
- Demo project loading
- Import/export functionality

## CI/CD

GitHub Actions CI runs on every push and pull request:

- ✅ Linting (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Unit tests (Vitest)
- ✅ Build verification (Next.js)

See `.github/workflows/ci.yml` for configuration.

## Documentation

- **[PLAN.md](./docs/PLAN.md)** — Comprehensive implementation plan and task breakdown
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — Technical architecture and design decisions

## Roadmap

Future enhancements (not in current scope):

- Dark mode support
- Cloud sync option (optional)
- Calendar/timeline visualization
- Email reminders for due tasks
- Advanced drag-and-drop for workflow board
- Bulk operations (move multiple projects)
- Custom stages and workflow configuration

## Contributing

This is a demo project showcasing production-ready development practices. Feel free to:

- Fork and customize for your own use
- Report issues or suggest features
- Submit pull requests with improvements

## License

MIT License — see [LICENSE](./LICENSE) file for details.

## Acknowledgments

Built with modern tools and best practices:

- [Next.js](https://nextjs.org/) — React framework
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first styling
- [Zod](https://zod.dev/) — Schema validation
- [Vitest](https://vitest.dev/) — Unit testing
- [Playwright](https://playwright.dev/) — E2E testing

---

**Made with ❤️ for indie authors who want to stay organized without sacrificing privacy.**
