// Teeman tallennusavain ja alustusskripti ovat yhdessä paikassa, jotta
// ThemeProvider ja juurilayout käyttävät varmasti samoja arvoja.

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

// Tämä skripti suoritetaan ennen näkyvää sisältöä. Se lisää dark-luokan
// html-elementtiin, jos käyttäjä on valinnut tumman teeman tai jos
// käyttöjärjestelmä pyytää tummaa teemaa. Näin vältetään väärän teeman
// välähdys (FOUC).
export const themeInitScript = `
(function () {
    try {
        var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
        var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        var theme = stored === "dark" || stored === "light"
            ? stored
            : (prefersDark ? "dark" : "light");

        document.documentElement.classList.toggle("dark", theme === "dark");
        document.documentElement.style.colorScheme = theme;
    } catch (error) {
        // Jos localStorage ei ole käytettävissä, käytetään vaaleaa teemaa.
    }
})();
`;
