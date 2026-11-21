# Tuodaan Pythonin sisäänrakennettu json-kirjasto JSON-tiedostojen lukemiseen
import json
# Tuodaan Path-työkalu, jolla tiedostopolut toimivat siististi kaikissa käyttöjärjestelmissä
from pathlib import Path
# Tuodaan List-tyyppi palautusarvojen määrittelyyn
from typing import List

# Tuodaan FastAPI-pääluokka ja HTTPException virheilmoitusten lähettämiseen
from fastapi import FastAPI, HTTPException
# Tuodaan CORS-väliohjelmisto, jotta selain (localhost:3000) saa ottaa yhteyttä palvelimeen
from fastapi.middleware.cors import CORSMiddleware

# Tuodaan omat Pydantic-tietomallimme tiedostosta schemas.py
from schemas import CourseManifest

# Luodaan FastAPI-sovellus ja annetaan sille nimi ja kuvaus /docs-sivua varten
app = FastAPI(
    title="Learning Platform API",
    description="Modulaarisen oppimisalustan REST API -rajapinta",
    version="0.1.0",
)

# Sallitaan HTTP-pyynnöt Next.js-kehityspalvelimelta (portti 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],  # Sallitaan kaikki HTTP-metodit (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Sallitaan kaikki HTTP-otsikkotiedot
)

# Määritellään projektin juurikansio suhteessa tähän main.py-tiedostoon (backend/ -> juuri)
BASE_DIR = Path(__file__).resolve().parent.parent
# Määritellään polku kurssipakettien kansioon
CONTENT_DIR = BASE_DIR / "content-modules"


@app.get("/api/health")
def health_check():
    """Tarkistaa, että taustapalvelin on käynnissä ja löytää kurssikansion."""
    return {
        "status": "ok",
        "message": "FastAPI-taustapalvelin toimii!",
        "content_dir_exists": CONTENT_DIR.exists(),
    }


@app.get("/api/courses", response_model=List[CourseManifest])
def get_all_courses():
    """Lukee kaikki content-modules/-kansiosta löytyvät kurssit ja tarkistaa ne Pydanticilla."""
    # Jos kurssikansiota ei löydy levyltä, palautetaan selkeä 404-virhe
    if not CONTENT_DIR.exists():
        raise HTTPException(status_code=404, detail="Kurssikansiota (content-modules) ei löytynyt.")

    courses: List[CourseManifest] = []

    # Käydään läpi kaikki alikansiot content-modules/-kansiossa aakkosjärjestyksessä
    for course_folder in sorted(CONTENT_DIR.iterdir()):
        # Tarkistetaan, että kohde on kansio ja sen sisältä löytyy course.json-tiedosto
        manifest_path = course_folder / "course.json"
        if course_folder.is_dir() and manifest_path.exists():
            # Avataan course.json UTF-8-merkistöllä, jotta ääkköset (ä, ö) toimivat oikein
            with open(manifest_path, "r", encoding="utf-8") as file:
                raw_data = json.load(file)
                # Pydantic tarkistaa JSON-datan rakenteen ja muuntaa sen CourseManifest-objektiksi
                validated_course = CourseManifest(**raw_data)
                courses.append(validated_course)

    return courses
