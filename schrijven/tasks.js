/*
 * Opdrachtenbank Schrijven A2: gebaseerd op de officiële oefenexamens van DUO
 * (inburgeren.nl, 3 oefenexamens A2 Schrijven) en de officiële beoordelings-
 * modellen van DUO/Ministerie van SZW. Geen echte examenvragen.
 *
 * Soorten opdrachten in het echte examen: formulier, e-mail/brief,
 * korte tekst en briefje/bericht.
 */

const RUBRIEK = {
  formulier: {
    naam: "Formulier",
    max: 7,
    criteria: ["adequaatheid", "spelling", "woordgebruik"],
  },
  tekst: {
    naam: "Vrij schrijven / correspondentie",
    max: 10,
    criteria: ["adequaatheid", "grammatica", "spelling", "woordgebruik", "coherentie"],
  },
};

/* De twee DUO-modellen verschillen alleen bij spelling 1: het formulier
   noemt persoonlijke gegevens, de vrije tekst niet. */
const SPELLING_SCORES = {
  formulier: {
    0: "De tekst bevat zoveel spelfouten dat deze slechts met zeer veel moeite te lezen is en/of voldoet niet aan de beschrijving van 1 punt.",
    1: "Persoonlijke gegevens zijn correct gespeld. Woorden en korte zinnen over alledaagse onderwerpen zijn (bijna altijd) correct overgeschreven. De spelling van korte woorden is fonetisch redelijk correct.",
    2: "De spelling is vrijwel correct. Eventuele spelfouten tasten de begrijpelijkheid niet aan.",
  },
  tekst: {
    0: "De tekst bevat zoveel spelfouten dat deze slechts met zeer veel moeite te lezen is en/of voldoet niet aan de beschrijving van 1 punt.",
    1: "Woorden en korte zinnen over alledaagse onderwerpen zijn (bijna altijd) correct overgeschreven. De spelling van korte woorden is fonetisch redelijk correct.",
    2: "De spelling is vrijwel correct. Eventuele spelfouten tasten de begrijpelijkheid niet aan.",
  },
};

const CRITERIA = {
  adequaatheid: {
    naam: "Adequaatheid / begrijpelijkheid",
    max: 3,
    advies:
      "Beantwoord elk puntje van de opdracht, ook als je twijfelt. Een half antwoord is een half punt.",
    specifiek:
      "De tekst wordt beoordeeld als acceptabel (2 punten) wanneer alle opdrachtspecifieke eisen zijn vervuld. 3 punten alleen voor een uitstekende uitwerking.",
    ijkpunten:
      "Richtlijn: alle eisen = 2 (acceptabel); 3 alleen bij een uitstekende tekst; één eis mist = 1.",
    scores: {
      0: "De tekst is niet leesbaar en/of herkenbaar als uitwerking van de opdracht, of er is helemaal geen uitwerking.",
      1: "De tekst is een voorstelbaar, maar geen voor de hand liggend antwoord op de vraag en/of het antwoord is onvolledig of niet helemaal duidelijk.",
      2: "De tekst is acceptabel en herkenbaar als uitwerking van de opdracht.",
      3: "De tekst is een uitstekende uitwerking van de opdracht.",
    },
  },
  grammatica: {
    naam: "Grammatica",
    max: 2,
    advies:
      "Oefen de woordvolgorde: werkwoord op plaats 2, en de persoonsvorm achteraan in een bijzin met omdat of als. Na want blijft de gewone volgorde: want ik heb.",
    ijkpunten:
      "Richtlijn: 2 = 0-1 kleine fout, 1 = 2-4 fouten, 0 = 5+ of onbegrijpelijk.",
    scores: {
      0: "De tekst bevat veel grammaticale fouten.",
      1: "De tekst bevat redelijk wat grammaticale fouten.",
      2: "De tekst bevat nauwelijks of geen grammaticale fouten.",
    },
  },
  spelling: {
    naam: "Spelling",
    max: 2,
    advies:
      "Leer de spellingsregels die het vaakst fout gaan: ik-vorm, hij-vorm met -t, verleden tijd, en woorden met -d of -t aan het eind.",
    ijkpunten:
      "Richtlijn: 2 = 0-1 kleine fout, 1 = 2-4 fouten, 0 = 5+ of onleesbaar.",
    scores: SPELLING_SCORES.tekst,
    scores_per_profiel: SPELLING_SCORES,
  },
  woordgebruik: {
    naam: "Woordgebruik",
    max: 2,
    advies:
      "Gebruik woorden uit de opdracht en leer vaste blokken: een afspraak maken, vrije dagen opnemen, iets terugbrengen, met vriendelijke groet.",
    ijkpunten:
      "Richtlijn: 1 is normaal op A2 (eenvoudig en passend). 2 alleen bij opvallend gevarieerd woordgebruik.",
    scores: {
      0: "Het woordgebruik omvat vrijwel alleen woorden uit de opdracht en/of sluit niet aan bij de opdracht.",
      1: "Het woordgebruik is eenvoudig, redelijk gevarieerd en sluit aan bij de opdracht.",
      2: "Het woordgebruik is gevarieerd en sluit aan bij de opdracht.",
    },
  },
  coherentie: {
    naam: "Coherentie (samenhang)",
    max: 1,
    advies:
      "Verbinde je zinnen met en, maar, want, omdat, daarna, daarom. Gebruik ook hij/zij/die/dat zodat de lezer je volgt.",
    ijkpunten:
      "1 = minstens één voegwoord of verwijswoord dat de zinnen verbindt.",
    scores: {
      0: "Er is geen samenhang in de tekst te herkennen.",
      1: "Er is enige samenhang in de tekst te herkennen, al dan niet bewerkstelligd door gebruik van eenvoudige voegwoorden (zoals en, maar, want en omdat) en/of verwijswoorden (zoals hij, zij, die of dat).",
    },
  },
};

/* Wat een complete, eenvoudige A2-tekst normaal scoort. De leeropdracht
   gebruikt deze lijn: punten daarboven zijn polish, geen eis. */
const A2_BASELINE = {
  adequaatheid: 2,
  grammatica: 2,
  spelling: 2,
  woordgebruik: 1,
  coherentie: 1,
};

const TYPES = {
  formulier: { naam: "Formulier", icon: "📋", profiel: "formulier" },
  correspondentie: { naam: "E-mail / brief", icon: "✉️", profiel: "tekst" },
  vrije_tekst: { naam: "Korte tekst", icon: "📝", profiel: "tekst" },
  bericht: { naam: "Briefje / bericht", icon: "💬", profiel: "tekst" },
};

/* Vaste eisen per opdrachtsoort. De inhoudelijke eisen staan bij elke opdracht.
   Op het echte examen staan aanhef en afsluiting al in de opdracht: je neemt ze
   over en zet alleen je naam eronder. Een inleidende zin ("Ik hoop dat het goed
   gaat") levert geen punt op en kost ruimte, dus die telt hier als eis. */
const STRUCTUUR_EISEN = {
  formulier: [
    "Alle persoonlijke gegevens zijn ingevuld",
    "Namen, adressen en cijfers zijn correct gespeld",
    "De open vragen zijn met hele zinnen beantwoord",
  ],
  correspondentie: [
    "Aanhef uit de opdracht overgenomen (Beste ...)",
    "Afsluiting met de groet uit de opdracht, en uw eigen naam",
    "Geen inleidende zin: meteen het eerste punt van de opdracht",
    "Hele zinnen, geen losse woorden",
  ],
  vrije_tekst: [
    "Minimaal 3 hele zinnen",
    "Geen inleiding: meteen over het onderwerp",
  ],
  bericht: [
    "Aanhef uit de opdracht overgenomen",
    // Niet elke briefje-afsluiting is een groet: bericht-05 en bericht-12
    // sluiten met een zin ("Bel me als er iets is!").
    "Afsluiting met de groet of laatste zin uit de opdracht, en uw naam",
    "Geen inleidende zin: meteen het eerste punt van de opdracht",
    "Hele zinnen, geen losse woorden",
  ],
};

const EXAM_BLUEPRINT = {
  size: 4,
  durationSeconds: 40 * 60,
  // Eén opdracht per soort. In het echte examen zitten soms twee e-mails en
  // geen briefje; vier verschillende soorten is de veiligste oefening.
  composition: ["formulier", "correspondentie", "vrije_tekst", "bericht"],
  maxPoints: 37, // 1 formulier (7) + 3 teksten (10)
  // De officiële cesuur wordt per examen door de minister vastgesteld en is
  // niet openbaar. Platforms noemen ongeveer 60-65% van de punten.
  passPercent: 65,
};

