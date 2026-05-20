-- Grant SELECT access to authenticated users on user table
GRANT SELECT ON public."user" TO authenticated;

-- Grant SELECT access to authenticated users on UserModule_Rights table
GRANT SELECT ON public."UserModule_Rights" TO authenticated;

-- RLS Policy: authenticated users can read own row in user table
CREATE POLICY "authenticated users can read own row"
ON public."user"
FOR SELECT
TO authenticated
USING (auth.uid()::text = userid);

-- RLS Policy: authenticated users can read own rights
CREATE POLICY "authenticated users can read own rights"
ON public."UserModule_Rights"
FOR SELECT
TO authenticated
USING (auth.uid()::text = userid);