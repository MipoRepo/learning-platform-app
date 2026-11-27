import type { Metadata } from "next";
import "./globals.css";

// Sivuston perusmetatiedot. Arvot näkyvät selaimen välilehdessä ja
// hakukoneiden esikatselussa.
export const metadata: Metadata = {
    title: "Oppimisalusta",
    description: "Modulaarinen oppimisalusta",
};

// Juurilayout ympäröi kaikki sovelluksen sivut. Tässä vaiheessa se
// määrittelee kielen, taustan ja perusfontin. Providerit lisätään
// seuraavassa vaiheessa (F1).
export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        // suppressHydrationWarning tarvitaan, koska teemanvaihto muuttaa
        // html-elementin class-attribuuttia ennen Reactin hydraatiota.
        <html lang="fi" suppressHydrationWarning>
            <body className="min-h-dvh bg-white text-slate-900 antialiased">
                {children}
            </body>
        </html>
    );
}
