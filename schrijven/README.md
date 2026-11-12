# Schrijven A2 ExamenSimulatie

Een dependency-vrije oefensite voor het onderdeel **Schrijven A2** van het Nederlandse
inburgeringsexamen. Vier opdrachten, 40 minuten, nakijken met het **officiële
beoordelingsmodel van DUO**, en één JSON-bestand met al je antwoorden en scores dat je
aan een LLM geeft om je focusgebieden te laten bepalen.

## Starten

Open `index.html` in je browser, of:

```bash
python3 -m http.server 8000
# http://localhost:8000
```

Geen build, geen npm, geen framework.

---

# Deel 1 — De eisen (onderzocht op 9 november 2026)

## 1.1 Vorm van het examen

| Ding | Feit | Bron |
|---|---|---|
| Opdrachten | **4 schrijfopdrachten** | inburgeren.nl, Taalexamens |
| Tijd | **maximaal 40 minuten**, plus 15 minuten uitleg vooraf | examenreglement art. 9 lid 3 |
| Medium | **pen en papier**, geen computer | examenreglement art. 9 lid 3 |
| Pen | krijg je van DUO; je mag zelf **geen pen, papier, telefoon, horloge of boeken** meenemen | examenreglement, regels in de examenzaal |
| Meenemen | alleen een **geldig identiteitsbewijs** | examenreglement |
| Beoordeling | door **gecertificeerde beoordelaars**, niet door een computer | examenreglement art. 10 lid 3 |
| Uitslag | cijfer + geslaagd/niet geslaagd; **cesuur stelt de minister per examen vast** | examenreglement art. 10 lid 5 en 16 |
| Wachten op uitslag | in de praktijk **ongeveer 16 weken** (officieel: binnen 8 weken) | inburgeren.nl, Uitslag |
| Oefenexamens | **3 officiële oefenexamens** (pdf) + digitale oefenomgeving | inburgeren.nl, Oefenen |

De officiële oefenexamens zijn de enige betrouwbare afspiegeling van de echte opgaven.
Er zijn er drie, en ze zijn alle drie opgebouwd uit dezelfde vier opdrachtsoorten.

## 1.2 De vier opdrachtsoorten

Elk officieel oefenexamen heeft **één formulier en drie teksten**. De verdeling over de
drie teksten wisselt: soms twee e-mails en geen briefje, soms een korte tekst plus een
briefje.

| Soort | Wat je doet | Lengte | Wat er standaard bij staat |
|---|---|---|---|
| **Formulier** | persoonsgegevens + open velden invullen | korte velden, 1-2 zinnen per open vraag | "Vul het formulier in. Sommige gegevens moet u zelf bedenken." |
| **E-mail / brief** | verzoek, excuus, klacht, afspraak, vraag | 4-6 korte zinnen | Aan / Onderwerp / aanhef staan al gedrukt; jij schrijft de tekst |
| **Korte tekst** | stukje voor de wijkkrant over een alledaags onderwerp | **minimaal 3 zinnen** | "Schrijf in hele zinnen." + 3 vragen als hulp |
| **Briefje / bericht** | instructie aan collega, buur, oppas, school | 3-5 korte zinnen, 3 dingen | aanhef en afsluiting staan al gedrukt |

Terugkerende formuleringen in de officiële oefenexamens, en dus de moeite waard om te
herkennen:

- "Schrijf in hele zinnen."
- "Bedenk zelf waarom / wanneer / welke dag." (je moet dus **iets verzinnen**, niet
  alleen herhalen wat in de opdracht staat)
- "Schrijf minimaal drie zinnen op."
- "Schrijf drie dingen op."
- "Sommige gegevens moet u zelf bedenken." (verzin een adres, datum, telefoonnummer)

## 1.3 Het beoordelingsmodel (officieel, DUO)

Er zijn twee officiële modellen. Ze staan als pdf op duo.nl en zijn de basis van deze site.

**Formulier** — maximaal **7 punten**:

