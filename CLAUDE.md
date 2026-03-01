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

**State management** (`src/data/store.jsx`): Single React Context store holding all organizational data (employees, departments, meetings, emails, tasks, knowledge base). All state is in-memory — resets on page reload. Exposes CRUD operations via `useStore()` hook.

**AI integration** (`src/api/claude.js`): Single `callClaude(messages, systemPrompt)` function that POSTs to `https://api.anthropic.com/v1/messages` using `claude-sonnet-4-20250514`. The store's `buildSystemContext()` serializes all organizational data into one system prompt (RAG pattern).

**Routing**: State-based view switching in `App.jsx` (no React Router). A `NAV` array maps 12 module IDs to view components.

### View Files

- `views/Dashboard.jsx` — Overview metrics + alerts
- `views/Chat.jsx` — AI chat ("Ask Employee X") with autocomplete, uses `buildSystemContext` RAG
- `views/DataViews.jsx` — Exports `EmailsView`, `MeetingsView`, `TasksView`, `PerformanceView`
- `views/AIViews.jsx` — Exports `DelegationView`, `EvaluationView`, `ReportsView`, `KnowledgeView`, `OnboardingView`
- `views/Absence.jsx` — Absence manager with handover/return briefs
- `views/Admin.jsx` — Admin panel with full CRUD (visible only in Admin mode)

### Styling

All inline styles. Dark theme only (`#060A12` background, `#E2E8F0` text). Primary colors: `#0EA5E9` (blue), `#8B5CF6` (purple), `#F59E0B` (orange), `#EF4444` (red). Font: DM Sans (Google Fonts, loaded in `index.html`).

### Role System

`currentUser` in store controls perspective: `null` = Admin (sees Admin panel + all data), otherwise an employee ID for Manager/Employee view. User switcher is in the sidebar.

### Bilingual Support

Arabic and English throughout — chat suggestions, knowledge base entries, department names (`nameAr` field).
