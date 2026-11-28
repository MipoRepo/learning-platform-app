"use client";

// Teemakytkin vaihtaa vaalean ja tumman teeman välillä.
// Kuvakkeet vaihtuvat CSS:n dark-variantilla, joten ensimmäinen
// renderöinti ei riipu Reactin teematilasta.

import { useLanguage } from "@/contexts/LanguageProvider";
import { useTheme } from "@/contexts/ThemeProvider";

export function ThemeToggle() {
    const { toggleTheme } = useTheme();
    const { t } = useLanguage();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={t("toggleTheme")}
            title={t("toggleTheme")}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
            <span aria-hidden="true" className="dark:hidden">
                🌙
            </span>
            <span aria-hidden="true" className="hidden dark:inline">
                ☀️
            </span>
        </button>
    );
}
