-- ============================================================
-- 006_verify_seed.sql
-- Verification queries confirming row counts and integrity
-- ============================================================

-- 1. Verify HR Tables (Expected: Emp=31, Dept=8, Job=14, JH=54)
SELECT 'employee' AS table_name, COUNT(*) AS row_count FROM employee UNION ALL
SELECT 'department', COUNT(*) FROM department UNION ALL
SELECT 'job', COUNT(*) FROM job UNION ALL
SELECT 'jobHistory', COUNT(*) FROM jobHistory;

-- 2. Verify Auth/Rights Tables (Expected: Modules=5, Rights=17, SUPERADMIN=1)
SELECT 'Module' AS table_name, COUNT(*) AS row_count FROM Module UNION ALL
SELECT 'rights', COUNT(*) FROM rights UNION ALL
SELECT 'user (SUPERADMIN)', COUNT(*) FROM "user" WHERE user_type = 'SUPERADMIN';