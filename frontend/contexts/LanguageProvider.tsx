"use client";

// LanguageProvider jakaa käyttöliittymän kielen koko sovellukselle.
// Kurssin opetuskieli ei kuulu tähän kontekstiin, koska se kulkee URL:ssa.

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
} from "react";
import type { ReactNode } from "react";

import type { Language } from "@/lib/types";
import {
    setStoredLanguage,
    useStoredLanguage,
} from "@/lib/preferences";
import { translate } from "@/lib/i18n";
import type { TranslationKey } from "@/lib/i18n";

type LanguageContextValue = {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
    // Kieli luetaan localStorage-muistista useSyncExternalStore-hookilla.
    // Palvelimella ja hydraation aikana käytetään suomea.
    const language = useStoredLanguage();

    // Pidetään html-elementin lang-attribuutti ajan tasalla. Tämä efekti
    // päivittää vain ulkoista DOMia, ei Reactin tilaa.
    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const setLanguage = useCallback((nextLanguage: Language) => {
        setStoredLanguage(nextLanguage);
    }, []);

    const t = useCallback(
        (key: TranslationKey) => translate(language, key),
        [language],
    );

    const value = useMemo(
        () => ({ language, setLanguage, t }),
        [language, setLanguage, t],
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage(): LanguageContextValue {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            "useLanguage täytyy kutsua LanguageProviderin sisällä.",
        );
    }

    return context;
}
