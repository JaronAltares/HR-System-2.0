# HopeHRS — HR System 2.0

A Human Resource System built with React, Vite, Supabase, and Tailwind CSS.

## How to Run This Project

### 1. Clone the repo
git clone https://github.com/JaronAltares/HR-System-2.0

### 2. Install packages
npm install

### 3. Set up your .env file
- Make a new file called `.env` in the root folder
- Add these inside:
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here

### 4. Start the app
npm run dev

## Tech Stack
- React + Vite
- Supabase (auth + database)
- Tailwind CSS

## Team Members
- M1 — Project Lead / Full Stack
- M2 — Frontend
- M3 — Backend
- M4 — Auth
- M5 — QA / Docs (Eins Layupan)

## Git Branching Strategy & Protection

This project follows a strict branching strategy as defined in the Sprint Deliverables document.

### Protected Branches
- `main` — Production branch (stable)
- `dev` — Main integration branch (default)

### Branch Naming Convention
| Prefix  | Purpose | Example |
|---------|---------|---------|
| `feat/` | New features | `feat/employee-api` |
| `fix/` | Bug fixes | `fix/login-bug` |
| `db/` | Database changes | `db/employee-rls-policies` |
| `test/` | Testing | `test/51-rights-matrix` |
| `docs/` | Documentation | `docs/user-manual` |
| `chore/` | Config, tooling | `chore/github-branch-protection` |

### Workflow Rules
- Work on feature branches only
- All PRs target `dev`
- PR must be reviewed by at least one teammate before merging
- Delete branch after successful merge