| Criterium | Score | Wat het betekent |
|---|---|---|
| Adequaatheid / begrijpelijkheid | 0-3 | 0 = onleesbaar of geen uitwerking · 1 = voorstelbaar maar onvolledig/onduidelijk · 2 = acceptabel · 3 = uitstekend |
| Spelling | 0-2 | 0 = nauwelijks leesbaar · 1 = gegevens correct, korte zinnen bijna altijd correct · 2 = vrijwel correct |
| Woordgebruik | 0-2 | 0 = alleen woorden uit de opdracht · 1 = eenvoudig, redelijk gevarieerd · 2 = gevarieerd |

**Vrij schrijven / correspondentie** — maximaal **10 punten**:

| Criterium | Score | Wat het betekent |
|---|---|---|
| Adequaatheid / begrijpelijkheid | 0-3 | als boven |
| Grammatica | 0-2 | 0 = veel fouten · 1 = redelijk wat fouten · 2 = nauwelijks/geen fouten |
| Spelling | 0-2 | als boven |
| Woordgebruik | 0-2 | als boven |
| Coherentie | 0-1 | 0 = geen samenhang · 1 = samenhang door en, maar, want, omdat en/of hij, zij, die, dat |

Twee regels die veel kandidaten niet kennen:

1. **Adequaatheid 0 → alle andere criteria worden ook 0.** Een tekst die niet als
   antwoord op de opdracht herkenbaar is, levert dus niets op, hoe mooi de zinnen ook zijn.
2. **Per opdracht is er een opdrachtspecifieke beoordeling** bovenop het algemene model:
   staan alle gevraagde punten erin? Onvolledig antwoorden kost direct punten.

Een examen van 1 formulier + 3 teksten is dus **maximaal 37 punten**. De officiële
cesuur is niet openbaar: de minister stelt die per examen vast. Platforms noemen
ongeveer **60-65%** van de punten als slaaggrens; deze site gebruikt **65% (24/37)** en
noemt dat expliciet een schatting.

**Spelling of grammatica?** Dezelfde fout telt één keer. Spelling gaat over hoe je een
woord schrijft (letters, d/t, -en, hoofdletters, de/het, een verkeerd gespelde
werkwoordsvorm). Grammatica gaat over de zin (woordvolgorde, plaats van het werkwoord,
een ontbrekend of verkeerd hulpwerkwoord). Een beoordelaar die "hij werk" onder spelling
én onder grammatica aftrekt, straft dezelfde fout dubbel. Daarom staat die regel expliciet
in de nakijkopdracht van deze site.

## 1.4 Eisen waar je tekst aan moet voldoen

Dit is de checklist die deze site ook gebruikt. Alles komt uit het beoordelingsmodel en
de opdrachtteksten van de drie oefenexamens.

**Altijd, elke opdracht**

- [ ] De aanhef en de afsluiting staan **al in de opdracht**. Neem ze letterlijk over en zet
      je eigen naam onder de groet. Verder niets.
- [ ] **Geen inleidende zin.** Geen *Ik hoop dat het goed met u gaat*, geen *Ik schrijf u
      deze brief omdat*. De eerste zin na de aanhef beantwoordt het eerste puntje.
- [ ] De tekst is leesbaar (op papier: duidelijk handschrift, geen doorhalingen waardoor
      het onleesbaar wordt).
- [ ] De tekst is in het **Nederlands**.
- [ ] De tekst is herkenbaar als antwoord op **deze** opdracht.
- [ ] **Elk** puntje uit de opdracht is beantwoord. Tel de puntjes na.
- [ ] Je schrijft in **hele zinnen**, geen losse woorden of pijltjes.
- [ ] Je houdt het kort: liever 5 goede zinnen dan 12 rommelige.

**Formulier**

- [ ] Alle persoonlijke gegevens zijn ingevuld, ook de verzonnen gegevens.
- [ ] Namen, adressen, postcodes en cijfers zijn correct gespeld.
- [ ] Open velden zijn met hele zinnen beantwoord, niet met één woord.
- [ ] Bij een keuzevraag is precies één optie aangekruist/gekozen.

**E-mail / brief**

- [ ] Aanhef overgenomen uit de opdracht: *Beste mevrouw Jansen,* / *Beste mevrouw/heer,* /
      *Hallo Farida,*
- [ ] Afsluiting met de groet uit de opdracht en je eigen naam: *Met vriendelijke groet,* /
      *Groetjes, [je naam]*
