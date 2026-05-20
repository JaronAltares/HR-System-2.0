import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const UserRightsContext = createContext();
export const useRights = () => useContext(UserRightsContext);

export const UserRightsProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [rights, setRights] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserRights = async (user) => {
      if (!user) {
        setCurrentUser(null);
        setRights({});
        setLoading(false);
        return;
      }

      const { data: userData } = await supabase
        .from('user')
        .select('user_type, record_status')
        .eq('userid', user.id)
        .single();

      if (!userData || userData.record_status !== 'ACTIVE') {
        setCurrentUser(null);
        setRights({});
        setLoading(false);
        return;
      }

      const { data: rightsData } = await supabase
        .from('UserModule_Rights')
        .select('right_code, right_value')
        .eq('userid', user.id);

      const userRights = {};
      rightsData?.forEach(item => {
        userRights[item.right_code] = item.right_value === 1;
      });

      setCurrentUser({
        ...user,
        user_type: userData.user_type,
        rights: userRights
      });
      setRights(userRights);
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await getUserRights(session.user);
      } else {
        setCurrentUser(null);
        setRights({});
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) getUserRights(session.user);
      else setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const hasRight = (rightCode) => {
    return !!rights[rightCode];
  };

  const isAdmin = () => currentUser?.user_type === 'ADMIN' || currentUser?.user_type === 'SUPERADMIN';
  const isSuperAdmin = () => currentUser?.user_type === 'SUPERADMIN';

  return (
    <UserRightsContext.Provider value={{
      currentUser,
      rights,
      hasRight,
      isAdmin,
      isSuperAdmin,
      loading
    }}>
      {children}
    </UserRightsContext.Provider>
  );
};