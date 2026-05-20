-- ============================================================
-- 016_rls_admin_user_mgmt.sql
-- RLS policies for user table and UserModule_Rights table.
-- Restricts ADMIN from modifying SUPERADMIN rows.
-- ============================================================

-- Enable RLS on user table (may already be enabled, safe to run)
ALTER TABLE public."user" ENABLE ROW LEVEL SECURITY;

-- ADMIN can UPDATE record_status only WHERE user_type != 'SUPERADMIN'
CREATE POLICY "admin_can_activate_deactivate_users"
ON public."user"
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public."user" u
    WHERE u.userid = auth.uid()::text
    AND u.user_type IN ('ADMIN', 'SUPERADMIN')
  )
  AND user_type != 'SUPERADMIN'
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public."user" u
    WHERE u.userid = auth.uid()::text
    AND u.user_type IN ('ADMIN', 'SUPERADMIN')
  )
  AND user_type != 'SUPERADMIN'
);

-- ADMIN cannot modify UserModule_Rights rows belonging to SUPERADMIN
ALTER TABLE public."UserModule_Rights" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "block_admin_from_superadmin_rights"
ON public."UserModule_Rights"
FOR ALL
TO authenticated
USING (
  NOT EXISTS (
    SELECT 1 FROM public."user" u
    WHERE u.userid = "UserModule_Rights".userid
    AND u.user_type = 'SUPERADMIN'
  )
  OR EXISTS (
    SELECT 1 FROM public."user" u
    WHERE u.userid = auth.uid()::text
    AND u.user_type = 'SUPERADMIN'
  )
);