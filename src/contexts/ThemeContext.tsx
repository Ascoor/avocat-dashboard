import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  manual: boolean;
}

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  syncWithSystem: () => void;
}

const STORAGE_KEY = 'avocat_theme';
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getPreferredTheme = (): ThemeState => {
  if (typeof window === 'undefined') {
    return { theme: 'light', manual: false };
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return { theme: stored, manual: true };
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return { theme: prefersDark ? 'dark' : 'light', manual: false };
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ThemeState>(() => getPreferredTheme());

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(state.theme);
    root.style.colorScheme = state.theme;

    if (state.manual) {
      window.localStorage.setItem(STORAGE_KEY, state.theme);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [state]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      setState((prev) => {
        if (prev.manual) {
          return prev;
        }
        return { theme: event.matches ? 'dark' : 'light', manual: false };
      });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    setState({ theme, manual: true });
  }, []);

  const toggleTheme = useCallback(() => {
    setState((prev) => ({ theme: prev.theme === 'dark' ? 'light' : 'dark', manual: true }));
  }, []);

  const syncWithSystem = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setState({ theme: prefersDark ? 'dark' : 'light', manual: false });
  }, []);

  const value = useMemo(
    () => ({
      theme: state.theme,
      resolvedTheme: state.theme,
      isDark: state.theme === 'dark',
      setTheme,
      toggleTheme,
      syncWithSystem,
    }),
    [state.theme, setTheme, toggleTheme, syncWithSystem],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
