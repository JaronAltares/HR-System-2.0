import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/**
 * useRights — Custom hook to check if current user has a specific right
 * Usage: const canAdd = useRights('EMP_ADD')
 * Returns: true | false | null (null = still loading)
 */
export function useRights(rightName) {
  const [hasRight, setHasRight] = useState(null);

  useEffect(() => {
    async function checkRight() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setHasRight(false);
        return;
      }

      const { data, error } = await supabase
        .from("UserModule_Rights")
        .select("is_enabled")
        .eq("user_id", user.id)
        .eq("rights_name", rightName)
        .single();

      if (error || !data) {
        setHasRight(false);
        return;
      }

      setHasRight(data.is_enabled === 1);
    }

    checkRight();
  }, [rightName]);

  return hasRight;
}