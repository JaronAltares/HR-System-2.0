import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/**
 * useRights — Custom hook to check if current user has a specific right.
 * Usage: const canAdd = useRights('EMP_ADD')
 * Returns: true | false | null (null = still loading)
 *
 * FIX: Was querying non-existent columns `is_enabled` and `rights_name`.
 * Correct columns per DB schema are `right_value` (INT) and `right_code` (VARCHAR).
 * Also fixed: joined through user table to get userId from auth UID.
 */
export function useRights(rightName) {
  const [hasRight, setHasRight] = useState(null);

  useEffect(() => {
    async function checkRight() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setHasRight(false);
        return;
      }

      // Look up the userId from our user table (auth.uid maps to userId)
      const { data: userRow, error: userErr } = await supabase
        .from("user")
        .select("userId, user_type, record_status")
        .eq("userId", user.id)
        .single();

      if (userErr || !userRow || userRow.record_status !== "ACTIVE") {
        setHasRight(false);
        return;
      }

      // SUPERADMIN always has every right
      if (userRow.user_type === "SUPERADMIN") {
        setHasRight(true);
        return;
      }

      // Check UserModule_Rights using correct column names: right_code + right_value
      const { data, error } = await supabase
        .from("UserModule_Rights")
        .select("right_value")
        .eq("userId", userRow.userId)
        .eq("right_code", rightName)
        .single();

      if (error || !data) {
        setHasRight(false);
        return;
      }

      setHasRight(data.right_value === 1);
    }

    checkRight();
  }, [rightName]);

  return hasRight;
}