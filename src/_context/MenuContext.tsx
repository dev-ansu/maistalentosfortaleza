import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getAPIClient } from "@/_services/apiClient";
import { useAuthContext } from "./AuthContext";

const MenuContext = createContext<any>(null);

export function MenuProvider({ children }: { children: ReactNode}) {
  const { user } = useAuthContext();
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    if (!user) {
      setMenuItems([]);
      return;
    }

    if (menuItems.length > 0) return; // 🔥 Já carregado → NÃO busca de novo

    getAPIClient()
      .get("/sidebar")
      .then((r) => setMenuItems(r.data.data))
      .catch(() => setMenuItems([]));
  }, [user]);

  return (
    <MenuContext.Provider value={{ menuItems }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenuContext() {
  return useContext(MenuContext);
}