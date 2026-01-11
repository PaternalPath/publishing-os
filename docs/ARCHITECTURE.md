# Publishing OS Architecture

This document describes the architecture, design decisions, and technical implementation of Publishing OS.

## Overview

Publishing OS is a client-side single-page application (SPA) built with Next.js 16, TypeScript, and Tailwind CSS. It uses browser localStorage for persistence and requires no backend server or external services.

## Architecture Principles

### 1. Demo-First Design
- No authentication or user accounts
- No external API dependencies
- No server-side data processing
- All functionality works offline after initial load

### 2. Privacy-First
- Zero data collection
- No analytics or telemetry
- No cookies beyond Next.js essentials
- All data stored locally in browser

### 3. Type Safety
- Full TypeScript coverage
- Strict mode enabled
- Zod schemas for runtime validation
- No `any` types in production code

## Tech Stack

### Core Framework
- **Next.js 16.1.1**: React framework with App Router
- **React 19.2.3**: UI library with latest features
- **TypeScript 5**: Type-safe development

### Styling
- **Tailwind CSS 4**: Utility-first CSS framework
- Custom design system with consistent spacing, colors, and typography
- Responsive design with mobile-first approach

### State Management
- **React Context API**: Global state management
- Custom `useAppState` hook for accessing app state
- Automatic localStorage sync on state changes

### Utilities
- **date-fns**: Date formatting and manipulation
- **nanoid**: Unique ID generation
- **lucide-react**: Icon library
- **Zod**: Runtime schema validation

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard page
│   ├── projects/          # Projects list and detail
│   │   └── [id]/         # Dynamic project detail page
│   ├── exports/           # Export functionality
│   ├── settings/          # Settings page
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Root redirect to dashboard
│   └── globals.css        # Global styles
│
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── badge.tsx
│   └── navigation.tsx    # Main navigation bar
│
├── lib/                  # Business logic and utilities
│   ├── storage.ts        # localStorage utilities
│   ├── seed-data.ts      # Demo data generation
│   └── use-app-state.tsx # Global state management
│
└── types/                # TypeScript definitions
    └── index.ts          # All type definitions
