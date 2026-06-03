import { createContext, useContext, useState, useEffect } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';

export type Theme = 'Light' | 'Dark' | 'Auto';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'Light',
  setTheme: () => {},
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    return saved && ['Light', 'Dark', 'Auto'].includes(saved) ? saved : 'Light';
  });

  const setAndPersistTheme = (t: Theme) => {
    localStorage.setItem('theme', t);
    setTheme(t);
  };
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const isDark = theme === 'Dark' || (theme === 'Auto' && prefersDark);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setAndPersistTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
