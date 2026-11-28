// Käyttöliittymän käännökset. Kurssin opetuskieli on eri asia:
// se kulkee URL-parametrina ?lang=fi|en ja tulee backendistä.

import type { Language } from "./types";

// Käyttöliittymän kielen tallennusavain selaimen localStorage-muistissa.
export const UI_LANGUAGE_STORAGE_KEY = "ui-language";

// Suomenkieliset tekstit toimivat samalla käännösavainten määritelmänä.
const fi = {
    appName: "Oppimisalusta",
    courseLibrary: "Kurssikirjasto",
    courseLibraryDescription:
        "Selaa kursseja ja jatka siitä, mihin jäit. Kurssit avautuvat omille sivuilleen.",
    mainNavigation: "Päänavigaatio",
    openMenu: "Avaa valikko",
    closeMenu: "Sulje valikko",
    skipToContent: "Siirry sisältöön",
    language: "Kieli",
    switchToFinnish: "Vaihda suomeksi",
    switchToEnglish: "Vaihda englanniksi",
    toggleTheme: "Vaihda vaalea tai tumma teema",
    noCoursesTitle: "Ei kursseja vielä",
    noCoursesText:
        "Kurssisisältöä ei löytynyt. Lisää kursseja backendin content-modules-kansioon.",
    errorTitle: "Kurssien lataus epäonnistui",
    errorText:
        "Tarkista, että backend on käynnissä osoitteessa http://localhost:8000 ja yritä uudelleen.",
    errorRetry: "Yritä uudelleen",
    progressLabel: "Edistyminen",
    progressLoading: "Ladataan edistymistä...",
    progressUnavailable: "Edistyminen ei saatavilla",
    languagesLabel: "Kielet",
    estimatedDuration: "Arvioitu kesto",
    openCourse: "Avaa kurssi",
    markCompleted: "Merkitse suoritetuksi",
    markIncomplete: "Poista suoritusmerkintä",
    continueLearning: "Jatka opiskelua",
    loading: "Ladataan...",
} as const;

// Englanninkieliset tekstit. Tyyppi varmistaa, että jokainen suomenkielinen
// avain löytyy myös englanniksi.
export type TranslationKey = keyof typeof fi;

const en: Record<TranslationKey, string> = {
    appName: "Learning Platform",
    courseLibrary: "Course Library",
    courseLibraryDescription:
        "Browse courses and pick up where you left off. Each course opens on its own page.",
    mainNavigation: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skipToContent: "Skip to content",
    language: "Language",
    switchToFinnish: "Switch to Finnish",
    switchToEnglish: "Switch to English",
    toggleTheme: "Switch between light and dark theme",
    noCoursesTitle: "No courses yet",
    noCoursesText:
        "No course content was found. Add courses to the backend's content-modules directory.",
    errorTitle: "Failed to load courses",
    errorText:
        "Check that the backend is running at http://localhost:8000 and try again.",
    errorRetry: "Try again",
    progressLabel: "Progress",
    progressLoading: "Loading progress...",
    progressUnavailable: "Progress unavailable",
    languagesLabel: "Languages",
    estimatedDuration: "Estimated duration",
    openCourse: "Open course",
    markCompleted: "Mark as completed",
    markIncomplete: "Remove completion",
    continueLearning: "Continue learning",
    loading: "Loading...",
};

export const translations = { fi, en };

// Palauttaa yksittäisen käännöksen valitulla kielellä.
export function translate(language: Language, key: TranslationKey): string {
    return translations[language][key];
}
