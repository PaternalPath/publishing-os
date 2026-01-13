# Publishing OS

A comprehensive publishing workflow management system for indie authors, built with Next.js, TypeScript, and Tailwind CSS.

## Overview

Publishing OS is a demo-first application that helps authors manage their book publishing projects from draft to publication. Track metadata, manage checklists for platforms like Amazon KDP and IngramSpark, organize assets, and export publication-ready metadata packs.

## UI Highlights

**Polished, Production-Ready Design**

- **Modern Navigation**: Sticky header with logo, responsive mobile menu, and active state indicators
- **Toast Notifications**: Real-time feedback for all user actions (create, update, export)
- **Modal Dialogs**: Clean, accessible modals for forms and confirmations
- **Empty States**: Helpful empty states with clear calls-to-action
- **Interactive Cards**: Hover effects, smooth transitions, and visual hierarchy
- **Status Filters**: Pill-style filter buttons with live counts
- **Progress Indicators**: Gradient progress bars with completion percentages
- **Consistent Spacing**: Professional layout with consistent padding and gaps
- **Icon System**: Lucide icons with color-coded backgrounds for visual distinction

All pages follow a unified design system with careful attention to typography, color, and spacing for a cohesive product feel.

## Features

### Project Management
- Create and manage multiple book projects
- Track project status: Drafting, Ready, Published
- Filter and search projects by status and title
- Visual progress tracking with completion percentages

### Dashboard & Analytics
- Real-time KPIs: total projects, drafting, ready, published
- Recent activity feed across all projects
- Upcoming tasks with due date tracking
- At-a-glance project health monitoring

### Metadata Management
- Comprehensive metadata tracking:
  - Title, subtitle, author, pen name
  - Series information and ISBN
  - Trim size specifications
  - Keywords and categories
  - Book descriptions/blurbs
- Edit all fields inline with auto-save

### Publishing Checklists
- Pre-built tasks for KDP and IngramSpark workflows
- Custom checklist items with platform targeting
- Due date tracking and completion monitoring
- Organized by platform (KDP, IngramSpark, or Both)

### Asset Organization
- Track cover and interior file assets
- Standardized file naming conventions
- Upload date tracking
- Placeholder support for demo mode

### Data Export
- **Metadata Packs**: Clean, formatted text files ready for KDP/IngramSpark
- **JSON Export**: Complete data backup in JSON format
- Per-project or full database export options

### Demo Mode
- 5 pre-loaded demo projects with varied statuses
- localStorage persistence (browser-only, no server required)
- Reset to demo data at any time
- Privacy-first: no data collection or external transmission

## Quick Start

### Prerequisites
- Node.js 20+ (or any version supporting Next.js 16)
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd publishing-os

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

Publishing OS uses a modern React architecture with:

- **Next.js 16** with App Router for routing and SSR
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Context** for global state management
- **localStorage** for client-side persistence
- **date-fns** for date formatting
- **lucide-react** for icons
- **nanoid** for ID generation
- **Zod** for schema validation

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for detailed architecture documentation.

## Project Structure

```
publishing-os/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── dashboard/    # Dashboard page
│   │   ├── projects/     # Projects list and detail pages
│   │   ├── exports/      # Export functionality
│   │   └── settings/     # Settings page
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   └── navigation.tsx
│   ├── lib/             # Utilities and hooks
│   │   ├── storage.ts   # localStorage utilities
│   │   ├── seed-data.ts # Demo data generation
│   │   └── use-app-state.tsx
│   └── types/           # TypeScript type definitions
├── docs/                # Documentation
└── public/              # Static assets
```

## Deployment

### Deploy on Vercel

The easiest way to deploy Publishing OS is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/publishing-os)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy (no environment variables needed)

### Deploy Elsewhere

Build the production bundle:

```bash
npm run build
npm run start
```

The app will be available on port 3000. No server-side configuration is required as all data is stored client-side.

## Privacy & Data

Publishing OS operates in demo mode with complete privacy:

- **No server**: All data stored in browser localStorage
- **No tracking**: No analytics or telemetry
- **No accounts**: No authentication or user data collection
- **Browser-only**: Data never leaves your device
- **Ephemeral**: Data tied to browser, cleared with browser data

Always export important data for backup purposes.

## Browser Compatibility

Publishing OS works in all modern browsers:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

localStorage must be enabled.

## Contributing

This is a demo project. Feel free to fork and customize for your own use.

## License

MIT License - see LICENSE file for details

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide Icons](https://lucide.dev/) - Icon library
- [date-fns](https://date-fns.org/) - Date utilities
- [nanoid](https://github.com/ai/nanoid) - ID generation
- [Zod](https://zod.dev/) - Schema validation

## Support

For questions or issues, please open a GitHub issue.
