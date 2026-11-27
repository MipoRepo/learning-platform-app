// Tämä tiedosto peilaa backendin Pydantic-skeemoja (backend/schemas.py).
// Kun backendin skeema muuttuu, myös nämä tyypit päivitetään käsin.

// Sovelluksessa tuetut kielet. Käyttöliittymän kieli ja kurssin kieli
// käyttävät molemmat samoja kielikoodeja.
export type Language = "fi" | "en";

// Yksi oppitunnin sisältölohko. Backend palauttaa lohkot tässä muodossa.
export type ContentBlock = {
    // Lohkon yksilöllinen tunniste, esimerkiksi "b1".
    id: string;
    // Lohkon tyyppi. Tuntematon tyyppi käsitellään renderöinnissä varovasti.
    type: "heading" | "paragraph" | "table" | "callout";
    // Tekstisisältö, käytössä otsikko- ja kappalelohkoissa.
    text?: string;
    // Otsikkotaso, esimerkiksi 2 tarkoittaa h2-elementtiä.
    level?: number;
    // Taulukon sarakeotsikot.
    headers?: string[];
    // Taulukon rivit. Jokainen rivi on lista solujen tekstejä.
    rows?: string[][];
    // Vinkkilaatikon tyyli.
    variant?: "info" | "tip" | "warning";
    // Vinkkilaatikon oma otsikko.
    title?: string;
};

// Kurssin yleiskartassa (course.json) oleva oppitunnin viitetieto.
export type LessonReference = {
    lesson_id: string;
    order: number;
    titles: Record<Language, string>;
    files: Record<Language, string>;
    estimated_minutes: number;
};

// Yksi kurssimoduuli, joka sisältää joukon oppitunteja.
export type ModuleInfo = {
    module_id: string;
    order: number;
    titles: Record<Language, string>;
    lessons: LessonReference[];
};

// Koko kurssin metatiedot.
export type CourseManifest = {
    course_id: string;
    available_languages: Language[];
    default_language: Language;
    titles: Record<Language, string>;
    descriptions: Record<Language, string>;
    estimated_hours: number;
    modules: ModuleInfo[];
};

// Yksittäisen oppitunnin sisältö valitulla kielellä.
export type LessonDetail = {
    lesson_id: string;
    language: Language;
    title: string;
    estimated_minutes: number;
    blocks: ContentBlock[];
};

// Kurssin edistyminen. Backend laskee prosentin valmiiksi.
export type CourseProgress = {
    preferred_course_language: Language;
    completed_lessons: string[];
    last_accessed_lesson: string | null;
    completion_percentage: number;
};

// Backendin terveystarkistuksen vastaus.
export type HealthStatus = {
    status: string;
    message: string;
    content_dir_exists: boolean;
};
