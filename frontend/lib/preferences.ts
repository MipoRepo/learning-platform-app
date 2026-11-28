// Selaimen tallennettujen asetusten lukeminen Reactin ulkoisena tilana.
// useSyncExternalStore on Reactin suosittelema tapa lukea selaimen tietoja
// ilman hydraatiovirhettä: palvelimella käytetään serverSnapshot-arvoa ja
// selaimessa todellista localStorage-arvoa.

import { useSyncExternalStore } from "react";

import type { Language } from "./types";
import { UI_LANGUAGE_STORAGE_KEY } from "./i18n";
import { THEME_STORAGE_KEY } from "./theme";
import type { Theme } from "./theme";

// Saman välilehden muutokset eivät laukaise storage-tapahtumaa, joten
// lähetämme oman tapahtuman, kun asetus muuttuu.
const LANGUAGE_CHANGE_EVENT = "ui-language-change";
const THEME_CHANGE_EVENT = "theme-change";

// --- KÄYTTÖLIITTYMÄN KIELI ---

function subscribeToLanguage(callback: () => void): () => void {
    window.addEventListener("storage", callback);
    window.addEventListener(LANGUAGE_CHANGE_EVENT, callback);

    return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener(LANGUAGE_CHANGE_EVENT, callback);
    };
}

function getLanguageSnapshot(): Language {
    const stored = window.localStorage.getItem(UI_LANGUAGE_STORAGE_KEY);
    return stored === "en" ? "en" : "fi";
}

function getLanguageServerSnapshot(): Language {
    return "fi";
}

export function useStoredLanguage(): Language {
    return useSyncExternalStore(
        subscribeToLanguage,
        getLanguageSnapshot,
        getLanguageServerSnapshot,
    );
}

export function setStoredLanguage(language: Language): void {
    window.localStorage.setItem(UI_LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language;
    window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
}

// --- TEEMA ---

function subscribeToTheme(callback: () => void): () => void {
    window.addEventListener("storage", callback);
    window.addEventListener(THEME_CHANGE_EVENT, callback);

    return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener(THEME_CHANGE_EVENT, callback);
    };
}

function getThemeSnapshot(): Theme {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (stored === "light" || stored === "dark") {
        return stored;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function getThemeServerSnapshot(): Theme {
    return "light";
}

export function useStoredTheme(): Theme {
    return useSyncExternalStore(
        subscribeToTheme,
        getThemeSnapshot,
        getThemeServerSnapshot,
    );
}

export function setStoredTheme(theme: Theme): void {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}
