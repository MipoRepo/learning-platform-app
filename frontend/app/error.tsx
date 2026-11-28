"use client";

// Juuren virheraja. Next.js 16 välittää error- ja retry-propit.
// retry yrittää renderöidä virheellisen alipuun uudelleen.
// Yksittäiset virheet käsitellään yleensä jo lähempänä komponenttia,
// joten tämä toimii viimeisenä turvaverkkona.

import { useEffect } from "react";

import { ErrorState } from "@/components/ui/ErrorState";

export default function ErrorBoundary({
    error,
    retry,
}: {
    error: unknown;
    retry: () => void;
}) {
    useEffect(() => {
        // Virhe kirjataan selaimen konsoliin kehityksen helpottamiseksi.
        console.error(error);
    }, [error]);

    return (
        <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
            <ErrorState
                details={error instanceof Error ? error.message : undefined}
                onRetry={retry}
            />
        </main>
    );
}
