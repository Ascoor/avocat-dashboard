import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  SidebarProvider as SidebarUiProvider,
  useSidebar as useUiSidebar,
} from '@/components/ui/sidebar';

interface SidebarContextType {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapsed: () => void;
  toggleMobile: () => void;
  closeMobile: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const SIDEBAR_STORAGE_KEY = 'sidebar-collapsed';

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;

    const stored = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return stored ? JSON.parse(stored) : false;
  });

  const handleOpenChange = useCallback((open: boolean) => {
    setIsCollapsed(!open);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(isCollapsed));
    }
  }, [isCollapsed]);

  return (
    <SidebarUiProvider open={!isCollapsed} onOpenChange={handleOpenChange}>
      <SidebarContextBridge isCollapsed={isCollapsed}>{children}</SidebarContextBridge>
    </SidebarUiProvider>
  );
};

const SidebarContextBridge: React.FC<{
  isCollapsed: boolean;
  children: React.ReactNode;
}> = ({ isCollapsed, children }) => {
  const { toggleSidebar, openMobile, setOpenMobile } = useUiSidebar();

  const toggleCollapsed = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  // ✅ لا نستخدم callback، نعطي boolean مباشرة
  const toggleMobile = useCallback(() => {
    setOpenMobile(!openMobile);
  }, [openMobile, setOpenMobile]);

  const closeMobile = useCallback(() => {
    setOpenMobile(false);
  }, [setOpenMobile]);

  const value = useMemo(
    () => ({
      isCollapsed,
      isMobileOpen: openMobile,
      toggleCollapsed,
      toggleMobile,
      closeMobile,
    }),
    [isCollapsed, openMobile, toggleCollapsed, toggleMobile, closeMobile],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
