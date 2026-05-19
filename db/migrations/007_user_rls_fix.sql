-- ============================================================
-- 007_user_rls_fix.sql
-- Enables RLS on user table and allows authenticated 
-- users to read their own profile row.
-- ============================================================

ALTER TABLE public."user" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read own profile" 
ON public."user" 
FOR SELECT 
TO authenticated 
USING ( userid = auth.uid()::text );