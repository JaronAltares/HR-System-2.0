import { supabase } from '../lib/supabase';

const jobHistoryService = {

  // Get Job History (by Employee or all)
  async getJobHistory(empNo = null, userType) {
    let query = supabase
      .from('jobHistory')
      .select(`
        *,
        job:jobCode (jobCode, jobDesc),
        department:deptCode (deptCode, deptName)
      `)
      .order('effDate', { ascending: false });

    // Filter by specific employee if provided
    if (empNo) {
      query = query.eq('empNo', empNo);
    }

    // USER can only see ACTIVE records
    if (userType === 'USER') {
      query = query.eq('record_status', 'ACTIVE');
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Add Job History (New Job Assignment / Promotion)
  async addJobHistory(jobHistoryData) {
    const { data, error } = await supabase
      .from('jobHistory')
      .insert([jobHistoryData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Update Job History
  async updateJobHistory(id, updates) {
    const { data, error } = await supabase
      .from('jobHistory')
      .update(updates)
      .eq('id', id)           // assuming you have an 'id' column, or use composite key
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Soft Delete Job History
  async softDeleteJobHistory(id) {
    const { data, error } = await supabase
      .from('jobHistory')
      .update({ 
        record_status: 'INACTIVE',
        stamp: `DELETED-${new Date().toISOString()}`
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Recover Job History
  async recoverJobHistory(id) {
    const { data, error } = await supabase
      .from('jobHistory')
      .update({ 
        record_status: 'ACTIVE',
        stamp: `RECOVERED-${new Date().toISOString()}`
      })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export default jobHistoryService;