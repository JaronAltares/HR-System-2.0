import { supabase } from '../lib/supabase';

export const jobHistoryService = {
  // Get job history for an employee
  async getJobHistory(empno: string, userType: string) {
    let query = supabase
      .from('jobHistory')
      .select(`
        *,
        job:jobCode (
          jobCode,
          jobDesc
        ),
        department:deptCode (
          deptCode,
          deptName
        )
      `)
      .eq('empno', empno)
      .order('effDate', { ascending: false });

    if (userType === 'USER') {
      query = query.eq('record_status', 'ACTIVE');
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Add new job history record
  async addJobHistory(record: any) {
    const { data, error } = await supabase
      .from('jobHistory')
      .insert(record)
      .select();
    return { data, error };
  },

  // Update job history
  async updateJobHistory(empno: string, jobCode: string, effDate: string, updates: any) {
    const { data, error } = await supabase
      .from('jobHistory')
      .update(updates)
      .eq('empno', empno)
      .eq('jobCode', jobCode)
      .eq('effDate', effDate)
      .select();
    return { data, error };
  },

  // Soft Delete
  async softDeleteJobHistory(empno: string, jobCode: string, effDate: string, userId: string) {
    const stamp = `CASCADE-DEL ${new Date().toISOString()} ${userId}`;
    const { data, error } = await supabase
      .from('jobHistory')
      .update({ 
        record_status: 'INACTIVE', 
        stamp 
      })
      .eq('empno', empno)
      .eq('jobCode', jobCode)
      .eq('effDate', effDate);
    return { data, error };
  },

  // Recover
  async recoverJobHistory(empno: string, jobCode: string, effDate: string, userId: string) {
    const stamp = `CASCADE-RECOVER ${new Date().toISOString()} ${userId}`;
    const { data, error } = await supabase
      .from('jobHistory')
      .update({ 
        record_status: 'ACTIVE', 
        stamp 
      })
      .eq('empno', empno)
      .eq('jobCode', jobCode)
      .eq('effDate', effDate);
    return { data, error };
  }
};
