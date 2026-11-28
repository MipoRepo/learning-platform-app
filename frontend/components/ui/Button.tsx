// Yleiskäyttöinen painike. Komponentti ei tarvitse "use client" -direktiiviä,
// koska se ei käytä hookeja. Tapahtumankäsittelijä välitetään propsina.

import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    children: ReactNode;
};

const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60";

const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-accent text-accent-foreground hover:opacity-90",
    secondary:
        "border border-border bg-transparent text-foreground hover:bg-surface",
    ghost: "text-foreground hover:bg-surface",
};

export function Button({
    variant = "primary",
    className,
    children,
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={cn(baseClasses, variantClasses[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
}
