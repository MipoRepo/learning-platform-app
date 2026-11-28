"use client";

// Virhetila näytetään, kun backend ei vastaa tai palauttaa virheen.
// Käyttäjä saa selkeän ohjeen ja painikkeen, joka yrittää hakua uudelleen.
// onRetry on valinnainen: error.tsx välittää Next.js:n retry-funktion,
// kun taas palvelinkomponentin catch-haara käyttää router.refresh-kutsua.

import { useRouter } from "next/navigation";

import { useLanguage } from "@/contexts/LanguageProvider";
import { Button } from "./Button";

type ErrorStateProps = {
    details?: string;
    onRetry?: () => void;
};

export function ErrorState({ details, onRetry }: ErrorStateProps) {
    const { t } = useLanguage();
    const router = useRouter();

    function handleRetry() {
        if (onRetry) {
            onRetry();
            return;
        }

        // router.refresh hakee palvelinkomponentit uudelleen.
        router.refresh();
    }

    return (
        <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-950 dark:border-red-900 dark:bg-red-950/40 dark:text-red-100"
        >
            <h2 className="text-lg font-semibold">{t("errorTitle")}</h2>
            <p className="mt-2 text-sm leading-relaxed">{t("errorText")}</p>
            {details ? (
                <p className="mt-2 text-xs opacity-80">{details}</p>
            ) : null}
            <Button variant="secondary" className="mt-4" onClick={handleRetry}>
                {t("errorRetry")}
            </Button>
        </div>
    );
}
