import { supabase } from '../lib/supabase';

export const employeeService = {
  // Get all employees (with filter for USER)
  async getEmployees(userType: string) {
    let query = supabase
      .from('employee')
      .select('*');

    // Normal users can only see ACTIVE employees
    if (userType === 'USER') {
      query = query.eq('record_status', 'ACTIVE');
    }

    const { data, error } = await query.order('empno');
    return { data, error };
  },

  // Add new employee
  async addEmployee(employee: any) {
    const { data, error } = await supabase
      .from('employee')
      .insert(employee)
      .select();
    return { data, error };
  },

  // Update employee
  async updateEmployee(empno: string, updates: any) {
    const { data, error } = await supabase
      .from('employee')
      .update(updates)
      .eq('empno', empno)
      .select();
    return { data, error };
  },

  // Soft Delete Employee
  async softDeleteEmployee(empno: string, userId: string) {
    const stamp = `CASCADE-DEL ${new Date().toISOString()} ${userId}`;
    const { data, error } = await supabase
      .from('employee')
      .update({ 
        record_status: 'INACTIVE', 
        stamp 
      })
      .eq('empno', empno);
    return { data, error };
  },

  // Recover Employee
  async recoverEmployee(empno: string, userId: string) {
    const stamp = `CASCADE-RECOVER ${new Date().toISOString()} ${userId}`;
    const { data, error } = await supabase
      .from('employee')
      .update({ 
        record_status: 'ACTIVE', 
        stamp 
      })
      .eq('empno', empno);
    return { data, error };
  }
};