- [ ] Onderwerp past bij de inhoud.
- [ ] Alle 3-4 gevraagde punten staan erin, één per zin, in de volgorde van de opdracht.
- [ ] Je verzint zelf wat de opdracht van je vraagt (reden, datum, naam).

**Korte tekst**

- [ ] Minimaal **3 hele zinnen**.
- [ ] Meteen over het onderwerp, zonder inleiding.
- [ ] De drie hulpvragen zijn alle drie beantwoord.

**Briefje / bericht**

- [ ] Aanhef uit de opdracht en afsluiting met de groet (of de laatste zin) plus je naam.
- [ ] **Drie** dingen duidelijk genoemd, één per zin.
- [ ] Duidelijk wie wat moet doen.

## 1.5 Best practices

1. **Beantwoord de puntjes letterlijk en in dezelfde volgorde.** De beoordelaar zoekt ze
   op. Een punt dat je "vergat" is een punt weg.
2. **Verzin de ontbrekende gegevens.** "Bedenk zelf waarom" betekent: kies een reden en
   schrijf die op. Niet terugschrijven "dat weet ik niet".
3. **Gebruik vaste blokken.** Aanhef, afsluiting, "Ik wil graag ...", "Kan het ...?",
   "Alvast bedankt", "Met vriendelijke groet". Die kosten geen denktijd en leveren
   woordgebruik- en adequaatheidspunten op.
4. **Houd zinnen kort (ongeveer 8-12 woorden).** A2-schrijven is geen hogere kunst:
   korte, correcte zinnen scoren beter dan lange, half-correcte zinnen.
5. **Werkwoord op plaats 2.** *Morgen **bel** ik u.* Niet: *Morgen ik bel u.*
6. **Bijzin: werkwoord achteraan.** *... omdat ik **moet** werken.* Niet: *... omdat ik
   **moet** werken* op de verkeerde plek, en niet *omdat ik werk moet* zonder *-en*.
7. **Verbind zinnen** met *en, maar, want, omdat, daarna, daarom*. Dat is precies het
   coherentiepunt (0-1 per tekst).
8. **Tijdverdeling** (advies, 40 minuten): 4 min lezen en puntjes tellen · 8 min
   formulier · 21 min de drie teksten (7 per stuk) · 7 min controleren.
9. **Controleer in de laatste 7 minuten**: aanhef, afsluiting, namen, datums,
   werkwoordsvormen (-t, -en, -te/-de), hoofdletters, punt aan het eind.
10. **Oefen op papier.** Deze site laat je typen; het echte examen is met de hand. Je
    handschrift en je schrijftempo zijn een echt onderdeel van het risico.

**Zo kort mag het zijn** — opdracht: u wilt buren helpen, zeg dat u wilt helpen, wat u
kunt doen en wanneer.

```
Ik wil graag helpen!

Ik kan goed met computers helpen.

Ik heb tijd op zaterdag en zondag.
```

Drie zinnen, drie punten, nul inleiding. Dit is geen mager antwoord: zo hoort A2 te
lezen. Wie hier *Ik hoop dat alles goed gaat met u en uw familie* boven zet, schrijft
een zin waarin elk woord fout kan zijn en verdient er nul punten mee.

**Veelgemaakte fouten om actief te checken**

- ik-vorm vs. hij-vorm: *ik werk* / *hij werkt*
- verleden tijd: *ik werkte*, *wij werkten*, *ik maakte*, *wij maakten*
- voltooid deelwoord: *gewerkt*, *gemaakt*, *gegaan* (en *ik heb* vs *ik ben*)
- *de* of *het* bij woorden die je vaak gebruikt
- voorzetsels: *op school*, *naar de dokter*, *bij de gemeente*, *om 10 uur*
- getallen en datums voluit of consequent: *12 mei 2026*
- hoofdletters: namen, plaatsen, begin van een zin, *Ik* aan het begin
- geen Engelse woorden; geen emoji

**Niet doen**

- Een lange lap tekst schrijven bij een opdracht van 3 zinnen.
- Alleen steekwoorden of een opsomming zonder zinnen.
- De opdracht napraten in plaats van antwoorden.
- Een formulier half invullen ("vul ik later in" kan niet: je levert in één keer in).
- Tijd overhouden en niets controleren.

