import { createContext, useContext, useState, useCallback } from "react";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [view, setView] = useState("dashboard");
  const [detailId, setDetailId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filters, setFilters] = useState({});

  const navigate = useCallback((newView, id = null) => {
    setView(newView);
    setDetailId(id);
  }, []);

  const value = {
    view, setView,
    detailId, setDetailId,
    sidebarOpen, setSidebarOpen,
    filters, setFilters,
    navigate,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
