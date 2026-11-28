"use client";

// Providers kokoaa sovelluksen React-kontekstit yhteen paikkaan.
// Juurilayout käärii koko sivuston tämän komponentin sisään.

import type { ReactNode } from "react";

import { LanguageProvider } from "@/contexts/LanguageProvider";
import { ThemeProvider } from "@/contexts/ThemeProvider";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
    );
}
