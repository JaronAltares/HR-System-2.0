// src/hooks/useRights.js
// M4 — feat/rights-hook-v2
// Improved: now uses UserRightsContext instead of making separate Supabase calls
// More efficient — rights are loaded once for the whole app

import { useRightsContext } from "../contexts/UserRightsContext";

export function useRights(rightName) {
  const context = useRightsContext();

  // 🔴 SAFETY PLUG: If context hasn't mounted yet, prevent destructuring crashes
  if (!context) {
    return Object.assign(false, { rights: {}, loading: true });
  }

  // Still loading
  if (context.loading) {
    return Object.assign(false, { rights: {}, loading: true });
  }

  // Not logged in
  if (!context.currentUser) {
    return Object.assign(false, { rights: {}, loading: false });
  }

  // If the developer called useRights() with no argument expecting the full context object
  if (!rightName) {
    return {
      rights: context.rights || {},
      loading: context.loading,
      currentUser: context.currentUser
    };
  }

  // SUPERADMIN has all rights
  if (context.currentUser.user_type === "SUPERADMIN") return true;

  // Check specific right
  return !!context.rights[rightName];
}