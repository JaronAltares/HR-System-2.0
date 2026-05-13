-- ============================================================
-- 001_hr_tables.sql
-- Creates the 4 HR tables based on HopeDB with record_status and stamp
-- ============================================================

CREATE TABLE department (
  deptCode      VARCHAR(3)  NOT NULL PRIMARY KEY,
<<<<<<< Updated upstream
  deptName      VARCHAR(100),
  record_status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
  stamp         VARCHAR(100)
=======
  deptName      VARCHAR(20),
  record_status VARCHAR(10) DEFAULT 'ACTIVE',
  stamp         VARCHAR(60)
>>>>>>> Stashed changes
);

CREATE TABLE job (
  jobCode       VARCHAR(4)  NOT NULL PRIMARY KEY,
<<<<<<< Updated upstream
  jobDesc       VARCHAR(100),
  record_status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
  stamp         VARCHAR(100)
=======
  jobDesc       VARCHAR(20),
  record_status VARCHAR(10) DEFAULT 'ACTIVE',
  stamp         VARCHAR(60)
>>>>>>> Stashed changes
);

CREATE TABLE employee (
  empno         VARCHAR(40)  NOT NULL PRIMARY KEY,
  lastname      VARCHAR(100),
  firstname     VARCHAR(100),
  gender        CHAR(1)     CONSTRAINT gender_ck CHECK (gender IN ('M','F')),
  birthdate     DATE,
  hiredate      DATE,
  sepDate       DATE,
<<<<<<< Updated upstream
  record_status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
  stamp         VARCHAR(100)
=======
  record_status VARCHAR(10) DEFAULT 'ACTIVE',
  stamp         VARCHAR(60)
>>>>>>> Stashed changes
);

CREATE TABLE jobHistory (
  empno         VARCHAR(40)  NOT NULL REFERENCES employee(empno),
  jobCode       VARCHAR(4)  NOT NULL REFERENCES job(jobCode),
  effDate       DATE        NOT NULL,
  salary        DECIMAL(10,2) CONSTRAINT salary_ck CHECK (salary >= 0.0),
  deptCode      VARCHAR(3)  REFERENCES department(deptCode),
<<<<<<< Updated upstream
  record_status VARCHAR(10) NOT NULL DEFAULT 'ACTIVE',
  stamp         VARCHAR(100),
  PRIMARY KEY (empno, jobCode, effDate)
=======
  record_status VARCHAR(10) DEFAULT 'ACTIVE',
  stamp         VARCHAR(60),
  PRIMARY KEY (empNo, jobCode, effDate)
>>>>>>> Stashed changes
);