---

# Deel 2 — De site

## 2.1 Wat de simulatie doet

- Elke ronde trekt **4 opdrachten**: één formulier, één e-mail, één korte tekst, één
  briefje (uit een bank van 84 opdrachten, 21 per soort).
- Of kies **Het vaste moeilijke examen**: altijd dezelfde vier opdrachten, in de vorm en
  volgorde van de officiële oefenexamens (zie 2.8).
- **40 minuten** timer; bij 0 wordt automatisch ingeleverd.
- Je kunt vrij navigeren tussen de opdrachten; je antwoorden blijven bewaard.
- **Geen feedback tijdens het examen.**
- Na inleveren: **nakijken**. Drie routes, alle drie op dezelfde scorekaarten:
  1. **DeepSeek** (aanbevolen): één klik, de app stuurt de nakijkopdracht en vult de
     scores in (zie 2.2).
  2. **Een andere LLM**: *Kopieer LLM-opdracht* geeft een complete nakijkopdracht met je
     antwoorden, de officiële rubric en de regels. Het antwoord plak je terug (zie 2.3).
  3. **Zelf**: per opdracht vink je de eisen af en geef je per criterium een score,
     met de officiële omschrijving per score.
  De regel "adequaatheid 0 → rest 0" wordt in beide routes automatisch toegepast.
  Na de LLM kun je elke score nog met de hand bijstellen.
- Daarna: score, percentage, per criterium hoeveel je haalde (zwakste eerst), per
  opdracht je punten, en de **JSON-export**.
- Je voortgang per poging wordt lokaal bewaard (`localStorage`) en meegestuurd in de
  export, zodat een LLM je ontwikkeling ziet.

## 2.2 Automatisch nakijken (licentie of eigen sleutel)

Op het nakijkscherm zit een knop **Laat nakijken**. Die stuurt dezelfde nakijkopdracht
als hieronder naar een AI (`deepseek-chat`, temperatuur 0, JSON-modus) en vult de
scorekaarten met het antwoord. Er zijn twee routes, en het transport staat in
`../shared/ai.js`:

1. **Licentiesleutel** (betaald). De aanvraag gaat naar onze Worker, die de licentie bij
de verkoper controleert, het tegoed aftrekt en zelf het model kiest. Zie
`../worker/README.md`. Zonder licentieveld blijft deze route uit.
2. **Eigen DeepSeek-sleutel** (gratis). De browser belt `api.deepseek.com` rechtstreeks.

**Sleutel.** Je plakt je eigen DeepSeek API-sleutel in het veld. Die wordt in
`localStorage` van die browser bewaard en gaat alleen naar api.deepseek.com. Er staat
geen sleutel in deze repo en er is geen server die hem ziet. Met **Vergeet sleutel**
verwijder je hem. Kosten per examen: ongeveer 3.500 tokens in en 300 uit, dus minder
dan een cent.

**Limieten.** Met een licentie geldt het tegoed van de Worker (40 eenheden per maand).
Met je eigen sleutel geldt **geen limiet**: je betaalt DeepSeek zelf, dus de app remt
niets af. Een dubbelklik kost wel een tweede aanvraag; de knop staat daarom uit zolang
een aanvraag loopt.

De echte grens is dat elke gebruiker zijn eigen sleutel gebruikt. Zet dus nooit een
sleutel in de site zelf.

**CORS.** DeepSeek stuurt `Access-Control-Allow-Origin` terug voor de oorsprong die
meedoet, dus de browser mag rechtstreeks bellen. Getest vanaf `http://localhost:8000`.
Open de site daarom via de lokale server, niet als los bestand: sommige browsers
blokkeren `fetch` vanaf `file://`.

De nakijkopdracht is bewust streng geformuleerd, omdat twee losse LLM's anders net
verschillend scoren:

- **adequaatheid hangt aan de eisen**, niet aan smaak: alle eisen waar = minstens 2, en
  met een duidelijke, complete tekst 3; één eis mis = hoogstens 1.
- **elke fout telt één keer**, in één categorie (spelling of grammatica), met de grens
  hierboven.
