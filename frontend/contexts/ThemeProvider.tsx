"use client";

// ThemeProvider hallitsee vaalean ja tumman teeman tilaa.
// Teema luetaan localStorage-muistista tai järjestelmän asetuksesta
// useSyncExternalStore-hookilla, jolloin hydraatio pysyy turvallisena.

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
} from "react";
import type { ReactNode } from "react";

import {
    setStoredTheme,
    useStoredTheme,
} from "@/lib/preferences";
import type { Theme } from "@/lib/theme";

type ThemeContextValue = {
    theme: Theme;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const theme = useStoredTheme();

    // Pidetään html-elementin luokka ja color-scheme ajan tasalla.
    // Juurilayoutin inline-skripti on jo tehnyt saman ennen hydraatiota,
    // joten tämä ei aiheuta näkyvää välähdystä.
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        document.documentElement.style.colorScheme = theme;
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setStoredTheme(theme === "dark" ? "light" : "dark");
    }, [theme]);

    const value = useMemo(
        () => ({ theme, toggleTheme }),
        [theme, toggleTheme],
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme täytyy kutsua ThemeProviderin sisällä.");
    }

    return context;
}
