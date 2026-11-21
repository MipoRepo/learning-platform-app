# Tuodaan Pythonin tyypitystyökalut listojen, sanakirjojen ja valinnaisten kenttien määrittelyyn
from typing import Dict, List, Optional
# Tuodaan Pydanticista BaseModel-perusluokka tietomallien (skeemojen) rakentamista varten
from pydantic import BaseModel


# --- 1. YKSITTÄISEN OPPITUNNIN SISÄLTÖLOHKOT ---

class ContentBlock(BaseModel):
    """Määrittelee yhden sisältölohkon (otsikko, kappale, taulukko, vinkkilaatikko jne.) rakenteen."""
    id: str                                # Lohkon yksilöllinen tunniste, esim. "b1"
    type: str                              # Lohkon tyyppi: "heading", "paragraph", "table" tai "callout"
    text: Optional[str] = None             # Varsinainen tekstisisältö (valinnainen, esim. taulukolla ei ole tätä)
    level: Optional[int] = None            # Otsikkotaso (esim. 2 -> H2), käytetään vain "heading"-lohkoissa
    headers: Optional[List[str]] = None    # Taulukon sarakeotsikot listana, käytetään "table"-lohkoissa
    rows: Optional[List[List[str]]] = None # Taulukon rivit (lista listoista), käytetään "table"-lohkoissa
    variant: Optional[str] = None          # Vinkkilaatikon tyyli (esim. "tip"), käytetään "callout"-lohkoissa
    title: Optional[str] = None            # Vinkkilaatikon oma otsikko


class LessonDetail(BaseModel):
    """Määrittelee yksittäisen kielikohtaisen oppituntitiedoston (esim. 01-01-sanajarjestys.json) rakenteen."""
    lesson_id: str                         # Oppitunnin tunniste, esim. "01-01"
    language: str                          # Oppitunnin kielikoodi, esim. "fi" tai "en"
    title: str                             # Oppitunnin otsikko valitulla kielellä
    estimated_minutes: int                 # Arvioitu opiskeluaika minuutteina (kokonaisluku)
    blocks: List[ContentBlock]             # Lista oppitunnin sisältölohkoista oikeassa järjestyksessä


# --- 2. KURSSIN YLEISRAKENTEEN TIETOMALLIT (course.json) ---

class LessonReference(BaseModel):
    """Määrittelee oppitunnin viitetiedot kurssin yleiskartassa (course.json)."""
    lesson_id: str                         # Oppitunnin tunniste, esim. "01-01"
    order: int                             # Järjestysnumero moduulin sisällä
    titles: Dict[str, str]                 # Käännetyt otsikot sanakirjana, esim. {"fi": "...", "en": "..."}
    files: Dict[str, str]                  # Polut kielikohtaisiin JSON-tiedostoihin, esim. {"fi": "fi/..."}
    estimated_minutes: int                 # Arvioitu kesto minuutteina


class ModuleInfo(BaseModel):
    """Määrittelee yhden kurssimoduulin rakenteen course.json-tiedostossa."""
    module_id: str                         # Moduulin tunniste, esim. "01-perusrakenteet"
    order: int                             # Moduulin järjestysnumero kurssissa
    titles: Dict[str, str]                 # Moduulin nimet eri kielillä
    lessons: List[LessonReference]         # Lista moduuliin kuuluvista oppitunneista


class CourseManifest(BaseModel):
    """Määrittelee koko kurssin pääasetustiedoston (course.json) rakenteen."""
    course_id: str                         # Kurssin yksilöllinen tunniste, esim. "fast-english-b1-c2"
    available_languages: List[str]         # Lista tuetuista kielistä, esim. ["fi", "en"]
    default_language: str                  # Kurssin oletuskieli, esim. "fi"
    titles: Dict[str, str]                 # Kurssin otsikot eri kielillä
    descriptions: Dict[str, str]           # Kurssin kuvaukset eri kielillä
    estimated_hours: int                   # Kurssin kokonaiskesto tunteina
    modules: List[ModuleInfo]              # Lista kurssin moduuleista


# --- 3. KÄYTTÄJÄN ASETUKSET JA EDISTYMINEN (data/progress.json) ---

class UserPreferences(BaseModel):
    """Käyttäjän yleiset käyttöliittymäasetukset."""
    ui_language: str = "fi"                # Käyttöliittymän kieli ("fi" tai "en")
    theme: str = "light"                   # Ulkoasuteema ("light" tai "dark")


class CourseProgress(BaseModel):
    """Yhden kurssin tallennettu edistyminen ja kielivalinta."""
    preferred_course_language: str = "fi"  # Käyttäjän valitsema opiskelukieli tälle kurssille
    completed_lessons: List[str] = []      # Lista suoritettujen oppituntien tunnisteista, esim. ["01-01"]


class ProgressData(BaseModel):
    """Koko data/progress.json-tiedoston ylätason rakenne."""
    preferences: UserPreferences           # Käyttäjän yleiset asetukset
    courses: Dict[str, CourseProgress]     # Kurssikohtaiset edistymistiedot kurssin ID:llä avainnettuna
