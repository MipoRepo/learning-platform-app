import { Suspense } from "react";

import { CourseGrid } from "@/components/courses/CourseGrid";
import { CourseLibraryIntro } from "@/components/courses/CourseLibraryIntro";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { getCourses } from "@/lib/api";
import type { CourseManifest } from "@/lib/types";

// Kurssilista haetaan palvelinkomponentissa. Next.js 16:n Cache Components
// vaatii, että dynaaminen haku on Suspense-rajan sisällä. Silloin sivun
// staattinen runko näkyy heti ja kurssit striimataan perässä.
async function CourseLibrary() {
    let courses: CourseManifest[] | null = null;
    let failed = false;
    let errorMessage: string | undefined;

    // Vain datan haku on try/catch-lohkossa. Reactin lint-sääntö muistuttaa,
    // ettei JSX:n rakentamista pidä laittaa try/catchin sisään, koska
    // komponenttien renderöintivirheet eivät palaudu tähän lohkoon.
    try {
        courses = await getCourses();
    } catch (error) {
        failed = true;
        errorMessage = error instanceof Error ? error.message : undefined;
    }

    if (failed) {
        return <ErrorState details={errorMessage} />;
    }

    if (!courses || courses.length === 0) {
        return <EmptyState />;
    }

    return <CourseGrid courses={courses} />;
}

// Latauksen ajaksi näytetään kevyt ruudukko, joka ei sisällä tekstiä.
// Siksi se ei tarvitse kielikontekstia.
function CourseGridSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
            {[0, 1, 2].map((index) => (
                <div
                    key={index}
                    className="h-64 animate-pulse rounded-xl border border-border bg-surface"
                />
            ))}
        </div>
    );
}

export default function HomePage() {
    return (
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <CourseLibraryIntro />
            <div className="mt-10">
                <Suspense fallback={<CourseGridSkeleton />}>
                    <CourseLibrary />
                </Suspense>
            </div>
        </main>
    );
}