- **geen bewijs, geen aftrek**: elke aftrek moet naar een aanwijsbaar woord of een
  aanwijsbare zin te herleiden zijn.
- **eisen zijn echte JSON-booleans**, geen strings. (DeepSeek stuurde eerst `"true"` als
  tekst; de import accepteert dat nu ook, maar de opdracht vraagt om `true`.)

**Foutmeldingen** die de app vertaalt: 401 = sleutel ongeldig, 402 = geen saldo,
429 = te veel aanvragen, netwerk = "kon DeepSeek niet bereiken".

Na het nakijken staat het ruwe antwoord van DeepSeek in het plakveld, zodat je kunt zien
wat het model deed en het met de hand kunt bijstellen. De score krijgt dan
`"bron": "llm"` (of `"gemengd"` als je daarna zelf nog iets aanpast), en de leesinstructie
voor je analyse-LLM zegt dat de scores gecontroleerd moeten worden.

## 2.3 Leren van deze poging (5-daags plan en leeropdracht)

Er zijn twee routes op het resultaatscherm:

1. **Maak een 5-daags plan** (knop, AI). De app stuurt je scores, je teksten en de
   rubric naar de Worker of je eigen sleutel, en toont een plan van vijf dagen van
   vijftien minuten: per dag wat je oefent, met je eigen zinnen. Kost één eenheid
   nakijktegoed. De opdracht staat in `../shared/ai.js` (`planPrompt`), zodat KNM
   en Lezen precies hetzelfde plan krijgen uit hun eigen fouten.
2. **Kopieer leeropdracht** (gratis). Zelfde analyse, maar als opdracht voor je
   eigen LLM, inclusief de JSON-blok-route om scores bij te stellen.

Hieronder gaat het over route 2.

Op het resultaatscherm staat **Kopieer leeropdracht**. Dat is een andere opdracht dan de
nakijkopdracht: geen cijfers geven, maar uitleggen wat het snelst punten oplevert.

De opdracht bevat:

- de rol ("mijn docent Nederlands, ik wil slagen") en het niveau: **A2, geen B1-grammatica**;
- één alinea over hoe het examen punten geeft, met de belangrijkste hefboom: *adequaatheid
  eerst, en adequaatheid 0 maakt de rest 0*;
- `prioriteit`: per criterium hoeveel punten je **liet liggen**, gesorteerd van veel naar
  weinig. Dat is de Volgorde van Leren;
- je eigen teksten, de eisen die je niet afvinkte, je scores en je notities;
- de officiële rubric, zodat de uitleg bij dezelfde lat blijft.

De LLM moet dan, in deze volgorde, geven: de 3 fixes die het meeste opleveren, bewijs uit
je eigen zinnen met correcties, maximaal 5 regels om te onthouden, een weekplan van
15 minuten per dag, en 5 oefeningen met de antwoorden achteraan.

**Als de LLM het niet eens is met een score** (dat gebeurt, en het is nuttig): de opdracht
eindigt met één JSON-blok met alleen de criteria die volgens de LLM anders moeten. Dat is
dezelfde vorm als de import hierboven. Dus: **Scores aanpassen** → plak het blok in
"Antwoord van de LLM" → **Verwerk scores** → **Bekijk resultaat**. De score, de balken, de
leeropdracht en de JSON-export rekenen daarna meteen opnieuw. Terug en weer heen telt niet
als nieuwe poging in de geschiedenis.

De app rekent de punten altijd opnieuw uit de criteria op; er zit geen tweede, verborgen
berekening in. Tel jezelf mee: 1 formulier (max 7) + 3 teksten (max 10) = 37, en per
criterium de som van de vier opdrachten.

## 2.4 Handmatig: LLM-opdracht kopiëren en plakken (rondje)

De knop **Kopieer LLM-opdracht** op het nakijkscherm maakt één tekst met:

- de rol en het niveau: beoordelaar Schrijven A2, ERK A2, geen B1-complexiteit belonen;
- dat de aanhef en de afsluiting al in de opdracht staan (overnemen + eigen naam) en dat
  A2 kort hoort te zijn: één idee per zin, ongeveer 8 woorden, woorden uit de opdracht;
