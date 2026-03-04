# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm install        # Install dependencies
npm run dev        # Start Vite dev server (hot reload)
npm run build      # Production build to dist/
npm run lint       # ESLint (flat config, ESLint 9+)
npm run preview    # Preview production build locally
```

No test framework is configured. No `.env` file exists — the Claude API key is passed directly in `src/api/claude.js`.

## Architecture

**EmployeeX** is a React 19 + Vite 7 single-page app — an AI-powered virtual administration assistant with 12 modules, 6 of which make live Claude API calls.

### Data Flow

`main.jsx` → `App.jsx` → `StoreProvider` (React Context) wraps entire app.

**State management** (`src/data/store.jsx`): Single React Context store holding navigation, UI, theme, and admin state. Exposes via `useStore()` hook. Theme persisted in `localStorage`, admin mode in `sessionStorage`.

**AI integration** (`src/api/claude.js`): Single `callClaude(messages, systemPrompt)` function that POSTs to `https://api.anthropic.com/v1/messages` using `claude-sonnet-4-20250514`. The store's `buildSystemContext()` serializes all organizational data into one system prompt (RAG pattern).

**Routing**: State-based view switching in `App.jsx` (no React Router). A `NAV` array defines sidebar navigation (with nested groups for Projects and People). `filteredNav` excludes `settings` when not admin. `navigate(viewId, detailId?)` switches views.

**Responsive**: `useMediaQuery` hook (`src/hooks/useMediaQuery.js`) provides `isMobile`. Mobile gets overlay sidebar drawer with hamburger menu.

### View Files

- `views/Dashboard.jsx` — Overview metrics + alerts
- `views/Chat.jsx` — AI chat ("Ask Employee X") with autocomplete, uses `buildSystemContext` RAG
- `views/People.jsx` — Employee list; `views/EmployeeDetail.jsx` — Single employee detail with edit modal (admin-gated)
- `views/Projects.jsx` — Project list; `views/ProjectDetail.jsx` — Single project detail with edit modals for project, team, deliverables, milestones (all admin-gated)
- `views/Emails.jsx` — Email list
- `views/Deliverables.jsx` — Deliverables list
- `views/Meetings.jsx` — Meetings list
- `views/Reports.jsx` — Reports
- `views/Alerts.jsx` — Alerts & Risks
- `views/Settings.jsx` — Admin CRUD for department, employees, projects, KPIs (admin-gated, nav hidden when not admin)

### Styling

All inline styles via `src/styles.js` helpers (`card`, `btn`, `btnPrimary`, `input`). Theme system (`src/theme.js`) with light/dark mode — colors accessed via `colors` object. Primary colors: `#0EA5E9` (blue), `#8B5CF6` (purple), `#F59E0B` (orange), `#EF4444` (red). Font: DM Sans (Google Fonts, loaded in `index.html`).

### Admin Mode

`isAdmin` boolean in store (default `false`), persisted in `sessionStorage`. Toggled via Shield icon button in sidebar bottom (next to theme toggle). Enabling requires password `admin123` via `prompt()`. When disabled:

- `settings` nav item is filtered out of the sidebar
- If user is on settings view, auto-redirects to dashboard
- Edit buttons hidden in `EmployeeDetail.jsx` and `ProjectDetail.jsx` (project edit, team edit, deliverable add/edit, milestone add/edit)
- `Settings.jsx` has a safety-net guard showing "Not Authorized" if accessed without admin

### API Layer

Backend API client at `src/api/client.js`. Custom hooks: `useApi` (GET with caching via `src/hooks/useCache.js`), `useMutation` (POST/PUT/DELETE). Cache invalidation via `cacheInvalidateMany()`.

### Shared Components

- `src/components/PageHeader.jsx` — Page title header
- `src/components/TabNav.jsx` — Tab navigation
- `src/components/Breadcrumbs.jsx` — Breadcrumb navigation
- `src/components/StatusBadge.jsx` — Exports `StatusBadge`, `PriorityBadge`, `HealthDot`, `ProgressBar`
- `src/components/FormField.jsx` — Form input component (text, select, date, textarea, number)
- `src/components/Avatar.jsx` — Avatar with initials fallback
- `src/components/Shared.jsx` — `Loader`, `Stat`, `ErrorMsg`
- `src/components/ErrorBoundary.jsx` — React error boundary

### Bilingual Support

Arabic and English throughout — department names (`nameAr` field).
