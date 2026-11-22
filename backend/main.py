# Tuodaan Pythonin sisäänrakennettu json-kirjasto JSON-tiedostojen lukemiseen ja kirjoittamiseen
import json

# Tuodaan Path-työkalu, jolla tiedostopolut toimivat siististi kaikissa käyttöjärjestelmissä
from pathlib import Path

# Tuodaan tyypitystyökalut listojen, sanakirjojen ja valinnaisten arvojen määrittelyyn
from typing import Dict, List, Optional

# Tuodaan FastAPI-pääluokka, HTTPException ja Query-kyselyparametri
from fastapi import FastAPI, HTTPException, Query

# Tuodaan CORS-väliohjelmisto, jotta selain (http://localhost:3000) saa ottaa yhteyttä palvelimeen
from fastapi.middleware.cors import CORSMiddleware

# Tuodaan omat Pydantic-tietomallit tiedostosta schemas.py
from schemas import CourseManifest, CourseProgress, LessonDetail

# Luodaan FastAPI-sovellus ja annetaan sille nimi, kuvaus ja versio /docs-sivua varten
app = FastAPI(
    title="Learning Platform API",
    description="Modulaarisen oppimisalustan REST API -rajapinta",
    version="0.2.0",
)

# Sallitaan HTTP-pyynnöt paikallisista kehitysympäristöistä (http://localhost:3000 ja http://localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Määritellään projektin juurikansio suhteessa tähän main.py-tiedostoon (backend/ -> juuri)
BASE_DIR = Path(__file__).resolve().parent.parent

# Määritellään polut kurssipakettien kansioon ja tallennetun edistymisen tiedostoon
CONTENT_DIR = BASE_DIR / "content-modules"
DATA_DIR = BASE_DIR / "data"
PROGRESS_FILE = DATA_DIR / "progress.json"


# Apufunktio, joka lukee JSON-tiedoston levyltä ja palauttaa 404-virheen, jos sitä ei löydy
def read_json_file(file_path: Path, not_found_message: str) -> dict:
    # Tarkistetaan, että tiedosto on olemassa ennen lukemista
    if not file_path.exists():
        raise HTTPException(status_code=404, detail=not_found_message)
    # Avataan tiedosto UTF-8-merkistöllä, jotta ääkköset (ä, ö) toimivat oikein
    with open(file_path, "r", encoding="utf-8") as file:
        return json.load(file)


# Apufunktio, joka lukee progress.json-tiedoston tai palauttaa oletusrakenteen
def read_progress_data() -> dict:
    # Luodaan data/-kansio tarvittaessa
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    # Jos progress.json-tiedostoa ei ole vielä luotu, palautetaan tyhjä pohjarakenne
    if not PROGRESS_FILE.exists():
        return {
            "preferences": {"ui_language": "fi", "theme": "light"},
            "courses": {},
        }
    # Luetaan olemassa oleva progress.json-tiedosto levyltä
    with open(PROGRESS_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)
    # Varmistetaan, että "courses"-avain löytyy sanakirjasta
    data.setdefault("courses", {})
    return data


# Apufunktio, joka tallentaa päivitetyn edistymisrakenteen pysyvästi progress.json-tiedostoon
def write_progress_data(progress_data: dict) -> None:
    # Varmistetaan, että data/-kansio on olemassa
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    # Kirjoitetaan JSON sisennettynä (indent=2) UTF-8-muodossa
    with open(PROGRESS_FILE, "w", encoding="utf-8") as file:
        json.dump(progress_data, file, ensure_ascii=False, indent=2)


# Apufunktio, joka laskee kurssin kaikkien oppituntien yhteismäärän
def count_course_lessons(course_data: dict) -> int:
    total = 0
    # Käydään läpi kaikki kurssin moduulit ja lasketaan niiden oppitunnit
    for module in course_data.get("modules", []):
        total += len(module.get("lessons", []))
    return total


# Apufunktio, joka laskee suoritusprosentin turvallisesti ilman nollalla jakoa
def calculate_completion_percentage(completed_count: int, total_count: int) -> float:
    # Jos oppitunteja on 0, palautetaan suoraan 0.0
    if total_count <= 0:
        return 0.0
    # Lasketaan prosenttiosuus yhden desimaalin tarkkuudella
    return round((completed_count / total_count) * 100, 1)


