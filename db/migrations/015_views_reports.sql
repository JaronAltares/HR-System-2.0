-- ============================================================
-- 015_views_reports.sql
-- Creates two HR report views:
--   1. headcount_by_dept  — active employee count per department
--   2. salary_summary_by_job — min/max/avg salary per active job
-- ============================================================

-- 1. Headcount by Department
-- Counts active employees per department using their latest active jobhistory row
CREATE OR REPLACE VIEW public.headcount_by_dept AS
SELECT
  d.deptcode,
  d.deptname,
  COUNT(DISTINCT e.empno) AS employee_count
FROM public.department d
LEFT JOIN LATERAL (
  SELECT jh.empno
  FROM public.jobhistory jh
  WHERE jh.deptcode = d.deptcode
    AND jh.record_status = 'ACTIVE'
  ORDER BY jh.effdate DESC
  LIMIT 1
) latest ON true
LEFT JOIN public.employee e ON e.empno = latest.empno
  AND e.record_status = 'ACTIVE'
WHERE d.record_status = 'ACTIVE'
GROUP BY d.deptcode, d.deptname
ORDER BY d.deptcode;

-- 2. Salary Summary by Job
-- Shows min, max, and avg salary per active job from active jobhistory rows
CREATE OR REPLACE VIEW public.salary_summary_by_job AS
SELECT
  j.jobcode,
  j.jobdesc,
  MIN(jh.salary) AS min_salary,
  MAX(jh.salary) AS max_salary,
  ROUND(AVG(jh.salary), 2) AS avg_salary
FROM public.job j
LEFT JOIN public.jobhistory jh ON jh.jobcode = j.jobcode
  AND jh.record_status = 'ACTIVE'
WHERE j.record_status = 'ACTIVE'
GROUP BY j.jobcode, j.jobdesc
ORDER BY j.jobcode;