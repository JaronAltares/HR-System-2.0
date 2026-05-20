import { supabase } from '../lib/supabase';

const adminService = {

  // Get All Users (for Admin Module)
  async getUsers(userType = 'ADMIN') {
    // Only SUPERADMIN or ADMIN can view users
    if (!['ADMIN', 'SUPERADMIN'].includes(userType)) {
      throw new Error("Unauthorized: Admin access required");
    }

    const { data, error } = await supabase
      .from('user')
      .select('*')
      .order('user_type', { ascending: false })
      .order('username');

    if (error) throw error;
    return data || [];
  },

  // Activate User (SUPERADMIN only in real RLS, but we check here too)
  async activateUser(userId, currentUserType) {
    if (currentUserType !== 'SUPERADMIN') {
      throw new Error("Only SUPERADMIN can activate users");
    }

    const { data, error } = await supabase
      .from('user')
      .update({ 
        record_status: 'ACTIVE',
        stamp: `ACTIVATED-${new Date().toISOString()}`
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Deactivate User
  async deactivateUser(userId, currentUserType) {
    if (currentUserType !== 'SUPERADMIN') {
      throw new Error("Only SUPERADMIN can deactivate users");
    }

    const { data, error } = await supabase
      .from('user')
      .update({ 
        record_status: 'INACTIVE',
        stamp: `DEACTIVATED-${new Date().toISOString()}`
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export default adminService;