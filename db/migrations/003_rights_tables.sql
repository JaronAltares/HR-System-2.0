-- ============================================================
-- 003_rights_tables.sql
-- Creates the 5 auth/rights tables for the HR System
-- ============================================================

CREATE TABLE users (
  userid VARCHAR(50) NOT NULL PRIMARY KEY,
  email VARCHAR(100),
  username VARCHAR(50),
  user_type VARCHAR(20) NOT NULL,
  record_status VARCHAR(10) NOT NULL DEFAULT 'INACTIVE',
  stamp VARCHAR(100)
);

CREATE TABLE module (
  module_code VARCHAR(20) NOT NULL PRIMARY KEY,
  module_name VARCHAR(50),
  record_status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
  stamp VARCHAR(100)
);

CREATE TABLE user_module (
  userid VARCHAR(50) NOT NULL REFERENCES users(userid),
  module_code VARCHAR(20) NOT NULL REFERENCES module(module_code),
  rights_value INT NOT NULL DEFAULT 0,
  PRIMARY KEY (userid, module_code)
);

CREATE TABLE rights (
  right_code VARCHAR(20) NOT NULL PRIMARY KEY,
  right_name VARCHAR(50),
  right_value INT NOT NULL DEFAULT 1,
  module_code VARCHAR(20) NOT NULL REFERENCES module(module_code),
  record_status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
  stamp VARCHAR(100)
);

CREATE TABLE user_module_rights (
  userid VARCHAR(50) NOT NULL REFERENCES users(userid),
  module_code VARCHAR(20) NOT NULL REFERENCES module(module_code),
  right_code VARCHAR(20) NOT NULL REFERENCES rights(right_code),
  right_value INT NOT NULL DEFAULT 0,
  PRIMARY KEY (userid, module_code, right_code)
);
