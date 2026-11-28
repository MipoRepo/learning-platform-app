import type { Metadata } from "next";

import { AppHeader } from "@/components/layout/AppHeader";
import { SkipLink } from "@/components/layout/SkipLink";
import { themeInitScript } from "@/lib/theme";
import { Providers } from "./providers";
import "./globals.css";

// Sivuston perusmetatiedot. Arvot näkyvät selaimen välilehdessä ja
// hakukoneiden esikatselussa.
export const metadata: Metadata = {
    title: "Oppimisalusta",
    description: "Modulaarinen oppimisalusta",
};

// Juurilayout ympäröi kaikki sovelluksen sivut. Se määrittelee kielen,
// teeman alustuksen, yläpalkin ja React-kontekstit.
export default function RootLayout({ children }: LayoutProps<"/">) {
    return (
        // suppressHydrationWarning tarvitaan, koska teeman alustusskripti
        // muuttaa html-elementin class-attribuuttia ennen hydraatiota.
        <html lang="fi" suppressHydrationWarning>
            <head>
                {/* Skripti ajetaan ennen näkyvää sisältöä, jotta väärän
                    teeman välähdys (FOUC) estetään. */}
                <script
                    dangerouslySetInnerHTML={{ __html: themeInitScript }}
                />
            </head>
            <body className="min-h-dvh bg-background text-foreground antialiased">
                <Providers>
                    <SkipLink />
                    <AppHeader />
                    <div id="main-content">{children}</div>
                </Providers>
            </body>
        </html>
    );
}
