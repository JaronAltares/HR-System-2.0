# HopeHRS — Final RLS Audit
**Prepared by:** M3 — Axle Olimpo
**Sprint:** 3 | Weeks 5–6
**Date:** May 2026

---

## 1. RLS Audit Checklist

### employee
| Policy | Type | Status |
|--------|------|--------|
| employee_select | SELECT | ✅ Verified |
| employee_insert | INSERT | ✅ Verified |
| employee_update_edit | UPDATE | ✅ Verified |
| employee_update_delete | UPDATE | ✅ Verified |
| employee_update_recover | UPDATE | ✅ Verified |

### jobhistory
| Policy | Type | Status |
|--------|------|--------|
| jobhistory_select | SELECT | ✅ Verified |
| jobhistory_insert | INSERT | ✅ Verified |
| jobhistory_update_edit | UPDATE | ✅ Verified |
| jobhistory_update_delete | UPDATE | ✅ Verified |
| jobhistory_update_recover | UPDATE | ✅ Verified |

### job
| Policy | Type | Status |
|--------|------|--------|
| job_select | SELECT | ✅ Verified |
| job_insert | INSERT | ✅ Verified |
| job_update_edit | UPDATE | ✅ Verified |
| job_update_delete | UPDATE | ✅ Verified |
| job_update_recover | UPDATE | ✅ Verified |

### department
| Policy | Type | Status |
|--------|------|--------|
| department_select | SELECT | ✅ Verified |
| department_insert | INSERT | ✅ Verified |
| department_update_edit | UPDATE | ✅ Verified |
| department_update_delete | UPDATE | ✅ Verified |
| department_update_recover | UPDATE | ✅ Verified |

### user
| Policy | Type | Status |
|--------|------|--------|
| Allow authenticated users to read own profile | SELECT | ✅ Verified |
| authenticated users can read own row | SELECT | ✅ Verified |
| admin_can_activate_deactivate_users | UPDATE | ✅ Verified |

### UserModule_Rights
| Policy | Type | Status |
|--------|------|--------|
| authenticated users can read own rights | SELECT | ✅ Verified |
| block_admin_from_superadmin_rights | ALL | ✅ Verified |

---

## 2. Hard Delete Audit

No `DELETE` statements found in any of the following:
- `src/services/employeeService.js` ✅
- `src/services/jobHistoryService.js` ✅
- `src/services/jobService.js` ✅
- `src/services/departmentService.js` ✅
- `src/services/authService.js` ✅
- `db/migrations/` (all 16 files) ✅
- `supabase/provision_user.sql` ✅

All deletions use `record_status = 'INACTIVE'` (soft delete only).

---

## 3. Database Backup

- Supabase automatic backups: ✅ Enabled (Pro plan)
- Last verified: May 2026
- Project: HR-System-2.0

---

## 4. Notes

- `public.profiles` stray table identified — cleanup tracked in `014_drop_stray_profiles_table.sql`
- All RLS policies use `auth.uid()::text` to match `userid` column type (VARCHAR)
- Views `headcount_by_dept` and `salary_summary_by_job` are read-only, no RLS required