"use client";

// Kurssikirjaston otsikko ja kuvaus tarvitsevat kielikontekstin.
// Siksi ne erotettiin omaksi pieneksi asiakaskomponentikseen, jotta
// itse sivun datahaku voi pysyä palvelinkomponentissa.

import { useLanguage } from "@/contexts/LanguageProvider";

export function CourseLibraryIntro() {
    const { t } = useLanguage();

    return (
        <header className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-wide text-accent">
                {t("appName")}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("courseLibrary")}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted">
                {t("courseLibraryDescription")}
            </p>
        </header>
    );
}
