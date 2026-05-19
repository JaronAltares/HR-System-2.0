// src/services/departmentService.js
// FIX: File had TypeScript type annotations (userType: string, dept: any, etc.)
// in a plain .js file. Vite does not transpile .js files through TypeScript,
// so this caused a runtime syntax crash. Annotations removed.

import { supabase } from "../lib/supabase";

export const departmentService = {
  // Get all departments — USER sees ACTIVE only; ADMIN/SUPERADMIN see all
  async getDepartments(userType) {
    let query = supabase.from("department").select("*");

    if (userType === "USER") {
      query = query.eq("record_status", "ACTIVE");
    }

    const { data, error } = await query.order("deptCode");
    return { data, error };
  },

  // Add new department
  async addDepartment(dept) {
    const { data, error } = await supabase
      .from("department")
      .insert(dept)
      .select()
      .single();
    return { data, error };
  },

  // Update department
  async updateDepartment(deptCode, updates) {
    const { data, error } = await supabase
      .from("department")
      .update(updates)
      .eq("deptCode", deptCode)
      .select()
      .single();
    return { data, error };
  },

  // Soft delete — sets record_status = 'INACTIVE' (no hard deletes per project rules)
  async softDeleteDepartment(deptCode, userId) {
    const stamp = `DELETED ${new Date().toISOString()} ${userId}`;
    const { data, error } = await supabase
      .from("department")
      .update({ record_status: "INACTIVE", stamp })
      .eq("deptCode", deptCode)
      .select()
      .single();
    return { data, error };
  },

  // Recover — sets record_status back to 'ACTIVE'
  async recoverDepartment(deptCode, userId) {
    const stamp = `RECOVERED ${new Date().toISOString()} ${userId}`;
    const { data, error } = await supabase
      .from("department")
      .update({ record_status: "ACTIVE", stamp })
      .eq("deptCode", deptCode)
      .select()
      .single();
    return { data, error };
  },
};