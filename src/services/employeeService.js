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
          const { data: camelCaseData } = await supabase
            .from('jobHistory')
            .select(`empNo, effDate, job (jobDesc), department (deptName)`);
            
          if (camelCaseData && camelCaseData.length > 0) return camelCaseData;

          const { data: lowerCaseData } = await supabase
            .from('jobhistory')
            .select(`empNo, effDate, job (jobDesc), department (deptName)`);
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
        const matches = historyData.filter(h => String(h.empNo || h.empno) === String(emp.empno));
        const latestJob = matches.sort((a, b) => new Date(b.effDate) - new Date(a.effDate))[0];

        return {
          ...emp,
          jobDesc: latestJob?.job?.jobDesc || latestJob?.jobDesc || 'General Staff',
          deptName: latestJob?.department?.deptName || latestJob?.deptName || 'Operations',
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
      const { data, error } = await supabase
        .from('employee')
        .insert([employeeData])
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
      const { data, error } = await supabase
        .from('employee')
        .update(updates)
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
  }
};

export default employeeService;