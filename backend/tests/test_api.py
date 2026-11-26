# Tuodaan sys ja Path, jotta backend/-kansio löytyy varmasti testejä ajettaessa
import sys
from pathlib import Path

# Lisätään backend/-kansio Pythonin hakupolkuun (sys.path)
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

# Tuodaan json, jotta voimme lukea sisältötiedostot suoraan testeissä
import json

# Tuodaan pytest, jotta voimme käyttää fixtureja ja väliaikaisia tiedostoja
import pytest

# Tuodaan FastAPI:n TestClient rajapintapyyntöjen testaamiseen ilman erillistä palvelinprosessia
from fastapi.testclient import TestClient

# Tuodaan koko main-moduuli, jotta voimme korvata edistymistiedoston polun testin ajaksi
import main

# Tuodaan Pydantic-mallit sisältötiedostojen validointia varten
from schemas import CourseManifest, LessonDetail

# Luodaan testiasiakas sovellusta varten
client = TestClient(main.app)

# Määritellään testeissä käytettävät vakiot, jotta kirjoitusvirheet vähenevät
COURSE_ID = "fast-english-b1-c2"
LESSON_ID = "01-01"


# Fixture, joka antaa jokaiselle testille oman väliaikaisen progress.json-tiedoston.
# Näin testit eivät muuta oikeaa data/progress.json-tiedostoa.
@pytest.fixture
def isolated_progress(tmp_path, monkeypatch):
    # Luodaan väliaikainen tiedostopolku testin omaan hakemistoon
    progress_file = tmp_path / "progress.json"

    # Korvataan main-moduulin globaalit polut testin ajaksi
    monkeypatch.setattr(main, "DATA_DIR", tmp_path)
    monkeypatch.setattr(main, "PROGRESS_FILE", progress_file)

    # Palautetaan polku, jos testi haluaa tarkistaa tiedoston sisällön suoraan
    return progress_file


# Testaa, että /api/health palauttaa 200 OK
def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


# Testaa, että kaikki content-modules-kansion JSON-tiedostot läpäisevät Pydantic-validoinnin
def test_all_content_json_files_validate():
    # Kerätään kaikki kurssien course.json-tiedostot ja varmistetaan, ettei lista ole tyhjä
    course_files = list(main.CONTENT_DIR.glob("*/course.json"))
    assert course_files, "course.json-tiedostoja ei löytynyt"

    # Lasketaan validoidut oppituntitiedostot, jotta testi ei mene läpi tyhjänä
    lesson_count = 0

    # Käydään läpi jokainen kurssikansio ja sen course.json-tiedosto
    for course_file in course_files:
        course_data = json.loads(course_file.read_text(encoding="utf-8"))
        CourseManifest(**course_data)

        # Käydään läpi saman kurssin kaikki muut JSON-tiedostot eli oppitunnit
        for lesson_file in course_file.parent.rglob("*.json"):
            if lesson_file.name == "course.json":
                continue

            lesson_data = json.loads(lesson_file.read_text(encoding="utf-8"))
            LessonDetail(**lesson_data)
            lesson_count += 1

    # Varmistetaan, että ainakin yksi oppituntitiedosto validoitiin
    assert lesson_count > 0, "oppituntitiedostoja ei löytynyt"


# Testaa, että kurssilista palauttaa vähintään yhden kurssin ja oikean tunnisteen
def test_get_all_courses_returns_course():
    response = client.get("/api/courses")
    assert response.status_code == 200

    course_ids = [course["course_id"] for course in response.json()]
    assert COURSE_ID in course_ids


# Testaa yksittäisen kurssin hakua tunnisteen perusteella
def test_get_course_by_id():
    response = client.get(f"/api/courses/{COURSE_ID}")
    assert response.status_code == 200
    assert response.json()["course_id"] == COURSE_ID


# Testaa yksittäisen oppitunnin hakua suomeksi ja englanniksi
def test_get_lesson_with_language_query():
    response_fi = client.get(f"/api/courses/{COURSE_ID}/lessons/{LESSON_ID}?lang=fi")
    assert response_fi.status_code == 200
    assert response_fi.json()["language"] == "fi"

    response_en = client.get(f"/api/courses/{COURSE_ID}/lessons/{LESSON_ID}?lang=en")
    assert response_en.status_code == 200
    assert response_en.json()["language"] == "en"


# Testaa, että olematon oppitunti palauttaa 404 Not Found
def test_get_nonexistent_lesson_returns_404():
    response = client.get(f"/api/courses/{COURSE_ID}/lessons/99-99?lang=fi")
    assert response.status_code == 404


# Testaa, että olematon kurssi palauttaa 404 Not Found
def test_get_nonexistent_course_returns_404():
    response = client.get("/api/courses/olematon-kurssi")
    assert response.status_code == 404


# Testaa, että tuetun kielen puuttuminen palauttaa 404 Not Found
def test_get_lesson_with_unsupported_language_returns_404():
    response = client.get(f"/api/courses/{COURSE_ID}/lessons/{LESSON_ID}?lang=de")
    assert response.status_code == 404


# Testaa, että uuden kurssin edistyminen alkaa nollasta
def test_get_progress_defaults_to_zero(isolated_progress):
    response = client.get(f"/api/progress/{COURSE_ID}")
    assert response.status_code == 200

    data = response.json()
    assert data["completed_lessons"] == []
    assert data["last_accessed_lesson"] is None
    assert data["completion_percentage"] == 0.0
    assert data["preferred_course_language"] == "fi"


# Testaa, että sama POST-pyyntö kahdesti ei lisää oppituntia kahteen kertaan
def test_progress_post_is_idempotent(isolated_progress):
    first_response = client.post(f"/api/progress/{COURSE_ID}/{LESSON_ID}")
    assert first_response.status_code == 200
    assert first_response.json()["completed_lessons"].count(LESSON_ID) == 1

    second_response = client.post(f"/api/progress/{COURSE_ID}/{LESSON_ID}")
    assert second_response.status_code == 200
    assert second_response.json()["completed_lessons"].count(LESSON_ID) == 1

    # Kurssilla on yksi oppitunti, joten yhden suoritus tarkoittaa 100 prosenttia
    assert second_response.json()["completion_percentage"] == 100.0


# Testaa, että DELETE poistaa suoritusmerkinnän ja palauttaa prosentin nollaan
def test_progress_delete(isolated_progress):
    client.post(f"/api/progress/{COURSE_ID}/{LESSON_ID}")

    delete_response = client.delete(f"/api/progress/{COURSE_ID}/{LESSON_ID}")
    assert delete_response.status_code == 200
    assert LESSON_ID not in delete_response.json()["completed_lessons"]
    assert delete_response.json()["completion_percentage"] == 0.0


# Testaa prosenttilaskennan tunnetut tapaukset ja nollalla jakamisen eston
def test_calculate_completion_percentage():
    assert main.calculate_completion_percentage(0, 10) == 0.0
    assert main.calculate_completion_percentage(5, 10) == 50.0
    assert main.calculate_completion_percentage(10, 10) == 100.0
    assert main.calculate_completion_percentage(0, 0) == 0.0


# Testaa, että olemattoman kurssin edistyminen palauttaa 404 Not Found
def test_get_progress_for_nonexistent_course_returns_404():
    response = client.get("/api/progress/olematon-kurssi")
    assert response.status_code == 404
