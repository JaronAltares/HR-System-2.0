// src/services/jobHistoryService.js
// FIX: updateJobHistory() and softDeleteJobHistory() were using .eq('id', id)
// but jobHistory has NO `id` column. Its PK is composite: (empNo, jobCode, effDate).
// All mutations now use all three PK fields.

import { supabase } from "../lib/supabase";

const jobHistoryService = {
  // Get job history — optionally filtered by employee
  async getJobHistory(empNo = null, userType) {
    let query = supabase
      .from("jobHistory")
      .select(
        `*, job:jobCode (jobCode, jobDesc), department:deptCode (deptCode, deptName)`
      )
      .order("effDate", { ascending: false });

    if (empNo) {
      query = query.eq("empNo", empNo);
    }

    // USER sees ACTIVE records only
    if (userType === "USER") {
      query = query.eq("record_status", "ACTIVE");
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Add a new job history row
  async addJobHistory(jobHistoryData) {
    const { data, error } = await supabase
      .from("jobHistory")
      .insert([jobHistoryData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // FIX: Update using all 3 PK fields (empNo + jobCode + effDate), not a non-existent `id`
  async updateJobHistory(empNo, jobCode, effDate, updates) {
    const { data, error } = await supabase
      .from("jobHistory")
      .update(updates)
      .eq("empNo", empNo)
      .eq("jobCode", jobCode)
      .eq("effDate", effDate)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // FIX: Soft delete using composite PK — no hard deletes per project rules
  async softDeleteJobHistory(empNo, jobCode, effDate) {
    const { data, error } = await supabase
      .from("jobHistory")
      .update({
        record_status: "INACTIVE",
        stamp: `DELETED-${new Date().toISOString()}`,
      })
      .eq("empNo", empNo)
      .eq("jobCode", jobCode)
      .eq("effDate", effDate)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  // FIX: Recover using composite PK
  async recoverJobHistory(empNo, jobCode, effDate) {
    const { data, error } = await supabase
      .from("jobHistory")
      .update({
        record_status: "ACTIVE",
        stamp: `RECOVERED-${new Date().toISOString()}`,
      })
      .eq("empNo", empNo)
      .eq("jobCode", jobCode)
      .eq("effDate", effDate)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

export default jobHistoryService;