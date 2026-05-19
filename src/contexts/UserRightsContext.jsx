// src/contexts/UserRightsContext.jsx
// FIXES:
// 1. Was querying .eq('id', user.id) — PK is `userId`, not `id`
// 2. Was storing rights as userRights[item.right_value] = true, which maps
//    the integer "1" as the key instead of the right code (e.g. "EMP_VIEW").
//    Fixed to select right_code and use that as the map key.

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const UserRightsContext = createContext();

export const useRightsContext = () => useContext(UserRightsContext);

export const UserRightsProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [rights, setRights] = useState({});
  const [loading, setLoading] = useState(true);

  async function loadUserRights(authUser) {
    if (!authUser) {
      setCurrentUser(null);
      setRights({});
      setLoading(false);
      return;
    }

    // FIX: query by userId (PK), not by id
    const { data: userData, error: userErr } = await supabase
      .from("user")
      .select("userId, user_type, record_status, username, email")
      .eq("userId", authUser.id)
      .single();

    if (userErr || !userData || userData.record_status !== "ACTIVE") {
      setCurrentUser(null);
      setRights({});
      setLoading(false);
      return;
    }

    // FIX: select right_code so we can key the map by right name, not by integer value
    const { data: rightsData, error: rightsErr } = await supabase
      .from("UserModule_Rights")
      .select("right_code, right_value")
      .eq("userId", userData.userId);

    if (rightsErr) {
      console.error("UserRightsContext: failed to load rights", rightsErr);
    }

    const userRights = {};

    if (userData.user_type === "SUPERADMIN") {
      // SUPERADMIN has all rights — populate map to true for every known right
      const ALL_RIGHTS = [
        "EMP_VIEW","EMP_ADD","EMP_EDIT","EMP_DEL",
        "JH_VIEW","JH_ADD","JH_EDIT","JH_DEL",
        "JOB_VIEW","JOB_ADD","JOB_EDIT","JOB_DEL",
        "DEPT_VIEW","DEPT_ADD","DEPT_EDIT","DEPT_DEL",
        "ADM_USER",
      ];
      ALL_RIGHTS.forEach((r) => (userRights[r] = true));
    } else {
      // Map right_code → boolean using right_value (1 = granted)
      (rightsData || []).forEach((item) => {
        userRights[item.right_code] = item.right_value === 1;
      });
    }

    const googleMeta = authUser.user_metadata || {};
    setCurrentUser({
      id: userData.userId,
      email: userData.email || authUser.email,
      username: userData.username,
      name: userData.username || googleMeta.full_name || authUser.email,
      user_type: userData.user_type,
      record_status: userData.record_status,
    });
    setRights(userRights);
    setLoading(false);
  }

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadUserRights(session.user);
      } else {
        setLoading(false);
      }
    });

    // Live auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        await loadUserRights(session.user);
      } else {
        setCurrentUser(null);
        setRights({});
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const hasRight = (rightCode) => !!rights[rightCode];
  const isAdmin = () =>
    currentUser?.user_type === "ADMIN" ||
    currentUser?.user_type === "SUPERADMIN";
  const isSuperAdmin = () => currentUser?.user_type === "SUPERADMIN";

  return (
    <UserRightsContext.Provider
      value={{ currentUser, rights, hasRight, isAdmin, isSuperAdmin, loading }}
    >
      {children}
    </UserRightsContext.Provider>
  );
};