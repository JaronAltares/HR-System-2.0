-- 1. Clear out any old, broken insert policies on the employee table
DROP POLICY IF EXISTS "Allow superadmin insertion" ON public.employee;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.employee;
DROP POLICY IF EXISTS "Enable insert for users based on user_type" ON public.employee;

-- 2. Create the policy using Supabase's native JWT metadata check
CREATE POLICY "Allow superadmin insertion" 
ON public.employee
FOR INSERT 
TO authenticated
WITH CHECK (
  (auth.jwt() -> 'user_metadata' ->> 'user_type') = 'SUPERADMIN'
);