- de examenvorm en het maximum van 37 punten;
- de **acht scoringsregels**, waaronder "adequaatheid 0 → al het andere 0", "beoordeel
  alleen wat er staat", "kort en correct verslaat lang en fout", en de uitleg dat de eis
  *Geen inleidende zin* false is zodra de tekst opent met een zin die geen puntje
  beantwoordt;
- de volledige officiële rubric met alle score-omschrijvingen;
- per opdracht: situatie, opdracht, gevraagde punten, eisen, jouw tekst, je metingen en
  welk profiel (formulier of tekst) met welke criteria;
- het **verplichte uitvoerformaat** met de echte id's van jouw vier opdrachten.

Het antwoord van de LLM ziet er zo uit, en dat is precies wat de app weer inleest:

```json
{
  "scores": [
    {
      "id": "mail-02",
      "criteria": { "adequaatheid": 2, "grammatica": 1, "spelling": 2, "woordgebruik": 1, "coherentie": 1 },
      "eisen": [true, true, false, true, true, true],
      "notitie": "Het tweede punt (hoe lang u thuis blijft) ontbreekt."
    }
  ]
}
```

Wat de import verdraagt (zodat je niet hoeft te knippen en plakken):

- tekst om de JSON heen en markdown-fences ```json ... ```;
- een top-level array in plaats van `{"scores": [...]}`;
- `criteria` als object, of als array `[{"criterium": "...", "score": 2}]`;
- `eisen` als booleans, of als objecten met `afgevinkt` (zoals de export ze schrijft);
- `id` of `nummer` om de opdracht te herkennen;
- scores buiten bereik worden afgekapt, kommagetallen afgerond, onbekende criteria genegeerd.

Na het verwerken zie je in de statusbalk hoeveel opdrachten en criteria zijn gevuld en
wat de score is. Klopt er iets niet, dan pas je het met de hand aan in dezelfde kaarten.
De regel "adequaatheid 0 → rest 0" geldt ook voor LLM-scores.

## 2.5 De JSON-export (voor je LLM)

Knop **Download JSON** op het resultaatscherm schrijft
`schrijven-a2-<datum>-<tijd>.json` naar je computer. **Kopieer JSON** zet hetzelfde op je
klembord.

Het bestand is bewust gebouwd om door een LLM gelezen te worden:

| Veld | Waarom het erin zit |
|---|---|
| `leesinstructie_voor_llm` | een kant-en-klare opdracht: herbeoordeel, citeer fouten, classificeer fouttype, geef 3-5 focusgebieden + oefenplan + 10 nieuwe opdrachten |
| `examen` | vorm, duur, puntmaximum, de echte regels en de bronnen |
| `beoordelingsmodel` | alle criteria met alle officiële score-omschrijvingen, zodat de LLM dezelfde lat gebruikt |
| `score` | totaal, percentage, en per criterium score/max/percentage + advies |
| `opdrachten[]` | per opdracht: de volledige opdrachttekst, de eisen met afgevinkt/nee, jouw tekst (bij een formulier ook per veld), metingen (woorden, zinnen, aanhef/afsluiting aanwezig), je scores en je notitie |
| `geschiedenis` | de laatste 20 pogingen met totaal en per criterium |

Voorbeeld van een prompt bij het bestand:

> Dit is mijn poging voor het inburgeringsexamen Schrijven A2. Volg
> `leesinstructie_voor_llm`. Ik wil vooral weten welke fouten ik steeds opnieuw maak.

De zelfbeoordeling is **jouw** score, geen score van DUO. Daarom zegt de leesinstructie
expliciet dat de LLM alles opnieuw moet controleren. Dat is met opzet: een LLM die jouw
cijfer overneemt, leert je niets.

## 2.6 Bestanden

| Bestand | Doel |
|---|---|
| `index.html` | de vier schermen: start, examen, nakijken, resultaat |
| `styles.css` | vormgeving, gegenereerd uit `shared/site.css` + `shared/schrijven.css` in de map erboven, met `shared/build.sh` |
| `tasks.js` | 84 opdrachten, het vaste examen, de rubric en de examenblauwdruk |
| `app.js` | timer, invoer, nakijken (zelf, plakken, licentie of eigen sleutel), score, JSON-export |
| `../shared/ai.js` | het enige bestand dat een AI aanroept: licentie via de Worker, of de eigen DeepSeek-sleutel |
| `check.js` | zelftest van de opdrachtenbank (`node check.js`) |
| `README.md` | dit bestand |

