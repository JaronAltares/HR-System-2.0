-- ============================================================
-- 010_rls_jobhistory_job_dept.sql
-- RLS policies for jobhistory, job, and department tables.
-- ============================================================

ALTER TABLE public.jobhistory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "jobhistory_select"
ON public.jobhistory
FOR SELECT
TO authenticated
USING (
  record_status = 'ACTIVE'
  OR EXISTS (
    SELECT 1 FROM public."user" u
    WHERE u.userid = auth.uid()::text
    AND u.user_type IN ('ADMIN', 'SUPERADMIN')
  )
);

CREATE POLICY "jobhistory_insert"
ON public.jobhistory
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public."UserModule_Rights" r
    WHERE r.userid = auth.uid()::text
    AND r.right_code = 'JH_ADD'
    AND r.right_value = 1
  )
);

CREATE POLICY "jobhistory_update_edit"
ON public.jobhistory
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public."UserModule_Rights" r
    WHERE r.userid = auth.uid()::text
    AND r.right_code = 'JH_EDIT'
    AND r.right_value = 1
  )
);

CREATE POLICY "jobhistory_update_delete"
ON public.jobhistory
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public."UserModule_Rights" r
    WHERE r.userid = auth.uid()::text
    AND r.right_code = 'JH_DEL'
    AND r.right_value = 1
  )
);

CREATE POLICY "jobhistory_update_recover"
ON public.jobhistory
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public."user" u
    WHERE u.userid = auth.uid()::text
    AND u.user_type IN ('ADMIN', 'SUPERADMIN')
  )
);

ALTER TABLE public.job ENABLE ROW LEVEL SECURITY;

CREATE POLICY "job_select"
ON public.job
FOR SELECT
TO authenticated
USING (
  record_status = 'ACTIVE'
  OR EXISTS (
    SELECT 1 FROM public."user" u
    WHERE u.userid = auth.uid()::text
    AND u.user_type IN ('ADMIN', 'SUPERADMIN')
  )
);

CREATE POLICY "job_insert"
ON public.job
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public."UserModule_Rights" r
    WHERE r.userid = auth.uid()::text
    AND r.right_code = 'JOB_ADD'
    AND r.right_value = 1
  )
);

CREATE POLICY "job_update_edit"
ON public.job
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public."UserModule_Rights" r
    WHERE r.userid = auth.uid()::text
    AND r.right_code = 'JOB_EDIT'
    AND r.right_value = 1
  )
);

CREATE POLICY "job_update_delete"
ON public.job
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public."UserModule_Rights" r
    WHERE r.userid = auth.uid()::text
    AND r.right_code = 'JOB_DEL'
    AND r.right_value = 1
  )
);

CREATE POLICY "job_update_recover"
ON public.job
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public."user" u
    WHERE u.userid = auth.uid()::text
    AND u.user_type IN ('ADMIN', 'SUPERADMIN')
  )
);

ALTER TABLE public.department ENABLE ROW LEVEL SECURITY;

CREATE POLICY "department_select"
ON public.department
FOR SELECT
TO authenticated
USING (
  record_status = 'ACTIVE'
  OR EXISTS (
    SELECT 1 FROM public."user" u
    WHERE u.userid = auth.uid()::text
    AND u.user_type IN ('ADMIN', 'SUPERADMIN')
  )
);

CREATE POLICY "department_insert"
ON public.department
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public."UserModule_Rights" r
    WHERE r.userid = auth.uid()::text
    AND r.right_code = 'DEPT_ADD'
    AND r.right_value = 1
  )
);

CREATE POLICY "department_update_edit"
ON public.department
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public."UserModule_Rights" r
    WHERE r.userid = auth.uid()::text
    AND r.right_code = 'DEPT_EDIT'
    AND r.right_value = 1
  )
);

CREATE POLICY "department_update_delete"
ON public.department
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public."UserModule_Rights" r
    WHERE r.userid = auth.uid()::text
    AND r.right_code = 'DEPT_DEL'
    AND r.right_value = 1
  )
);

CREATE POLICY "department_update_recover"
ON public.department
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public."user" u
    WHERE u.userid = auth.uid()::text
    AND u.user_type IN ('ADMIN', 'SUPERADMIN')
  )
);