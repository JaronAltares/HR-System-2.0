import { supabase } from '../lib/supabase';

export const jobService = {
  // Get all jobs
  async getJobs(userType: string) {
    let query = supabase
      .from('job')
      .select('*');

    if (userType === 'USER') {
      query = query.eq('record_status', 'ACTIVE');
    }

    const { data, error } = await query.order('jobCode');
    return { data, error };
  },

  // Add new job
  async addJob(job: any) {
    const { data, error } = await supabase
      .from('job')
      .insert(job)
      .select();
    return { data, error };
  },

  // Update job
  async updateJob(jobCode: string, updates: any) {
    const { data, error } = await supabase
      .from('job')
      .update(updates)
      .eq('jobCode', jobCode)
      .select();
    return { data, error };
  },

  // Soft Delete
  async softDeleteJob(jobCode: string, userId: string) {
    const stamp = `CASCADE-DEL ${new Date().toISOString()} ${userId}`;
    const { data, error } = await supabase
      .from('job')
      .update({ record_status: 'INACTIVE', stamp })
      .eq('jobCode', jobCode);
    return { data, error };
  },

  // Recover
  async recoverJob(jobCode: string, userId: string) {
    const stamp = `CASCADE-RECOVER ${new Date().toISOString()} ${userId}`;
    const { data, error } = await supabase
      .from('job')
      .update({ record_status: 'ACTIVE', stamp })
      .eq('jobCode', jobCode);
    return { data, error };
  }
};
