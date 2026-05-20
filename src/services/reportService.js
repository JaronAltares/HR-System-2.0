import { supabase } from '../lib/supabase';

const reportService = {

  // Headcount by Department
  async getHeadcountByDepartment() {
    const { data, error } = await supabase
      .from('headcount_by_dept')
      .select('*')
      .order('activeHeadcount', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Salary Summary by Job
  async getSalarySummaryByJob() {
    const { data, error } = await supabase
      .from('salary_summary_by_job')
      .select('*')
      .order('avgSalary', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Employee Full History (detailed)
  async getEmployeeFullHistory(empno) {
    const { data, error } = await supabase
      .from('employee_full_history')
      .select('*')
      .eq('empno', empno)
      .order('effDate', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Optional: All active employees with current job
  async getEmployeesWithCurrentJob() {
    const { data, error } = await supabase
      .from('employee_current_job')
      .select('*')
      .order('empno');

    if (error) throw error;
    return data || [];
  }
};

export default reportService;