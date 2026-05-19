import { supabase } from '../lib/supabase';

const employeeService = {

  // Get Employees (with rights filtering)
  async getEmployees(userType) {
    let query = supabase
      .from('employee')
      .select('*')
      .order('empno', { ascending: true });

    // USER can only see ACTIVE records
    if (userType === 'USER') {
      query = query.eq('record_status', 'ACTIVE');
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Add New Employee
  async addEmployee(employeeData) {
    const { data, error } = await supabase
      .from('employee')
      .insert([employeeData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Update Employee
  async updateEmployee(empno, updates) {
    const { data, error } = await supabase
      .from('employee')
      .update(updates)
      .eq('empno', empno)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Soft Delete Employee
  async softDeleteEmployee(empno) {
    const { data, error } = await supabase
      .from('employee')
      .update({ 
        record_status: 'INACTIVE',
        stamp: `DELETED-${new Date().toISOString()}`
      })
      .eq('empno', empno)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Recover Employee
  async recoverEmployee(empno) {
    const { data, error } = await supabase
      .from('employee')
      .update({ 
        record_status: 'ACTIVE',
        stamp: `RECOVERED-${new Date().toISOString()}`
      })
      .eq('empno', empno)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export default employeeService;