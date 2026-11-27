// Tämä tiedosto kokoaa kaikki backend-kutsut yhteen paikkaan.
// Komponentit eivät siis kutsu fetch-funktiota suoraan, vaan käyttävät
// tässä tiedostossa määriteltyjä apufunktioita.

import type {
    CourseManifest,
    CourseProgress,
    HealthStatus,
    Language,
    LessonDetail,
} from "./types";

// Backendin osoite luetaan ympäristömuuttujasta. Jos muuttujaa ei ole
// asetettu, käytetään paikallista kehitysosoitetta.
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

// Yksi yhtenäinen virhetyyppi kaikille backend-virheille.
// status-kentän avulla komponentti voi reagoida esimerkiksi 404-virheeseen.
export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

// Yrittää lukea backendin virheilmoituksen. FastAPI palauttaa yleensä
// muodossa { "detail": "..." }, mutta jos vastaus ei ole JSONia,
// käytetään tavallista suomenkielistä oletusviestiä.
async function readErrorMessage(response: Response): Promise<string> {
    try {
        const data = (await response.json()) as { detail?: unknown };

        if (typeof data.detail === "string") {
            return data.detail;
        }
    } catch {
        // JSON-jäsennys epäonnistui, joten käytetään oletusviestiä.
    }

    return `Pyyntö epäonnistui (HTTP ${response.status}).`;
}

// Hakee JSON-datan backendistä ja muuntaa virheet ApiError-tyypiksi.
// cache: "no-store" varmistaa, että edistyminen ja sisältö haetaan aina
// tuoreena eikä selain käytä vanhaa välimuistia.
export async function fetchJson<T>(
    path: string,
    init?: RequestInit,
): Promise<T> {
    let response: Response;

    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            cache: "no-store",
            ...init,
        });
    } catch {
        throw new ApiError(
            0,
            "Backend ei vastaa. Onko FastAPI käynnissä osoitteessa http://localhost:8000?",
        );
    }

    if (!response.ok) {
        throw new ApiError(response.status, await readErrorMessage(response));
    }

    return (await response.json()) as T;
}

// Terveystarkistus kertoo, onko backend käynnissä ja löytyykö sisältökansio.
export function getHealth(): Promise<HealthStatus> {
    return fetchJson<HealthStatus>("/api/health");
}

// Hakee kaikki kurssit kurssikirjastoa varten.
export function getCourses(): Promise<CourseManifest[]> {
    return fetchJson<CourseManifest[]>("/api/courses");
}

// Hakee yhden kurssin metatiedot.
export function getCourse(courseId: string): Promise<CourseManifest> {
    return fetchJson<CourseManifest>(
        `/api/courses/${encodeURIComponent(courseId)}`,
    );
}

// Hakee oppitunnin sisällön valitulla kielellä.
export function getLesson(
    courseId: string,
    lessonId: string,
    language: Language,
): Promise<LessonDetail> {
    return fetchJson<LessonDetail>(
        `/api/courses/${encodeURIComponent(courseId)}/lessons/${encodeURIComponent(lessonId)}?lang=${language}`,
    );
}

// Hakee kurssin edistymisen.
export function getProgress(courseId: string): Promise<CourseProgress> {
    return fetchJson<CourseProgress>(
        `/api/progress/${encodeURIComponent(courseId)}`,
    );
}

// Merkitsee oppitunnin suoritetuksi.
export function markLessonCompleted(
    courseId: string,
    lessonId: string,
): Promise<CourseProgress> {
    return fetchJson<CourseProgress>(
        `/api/progress/${encodeURIComponent(courseId)}/${encodeURIComponent(lessonId)}`,
        { method: "POST" },
    );
}

// Poistaa oppitunnin suoritusmerkinnän.
export function unmarkLessonCompleted(
    courseId: string,
    lessonId: string,
): Promise<CourseProgress> {
    return fetchJson<CourseProgress>(
        `/api/progress/${encodeURIComponent(courseId)}/${encodeURIComponent(lessonId)}`,
        { method: "DELETE" },
    );
}
