-- supabase/provision_new_user.sql
-- Automatically provisions a new user row + module access + rights defaults
-- whenever someone registers (email or Google OAuth).
--
-- FIX: Was using `module_name` to look up `module_id`, but:
--   1. The "Module" table PK is `module_code`, not `module_id` (no such column).
--   2. The module seed values are codes like 'Emp_Mod', not names.
-- Fixed to iterate over module_code values directly.
-- Also fixed: user row insert now targets the correct "user" table with "userId".

CREATE OR REPLACE FUNCTION public.provision_new_user()
RETURNS trigger AS $$
DECLARE
  v_user_id   TEXT := NEW.id::TEXT;
  v_mod_codes TEXT[] := ARRAY['Emp_Mod', 'JH_Mod', 'Job_Mod', 'Dept_Mod', 'Adm_Mod'];
  v_mod       TEXT;
BEGIN
  -- 1. Insert a USER / INACTIVE row into the app user table
  INSERT INTO public."user" ("userId", email, username, user_type, record_status, stamp)
  VALUES (
    v_user_id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    'USER',
    'INACTIVE',
    'AUTO-PROVISIONED ' || NOW()::TEXT
  )
  ON CONFLICT ("userId") DO NOTHING;

  -- 2. For each module, insert a user_module row and the 17 rights defaults
  FOREACH v_mod IN ARRAY v_mod_codes LOOP

    -- Module access row (Adm_Mod = 0 by default; others = 1 at module level)
    INSERT INTO public.user_module ("userId", module_code, rights_value)
    VALUES (
      v_user_id,
      v_mod,
      CASE WHEN v_mod = 'Adm_Mod' THEN 0 ELSE 1 END
    )
    ON CONFLICT ("userId", module_code) DO NOTHING;

    -- Individual rights: VIEW rights = 1, all ADD/EDIT/DEL/ADM = 0
    INSERT INTO public."UserModule_Rights" ("userId", module_code, right_code, right_value)
    SELECT
      v_user_id,
      r.module_code,
      r.right_code,
      CASE WHEN r.right_code LIKE '%_VIEW' THEN 1 ELSE 0 END
    FROM public.rights r
    WHERE r.module_code = v_mod
    ON CONFLICT ("userId", module_code, right_code) DO NOTHING;

  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate trigger to ensure clean state
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.provision_new_user();