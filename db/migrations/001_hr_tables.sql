-- ============================================================
-- 001_hr_tables.sql
-- Creates the 4 HR tables with record_status and stamp columns
-- ============================================================

CREATE TABLE department (
  deptCode      VARCHAR(3)  NOT NULL PRIMARY KEY,
  deptName      VARCHAR(20),
  record_status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
  stamp         VARCHAR(100)
);

CREATE TABLE job (
  jobCode       VARCHAR(4)  NOT NULL PRIMARY KEY,
  jobDesc       VARCHAR(20),
  record_status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
  stamp         VARCHAR(100)
);

CREATE TABLE employee (
  empno         VARCHAR(5)  NOT NULL PRIMARY KEY,
  lastname      VARCHAR(15),
  firstname     VARCHAR(15),
  gender        CHAR(1)     CONSTRAINT gender_ck CHECK (gender IN ('M','F')),
  birthdate     DATE,
  hiredate      DATE,
  sepDate       DATE,
  record_status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
  stamp         VARCHAR(100)
);

CREATE TABLE jobHistory (
  empNo         VARCHAR(5)  NOT NULL REFERENCES employee(empno),
  jobCode       VARCHAR(4)  NOT NULL REFERENCES job(jobCode),
  effDate       DATE        NOT NULL,
  salary        DECIMAL(10,2) CONSTRAINT salary_ck CHECK (salary >= 0.0),
  deptCode      VARCHAR(3)  REFERENCES department(deptCode),
  record_status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
  stamp         VARCHAR(100),
  PRIMARY KEY (empNo, jobCode, effDate)
);