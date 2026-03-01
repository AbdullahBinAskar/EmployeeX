# Employee X — Virtual Administration Assistant

> An AI-powered virtual employee that monitors all emails, meetings, tasks, and files across an entire administration. It serves as the organization's living memory, personal assistant to every team member, absence coverage system, and year-end performance intelligence engine.

## Features (12 Modules)

| Module | Description | AI-Powered |
|--------|-------------|:----------:|
| **Dashboard** | Real-time administration overview with alerts | - |
| **Ask Employee X** | Natural language chat over all department data | ✅ Claude API |
| **Email Intelligence** | Auto-classified emails with absence gap detection | - |
| **Meeting Intelligence** | Auto-summarized meetings with decisions & actions | - |
| **Task Tracker** | Full task lifecycle tracking with source attribution | - |
| **Absence Manager** | Handover briefs for ALL employees (not just managers) | ✅ Claude API |
| **Smart Delegation** | AI-scored task reassignment recommendations | ✅ Claude API |
| **Performance** | Per-employee metrics dashboard | - |
| **AI Evaluation** | Auto-generated annual performance evaluations | ✅ Claude API |
| **Auto Reports** | Weekly, monthly, and annual report generation | ✅ Claude API |
| **Knowledge Base** | Searchable institutional memory (EN/AR) | - |
| **Onboarding** | AI-generated onboarding packages for new hires | ✅ Claude API |

## Key Differentiators

- **Admin Panel**: Full CRUD for employees, departments, tasks, and knowledge base
- **Role-based views**: Switch between Admin, Manager, or Employee perspectives
- **Employee self-service handover**: Any employee can generate their own pre-absence checklist, handover brief, and return briefing
- **Bilingual**: Supports Arabic and English queries
- **Real AI**: 6 modules powered by live Claude API calls with full department context as RAG

## Tech Stack

- **Frontend**: React 18 + Vite
- **AI**: Claude API (Sonnet)
- **Styling**: Inline styles (dark theme)
- **State**: React Context with full CRUD operations

## Setup

```bash
npm install
npm run dev
```

## Architecture

```
src/
├── api/claude.js           # Claude API helper
├── components/Shared.jsx   # Reusable UI components
├── data/store.jsx          # React Context store + data serializer
├── views/
│   ├── Admin.jsx           # Admin panel (full CRUD)
│   ├── Dashboard.jsx       # Main overview
│   ├── Chat.jsx            # AI chat with RAG
│   ├── DataViews.jsx       # Emails, Meetings, Tasks, Performance
│   ├── Absence.jsx         # Absence manager (all employees)
│   └── AIViews.jsx         # Delegation, Evaluation, Reports, KB, Onboarding
└── App.jsx                 # Main app with sidebar + user switcher
```

## License

MIT
