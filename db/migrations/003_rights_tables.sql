-- ============================================================
-- 003_rights_tables.sql
-- Creates the 5 auth/rights tables for the HR System.
-- FIX: Resolved merge conflicts. Standardized table names with
-- consistent quoting: "user", "Module", "UserModule_Rights".
-- All columns use NOT NULL where required by the dev guide.
-- ============================================================

CREATE TABLE "user" (
  "userId"      VARCHAR(50)  NOT NULL PRIMARY KEY,
  email         VARCHAR(100),
  username      VARCHAR(50),
  user_type     VARCHAR(20)  NOT NULL,
  record_status VARCHAR(10)  NOT NULL DEFAULT 'INACTIVE',
  stamp         VARCHAR(60)
);

CREATE TABLE "Module" (
  module_code   VARCHAR(20)  NOT NULL PRIMARY KEY,
  module_name   VARCHAR(50),
  record_status VARCHAR(10)  NOT NULL DEFAULT 'ACTIVE',
  stamp         VARCHAR(60)
);

CREATE TABLE user_module (
  "userId"      VARCHAR(50)  NOT NULL REFERENCES "user"("userId"),
  module_code   VARCHAR(20)  NOT NULL REFERENCES "Module"(module_code),
  rights_value  INT          NOT NULL DEFAULT 0,
  PRIMARY KEY ("userId", module_code)
);

CREATE TABLE rights (
  right_code    VARCHAR(20)  NOT NULL PRIMARY KEY,
  right_name    VARCHAR(50),
  right_value   INT          NOT NULL DEFAULT 1,
  module_code   VARCHAR(20)  NOT NULL REFERENCES "Module"(module_code),
  record_status VARCHAR(10)  NOT NULL DEFAULT 'ACTIVE',
  stamp         VARCHAR(60)
);

CREATE TABLE "UserModule_Rights" (
  "userId"      VARCHAR(50)  NOT NULL REFERENCES "user"("userId"),
  module_code   VARCHAR(20)  NOT NULL REFERENCES "Module"(module_code),
  right_code    VARCHAR(20)  NOT NULL REFERENCES rights(right_code),
  right_value   INT          NOT NULL DEFAULT 0,
  PRIMARY KEY ("userId", module_code, right_code)
);