"use client";

// Kurssikortti on asiakaskomponentti, koska otsikko ja kuvaus valitaan
// käyttöliittymän kielikontekstin mukaan. Kortti on kokonaan linkki
// kurssin etusivulle, joten erillistä painiketta ei tarvita.

import Link from "next/link";

import { useLanguage } from "@/contexts/LanguageProvider";
import type { CourseManifest } from "@/lib/types";
import { CourseProgressBadge } from "./CourseProgressBadge";

type CourseCardProps = {
    course: CourseManifest;
};

export function CourseCard({ course }: CourseCardProps) {
    const { language, t } = useLanguage();

    // Kurssin metatiedoissa on otsikko ja kuvaus molemmilla kielillä.
    // Valittu käyttöliittymän kieli ratkaisee, kumpi näytetään.
    const title = course.titles[language];
    const description = course.descriptions[language];

    return (
        <article className="h-full">
            <Link
                href={`/courses/${course.course_id}`}
                aria-label={`${t("openCourse")}: ${title}`}
                className="group flex h-full flex-col rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                        <span className="sr-only">
                            {t("languagesLabel")}:
                        </span>
                        {course.available_languages.map((courseLanguage) => (
                            <span
                                key={courseLanguage}
                                className="rounded-md border border-border bg-background px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted"
                            >
                                {courseLanguage}
                            </span>
                        ))}
                    </div>
                    <span className="shrink-0 text-xs text-muted">
                        <span className="sr-only">
                            {t("estimatedDuration")}:{" "}
                        </span>
                        {course.estimated_hours} h
                    </span>
                </div>

                <h2 className="mt-4 text-xl font-semibold text-foreground transition-colors group-hover:text-accent">
                    {title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {description}
                </p>

                <div className="mt-5">
                    <CourseProgressBadge courseId={course.course_id} />
                </div>

                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                    {t("openCourse")}
                    <span aria-hidden="true">→</span>
                </span>
            </Link>
        </article>
    );
}