## 2.7 Zelftest

```bash
node check.js
```

Controleert: unieke id's en titels, geldige soorten, minimaal 8 velden per formulier,
minimaal 3 inhoudelijke eisen per tekst, minimaal 20 opdrachten per soort,
aanhef/afsluiting/e-mailadres aanwezig, geen dubbele eisen, of de rubric optelt tot
37 punten, en of het vaste examen dezelfde samenstelling en hetzelfde maximum heeft.

## 2.8 Het vaste moeilijke examen

De knop **Het vaste moeilijke examen** start altijd hetzelfde examen: één formulier plus
drie teksten, 40 minuten, 37 punten. Het staat in `tasks.js` als `VASTE_EXAMENS` en
gebruikt dezelfde taken, rubric en nakijkroutes als de rest; de opdrachten zitten ook in
de bank, dus ze kunnen in een willekeurig examen terugkomen.

Het is moeilijker dan de gemiddelde bankopdracht, maar blijft A2:

| Opdracht | Wat het moeilijker maakt |
|---|---|
| 1. Formulier sportschool | 12 velden, twee keuzes, twee open velden met een dubbele vraag, en gegevens die u zelf moet bedenken |
| 2. E-mail twee keer betaald | vier punten in plaats van drie, met een zelf te bedenken datum en bedrag, en een concreet verzoek (terugbetaling en reactietermijn) |
| 3. Wijkkrant verkeer | vier vragen in plaats van drie, waaronder wat u zelf al doet |
| 4. Briefje loodgieter | vier dingen in plaats van drie, met een zelf te bedenken tijd en verstopplek |

De vorm volgt de officiële oefenexamens: "Sommige gegevens moet u zelf bedenken",
"Schrijf in hele zinnen", "Schrijf minimaal drie zinnen" en "Bedenk zelf ...". Er zijn
geen voorbeeldantwoorden, want een schrijfopdracht heeft er geen; nakijken gaat met
dezelfde rubric en dezelfde LLM-opdracht als de rest.

---

# Bronnen (geraadpleegd op 9 en 10 november 2026)

- **DUO / inburgeren.nl — Taalexamens**: Schrijven A2 = 4 opdrachten, pen en papier,
  40 minuten.
  https://www.inburgeren.nl/examen-doen/inhoud-taalexamens-a2-b1-b2.jsp
- **DUO / inburgeren.nl — Oefenen**: de drie officiële oefenexamens Schrijven A2.
  https://www.inburgeren.nl/examen-doen/oefenen.jsp
- **DUO — Oefenexamen A2 Schrijven 1, 2 en 3** (pdf's; vorm, opdrachtsoorten en
  standaardformuleringen).
  https://www.inburgeren.nl/images/oefenexamen-schrijven-1.pdf
  https://www.inburgeren.nl/images/oefenexamen-schrijven-2.pdf
  https://www.inburgeren.nl/images/oefenexamen-schrijven-3.pdf
- **inburgeringprep.com — Oefenexamens Schrijven A2 nr. 102 en 104** (soevereine
  oefenexamens in dezelfde vorm: formulier, twee berichten en een stukje voor de
  wijkkrant; formuleringen als "Bedenk zelf hoe laat" en "maximale score").
  https://inburgeringprep.com/oefenexamen/schrijven/102
  https://inburgeringprep.com/oefenexamen/oefenexamen-inburgering-a2-schrijven-104.pdf
- **Ad Appel Taaltrainingen — Schrijfvaardigheid A2, oefentoets 2** (vier opdrachten met
  "maximale score" per opdracht; gebruikt voor de opbouw en de toon).
  https://www.oefenexamensinburgering.nl/_files/ugd/be6a50_fd09e8dfbca8469f81c324f98d09c7af.pdf
- **Learn Dutch With AI — Mock Exam 6, Schrijven A2** (extra voorbeelden van dezelfde
  opdrachtsoorten; gebruikt als controle op de vorm, niet overgenomen).
  https://learn-dutch-with-ai.com/exams/mock-exam-6-schrijven-a2/
