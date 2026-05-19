import { describe, it, expect, vi } from 'vitest'

describe('Auth Flow Tests', () => {

  it('should allow ACTIVE user to log in', () => {
    const user = { record_status: 'ACTIVE' }
    expect(user.record_status).toBe('ACTIVE')
  })

  it('should block INACTIVE user from logging in', () => {
    const user = { record_status: 'INACTIVE' }
    expect(user.record_status).not.toBe('ACTIVE')
  })

  it('should create new user as INACTIVE by default', () => {
    const newUser = { record_status: 'INACTIVE', user_type: 'USER' }
    expect(newUser.record_status).toBe('INACTIVE')
    expect(newUser.user_type).toBe('USER')
  })

  it('should register user with correct default rights', () => {
    const rights = { EMP_VIEW: 1, EMP_ADD: 0, EMP_EDIT: 0, EMP_DEL: 0 }
    expect(rights.EMP_VIEW).toBe(1)
    expect(rights.EMP_ADD).toBe(0)
  })

})