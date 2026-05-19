import { supabase } from '../lib/supabase';

export const departmentService = {
  // Get all departments
  async getDepartments(userType: string) {
    let query = supabase
      .from('department')
      .select('*');

    if (userType === 'USER') {
      query = query.eq('record_status', 'ACTIVE');
    }

    const { data, error } = await query.order('deptCode');
    return { data, error };
  },

  // Add new department
  async addDepartment(dept: any) {
    const { data, error } = await supabase
      .from('department')
      .insert(dept)
      .select();
    return { data, error };
  },

  // Update department
  async updateDepartment(deptCode: string, updates: any) {
    const { data, error } = await supabase
      .from('department')
      .update(updates)
      .eq('deptCode', deptCode)
      .select();
    return { data, error };
  },

  // Soft Delete
  async softDeleteDepartment(deptCode: string, userId: string) {
    const stamp = `CASCADE-DEL ${new Date().toISOString()} ${userId}`;
    const { data, error } = await supabase
      .from('department')
      .update({ record_status: 'INACTIVE', stamp })
      .eq('deptCode', deptCode);
    return { data, error };
  },

  // Recover
  async recoverDepartment(deptCode: string, userId: string) {
    const stamp = `CASCADE-RECOVER ${new Date().toISOString()} ${userId}`;
    const { data, error } = await supabase
      .from('department')
      .update({ record_status: 'ACTIVE', stamp })
      .eq('deptCode', deptCode);
    return { data, error };
  }
};
