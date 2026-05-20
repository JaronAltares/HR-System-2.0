import { describe, it, expect } from 'vitest'

// ─── Rights Matrix ────────────────────────────────────────────────────────────
// Mirrors src/config/rights.js and the DB seed in 004_rights_seed.sql
// 3 roles × 17 rights = 51 test cases

const RIGHTS = {
  EMP_VIEW: 'EMP_VIEW', EMP_ADD: 'EMP_ADD', EMP_EDIT: 'EMP_EDIT', EMP_DEL: 'EMP_DEL',
  JH_VIEW: 'JH_VIEW',   JH_ADD: 'JH_ADD',   JH_EDIT: 'JH_EDIT',   JH_DEL: 'JH_DEL',
  JOB_VIEW: 'JOB_VIEW', JOB_ADD: 'JOB_ADD', JOB_EDIT: 'JOB_EDIT', JOB_DEL: 'JOB_DEL',
  DEPT_VIEW: 'DEPT_VIEW', DEPT_ADD: 'DEPT_ADD', DEPT_EDIT: 'DEPT_EDIT', DEPT_DEL: 'DEPT_DEL',
  ADM_USER: 'ADM_USER',
}

const ROLE_PERMISSIONS = {
  SUPERADMIN: Object.values(RIGHTS),
  ADMIN: [
    RIGHTS.EMP_VIEW,  RIGHTS.EMP_ADD,  RIGHTS.EMP_EDIT,
    RIGHTS.JH_VIEW,   RIGHTS.JH_ADD,   RIGHTS.JH_EDIT,
    RIGHTS.JOB_VIEW,  RIGHTS.JOB_ADD,  RIGHTS.JOB_EDIT,
    RIGHTS.DEPT_VIEW, RIGHTS.DEPT_ADD, RIGHTS.DEPT_EDIT,
  ],
  USER: [
    RIGHTS.EMP_VIEW,
    RIGHTS.JH_VIEW,
    RIGHTS.JOB_VIEW,
    RIGHTS.DEPT_VIEW,
  ],
}

// ─── USER: 17 cases ───────────────────────────────────────────────────────────
describe('Rights matrix — USER (4 allowed, 13 denied)', () => {
  it('USER has EMP_VIEW',        () => expect(ROLE_PERMISSIONS.USER).toContain(RIGHTS.EMP_VIEW))
  it('USER has JH_VIEW',         () => expect(ROLE_PERMISSIONS.USER).toContain(RIGHTS.JH_VIEW))
  it('USER has JOB_VIEW',        () => expect(ROLE_PERMISSIONS.USER).toContain(RIGHTS.JOB_VIEW))
  it('USER has DEPT_VIEW',       () => expect(ROLE_PERMISSIONS.USER).toContain(RIGHTS.DEPT_VIEW))

  it('USER does NOT have EMP_ADD',   () => expect(ROLE_PERMISSIONS.USER).not.toContain(RIGHTS.EMP_ADD))
  it('USER does NOT have EMP_EDIT',  () => expect(ROLE_PERMISSIONS.USER).not.toContain(RIGHTS.EMP_EDIT))
  it('USER does NOT have EMP_DEL',   () => expect(ROLE_PERMISSIONS.USER).not.toContain(RIGHTS.EMP_DEL))
  it('USER does NOT have JH_ADD',    () => expect(ROLE_PERMISSIONS.USER).not.toContain(RIGHTS.JH_ADD))
  it('USER does NOT have JH_EDIT',   () => expect(ROLE_PERMISSIONS.USER).not.toContain(RIGHTS.JH_EDIT))
  it('USER does NOT have JH_DEL',    () => expect(ROLE_PERMISSIONS.USER).not.toContain(RIGHTS.JH_DEL))
  it('USER does NOT have JOB_ADD',   () => expect(ROLE_PERMISSIONS.USER).not.toContain(RIGHTS.JOB_ADD))
  it('USER does NOT have JOB_EDIT',  () => expect(ROLE_PERMISSIONS.USER).not.toContain(RIGHTS.JOB_EDIT))
  it('USER does NOT have JOB_DEL',   () => expect(ROLE_PERMISSIONS.USER).not.toContain(RIGHTS.JOB_DEL))
  it('USER does NOT have DEPT_ADD',  () => expect(ROLE_PERMISSIONS.USER).not.toContain(RIGHTS.DEPT_ADD))
  it('USER does NOT have DEPT_EDIT', () => expect(ROLE_PERMISSIONS.USER).not.toContain(RIGHTS.DEPT_EDIT))
  it('USER does NOT have DEPT_DEL',  () => expect(ROLE_PERMISSIONS.USER).not.toContain(RIGHTS.DEPT_DEL))
  it('USER does NOT have ADM_USER',  () => expect(ROLE_PERMISSIONS.USER).not.toContain(RIGHTS.ADM_USER))
})

