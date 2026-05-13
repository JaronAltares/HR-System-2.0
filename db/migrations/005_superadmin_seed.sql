-- ============================================================
-- 005_superadmin_seed.sql
-- Seeds the SUPERADMIN account (jcesperanza@neu.edu.ph)
-- with all 17 rights = 1 and an ACTIVE status.
-- ============================================================

-- Insert SUPERADMIN user record
INSERT INTO "user" ("userId", email, username, user_type, record_status, stamp)
VALUES ('user1', 'jcesperanza@neu.edu.ph', 'jcesperanza', 'SUPERADMIN', 'ACTIVE', 'SEEDED');

-- Grant access to all 5 modules
INSERT INTO user_module ("userId", module_code, rights_value) VALUES
  ('user1', 'Emp_Mod', 1),
  ('user1', 'JH_Mod', 1),
  ('user1', 'Job_Mod', 1),
  ('user1', 'Dept_Mod', 1),
  ('user1', 'Adm_Mod', 1);

-- Grant all 17 specific rights
INSERT INTO UserModule_Rights ("userId", module_code, right_code, right_value) VALUES
  -- Employee Module
  ('user1', 'Emp_Mod', 'EMP_VIEW', 1),
  ('user1', 'Emp_Mod', 'EMP_ADD', 1),
  ('user1', 'Emp_Mod', 'EMP_EDIT', 1),
  ('user1', 'Emp_Mod', 'EMP_DEL', 1),
  -- Job History Module
  ('user1', 'JH_Mod', 'JH_VIEW', 1),
  ('user1', 'JH_Mod', 'JH_ADD', 1),
  ('user1', 'JH_Mod', 'JH_EDIT', 1),
  ('user1', 'JH_Mod', 'JH_DEL', 1),
  -- Job Module
  ('user1', 'Job_Mod', 'JOB_VIEW', 1),
  ('user1', 'Job_Mod', 'JOB_ADD', 1),
  ('user1', 'Job_Mod', 'JOB_EDIT', 1),
  ('user1', 'Job_Mod', 'JOB_DEL', 1),
  -- Department Module
  ('user1', 'Dept_Mod', 'DEPT_VIEW', 1),
  ('user1', 'Dept_Mod', 'DEPT_ADD', 1),
  ('user1', 'Dept_Mod', 'DEPT_EDIT', 1),
  ('user1', 'Dept_Mod', 'DEPT_DEL', 1),
  -- Admin Module
  ('user1', 'Adm_Mod', 'ADM_USER', 1);