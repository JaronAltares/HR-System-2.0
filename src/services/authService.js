import { supabase } from '../supabaseClient';

/**
 * PR-03 Logic: Google OAuth Provider
 * This function triggers the Supabase Google login flow.
 */
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // This URL must be added to your Supabase Redirect Allow List
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Login failed:", error.message);
    return { success: false, error };
  }
  return { success: true, data };
};