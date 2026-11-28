"use client";

// Tyhjä tila näytetään, kun backend vastaa onnistuneesti mutta
// kursseja ei vielä ole. Tila kertoo seuraavan askeleen.

import { useLanguage } from "@/contexts/LanguageProvider";

export function EmptyState() {
    const { t } = useLanguage();

    return (
        <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
            <p aria-hidden="true" className="text-3xl">
                📭
            </p>
            <h2 className="mt-3 text-lg font-semibold text-foreground">
                {t("noCoursesTitle")}
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
                {t("noCoursesText")}
            </p>
        </div>
    );
}
