// src/hooks/useRights.js
// M4 — feat/rights-hook-v2
// Improved: now uses UserRightsContext instead of making separate Supabase calls
// More efficient — rights are loaded once for the whole app

import { useRightsContext } from "../contexts/UserRightsContext";

export function useRights(rightName) {
  const context = useRightsContext();

  // Still loading
  if (!context || context.loading) return null;

  // Not logged in
  if (!context.currentUser) return false;

  // SUPERADMIN has all rights
  if (context.currentUser.user_type === "SUPERADMIN") return true;

  // Check specific right
  return !!context.rights[rightName];
}