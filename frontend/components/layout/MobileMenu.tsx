"use client";

// Mobiilivalikko avautuu hampurilaispainikkeesta pienillä näytöillä.
// Valikko sulkeutuu linkin klikkauksesta tai Escape-näppäimestä.

import { useEffect, useState } from "react";
import Link from "next/link";

import { useLanguage } from "@/contexts/LanguageProvider";

export function MobileMenu() {
    const [open, setOpen] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        if (!open) {
            return;
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setOpen(false);
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    return (
        <div className="md:hidden">
            <button
                type="button"
                onClick={() => setOpen((previous) => !previous)}
                aria-expanded={open}
                aria-controls={open ? "mobile-menu" : undefined}
                aria-label={open ? t("closeMenu") : t("openMenu")}
                className="rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
                <span aria-hidden="true" className="text-lg">
                    {open ? "✕" : "☰"}
                </span>
            </button>

            {open ? (
                <div
                    id="mobile-menu"
                    className="absolute inset-x-0 top-16 border-b border-border bg-background p-4 shadow-lg"
                >
                    <nav aria-label={t("mainNavigation")}>
                        <Link
                            href="/"
                            onClick={() => setOpen(false)}
                            className="block rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        >
                            {t("courseLibrary")}
                        </Link>
                    </nav>
                </div>
            ) : null}
        </div>
    );
}
