import { createContext, useContext, useState, useCallback, useEffect } from "react";

const StoreContext = createContext(null);

function getInitialTheme() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('employeex-theme');
    if (stored === 'dark' || stored === 'light') return stored;
  }
  return 'light';
}

export function StoreProvider({ children }) {
  const [view, setView] = useState("dashboard");
  const [detailId, setDetailId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filters, setFilters] = useState({});
  const [theme, setTheme] = useState(getInitialTheme);
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem('employeex-admin') === 'true');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('employeex-theme', theme);
  }, [theme]);

  useEffect(() => {
    sessionStorage.setItem('employeex-admin', isAdmin);
  }, [isAdmin]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

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
    theme, toggleTheme,
    isAdmin, setIsAdmin,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}
