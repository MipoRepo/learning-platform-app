"use client";

// Yläpalkki sisältää sovelluksen nimen, päänavigaation, kielivalitsimen,
// teemakytkimen ja mobiilivalikon. Komponentti on asiakaskomponentti,
// koska se käyttää kielikontekstia.

import Link from "next/link";

import { useLanguage } from "@/contexts/LanguageProvider";
import { LanguageToggle } from "./LanguageToggle";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";

export function AppHeader() {
    const { t } = useLanguage();

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
            <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    aria-label={t("appName")}
                    className="flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                    <span aria-hidden="true" className="text-xl">
                        📚
                    </span>
                    <span className="truncate text-sm font-semibold text-foreground sm:text-base">
                        {t("appName")}
                    </span>
                </Link>

                <nav
                    aria-label={t("mainNavigation")}
                    className="hidden md:block"
                >
                    <Link
                        href="/"
                        className="rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        {t("courseLibrary")}
                    </Link>
                </nav>

                <div className="flex items-center gap-1">
                    <LanguageToggle />
                    <ThemeToggle />
                    <MobileMenu />
                </div>
            </div>
        </header>
    );
}
