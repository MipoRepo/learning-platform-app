"use client";

// Kielivalitsin vaihtaa käyttöliittymän kielen. Valinta tallentuu
// LanguageProviderin kautta localStorage-muistiin.

import { useLanguage } from "@/contexts/LanguageProvider";
import { cn } from "@/lib/cn";

export function LanguageToggle() {
    const { language, setLanguage, t } = useLanguage();

    const buttonClass = (isActive: boolean) =>
        cn(
            "rounded-md px-2 py-1 text-xs font-semibold transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted hover:bg-surface hover:text-foreground",
        );

    return (
        <div
            role="group"
            aria-label={t("language")}
            className="flex items-center rounded-lg border border-border p-0.5"
        >
            <button
                type="button"
                onClick={() => setLanguage("fi")}
                aria-pressed={language === "fi"}
                aria-label={t("switchToFinnish")}
                className={buttonClass(language === "fi")}
            >
                FI
            </button>
            <button
                type="button"
                onClick={() => setLanguage("en")}
                aria-pressed={language === "en"}
                aria-label={t("switchToEnglish")}
                className={buttonClass(language === "en")}
            >
                EN
            </button>
        </div>
    );
}
