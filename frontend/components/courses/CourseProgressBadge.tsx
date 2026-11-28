"use client";

// Kurssikortin edistymismerkki hakee edistymisen asiakaspuolella.
// Palvelinkomponentti ei voi tietää käyttäjäkohtaista tilaa, joten
// pieni erillinen komponentti hoitaa haun ja päivityksen.

import { useEffect, useState } from "react";

import { useLanguage } from "@/contexts/LanguageProvider";
import { getProgress } from "@/lib/api";
import type { CourseProgress } from "@/lib/types";
import { ProgressBar } from "@/components/ui/ProgressBar";

type CourseProgressBadgeProps = {
    courseId: string;
};

export function CourseProgressBadge({ courseId }: CourseProgressBadgeProps) {
    const { t } = useLanguage();
    const [progress, setProgress] = useState<CourseProgress | null>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        // cancelled-lippu estää tilan päivittämisen sen jälkeen, kun
        // komponentti on poistettu näytöltä.
        let cancelled = false;

        getProgress(courseId)
            .then((data) => {
                if (!cancelled) {
                    setProgress(data);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setFailed(true);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [courseId]);

    if (failed) {
        return (
            <p className="text-xs text-muted">{t("progressUnavailable")}</p>
        );
    }

    if (!progress) {
        return (
            <p className="text-xs text-muted" aria-live="polite">
                {t("progressLoading")}
            </p>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between gap-2 text-xs text-muted">
                <span>{t("progressLabel")}</span>
                <span>{progress.completion_percentage} %</span>
            </div>
            <div className="mt-1.5">
                <ProgressBar
                    percentage={progress.completion_percentage}
                    label={`${t("progressLabel")}: ${progress.completion_percentage} %`}
                />
            </div>
        </div>
    );
}
