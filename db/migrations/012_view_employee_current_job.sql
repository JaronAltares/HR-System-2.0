-- ============================================================
-- 012_view_employee_current_job.sql
-- View: employee_current_job
-- Returns the latest active jobhistory row per employee,
-- joined with job.jobdesc and department.deptname.
-- ============================================================

CREATE OR REPLACE VIEW public.employee_current_job AS
SELECT
  e.empno,
  e.lastname,
  e.firstname,
  e.gender,
  e.birthdate,
  e.hiredate,
  e.sepdate,
  e.record_status,
  e.stamp,
  j.jobcode,
  j.jobdesc,
  d.deptcode,
  d.deptname,
  jh.salary,
  jh.effdate
FROM public.employee e
LEFT JOIN LATERAL (
  SELECT *
  FROM public.jobhistory jh2
  WHERE jh2.empno = e.empno
    AND jh2.record_status = 'ACTIVE'
  ORDER BY jh2.effdate DESC
  LIMIT 1
) jh ON true
LEFT JOIN public.job j ON j.jobcode = jh.jobcode
LEFT JOIN public.department d ON d.deptcode = jh.deptcode;