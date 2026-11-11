# Lezen A2 ExamenSimulatie

Een dependency-vrije oefensite voor het onderdeel **Lezen A2** van het Nederlandse
inburgeringsexamen. Eén moeilijk oefenexamen: 25 meerkeuzevragen over negen korte
teksten, 65 minuten, met uitleg per antwoord.

## Starten

Open `index.html` in je browser, of:

```bash
python3 -m http.server 8000
# http://localhost:8000/lezen/
```

Geen build, geen npm, geen framework.

---

# Deel 1 — De eisen (onderzocht op 10 november 2026)

## 1.1 Vorm van het examen

| Ding | Feit | Bron |
|---|---|---|
| Vragen | **25 meerkeuzevragen** | inburgeren.nl, Taalexamens; oefenexamens |
| Tijd | **maximaal 65 minuten**, plus 15 minuten uitleg vooraf | inburgeren.nl; inburgering.app |
| Medium | **computer**, op een examenlocatie van DUO | inburgeren.nl |
| Teksten | **9 tot 10 korte teksten**, 2 tot 4 vragen per tekst | oefenexamens Lezen A2 |
| Antwoorden | **drie antwoorden per vraag** (A, B, C) | oefenexamens; KNM-vorm |
| Woordenboek | **niet toegestaan** | oefenexamens |
| Beoordeling | automatisch; één punt per goede vraag | vorm van het examen |
| Slaaggrens | **18 of 19 van de 25**; de officiële cesuur is niet openbaar | zie 1.3 |
| Oefenexamens | **4 online oefenexamens** van DUO | inburgeren.nl, Oefenen |

Het examen is adaptief noch digitaal-streng: je krijgt alle 25 vragen, kunt ze
overslaan en later teruggaan, en ziet je score pas aan het einde.

## 1.2 Wat voor teksten en vragen

De teksten komen uit het dagelijks leven. In de oefenexamens en in het
voorbereidingsmateriaal komen deze soorten steeds terug:

| Soort | Voorbeeld |
|---|---|
| **Brief van een instantie** | ziekenhuis, gemeente, woningcorporatie, verzekering |
| **E-mail of bericht** | werk, school, familie, collega |
| **Folder of mededeling** | winkel, sportschool, buurthuis, station |
| **Overzicht of tabel** | openingstijden, cursusrooster, prijzen, dienstregeling |
| **Formulier** | melding, aanvraag, inschrijving (met ingevulde velden) |
| **Artikel** | wijkkrant, nieuwsbericht over de buurt |
| **Advertentie** | vacature, woning, cursus |

De vragen gaan bijna altijd over **één feit**: een tijd, datum, prijs, persoon,
plaats, reden of regel. Soms vragen ze naar het doel van de tekst of naar hoe
iemand zich voelt. Onderzoek naar 75 oefenvragen vond dat het antwoord in meer
dan de helft van de gevallen bijna letterlijk in de tekst staat; de rest is
anders verwoord (inburgeringscursus.nl, Examenonderzoek A2).

De makkelijke fout is denken dat je alles moet begrijpen. De moeilijkheid zit in
de **afleiders**: die staan vaak ook letterlijk in de tekst, maar horen bij een
andere vraag of een andere alinea. Daarom is dit oefenexamen expres lastiger:

- langere teksten met meer getallen, data en uitzonderingen;
- vragen waarbij je twee regels moet combineren (bijvoorbeeld leeftijd + prijs,
  of datum + vakantierooster);
- sommen met bedragen;
- één vraag over een melding waarbij het formulier één vakje heeft, maar de
  toelichting eronder meer informatie geeft;
- afleiders die letterlijk in de tekst staan, maar niet het antwoord zijn.

## 1.3 De slaaggrens

DUO publiceert de cesuur niet; de minister stelt die per examen vast. Oefenmateriaal
noemt **18 van de 25** (Ad Appel, inburgering.org) of **19 van de 25**
(inburgeringprep, Nedles). Deze site gebruikt **18/25** en noemt dat expliciet een
oefennorm, geen officieel oordeel. Wie zeker wil zitten, mikt op 20 of meer.

## 1.4 Zo lees je een A2-tekst het snelst