const TAKEN = [
  // ── Formulieren ────────────────────────────────────────────────────
  {
    id: "form-01",
    type: "formulier",
    titel: "Aanmelden zwemles",
    situatie:
      "U wilt leren zwemmen bij zwembad De Golf. U vult het aanmeldformulier in.",
    opdracht: "Vul het formulier in. Sommige gegevens moet u zelf bedenken.",
    velden: [
      { label: "Voor- en achternaam", hint: "bijv. Sara Yilmaz", soort: "tekst" },
      { label: "Adres", hint: "straat en huisnummer", soort: "tekst" },
      { label: "Postcode", hint: "bijv. 3512 AB", soort: "tekst" },
      { label: "Woonplaats", soort: "tekst" },
      { label: "Telefoonnummer", soort: "tekst" },
      { label: "E-mail", soort: "tekst" },
      {
        label: "Ik wil zwemmen op",
        soort: "keuze",
        opties: ["Maandagavond 19.00 - 20.00 uur", "Woensdagmiddag 15.00 - 16.00 uur", "Zaterdagochtend 10.00 - 11.00 uur"],
      },
      { label: "Waarom wilt u leren zwemmen?", soort: "lang" },
    ],
    punten: [],
  },
  {
    id: "form-02",
    type: "formulier",
    titel: "Inschrijven taalcursus",
    situatie:
      "U wilt een cursus Nederlands volgen bij het buurthuis. U vult het inschrijfformulier in.",
    opdracht: "Vul het formulier in. Sommige gegevens moet u zelf bedenken.",
    velden: [
      { label: "Voor- en achternaam", soort: "tekst" },
      { label: "Geboortedatum", hint: "bijv. 12-05-1990", soort: "tekst" },
      { label: "Adres", soort: "tekst" },
      { label: "Postcode", soort: "tekst" },
      { label: "Woonplaats", soort: "tekst" },
      { label: "Telefoonnummer", soort: "tekst" },
      { label: "E-mail", soort: "tekst" },
      {
        label: "Welke groep past bij u?",
        soort: "keuze",
        opties: ["Ik kan al een beetje Nederlands", "Ik kan nog bijna geen Nederlands", "Ik wil vooral leren schrijven"],
      },
      { label: "Wat wilt u in de cursus leren?", soort: "lang" },
      { label: "Welke dag kunt u niet?", soort: "lang" },
    ],
    punten: [],
  },
  {
    id: "form-03",
    type: "formulier",
    titel: "Problemen in de straat melden",
    situatie:
      "In uw straat is een lantaarnpaal kapot en er ligt veel afval op de stoep. U meldt dit bij de gemeente.",
    opdracht: "Vul het meldingsformulier van de gemeente in. Sommige gegevens moet u zelf bedenken.",
    velden: [
      { label: "Voor- en achternaam", soort: "tekst" },
      { label: "Adres", soort: "tekst" },
      { label: "Postcode", soort: "tekst" },
      { label: "Woonplaats", soort: "tekst" },
      { label: "Telefoonnummer", soort: "tekst" },
      { label: "E-mail", soort: "tekst" },
      { label: "In welke straat zijn de problemen?", soort: "tekst" },
      { label: "Wat zijn de problemen?", soort: "lang" },
      { label: "Sinds wanneer zijn de problemen?", hint: "bijv. vorige week maandag", soort: "tekst" },
    ],
    punten: [],
  },
  {
    id: "form-04",
    type: "formulier",
    titel: "Bibliotheekpas aanvragen",
    situatie:
      "U wilt boeken en dvd's lenen bij de bibliotheek in uw stad. U vraagt een pas aan.",
    opdracht: "Vul het formulier in. Sommige gegevens moet u zelf bedenken.",
    velden: [
      { label: "Voor- en achternaam", soort: "tekst" },
      { label: "Geboortedatum", soort: "tekst" },
      { label: "Adres", soort: "tekst" },
      { label: "Postcode", soort: "tekst" },
      { label: "Woonplaats", soort: "tekst" },
      { label: "E-mail", soort: "tekst" },
      {
        label: "Soort pas",
        soort: "keuze",
        opties: ["Volwassene (€ 45 per jaar)", "Student (€ 20 per jaar)", "65+ (€ 25 per jaar)"],
      },
      { label: "Waarom wilt u een pas?", soort: "lang" },
      { label: "Wat wilt u lenen?", soort: "lang" },
    ],
    punten: [],
  },
  {
    id: "form-05",
    type: "formulier",
    titel: "Reparatie aanvragen",
    situatie:
      "De verwarming in uw woning werkt niet meer. U vraagt een reparatie aan bij de woningcorporatie.",
    opdracht: "Vul het reparatieformulier in. Sommige gegevens moet u zelf bedenken.",
    velden: [
      { label: "Voor- en achternaam", soort: "tekst" },
      { label: "Adres", soort: "tekst" },
      { label: "Postcode", soort: "tekst" },
      { label: "Woonplaats", soort: "tekst" },
      { label: "Telefoonnummer", soort: "tekst" },
      { label: "Wat is er kapot?", soort: "lang" },
      { label: "Sinds wanneer is het kapot?", hint: "bijv. dinsdag 3 maart", soort: "tekst" },
      {
        label: "Wanneer mag de monteur komen?",
        soort: "keuze",
        opties: ["Ochtend (08.00 - 12.00 uur)", "Middag (12.00 - 17.00 uur)", "Avond (17.00 - 20.00 uur)"],
      },
      { label: "Heeft u nog opmerkingen?", soort: "lang" },
    ],
    punten: [],
  },
  {
    id: "form-06",
    type: "formulier",
    titel: "Klacht over een product",
    situatie:
      "U hebt vorige maand een koffiezetapparaat gekocht. Het apparaat is nu al kapot. U vult een klachtformulier in.",
    opdracht: "Vul het klachtformulier in. Sommige gegevens moet u zelf bedenken.",
    velden: [
      { label: "Voor- en achternaam", soort: "tekst" },
      { label: "Adres", soort: "tekst" },
      { label: "Postcode", soort: "tekst" },
      { label: "Woonplaats", soort: "tekst" },
      { label: "E-mail", soort: "tekst" },
      { label: "Welk product hebt u gekocht?", soort: "tekst" },
      { label: "Wanneer hebt u het product gekocht?", soort: "tekst" },
      { label: "Wat is het probleem?", soort: "lang" },
      {
        label: "Wat wilt u?",
        soort: "keuze",
        opties: ["Mijn geld terug", "Een nieuw product", "Reparatie van het product"],
      },
    ],
    punten: [],
  },
  {
    id: "form-07",
    type: "formulier",
    titel: "Vrijwilligerswerk aanmelden",
    situatie:
      "U wilt vrijwilliger worden bij het buurthuis. U vult het aanmeldformulier in.",
    opdracht: "Vul het formulier in. Sommige gegevens moet u zelf bedenken.",
    velden: [
      { label: "Voor- en achternaam", soort: "tekst" },
      { label: "Adres", soort: "tekst" },
      { label: "Postcode", soort: "tekst" },
      { label: "Woonplaats", soort: "tekst" },
      { label: "Telefoonnummer", soort: "tekst" },
      { label: "E-mail", soort: "tekst" },
      {
        label: "Op welke dag kunt u helpen?",
        soort: "keuze",
        opties: ["Maandag", "Woensdag", "Vrijdag", "Zaterdag"],
      },
      { label: "Waarom wilt u vrijwilliger worden?", soort: "lang" },
      { label: "Wat kunt u goed?", soort: "lang" },
    ],
    punten: [],
  },
  {
    id: "form-08",
    type: "formulier",
    titel: "Aanmelden buurtfeest",
    situatie:
      "Volgende maand is er een buurtfeest in uw straat. U wilt meedoen en u meldt u aan.",
    opdracht: "Vul het aanmeldformulier in. Sommige gegevens moet u zelf bedenken.",
    velden: [
      { label: "Voor- en achternaam", soort: "tekst" },
      { label: "Adres", soort: "tekst" },
      { label: "Postcode", soort: "tekst" },
      { label: "Woonplaats", soort: "tekst" },
      { label: "Telefoonnummer", soort: "tekst" },
      { label: "Hoeveel personen komen er mee?", soort: "tekst" },
      {
        label: "Wat neemt u mee?",
        soort: "keuze",
        opties: ["Een salade", "Een taart", "Drinken", "Iets anders"],
      },
      { label: "Heeft u een allergie of dieet?", soort: "lang" },
    ],
    punten: [],
  },

  // ── E-mails en brieven ─────────────────────────────────────────────
  {
    id: "mail-01",
    type: "correspondentie",
    titel: "Afspraak verzetten",
    situatie:
      "U hebt morgen een afspraak bij de tandartspraktijk. U kunt niet komen, want u moet werken.",
    opdracht: "U schrijft een e-mail aan de tandartspraktijk.",
    email: {
      aan: "praktijk@tandarts.nl",
      onderwerp: "Afspraak verzetten",
      aanhef: "Beste mevrouw De Vries,",
      afsluiting: "Met vriendelijke groet,",
    },
    punten: [
      "Schrijf dat u de afspraak wilt verzetten",
      "Schrijf waarom u niet kunt komen",
      "Stel een nieuwe datum en tijd voor",
    ],
  },
  {
    id: "mail-02",
    type: "correspondentie",
    titel: "Ziekmelden bij uw werk",
    situatie:
      "U bent ziek. U kunt vandaag en morgen niet werken. U mailt uw leidinggevende.",
    opdracht: "U schrijft een e-mail aan uw leidinggevende, mevrouw Jansen.",
    email: {
      aan: "j.jansen@bedrijf.nl",
      onderwerp: "Ziekmelding",
      aanhef: "Beste mevrouw Jansen,",
      afsluiting: "Met vriendelijke groet,",
    },
    punten: [
      "Schrijf dat u ziek bent en niet kunt werken",
      "Schrijf hoe lang u denkt dat u thuis blijft",
      "Schrijf wat een collega vandaag moet overnemen",
    ],
  },
  {
    id: "mail-03",
    type: "correspondentie",
    titel: "Een boek lenen",
    situatie:
      "Voor uw opleiding hebt u het boek Nederlands 2 nodig. Een medestudent heeft het boek. U wilt het lenen.",
    opdracht: "U schrijft een e-mail aan uw medestudent Wilma.",
    email: {
      aan: "wilma@mail.nl",
      onderwerp: "Boek lenen",
      aanhef: "Hallo Wilma,",
      afsluiting: "Groetjes,",
    },
    punten: [
      "Schrijf welk boek u wilt lenen",
      "Schrijf waarom u het boek nodig hebt",
      "Schrijf wanneer zij het boek terugkrijgt",
    ],
  },
  {
    id: "mail-04",
    type: "correspondentie",
    titel: "Dienst ruilen",
    situatie:
      "U moet zondag werken, maar u kunt niet. U vraagt een collega of zij met u wil ruilen.",
    opdracht: "U schrijft een e-mail aan uw collega Farida.",
    email: {
      aan: "farida@winkel.nl",
      onderwerp: "Dienst ruilen",
      aanhef: "Hallo Farida,",
      afsluiting: "Groetjes,",
    },
    punten: [
      "Schrijf waarom u mailt",
      "Schrijf waarom u zondag niet kunt werken",
      "Schrijf welke dag u wel kunt werken",
    ],
  },
  {
    id: "mail-05",
    type: "correspondentie",
    titel: "Een vrije dag vragen",
    situatie:
      "U wilt volgende week een dag vrij. U mailt uw chef, meneer Bakker.",
    opdracht: "U schrijft een e-mail aan uw chef.",
    email: {
      aan: "b.bakker@bedrijf.nl",
      onderwerp: "Vrije dag",
      aanhef: "Beste meneer Bakker,",
      afsluiting: "Met vriendelijke groet,",
    },
    punten: [
      "Schrijf wanneer u vrij wilt zijn",
      "Schrijf waarom u vrij wilt zijn",
      "Schrijf wie uw werk die dag kan doen",
    ],
  },
  {
    id: "mail-06",
    type: "correspondentie",
    titel: "Klacht over een bestelling",
    situatie:
      "U hebt online een jas besteld. U kreeg de verkeerde maat en de jas is ook beschadigd.",
    opdracht: "U schrijft een e-mail aan de webshop.",
    email: {
      aan: "service@webwinkel.nl",
      onderwerp: "Klacht over bestelling 48 212",
      aanhef: "Beste meneer/mevrouw,",
      afsluiting: "Met vriendelijke groet,",
    },
    punten: [
      "Schrijf wat u hebt besteld en wanneer",
      "Schrijf wat er mis is met de bestelling",
      "Schrijf wat u nu wilt: geld terug of een nieuwe jas",
    ],
  },
  {
    id: "mail-07",
    type: "correspondentie",
    titel: "Uitnodiging verjaardag",
    situatie:
      "U bent bijna jarig. U viert uw verjaardag thuis met vrienden en u nodigt een vriendin uit.",
    opdracht: "U schrijft een e-mail aan uw vriendin Anna.",
    email: {
      aan: "anna@mail.nl",
      onderwerp: "Mijn verjaardag",
      aanhef: "Lieve Anna,",
      afsluiting: "Liefs,",
    },
    punten: [
      "Schrijf wanneer en hoe laat het feest is",
      "Schrijf waar het feest is",
      "Vraag of zij komt en of zij iemand meeneemt",
    ],
  },
  {
    id: "mail-08",
    type: "correspondentie",
    titel: "Vraag over afval",
    situatie:
      "Uw vuilnisbak is twee weken niet opgehaald. U mailt de gemeente met een vraag.",
    opdracht: "U schrijft een e-mail aan de gemeente.",
    email: {
      aan: "afval@gemeente.nl",
      onderwerp: "Afval niet opgehaald",
      aanhef: "Beste mevrouw/heer,",
      afsluiting: "Met vriendelijke groet,",
    },
    punten: [
      "Schrijf in welke straat u woont",
      "Schrijf wanneer het afval niet is opgehaald",
      "Vraag wanneer het afval nu wordt opgehaald",
    ],
  },

  // ── Korte teksten (wijkkrant) ──────────────────────────────────────
  {
    id: "tekst-01",
    type: "vrije_tekst",
    titel: "Een feest dat u elk jaar viert",
    situatie:
      "U krijgt elke week een wijkkrant. Iedereen uit de buurt mag iets schrijven. U schrijft over een feest dat u elk jaar viert.",
    opdracht: "Schrijf minimaal drie zinnen. Schrijf in hele zinnen.",
    start: "Dit is mijn tekst over het feest dat ik elk jaar vier:",
    punten: [
      "Waarom viert u het feest?",
      "Wie komen er op het feest?",
      "Wat doet u op het feest?",
    ],
  },
  {
    id: "tekst-02",
    type: "vrije_tekst",
    titel: "Mijn favoriete plek in de buurt",
    situatie:
      "U schrijft voor de wijkkrant over een plek in de buurt waar u graag komt.",
    opdracht: "Schrijf minimaal drie zinnen. Schrijf in hele zinnen.",
    start: "Dit is mijn tekst over mijn favoriete plek in de buurt:",
    punten: [
      "Waar is die plek?",
      "Waarom komt u daar graag?",
      "Wat doet u daar meestal?",
    ],
  },
  {
    id: "tekst-03",
    type: "vrije_tekst",
    titel: "Mijn weekend",
    situatie: "U schrijft voor de wijkkrant over uw weekend.",
    opdracht: "Schrijf minimaal drie zinnen. Schrijf in hele zinnen.",
    start: "Dit is mijn tekst over mijn weekend:",
    punten: [
      "Wat doet u graag in het weekend?",
      "Met wie doet u dat?",
      "Waar doet u dat?",
    ],
  },
  {
    id: "tekst-04",
    type: "vrije_tekst",
    titel: "Mijn lievelingseten",
    situatie: "U schrijft voor de wijkkrant over het eten dat u het lekkerst vindt.",
    opdracht: "Schrijf minimaal drie zinnen. Schrijf in hele zinnen.",
    start: "Dit is mijn tekst over mijn lievelingseten:",
    punten: [
      "Wat eet u het liefst?",
      "Wie maakt dat eten?",
      "Wanneer eet u dat?",
    ],
  },
  {
    id: "tekst-05",
    type: "vrije_tekst",
    titel: "Mijn werk of opleiding",
    situatie:
      "U schrijft voor de wijkkrant over uw werk of over de opleiding die u volgt.",
    opdracht: "Schrijf minimaal drie zinnen. Schrijf in hele zinnen.",
    start: "Dit is mijn tekst over mijn werk of opleiding:",
    punten: [
      "Wat doet u op uw werk of opleiding?",
      "Wat vindt u leuk en wat vindt u moeilijk?",
      "Hoe komt u daar?",
    ],
  },
  {
    id: "tekst-06",
    type: "vrije_tekst",
    titel: "Een reis die ik heb gemaakt",
    situatie: "U schrijft voor de wijkkrant over een reis die u ooit hebt gemaakt.",
    opdracht: "Schrijf minimaal drie zinnen. Schrijf in hele zinnen.",
    start: "Dit is mijn tekst over een reis die ik heb gemaakt:",
    punten: [
      "Waar ging u naartoe?",
      "Met wie was u daar?",
      "Wat hebt u daar gedaan?",
    ],
  },
  {
    id: "tekst-07",
    type: "vrije_tekst",
    titel: "Mijn hobby",
    situatie: "U schrijft voor de wijkkrant over uw hobby.",
    opdracht: "Schrijf minimaal drie zinnen. Schrijf in hele zinnen.",
    start: "Dit is mijn tekst over mijn hobby:",
    punten: [
      "Wat is uw hobby?",
      "Hoe vaak doet u dat?",
      "Waarom vindt u het leuk?",
    ],
  },
  {
    id: "tekst-08",
    type: "vrije_tekst",
    titel: "Waarom ik hier woon",
    situatie: "U schrijft voor de wijkkrant over uw buurt.",
    opdracht: "Schrijf minimaal drie zinnen. Schrijf in hele zinnen.",
    start: "Dit is mijn tekst over mijn buurt:",
    punten: [
      "Hoe lang woont u al in deze buurt?",
      "Wat vindt u fijn aan de buurt?",
      "Wat kan beter in de buurt?",
    ],
  },

  // ── Briefjes en berichten ──────────────────────────────────────────
  {
    id: "bericht-01",
    type: "bericht",
    titel: "Briefje voor een collega",
    situatie:
      "U werkt in een kledingwinkel. Uw collega Fariha komt straks. Er moeten nog drie dingen gebeuren.",
    opdracht: "Schrijf een briefje voor Fariha. Vertel wat zij moet doen. Schrijf drie dingen op.",
    aanhef: "Hallo Fariha,",
    afsluiting: "Alvast bedankt!",
    punten: [
      "De nieuwe kleren in de kast hangen",
      "De kassa tellen en het geld naar de bank brengen",
      "De winkel om 18.00 uur sluiten",
    ],
  },
  {
    id: "bericht-02",
    type: "bericht",
    titel: "Briefje voor uw huisgenoot",
    situatie:
      "U gaat een weekend weg. Uw huisgenoot Tom is thuis. U laat een briefje achter.",
    opdracht: "Schrijf een briefje voor Tom met drie dingen die hij moet doen.",
    aanhef: "Hoi Tom,",
    afsluiting: "Tot zondag!",
    punten: [
      "Boodschappen doen: brood, melk en eieren",
      "De planten water geven op zaterdag",
      "De deur op slot doen als hij weggaat",
    ],
  },
  {
    id: "bericht-03",
    type: "bericht",
    titel: "Briefje voor de buurvrouw",
    situatie:
      "U gaat twee dagen naar uw familie. Uw buurvrouw Leti kan op het huis passen.",
    opdracht: "Schrijf een briefje voor Leti met drie dingen.",
    aanhef: "Beste Leti,",
    afsluiting: "Dank je wel!",
    punten: [
      "De planten water geven",
      "Een pakketje aannemen als de postbode komt",
      "De sleutel terugbrengen als u weer thuis bent",
    ],
  },
  {
    id: "bericht-04",
    type: "bericht",
    titel: "Bericht aan de school",
    situatie:
      "Uw dochter Noor is ziek. Uw moeder haalt haar vandaag om 12.00 uur op van school.",
    opdracht: "Schrijf een bericht aan de leraar van Noor. Vertel drie dingen.",
    aanhef: "Beste meester Pieter,",
    afsluiting: "Met vriendelijke groet,",
    punten: [
      "Noor is vandaag ziek",
      "Oma haalt Noor om 12.00 uur op",
      "Noor komt morgen weer naar school als zij beter is",
    ],
  },
  {
    id: "bericht-05",
    type: "bericht",
    titel: "Briefje voor de oppas",
    situatie:
      "U gaat vanavond weg. De oppas Sanne past op uw zoon Adam van 5 jaar.",
    opdracht: "Schrijf een briefje voor Sanne met drie dingen.",
    aanhef: "Hallo Sanne,",
    afsluiting: "Bel me als er iets is!",
    punten: [
      "Adam eet om 18.00 uur: brood met kaas en een beker melk",
      "Om 19.00 uur tanden poetsen en naar bed",
      "Hij mag niet op de tablet na 18.30 uur",
    ],
  },
  {
    id: "bericht-06",
    type: "bericht",
    titel: "Bericht aan de huismeester",
    situatie:
      "In de hal van uw flat is een lamp kapot. Ook is de lift vies. U meldt het bij de huismeester.",
    opdracht: "Schrijf een bericht aan de huismeester, meneer De Boer. Vertel drie dingen.",
    aanhef: "Beste meneer De Boer,",
    afsluiting: "Met vriendelijke groet,",
    punten: [
      "De lamp in de hal is kapot",
      "De lift is vies en moet worden schoongemaakt",
      "Vraag wanneer iemand het komt maken",
    ],
  },
  {
    id: "bericht-07",
    type: "bericht",
    titel: "Briefje voor de buren",
    situatie:
      "U geeft zaterdag een feest thuis. Het wordt laat. U waarschuwt de buren.",
    opdracht: "Schrijf een briefje voor de buren van nummer 14. Vertel drie dingen.",
    aanhef: "Beste buren,",
    afsluiting: "Groeten,",
    punten: [
      "Zaterdag is er een feest bij u thuis",
      "Het feest eindigt om 23.00 uur",
      "Zij kunnen bij u aanbellen als zij overlast hebben",
    ],
  },
  {
    id: "bericht-08",
    type: "bericht",
    titel: "Bericht voor de receptie",
    situatie:
      "U werkt bij de receptie van een kantoor. Uw collega Youssef komt pas om 10.00 uur. Er zijn drie telefoontjes geweest.",
    opdracht: "Schrijf een bericht voor Youssef. Vertel drie dingen.",
    aanhef: "Hoi Youssef,",
    afsluiting: "Tot straks!",
    punten: [
      "Meneer Smit belt terug over de factuur",
      "Vrouw De Jong komt om 14.00 uur langs",
      "De post moet nog worden gebracht",
    ],
  },

  // ── Formulieren (vervolg) ─────────────────────────────────────────
  {
    id: "form-09",
    type: "formulier",
    titel: "Aanmelden sportschool",
    situatie:
      "U wilt gaan sporten bij sportschool Fit & Gezond. U vult het aanmeldformulier in.",
    opdracht: "Vul het formulier in. Sommige gegevens moet u zelf bedenken.",
    velden: [
      { label: "Voor- en achternaam", soort: "tekst" },
      { label: "Adres", soort: "tekst" },
      { label: "Postcode", soort: "tekst" },
      { label: "Woonplaats", soort: "tekst" },
      { label: "Telefoonnummer", soort: "tekst" },
      { label: "E-mail", soort: "tekst" },
      {
        label: "Welk abonnement wilt u?",
        soort: "keuze",
        opties: ["1 keer per week", "2 keer per week", "Onbeperkt sporten"],
      },
      { label: "Wat is uw doel?", soort: "lang" },
      { label: "Hebt u een blessure of allergie?", soort: "lang" },
    ],
    punten: [],
  },
  {
    id: "form-10",
    type: "formulier",
    titel: "Parkeervergunning aanvragen",
    situatie:
      "U woont in het centrum. Daar mag u niet gratis parkeren. U vraagt een vergunning aan bij de gemeente.",
    opdracht: "Vul het formulier in. Sommige gegevens moet u zelf bedenken.",
    velden: [
      { label: "Voor- en achternaam", soort: "tekst" },
      { label: "Adres", soort: "tekst" },
      { label: "Postcode", soort: "tekst" },
      { label: "Woonplaats", soort: "tekst" },
      { label: "Kenteken van uw auto", hint: "bijv. 12-AB-34", soort: "tekst" },
      { label: "E-mail", soort: "tekst" },
      {
        label: "Soort vergunning",
        soort: "keuze",
        opties: ["Voor bewoners", "Voor bezoekers", "Voor een bedrijf"],
      },
      { label: "Waarom hebt u een vergunning nodig?", soort: "lang" },
      { label: "Hoeveel auto's hebt u?", soort: "tekst" },
    ],
    punten: [],
  },
  {
    id: "form-11",
    type: "formulier",
    titel: "Nieuwe patiënt bij de huisarts",
    situatie:
      "U bent net in een nieuwe wijk komen wonen. U zoekt een huisarts en vult het inschrijfformulier in.",
    opdracht: "Vul het formulier in. Sommige gegevens moet u zelf bedenken.",
    velden: [
      { label: "Voor- en achternaam", soort: "tekst" },
      { label: "Geboortedatum", soort: "tekst" },
      { label: "Adres", soort: "tekst" },
      { label: "Postcode", soort: "tekst" },
      { label: "Woonplaats", soort: "tekst" },
      { label: "Telefoonnummer", soort: "tekst" },
      { label: "E-mail", soort: "tekst" },
      {
        label: "Hoe wilt u dat de praktijk u bereikt?",
        soort: "keuze",
        opties: ["Bellen", "E-mail", "Wat mij uitkomt"],
      },
      { label: "Gebruikt u medicijnen? Welke?", soort: "lang" },
      { label: "Hebt u nog andere klachten?", soort: "lang" },
    ],
    punten: [],
  },
  {
    id: "form-12",
    type: "formulier",
    titel: "Kind inschrijven bij een school",
    situatie:
      "Uw dochter van vier jaar gaat naar de basisschool. U schrijft haar in.",
    opdracht: "Vul het inschrijfformulier in. Sommige gegevens moet u zelf bedenken.",
    velden: [
      { label: "Naam van het kind", soort: "tekst" },
      { label: "Geboortedatum van het kind", soort: "tekst" },
      { label: "Naam van de ouder of verzorger", soort: "tekst" },
      { label: "Adres", soort: "tekst" },
      { label: "Woonplaats", soort: "tekst" },
      { label: "Telefoonnummer", soort: "tekst" },
      {
        label: "In welke groep komt het kind?",
        soort: "keuze",
        opties: ["Groep 1", "Groep 2", "Groep 3"],
      },
      { label: "Welke taal spreekt uw kind thuis?", soort: "tekst" },
      { label: "Allergie of dieet?", soort: "lang" },
      { label: "Wie mag uw kind ophalen?", soort: "lang" },
    ],
    punten: [],
  },
  {
    id: "form-13",
    type: "formulier",
    titel: "Fiets gestolen: schadeformulier",
    situatie:
      "Uw fiets is vorige week bij het station gestolen. U meldt het bij de verzekering.",
    opdracht: "Vul het schadeformulier in. Sommige gegevens moet u zelf bedenken.",
    velden: [
      { label: "Voor- en achternaam", soort: "tekst" },
      { label: "Adres", soort: "tekst" },
      { label: "Postcode", soort: "tekst" },
      { label: "Woonplaats", soort: "tekst" },
      { label: "Telefoonnummer", soort: "tekst" },
      { label: "Wat is er gebeurd?", soort: "lang" },
      { label: "Wanneer was het?", soort: "tekst" },
      { label: "Waar was het?", soort: "tekst" },
      {
        label: "Hebt u aangifte gedaan bij de politie?",
        soort: "keuze",
        opties: ["Ja, dezelfde dag", "Ja, later", "Nee, nog niet"],
      },
    ],
    punten: [],
  },
  {
    id: "form-14",
    type: "formulier",
    titel: "Klacht over de bus",
    situatie:
      "De bus van uw lijn kwam deze week drie keer niet opdagen. U klaagt bij het vervoersbedrijf.",
    opdracht: "Vul het klachtformulier in. Sommige gegevens moet u zelf bedenken.",
    velden: [
      { label: "Voor- en achternaam", soort: "tekst" },
      { label: "Adres", soort: "tekst" },
      { label: "Postcode", soort: "tekst" },
      { label: "Woonplaats", soort: "tekst" },
      { label: "E-mail", soort: "tekst" },
      { label: "Welke lijn en richting?", soort: "tekst" },
      { label: "Datum en tijd", soort: "tekst" },
      { label: "Wat ging er mis?", soort: "lang" },
      {
        label: "Wat wilt u van ons?",
        soort: "keuze",
        opties: ["Een uitleg", "Mijn geld terug", "Betere dienstregeling"],
      },
    ],
    punten: [],
  },
  {
    id: "form-15",
    type: "formulier",
    titel: "Aanmelden bij de voedselbank",
    situatie:
      "U hebt te weinig geld voor boodschappen. U vraagt hulp bij de voedselbank in uw stad.",
    opdracht: "Vul het aanmeldformulier in. Sommige gegevens moet u zelf bedenken.",
    velden: [
      { label: "Voor- en achternaam", soort: "tekst" },
      { label: "Geboortedatum", soort: "tekst" },
      { label: "Adres", soort: "tekst" },
      { label: "Postcode", soort: "tekst" },
      { label: "Woonplaats", soort: "tekst" },
      { label: "Telefoonnummer", soort: "tekst" },
      { label: "Hoeveel personen wonen er bij u?", soort: "tekst" },
      {
        label: "Waarvan leeft u nu?",
        soort: "keuze",
        opties: ["Uitkering", "Salaris", "Geen inkomen"],
      },
      { label: "Waarom vraagt u om hulp?", soort: "lang" },
    ],
    punten: [],
  },
  {
    id: "form-16",
    type: "formulier",
    titel: "Abonnement opzeggen",
    situatie:
      "U gaat verhuizen en kunt niet meer naar de sportschool. U zegt uw abonnement op.",
    opdracht: "Vul het opzegformulier in. Sommige gegevens moet u zelf bedenken.",
    velden: [
      { label: "Voor- en achternaam", soort: "tekst" },
      { label: "Lidnummer", soort: "tekst" },
      { label: "Adres", soort: "tekst" },
      { label: "Postcode", soort: "tekst" },
      { label: "Woonplaats", soort: "tekst" },
      { label: "E-mail", soort: "tekst" },
      { label: "Per welke datum wilt u opzeggen?", soort: "tekst" },
      {
        label: "Waarom zegt u op?",
        soort: "keuze",
        opties: ["Ik verhuis", "Ik ben geblesseerd", "Ik heb geen tijd meer"],
      },
      { label: "Heeft u nog opmerkingen?", soort: "lang" },
    ],
    punten: [],
  },
  {
    id: "form-17",
    type: "formulier",
    titel: "Aanmelden bij de kinderopvang",
    situatie:
      "U gaat weer werken. Uw zoontje van twee jaar gaat twee dagen naar de kinderopvang.",
    opdracht: "Vul het aanmeldformulier in. Sommige gegevens moet u zelf bedenken.",
    velden: [
      { label: "Naam van het kind", soort: "tekst" },
      { label: "Geboortedatum van het kind", soort: "tekst" },
      { label: "Naam van de ouder of verzorger", soort: "tekst" },
      { label: "Adres", soort: "tekst" },
      { label: "Telefoonnummer", soort: "tekst" },
      {
        label: "Op welke dagen komt uw kind?",
        soort: "keuze",
        opties: ["Maandag en dinsdag", "Woensdag en donderdag", "Donderdag en vrijdag"],
      },
      { label: "Wanneer wilt u beginnen?", soort: "tekst" },
      { label: "Allergie, dieet of medicijnen?", soort: "lang" },
      { label: "Wie mag uw kind ophalen?", soort: "lang" },
    ],
    punten: [],
  },
  {
    id: "form-18",
    type: "formulier",
    titel: "Aanmelden voor het buurtfeest",
    situatie:
      "De buurtvereniging organiseert een feest. U wilt met uw gezin komen en u helpt ook mee.",
    opdracht: "Vul het formulier in. Sommige gegevens moet u zelf bedenken.",
    velden: [
      { label: "Voor- en achternaam", soort: "tekst" },
      { label: "Adres", soort: "tekst" },
      { label: "Postcode", soort: "tekst" },
      { label: "Woonplaats", soort: "tekst" },
      { label: "Telefoonnummer", soort: "tekst" },
      { label: "Hoeveel personen komen er?", soort: "tekst" },
      {
        label: "Waarmee wilt u helpen?",
        soort: "keuze",
        opties: ["Klaarzetten", "Eten maken", "Opruimen", "Kinderen begeleiden"],
      },
      { label: "Wat neemt u mee?", soort: "lang" },
      { label: "Heeft u een allergie?", soort: "lang" },
    ],
    punten: [],
  },
  {
    id: "form-19",
    type: "formulier",
    titel: "Container stuk: melding aan de gemeente",
    situatie:
      "De afvalcontainer in uw straat is kapot. De deur gaat niet meer open en er ligt afval naast.",
    opdracht: "Vul het meldingsformulier in. Sommige gegevens moet u zelf bedenken.",
    velden: [
      { label: "Voor- en achternaam", soort: "tekst" },
      { label: "Adres", soort: "tekst" },
      { label: "Postcode", soort: "tekst" },
      { label: "Woonplaats", soort: "tekst" },
      { label: "E-mail", soort: "tekst" },
      { label: "Waar staat de container?", soort: "tekst" },
      {
        label: "Wat is het probleem?",
        soort: "keuze",
        opties: ["De container is kapot", "De container is vol", "De container staat verkeerd"],
      },
      { label: "Kunt u het probleem uitleggen?", soort: "lang" },
      { label: "Sinds wanneer is dit?", soort: "tekst" },
    ],
    punten: [],
  },
  {
    id: "form-20",
    type: "formulier",
    titel: "Aanvraag voor de tandarts",
    situatie:
      "U hebt pijn aan een kies. U bent nog geen patiënt bij deze tandartspraktijk, maar u vraagt een afspraak aan.",
    opdracht: "Vul het formulier in. Sommige gegevens moet u zelf bedenken.",
    velden: [
      { label: "Voor- en achternaam", soort: "tekst" },
      { label: "Geboortedatum", soort: "tekst" },
      { label: "Adres", soort: "tekst" },
      { label: "Postcode", soort: "tekst" },
      { label: "Woonplaats", soort: "tekst" },
      { label: "Telefoonnummer", soort: "tekst" },
      { label: "Wat is uw klacht?", soort: "lang" },
      { label: "Hoe lang hebt u al pijn?", soort: "tekst" },
      {
        label: "Wanneer kunt u?",
        soort: "keuze",
        opties: ["Ochtend", "Middag", "Zo snel mogelijk"],
      },
    ],
    punten: [],
  },
  // ── E-mails en brieven (vervolg) ───────────────────────────────────
  {
    id: "mail-09",
    type: "correspondentie",
    titel: "Een afspraak maken bij de huisarts",
    situatie:
      "U hebt al drie dagen erge hoofdpijn. U wilt een afspraak bij de huisarts.",
    opdracht: "U schrijft een e-mail aan de huisartspraktijk.",
    email: {
      aan: "praktijk@huisarts.nl",
      onderwerp: "Afspraak",
      aanhef: "Beste mevrouw/heer,",
      afsluiting: "Met vriendelijke groet,",
    },
    punten: [
      "Schrijf waarom u een afspraak wilt",
      "Schrijf hoe lang u al klachten hebt",
      "Schrijf wanneer u kunt komen",
    ],
  },
  {
    id: "mail-10",
    type: "correspondentie",
    titel: "Pakket niet ontvangen",
    situatie:
      "U hebt twee weken geleden een boek besteld. U hebt het nog niet gekregen. De webshop zegt dat het pakket is bezorgd.",
    opdracht: "U schrijft een e-mail aan de webshop.",
    email: {
      aan: "service@boekwinkel.nl",
      onderwerp: "Bestelling 31 907 niet ontvangen",
      aanhef: "Beste mevrouw/heer,",
      afsluiting: "Met vriendelijke groet,",
    },
    punten: [
      "Schrijf wat u hebt besteld en wanneer",
      "Schrijf dat u het pakket niet hebt gekregen",
      "Vraag wat de webshop nu gaat doen",
    ],
  },
  {
    id: "mail-11",
    type: "correspondentie",
    titel: "Sportabonnement opzeggen",
    situatie:
      "U bent geblesseerd en kunt zes maanden niet sporten. U wilt uw abonnement stopzetten.",
    opdracht: "U schrijft een e-mail aan de sportschool.",
    email: {
      aan: "info@fitengezond.nl",
      onderwerp: "Abonnement stopzetten",
      aanhef: "Beste mevrouw/heer,",
      afsluiting: "Met vriendelijke groet,",
    },
    punten: [
      "Schrijf dat u wilt stoppen met het abonnement",
      "Schrijf waarom u stopt",
      "Vraag per wanneer het abonnement stopt",
    ],
  },
  {
    id: "mail-12",
    type: "correspondentie",
    titel: "Afscheid van een collega",
    situatie:
      "Uw collega Mark gaat na tien jaar weg. U organiseert een klein afscheid en nodigt de collega's uit.",
    opdracht: "U schrijft een e-mail aan de collega's.",
    email: {
      aan: "team@bedrijf.nl",
      onderwerp: "Afscheid Mark",
      aanhef: "Beste collega's,",
      afsluiting: "Groeten,",
    },
    punten: [
      "Schrijf wanneer en hoe laat het afscheid is",
      "Schrijf waar het is",
      "Vraag of zij komen en wat zij meenemen",
    ],
  },
  {
    id: "mail-13",
    type: "correspondentie",
    titel: "Vraag over het schoolreisje",
    situatie:
      "Uw zoon gaat volgende maand met school op reis. U hebt een vraag over betalen en over het eten.",
    opdracht: "U schrijft een e-mail aan de leraar van uw zoon, meester Pieter.",
    email: {
      aan: "p.devries@basisschool.nl",
      onderwerp: "Schoolreisje groep 5",
      aanhef: "Beste meester Pieter,",
      afsluiting: "Met vriendelijke groet,",
    },
    punten: [
      "Schrijf dat u een vraag hebt over het schoolreisje",
      "Vraag wanneer u moet betalen",
      "Vraag of uw zoon zelf eten mee moet nemen",
    ],
  },
  {
    id: "mail-14",
    type: "correspondentie",
    titel: "Afspraak bij de kapper",
    situatie:
      "U hebt zaterdag een afspraak bij de kapper, maar u moet dan werken.",
    opdracht: "U schrijft een e-mail aan de kapsalon.",
    email: {
      aan: "kapsalon@mail.nl",
      onderwerp: "Afspraak zaterdag",
      aanhef: "Hallo,",
      afsluiting: "Groetjes,",
    },
    punten: [
      "Schrijf dat u zaterdag niet kunt komen",
      "Schrijf waarom u niet kunt komen",
      "Vraag of het een andere dag kan",
    ],
  },
  {
    id: "mail-15",
    type: "correspondentie",
    titel: "Overlast van de buren",
    situatie:
      "De buren boven u maken elke nacht veel lawaai. U hebt er al twee keer iets van gezegd. Nu mailt u de woningcorporatie.",
    opdracht: "U schrijft een e-mail aan de woningcorporatie.",
    email: {
      aan: "hulp@woning.nl",
      onderwerp: "Overlast buren",
      aanhef: "Beste mevrouw/heer,",
      afsluiting: "Met vriendelijke groet,",
    },
    punten: [
      "Schrijf wie u bent en waar u woont",
      "Schrijf wat de overlast is en wanneer",
      "Vraag wat de corporatie kan doen",
    ],
  },
  {
    id: "mail-16",
    type: "correspondentie",
    titel: "Vraag over de parkeervergunning",
    situatie:
      "U hebt een parkeervergunning aangevraagd. U wacht al drie weken en u hebt nog niets gehoord.",
    opdracht: "U schrijft een e-mail aan de gemeente.",
    email: {
      aan: "parkeren@gemeente.nl",
      onderwerp: "Aanvraag parkeervergunning",
      aanhef: "Beste mevrouw/heer,",
      afsluiting: "Met vriendelijke groet,",
    },
    punten: [
      "Schrijf wanneer u de vergunning hebt aangevraagd",
      "Schrijf dat u nog geen antwoord hebt gekregen",
      "Vraag hoe lang het nog duurt",
    ],
  },
  {
    id: "mail-17",
    type: "correspondentie",
    titel: "Gratis spullen weggeven",
    situatie:
      "U hebt een tafel en twee stoelen die u niet meer gebruikt. U geeft ze gratis weg via een website.",
    opdracht: "U schrijft een bericht aan iemand die reageerde op uw advertentie.",
    email: {
      aan: "lisa@mail.nl",
      onderwerp: "Tafel en stoelen",
      aanhef: "Hallo Lisa,",
      afsluiting: "Groetjes,",
    },
    punten: [
      "Schrijf dat de tafel en stoelen nog vrij zijn",
      "Schrijf wanneer zij ze kan ophalen",
      "Vraag of zij zelf vervoer heeft",
    ],
  },
  {
    id: "mail-18",
    type: "correspondentie",
    titel: "Uw kind is ziek",
    situatie:
      "Uw dochter is ziek en komt vandaag niet naar de kinderopvang.",
    opdracht: "U schrijft een e-mail aan de kinderopvang.",
    email: {
      aan: "opvang@dekasteel.nl",
      onderwerp: "Ziek",
      aanhef: "Beste leidsters,",
      afsluiting: "Groeten,",
    },
    punten: [
      "Schrijf dat uw dochter vandaag niet komt",
      "Schrijf waarom zij niet komt",
      "Schrijf wanneer zij waarschijnlijk terugkomt",
    ],
  },
  {
    id: "mail-19",
    type: "correspondentie",
    titel: "Verwijzing naar het ziekenhuis",
    situatie:
      "U hebt al weken pijn aan uw knie. De huisarts heeft u onderzocht. U vraagt om een verwijzing.",
    opdracht: "U schrijft een e-mail aan uw huisarts, dokter Smit.",
    email: {
      aan: "dokter.smit@huisarts.nl",
      onderwerp: "Verwijzing",
      aanhef: "Beste dokter Smit,",
      afsluiting: "Met vriendelijke groet,",
    },
    punten: [
      "Schrijf dat u nog steeds pijn hebt",
      "Vraag om een verwijzing naar het ziekenhuis",
      "Schrijf wanneer u kunt bellen of langskomen",
    ],
  },
  {
    id: "mail-20",
    type: "correspondentie",
    titel: "Bedankt voor het feest",
    situatie:
      "U was zaterdag op een feest bij uw vriendin. U wilt haar bedanken en u vraagt om de foto's.",
    opdracht: "U schrijft een e-mail aan uw vriendin Anna.",
    email: {
      aan: "anna@mail.nl",
      onderwerp: "Bedankt!",
      aanhef: "Lieve Anna,",
      afsluiting: "Liefs,",
    },
    punten: [
      "Schrijf dat u het feest leuk vond",
      "Schrijf wat u het leukste vond",
      "Vraag of zij de foto's kan sturen",
    ],
  },

  // ── Korte teksten (vervolg) ────────────────────────────────────────
  {
    id: "tekst-09",
    type: "vrije_tekst",
    titel: "Mijn huis",
    situatie: "U schrijft voor de wijkkrant over uw huis.",
    opdracht: "Schrijf minimaal drie zinnen. Schrijf in hele zinnen.",
    start: "Dit is mijn tekst over mijn huis:",
    punten: [
      "Hoe ziet uw huis eruit?",
      "Wat vindt u mooi aan uw huis?",
      "Wat wilt u nog veranderen?",
    ],
  },
  {
    id: "tekst-10",
    type: "vrije_tekst",
    titel: "Mijn familie",
    situatie: "U schrijft voor de wijkkrant over uw familie.",
    opdracht: "Schrijf minimaal drie zinnen. Schrijf in hele zinnen.",
    start: "Dit is mijn tekst over mijn familie:",
    punten: [
      "Met wie woont u samen?",
      "Waar woont de rest van uw familie?",
      "Wat doen jullie graag samen?",
    ],
  },
  {
    id: "tekst-11",
    type: "vrije_tekst",
    titel: "Een feestdag uit mijn land",
    situatie: "U schrijft voor de wijkkrant over een feestdag uit het land waar u vandaan komt.",
    opdracht: "Schrijf minimaal drie zinnen. Schrijf in hele zinnen.",
    start: "Dit is mijn tekst over een feestdag uit mijn land:",
    punten: [
      "Welke feestdag is het?",
      "Wat doen mensen op die dag?",
      "Wat vindt u zelf het leukst?",
    ],
  },
  {
    id: "tekst-12",
    type: "vrije_tekst",
    titel: "Mijn lievelingswinkel",
    situatie: "U schrijft voor de wijkkrant over uw lievelingswinkel.",
    opdracht: "Schrijf minimaal drie zinnen. Schrijf in hele zinnen.",
    start: "Dit is mijn tekst over mijn lievelingswinkel:",
    punten: [
      "Waar is de winkel?",
      "Wat koopt u daar?",
      "Waarom gaat u graag naar deze winkel?",
    ],
  },
  {
    id: "tekst-13",
    type: "vrije_tekst",
    titel: "Met de bus door de stad",
    situatie: "U schrijft voor de wijkkrant over het openbaar vervoer in uw stad.",
    opdracht: "Schrijf minimaal drie zinnen. Schrijf in hele zinnen.",
    start: "Dit is mijn tekst over het openbaar vervoer in mijn stad:",
    punten: [
      "Welke bus of trein neemt u?",
      "Hoe lang duurt uw reis?",
      "Wat kan er beter aan het vervoer?",
    ],
  },
  {
    id: "tekst-14",
    type: "vrije_tekst",
    titel: "Mijn eerste week in Nederland",
    situatie: "U schrijft voor de wijkkrant over uw eerste week in Nederland.",
    opdracht: "Schrijf minimaal drie zinnen. Schrijf in hele zinnen.",
    start: "Dit is mijn tekst over mijn eerste week in Nederland:",
    punten: [
      "Wanneer kwam u in Nederland?",
      "Wat viel u het meeste op?",
      "Wat vond u moeilijk?",
    ],
  },
  {
    id: "tekst-15",
    type: "vrije_tekst",
    titel: "Sporten in de buurt",
    situatie: "U schrijft voor de wijkkrant over sporten in uw buurt.",
    opdracht: "Schrijf minimaal drie zinnen. Schrijf in hele zinnen.",
    start: "Dit is mijn tekst over sporten in mijn buurt:",
    punten: [
      "Welke sport doet u?",
      "Waar en met wie sport u?",
      "Waarom raadt u deze sport aan?",
    ],
  },
  {
    id: "tekst-16",
    type: "vrije_tekst",
    titel: "Mijn buren",
    situatie: "U schrijft voor de wijkkrant over uw buren.",
    opdracht: "Schrijf minimaal drie zinnen. Schrijf in hele zinnen.",
    start: "Dit is mijn tekst over mijn buren:",
    punten: [
      "Wie zijn uw buren?",
      "Wat doen jullie voor elkaar?",
      "Hoe is het contact met hen?",
    ],
  },
  {
    id: "tekst-17",
    type: "vrije_tekst",
    titel: "Boodschappen doen",
    situatie: "U schrijft voor de wijkkrant over boodschappen doen in de buurt.",
    opdracht: "Schrijf minimaal drie zinnen. Schrijf in hele zinnen.",
    start: "Dit is mijn tekst over boodschappen doen:",
    punten: [
      "Waar koopt u uw boodschappen?",
      "Wanneer doet u boodschappen?",
      "Wat koopt u altijd?",
    ],
  },
  {
    id: "tekst-18",
    type: "vrije_tekst",
    titel: "Een film of serie die ik leuk vind",
    situatie: "U schrijft voor de wijkkrant over een film of serie die u leuk vindt.",
    opdracht: "Schrijf minimaal drie zinnen. Schrijf in hele zinnen.",
    start: "Dit is mijn tekst over een film of serie die ik leuk vind:",
    punten: [
      "Hoe heet de film of serie?",
      "Waar gaat het over?",
      "Waarom moet iedereen hem zien?",
    ],
  },
  {
    id: "tekst-19",
    type: "vrije_tekst",
    titel: "Het weer in mijn land",
    situatie: "U schrijft voor de wijkkrant over het weer in het land waar u vandaan komt.",
    opdracht: "Schrijf minimaal drie zinnen. Schrijf in hele zinnen.",
    start: "Dit is mijn tekst over het weer in mijn land:",
    punten: [
      "Hoe is het weer daar in de zomer?",
      "Hoe is het weer in de winter?",
      "Wat vindt u prettiger: het weer hier of daar?",
    ],
  },
  {
    id: "tekst-20",
    type: "vrije_tekst",
    titel: "Mijn telefoon",
    situatie: "U schrijft voor de wijkkrant over uw telefoon.",
    opdracht: "Schrijf minimaal drie zinnen. Schrijf in hele zinnen.",
    start: "Dit is mijn tekst over mijn telefoon:",
    punten: [
      "Waarvoor gebruikt u uw telefoon?",
      "Hoeveel uur per dag kijkt u op uw telefoon?",
      "Wat zou u doen zonder telefoon?",
    ],
  },

  // ── Briefjes en berichten (vervolg) ────────────────────────────────
  {
    id: "bericht-09",
    type: "bericht",
    titel: "Briefje voor de hondoppas",
    situatie:
      "U gaat een dag weg. Uw buurjongen Tim past op uw hond.",
    opdracht: "Schrijf een briefje voor Tim met drie dingen.",
    aanhef: "Hoi Tim,",
    afsluiting: "Dank je wel!",
    punten: [
      "De hond twee keer eten geven: om 8.00 en om 18.00 uur",
      "Twee keer met hem wandelen in het park",
      "De deur goed sluiten als hij weggaat",
    ],
  },
  {
    id: "bericht-10",
    type: "bericht",
    titel: "Bericht aan de leraar",
    situatie:
      "Uw zoon komt morgen te laat op school. Hij moet eerst naar de tandarts.",
    opdracht: "Schrijf een bericht aan de leraar van uw zoon. Vertel drie dingen.",
    aanhef: "Beste juf Marijke,",
    afsluiting: "Met vriendelijke groet,",
    punten: [
      "Mijn zoon komt morgen ongeveer een uur te laat",
      "Hij moet eerst naar de tandarts",
      "Ik breng hem zelf naar school",
    ],
  },
  {
    id: "bericht-11",
    type: "bericht",
    titel: "Briefje voor de nieuwe collega",
    situatie:
      "Er komt een nieuwe collega, Daan. U bent er niet als hij begint. U laat een briefje achter.",
    opdracht: "Schrijf een briefje voor Daan met drie dingen die hij moet weten.",
    aanhef: "Hallo Daan,",
    afsluiting: "Tot morgen!",
    punten: [
      "De koffieautomaat staat in de keuken op de tweede verdieping",
      "De sleutel van het magazijn hangt bij de receptie",
      "Om 12.30 uur is er lunch met het team",
    ],
  },
  {
    id: "bericht-12",
    type: "bericht",
    titel: "Briefje voor de oppas: medicijnen",
    situatie:
      "Uw dochter is ziek. De oppas komt vanavond. U laat een briefje achter over de medicijnen.",
    opdracht: "Schrijf een briefje voor de oppas met drie dingen.",
    aanhef: "Hallo Sanne,",
    afsluiting: "Bel me als er iets is!",
    punten: [
      "Om 18.00 uur een pil tegen de koorts",
      "Om 21.00 uur de siroop, twee lepels",
      "Als de koorts boven 39 graden komt, bel de huisarts",
    ],
  },
  {
    id: "bericht-13",
    type: "bericht",
    titel: "Bericht aan de monteur",
    situatie:
      "Er komt vandaag een monteur voor de wasmachine. U moet naar uw werk.",
    opdracht: "Schrijf een bericht aan de monteur. Vertel drie dingen.",
    aanhef: "Beste monteur,",
    afsluiting: "Met vriendelijke groet,",
    punten: [
      "De voordeur is open, de sleutel ligt onder de mat",
      "De wasmachine staat in de badkamer",
      "U bent om 17.00 uur weer thuis",
    ],
  },
  {
    id: "bericht-14",
    type: "bericht",
    titel: "Briefje voor de buurman",
    situatie:
      "U bent niet thuis als er een pakketje komt. De buurman kan het aannemen.",
    opdracht: "Schrijf een briefje voor de buurman van nummer 22. Vertel drie dingen.",
    aanhef: "Hallo buurman,",
    afsluiting: "Alvast bedankt!",
    punten: [
      "Er komt vandaag een pakketje voor mij",
      "Wilt u het pakketje aannemen?",
      "Ik kom het vanavond om 19.00 uur ophalen",
    ],
  },
  {
    id: "bericht-15",
    type: "bericht",
    titel: "Bericht aan de schoonmaker",
    situatie:
      "De schoonmaker komt morgen. U wilt dat hij met de keuken begint.",
    opdracht: "Schrijf een bericht aan de schoonmaker. Vertel drie dingen.",
    aanhef: "Hallo,",
    afsluiting: "Dank je wel!",
    punten: [
      "Begin met de keuken, die is erg vies",
      "De sleutel ligt bij de receptie",
      "De prullenbakken moeten ook leeggemaakt worden",
    ],
  },
  {
    id: "bericht-16",
    type: "bericht",
    titel: "De verwarming doet het niet",
    situatie:
      "De verwarming werkt niet goed. U gaat weg en laat een briefje voor uw huisgenoot achter.",
    opdracht: "Schrijf een briefje voor uw huisgenoot Sam. Vertel drie dingen.",
    aanhef: "Hoi Sam,",
    afsluiting: "Tot vanavond!",
    punten: [
      "De verwarming in de woonkamer doet het niet",
      "Bel de verhuurder als het koud blijft",
      "De afwas moet nog gedaan worden",
    ],
  },
  {
    id: "bericht-17",
    type: "bericht",
    titel: "Bericht aan de verhuurder",
    situatie:
      "De cv-ketel maakt een hard geluid. U mailt de verhuurder.",
    opdracht: "Schrijf een bericht aan de verhuurder. Vertel drie dingen.",
    aanhef: "Beste meneer De Boer,",
    afsluiting: "Met vriendelijke groet,",
    punten: [
      "De cv-ketel maakt sinds gisteren een hard geluid",
      "Het huis wordt niet warm",
      "Vraag of er snel een monteur kan komen",
    ],
  },
  {
    id: "bericht-18",
    type: "bericht",
    titel: "Briefje voor de kattenoppas",
    situatie:
      "U gaat een week weg. Uw nicht past op de kat.",
    opdracht: "Schrijf een briefje voor uw nicht Nora met drie dingen.",
    aanhef: "Lieve Nora,",
    afsluiting: "Tot volgende week!",
    punten: [
      "De kat krijgt twee keer per dag eten",
      "De kattenbak moet om de dag schoon",
      "De kat mag niet naar buiten",
    ],
  },
  {
    id: "bericht-19",
    type: "bericht",
    titel: "Bezoekers en post doorgeven",
    situatie:
      "U gaat vandaag eerder weg. Er komen nog twee bezoekers en er is een telefoontje geweest.",
    opdracht: "Schrijf een bericht voor uw collega bij de receptie. Vertel drie dingen.",
    aanhef: "Hoi Karin,",
    afsluiting: "Tot morgen!",
    punten: [
      "Mevrouw Jansen komt om 15.00 uur voor meneer Bakker",
      "Meneer Smit heeft gebeld over de factuur",
      "De post moet om 16.00 uur weg",
    ],
  },
  {
    id: "bericht-20",
    type: "bericht",
    titel: "Briefje voor uw collega",
    situatie:
      "U moet eerder weg van uw werk. Er moeten nog drie dingen gebeuren.",
    opdracht: "Schrijf een briefje voor uw collega Youssef. Vertel drie dingen.",
    aanhef: "Hoi Youssef,",
    afsluiting: "Bedankt!",
    punten: [
      "De bestelling bij de bakker ophalen om 16.00 uur",
      "De tafels buiten naar binnen halen als het gaat regenen",
      "De winkel om 18.00 uur afsluiten",
    ],
  },
];

