# ExamenSimulatie, inburgering A2

Oefenexamens voor het Nederlandse inburgeringsexamen. Eén portal, meerdere onderdelen.

**Open `index.html`** in je browser, of `python3 -m http.server 8000` en ga naar
http://localhost:8000. Geen build, geen npm, geen framework.

## Onderdelen

| Onderdeel | Map | Status |
|---|---|---|
| KNM | `knm/` | klaar |
| Schrijven A2 | `schrijven/` | klaar |
| Lezen A2 | `lezen/` | klaar |
| Luisteren A2 | geen | nog niet gebouwd |
| Spreken A2 | `spreken/` | alleen onderzoek (`README.md`) |

Live: https://lillelilje.github.io/examen-oefenen/ (portal + Lezen + Schrijven, uit deze
repo). KNM staat op https://lillelilje.github.io/knm-examensimulatie/ en houdt zijn
eigen repo.

## Terug naar de portal

Elk examen heeft een witte bovenbalk met `← Alle examens`.

- `lezen/` en `schrijven/` linken naar `../`: de portal staat op de Pages-root van
deze repo, dus dat werkt op localhost, met `file://` en live.
- `knm/` staat in een eigen repo en dus op een eigen Pages-root, waar geen portal
boven ligt. Daarom linkt die bovenbalk naar de absolute URL van de portal.

## Vormgeving delen

De gedeelde bronnen staan één keer in `shared/`:

- `shared/site.css`: het hele systeem: tokens, header, panelen, knoppen, examen- en
  resultaatschermen.
- `shared/schrijven.css`: alleen wat het schrijfexamen extra nodig heeft
  (formuliervelden, gelinieerd schrijfvlak, rubric, LLM-nakijken).
- `shared/lezen.css`: alleen wat het leesexamen extra nodig heeft (tekst links,
  vragen rechts, tabellen in de tekst).
- `shared/ai.js`: het enige bestand dat een AI aanroept (nakijken en het 5-daagse
  plan). Wordt door dezelfde build naar `knm/`, `lezen/` en `schrijven/` gekopieerd,
  zodat elk onderdeel los kan blijven werken.
- `shared/build.sh`: schrijft de css naar `knm/styles.css`, `schrijven/styles.css`
  en `lezen/styles.css`, en kopieert `shared/ai.js` naar dezelfde drie mappen.

De apps houden dus hun eigen `styles.css` en `ai.js`, omdat `knm/` los gedeployed
wordt uit zijn eigen repo; een `../../shared`-link zou daar stukgaan. Na een wijziging in `shared/`:

```bash
./shared/build.sh
```

De portal linkt `shared/site.css` direct, zonder kopie.

## Een onderdeel toevoegen

1. Maak de map met een `index.html` die `styles.css` en `ai.js` linkt, en voeg een
   regel toe aan `shared/build.sh` die `shared/site.css` + de eigen css van dat deel
   daarheen schrijft en `shared/ai.js` erheen kopieert.
2. In de portal: verplaats de kaart van "Nog niet beschikbaar" naar "Nu te oefenen",
   zet er een `href` op en haal `class="part is-locked"` weg.

## Betaalmuur

De gratis onderdelen (KNM, Lezen, en Schrijven zonder AI-nakijken) zijn statische
bestanden en hebben geen server. Het betaalde deel is **AI-nakijken**, en dat gaat via
een eigen Worker met een licentie.

```
site (statisch) ──licentiesleutel──▶ worker/ ──▶ OpenRouter ──▶ model
                                       │
                                       └── Polar: is deze licentie geldig?
```

- **Betalen** doet de verkoper (Polar, merchant of record, dus ook btw en facturen).
  Die stuurt de licentiesleutel per e-mail. De site ziet nooit een order of een klant.
- **Geldigheid** vraagt de Worker per aanvraag aan de verkoper. Geen webhook, geen
eigen database, geen cron. Een refund of een handmatige verlenging werkt meteen.
- **Tegoed** is het enige dat wij bijhouden: één getal per licentie per maand in KV
  (Cloudflare). Zie `worker/README.md`.
- **Geheimen** staan alleen in de Worker, nooit in iets wat een browser downloadt.
  Er is dus niets om te versleutelen: wat de browser kan ontsleutelen, kan de
  gebruiker ook.

De apps zelf weten niets van betalingen. Ze roepen `AI.ask()` aan uit `shared/ai.js`,
met een licentiesleutel of met de eigen DeepSeek-sleutel van de gebruiker.

Openstaande punten staan in `TODO.md`.
