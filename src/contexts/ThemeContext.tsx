import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ThemeContext } from "@/contexts/theme-context";
import type { AppTheme } from "@/contexts/theme-context";

const STORAGE_KEY = "gambo.theme";

function applyTheme(theme: AppTheme) {
  document.documentElement.dataset["theme"] = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>("dark");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let savedTheme: AppTheme = "dark";
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "clean" || saved === "dark") savedTheme = saved;
    } catch (error) {
      console.error("Não foi possível carregar a preferência visual do GAMBO:", error);
    }

    applyTheme(savedTheme);
    setThemeState(savedTheme);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    applyTheme(theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      console.error("Não foi possível salvar a preferência visual do GAMBO:", error);
    }
  }, [loaded, theme]);

  const setTheme = useCallback((nextTheme: AppTheme) => {
    setThemeState(nextTheme);
  }, []);
  const value = useMemo(() => ({ theme, setTheme }), [setTheme, theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
