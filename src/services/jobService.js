import { supabase } from '../lib/supabase';

const departmentService = {

  // Get All Departments
  async getDepartments(userType) {
    let query = supabase
      .from('department')
      .select('*')
      .order('deptCode');

    if (userType === 'USER') {
      query = query.eq('record_status', 'ACTIVE');
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Add New Department
  async addDepartment(deptData) {
    const { data, error } = await supabase
      .from('department')
      .insert([deptData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Update Department
  async updateDepartment(deptCode, updates) {
    const { data, error } = await supabase
      .from('department')
      .update(updates)
      .eq('deptCode', deptCode)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Soft Delete Department
  async softDeleteDepartment(deptCode) {
    const { data, error } = await supabase
      .from('department')
      .update({ 
        record_status: 'INACTIVE',
        stamp: `DELETED-${new Date().toISOString()}`
      })
      .eq('deptCode', deptCode)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Recover Department
  async recoverDepartment(deptCode) {
    const { data, error } = await supabase
      .from('department')
      .update({ 
        record_status: 'ACTIVE',
        stamp: `RECOVERED-${new Date().toISOString()}`
      })
      .eq('deptCode', deptCode)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export default departmentService;