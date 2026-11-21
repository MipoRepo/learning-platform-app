# learning-platform-app

Universaali, sisältöriippumaton (*Content-Agnostic*) ja moduulipohjainen oppimisalustasovellus.

Alusta erottaa sovellusmoottorin ja opetusmateriaalit toisistaan: kurssit tuodaan järjestelmään standardoidun, lohkopohjaisen JSON-skeeman mukaisina sisältöpaketteina (`content-modules/`), ja sovellus renderöi tekstit, taulukot, koodilohkot, kuvat ja videot sekä tallentaa opiskelijan edistymisen.

---

## Keskeiset ominaisuudet (MVP v1.0)

* **Kolmiportainen näkymähierarkia:** Kurssikirjasto → Kurssin etusivu (yhteenveto ja moduulit) → Opintojakson lukutila (ylävalikko pääaiheille, vasen sivupalkki oppitunneille).
* **Lohkopohjainen sisällön esitys (*Block-Based Content*):** Rakenteiset JSON-oppitunnit tukevat otsikoita, tekstiä, taulukoita, kuvia, videoita ja vinkkilaatikoita.
* **Edistymisen seuranta (*Progress Tracking*):** Oppituntien kuittaus tehdyksi sekä reaaliaikaiset edistymismittarit moduuli- ja kurssitasolla.
* **Monikielisyys (`FI / EN`):** Käyttöliittymän kielen ja kurssikohtaisen opetuskielen vaihto.
* **Käyttöliittymän ergonomia:** Oletuksena vaalea tila (*Light Mode*) sekä nopea vaihto tummaan tilaan (*Dark Mode*).
* **AI-Ready-sisältörakenne:** Vakioitu JSON- ja Pydantic-skeema tekoälyavusteista kurssituotantoa ja käännöksiä varten.

---

## Teknologiavalinnat (*Tech Stack*)

* **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS
* **Backend:** Python 3.11+, FastAPI, Pydantic
* **Tietovarasto (MVP):** Paikalliset JSON-tiedostot (`content-modules/`, `progress.json`)
* **Testaus & QA:** `pytest` (MVP), jatkossa `Postman`, `Playwright` & `Robot Framework`

---

## Projektin dokumentaatio

Kaikki ohjelmistotuotannon suunnitteludokumentit, arkkitehtuurikuvaukset, tietomallit ja *Zero to Hero* -luentomateriaalit hallitaan erillisessä dokumentaatiorepositoriossa (`00-learning-platform-docs`).

---

## Lisenssi ja käyttöoikeudet (*License – All Rights Reserved / View Only*)

**Copyright © 2026 MipoRepo. Kaikki oikeudet pidätetään (*All Rights Reserved*).**

Tämä repositorio ja sen lähdekoodi on julkaistu **ainoastaan katselua varten (*View Only*)**.
* Koodin kopioiminen, muokkaaminen, jakaminen, uudelleenjulkaisu, alilisensointi tai kaupallinen ja ei-kaupallinen käyttö on **ehdottomasti kielletty** ilman tekijän etukäteen antamaa kirjallista lupaa.