```

## Data Model

### Core Types

#### Project
```typescript
interface Project {
  id: string;
  status: 'drafting' | 'ready' | 'published';
  metadata: Metadata;
  checklist: ChecklistItem[];
  assets: Asset[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Metadata
```typescript
interface Metadata {
  title: string;
  subtitle?: string;
  author: string;
  penName?: string;
  series?: string;
  isbn?: string;
  trim?: string;
  keywords: string[];
  categories: string[];
  blurb: string;
}
```

#### ChecklistItem
```typescript
interface ChecklistItem {
  id: string;
  label: string;
  platform: 'kdp' | 'ingramspark' | 'both';
  completed: boolean;
  dueDate?: string;
}
```

#### Asset
```typescript
interface Asset {
  id: string;
  type: 'cover' | 'interior';
  fileName: string;
  uploadedAt?: string;
}
```

#### Activity
```typescript
interface Activity {
  id: string;
  projectId: string;
  type: 'created' | 'status_changed' | 'metadata_updated' | 'checklist_updated' | 'asset_uploaded';
  description: string;
  timestamp: string;
}
```

### AppState
```typescript
interface AppState {
  projects: Project[];
  activities: Activity[];
}
```

## State Management

### React Context Pattern

Publishing OS uses React Context for global state management:

```typescript
AppStateProvider
  ├── State: AppState
  ├── Actions:
  │   ├── addProject()
  │   ├── updateProject()
  │   ├── deleteProject()
  │   ├── updateChecklist()
  │   ├── addActivity()
  │   ├── resetData()
  │   └── exportJSON()
  └── Auto-sync to localStorage
```

### State Flow

1. **Initial Load**: Load state from localStorage or use seed data
2. **User Action**: Trigger action via hook
3. **State Update**: Update React state immutably
4. **Side Effects**: Log activity, update timestamps
5. **Persist**: Auto-save to localStorage via useEffect
6. **Re-render**: Components re-render with new state

### Data Persistence

localStorage key: `publishing-os-data`

```typescript
// Save
localStorage.setItem('publishing-os-data', JSON.stringify(state));

// Load
const stored = localStorage.getItem('publishing-os-data');
const state = JSON.parse(stored);
```

## Routing

### App Router Structure

```
/                      → Redirect to /dashboard
/dashboard             → Dashboard with KPIs and activity
/projects              → Projects list with filters
/projects/[id]         → Project detail with tabs
/exports               → Export functionality
/settings              → Settings and data management
```

### Dynamic Routes

- `/projects/[id]`: Uses Next.js dynamic segments
- Project ID from URL params
- 404 handling for invalid IDs

## Component Architecture

### Component Hierarchy

```
RootLayout (app/layout.tsx)
├── AppStateProvider (context)
├── Navigation (global nav)
└── Page Content
    ├── Dashboard
    ├── Projects List
    ├── Project Detail
    │   ├── MetadataTab
    │   ├── ChecklistTab
    │   ├── AssetsTab
    │   └── NotesTab
    ├── Exports
    └── Settings
```

### UI Components

All UI components follow consistent patterns:

- **Props Interface**: TypeScript interface for props
- **Variants**: Support multiple visual variants
- **Accessibility**: Semantic HTML and ARIA labels
- **Responsive**: Mobile-first responsive design

## Data Flow

### Adding a Project

```
User clicks "New Project"
  → Form state in component
  → User submits form
  → Call addProject()
  → Create Project object with nanoid ID
  → Update projects array
  → Create activity log entry
  → Save to localStorage
  → Navigate to project detail
```

### Updating Metadata

```
User edits field
  → onChange handler
  → Call updateProject()
  → Merge partial updates
  → Update updatedAt timestamp
  → Create activity log
  → Save to localStorage
  → Auto-sync (no save button needed)
```

### Export Flow

```
User clicks export
  → Format data (JSON or text)
  → Create Blob
  → Generate download URL
  → Trigger browser download
  → Cleanup URL
```

## Performance Considerations

### Optimization Strategies

1. **Client-Side Only**: No server round-trips after initial load
2. **Lazy Loading**: Route-based code splitting via Next.js
3. **Minimal Re-renders**: Context split by concern
4. **localStorage Throttling**: useEffect debouncing on state changes
5. **Activity Log Pruning**: Keep only latest 100 activities

### Bundle Size

- Next.js automatic code splitting
- Tree-shaking unused code
- Minimal dependencies (no heavy libraries)
- Icons from lucide-react (tree-shakeable)

## Security Considerations

### Threat Model

Since this is a demo app with local-only data:

- **No XSS risk**: No user-generated content rendered as HTML
- **No CSRF**: No server-side mutations
- **No injection**: No database or external services
- **Data privacy**: All data stays in browser

### Input Sanitization

- All user input rendered as text (React escapes by default)
- No dangerouslySetInnerHTML usage
- Form validation on client side only (demo mode)

## Browser Compatibility

### Minimum Requirements

- **localStorage**: Required for persistence
- **ES2020**: Modern JavaScript features
- **Fetch API**: For potential future enhancements
- **CSS Grid/Flexbox**: For layout

### Supported Browsers

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- No IE support

## Future Enhancement Opportunities

### Potential Features (Not Implemented)

1. **Import JSON**: Upload previously exported data
2. **File Upload**: Real asset management (covers, interiors)
3. **Collaboration**: Share projects via link
4. **Templates**: Project templates for different genres
5. **Analytics**: Track publishing progress over time
6. **Cloud Sync**: Optional backend for multi-device sync
7. **Dark Mode**: Theme switching
8. **Print View**: Printer-friendly project reports

### Technical Debt & Limitations

1. **No Backend**: All data client-side only
2. **No Search Index**: Linear search through projects
3. **No Pagination**: All projects load at once
4. **No Undo/Redo**: No action history
5. **No Real-time**: Single browser tab only
6. **Storage Limit**: localStorage ~5-10MB limit

## Development Workflow

### Local Development

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (http://localhost:3000)
npm run lint       # Run ESLint
npm run build      # Production build
npm run start      # Start production server
```

### Code Style

- **ESLint**: Next.js recommended config
- **Prettier**: Code formatting (if configured)
- **TypeScript**: Strict mode enabled
- **Conventional Commits**: feat:, fix:, docs:, chore:

### Testing Strategy

This demo does not include tests, but recommended:

1. **Unit Tests**: Jest + React Testing Library
2. **E2E Tests**: Playwright or Cypress
3. **Type Tests**: TypeScript strict mode
4. **Visual Tests**: Storybook (optional)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Deploy (zero config)
4. Automatic HTTPS, CDN, caching

### Static Export

```bash
npm run build
# Outputs to .next/ directory
# Serve with any static host
```

### Environment Variables

None required for demo mode.

## Monitoring & Analytics

### Current State

- No analytics
- No error tracking
- No performance monitoring

### Recommendations (Production)

- **Sentry**: Error tracking
- **Vercel Analytics**: Web vitals
- **LogRocket**: Session replay (optional)

## Conclusion

Publishing OS demonstrates a modern, type-safe, privacy-first approach to building a client-side application with Next.js. The architecture prioritizes simplicity, user privacy, and developer experience while maintaining professional code quality and documentation standards.