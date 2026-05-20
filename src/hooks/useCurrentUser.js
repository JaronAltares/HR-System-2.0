// src/hooks/useCurrentUser.js
// Queries the current user's role and status from the user table in Supabase.
// NOTE: Previously hardcoded user_type: "SUPERADMIN" — that was a dev stub.
//       This version queries the real user row so rights enforcement works correctly.

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useCurrentUser() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setProfile(null);
          return;
        }

        const { data: userRow, error } = await supabase
          .from("user")
          .select("userId, email, username, user_type, record_status")
          .eq("userId", user.id)
          .single();

        if (error || !userRow) {
          console.warn("useCurrentUser: user row not found for", user.id);
          setProfile(null);
          return;
        }

        if (userRow.record_status !== "ACTIVE") {
          console.warn("useCurrentUser: account is INACTIVE, clearing profile");
          await supabase.auth.signOut();
          setProfile(null);
          return;
        }

        setProfile({
          id: user.id,
          email: userRow.email || user.email,
          username: userRow.username,
          user_type: userRow.user_type,
          record_status: userRow.record_status,
        });

      } catch (err) {
        console.error("useCurrentUser: unexpected error:", err);
        setProfile(null);
      }
    }

    fetchProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchProfile();
    });

    return () => subscription.unsubscribe();
  }, []);

  return profile;
}