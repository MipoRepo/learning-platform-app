# Tuodaan Pythonin tyypitystyökalut listojen, sanakirjojen ja valinnaisten kenttien määrittelyyn
from typing import Dict, List, Optional

# Tuodaan Pydanticista BaseModel-perusluokka tietomallien (skeemojen) rakentamista varten
from pydantic import BaseModel


# --- 1. YKSITTÄISEN OPPITUNNIN SISÄLTÖLOHKOT ---

# Määrittelee yhden sisältölohkon (otsikko, kappale, taulukko, vinkkilaatikko jne.) rakenteen
class ContentBlock(BaseModel):
    # Lohkon yksilöllinen tunniste, esimerkiksi "b1"
    id: str
    # Lohkon tyyppi: "heading", "paragraph", "table" tai "callout"
    type: str
    # Varsinainen tekstisisältö (valinnainen, esimerkiksi taulukolla ei ole tätä)
    text: Optional[str] = None
    # Otsikkotaso (esimerkiksi 2 -> H2), käytetään "heading"-lohkoissa
    level: Optional[int] = None
    # Taulukon sarakeotsikot listana, käytetään "table"-lohkoissa
    headers: Optional[List[str]] = None
    # Taulukon rivit (lista listoista), käytetään "table"-lohkoissa
    rows: Optional[List[List[str]]] = None
    # Vinkkilaatikon tyyli (esimerkiksi "tip"), käytetään "callout"-lohkoissa
    variant: Optional[str] = None
    # Vinkkilaatikon oma otsikko
    title: Optional[str] = None


# Määrittelee yksittäisen kielikohtaisen oppituntitiedoston rakenteen
class LessonDetail(BaseModel):
    # Oppitunnin tunniste, esimerkiksi "01-01"
    lesson_id: str
    # Oppitunnin kielikoodi, esimerkiksi "fi" tai "en"
    language: str
    # Oppitunnin otsikko valitulla kielellä
    title: str
    # Arvioitu opiskeluaika minuutteina (kokonaisluku)
    estimated_minutes: int
    # Lista oppitunnin sisältölohkoista oikeassa järjestyksessä
    blocks: List[ContentBlock]


# --- 2. KURSSIN YLEISRAKENTEEN TIETOMALLIT (course.json) ---

# Määrittelee oppitunnin viitetiedot kurssin yleiskartassa (course.json)
class LessonReference(BaseModel):
    # Oppitunnin tunniste, esimerkiksi "01-01"
    lesson_id: str
    # Järjestysnumero moduulin sisällä
    order: int
    # Käännetyt otsikot sanakirjana, esimerkiksi {"fi": "...", "en": "..."}
    titles: Dict[str, str]
    # Polut kielikohtaisiin JSON-tiedostoihin, esimerkiksi {"fi": "..."}
    files: Dict[str, str]
    # Arvioitu kesto minuutteina
    estimated_minutes: int


# Määrittelee yhden kurssimoduulin rakenteen course.json-tiedostossa
class ModuleInfo(BaseModel):
    # Moduulin tunniste, esimerkiksi "01-perusrakenteet"
    module_id: str
    # Moduulin järjestysnumero kurssissa
    order: int
    # Moduulin nimet eri kielillä
    titles: Dict[str, str]
    # Lista moduuliin kuuluvista oppitunneista
    lessons: List[LessonReference]


# Määrittelee koko kurssin pääasetustiedoston (course.json) rakenteen
class CourseManifest(BaseModel):
    # Kurssin yksilöllinen tunniste, esimerkiksi "fast-english-b1-c2"
    course_id: str
    # Lista tuetuista kielistä, esimerkiksi ["fi", "en"]
    available_languages: List[str]
    # Kurssin oletuskieli, esimerkiksi "fi"
    default_language: str
    # Kurssin otsikot eri kielillä
    titles: Dict[str, str]
    # Kurssin kuvaukset eri kielillä
    descriptions: Dict[str, str]
    # Kurssin kokonaiskesto tunteina
    estimated_hours: int
    # Lista kurssin moduuleista
    modules: List[ModuleInfo]


# --- 3. KÄYTTÄJÄN ASETUKSET JA EDISTYMINEN (data/progress.json) ---

# Käyttäjän yleiset käyttöliittymäasetukset
class UserPreferences(BaseModel):
    # Käyttöliittymän kieli ("fi" tai "en")
    ui_language: str = "fi"
    # Ulkoasuteema ("light" tai "dark")
    theme: str = "light"


# Yhden kurssin tallennettu edistyminen ja kielivalinta
class CourseProgress(BaseModel):
    # Käyttäjän valitsema opiskelukieli tälle kurssille
    preferred_course_language: str = "fi"
    # Lista suoritettujen oppituntien tunnisteista, esimerkiksi ["01-01"]
    completed_lessons: List[str] = []
    # Viimeksi avattu tai päivitetty oppitunti
    last_accessed_lesson: Optional[str] = None
    # Kurssin suoritusprosentti (0.0 - 100.0)
    completion_percentage: float = 0.0


# Koko data/progress.json-tiedoston ylätason rakenne
class ProgressData(BaseModel):
    # Käyttäjän yleiset asetukset
    preferences: UserPreferences = UserPreferences()
    # Kurssikohtaiset edistymistiedot kurssin ID:llä avainnettuna
    courses: Dict[str, CourseProgress] = {}