// Käyttöliittymän käännökset. Kurssin opetuskieli on eri asia:
// se kulkee URL-parametrina ?lang=fi|en ja tulee backendistä.

import type { Language } from "./types";

// Käyttöliittymän kielen tallennusavain selaimen localStorage-muistissa.
export const UI_LANGUAGE_STORAGE_KEY = "ui-language";

// Suomenkieliset tekstit toimivat samalla käännösavainten määritelmänä.
const fi = {
    appName: "Oppimisalusta",
    courseLibrary: "Kurssikirjasto",
    mainNavigation: "Päänavigaatio",
    openMenu: "Avaa valikko",
    closeMenu: "Sulje valikko",
    skipToContent: "Siirry sisältöön",
    language: "Kieli",
    switchToFinnish: "Vaihda suomeksi",
    switchToEnglish: "Vaihda englanniksi",
    toggleTheme: "Vaihda vaalea tai tumma teema",
    designSystemBadge: "Vaihe F1",
    designSystemTitle: "Design system ja perusrakenne",
    designSystemDescription:
        "Tämä sivu esittelee värit, painikkeet, edistymispalkin ja vinkkilaatikot. Yläpalkin kielivalitsin ja teemakytkin toimivat jo.",
    buttonsHeading: "Painikkeet",
    primaryAction: "Ensisijainen toiminto",
    secondaryAction: "Toissijainen toiminto",
    ghostAction: "Hiljainen toiminto",
    progressHeading: "Edistyminen",
    progressExample: "Esimerkki: 25 % kurssista suoritettu.",
    calloutsHeading: "Vinkkilaatikot",
    infoTitle: "Tietoa",
    infoText:
        "Tämä on neutraali tietolaatikko, jota käytetään täydentävään sisältöön.",
    tipTitle: "Vinkki",
    tipText:
        "Tämä on vinkkilaatikko, joka korostaa hyödyllistä oivallusta.",
    warningTitle: "Huomio",
    warningText:
        "Tämä on varoituslaatikko, joka kiinnittää huomion tärkeään asiaan.",
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
    mainNavigation: "Main navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    skipToContent: "Skip to content",
    language: "Language",
    switchToFinnish: "Switch to Finnish",
    switchToEnglish: "Switch to English",
    toggleTheme: "Switch between light and dark theme",
    designSystemBadge: "Phase F1",
    designSystemTitle: "Design system and base layout",
    designSystemDescription:
        "This page demonstrates the colors, buttons, progress bar, and callouts. The language selector and theme toggle in the header already work.",
    buttonsHeading: "Buttons",
    primaryAction: "Primary action",
    secondaryAction: "Secondary action",
    ghostAction: "Ghost action",
    progressHeading: "Progress",
    progressExample: "Example: 25% of the course completed.",
    calloutsHeading: "Callouts",
    infoTitle: "Information",
    infoText:
        "This is a neutral information box used for supplementary content.",
    tipTitle: "Tip",
    tipText: "This is a tip box that highlights a useful insight.",
    warningTitle: "Warning",
    warningText:
        "This is a warning box that draws attention to an important detail.",
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
