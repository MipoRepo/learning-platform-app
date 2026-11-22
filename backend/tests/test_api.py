# Tuodaan sys ja Path, jotta backend/-kansio löytyy varmasti testejä ajettaessa
import sys
from pathlib import Path

# Lisätään backend/-kansio Pythonin hakupolkuun (sys.path)
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

# Tuodaan FastAPI:n TestClient rajapintapyyntöjen testaamiseen ilman erillistä palvelinprosessia
from fastapi.testclient import TestClient

# Tuodaan sovellusinstanssi main.py-tiedostosta
from main import app

# Luodaan testiasiakas sovellusta varten
client = TestClient(app)


# Testaa, että /api/health palauttaa 200 OK
def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


# Testaa yksittäisen oppitunnin hakua suomeksi ja englanniksi
def test_get_lesson_with_language_query():
    response_fi = client.get("/api/courses/fast-english-b1-c2/lessons/01-01?lang=fi")
    assert response_fi.status_code == 200
    assert response_fi.json()["language"] == "fi"

    response_en = client.get("/api/courses/fast-english-b1-c2/lessons/01-01?lang=en")
    assert response_en.status_code == 200
    assert response_en.json()["language"] == "en"


# Testaa, että olematon oppitunti palauttaa 404 Not Found
def test_get_nonexistent_lesson_returns_404():
    response = client.get("/api/courses/fast-english-b1-c2/lessons/99-99?lang=fi")
    assert response.status_code == 404


# Testaa oppitunnin suorituksen merkitsemistä (POST) ja poistamista (DELETE)
def test_progress_post_and_delete():
    course_id = "fast-english-b1-c2"
    lesson_id = "01-01"

    # Merkitään oppitunti suoritetuksi
    post_response = client.post(f"/api/progress/{course_id}/{lesson_id}")
    assert post_response.status_code == 200
    assert lesson_id in post_response.json()["completed_lessons"]

    # Poistetaan oppitunnin suoritusmerkintä
    delete_response = client.delete(f"/api/progress/{course_id}/{lesson_id}")
    assert delete_response.status_code == 200
    assert lesson_id not in delete_response.json()["completed_lessons"]
