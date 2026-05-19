-- ============================================================
-- 007_user_rls_fix.sql
-- Enables RLS on user table and allows authenticated 
-- users to read their own profile row.
-- ============================================================

-- 1. Enable Row Level Security
ALTER TABLE public."user" ENABLE ROW LEVEL SECURITY;

-- 2. Create the missing RLS Select Policy for Authenticated Profiles
-- This allows the frontend to fetch the user's record_status 
-- without getting a 42501 Permission Denied error.
CREATE POLICY "Allow authenticated users to read own profile" 
ON public."user" 
FOR SELECT 
TO authenticated 
USING ( "userId" = auth.uid()::text );