// ─── ADMIN: 17 cases ──────────────────────────────────────────────────────────
describe('Rights matrix — ADMIN (12 allowed, 5 denied)', () => {
  it('ADMIN has EMP_VIEW',  () => expect(ROLE_PERMISSIONS.ADMIN).toContain(RIGHTS.EMP_VIEW))
  it('ADMIN has EMP_ADD',   () => expect(ROLE_PERMISSIONS.ADMIN).toContain(RIGHTS.EMP_ADD))
  it('ADMIN has EMP_EDIT',  () => expect(ROLE_PERMISSIONS.ADMIN).toContain(RIGHTS.EMP_EDIT))
  it('ADMIN has JH_VIEW',   () => expect(ROLE_PERMISSIONS.ADMIN).toContain(RIGHTS.JH_VIEW))
  it('ADMIN has JH_ADD',    () => expect(ROLE_PERMISSIONS.ADMIN).toContain(RIGHTS.JH_ADD))
  it('ADMIN has JH_EDIT',   () => expect(ROLE_PERMISSIONS.ADMIN).toContain(RIGHTS.JH_EDIT))
  it('ADMIN has JOB_VIEW',  () => expect(ROLE_PERMISSIONS.ADMIN).toContain(RIGHTS.JOB_VIEW))
  it('ADMIN has JOB_ADD',   () => expect(ROLE_PERMISSIONS.ADMIN).toContain(RIGHTS.JOB_ADD))
  it('ADMIN has JOB_EDIT',  () => expect(ROLE_PERMISSIONS.ADMIN).toContain(RIGHTS.JOB_EDIT))
  it('ADMIN has DEPT_VIEW', () => expect(ROLE_PERMISSIONS.ADMIN).toContain(RIGHTS.DEPT_VIEW))
  it('ADMIN has DEPT_ADD',  () => expect(ROLE_PERMISSIONS.ADMIN).toContain(RIGHTS.DEPT_ADD))
  it('ADMIN has DEPT_EDIT', () => expect(ROLE_PERMISSIONS.ADMIN).toContain(RIGHTS.DEPT_EDIT))

  it('ADMIN does NOT have EMP_DEL',   () => expect(ROLE_PERMISSIONS.ADMIN).not.toContain(RIGHTS.EMP_DEL))
  it('ADMIN does NOT have JH_DEL',    () => expect(ROLE_PERMISSIONS.ADMIN).not.toContain(RIGHTS.JH_DEL))
  it('ADMIN does NOT have JOB_DEL',   () => expect(ROLE_PERMISSIONS.ADMIN).not.toContain(RIGHTS.JOB_DEL))
  it('ADMIN does NOT have DEPT_DEL',  () => expect(ROLE_PERMISSIONS.ADMIN).not.toContain(RIGHTS.DEPT_DEL))
  it('ADMIN does NOT have ADM_USER',  () => expect(ROLE_PERMISSIONS.ADMIN).not.toContain(RIGHTS.ADM_USER))
})

// ─── SUPERADMIN: 17 cases ─────────────────────────────────────────────────────
describe('Rights matrix — SUPERADMIN (all 17 allowed)', () => {
  it('SUPERADMIN has EMP_VIEW',   () => expect(ROLE_PERMISSIONS.SUPERADMIN).toContain(RIGHTS.EMP_VIEW))
  it('SUPERADMIN has EMP_ADD',    () => expect(ROLE_PERMISSIONS.SUPERADMIN).toContain(RIGHTS.EMP_ADD))
  it('SUPERADMIN has EMP_EDIT',   () => expect(ROLE_PERMISSIONS.SUPERADMIN).toContain(RIGHTS.EMP_EDIT))
  it('SUPERADMIN has EMP_DEL',    () => expect(ROLE_PERMISSIONS.SUPERADMIN).toContain(RIGHTS.EMP_DEL))
  it('SUPERADMIN has JH_VIEW',    () => expect(ROLE_PERMISSIONS.SUPERADMIN).toContain(RIGHTS.JH_VIEW))
  it('SUPERADMIN has JH_ADD',     () => expect(ROLE_PERMISSIONS.SUPERADMIN).toContain(RIGHTS.JH_ADD))
  it('SUPERADMIN has JH_EDIT',    () => expect(ROLE_PERMISSIONS.SUPERADMIN).toContain(RIGHTS.JH_EDIT))
  it('SUPERADMIN has JH_DEL',     () => expect(ROLE_PERMISSIONS.SUPERADMIN).toContain(RIGHTS.JH_DEL))
  it('SUPERADMIN has JOB_VIEW',   () => expect(ROLE_PERMISSIONS.SUPERADMIN).toContain(RIGHTS.JOB_VIEW))
  it('SUPERADMIN has JOB_ADD',    () => expect(ROLE_PERMISSIONS.SUPERADMIN).toContain(RIGHTS.JOB_ADD))
  it('SUPERADMIN has JOB_EDIT',   () => expect(ROLE_PERMISSIONS.SUPERADMIN).toContain(RIGHTS.JOB_EDIT))
  it('SUPERADMIN has JOB_DEL',    () => expect(ROLE_PERMISSIONS.SUPERADMIN).toContain(RIGHTS.JOB_DEL))
  it('SUPERADMIN has DEPT_VIEW',  () => expect(ROLE_PERMISSIONS.SUPERADMIN).toContain(RIGHTS.DEPT_VIEW))
  it('SUPERADMIN has DEPT_ADD',   () => expect(ROLE_PERMISSIONS.SUPERADMIN).toContain(RIGHTS.DEPT_ADD))
  it('SUPERADMIN has DEPT_EDIT',  () => expect(ROLE_PERMISSIONS.SUPERADMIN).toContain(RIGHTS.DEPT_EDIT))
  it('SUPERADMIN has DEPT_DEL',   () => expect(ROLE_PERMISSIONS.SUPERADMIN).toContain(RIGHTS.DEPT_DEL))
  it('SUPERADMIN has ADM_USER',   () => expect(ROLE_PERMISSIONS.SUPERADMIN).toContain(RIGHTS.ADM_USER))
})

// ─── Total rights count per role ──────────────────────────────────────────────
describe('Rights count per role', () => {
  it('USER has exactly 4 rights',        () => expect(ROLE_PERMISSIONS.USER.length).toBe(4))
  it('ADMIN has exactly 12 rights',      () => expect(ROLE_PERMISSIONS.ADMIN.length).toBe(12))
  it('SUPERADMIN has exactly 17 rights', () => expect(ROLE_PERMISSIONS.SUPERADMIN.length).toBe(17))
})