# Sprint 1 Log

## Dates
- Start: May 12, 2026
- End: May 19, 2026

## What We Finished
- Set up project with Vite + React + Tailwind
- Implemented email and Google OAuth login
- Added login guard that blocks INACTIVE accounts
- Installed Vitest and testing libraries
- Wrote 4 auth flow test cases
- All 4 tests passed successfully
- Updated README with setup instructions

## Blockers We Hit
- Git was not installed on local machine
- Desktop folder not found in default path (was in OneDrive)
- auth.test.jsx was saved in root instead of src/tests

## How We Fixed Them
- Installed Git and cloned repo from home directory
- Used OneDrive Desktop path instead
- Located file using dir /s /b command
- Used git ls-files to confirm file was tracked

## Goals for Sprint 2
- Test all 51 user rights cases (3 users x 17 rights)
- Test soft-delete cascade behavior
- Test recovery of deleted employees
- Verify no hard delete calls exist in codebase