# Tarkistaa, että taustapalvelin on käynnissä ja löytää kurssikansion
@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "message": "FastAPI-taustapalvelin toimii!",
        "content_dir_exists": CONTENT_DIR.exists(),
    }


# Lukee kaikki content-modules/-kansiosta löytyvät kurssit ja tarkistaa ne Pydanticilla
@app.get("/api/courses", response_model=List[CourseManifest])
def get_all_courses():
    # Jos kurssikansiota ei löydy levyltä, palautetaan selkeä 404-virhe
    if not CONTENT_DIR.exists():
        raise HTTPException(
            status_code=404,
            detail="Kurssikansiota (content-modules) ei löytynyt.",
        )

    courses: List[CourseManifest] = []

    # Käydään läpi kaikki alikansiot content-modules/-kansiossa aakkosjärjestyksessä
    for course_folder in sorted(CONTENT_DIR.iterdir()):
        manifest_path = course_folder / "course.json"
        if course_folder.is_dir() and manifest_path.exists():
            raw_data = read_json_file(
                manifest_path,
                f"Kurssin '{course_folder.name}' course.json-tiedostoa ei löytynyt.",
            )
            # Pydantic tarkistaa JSON-datan rakenteen ja muuntaa sen CourseManifest-objektiksi
            validated_course = CourseManifest(**raw_data)
            courses.append(validated_course)

    return courses


# Hakee yksittäisen kurssin tiedot tunnisteen perusteella
@app.get("/api/courses/{course_id}", response_model=CourseManifest)
def get_course(course_id: str):
    manifest_path = CONTENT_DIR / course_id / "course.json"
    raw_data = read_json_file(
        manifest_path,
        f"Kurssia '{course_id}' ei löytynyt.",
    )
    return CourseManifest(**raw_data)


# Hakee yksittäisen oppitunnin sisällön kielivalinnalla (?lang=fi/en)
@app.get("/api/courses/{course_id}/lessons/{lesson_id}", response_model=LessonDetail)
def get_lesson(
    course_id: str,
    lesson_id: str,
    lang: Optional[str] = Query(default=None, description="Opetuskieli, esim. 'fi' tai 'en'"),
):
    # Haetaan ensin kurssin perustiedot course.json-tiedostosta
    manifest_path = CONTENT_DIR / course_id / "course.json"
    course_data = read_json_file(
        manifest_path,
        f"Kurssia '{course_id}' ei löytynyt.",
    )

    # Valitaan pyydetty kieli tai kurssin oletuskieli
    selected_lang = lang or course_data.get("default_language", "fi")

    # Etsitään oppitunti kurssin moduuleista
    found_lesson = None
    for module in course_data.get("modules", []):
        for lesson in module.get("lessons", []):
            if lesson.get("lesson_id") == lesson_id:
                found_lesson = lesson
                break
        if found_lesson:
            break

    # Jos oppituntia ei löydy kurssista, palautetaan 404 Not Found
    if not found_lesson:
        raise HTTPException(
            status_code=404,
            detail=f"Oppituntia '{lesson_id}' ei löytynyt kurssista '{course_id}'.",
        )

    # Haetaan oppitunnin kielikohtainen tiedostopolku
    lesson_files: Dict[str, str] = found_lesson.get("files", {})
    relative_file = lesson_files.get(selected_lang)

    # Jos pyydetylle kielelle ei ole tiedostoa, palautetaan 404 Not Found
    if not relative_file:
        raise HTTPException(
            status_code=404,
            detail=f"Oppitunnille '{lesson_id}' ei ole sisältöä kielellä '{selected_lang}'.",
        )

    # Luetaan oppitunnin JSON-tiedosto ja validoidaan se LessonDetail-mallilla
    lesson_path = CONTENT_DIR / course_id / relative_file
    lesson_data = read_json_file(
        lesson_path,
        f"Oppituntitiedostoa '{relative_file}' ei löytynyt.",
    )
    return LessonDetail(**lesson_data)


