-- Function: automatically sets default metadata and inserts rights for new users
CREATE OR REPLACE FUNCTION public.provision_new_user()
RETURNS trigger AS $$
DECLARE
  v_user_id UUID := NEW.id;
  v_modules TEXT[] := ARRAY['Emp_Mod', 'JH_Mod', 'Job_Mod', 'Dept_Mod', 'Adm_Mod'];
  v_module TEXT;
  v_module_id INT;
BEGIN
  -- Set role to 'USER' and status to 'INACTIVE' by default
  NEW.raw_app_meta_data = jsonb_build_object(
    'role', 'USER',
    'record_status', 'INACTIVE'
  );

  -- Insert 5 module rows for the new user
  FOREACH v_module IN ARRAY v_modules LOOP
    SELECT module_id INTO v_module_id FROM public."Module" WHERE module_name = v_module;
    
    INSERT INTO public.user_module (user_id, module_id)
    VALUES (v_user_id, v_module_id);

    -- Insert 17 rights rows (VIEW only = 1, all others = 0)
    INSERT INTO public."UserModule_Rights" (user_id, module_id, rights_id, is_enabled)
    SELECT v_user_id, v_module_id, rights_id,
      CASE WHEN rights_name LIKE '%VIEW%' THEN 1 ELSE 0 END
    FROM public.rights;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger runs automatically after every new signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.provision_new_user();