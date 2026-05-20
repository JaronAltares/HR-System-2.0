// src/config/rights.js
// FIX: Was using EMP_DELETE, JOB_DELETE, DEPT_DELETE — these don't match
// the DB seed which uses EMP_DEL, JOB_DEL, DEPT_DEL.
// All right codes now exactly match the 17 rows in the rights table seed.

export const RIGHTS = {
  // Employee Module
  EMP_VIEW:  "EMP_VIEW",
  EMP_ADD:   "EMP_ADD",
  EMP_EDIT:  "EMP_EDIT",
  EMP_DEL:   "EMP_DEL",   // was EMP_DELETE — fixed

  // Job History Module
  JH_VIEW:   "JH_VIEW",
  JH_ADD:    "JH_ADD",
  JH_EDIT:   "JH_EDIT",
  JH_DEL:    "JH_DEL",

  // Job Module
  JOB_VIEW:  "JOB_VIEW",
  JOB_ADD:   "JOB_ADD",
  JOB_EDIT:  "JOB_EDIT",
  JOB_DEL:   "JOB_DEL",   // was JOB_DELETE — fixed

  // Department Module
  DEPT_VIEW: "DEPT_VIEW",
  DEPT_ADD:  "DEPT_ADD",
  DEPT_EDIT: "DEPT_EDIT",
  DEPT_DEL:  "DEPT_DEL",  // was DEPT_DELETE — fixed

  // Admin Module
  ADM_USER:  "ADM_USER",
};

// Role-based permission defaults (mirrors the dev guide rights matrix)
export const ROLE_PERMISSIONS = {
  SUPERADMIN: Object.values(RIGHTS), // all 17 rights

  ADMIN: [
    RIGHTS.EMP_VIEW,  RIGHTS.EMP_ADD,  RIGHTS.EMP_EDIT,
    RIGHTS.JH_VIEW,   RIGHTS.JH_ADD,   RIGHTS.JH_EDIT,
    RIGHTS.JOB_VIEW,  RIGHTS.JOB_ADD,  RIGHTS.JOB_EDIT,
    RIGHTS.DEPT_VIEW, RIGHTS.DEPT_ADD, RIGHTS.DEPT_EDIT,
    // ADM_USER is NOT in ADMIN per the dev guide rights matrix
    // DEL rights are NOT in ADMIN — SUPERADMIN only
  ],

  USER: [
    RIGHTS.EMP_VIEW,
    RIGHTS.JH_VIEW,
    RIGHTS.JOB_VIEW,
    RIGHTS.DEPT_VIEW,
  ],
};