# Hakee opiskelijan edistymisen tietylle kurssille
@app.get("/api/progress/{course_id}", response_model=CourseProgress)
def get_course_progress(course_id: str):
    manifest_path = CONTENT_DIR / course_id / "course.json"
    course_data = read_json_file(
        manifest_path,
        f"Kurssia '{course_id}' ei löytynyt.",
    )
    total_lessons = count_course_lessons(course_data)

    progress_store = read_progress_data()
    course_entry = progress_store["courses"].get(
        course_id,
        {
            "preferred_course_language": course_data.get("default_language", "fi"),
            "completed_lessons": [],
            "last_accessed_lesson": None,
        },
    )
    completed = course_entry.get("completed_lessons", [])

    return CourseProgress(
        preferred_course_language=course_entry.get(
            "preferred_course_language", course_data.get("default_language", "fi")
        ),
        completed_lessons=completed,
        last_accessed_lesson=course_entry.get("last_accessed_lesson"),
        completion_percentage=calculate_completion_percentage(len(completed), total_lessons),
    )


# Merkitsee oppitunnin suoritetuksi ja tallentaa muutoksen progress.json-tiedostoon
@app.post("/api/progress/{course_id}/{lesson_id}", response_model=CourseProgress)
def mark_lesson_completed(course_id: str, lesson_id: str):
    manifest_path = CONTENT_DIR / course_id / "course.json"
    course_data = read_json_file(
        manifest_path,
        f"Kurssia '{course_id}' ei löytynyt.",
    )
    total_lessons = count_course_lessons(course_data)

    progress_store = read_progress_data()
    course_entry = progress_store["courses"].setdefault(
        course_id,
        {
            "preferred_course_language": course_data.get("default_language", "fi"),
            "completed_lessons": [],
            "last_accessed_lesson": None,
        },
    )

    # Lisätään oppitunti suoritettujen listaan, jos se ei ole siellä vielä
    if lesson_id not in course_entry["completed_lessons"]:
        course_entry["completed_lessons"].append(lesson_id)

    # Päivitetään viimeksi käsitelty oppitunti
    course_entry["last_accessed_lesson"] = lesson_id

    # Tallennetaan päivitetty tila pysyvästi levylle
    write_progress_data(progress_store)

    completed = course_entry["completed_lessons"]
    return CourseProgress(
        preferred_course_language=course_entry.get(
            "preferred_course_language", course_data.get("default_language", "fi")
        ),
        completed_lessons=completed,
        last_accessed_lesson=course_entry.get("last_accessed_lesson"),
        completion_percentage=calculate_completion_percentage(len(completed), total_lessons),
    )


# Poistaa oppitunnin suoritusmerkinnän ja tallentaa päivitetyn tilan progress.json-tiedostoon
@app.delete("/api/progress/{course_id}/{lesson_id}", response_model=CourseProgress)
def unmark_lesson_completed(course_id: str, lesson_id: str):
    manifest_path = CONTENT_DIR / course_id / "course.json"
    course_data = read_json_file(
        manifest_path,
        f"Kurssia '{course_id}' ei löytynyt.",
    )
    total_lessons = count_course_lessons(course_data)

    progress_store = read_progress_data()
    course_entry = progress_store["courses"].setdefault(
        course_id,
        {
            "preferred_course_language": course_data.get("default_language", "fi"),
            "completed_lessons": [],
            "last_accessed_lesson": None,
        },
    )

    # Poistetaan oppitunti suoritettujen listasta, jos se löytyy sieltä
    if lesson_id in course_entry["completed_lessons"]:
        course_entry["completed_lessons"].remove(lesson_id)

    # Tallennetaan päivitetty tila pysyvästi levylle
    write_progress_data(progress_store)

    completed = course_entry["completed_lessons"]
    return CourseProgress(
        preferred_course_language=course_entry.get(
            "preferred_course_language", course_data.get("default_language", "fi")
        ),
        completed_lessons=completed,
        last_accessed_lesson=course_entry.get("last_accessed_lesson"),
        completion_percentage=calculate_completion_percentage(len(completed), total_lessons),
    )