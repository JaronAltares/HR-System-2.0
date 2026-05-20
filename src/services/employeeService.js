// src/services/employeeService.js
import { supabase } from '../lib/supabase';

const employeeService = {

  // Get Employees (With automated timeout guards to prevent loading hangs)
  async getEmployees(userType) {
    try {
      // 1. Fetch the primary employee table records (Verified open path)
      let query = supabase
        .from('employee')
        .select('*')
        .order('empno', { ascending: true });

      if (userType === 'USER') {
        query = query.eq('record_status', 'ACTIVE');
      }

      const { data: employeesData, error: empError } = await query;
      if (empError) return { data: null, error: empError };

      // 2. Fetch tracking rows with a strict 1.5-second fallback execution guard
      let historyData = [];
      
      try {
        const fetchRelationalData = async () => {
          // FIX: Swapped both table fields and relationship tables to strict lowercase
          const { data: lowerCaseData } = await supabase
            .from('jobhistory')
            .select(`empno, effdate, job (jobdesc), department (deptname)`);
          return lowerCaseData || [];
        };

        // If the backend takes more than 1500ms to resolve RLS layers, break out!
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 1500));
        
        historyData = await Promise.race([fetchRelationalData(), timeout]);
      } catch (timeoutOrPolicyError) {
        console.warn("⚠️ Relational lookups delayed or restricted. Using clean inline fallbacks.");
        historyData = [];
      }

      // 3. Map values cleanly into your UI table schema properties
      const finalizedData = (employeesData || []).map(emp => {
        // FIX: Matching filters on strict lowercase fields
        const matches = historyData.filter(h => String(h.empno) === String(emp.empno));
        
        // FIX: Matching sorting array references to lowercase effdate
        const latestJob = matches.sort((a, b) => new Date(b.effdate) - new Date(a.effdate))[0];

        return {
          ...emp,
          // Support both lowercase database fields natively
          employeeNo: emp.empno,
          firstName: emp.firstname,
          lastName: emp.lastname,
          birthDate: emp.birthdate,
          hireDate: emp.hiredate,
          sepDate: emp.sepdate,
          // FIX: Accessing lowercase relationship maps returned by Supabase
          jobDesc: latestJob?.job?.jobdesc || latestJob?.jobdesc || 'General Staff',
          deptName: latestJob?.department?.deptname || latestJob?.deptname || 'Operations',
          record_status: emp.record_status || 'ACTIVE'
        };
      });

      return { data: finalizedData, error: null };
    } catch (err) {
      console.error("🔴 Fatal Service Exception Caught:", err);
      return { data: null, error: err };
    }
  },

  // Add New Employee
  async addEmployee(employeeData) {
    try {
      const formattedData = {
        empno: employeeData.employeeNo,
        firstname: employeeData.firstName,
        lastname: employeeData.lastName,
        gender: employeeData.gender,
        birthdate: employeeData.birthDate,
        hiredate: employeeData.hireDate,
        sepdate: employeeData.sepDate || null,
        record_status: employeeData.record_status || 'ACTIVE',
        stamp: employeeData.stamp || null
      };

      const { data, error } = await supabase
        .from('employee')
        .insert([formattedData])
        .select()
        .single();
      
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  // Update Employee
  async updateEmployee(empno, updates) {
    try {
      const formattedUpdates = {};
      
      if ('employeeNo' in updates) formattedUpdates.empno = updates.employeeNo;
      if ('firstName' in updates) formattedUpdates.firstname = updates.firstName;
      if ('lastName' in updates) formattedUpdates.lastname = updates.lastName;
      if ('gender' in updates) formattedUpdates.gender = updates.gender;
      if ('birthDate' in updates) formattedUpdates.birthdate = updates.birthDate;
      if ('hireDate' in updates) formattedUpdates.hiredate = updates.hireDate;
      if ('sepDate' in updates) formattedUpdates.sepdate = updates.sepDate || null;
      if ('record_status' in updates) formattedUpdates.record_status = updates.record_status;
      if ('stamp' in updates) formattedUpdates.stamp = updates.stamp;

      const { data, error } = await supabase
        .from('employee')
        .update(formattedUpdates)
        .eq('empno', empno)
        .select()
        .single();
      
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  // Soft Delete Employee
  async softDeleteEmployee(empno) {
    try {
      const { data, error } = await supabase
        .from('employee')
        .update({ 
          record_status: 'INACTIVE',
          stamp: `DELETED-${new Date().toISOString()}`
        })
        .eq('empno', empno)
        .select()
        .single();
      
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  // ─── FIX: Added Missing Recovery Function ──────────────────────────────────
  async recoverEmployee(empno) {
    try {
      const { data, error } = await supabase
        .from('employee')
        .update({ 
          record_status: 'ACTIVE',
          stamp: null // Clears the deletion timestamp tracker cleanly upon return
        })
        .eq('empno', empno)
        .select()
        .single();
      
      return { data, error };
    } catch (err) {
      console.error("🔴 Service error during recovery execution:", err);
      return { data: null, error: err };
    }
  }
};

export default employeeService;