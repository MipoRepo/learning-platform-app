"use client";

// Siirtymälinkki näkyy vasta, kun käyttäjä painaa Tab-näppäintä.
// Se auttaa näppäimistökäyttäjää ohittamaan yläpalkin navigaation.

import { useLanguage } from "@/contexts/LanguageProvider";

export function SkipLink() {
    const { t } = useLanguage();

    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-accent-foreground"
        >
            {t("skipToContent")}
        </a>
    );
}
