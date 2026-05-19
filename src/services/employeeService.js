// src/services/employeeService.js
// M1 – Sprint 1 Placeholder
// UI ONLY — Structure placeholder for routing compliance. Full API wiring belongs to Sprint 2.

export const employeeService = {
  // Get all employees (Sprint 1 Placeholder stub)
  async getEmployees(userType) {
    console.log("Sprint 1 Stub: getEmployees triggered for userType:", userType);
    return { data: [], error: null };
  },

  // Add new employee (Sprint 1 Placeholder stub)
  async addEmployee(employee) {
    return { data: null, error: null };
  },

  // Update employee (Sprint 1 Placeholder stub)
  async updateEmployee(empno, updates) {
    return { data: null, error: null };
  },

  // Soft Delete Employee (Sprint 1 Placeholder stub)
  async softDeleteEmployee(empno, userId) {
    return { error: null };
  },

  // Recover Employee (Sprint 1 Placeholder stub)
  async recoverEmployee(empno, userId) {
    return { error: null };
  }
};