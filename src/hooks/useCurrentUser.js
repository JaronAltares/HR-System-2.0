// src/hooks/useCurrentUser.js
// M2 – Sprint 2
// Queries the current user's profile (user_type) from the database.
// Used for stamp column visibility and INACTIVE row filtering.
// M4: Confirm table name matches your provisioned schema (trigger-provision-user)

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useCurrentUser() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      // Get Supabase auth user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setProfile(null); return; }

      // Query user profile from provisioned users table
      // M4: Update table/column names if different from schema
      const { data, error } = await supabase
        .from("users")
        .select("user_type, username, firstname, lastname")
        .eq("id", user.id)
        .single();

      if (error || !data) { setProfile(null); return; }

      setProfile({
        id:        user.id,
        email:     user.email,
        user_type: data.user_type,   // "USER" | "ADMIN" | "SUPERADMIN"
        username:  data.username,
        firstname: data.firstname,
        lastname:  data.lastname,
      });
    }
    fetchProfile();
  }, []);

  return profile; // null while loading
}