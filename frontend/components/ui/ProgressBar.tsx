// Edistymispalkki näyttää prosenttiosuuden ja välittää saman tiedon
// ruudunlukijalle role="progressbar" -attribuutin avulla.

type ProgressBarProps = {
    percentage: number;
    label?: string;
};

export function ProgressBar({ percentage, label }: ProgressBarProps) {
    // Varmistetaan, että arvo pysyy sallitulla välillä 0–100.
    const safePercentage = Math.min(100, Math.max(0, percentage));

    return (
        <div
            className="h-2 w-full overflow-hidden rounded-full bg-border"
            role="progressbar"
            aria-label={label}
            aria-valuenow={safePercentage}
            aria-valuemin={0}
            aria-valuemax={100}
        >
            <div
                className="h-full rounded-full bg-accent transition-[width] duration-300"
                style={{ width: `${safePercentage}%` }}
            />
        </div>
    );
}
