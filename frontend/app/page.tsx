"use client";

// F1:n väliaikainen etusivu esittelee design systemin komponentit.
// Varsinainen kurssikirjasto rakennetaan vaiheessa F2.

import { useLanguage } from "@/contexts/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { Callout } from "@/components/ui/Callout";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function HomePage() {
    const { t } = useLanguage();

    return (
        <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-sm font-medium uppercase tracking-wide text-accent">
                {t("designSystemBadge")}
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t("designSystemTitle")}
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted">
                {t("designSystemDescription")}
            </p>

            <section
                aria-labelledby="buttons-heading"
                className="mt-10 space-y-4"
            >
                <h2
                    id="buttons-heading"
                    className="text-xl font-semibold text-foreground"
                >
                    {t("buttonsHeading")}
                </h2>
                <div className="flex flex-wrap gap-3">
                    <Button>{t("primaryAction")}</Button>
                    <Button variant="secondary">
                        {t("secondaryAction")}
                    </Button>
                    <Button variant="ghost">{t("ghostAction")}</Button>
                </div>
            </section>

            <section
                aria-labelledby="progress-heading"
                className="mt-10 space-y-4"
            >
                <h2
                    id="progress-heading"
                    className="text-xl font-semibold text-foreground"
                >
                    {t("progressHeading")}
                </h2>
                <ProgressBar
                    percentage={25}
                    label={t("progressHeading")}
                />
                <p className="text-sm text-muted">
                    {t("progressExample")}
                </p>
            </section>

            <section
                aria-labelledby="callouts-heading"
                className="mt-10 space-y-4"
            >
                <h2
                    id="callouts-heading"
                    className="text-xl font-semibold text-foreground"
                >
                    {t("calloutsHeading")}
                </h2>
                <Callout variant="info" title={t("infoTitle")}>
                    {t("infoText")}
                </Callout>
                <Callout variant="tip" title={t("tipTitle")}>
                    {t("tipText")}
                </Callout>
                <Callout variant="warning" title={t("warningTitle")}>
                    {t("warningText")}
                </Callout>
            </section>
        </main>
    );
}