1. **Lees eerst de situatiezin.** Wie krijgt de tekst, en wat voor tekst is het?
2. **Lees de vraag.** Welk feit zoek je: tijd, persoon, prijs, reden, regel?
3. **Zoek gericht in de tekst.** Namen, datums, bedragen en kopjes zijn je
   wegwijzers.
4. **Controleer de hele zin.** Het antwoord staat vaak in dezelfde zin als het
   woord uit de vraag, maar met een kleine uitzondering ("behalve op zondag").
5. **Kijk uit voor dubbele informatie.** Bij een tabel geldt de rij én de
   voorwaarde eronder (leeftijd, lidmaatschap, tijdvak).
6. **Raden is beter dan leeg laten.** Er is geen aftrek voor een fout antwoord.
7. **Tijd:** 65 minuten voor 25 vragen is ongeveer 2,5 minuut per vraag. Houd
   vijf minuten over om je antwoorden te controleren.

---

# Deel 2 — De site

## 2.1 Wat de simulatie doet

- Start één vast examen: **9 teksten, 25 vragen, 65 minuten**. Er is nu één
  examen; de app is al gebouwd voor meer (zie 2.4).
- **Eén tekst per scherm**, met de tekst links en de vragen rechts — zoals het
  echte examen op de computer.
- Antwoorden kun je altijd wijzigen; je kunt teksten overslaan en later
  teruggaan via **Vorige/Volgende** of het tekstoverzicht.
- **Geen feedback tijdens het examen.** Bij 0 seconden wordt automatisch
  ingeleverd, met een melding.
- Na inleveren: score, geslaagd/gezakt, marge, tijd, onbeantwoorde vragen, per
  tekst hoeveel je goed had (zwakste eerst), en **uitleg per vraag** met je eigen
  antwoord, het juiste antwoord en waarom de andere antwoorden fout zijn.
- **Alleen fouten** filtert de uitleg.
- **Extra hulp (betaald):** met een licentiesleutel maak je op het resultaatscherm een
  **5-daags plan** van je eigen fouten. Eén eenheid nakijktegoed. De opdracht staat in
  `../shared/ai.js`, zodat KNM, Lezen en Schrijven hetzelfde plan maken.
- De volgorde van de antwoorden wordt per poging geschud, zodat je niet op
  letter kunt gokken.

## 2.2 De opdrachtenbank

Alles staat in `questions.js`:

| Veld | Betekenis |
|---|---|
| `EXAMENS[]` | één of meer examens; elk met `id`, `naam`, `uitleg` en `teksten[]` |
| `teksten[].soort` | `brief`, `email`, `folder`, `tabel`, `formulier`, `mededeling`, `artikel` of `bericht` |
| `teksten[].situatie` | de zin boven de tekst: wie leest dit en waarom |
| `teksten[].body[]` | alinea's als string, of `{ tabel: { kop, rijen } }` |
| `vragen[].vraag` | de vraag |
| `vragen[].opties` | precies drie antwoorden |
| `vragen[].juist` | index (0, 1 of 2) van het juiste antwoord in `opties` |
| `vragen[].uitleg` | waarom het juiste antwoord klopt en de andere niet |

De app schudt de drie antwoorden bij elke poging. `juist` blijft naar het juiste
antwoord wijzen.

## 2.3 Bestanden

| Bestand | Doel |
|---|---|
| `index.html` | de drie schermen: start, examen, resultaat |
| `styles.css` | vormgeving, gegenereerd uit `shared/site.css` + `shared/lezen.css` in de map erboven, met `shared/build.sh` |
| `questions.js` | het examen, de tekstsoorten en de examenblauwdruk |
| `app.js` | timer, tekstweergave, antwoorden, score en uitleg |
| `check.js` | zelftest van het examen (`node check.js`) |
| `README.md` | dit bestand |

## 2.4 Een tweede examen toevoegen

1. Kopieer een object in `EXAMENS` in `questions.js` en geef het een nieuwe `id`
   en `naam`.
2. Zorg voor **9 of 10 teksten** en **precies 25 vragen**, met per tekst 2 tot 4
   vragen.
