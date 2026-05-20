// src/services/authService.js
// FIX: Was importing from '../supabaseClient' which does not exist.
// Correct path is '../lib/supabase'.

import { supabase } from "../lib/supabase";

/**
 * Google OAuth sign-in.
 * Triggers Supabase Google login flow and redirects to /auth/callback.
 */
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Google login failed:", error.message);
    return { success: false, error };
  }

  return { success: true, data };
};

/**
 * Email + password sign-in with login guard.
 * After Supabase auth succeeds, checks record_status = 'ACTIVE' in the user table.
 */
export const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error };
  }

  // Login guard: check activation status
  const { data: userRow, error: userErr } = await supabase
    .from("user")
    .select("record_status")
    .eq("userid", data.user.id)
    .single();

  if (userErr || !userRow || userRow.record_status !== "ACTIVE") {
    await supabase.auth.signOut();
    return {
      success: false,
      error: {
        message:
          "Your account is pending activation by an HR administrator.",
      },
    };
  }

  return { success: true, data };
};

/**
 * Email + password registration.
 * Supabase trigger provision_new_user() handles inserting user row + rights.
 */
export const signUpWithEmail = async (
  firstName,
  lastName,
  username,
  email,
  password
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: `${firstName} ${lastName}`, username },
    },
  });

  if (error) {
    return { success: false, error };
  }

  return { success: true, data };
};

/**
 * Sign out current user.
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};