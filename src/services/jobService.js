import { supabase } from '../lib/supabase';

const jobService = {

  // Get All Jobs
  async getJobs(userType) {
    let query = supabase
      .from('job')
      .select('*')
      .order('jobcode'); // Changed 'jobCode' to lowercase 'jobcode'

    if (userType === 'USER') {
      query = query.eq('record_status', 'ACTIVE');
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Add New Job
  async addJob(jobData) {
    const { data, error } = await supabase
      .from('job')
      .insert([jobData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Update Job
  async updateJob(jobcode, updates) {
    const { data, error } = await supabase
      .from('job')
      .update(updates)
      .eq('jobcode', jobcode) // Changed 'jobCode' to lowercase 'jobcode'
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Soft Delete Job
  async softDeleteJob(jobcode) {
    const { data, error } = await supabase
      .from('job')
      .update({ 
        record_status: 'INACTIVE',
        stamp: `DELETED-${new Date().toISOString()}`
      })
      .eq('jobcode', jobcode) // Changed 'jobCode' to lowercase 'jobcode'
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // Recover Job
  async recoverJob(jobcode) {
    const { data, error } = await supabase
      .from('job')
      .update({ 
        record_status: 'ACTIVE',
        stamp: `RECOVERED-${new Date().toISOString()}`
      })
      .eq('jobcode', jobcode) // Changed 'jobCode' to lowercase 'jobcode'
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export default jobService;