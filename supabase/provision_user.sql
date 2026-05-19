-- ============================================================
-- provision_user.sql
-- Drops and recreates the provision_new_user() trigger
-- Column names match 003_rights_tables.sql and 004_rights_seed.sql
-- ============================================================

-- Drop old trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.provision_new_user();

-- Recreate with correct column names
CREATE OR REPLACE FUNCTION public.provision_new_user()
RETURNS trigger AS $$
DECLARE
  v_user_id TEXT := NEW.id::text;
  v_modules TEXT[] := ARRAY['Emp_Mod', 'JH_Mod', 'Job_Mod', 'Dept_Mod', 'Adm_Mod'];
  v_module  TEXT;
BEGIN
  -- 1. Insert row into user table as USER / INACTIVE
  INSERT INTO public."user" (userId, email, username, user_type, record_status, stamp)
  VALUES (
    v_user_id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    'USER',
    'INACTIVE',
    'AUTO-PROVISIONED'
  );

  -- 2. Insert user_module rows for all 5 modules
  FOREACH v_module IN ARRAY v_modules LOOP
    INSERT INTO public.user_module (userId, module_code, rights_value)
    VALUES (v_user_id, v_module, CASE WHEN v_module = 'Adm_Mod' THEN 0 ELSE 1 END);
  END LOOP;

  -- 3. Insert UserModule_Rights — VIEW rights = 1, all others = 0
  INSERT INTO public."UserModule_Rights" (userId, module_code, right_code, right_value)
  SELECT
    v_user_id,
    r.module_code,
    r.right_code,
    CASE WHEN r.right_code LIKE '%VIEW%' THEN 1 ELSE 0 END
  FROM public.rights r;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.provision_new_user();
