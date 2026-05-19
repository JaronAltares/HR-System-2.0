-- ============================================================
-- 006_verify_seed.sql
-- Verification queries confirming row counts and FK integrity
-- ============================================================

-- 1. Verify HR Tables (Expected: Emp=32, Dept=8, Job=14, JH=54)
SELECT 'employee'   AS table_name, COUNT(*) AS row_count FROM employee   UNION ALL
SELECT 'department',                COUNT(*)              FROM department  UNION ALL
SELECT 'job',                       COUNT(*)              FROM job         UNION ALL
SELECT 'jobHistory',                COUNT(*)              FROM jobHistory;

-- 2. Verify Auth/Rights Tables (Expected: Modules=5, Rights=17, SUPERADMIN=1)
SELECT 'Module'            AS table_name, COUNT(*) AS row_count FROM "Module"                                  UNION ALL
SELECT 'rights',                          COUNT(*)              FROM rights                                    UNION ALL
SELECT 'user (SUPERADMIN)',               COUNT(*)              FROM "user" WHERE user_type = 'SUPERADMIN';

-- 3. FK Integrity: jobHistory → employee
SELECT COUNT(*) AS orphaned_jobHistory_employee
FROM jobHistory jh
LEFT JOIN employee e ON jh.empNo = e.empno
WHERE e.empno IS NULL;

-- 4. FK Integrity: jobHistory → job
SELECT COUNT(*) AS orphaned_jobHistory_job
FROM jobHistory jh
LEFT JOIN job j ON jh.jobCode = j.jobCode
WHERE j.jobCode IS NULL;

-- 5. FK Integrity: jobHistory → department
SELECT COUNT(*) AS orphaned_jobHistory_department
FROM jobHistory jh
LEFT JOIN department d ON jh.deptCode = d.deptCode
WHERE d.deptCode IS NULL;

-- 6. Verify SUPERADMIN has all 17 rights
SELECT COUNT(*) AS superadmin_rights
FROM "UserModule_Rights"
WHERE userId = 'user1' AND right_value = 1;
