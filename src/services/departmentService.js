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

    const { data, error } = await query.order("deptcode");
    if (error) throw error;

    // Map database snake_case/lowercase fields back to the camelCase properties the UI uses
    return (data ?? []).map(row => ({
      deptCode: row.deptcode,
      deptDesc: row.deptdesc,
      record_status: row.record_status,
      stamp: row.stamp
    }));
  },

  // Add new department
  async addDepartment(dept) {
    // Translate incoming frontend camelCase payload into what the DB column schema requires
    const dbPayload = {
      deptcode: dept.deptCode,
      deptdesc: dept.deptDesc,
      record_status: dept.record_status,
      stamp: dept.stamp
    };

    const { data, error } = await supabase
      .from("department")
      .insert(dbPayload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update department
  async updateDepartment(deptCode, updates) {
    const dbPayload = {};
    if (updates.deptDesc !== undefined) dbPayload.deptdesc = updates.deptDesc;
    if (updates.stamp !== undefined) dbPayload.stamp = updates.stamp;

    const { data, error } = await supabase
      .from("department")
      .update(dbPayload)
      .eq("deptcode", deptCode)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Soft delete — sets record_status = 'INACTIVE' (no hard deletes per project rules)
  async softDeleteDepartment(deptCode, userId = "SYSTEM") {
    const stamp = `DELETED ${new Date().toISOString()} ${userId}`;
    const { data, error } = await supabase
      .from("department")
      .update({ record_status: "INACTIVE", stamp })
      .eq("deptcode", deptCode)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Recover — sets record_status back to 'ACTIVE'
  async recoverDepartment(deptCode, userId = "SYSTEM") {
    const stamp = `RECOVERED ${new Date().toISOString()} ${userId}`;
    const { data, error } = await supabase
      .from("department")
      .update({ record_status: "ACTIVE", stamp })
      .eq("deptcode", deptCode)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// CRITICAL FIX: Export as default as well so `import deptService from "../services/deptService"` 
// in Departments.jsx works perfectly without breaking your Vite build
export default departmentService;