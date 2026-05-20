# Sprint 2 System Documentation & Handoff Specifications
**Module:** M5 — Documentation, Architecture Verification, and Systems Testing Lead  
**Project Version:** HR-System-2.0  
**Target Delivery Status:** Stable / Ready for Review

---

## 1. System Integration Overview (The Blueprint)
Sprint 2 introduced critical security middleware layers, bringing the platform to a secure production-ready standard. The application state management flow executes sequentially as follows:

[User Action: Sign-In / OAuth]
│
▼
┌───────────────────────┐
│      AuthProvider     │ ──► Catch Session Tokens from Supabase Backend
└───────────────────────┘
│
▼
┌───────────────────────┐
│  UserRightsProvider   │ ──► Hydrate User State; Fetch Role (user_type)
└───────────────────────┘
│
▼
┌───────────────────────┐
│    ProtectedRoute     │ ──► Catch Path Infiltration; Block Route Exceptions
└───────────────────────┘
│
▼
┌───────────────────────┐
│     AppWithShell      │ ──► Render Navigation Shell UI & Pages Context
└───────────────────────┘


1. **Identity Proofing:** User logs via native email/password protocols or external Google OAuth nodes.
2. **Session Attachment:** `AuthProvider` intercepts the identity token returned from Supabase, projecting security hooks across child nodes.
3. **Role-Based Hydration:** `UserRightsProvider` maps the active metadata profiles (`useCurrentUser`) and registers authorization classifications (`user_type`: EMPLOYEE, ADMIN, SUPERADMIN).
4. **Perimeter Verification:** Interleaved `ProtectedRoute` components trap root traversal attempts, executing instant default bounce actions to `/login` if security clear criteria fail.

---

## 2. Role-Based Access Control (RBAC) Matrix

| Protected Resource / Route Path | Employee Status | HR Administrator | System Admin / Superadmin |
| :--- | :--- | :--- | :--- |
| `View /employees` | Read-Only View | Full CRUD Mutations | Full CRUD Mutations |
| `View /jobhistory` | Read-Only View | Full CRUD Mutations | Read-Only View |
| `Access /admin` | ❌ Blocked (Bounced) | ❌ Blocked (Bounced) | Full Control Dashboard |
| `Access /deleted-items` | ❌ Blocked (Bounced) | Full Recovery Control | Full Recovery Control |

---

## 3. Core Service Integration Specifications
System data restoration relies on specialized transactional modules implemented during Sprint 2. Archived records under soft-delete restrictions (`record_status === 'INACTIVE'`) are handled natively across the following interfaces:

* **Employee Data Control (`employeeService.js`)** Pulls target profiles from primary pools; flags inactive entities and triggers state recoveries via `recoverEmployee(empno)`.
* **Historical Audit Tracks (`jobHistoryService.js`)** Inspects lifecycle adjustments using composite key evaluations; manages entity recovery via `recoverJobHistory(empno, jobcode, effdate)`.
* **Positional Indexing (`jobService.js`)** Maintains dictionary lookups across functional groups; executes restorations via `recoverJob(jobCode)`.
* **Organizational Structures (`departmentService.js`)** Binds business units with auditing references; executes restoration changes via `recoverDepartment(deptCode)`.

---

## 4. Quality Assurance & Test Validation Ledger

### [Test Case 1] Native Registration Engine
* **Action:** Direct browser execution to `/register`, processing dummy testing inputs.
* **Intended Result:** Clean intercept by Supabase database schemas; UI displays the account pending confirmation block message.
* **Status:** **PASSED**

### [Test Case 2] Third-Party Google OAuth Gateway
* **Action:** Trigger external provider login from `/login`.
* **Intended Result:** Handshake resolves through OAuth loops; paths route through `/auth/callback` to establish secure application entry.
* **Status:** **PASSED**

### [Test Case 3] Perimeter Protection & URL Access Gating
* **Action:** Log into an active account categorized with standard **Employee** roles, then manually input `http://localhost:5173/deleted-items` into the URL bar.
* **Intended Result:** The UI catches the authorization breach, halts layout processing, and routes the browser back to safe landing zones (`/employees`).
* **Status:** **PASSED**

---