// hooks/useMenu.ts
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/_context/AuthContext';
import { getAPIClient } from '@/_services/apiClient';

export function useMenu() {
  const { user } = useAuthContext();
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    if (!user) {
      setMenuItems([]);
      return;
    }

    getAPIClient().get('/sidebar')
      .then((response: any) => setMenuItems(response.data.data))
      .catch(() => setMenuItems([]));
  }, [user]);

  return menuItems;
}