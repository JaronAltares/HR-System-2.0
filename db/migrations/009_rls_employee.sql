-- ============================================================
-- 009_rls_employee.sql
-- RLS policies for the employee table.
-- SELECT: USER sees ACTIVE only; ADMIN/SUPERADMIN see all.
-- INSERT: requires EMP_ADD = 1
-- UPDATE (edit): requires EMP_EDIT = 1
-- UPDATE (deactivate): requires EMP_DEL = 1
-- UPDATE (recover): ADMIN or SUPERADMIN only
-- ============================================================

ALTER TABLE public.employee ENABLE ROW LEVEL SECURITY;

CREATE POLICY "employee_select"
ON public.employee
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

CREATE POLICY "employee_insert"
ON public.employee
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public."UserModule_Rights" r
    WHERE r.userid = auth.uid()::text
    AND r.right_code = 'EMP_ADD'
    AND r.right_value = 1
  )
);

CREATE POLICY "employee_update_edit"
ON public.employee
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public."UserModule_Rights" r
    WHERE r.userid = auth.uid()::text
    AND r.right_code = 'EMP_EDIT'
    AND r.right_value = 1
  )
);

CREATE POLICY "employee_update_delete"
ON public.employee
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public."UserModule_Rights" r
    WHERE r.userid = auth.uid()::text
    AND r.right_code = 'EMP_DEL'
    AND r.right_value = 1
  )
);

CREATE POLICY "employee_update_recover"
ON public.employee
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public."user" u
    WHERE u.userid = auth.uid()::text
    AND u.user_type IN ('ADMIN', 'SUPERADMIN')
  )
);