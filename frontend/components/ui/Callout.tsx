// Vinkkilaatikko eli callout. Variantti valitsee värit, ja otsikko on
// valinnainen. Sisältö välitetään children-propsina.

import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type CalloutVariant = "info" | "tip" | "warning";

type CalloutProps = {
    variant?: CalloutVariant;
    title?: string;
    children: ReactNode;
};

const variantClasses: Record<CalloutVariant, string> = {
    info: "border-blue-200 bg-blue-50 text-blue-950 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100",
    tip: "border-green-200 bg-green-50 text-green-950 dark:border-green-900 dark:bg-green-950/40 dark:text-green-100",
    warning:
        "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
};

export function Callout({
    variant = "info",
    title,
    children,
}: CalloutProps) {
    return (
        <aside
            className={cn(
                "rounded-lg border p-4",
                variantClasses[variant],
            )}
        >
            {title ? <p className="font-semibold">{title}</p> : null}
            <div
                className={cn(
                    "text-sm leading-relaxed",
                    title ? "mt-1" : undefined,
                )}
            >
                {children}
            </div>
        </aside>
    );
}
