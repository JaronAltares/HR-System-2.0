-- This function automatically sets default metadata for new users
CREATE OR REPLACE FUNCTION public.provision_new_user()
RETURNS trigger AS $$
BEGIN
  -- Set role to 'USER' and status to 'INACTIVE' by default
  NEW.raw_app_meta_data = jsonb_build_object(
    'role', 'USER',
    'record_status', 'INACTIVE'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger runs automatically after every new signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.provision_new_user();