/*
 * Eén vast, moeilijker examen in de vorm van de officiële oefenexamens:
 * één formulier plus drie teksten, 40 minuten, 37 punten. De opdrachten
 * vragen meer zelf te bedenken en hebben vier punten in plaats van drie.
 */
const VASTE_EXAMENS = [
  {
    id: "examen-4-moeilijk",
    naam: "Oefenexamen 4 · moeilijk",
    uitleg:
      "Zelfde vorm als de drie officiële oefenexamens, maar met meer punten per opdracht en meer gegevens die u zelf moet bedenken.",
    taken: [
      {
        id: "form-21",
        type: "formulier",
        titel: "Aanmelden bij de sportschool",
        situatie:
          "U wilt gaan sporten bij sportschool Fit & Vrij in uw stad. U vult het aanmeldformulier in.",
        opdracht: "Vul het formulier in. Sommige gegevens moet u zelf bedenken.",
        velden: [
          { label: "Voornaam", soort: "tekst" },
          { label: "Achternaam", soort: "tekst" },
          { label: "Geboortedatum", hint: "bijv. 14-03-1991", soort: "tekst" },
          { label: "Adres en huisnummer", soort: "tekst" },
          { label: "Postcode en woonplaats", hint: "bijv. 3512 AB Utrecht", soort: "tekst" },
          { label: "Telefoonnummer", soort: "tekst" },
          { label: "E-mailadres", soort: "tekst" },
          {
            label: "Welk abonnement wilt u?",
            soort: "keuze",
            opties: [
              "1 keer per week: € 24,50 per maand",
              "2 keer per week: € 39,50 per maand",
              "Onbeperkt sporten: € 54,50 per maand",
            ],
          },
          { label: "Op welke dagen en tijden kunt u sporten?", soort: "lang" },
          { label: "Wat wilt u bereiken met sporten? Vertel ook hoe vaak u nu sport.", soort: "lang" },
          {
            label: "Hoe wilt u betalen?",
            soort: "keuze",
            opties: ["Per maand", "Per kwartaal", "Per jaar"],
          },
          {
            label: "Heeft u nog vragen? Schrijf in hele zinnen.",
            hint: "bijv. Nee, ik heb geen vragen.",
            soort: "lang",
          },
        ],
        punten: [],
      },
      {
        id: "mail-21",
        type: "correspondentie",
        titel: "Twee keer betaald",
        situatie:
          "U hebt vorige maand de jaarrekening van uw energiebedrijf gekregen. Op uw bank ziet u dat u het bedrag twee keer hebt betaald. U schrijft een e-mail aan het energiebedrijf.",
        opdracht: "Schrijf de e-mail. Schrijf in hele zinnen.",
        email: {
          aan: "klantenservice@energiedirect.nl",
          onderwerp: "Twee keer betaald, klantnummer 48 21 76",
          aanhef: "Beste meneer/mevrouw,",
          afsluiting: "Met vriendelijke groet,",
        },
        punten: [
          "Schrijf wanneer u betaalde en welk bedrag u twee keer betaalde (bedenk zelf de datum en het bedrag)",
          "Leg uit wat er volgens u fout is gegaan",
          "Zeg wat u wilt: het te veel betaalde bedrag terug op uw rekening",
          "Vraag binnen hoeveel dagen u antwoord krijgt",
        ],
      },
      {
        id: "tekst-21",
        type: "vrije_tekst",
        titel: "Het verkeer in onze straat",
        situatie:
          "U krijgt elke week een wijkkrant. Iedereen uit de buurt mag iets voor deze krant schrijven. U schrijft over het verkeer in uw straat.",
        opdracht: "Schrijf minimaal drie zinnen. Schrijf in hele zinnen.",
        start: "Dit is mijn tekst over het verkeer in mijn straat:",
        punten: [
          "Wat is het probleem in uw straat?",
          "Wanneer en hoe vaak is het probleem erg?",
          "Wat moet de gemeente doen?",
          "Wat doet u zelf al om het probleem kleiner te maken?",
        ],
      },
      {
        id: "bericht-21",
        type: "bericht",
        titel: "De loodgieter komt",
        situatie:
          "Morgen komt er een loodgieter bij u thuis om de keuken te maken. U moet werken en bent pas om zeven uur thuis. Uw buurman Joost heeft geen sleutel. U schrijft een briefje voor hem.",
        opdracht: "Schrijf een briefje voor uw buurman Joost. Vertel vier dingen.",
        aanhef: "Hallo Joost,",
        afsluiting: "Groetjes,",
        punten: [
          "Hoe laat de loodgieter komt (bedenk zelf een tijd)",
          "Waar de sleutel ligt (bedenk zelf een plek)",
          "Dat hij de loodgieter binnenlaat en naar de keuken brengt",
          "Dat hij de deur op slot doet als de loodgieter weg is en de sleutel teruglegt waar hij lag",
        ],
      },
    ],
  },
];

TAKEN.push(...VASTE_EXAMENS[0].taken);

/* Hulpfuncties die zowel de site als de zelftest gebruiken. */
function eisenVoor(taak) {
  const inhoudelijk = taak.type === "formulier" ? [] : taak.punten;
  return [...inhoudelijk, ...STRUCTUUR_EISEN[taak.type]];
}

function profielVoor(taak) {
  return RUBRIEK[TYPES[taak.type].profiel];
}

/* Spelling heeft per profiel een andere tekst; de rest is gedeeld. */
function scoresVoor(id, taak) {
  const criterium = CRITERIA[id];
  return criterium.scores_per_profiel?.[TYPES[taak.type].profiel] || criterium.scores;
}

function maxPunten(taak) {
  return profielVoor(taak).max;
}

if (typeof module !== "undefined") {
  module.exports = {
    TYPES,
    CRITERIA,
    A2_BASELINE,
    RUBRIEK,
    STRUCTUUR_EISEN,
    EXAM_BLUEPRINT,
    VASTE_EXAMENS,
    TAKEN,
    eisenVoor,
    profielVoor,
    scoresVoor,
    maxPunten,
  };
}
