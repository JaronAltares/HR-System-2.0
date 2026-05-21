# 📝 Sprint 3 Log

## Dates
* **Start:** May 14, 2026
* **End:** May 21, 2026

## Live Application
* **URL:** https://hr-system-2-0.vercel.app/

## What We Finished
* **HR Report Analytics Pages (M2, M3):** Implemented headcount and salary report views along with dynamic analytics dashboards.
* **User Management Enhancements (M2, M4):** Built a dedicated User Management UI featuring robust `SUPERADMIN` profile safeguards and explanatory restriction tooltips.
* **Security & Routing (M3, M4):** Deployed Admin module routing guards, Row-Level Security (RLS) audit documentation, and application-wide `record_status` gating to immediately block inactive user interactions.
* **Quality Assurance & Docs (M5):** Created a comprehensive automated test suite (UI safeguards, routing guards, and database RLS integration) and compiled the official Sprint 3 User Manual.

## Blockers We Hit
* Standard Admin users were originally able to view sensitive backend `SUPERADMIN` rows due to overlapping database selection queries.
* Next.js routing transitions occasionally caused a flash of protected content before the Admin Route Guard successfully redirected unauthorized sessions.

## How We Fixed Them
* **Tightened Database RLS:** Axle configured precise Row-Level Security policies to ensure standard Admin accounts receive empty responses when trying to query Superadmin tables.
* **Optimized Routing Guards:** Fred added loading states and session status evaluation checks inside the middleware guard to prevent rendering any component trees prior to complete auth verification.