- **DUO — Examenreglement** (art. 9 lid 3: papier, 40 minuten; art. 10 lid 3:
  beoordeling door gecertificeerde beoordelaars; art. 10 lid 5: cesuur door de minister;
  art. 16: cijfer en uitslag; regels over hulpmiddelen).
  https://www.inburgeren.nl/images/examenreglement.pdf
- **DUO — Beoordelingsmodel Schrijven A2, formulier** (pdf).
  https://duo.nl/zakelijk/images/beoordelingsmodel-schrijven-a2-formulieren.pdf
- **DUO — Beoordelingsmodel Schrijven A2, vrij schrijven en correspondentie** (pdf).
  https://duo.nl/zakelijk/images/beoordelingsmodel-vrij-schrijven-en-correspondentie.pdf
- **DUO — Examens onder de Wet inburgering 2021** (waar de twee modellen gepubliceerd
  staan).
  https://duo.nl/zakelijk/inburgering-ketenpartners/wet-inburgering-2021/examens-wi2021/examen-doen-wi2021.jsp
- **DUO / inburgeren.nl — Uitslag examen** (uitslag Schrijven A2 in de praktijk ongeveer
  16 weken).
  https://www.inburgeren.nl/examen-doen/uitslag.jsp

## Waar de opdrachten vandaan komen

De 84 opdrachten zijn zelf geschreven. De **vorm** komt uit de drie officiële oefenexamens:
één formulier plus drie teksten per examen, dezelfde soorten aanhef/afsluiting, dezelfde
standaardformuleringen ("Schrijf in hele zinnen", "Bedenk zelf waarom", "Sommige gegevens
moet u zelf bedenken"). De **onderwerpen** zijn de scenario's die in de oefenexamens en in
voorbereidingsmateriaal terugkomen: afspraak verzetten, ziekmelden, dienst ruilen, boek
lenen, vrije dag vragen, klacht over een product, formulier van de gemeente, wijkkrant,
briefje voor een collega of oppas.

Ik heb geprobeerd r/learndutch te lezen voor extra voorbeelden, maar Reddit blokkeert deze
omgeving (HTTP 403 op de API, op old.reddit en via een reader-proxy). De genoemde
onderwerpen komen dus niet uit een scrape; ze komen uit de officiële examens en uit de
patronen die in voorbereidingsmateriaal steeds terugkomen. De officiële oefenexamens zijn
auteursrechtelijk beschermd en zijn niet overgenomen: alleen de vorm is gebruikt.

## Beperkingen

- Geen officieel DUO-examen. De opdrachten zijn zelf geschreven in de stijl van de
  officiële oefenexamens, niet overgenomen.
- Je typt hier; het echte examen is met pen op papier. Oefen dus ook op papier.
- De score is **je eigen** score volgens het officiële model, geen oordeel van DUO.
- 65% (24/37) is een vuistregel, niet de officiële cesuur. Die stelt de minister per
  examen vast en is niet openbaar.
- De samenstelling is altijd 1 formulier + 3 teksten. Het echte examen kan twee e-mails
  hebben in plaats van een briefje; de criteria blijven gelijk.
- De eis **Geen inleidende zin** is een oefenregel, geen officiële aftrek. DUO straft een
  inleidende zin niet apart af; hij kost alleen ruimte en levert geen punt op. Hier telt
  hij als eis, omdat een inleiding op A2 bijna altijd fouten bevat en toch nul punten
  waard is.
- De opmerking *de aanhef en afsluiting staan al in de opdracht* komt uit de praktijk van
  de oefenexamens: daar staat de briefvorm al voorgedrukt. Bij een vrije opdracht hoort de
  kandidaat zelf een aanhef te kiezen; die eis blijft dus staan.
- Namen en bedragen in de opdrachten zijn verzonnen voorbeelden.
- DeepSeek-nakijken vraagt je eigen API-sleutel en een internetverbinding. Zonder sleutel
  werkt de rest van de site gewoon; gebruik dan de kopieer-en-plak-route.
- Zonder licentie betaalt elke gebruiker zijn eigen DeepSeek-gebruik, zonder limiet.
