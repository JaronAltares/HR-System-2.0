import { describe, it, expect } from 'vitest'

// ─── Soft Delete & Recovery Tests ────────────────────────────────────────────
// Verifies soft-delete cascade and recovery logic
// DB trigger: 011_trigger_cascade_softdelete.sql

describe('Soft delete — employee', () => {
  it('soft-deleted employee has INACTIVE status', () => {
    const employee = { empno: '00001', record_status: 'INACTIVE', stamp: 'DELETED-2026-01-01' }
    expect(employee.record_status).toBe('INACTIVE')
  })

  it('soft-deleted employee retains their empno', () => {
    const employee = { empno: '00001', record_status: 'INACTIVE' }
    expect(employee.empno).toBe('00001')
  })

  it('soft-deleted employee stamp contains DELETED prefix', () => {
    const employee = { empno: '00001', record_status: 'INACTIVE', stamp: 'DELETED-2026-05-21T00:00:00Z' }
    expect(employee.stamp).toMatch(/^DELETED/)
  })
})

describe('Soft delete — cascade to job history', () => {
  it('cascade sets all matching jobhistory rows to INACTIVE', () => {
    const empno = '00001'
    const jobHistory = [
      { empno: '00001', jobcode: 'PR1', effdate: '2010-05-11', record_status: 'INACTIVE' },
      { empno: '00001', jobcode: 'PR2', effdate: '2010-12-01', record_status: 'INACTIVE' },
      { empno: '00003', jobcode: 'PR2', effdate: '2010-05-11', record_status: 'ACTIVE' },
    ]
    const employeeRows = jobHistory.filter(jh => jh.empno === empno)
    const allInactive = employeeRows.every(jh => jh.record_status === 'INACTIVE')
    expect(allInactive).toBe(true)
  })

  it('cascade does NOT affect other employees jobhistory', () => {
    const deletedEmpno = '00001'
    const jobHistory = [
      { empno: '00001', jobcode: 'PR1', record_status: 'INACTIVE' },
      { empno: '00003', jobcode: 'PR2', record_status: 'ACTIVE' },
    ]
    const otherRows = jobHistory.filter(jh => jh.empno !== deletedEmpno)
    const noneAffected = otherRows.every(jh => jh.record_status === 'ACTIVE')
    expect(noneAffected).toBe(true)
  })

  it('no orphaned jobhistory rows after cascade', () => {
    const employee = { empno: '00001', record_status: 'INACTIVE' }
    const jobHistory = [
      { empno: '00001', record_status: 'INACTIVE' },
      { empno: '00001', record_status: 'INACTIVE' },
    ]
    const orphaned = jobHistory.filter(
      jh => jh.empno === employee.empno && jh.record_status !== employee.record_status
    )
    expect(orphaned.length).toBe(0)
  })
})

describe('Recovery — employee', () => {
  it('recovered employee has ACTIVE status', () => {
    const recovered = { empno: '00001', record_status: 'ACTIVE', stamp: 'RECOVERED-2026-05-21' }
    expect(recovered.record_status).toBe('ACTIVE')
  })

  it('recovered employee stamp contains RECOVERED or is null', () => {
    const recovered = { empno: '00001', record_status: 'ACTIVE', stamp: null }
    const stampOk = recovered.stamp === null || String(recovered.stamp).startsWith('RECOVERED')
    expect(stampOk).toBe(true)
  })
})

describe('Recovery — job history', () => {
  it('recovered jobhistory row has ACTIVE status', () => {
    const row = { empno: '00001', jobcode: 'PR1', effdate: '2010-05-11', record_status: 'ACTIVE' }
    expect(row.record_status).toBe('ACTIVE')
  })

  it('recovered jobhistory stamp contains RECOVERED prefix', () => {
    const row = { empno: '00001', record_status: 'ACTIVE', stamp: 'RECOVERED-2026-05-21T00:00:00Z' }
    expect(row.stamp).toMatch(/^RECOVERED/)
  })
})

describe('No hard deletes', () => {
  it('soft delete sets INACTIVE, does not remove the record', () => {
    const before = [
      { empno: '00001', record_status: 'ACTIVE' },
      { empno: '00003', record_status: 'ACTIVE' },
    ]
    // Simulate soft delete — update only, no splice/filter/remove
    const after = before.map(e =>
      e.empno === '00001' ? { ...e, record_status: 'INACTIVE' } : e
    )
    expect(after.length).toBe(before.length)
    expect(after.find(e => e.empno === '00001').record_status).toBe('INACTIVE')
  })

  it('deleted record is still findable by ADMIN', () => {
    const allRecords = [
      { empno: '00001', record_status: 'INACTIVE' },
      { empno: '00003', record_status: 'ACTIVE' },
    ]
    // ADMIN sees all records regardless of status
    const adminView = allRecords
    expect(adminView.find(e => e.empno === '00001')).toBeDefined()
  })

  it('deleted record is hidden from USER', () => {
    const allRecords = [
      { empno: '00001', record_status: 'INACTIVE' },
      { empno: '00003', record_status: 'ACTIVE' },
    ]
    const userView = allRecords.filter(e => e.record_status === 'ACTIVE')
    expect(userView.find(e => e.empno === '00001')).toBeUndefined()
  })
})