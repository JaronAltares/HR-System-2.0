// src/services/jobHistoryService.js
// FIX: Consistent return pattern wrapping { data, error } to match UI usage 
// structures and prevent unhandled promise crash rejections.

import { supabase } from "../lib/supabase";

const jobHistoryService = {
  // Get job history — optionally filtered by employee
  async getJobHistory(empNo = null, userType) {
    let query = supabase
      .from("jobhistory")
      .select(
        `*, job:jobcode (jobcode, jobdesc), department:deptcode (deptcode, deptname)`
      )
      .order("effdate", { ascending: false });

    if (empNo) {
      query = query.eq("empno", empNo);
    }

    // USER sees ACTIVE records only
    if (userType === "USER") {
      query = query.eq("record_status", "ACTIVE");
    }

    const { data, error } = await query;
    return { data, error }; 
  },

  // Add a new job history row
  async addJobHistory(jobHistoryData) {
    const { data, error } = await supabase
      .from("jobhistory")
      .insert([jobHistoryData])
      .select()
      .single();
    return { data, error };
  },

  // FIX: Update using all 3 PK fields lowercase (empno + jobcode + effdate)
  async updateJobHistory(empNo, jobCode, effDate, updates) {
    const { data, error } = await supabase
      .from("jobhistory")
      .update(updates)
      .eq("empno", empNo)
      .eq("jobcode", jobCode)
      .eq("effdate", effDate)
      .select()
      .single();
    return { data, error };
  },

  // FIX: Soft delete using composite PK — lowercase filters
  async softDeleteJobHistory(empNo, jobCode, effDate) {
    const { data, error } = await supabase
      .from("jobhistory")
      .update({
        record_status: "INACTIVE",
        stamp: `DELETED-${new Date().toISOString()}`,
      })
      .eq("empno", empNo)
      .eq("jobcode", jobCode)
      .eq("effdate", effDate)
      .select()
      .single();
    return { data, error };
  },

  // FIX: Recover using composite PK — lowercase filters
  async recoverJobHistory(empNo, jobCode, effDate) {
    const { data, error } = await supabase
      .from("jobhistory")
      .update({
        record_status: "ACTIVE",
        stamp: `RECOVERED-${new Date().toISOString()}`,
      })
      .eq("empno", empNo)
      .eq("jobcode", jobCode)
      .eq("effdate", effDate)
      .select()
      .single();
    return { data, error };
  },
};

export default jobHistoryService;