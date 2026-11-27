# Oppimisalustan frontend

Tämä hakemisto sisältää oppimisalustan Next.js-käyttöliittymän. Sovellus
hakee kurssit ja oppitunnit FastAPI-backendistä sekä tallentaa
edistymisen backendin kautta `data/progress.json`-tiedostoon.

## Vaatimukset

* Node.js 20.19 tai uudempi
* npm
* Käynnissä oleva backend osoitteessa `http://localhost:8000`

## Asennus

1. Siirry frontend-kansioon.

```bash
cd frontend
```

2. Asenna riippuvuudet.

```bash
npm install
```

3. Kopioi ympäristöesimerkki ja tarkista backendin osoite.

```bash
copy .env.local.example .env.local
```

PowerShellissä voit käyttää myös komentoa `Copy-Item`.

## Kehityspalvelin

Käynnistä frontend:

```bash
npm run dev
```

Avaa selain osoitteessa `http://localhost:3000`.

Käynnistä backend erillisessä terminaalissa:

```bash
cd ../backend
uvicorn main:app --reload
```

Backend vastaa osoitteessa `http://localhost:8000` ja sen Swagger UI on
osoitteessa `http://localhost:8000/docs`.

## Tarkastukset

```bash
npm run lint
npm run typecheck
npm run build
```

## Rakenne

* `app/` sisältää Next.js:n App Router -sivut ja layoutit.
* `components/` sisältää käyttöliittymäkomponentit.
* `contexts/` sisältää kielen ja teeman React-kontekstit.
* `lib/` sisältää API-kutsut, tyypit ja apufunktiot.

Tarkempi suunnitelma on dokumentaatiorepositoriossa tiedostossa
`06-opiskelu-ja-luennot/03-frontend-react-nextjs/05-toteutussuunnitelma-frontend.md`.
