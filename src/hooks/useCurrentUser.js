// src/hooks/useCurrentUser.js
// FIX: Was hardcoding user_type = "SUPERADMIN" for all users, breaking the
// entire rights/visibility system. Now fetches the real profile from the
// `user` table using the correct PK column `userId`.

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useCurrentUser() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setProfile(null);
          return;
        }

        // Fetch real user row — PK is `userId`, not `id`
        const { data: userRow, error } = await supabase
          .from("user")
          .select("userid, email, username, user_type, record_status")
          .eq("userid", user.id)
          .single();

        if (error || !userRow) {
          console.error("useCurrentUser: could not load user row", error);
          setProfile(null);
          return;
        }

        // Use Google metadata for display name if username not set
        const googleMeta = user.user_metadata || {};
        const displayName =
          userRow.username ||
          googleMeta.full_name ||
          googleMeta.name ||
          userRow.email;

        setProfile({
          id: userRow.userid,
          email: userRow.email || user.email,
          user_type: userRow.user_type,   // real value from DB: USER | ADMIN | SUPERADMIN
          record_status: userRow.record_status,
          username: userRow.username,
          name: displayName,
        });
      } catch (err) {
        console.error("useCurrentUser error:", err);
        setProfile(null);
      }
    }

    fetchProfile();

    // Re-run on auth state changes (login / logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });

    return () => subscription.unsubscribe();
  }, []);

  return profile;
}