3. Draai `node check.js`. De zelftest controleert id's, soorten, tabelvormen,
   drie unieke antwoorden per vraag, de juiste index en de uitleg.
4. De app kiest willekeurig een van de examens bij **Start**. De knop
   **Nieuw examen** doet hetzelfde.

## 2.5 Zelftest

```bash
node check.js
```

Controleert: unieke examen-, tekst- en vraag-id's, geldige tekstsoorten,
minimaal 9 en maximaal 10 teksten, 25 vragen, 2 tot 4 vragen per tekst, geldige
tabellen, precies drie unieke antwoorden per vraag, een geldige `juist`-index,
uitleg bij elke vraag, minimaal zes verschillende tekstsoorten, en of de duur en
de slaaggrens kloppen.

---

# Bronnen (geraadpleegd op 10 november 2026)

- **DUO / inburgeren.nl — Taalexamens**: Lezen A2 = 25 meerkeuzevragen, 65
  minuten, op de computer.
  https://www.inburgeren.nl/examen-doen/inhoud-taalexamens-a2-b1-b2.jsp
- **DUO / inburgeren.nl — Oefenen**: de vier online oefenexamens Lezen A2.
  https://www.inburgeren.nl/examen-doen/oefenen.jsp
- **inburgeringprep.com — Oefenexamen Lezen A2 nr. 103** (volledig oefenexamen:
  9 teksten, 25 vragen, antwoordsleutel met uitleg; gebruikt voor de vorm,
  niet overgenomen).
  https://inburgeringprep.com/oefenexamen/oefenexamen-inburgering-a2-lezen-103.pdf
- **Ad Appel Taaltrainingen — Oefentoets 2 Leesvaardigheid A2** (10 teksten, 25
  vragen, "u moet 18 vragen goed beantwoorden", "lees eerst de vraag").
  https://www.inburgering.nl/_files/ugd/be6a50_330555e88d9246ae97bdb284eec6d769.pdf
- **Inburgering.org — Zo oefen je voor het examen Lezen op A2** (65 minuten,
  vraagsoorten en leesstrategie).
  https://inburgering.org/nl/exam-info/a2-reading-guide
- **Inburgering.app — Hoe werkt het examen Lezen op A2, B1 en B2?** (15 minuten
  uitleg vooraf, 65 minuten, computer).
  https://inburgering.app/exam-info/reading-exam-guide/?lang=nl
- **Inburgeringscursus.nl — Examenonderzoek A2** (codering van 75 oefenvragen:
  antwoord staat vaak bijna letterlijk in de tekst).
  https://inburgeringscursus.nl/nl/exam-research/a2
- **Nedles.nl — Het inburgeringsexamen** (noemt 19 van de 25 goed als grens).
  https://nedles.nl/examentraining-nederlands/inburgering-2/inbex-uitleg/

## Waar de teksten vandaan komen

De negen teksten en 25 vragen zijn zelf geschreven. De **vorm** komt uit de
oefenexamens en de examenopzet: één tekst per scherm, een situatiezin boven de
tekst, twee tot vier vragen per tekst, drie antwoorden, en een uitleg die ook de
afleiders noemt. De **onderwerpen** zijn de scenario's die in oefenmateriaal
steeds terugkomen: huisartsenpraktijk, werktijden, supermarktbezorging,
buurthuiscursussen, gemeentemelding, sportschool, wijkkrant, verhuurder en
familiebericht.

De officiële oefenexamens zijn auteursrechtelijk beschermd en zijn niet
overgenomen: alleen de vorm is gebruikt.

## Beperkingen

- Geen officieel DUO-examen. De vragen zijn zelf geschreven, geen echte
  examenvragen.
- **18/25 is een oefennorm**, niet de officiële cesuur. Bronnen noemen 18 of 19.
- Er is nu **één** examen. Het echte examen heeft ook langere en visuelere
  teksten (folders met plaatjes, formulieren met vakjes); deze simulatie gebruikt
  tekst en tabellen.
- De antwoorden worden geschud. Op het echte examen staat het juiste antwoord
  niet altijd op dezelfde letter, maar de volgorde is daar wel vast per examen.
- Geen woordenboek, geen audio: dit is alleen Lezen A2.
